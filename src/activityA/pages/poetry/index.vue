<!--suppress ALL -->
<template>
    <div>
        <view>
            <!-- <div style="background-image: url('https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-10.png')"></div>-->
            <div
                style="margin-top: 20rpx;background: rgba(255,255,255,0.8);
                position: absolute;width: 80%;text-align: center;left: 10%"
            >
                <h2>望岳</h2>
                <span>唐</span>. <span>杜甫</span>
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
            </div>
            <view>
                <img
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster.png"
                    alt=""
                    style="width: 100%"
                >
            </view>
        </view>
        <view @click="createAudio">
            试听两个同事播放
        </view>
        <view
            class="page-section page-section-gap"
            style="text-align: center;"
        >
            <audio
                style="text-align: left"
                :src="src"
                :poster="current.poster"
                :name="current.name"
                :author="current.author"
                :loop="true"
                :action="audioAction"
                controls
                @play="playVoicess"
                @pause="playVoicessStop"
            />
        </view>
        <view
            class="page-section page-section-gap"
            style="text-align: center;"
        >
            <audio
                style="text-align: left"
                :src="current.src"
                :poster="current.poster"
                :name="current.name"
                :author="current.author"
                :action="audioAction"
                controls
                @play="playVoice"
            />
        </view>
        <view class="cont">
            <view>
                <!--<button class="cont_btn" @touchstart="startRecord" @touchend="endRecord">按住说话,松开结束</button>-->

                <!--<button class="cont_btn" @tap="playVoice">播放录音</button>-->
                <button
                    class="cont_btn"
                    @tap="startRecord"
                >
                    开始录音
                </button>
                <button
                    class="cont_btn"
                    @tap="stopRecord"
                >
                    暂停录音
                </button>
                <button
                    class="cont_btn"
                    @tap="resumeRecord"
                >
                    继续录音
                </button>
                <button
                    class="cont_btn"
                    @tap="endRecord"
                >
                    停止录音
                </button>
                <button
                    class="cont_btn"
                    @tap="playVoice"
                >
                    播放录音
                </button>
                <!--<view class="status">录音中{{intIntervalTime}}s>>></view>-->
            </view>
        </view>
    </div>
</template>
<script>
import AudioPlayer from '../../../common/audio';

const recorderManager = uni.getRecorderManager();
const innerAudioContext = uni.createInnerAudioContext();

innerAudioContext.autoplay = true;
export default {
    data() {
        // const recorderManager = wx.getRecorderManager();
        // const innerAudioContext = wx.createInnerAudioContext();
        return {
            text: 'uni-app',
            voicePath: '',
            intervalTime: 0,
            timer: null,
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
            bgAudio: null,
            audio: null,
            list: [
                { name: '播放录音' },
                { name: '停止录音' },
                { name: '点击录音' },
            ],
            current: {
                poster:
                    'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg',
                name: '致爱丽丝',
                author: '暂无',
                src:
                    'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            },
            audioAction: {
                method: 'pause',
            },
        };
    },
    computed: {
        intIntervalTime() {
            // 用于显示整数的秒数
            console.log(Math.round(this.intervalTime));
            return Math.round(this.intervalTime);
        },
    },
    created() {
        this.bgAudio = new AudioPlayer({ src: this.bgSrc });
        // console.log(this.bgAudio,this.bgAudio.audioPlayer.duration);
        this.bgAudio.audioPlayer.buffered = this.bgAudio.audioPlayer.duration;
        this.audiotwo = new AudioPlayer({ src: this.src });
    },
    onLoad() {
        const self = this;
        recorderManager.onStop((res) => {
            console.log(`recorder stop${JSON.stringify(res)}`);
            self.voicePath = res.tempFilePath;
        });
    },
    methods: {
        startRecord() {
            console.log('开始录音');
            recorderManager.start({ format: 'mp3' });
        },
        startRecords() {
            this.timer = setInterval(() => {
                this.intervalTime += 0.5;

                if (this.intervalTime >= 0.5 && !this.isRecord) {
                    // 如果用户录制的时间太短,就不会去开启录音, 因为有个bug: recorderManager.stop()在短时间内开启在关闭的话,实际上他还在不停地录音,不知道你们有没有遇到过

                    console.log('开始录音');
                    this.isRecord = true;
                    this.intervalTime = 0;
                    recorderManager.start({
                        format: 'mp3',
                    });
                }
            }, 500);
        },
        endRecord() {
            console.log('录音结束');
            recorderManager.stop();
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

        playVoicess() {
            console.log('播放录音');
            this.voicePath = this.bgSrc;
            if (this.voicePath) {
                innerAudioContext.src = this.voicePath;
                innerAudioContext.play();
            }
            console.log(this.voicePath, 111111111);
        },
        playVoicessStop() {
            console.log('继续录音');
            this.voicePath = this.bgSrc;
            if (this.voicePath) {
                innerAudioContext.src = this.voicePath;
                innerAudioContext.pause();
            }
            console.log(this.voicePath, 111111111);
        },
        endRecords() {
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

        playVoices() {
            console.log('播放录音');
            if (this.voicePath) {
                innerAudioContext.src = this.voicePath;
                innerAudioContext.play();
            }
        },
        createAudio() {
            this.audio = new AudioPlayer(this.src, {
                onPlay: this.onPlay(),
            });
            this.play([this.bgAudio, this.audio]);
            this.questry();
        },
        play(audio) {
            audio.forEach((item) => {
                item.play();
            });
        },
        onPlay(res) {
            console.log('播放中', res);
        },
        questry() {
            this.audio = new AudioPlayer({ src: this.src });
            // this.audio.src = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3';
            this.audio.play();
        },
    },
};
</script>
<style lang="less" scoped>
.cont {
    width: 100%;
    height: 150rpx;
    position: absolute;
    top: 30%;
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
</style>
