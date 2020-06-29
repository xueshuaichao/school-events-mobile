<template>
    <view class="main">
        <navigator
            v-for="(item, k) in list"
            :key="k"
            url="/pages/openGame/zhibo"
        >
            <view class="main-box">
                <image
                    class="school-logo"
                    src="/static/images/uc/avatar.png"
                />
                <view>
                    <view class="name">
                        {{ item.name }}
                    </view>
                    <view class="time">
                        直播时间：2020.04.20 11:30-14:30
                    </view>
                </view>
                <view class="badge">
                    进行中
                </view>
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
            api.get('/api/live/list', this.filter).then(({ list, total }) => {
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
