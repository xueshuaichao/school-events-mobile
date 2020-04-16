<template>
    <view class="main">
        <navigator
            v-for="(item, k) in list"
            :key="k"
            url="/pages/openGame/zhibo"
        >
            <view class="main-box">
                <text class="zhibo-name">
                    {{ item.name }}
                </text>
                <image
                    class="event-space"
                    src="/static/images/zhibo/event-space.png"
                />
                <text class="zhibo-type">
                    {{ item.type }}
                </text>
                <text class="zhibo-date">
                    {{ item.date }}
                </text>
                <text class="zhibo-time">
                    {{ item.time }}
                </text>
            </view>
        </navigator>

        <uni-load-more
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
            list: [
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
                {
                    name: '西安市第二中学复赛直播进行时',
                    type: '四阶魔方六面复原',
                    date: '2020年5月10日',
                    time: '20:00:00',
                },
            ],
            filter: {
                page_num: 1,
                page_size: 10,
            },
        };
    },
    methods: {
        getData(title) {
            api.get('/api/market/address', this.filter).then(
                ({ list, total }) => {
                    this.isLoading = false;
                    if (title === 'reachBottom') {
                        this.addressList = this.addressList.concat(list);
                    } else {
                        this.addressList = list;
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
                },
            );
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
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100vh;
    background: #f8f8f8;
    padding: 26upx 24upx;
    .loadMore {
        width: 100%;
    }
    .main-box {
        width: 702upx;
        height: 214upx;
        background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/zhibo-list-bg.png");
        background-size: 100% 100%;
        position: relative;
        margin-top: 18upx;
        .zhibo-name {
            position: absolute;
            top: 36upx;
            left: 30upx;
            font-size: 28upx;
            color: #333333;
        }
        .zhibo-type {
            position: absolute;
            top: 96upx;
            left: 58upx;
            font-size: 24upx;
            color: #666666;
        }
        .zhibo-date {
            position: absolute;
            top: 152upx;
            left: 29upx;
            font-size: 22upx;
            color: #999999;
        }
        .zhibo-time {
            position: absolute;
            top: 152upx;
            left: 192upx;
            font-size: 22upx;
            color: #999999;
        }
        .event-space {
            position: absolute;
            top: 98upx;
            left: 30upx;
            width: 20upx;
            height: 20upx;
        }
    }
}
</style>
