<template>
    <view class="music-bg-page">
        <view class="main">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
            >
                <view class="title">
                    {{ item.title }}
                </view>
                <view class="action">
                    <image
                        v-if="!item.play"
                        class="icon"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-play.png"
                        @click="play(item, index)"
                    />
                    <image
                        v-else
                        class="icon"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-pause.png"
                        @click="pause(index)"
                    />
                    <view
                        class="btns"
                        :class="{ sel: item.sel }"
                        @click.self="selBg(item, index)"
                    >
                        {{ item.sel ? "已选" : "选择" }}
                    </view>
                </view>
            </view>
        </view>

        <uni-load-more
            class="loadMore"
            :status="loadMoreStatus"
            :content-text="{
                contentdown: '上拉显示更多',
                contentrefresh: '正在加载...',
                contentnomore: '———— 已经到底了~ ————'
            }"
            color="#254834"
        />
    </view>
</template>
<script>
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            list: [],
            bgSrc:
                'https://bj.bcebos.com//vod-bj/convert/200664/audio/202005181456325ec231a07ea2c.mp3',
            bgSrc2:
                'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.mp3',
            innerAudioContext: null,
            playItem: null,
            selItem: null,
            filter: {
                page_size: 20,
                page_num: 1,
            },
            loadMoreStatus: 'more',
            total: 0,
        };
    },
    onLoad() {
        this.innerAudioContext = uni.createInnerAudioContext();
        this.getList();
    },
    onUnload() {
        this.innerAudioContext.destroy();
    },
    onReachBottom() {
        if (this.loadMoreStatus === 'more') {
            this.filter.page_num += 1;
            this.loadMoreStatus = 'loading';
            this.getList('reachBottom');
        }
    },
    methods: {
        getList(title) {
            api.post('/api/poem/bglist', this.filter).then(
                ({ total, list }) => {
                    const list2 = list.map((D) => {
                        const d = D;
                        d.sel = 0;
                        d.play = 0;
                        return d;
                    });
                    this.total = total;
                    if (!this.list.length) {
                        this.list = list2;
                    } else {
                        this.list = this.list.concat(list2);
                    }
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
            );
        },
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
            if (!item.play) {
                console.log(item, this.playItem, this.list);
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
    padding: 0 21upx;
    height: 100vh;
    background: #e9f8f2;
    .main {
        min-height: 99%;
    }
    .item {
        margin-top: 20upx;
        display: flex;
        justify-content: space-between;
        width: 718upx;
        height: 120upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/bg-music.png);
        background-size: 100%;
        padding: 0 60upx 0 70upx;
        box-sizing: border-box;
        .title {
            color: #004137;
            line-height: 128upx;
            font-size: 32upx;
        }
        .action {
            display: flex;
        }
        .icon {
            width: 120upx;
            height: 120upx;
        }
        .btns {
            width: 172upx;
            height: 114upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-select-0.png);
            background-size: 100%;
            text-align: center;
            line-height: 114upx;
            color: #128070;
            margin-top: 4upx;

            &.sel {
                color: #fff;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-select-1.png);
                background-size: 100%;
            }
        }
    }
}
</style>
