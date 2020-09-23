<template>
    <view class="record-page">
        <view class="record-page-init">
            <view class="page-top-wrap">
                <view
                    class="other-users"
                    :class="{ short: detail.avatars.length === 1 }"
                >
                    <view
                        v-for="(item, index) in detail.avatars"
                        :key="index"
                        class="item"
                        :class="{ one: !index }"
                    >
                        <image :src="item || '/static/images/uc/avatar.png'" />
                    </view>
                    <view
                        v-if="detail.avatars.length"
                        class="item three"
                    >
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/more-user.png"
                        />
                    </view>
                </view>
                <view
                    v-if="detail.avatars.length"
                    class="more-work"
                    @click="bindconfirm"
                >
                    本诗更多作品
                </view>
            </view>
            <view class="title">
                {{ detail.title }}
            </view>
            <view class="dynasty">
                {{ detail.dynasty }}
                <template v-if="detail.author">
                    /
                </template>
                {{ detail.author }}
            </view>
            <scroll-view
                :scroll-top="scrollTop"
                :scroll-y="scrollY"
                :style="{ height: scrollH + 'px' }"
                class="scroll-Y"
                @scrolltoupper="upper"
                @scrolltolower="lower"
            >
                <view class="content">
                    <view
                        v-for="(txt, index) in detail.content"
                        :key="index"
                        :class="{ left: detail.display_type === 1 }"
                    >
                        {{ txt }}
                    </view>
                </view>
            </scroll-view>
            <view
                class="more-content"
                @click="checkMore"
            >
                上滑查看更多
            </view>
            <view class="zhusi">
                <view
                    v-for="(txt, index) in detail.annotate"
                    :key="index"
                >
                    <template v-if="!index">
                        注释：
                    </template>
                    {{ txt }}
                </view>
            </view>
        </view>
        <view
            class="cover"
            :class="{ btm: isPreview }"
        >
            <image
                :src="
                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-${bgImgIndex}.png`
                "
            />
        </view>
        <view
            class="page-btm"
            :class="{ hide: isPreview }"
        >
            <!--鉴于slider的style在小程序模拟器难以改变，使用slider覆盖的方式做控制条-->
            <view class="control">
                <slider
                    :value="slideValue"
                    min="0"
                    :max="maxVal"
                    :disabled="sliderDisabled"
                    active-color="#B5FFF5"
                    background-color="#277d73"
                    block-color="#54afa9"
                    block-size="30"
                    class="unseable-slider"
                    @change="sliderChange"
                    @changing="sliderChangeing"
                />
            </view>
            <view class="time">
                {{ curTime }}/{{ recordDuration }}
            </view>
            <view class="music">
                <template v-if="!isRecordPage">
                    <view class="m-title">
                        {{ selBg.title }}
                    </view>
                    <view
                        class="m-more"
                        @click="moreMusic"
                    >
                        <view>
                            切换背景音乐
                        </view>
                        <image
                            class="to-more"
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/record-more.png"
                        />
                    </view>
                </template>
            </view>
            <view class="btns-wrap">
                <view
                    class="item"
                    :class="{ hide: !recordInit }"
                    @click="onConfirmDelete"
                >
                    <template />
                    <image
                        class="icon"
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-clear.png`
                        "
                    />
                    <view class="txt">
                        重录
                    </view>
                </view>
                <view
                    class="item"
                    @click="clickCenter"
                >
                    <image
                        v-if="isRecordPage"
                        class="center-icon"
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-record-${
                                !recordStatus ? 'bg' : '0'
                            }.png`
                        "
                    />
                    <image
                        v-else
                        class="center-icon plays"
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-${
                                playStatus ? 'pause' : 'play'
                            }.png`
                        "
                    />
                    <image
                        v-if="!recordStatus && isRecordPage"
                        class="voice"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-voice.png"
                    />
                    <view
                        class="center"
                        :class="{ plays: !isRecordPage }"
                    >
                        {{ centerTxt }}
                    </view>
                </view>
                <view
                    class="item"
                    :class="{ hide: !recordInit }"
                    @click="next"
                >
                    <image
                        class="icon"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-done.png"
                    />
                    <view class="txt">
                        {{ isRecordPage ? "完成" : "提交" }}
                    </view>
                </view>
            </view>
        </view>
        <model
            :show="show"
            :test-status="testStatus"
            :model-txt3="modelTxt3"
            :model-txt1="modelTxt1"
            :level="barrierInfo.level"
            :cur-num="curNum"
        />
    </view>
</template>
<script>
/* eslint-disable */
import config from "../../../common/config";
import utils from "../../../common/utils";
import api from "../../../common/api";
import model from "./testmodel.vue";
import share from "../common/shareMinxin";

const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const innerAudioContextBg = uni.createInnerAudioContext();

// innerAudioContext.autoplay = true;
innerAudioContext.volume = 1;
innerAudioContextBg.volume = 0.6;

const padTime = function(val) {
    const str = "" + val;
    return str.length === 1 ? "0" + str : str;
};

export default {
    components: {
        model
    },
    mixins: [share.initShare],
    data() {
        return {
            activityId: 14,
            // #ifdef H5
            isH5: true,
            // #endif
            voicePath: "",
            intervalTime: 0,
            timer: null,
            timer2: null,
            timer3: null,
            numTimer: null,
            authStatus: false,
            activityStatus: 2,
            scrollH: 0,
            scrollY: true,
            scrollTop: 0,
            detail: {
                annotate: "",
                author: "",
                content: "",
                cover_img: "",
                display_type: 1,
                dynasty: "",
                poem_id: 0,
                question: {},
                title: "",
                avatars: []
            },
            isRecordPage: 1,
            // 0 暂停 1 正在录音
            recordStatus: 0,
            playStatus: 0,
            centerTxt: "录音",
            unPlayStatus: -2,
            isStartRecord: 0,
            fileSize: 0,
            id: 0,
            barrier: 0,
            bgId: 1,
            bgImgIndex: Math.floor(Math.random() * 5),
            selBg: {
                title: ""
            },
            isTouchStart: false,
            recordInit: false,
            show: false,
            testStatus: 3,
            curNum: 3,
            modelTxt3: "下一关",
            modelTxt1: "继续加油喔",
            barrierInfo: {
                level_title: "小诗童",
                level: 1,
                draw_num: null,
                barrier: 0
            },
            isPreview: false,
            pageWidth: 375,
            barWidth: 0,
            btnLeft: 0,
            controllWidth: 0,
            btnWidth: 0,
            recordDuration: "10:00",
            slideValue: 0,
            maxVal: 600,
            maxTime: 10 * 60,
            curTime: "00:00",
            sliderDisabled: true
        };
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                const pix = res.screenWidth / 750;
                that.scrollH = res.windowHeight - 760 * pix;
                that.controllWidth = 624 * pix;
                that.btnWidth = 68 * pix;
            },
            fail() {}
        });
    },
    onLoad({ title, annotate, content, display_type, dynasty, author }) {
        this.getRecordParams();
        const self = this;
        // innerAudioContextBg.src = this.bgSrc;
        if (title) {
            // 这里用作预览。
            console.log(this.detail, title, content, "before--preview.detail");
            this.isPreview = true;
            if (content) {
                content = content.split(/[\r\n]/);
            }
            if (annotate) {
                annotate = annotate.split(/[\r\n]/);
            }
            this.detail = {
                ...this.detail,
                title,
                display_type,
                dynasty,
                author,
                content,
                annotate
            };
            console.log(this.detail, title, content, "preview.detail");
        }

        recorderManager.onStop(res => {
            console.log(`recorder stop${JSON.stringify(res)}`);
            self.voicePath = res.tempFilePath;
            self.fileSize = res.fileSize;
            self.pauseUpdateTime();
            self.updateTotalTime();

            innerAudioContext.src = this.voicePath;
            if (!this.isRecord) {
                this.onStartRecord();
            }
        });
        innerAudioContext.onEnded(() => {
            self.unPlayStatus = -1;
            innerAudioContextBg.pause();
            self.onPausePlay();
        });
        innerAudioContextBg.onEnded(() => {
            // 背景音乐重复播放；
            if (!innerAudioContext.paused) {
                innerAudioContextBg.play();
            }
        });
        innerAudioContextBg.onWaiting(() => {
            uni.showLoading();
            // 一直加载不出来
            this.timer2 = setTimeout(() => {
                uni.hideLoading();
                if (innerAudioContextBg.paused) {
                    uni.showToast({
                        icon: "none",
                        title: "网络不流畅"
                    });
                }
            }, 30000);
        });
        innerAudioContextBg.onError(res => {
            uni.showToast({
                icon: "none",
                title: res.errMsg + res.errCode
            });
        });
        innerAudioContextBg.onCanplay(() => {
            console.log(innerAudioContextBg.duration, "duration, onCanplay");
            uni.hideLoading();
        });
        if (!this.isH5) {
            this.getSetting();
        }
    },
    onUnload() {
        // innerAudioContext.destroy();
        // innerAudioContextBg.destroy();
        this.stopAll();
        clearInterval(this.numTimer);
        clearTimeout(this.timer2);
        clearInterval(this.timer);
        clearTimeout(this.timer3);
        this.numTimer = null;
        this.timer2 = null;
        this.timer = null;
        this.timer3 = null;
    },
    onShow() {
        // 选择背景音乐，返回录制页面。
        this.bgId = this.$store.getters.getBgMusic || -1;
        console.log();
        // this.recordInit = false;
        console.log(this.isPreview, "isPreview");
        // if (!this.isPreview) {
        //     this.getbgList();
        //     this.getRecordParams();
        this.getbgList();
        this.getBarrierInfo();
        // }
        // // else {
        // //     this.setPriviewData();
        // // }
    },
    methods: {
        setPriviewData() {
            api.get().then(res => {});
        },
        getBarrierInfo() {
            // 闯关列表或者是测试题返回到录制页面需要重新获取
            // 录制页面到下一关的录制仅仅是重复关卡录制
            api.get("/api/poem/userinfo").then(res => {
                this.barrierInfo = { ...this.barrierInfo, ...res };
            });
        },
        getRecordParams() {
            let params = this.$store.getters.getRecordParam;
            console.log(params, "record params----");
            if (params) {
                this.resetPageData();
                this.barrier = params.barrier || 0;
                this.activityStatus = params.status;
                if (params.id !== this.id) {
                    this.id = params.id || 1;
                    // 获取诗词内容
                    this.getInfos(params.id);
                }
            }
        },
        touchstart(e) {
            console.log(e);
            this.isTouchStart = true;
        },
        touchmove() {},
        touchend() {},
        onStartRecord() {
            this.recordInit = true;
            this.recordStatus = 1;
            this.centerTxt = "录音";
            if (!this.isStartRecord) {
                this.startRecord();
            } else {
                this.resumeRecord();
            }
            this.isStartRecord = 1;
        },
        onPauseRecord() {
            // 录音中，则暂停
            this.centerTxt = "继续";
            this.recordStatus = 0;
            this.pauseRecord();
        },
        onPlay() {
            // 已经暂停，则继续播放。
            this.centerTxt = "暂停";
            this.playStatus = 1;
            this.unPlayStatus = 0; // 手动暂停的是0
            this.palyAll();
            this.updatePlayTime();
        },
        onPausePlay() {
            // 正在播放着，则暂停播放，根据状态显示重听
            this.playStatus = 0;
            if (this.unPlayStatus === -2) {
                this.centerTxt = "试听";
                this.sliderDisabled = false;
            } else if (this.unPlayStatus === -1) {
                this.centerTxt = "重听";
                this.sliderDisabled = false;
            } else {
                this.centerTxt = "继续";
                this.sliderDisabled = false;
            }
            this.pauseAll();
            this.pauseUpdateTime();
        },
        clickCenter() {
            if (!this.isH5) {
                if (this.isRecordPage) {
                    if (this.recordStatus === 1) {
                        this.onPauseRecord();
                    } else {
                        // 未开始录音，进行录音
                        // 无录音的状态 ，进行录音
                        if (!this.authStatus) {
                            this.setAuthStatus();
                        } else {
                            // 开始录音
                            this.onStartRecord();
                        }
                    }
                } else {
                    // 没有播放的状态。使用同一个图标，显示不同的文本。
                    // unPlayStatus ：-2 从未播放 -1 已经结束播放  0 暂停播放
                    if (this.playStatus) {
                        this.onPausePlay();
                    } else {
                        this.onPlay();
                    }
                }
            } else {
                uni.showToast({
                    icon: "none",
                    title: "请在微信小程序UP青少年爱挑战参与活动。",
                    duration: 5000
                });
            }
        },
        next() {
            // console.log(this.isRecordPage, "next--");
            if (this.recordInit && this.curTime > `00:10`) {
                if (this.isRecordPage) {
                    this.isRecordPage = 0;
                    this.endRecord();
                } else {
                    if (this.playStatus) {
                        this.stopAll();
                    }
                    // 进行测试题的条件
                    if (
                        this.id === this.barrier + 1 &&
                        this.activityStatus === 2
                    ) {
                        this.$store.commit("setTestData", {
                            barrier: this.id,
                            ...this.detail
                        });

                        this.uploadFile(this.voicePath, this.fileSize).then(
                            resp => {
                                api.post("/api/activity/add", {
                                    cat_id: 18,
                                    poem_id: this.detail.poem_id,
                                    resource_type: 3,
                                    play_url: resp.path,
                                    file_size: this.fileSize,
                                    activity_id: 14,
                                    resource_name: this.detail.title,
                                    introduce: "",
                                    type: 2,
                                    activity_cat: 1,
                                    bg_id: this.bgId
                                }).then(() => {
                                    uni.navigateTo({
                                        url: "/activity/pages/poetry/test"
                                    });
                                });
                            }
                        );
                    } else if (
                        this.id === this.barrier &&
                        this.activityStatus === 3
                    ) {
                        this.show = true;
                        this.modelTxt1 = "活动已结束，不可继续闯关";
                        this.modelTxt3 = "返回关卡列表";
                        this.setNumberTimer();
                    } else {
                        this.show = true;
                        this.modelTxt1 = `${this.barrierInfo.level_title}，请继续加油哦！`;
                        this.modelTxt3 = "下一关";
                        this.setNumberTimer("next");
                    }
                    // this.$store.commit('setTestData', {
                    //     barrier: this.id,
                    //     ...this.detail,
                    // });
                    // uni.navigateTo({
                    //     url: '/activity/pages/poetry/test',
                    // })
                }
            } else {
                uni.showToast({
                    icon: "none",
                    title: "录音时长未满10秒",
                    duration: 5000
                });
            }
        },
        setNumberTimer(next) {
            const that = this;
            this.numTimer = setInterval(() => {
                that.curNum -= 1;
                if (that.curNum === 0) {
                    clearInterval(that.numTimer);
                    that.numTimer = null;

                    if (next) {
                        // 下一关
                        this.$store.commit("setRecordParam", {
                            status: this.activityStatus,
                            id: this.id + 1,
                            barrier: this.barrierInfo.barrier
                        });
                        this.getRecordParams();
                    } else {
                        // 闯关列表
                        uni.navigateTo({
                            url: `/activity/pages/poetry/clearance?id=${this.id}`
                        });
                    }
                }
            }, 1000);
        },
        checkMore() {
            console.log("checkMore----");
            // this.scrollY = true;
        },
        upper() {
            // this.scrollY = false;
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/activity/pages/mywork/myWorkList?type=search&name=${this.detail.title}&activity_id=14`
            });
        },
        lower() {},
        getInfos(id) {
            uni.showLoading();
            uni.setNavigationBarTitle({ title: `第${id}关` });
            api.post("/api/poem/barrierpoem", {
                barrier: id
            }).then(res => {
                const content = res.content.split(/[\r\n]/);
                const annotate = res.annotate.split(/[\r\n]/);
                this.detail = { ...res, content, annotate };
                uni.hideLoading();
            });
        },
        resetPageData() {
            this.isRecordPage = 1;
            this.unPlayStatus = -2;
            if (this.playStatus) {
                // 正在播放的时候进行停止播放
                this.stopAll();
            }
            if (this.isRecord) {
                this.endRecord();
            }
            this.pauseUpdateTime();

            this.playStatus = 0;
            this.voicePath = "";
            this.centerTxt = "录音";
            this.recordStatus = 0;
            this.isStartRecord = 0;
            this.recordInit = false;
            this.intervalTime = 0;
            this.maxVal = 600;
            this.maxTime = 600;
            this.recordDuration = "10:00";
            this.slideValue = 0;
            this.curTime = "00:00";
        },
        onConfirmDelete() {
            if (this.recordInit) {
                uni.showModal({
                    title: "提示",
                    content: "确定要放弃已经录制的作品重新录制吗",
                    confirmText: "确定",
                    cancelText: "取消",
                    cancelColor: "#999999",
                    confirmColor: "#1166FF",
                    success: res => {
                        if (res.confirm) {
                            this.resetPageData();
                            this.onStartRecord();
                        } else if (res.cancel) {
                            console.log("用户点击取消");
                        }
                    }
                });
            }
        },
        getSetting() {
            const that = this;
            uni.getSetting({
                success(res) {
                    if (res.authSetting["scope.record"]) {
                        that.authStatus = true;
                    }
                    console.log(res.authSetting);
                }
            });
        },
        setAuthStatus() {
            const that = this;
            uni.authorize({
                scope: "scope.record",
                success() {
                    that.authStatus = true;
                }
            });
        },
        seekbg(val) {
            innerAudioContextBg.seek(val);
        },
        palyAll() {
            console.log("1", innerAudioContext.src, "2");
            innerAudioContext.play();
            innerAudioContextBg.play();
        },
        pauseAll() {
            console.log("pauseing");
            innerAudioContext.pause();
            innerAudioContextBg.pause();
        },
        stopAll() {
            innerAudioContext.stop();
            innerAudioContextBg.stop();
        },
        startRecord() {
            this.recordStatus = 1;
            console.log("开始录音");
            this.isRecord = true;
            this.recordStartAt = new Date() - 0;
            recorderManager.start({
                format: "mp3",
                duration: 600000
            });
            this.updateTime();
        },
        updatePlayTime() {
            // currentTime
            const seconds = innerAudioContext.currentTime;
            const minutes = padTime(Math.floor(seconds / 60));
            const second = padTime(Math.round(seconds % 60));
            console.log(innerAudioContext.duration);

            this.slideValue = 600 * (seconds / (10 * 60));
            this.curTime = `${minutes}:${second}`;

            this.tid = setTimeout(() => {
                this.updatePlayTime();
            }, 200);
        },
        updateTime() {
            const now = new Date() - 0;
            const duration = now - this.recordStartAt;
            const seconds = duration / 1000;
            const minutes = padTime(Math.floor(seconds / 60));
            const second = padTime(Math.round(seconds % 60));

            this.slideValue = 600 * (seconds / (10 * 60));
            this.curTime = `${minutes}:${second}`;

            this.tid = setTimeout(() => {
                this.updateTime();
            }, 200);
        },
        pauseUpdateTime() {
            clearTimeout(this.tid);
        },
        percentToTime(p) {
            const seconds = this.maxTime * p;
            const minutes = padTime(Math.floor(seconds / 60));
            const second = padTime(Math.round(seconds % 60));
            this.curTime = `${minutes}:${second}`;
        },
        updateTotalTime() {
            let duration;
            if (this.recordStatus === 1) {
                // 正在录音
                const now = new Date() - 0;
                duration = now - this.recordStartAt;
            } else {
                duration = this.lastDuration;
            }
            // console.log(this.recordStatus);

            const seconds = duration / 1000;
            const minutes = padTime(Math.floor(seconds / 60));
            const second = padTime(Math.round(seconds % 60));

            this.recordDuration = `${minutes}:${second}`;
            this.maxTime = seconds;
            this.maxVal = seconds;
        },
        pauseRecord() {
            this.pauseUpdateTime();
            this.lastDuration = new Date() - this.recordStartAt;
            // console.log("停止");
            recorderManager.pause();
        },
        resumeRecord() {
            this.recordStartAt = new Date() - this.lastDuration;
            this.updateTime();
            // console.log("继续");
            recorderManager.resume();
        },
        endRecord(maxDuration) {
            if (this.isRecord) {
                // console.log("stop recordddddd....");
                this.pauseUpdateTime();
                recorderManager.stop();
                this.isRecord = false;
                this.centerTxt = "试听";
            }
        },
        uploadFile(tempFilePath, fileSize) {
            this.tempFilePath = tempFilePath;
            let suffix;
            try {
                suffix = tempFilePath.split(".").pop();
                // eslint-disable-next-line no-empty
            } catch {}
            // console.log(1111, tempFilePath);

            uni.showToast({
                icon: "loading",
                title: "上传中",
                duration: 200000
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`,
                    filePath: tempFilePath,
                    name: "file",
                    formData: {
                        file_type: 3
                    },
                    header: {
                        userKey: utils.getToken()
                    },
                    success: uploadFileRes => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: "服务器开小差了~",
                                icon: "none"
                            });
                            uni.hideToast();
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            // success
                            uni.hideToast();
                            console.log(resp, "upload------");
                            resolve(resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: "none"
                            });
                            uni.hideToast();
                            return reject(resp.msg);
                        }
                        return false;
                    }
                });
            });
        },
        getbgList(title) {
            api.post("/api/poem/bglist", {
                page_size: 10,
                page_num: 1
            }).then(({ list }) => {
                if (list.length) {
                    if (this.bgId === -1) {
                        const index = Math.floor(
                            Math.random() * (list.length - 1)
                        );
                        this.bgId = list[index].id;
                        this.selBg = list[index];
                    } else {
                        list.forEach((d, index) => {
                            if (d.id === this.bgId) {
                                this.selBg = d;
                            }
                        });
                    }
                    innerAudioContextBg.src = this.selBg.play_url;
                }
            });
        },
        moreMusic() {
            this.$store.commit("setBgmusic", this.bgId);
            uni.navigateTo({
                url: `/activity/pages/poetry/bgmusic`
            });
        },
        sliderChange(e) {
            console.log(e.detail, this.slideValue, "stoped");
            this.percentToTime(this.slideValue / this.maxVal);
            this.slideValue = e.detail.value;
            // if is playing mode, seed play position
            const seconds = this.maxTime * (this.slideValue / this.maxVal);
            if (!this.isH5 && !this.isRecordPage) {
                innerAudioContext.seek(seconds);
                innerAudioContextBg.seek(seconds);
            }
            // let w = (this.slideValue * this.controllWidth) / 100;
            // this.barWidth = w;
            // this.btnLeft = w;
        },
        sliderChangeing(e) {
            this.slideValue = e.detail.value;
            // let w = (this.slideValue * this.controllWidth) / 100;
            // this.barWidth = w;
            // this.btnLeft = w;
        }
    }
};
</script>
<style lang="less" scoped>
.record-page {
    background: linear-gradient(#fefdf9, #c3efe4);
    height: 100vh;
    .unseable-slider {
        // opacity: 0;
        margin-top: 45upx;
    }
    .record-page-init {
        position: relative;
        z-index: 10;
    }
    .page-top-wrap {
        height: 98upx;
    }
    .other-users {
        width: 160upx;
        display: flex;
        text-align: right;
        margin-left: 568upx;
        &.short {
            margin-left: 624upx;
        }
        .item {
            width: 60upx;
            height: 60upx;
            border-radius: 50%;
            line-height: 60upx;
            text-align: center;
            margin-top: 10upx;
            image {
                width: 60upx;
                height: 60upx;
                border-radius: 50%;
            }
            &.one {
                margin-right: -10upx;
            }
            &.three {
                margin-left: -10upx;
            }
        }
    }
    .more-work {
        color: #43a294;
        line-height: 28upx;
        text-align: right;
        margin-top: 10upx;
        margin-right: 24upx;
    }
    .title {
        font-size: 40upx;
        line-height: 56upx;
        color: #222;
        text-align: center;
    }
    .dynasty {
        font-size: 32upx;
        line-height: 56upx;
        color: #888;
        text-align: center;
    }
    .scroll-Y {
        .content {
            word-break: break-all;
            font-size: 32upx;
            line-height: 44upx;
            text-align: center;
            padding: 16upx 116upx 0;
            color: #444;
            .left {
                text-align: left;
                text-indent: 20upx;
                margin-bottom: 40upx;
            }
        }
    }

    .more-content {
        text-align: center;
        color: #cda972;
        font-size: 20upx;
        height: 60upx;
        line-height: 80upx;
        padding-bottom: 20upx;
        position: relative;
        width: 120upx;
        box-sizing: content-box;
        margin: 0 auto;
        &::before,
        &::after {
            position: absolute;
            content: "";
            left: 48upx;
            width: 12upx;
            height: 12upx;
            border-top: 4upx solid #cda972;
            border-left: 4upx solid #cda972;
            transform: rotate(45deg);
            top: 4upx;
        }
        &::after {
            top: 14upx;
        }
    }
    .zhusi {
        color: #43a294;
        font-size: 24upx;
        line-height: 34upx;
        padding: 0 54upx;
    }
    .cover {
        position: fixed;
        bottom: 130upx;
        left: 0;
        width: 750upx;
        height: 598upx;
        &.btm {
            bottom: 0;
        }
        image {
            width: 100%;
            height: 100%;
        }
    }
    .page-btm {
        width: 100%;
        height: 364upx;
        position: fixed;
        bottom: 0;
        left: 0;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/recored-btm.png);
        background-size: cover;
        &.hide {
            display: none;
        }
        .control {
            margin: 30upx 0 0 30upx;
            width: 688upx;
            height: 68upx;
            border-radius: 48upx;
            position: relative;
            .btn {
                width: 68upx;
                height: 68upx;
                position: absolute;
                top: 0;
                left: 0;
            }
            .walk-way {
                width: 624upx;
                height: 8upx;
                position: absolute;
                top: 30upx;
                left: 30upx;
                right: 30upx;
                background: #43a294;
                box-shadow: 0 2upx 6upx 0 rgba(0, 0, 0, 0.4) inset;
                border-radius: 8upx;
                .wark-bar {
                    position: absolute;
                    left: 0;
                    width: 0;
                    height: 100%;
                    top: 0;
                    background: #b5fff5;
                    box-shadow: 0 2upx 6upx 0 rgba(0, 0, 0, 0.5) inset;
                    border-radius: 8upx;
                }
            }
        }
        .time {
            color: #2e796e;
            font-size: 24upx;
            text-align: right;
            line-height: 30upx;
            padding-right: 100upx;
        }
        .btns-wrap,
        .music {
            display: flex;
            justify-content: space-between;
        }
        .music {
            margin-bottom: 22upx;
            height: 40upx;
            font-size: 24upx;
            line-height: 40upx;
            padding: 0 50upx;
            margin-top: 8upx;
            .m-title {
                color: #004137;
            }
            .m-more {
                color: #47958a;
                display: flex;
                .to-more {
                    width: 80upx;
                    height: 80upx;
                    margin-top: -24upx;
                    margin-left: -10upx;
                }
            }
        }
        .btns-wrap {
            padding: 0 154upx;
            font-size: 20upx;
            color: #004137;
            .item {
                position: relative;
                text-align: center;
                &.hide {
                    opacity: 0;
                }
            }
            .icon {
                width: 140upx;
                height: 140upx;
            }
            .center-icon {
                width: 180upx;
                height: 180upx;
                margin-top: -20upx;
                &.plays {
                    width: 140upx;
                    height: 140upx;
                    margin-top: -4upx;
                }
            }
            .voice {
                position: absolute;
                width: 100upx;
                height: 100upx;
                left: 40upx;
                top: 20upx;
                animation: mymove 3s infinite;
            }
            @keyframes mymove {
                0% {
                    transform: scale(1);
                }
                25% {
                    transform: scale(1.1);
                }
                50% {
                    transform: scale(1);
                }
                75% {
                    transform: scale(1.1);
                }
            }
            .txt {
                margin-top: -20upx;
            }
            .center {
                margin-top: -40upx;
                &.plays {
                    margin-top: -16upx;
                }
            }
        }
    }
}
</style>
