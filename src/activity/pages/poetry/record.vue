<template>
    <view class="record-page">
        <view class="record-page-init">
            <view class="other-users">
                <view class="item">
                    1
                </view>
                <view class="item">
                    2
                </view>
                <view class="item">
                    ...
                </view>
            </view>
            <view class="more">
                本诗更多作品
            </view>
            <view class="title">
                {{ detail.title || "title" }}
            </view>
            <view class="dynasty">
                {{ detail.dynasty }}/{{ detail.author || "author" }}
            </view>
            <view
                class="content"
                :class="{ left: detail.display_type === 2 }"
            >
                <view
                    v-for="(txt, index) in detail.content"
                    :key="index"
                >
                    {{ txt }}
                </view>
            </view>
            <view class="zhusi" />
            <view class="cover">
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-1.png"
                />
            </view>
            <view class="page-btm" />
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';
// import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();
const innerAudioContextBg = uni.createInnerAudioContext();

innerAudioContext.autoplay = true;
innerAudioContext.volume = 0.8;
innerAudioContextBg.volume = 0.5;

export default {
    data() {
        // const recorderManager = wx.getRecorderManager();
        // const innerAudioContext = wx.createInnerAudioContext();
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            voicePath: '',
            intervalTime: 0,
            timer: null,
            timer2: null,
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            audio: null,
            volBg: 0.5,
            volManage: 0.8,
            options: null,
            imgAuthBtn: false,
            activityStatus: 2,
            btmH: 0,
            pix: 0.5,
            screenHeight: 667,
            detail: {
                annotate: '',
                author: '',
                content: '',
                cover_img: '',
                display_type: 1,
                dynasty: '',
                poem_id: 0,
                question: {},
                title: '',
            },
        };
    },
    computed: {
        intIntervalTime() {
            // 用于显示整数的秒数
            return Math.round(this.intervalTime);
        },
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                that.pix = res.screenWidth / 750;
                that.screenHeight = res.windowHeight;
                that.btmH = 182 * that.pix;
            },
            fail() {},
        });
    },
    onLoad({
        id, status, test, barrier,
    }) {
        // test做了几次测试题，默认为0；
        // barrier 已经闯关的关数；
        // status活动的状态
        // id 录制的关卡。
        console.log(id, status, test, barrier);

        const self = this;
        innerAudioContextBg.src = this.bgSrc;

        recorderManager.onStop((res) => {
            console.log(`recorder stop${JSON.stringify(res)}`);
            self.voicePath = res.tempFilePath;
        });
        innerAudioContext.onEnded(() => {
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
                        icon: 'none',
                        title: '网络不流畅',
                    });
                }
            }, 30000);
        });
        innerAudioContextBg.onError((res) => {
            uni.showToast({
                icon: 'none',
                title: res.errMsg + res.errCode,
            });
        });
        innerAudioContextBg.onCanplay(() => {
            console.log(innerAudioContextBg.duration, 'duration, onCanplay');
            uni.hideLoading();
        });
        if (!this.isH5) {
            this.getSetting();
        }
        this.getInfos(id);
        this.activityStatus = Number(status);
    },
    onUnload() {
        innerAudioContext.destroy();
        innerAudioContextBg.destroy();
        clearTimeout(this.timer2);
        clearInterval(this.timer);
        uni.navigateBack();
    },
    onBackPress(options) {
        this.options = options;
    },
    methods: {
        getInfos(id) {
            api.post('/api/poem/barrierpoem', {
                barrier: id,
            }).then((res) => {
                const content = res.content.split(/[\r\n]/);
                this.detail = { ...res, content };
            });
        },
        sliderChange(e) {
            console.log(e.detail.value, 'detail----val----');
        },
        onConfirmDelete() {
            uni.showModal({
                title: '提示',
                content: '确定要放弃已经录制的作品重新录制吗',
                confirmText: '确定',
                cancelText: '取消',
                cancelColor: '#999999',
                confirmColor: '#1166FF',
                success: (res) => {
                    if (res.confirm) {
                        this.reStartRecord();
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                },
            });
        },
        reStartRecord() {
            this.voicePath = '';
            this.startRecord();
        },
        getSetting() {
            const that = this;
            uni.getSetting({
                success(res) {
                    if (res.authSetting['scope.record']) {
                        that.imgAuthBtn = true;
                    }
                    console.log(res.authSetting);
                },
            });
        },
        setAuthStatus() {
            const that = this;
            uni.authorize({
                scope: 'scope.record',
                success() {
                    that.imgAuthBtn = true;
                },
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
        palyBg() {
            innerAudioContextBg.play();
            console.log(innerAudioContextBg.duration, 'duration, palyBg');
        },
        pauseBg() {
            innerAudioContextBg.pause();
        },
        palyAll() {
            console.log(
                innerAudioContextBg.volume,
                '1',
                innerAudioContext.volume,
                '2',
            );

            innerAudioContext.play();
            innerAudioContextBg.play();
        },
        pauseAll() {
            innerAudioContext.pause();
            innerAudioContextBg.pause();
        },
        startRecord() {
            if (!this.imgAuthBtn) {
                this.setAuthStatus();
            } else {
                this.timer = setInterval(() => {
                    this.intervalTime += 0.5;
                    if (this.intervalTime >= 0.5 && !this.isRecord) {
                        console.log('开始录音');
                        this.isRecord = true;
                        this.intervalTime = 0;
                        recorderManager.start({
                            format: 'mp3',
                        });
                    }
                }, 500);
            }
        },
        stopRecord() {
            console.log('停止');
            recorderManager.pause();
        },
        resumeRecord() {
            console.log('继续');
            recorderManager.resume();
        },
        playVoice() {
            console.log('播放录音');
            if (this.voicePath) {
                innerAudioContext.src = this.voicePath;
                innerAudioContext.play();
            }
            console.log(this.voicePath, 111111111);
        },
        endRecord() {
            if (this.intervalTime <= 0.5) {
                console.log('录音太短了!!!');
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
    },
};
</script>
<style lang="less" scoped>
.record-page {
    background: linear-gradient(#fefdf9, #c3efe4);
    height: 100vh;

    // .record-page-init {
    //     background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-1.png);
    //     height: 100vh;
    //     background-repeat: no-repeat;
    //     background-size: contain;
    //     background-position-y: 40%;
    // }
    .other-users {
        width: 160upx;
        display: flex;
        text-align: right;
        margin-left: 568upx;
        .item {
            width: 60upx;
            height: 60upx;
            border-radius: 50%;
            border: 1px solid #eee;
            line-height: 60upx;
            text-align: center;
            margin-top: 10upx;
        }
    }
    .more {
        color: #43a294;
        line-height: 28upx;
        text-align: right;
        margin-right: 12upx;
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
    .content {
        word-break: break-all;
        font-size: 32upx;
        line-height: 44upx;
        text-align: center;
        &.left {
            text-align: left;
        }
    }
    .cover {
        position: fixed;
        bottom: 360upx;
        left: 0;
        width: 100%;
        image {
            width: 100%;
            height: auto;
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
    }
}
</style>
