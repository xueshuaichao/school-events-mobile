function sToHs(second) {
    let s = second;
    // 计算分钟
    // 算法：将秒数除以60，然后下舍入，既得到分钟数
    let h;
    h = Math.floor(s / 60);
    // 计算秒
    // 算法：取得秒%60的余数，既得到秒数
    s %= 60;
    // 将变量转换为字符串
    h += '';
    s += '';
    // 如果只有一位数，前面增加一个0
    h = h.length === 1 ? `0${h}` : h;
    s = s.length === 1 ? `0${s}` : s;
    return `${h}:${s}`;
}
class AudioPlayer {
    constructor(options = {}, methods = {}) {
        const config = {
            loop: false,
            autoplay: false,
            ...options,
        };
        this.audioPlayer = uni.createInnerAudioContext();

        Object.keys(config).forEach((item) => {
            this.audioPlayer[item] = config[item];
        });

        this.audioPlayer.onPlay((res) => {
            // 播放中
            if (methods.onPlay) {
                methods.onPlay(res);
            }
        });
        this.audioPlayer.onPause((res) => {
            // 暂停
            if (methods.onPause) {
                methods.onPause(res);
            }
        });
        this.audioPlayer.onCanplay((res) => {
            // 可以播放
            if (methods.onCanplay) {
                methods.onCanplay(res);
            }
        });
        this.audioPlayer.onError((res) => {
            // 错误
            if (methods.onError) {
                methods.onError(res);
            }
        });
        // 播放时间
        this.audioPlayer.onTimeUpdate(() => {
            if (methods.onError) {
                methods.onTimeUpdate(
                    sToHs(Math.floor(this.audioPlayer.currentTime)),
                );
            }
        });
    }

    play() {
        this.audioPlayer.play();
    }

    destroy() {
        this.audioPlayer.destroy();
    }
}
export default AudioPlayer;
