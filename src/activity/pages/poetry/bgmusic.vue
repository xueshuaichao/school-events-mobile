<template>
    <view class="music-bg-page">
        <view
            v-for="(item, index) in list"
            :key="index"
            class="item"
        >
            <view>
                {{ item.id }}
            </view>
            <view class="action">
                <view
                    v-if="item.play"
                    @click="pause(index)"
                >
                    暂停
                </view>
                <view @click="play(item, index)">
                    播放
                </view>
                <view @click.self="selBg(item, index)">
                    {{ item.sel ? "已选" : "选择" }}
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            list: [
                { id: 1, sel: 1, play: 0 },
                { id: 2, sel: 0, play: 0 },
                { id: 3, sel: 0, play: 0 },
                { id: 4, sel: 0, play: 0 },
            ],
            total: 0,
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            bgSrc2:
                'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
            innerAudioContext: null,
            playItem: null,
            selItem: null,
        };
    },
    onLoad() {
        this.innerAudioContext = uni.createInnerAudioContext();
    },
    onUnload() {
        this.innerAudioContext.destroy();
    },
    methods: {
        selBg(item, index) {
            if (!item.sel) {
                if (this.selItem) {
                    this.$set(this.list[this.selItem.index], 'sel', 0);
                }
                if (!item.play) {
                    //  正在播放的其他音乐要暂停。
                    this.innerAudioContext.pause();
                }
                this.$set(this.list[index], 'sel', 1);
                this.selItem = { index, ...item };
            }
        },
        pause(index) {
            this.$set(this.list[index], 'play', 0);
            this.innerAudioContext.pause();
        },
        play(item, index) {
            console.log(item);
            if (!item.play) {
                if (this.playItem) {
                    this.$set(this.list[this.playItem.index], 'play', 0);
                }
                this.$set(this.list[index], 'play', 1);

                this.playItem = { index, ...item };
                this.innerAudioContext.src = index % 2 ? this.bgSrc : this.bgSrc2;
                this.innerAudioContext.play();
            }
        },
    },
};
</script>
<style scoped lang="less">
.music-bg-page {
    padding: 30upx;
    .item {
        margin-bottom: 30upx;
        display: flex;
        justify-content: space-between;
        .action {
            display: flex;
            width: 40%;
            justify-content: space-evenly;
        }
    }
}
</style>
