<template>
    <view class="main">
        <view v-if="loading && !list.length">
            <image
                class="no-video"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/no-video.png"
            />
            <view class="no-video-txt">
                暂无直播
            </view>
        </view>
        <view
            v-for="(item, k) in list"
            :key="k"
            class="main-box"
            @click="jumpZhibo(item)"
        >
            <image
                class="school-logo"
                :src="item.img ? item.img : '/static/images/uc/avatar.png'"
            />
            <view>
                <view class="name">
                    {{ item.live_name }}
                </view>
                <view class="time">
                    直播时间：{{ item.start_time }}-{{ item.end_time }}
                </view>
            </view>
            <view
                class="badge"
                :class="{ run: item.status === 1, over: item.status === 3 }"
            >
                {{ item.status_name }}
            </view>
        </view>
        <uni-load-more
            v-if="total > filter.page_size"
            class="loadMore"
            :status="loadMoreStatus"
            :content-text="{
                contentdown: '上拉显示更多',
                contentrefresh: '正在加载...',
                contentnomore: '———— 已经到底了~ ————'
            }"
            color="#999999"
        />
    </view>
</template>

<script>
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import api from '../../common/api';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            loadMoreStatus: 'more',
            list: [],
            filter: {
                page_num: 1,
                page_size: 10,
            },
            total: 0,
            loading: false,
        };
    },
    methods: {
        jumpZhibo(item) {
            if (item.status === 2) {
                uni.navigateTo({
                    url: `/pages/openGame/zhibo?id=${item.id}`,
                });
            }
        },
        getData(title) {
            api.get('/api/live/list', this.filter).then(({ list, total }) => {
                this.loading = true;
                const lists = list.map((D) => {
                    const d = D;
                    d.end_time = d.end_time.slice(11, 16);
                    d.start_time = d.start_time.slice(0, 16);
                    return d;
                });
                if (title === 'reachBottom') {
                    this.list = this.list.concat(lists);
                } else {
                    this.list = lists;
                }

                this.total = total;

                if (
                    this.total
                    <= this.filter.page_num * this.filter.page_size
                ) {
                    this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                } else {
                    this.loadMoreStatus = 'more';
                }
            });
        },
        onReachBottom() {
            console.log('到底部了');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
    },
    onLoad() {
        this.getData();
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: '青少年“爱挑战”校园网络赛',
            path: '/pages/openGame/school-zhibo',
        };
    },
};
</script>

<style lang="less" scoped>
.main {
    height: 100vh;
    background: #f8f8f8;
    padding: 30upx;
    .loadMore {
        width: 100%;
    }
    .no-video {
        width: 310upx;
        height: 310upx;
        margin: 200upx 190upx 0;
    }
    .no-video-txt {
        text-align: center;
        font-size: 30upx;
        color: #666;
    }
    .main-box {
        width: 690upx;
        height: 180upx;
        background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/zhibo-card-bg.png")
            no-repeat;
        background-size: 54upx 38upx;
        position: relative;
        margin-bottom: 30upx;
        display: flex;
        background-color: #fff;
        padding: 30upx 30upx 0;
        box-sizing: border-box;
        border-radius: 4upx;
        .school-logo {
            width: 120upx;
            height: 120upx;
            margin-right: 30upx;
            border-radius: 60upx;
        }
        .name {
            font-size: 30upx;
            color: #323643;
            font-weight: 600;
            width: 394upx;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-top: 24upx;
            line-height: 30upx;
        }
        .time {
            color: #989898;
            font-size: 22upx;
            margin-top: 14upx;
        }
        .badge {
            position: absolute;
            top: 14upx;
            right: 0;
            background: #ff6555;
            color: #fff;
            font-size: 26upx;
            line-height: 50upx;
            color: #fff;
            width: 120upx;
            text-align: center;
            border-radius: 26upx 0 0 26upx;
            &.run {
                background: #1166ff;
            }
            &.over {
                background: #ccc;
            }
        }
    }
}
</style>
