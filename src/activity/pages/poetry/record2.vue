<template>
    <view>
        <view class="cont">
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
            <button
                class="cont_btn"
                @click="palyBg"
            >
                palyBG
            </button>
            <button
                class="cont_btn"
                @click="pauseBg"
            >
                pauseBG
            </button>
            <button
                class="cont_btn"
                @click="seekbg(20)"
            >
                跳转
            </button>
        </view>
        <view class="slide-wrap">
            <slider
                value="60"
                block-size="20"
                block-color="#ff0"
                active-color="#00ff00"
                background-color="#999999"
                step="5"
                @change="sliderChange"
            />
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

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
        };
    },
    computed: {
        intIntervalTime() {
            // 用于显示整数的秒数
            return Math.round(this.intervalTime);
        },
    },
    created() {},
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
                console.log(res);
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
/* 按钮样式 */
.cont {
    display: flex;
    flex-wrap: wrap;
}
.cont_btn {
    position: relative;
    width: 200upx;
    height: 80rpx;
    border-radius: 10rpx;
    line-height: 80rpx;
    background-color: aquamarine;
    font-size: 30rpx;
    margin: 20upx 0;
}
</style>
