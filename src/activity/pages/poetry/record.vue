<template>
    <view class="record-page">
        <view class="record-page-init">
            <view class="page-top-wrap">
                <view class="other-users">
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
                >
                    本诗更多作品
                </view>
            </view>
            <view class="title">
                {{ detail.title }}
            </view>
            <view class="dynasty">
                {{ detail.dynasty }}/{{ detail.author }}
            </view>
            <scroll-view
                :scroll-top="scrollTop"
                :scroll-y="scrollY"
                style="height: 400px"
                :style="mystyle"
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
            <!-- <view
                class="more-content"
                @click="checkMore"
            >
                上滑查看更多
            </view> -->
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
        <view class="cover">
            <image
                :src="
                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-${bgIndex}.png`
                "
            />
        </view>
        <view class="page-btm">
            <view class="control">
                <view class="walk-way">
                    <view class="wark-bar" />
                </view>
                <image
                    class="btn"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-dot.png"
                />
            </view>
            <view class="time">
                {{ intIntervalTime }}/10:00
            </view>
            <view class="music">
                <view class="m-title">
                    {{ selBgTitle }}
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
            </view>
            <view class="btns-wrap">
                <view
                    class="item"
                    @click="onConfirmDelete"
                >
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
    </view>
</template>
<script>
/* eslint-disable */
import config from "../../../common/config";
import utils from "../../../common/utils";
import api from "../../../common/api";

const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const innerAudioContextBg = uni.createInnerAudioContext();

// innerAudioContext.autoplay = true;
innerAudioContext.volume = 0.8;
innerAudioContextBg.volume = 0.3;

export default {
    data() {
        // const recorderManager = wx.getRecorderManager();
        // const innerAudioContext = wx.createInnerAudioContext();
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            voicePath: "",
            intervalTime: 0,
            timer: null,
            timer2: null,
            timer3: null,
            bgSrc:
                "https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3",
            audio: null,
            volBg: 0.5,
            volManage: 0.8,
            options: null,
            imgAuthBtn: false,
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
            recordStatus: 0,
            playStatus: 0,
            centerTxt: "录音",
            unPlayStatus: -2,
            isStartRecord: 0,
            fileSize: 0,
            id: 0,
            barrier: 0,
            bgId: 0,
            bgIndex: Math.floor(Math.random() * 5),
            selBgTitle: ""
        };
    },
    computed: {
        intIntervalTime() {
            // 用于显示整数的秒数
            return Math.round(this.intervalTime);
        },
        mystyle() {
            return {
                height: this.scrollH + "px"
            };
        }
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                const pix = res.screenWidth / 750;
                that.scrollH = res.windowHeight - 680 * pix;
            },
            fail() {}
        });
    },
    onLoad({ id, status, test, barrier }) {
        // test做了几次测试题，默认为0；
        // barrier 已经闯关的关数；
        // status活动的状态
        // id 录制的关卡。
        console.log(id, status, test, barrier);
        this.barrier = Number(barrier) || 0;
        this.id = Number(id) || 1;
        this.activityStatus = Number(status);

        const self = this;

        innerAudioContextBg.src = this.bgSrc;

        recorderManager.onStop(res => {
            console.log(`recorder stop${JSON.stringify(res)}`);
            self.voicePath = res.tempFilePath;
            self.fileSize = res.fileSize;
            innerAudioContext.src = this.voicePath;
        });
        innerAudioContext.onEnded(() => {
            self.unPlayStatus = -1;
            innerAudioContextBg.pause();
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
        this.getInfos(id);
        console.log("loading----");
    },
    onUnload() {
        innerAudioContext.destroy();
        innerAudioContextBg.destroy();
        clearTimeout(this.timer2);
        clearInterval(this.timer);
        clearTimeout(this.timer3);
    },
    onShow() {
        this.bgId = this.$store.getters.getBgMusic || -1;
        this.getbgList();
    },
    onBackPress(options) {
        this.options = options;
    },
    methods: {
        clickCenter() {
            if (this.isRecordPage) {
                if (this.recordStatus) {
                    // 录音中，则暂停
                    this.centerTxt = "继续";
                    this.recordStatus = 0;
                    this.stopRecord();
                } else {
                    // 未开始录音，进行录音
                    // 继续录音的状态 ，进行录音
                    this.recordStatus = 1;
                    this.centerTxt = "录音";
                    if (!this.isStartRecord) {
                        this.startRecord();
                    } else {
                        this.resumeRecord();
                    }
                    this.isStartRecord = 1;
                }
            } else {
                // 没有播放的状态。使用同一个图标，显示不同的文本。

                // unPlayStatus ：-2 从未播放 -1 已经结束播放  0 暂停播放
                if (this.playStatus) {
                    // 正在播放着，则暂停播放，根据状态显示重听
                    this.playStatus = 0;
                    if (this.unPlayStatus === -2) {
                        this.centerTxt = "试听";
                    } else if (this.unPlayStatus === -1) {
                        this.centerTxt = "重听";
                    } else {
                        this.centerTxt = "继续";
                    }
                    this.pauseAll();
                } else {
                    // 已经暂停，则继续播放。
                    this.centerTxt = "暂停";
                    this.playStatus = 1;
                    this.unPlayStatus = 0; // 不在是-2；
                    this.palyAll();
                }
            }
        },
        next() {
            console.log(this.isRecordPage, "next--");
            if (this.isRecordPage) {
                this.isRecordPage = 0;
                this.endRecord();
            } else {
                if (this.playStatus) {
                    this.stopAll();
                }
                // 进行测试题的条件
                if (this.id === this.barrier + 1 && this.activityStatus === 2) {
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
                } else {
                    // 出现海报的情况
                    // 1.已经结束了
                    uni.showToast({
                        icon: "none",
                        title: "已经做过测试题了",
                        duration: 3000
                    });
                    this.timer3 = setTimeout(() => {
                        uni.navigateTo({
                            url: `/activity/pages/poetry/clearance?id=${this.id}`
                        });
                    }, 3000);
                }
                // this.$store.commit('setTestData', {
                //     barrier: this.id,
                //     ...this.detail,
                // });
                // uni.navigateTo({
                //     url: '/activity/pages/poetry/test',
                // })
            }
        },
        checkMore() {
            console.log("checkMore----");
            this.scrollY = true;
        },
        upper() {
            // this.scrollY = false;
        },
        lower() {},
        getInfos(id) {
            uni.showLoading();
            api.post("/api/poem/barrierpoem", {
                barrier: id
            }).then(res => {
                const content = res.content.split(/[\r\n]/);
                const annotate = res.annotate.split(/[\r\n]/);
                this.detail = { ...res, content, annotate };
                uni.hideLoading();
            });
        },
        onConfirmDelete() {
            uni.showModal({
                title: "提示",
                content: "确定要放弃已经录制的作品重新录制吗",
                confirmText: "确定",
                cancelText: "取消",
                cancelColor: "#999999",
                confirmColor: "#1166FF",
                success: res => {
                    if (res.confirm) {
                        this.isRecordPage = 1;
                        this.unPlayStatus = -2;
                        if (this.playStatus) {
                            this.stopAll();
                        }
                        if (this.isRecord) {
                            this.endRecord();
                        }
                        this.playStatus = 0;
                        this.voicePath = "";
                        this.centerTxt = "录音";
                        this.recordStatus = 0;
                        this.isStartRecord = 0;
                        this.reStartRecord();
                    } else if (res.cancel) {
                        console.log("用户点击取消");
                    }
                }
            });
        },
        reStartRecord() {
            this.voicePath = "";
            this.startRecord();
        },
        getSetting() {
            const that = this;
            uni.getSetting({
                success(res) {
                    if (res.authSetting["scope.record"]) {
                        that.imgAuthBtn = true;
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
                    that.imgAuthBtn = true;
                }
            });
        },
        setBgAudioVol(val) {
            innerAudioContextBg.volume = val;
        },
        setMainAudio(val) {
            innerAudioContext.volume = val;
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
            if (!this.imgAuthBtn) {
                this.setAuthStatus();
            } else {
                this.timer = setInterval(() => {
                    this.intervalTime += 0.5;
                    if (this.intervalTime >= 0.5 && !this.isRecord) {
                        console.log("开始录音");
                        this.isRecord = true;
                        this.intervalTime = 0;
                        recorderManager.start({
                            format: "mp3"
                        });
                    }
                }, 500);
            }
        },
        stopRecord() {
            console.log("停止");
            recorderManager.pause();
        },
        resumeRecord() {
            console.log("继续");
            recorderManager.resume();
        },
        playVoice() {
            console.log("播放录音");
            if (this.voicePath) {
                innerAudioContext.src = this.voicePath;
                innerAudioContext.play();
            }
            console.log(this.voicePath, 111111111);
        },
        endRecord() {
            if (this.intervalTime <= 0.5) {
                console.log("录音太短了!!!");
            }

            clearInterval(this.timer);

            if (this.isRecord) {
                setTimeout(() => {
                    recorderManager.stop();

                    this.isRecord = false;

                    console.log(this.isRecord);
                }, 500); // 延迟小段时间停止录音, 更好的体验
            }
        },
        uploadFile(tempFilePath, fileSize) {
            this.tempFilePath = tempFilePath;
            let suffix;
            try {
                suffix = tempFilePath.split(".").pop();
                // eslint-disable-next-line no-empty
            } catch {}
            console.log(1111, tempFilePath);

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
                    console.log(this.bgId, "hhhh");
                    if (this.bgId === -1) {
                        const index = Math.floor(
                            Math.random() * (list.length - 1)
                        );
                        this.bgId = list[index].id;
                        this.selBgTitle = list[index].title;
                    } else {
                        list.forEach((d, index) => {
                            if (d.id === this.bgId) {
                                this.selBgTitle = d.title;
                            }
                        });
                    }
                }
            });
        },
        moreMusic() {
            this.$store.commit("setBgmusic", this.bgId);
            uni.navigateTo({
                url: `/activity/pages/poetry/bgmusic`
            });
        }
    }
};
</script>
<style lang="less" scoped>
.record-page {
    background: linear-gradient(#fefdf9, #c3efe4);
    height: 100vh;
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
            padding: 0 118upx;
            .left {
                text-align: left;
                text-indent: 20upx;
            }
        }
    }

    .more-content {
        text-align: center;
        padding: 20upx;
        color: #cda972;
        font-size: 20upx;
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
                left: 170upx;
            }
            .walk-way {
                width: 624upx;
                height: 8upx;
                position: relative;
                top: 30upx;
                left: 30upx;
                background: #43a294;
                box-shadow: 0 2upx 6upx 0 rgba(0, 0, 0, 0.4) inset;
                border-radius: 8upx;
                .wark-bar {
                    position: absolute;
                    left: 0;
                    width: 200upx;
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
