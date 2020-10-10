<template>
    <view
        v-if="audioData.resource_type === 3"
        class="controller"
    >
        <image
            class="play-btn"
            :src="
                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-${
                    playStatus ? 'pause' : 'play'
                }.png`
            "
            @click="clickCenter"
        />
        <view
            v-show="isShowSlider"
            class="control"
        >
            <slider
                :value="slideValue"
                min="0"
                :max="maxVal"
                active-color="#B5FFF5"
                background-color="#277d73"
                block-color="#54afa9"
                block-size="20"
                class="unseable-slider"
                :disabled="true"
            />
        </view>
        <view class="time">
            {{ currentSecond | secondsToText }}/{{
                recordDuration | secondsToText
            }}
        </view>
    </view>
</template>

<script>
let innerAudioContext = '';
let innerAudioContextBg = '';
// eslint-disable-next-line func-names
const padTime = function (val) {
    const str = `${val}`;
    return str.length === 1 ? `0${str}` : str;
};

export default {
    filters: {
        secondsToText(secs) {
            if (typeof secs === 'string') {
                return secs;
            }
            if (!secs || secs === 'Infinity') {
                return '00:00';
            }
            const minutesDiv = (secs % 3600) / 60;
            let minutes = Math.floor(minutesDiv);
            let seconds = Math.ceil((secs % 3600) % 60);
            if (seconds > 59) {
                seconds = 0;
                minutes = Math.ceil(minutesDiv);
            }
            if (minutes > 59) {
                minutes = 0;
            }
            const toDouble = (val) => {
                if (val >= 0 && val.toString().length < 2) {
                    return `0${val}`;
                }
                return `${val}`;
            };
            return `${toDouble(minutes)}:${toDouble(seconds)}`;
        },
    },
    props: {
        audioData: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            playStatus: 0,
            recordDuration: 0,
            slideValue: 0,
            maxVal: 600,
            maxTime: 10 * 60,
            currentSecond: 0,
            current: 1,
            isShowSlider: true,
            isInit: true,
            resourceType: 0,
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    watch: {
        audioData(val, old) {
            if (val.resource_type === 3) {
                this.resourceType = val.resource_type;
                if (val.audio_url && old.audio_url !== val.audio_url) {
                    console.log('val---', val.bg_url);
                    console.log('oldval---', old.bg_url);
                    this.stopAll();
                    uni.showLoading({
                        title: '加载中',
                    });
                    this.initSlide(val);

                    if (typeof innerAudioContext === 'string') {
                        console.log('createdaudio');
                        this.createAudio(val);
                    } else {
                        if (val.bg_url) {
                            innerAudioContextBg.src = val.bg_url;
                        }
                        if (val.audio_url) {
                            innerAudioContext.seek(0);
                            innerAudioContext.src = val.audio_url;
                        }
                        this.playAll();
                    }
                }
            } else {
                uni.hideLoading();
                this.stopAll();
            }
        },
    },
    created() {
        if (this.audioData.resource_type === 3) {
            this.resourceType = this.audioData.resource_type;
            this.initSlide(this.audioData);
            this.createAudio(this.audioData);
        }
    },
    methods: {
        initAudio() {
            this.initSlide(this.audioData);
            this.createAudio(this.audioData);
        },
        initSlide(val) {
            this.slideValue = 0;
            this.recordDuration = val.duration;
            this.maxVal = val.duration;
        },
        createAudio(val) {
            // 背景
            innerAudioContextBg = uni.createInnerAudioContext();
            if (!this.isH5) {
                uni.setInnerAudioOption({
                    obeyMuteSwitch: false,
                });
            }
            innerAudioContextBg.volume = 0.8;
            innerAudioContextBg.loop = true;

            // 音频
            innerAudioContext = uni.createInnerAudioContext();
            innerAudioContext.autoplay = true;
            innerAudioContext.volume = 1;

            if (val.bg_url) {
                innerAudioContextBg.src = val.bg_url;
            }
            if (val.audio_url) {
                innerAudioContext.src = val.audio_url;
            }

            this.audioInit();
        },
        audioInit() {
            // if (this.isInit) {
            // this.isInit = false;
            innerAudioContextBg.onPlay(() => {
                console.log('bg-- onPlay');
            });
            innerAudioContextBg.onCanplay(() => {
                console.log('bg-- onCanplay');
            });
            innerAudioContext.onEnded(() => {
                this.slideValue = 0;
                this.playStatus = 0;
                this.currentSecond = 0;
                this.isStop = true;
                console.log('onEnded');
                if (typeof innerAudioContextBg !== 'string') {
                    innerAudioContextBg.stop();
                }
            });
            innerAudioContext.onStop(() => {
                this.slideValue = 0;
                this.playStatus = 0;
                this.currentSecond = 0;
                this.isStop = true;
                console.log('onStop');
                if (typeof innerAudioContextBg !== 'string') {
                    innerAudioContextBg.stop();
                }
            });
            innerAudioContext.onPause(() => {
                this.playStatus = 0;
                this.isStop = false;
                console.log('pause');
                if (typeof innerAudioContextBg !== 'string') {
                    innerAudioContextBg.pause();
                }
            });
            innerAudioContext.onPlay(() => {
                this.playStatus = 1;
                if (typeof innerAudioContextBg !== 'string') {
                    console.log('play-bg');
                    if (this.isStop) {
                        innerAudioContextBg.seek(0);
                    }
                    innerAudioContextBg.play();
                }
                uni.hideLoading();
            });
            innerAudioContext.onTimeUpdate(() => {
                this.currentSecond = innerAudioContext.currentTime;
                this.slideValue = Math.round(innerAudioContext.currentTime);
            });
            // }
        },
        percentToTime(p) {
            const seconds = p;
            const minutes = seconds ? padTime(Math.floor(seconds / 60)) : '00';
            const second = seconds ? padTime(Math.ceil(seconds % 60)) : '00';
            this.currentSecond = `${minutes}:${second}`;
        },
        // 播放当前
        playCurrent(current) {
            this.current = current;
            innerAudioContext.play();
            innerAudioContextBg.play();
        },
        playAll() {
            if (typeof innerAudioContext !== 'string') {
                innerAudioContext.play();
            }
            if (typeof innerAudioContextBg !== 'string') {
                innerAudioContextBg.play();
            }
        },
        // 音频暂停
        pauseAll() {
            innerAudioContext.pause();
            innerAudioContextBg.pause();
        },
        destroyAll() {
            if (typeof innerAudioContext !== 'string') {
                innerAudioContext.stop();
                innerAudioContext.offTimeUpdate();
                innerAudioContext.offStop();
                innerAudioContext.offEnded();
                innerAudioContext.offPause();
                innerAudioContext.offPlay();
                innerAudioContext.destroy();
                innerAudioContext = '';
            }
            if (typeof innerAudioContextBg !== 'string') {
                innerAudioContextBg.stop();
                innerAudioContextBg.destroy();
                innerAudioContextBg = '';
            }
        },
        stopAll() {
            if (typeof innerAudioContext !== 'string') {
                innerAudioContext.stop();
            }
            if (typeof innerAudioContextBg !== 'string') {
                innerAudioContextBg.stop();
            }
        },
        clickCenter() {
            // playStatus 1 播放中 0 暂停
            if (this.playStatus) {
                // 正在播放着，则暂停播放，根据状态显示重听
                this.pauseAll();
            } else {
                // 已经暂停，则继续播放。
                this.playAll();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.controller {
    height: 48upx;
    display: flex;
    padding: 0 26upx 0 16upx;
    margin-top: 12upx;
    font-size: 20upx;
    color: #266158;
    justify-content: space-between;
    position: fixed;
    bottom: 10upx;
    left: 0;
    right: 0;
    z-index: 10;
    .play-btn {
        width: 80upx;
        height: 60upx;
        position: relative;
        bottom: 15upx;
    }
    .bar-wrap {
        padding-top: 6upx;
        .bar-way {
            width: 540upx;
            height: 20upx;
            background: linear-gradient(
                180deg,
                rgba(0, 65, 55, 0.3) 0%,
                rgba(0, 65, 55, 0.08) 100%
            );
            border-radius: 10px;
        }
    }
    .control {
        margin: 0 0 0 10upx;
        width: 688upx;
        height: 68upx;
        border-radius: 48upx;
        position: relative;
        top: -20upx;
        .uni-slider {
            margin: 0 10upx;
        }
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
}
</style>
