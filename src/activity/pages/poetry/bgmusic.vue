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
                <view @click="pause(item)">
                    暂停
                </view>
                <view @click="play(item)">
                    播放
                </view>
                <view @click="selBg(item)">
                    {{ item.sel ? "已选" : "选择" }}
                </view>
            </view>
        </view>
        <audio :src="src" />
    </view>
</template>
<script>
export default {
    data() {
        return {
            list: [
                { id: 1, sel: 1 },
                { id: 2, sel: 0 },
                { id: 3, sel: 0 },
                { id: 4, sel: 0 },
            ],
            total: 0,
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            bgSrc2:
                'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
            src: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
        };
    },
    methods: {
        selBg(item) {
            if (!item.sel) {
                this.list = this.list.map((D) => {
                    const d = D;
                    d.sel = 0;
                    if (item.id === d.id) {
                        d.sel = 1;
                    }
                    return d;
                });
            }
        },
        pause(item) {
            console.log(item);
        },
        play(item) {
            console.log(item);
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
