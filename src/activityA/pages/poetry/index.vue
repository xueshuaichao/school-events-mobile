<template>
    <div>
        <view @click="createAudio">
            试听
        </view>
    </div>
</template>
<script>
import AudioPlayer from '../../../common/audio';

export default {
    data() {
        return {
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
            bgAudio: null,
            audio: null,
        };
    },
    created() {
        this.bgAudio = new AudioPlayer({ src: this.bgSrc });
        // console.log(this.bgAudio,this.bgAudio.audioPlayer.duration);
        this.bgAudio.audioPlayer.buffered = this.bgAudio.audioPlayer.duration;
    },
    methods: {
        createAudio() {
            this.audio = new AudioPlayer(this.src, {
                onPlay: this.onPlay(),
            });
            this.play([this.bgAudio, this.audio]);
        },
        play(audio) {
            audio.forEach((item) => {
                item.play();
            });
        },
        onPlay(res) {
            console.log('播放中', res);
        },
    },
};
</script>
