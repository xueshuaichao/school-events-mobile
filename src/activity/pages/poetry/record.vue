<template>
    <div>
        <view>
            <div class="poetryStyle">
                <div style="text-align: center">
                    <h2>望岳</h2>
                    <span>唐</span>. <span>杜甫</span>
                </div>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-align: center">
                    岱宗夫如何？齐鲁青未了。
                </p>
                <p style="text-indent:2em;">
                    岱宗夫如何？齐鲁青未了.岱宗夫如何？
                    齐鲁青未了。岱宗夫如何？齐鲁青未了。
                    岱宗夫如何？齐鲁青未了.岱宗夫如何？
                    齐鲁青未了。岱宗夫如何？齐鲁青未了。
                    岱宗夫如何？齐鲁青未了.岱宗夫如何？
                    齐鲁青未了。岱宗夫如何？齐鲁青未了。
                </p>
            </div>
            <view>
                <img
                    class="imgStyle"
                    alt=""
                    style="width: 100%"
                    :src="imgUrl + cover"
                >
            </view>
        </view>
        <view class="cont">
            <view>
                <button
                    class="cont_btn"
                    @click="startRecord"
                >
                    开始录音
                </button>
                <button
                    class="cont_btn"
                    @click="stopRecord"
                >
                    暂停录音
                </button>
                <button
                    class="cont_btn"
                    @click="resumeRecord"
                >
                    继续录音
                </button>
                <button
                    class="cont_btn"
                    @click="endRecord"
                >
                    停止录音
                </button>
                <button
                    class="cont_btn"
                    @click="playVoice"
                >
                    播放录音
                </button>
                <button
                    class="cont_btn"
                    @click="onConfirmDelete"
                >
                    重新录音
                </button>
                <button
                    class="cont_btn"
                    @click="setBgAudioVol(0.5)"
                >
                    0.5bg
                </button>
                <button
                    class="cont_btn"
                    @click="setMainAudio(0.8)"
                >
                    0.8录音
                </button>
                <button
                    class="cont_btn"
                    @click="seek(20)"
                >
                    跳转
                </button>
                <button
                    class="cont_btn"
                    @click="palyAll"
                >
                    palyAll
                </button>
                <button
                    class="cont_btn"
                    @click="pauseAll"
                >
                    pauseAll
                </button>
            </view>
        </view>
    </div>
</template>
<script>
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
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            audio: null,
            imgUrl: 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com',
            cover: '/mp_wx/brand_main.jpg',
            volBg: 0.5,
            volManage: 0.8,
            options: null,
            imgAuthBtn: false,
        };
    },
    computed: {
        intIntervalTime() {
            // 用于显示整数的秒数
            return Math.round(this.intervalTime);
        },
    },
    created() {},
    onLoad() {
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
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    icon: 'none',
                    title: '网络不流畅',
                });
            }, 30000);
        });
        innerAudioContextBg.onError((res) => {
            uni.showToast({
                icon: 'none',
                title: res.errMsg + res.errCode,
            });
        });
        innerAudioContextBg.onCanplay(() => {
            uni.hideLoading();
        });
        if (!this.isH5) {
            this.getSetting();
        }
    },
    onUnload() {
        innerAudioContext.destroy();
        innerAudioContextBg.destroy();
        uni.navigateBack();
    },
    onBackPress(options) {
        this.options = options;
    },
    methods: {
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
        seek(val) {
            innerAudioContextBg.seek(val);
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
.cont {
    width: 100%;
    height: 150rpx;
    position: absolute;
    top: 70%;
    text-align: center;
}
/* 按钮样式 */
.cont_btn {
    position: relative;
    float: left;
    width: 25%;
    height: 80rpx;
    margin: 10rpx 30rpx;
    border-radius: 10rpx;
    line-height: 80rpx;
    background-color: aquamarine;
    font-size: 30rpx;
}
.imgStyle {
    height: 600upx;
}
.poetryStyle {
    margin-top: 20rpx;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    width: 70%;
    left: 14%;
    padding: 2%;
}
</style>
