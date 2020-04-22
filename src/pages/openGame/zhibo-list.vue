<template>
    <view class="main">
        <view
            v-for="(item, index) in list"
            :key="index"
            class="main-box"
            :style="{ backgroundImage: 'url(' + item.bg + ')' }"
        >
            <text class="zhibo-name">
                {{ item.name }}
            </text>
            <navigator :url="item.url">
                <div class="zhibo-time">
                    立即参加
                </div>
            </navigator>
        </view>
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
                    name: '竞技类',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/jingji-bg.png',
                    url: '/pages/openGame/jingjiupload',
                },
                {
                    name: '才艺类',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/caiyi-bg.png',
                    url: '/pages/openGame/caiyiupload',
                },
                {
                    name: '吉尼斯项目',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/jinisi-bg.png',
                    url: '/pages/openGame/caiyiupload',
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
    // background: #f8f8f8;
    padding: 26upx 24upx;
    .loadMore {
        width: 100%;
    }
    .main-box {
        width: 708upx;
        height: 258upx;
        background-size: 100% 100%;
        position: relative;
        margin-top: 22upx;
        .zhibo-name {
            position: absolute;
            top: 59upx;
            left: 49upx;
            font-size: 36upx;
            font-weight: 500;
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
            top: 139upx;
            left: 49upx;
            font-size: 30upx;
            color: #fff;
            width: 200upx;
            height: 60upx;
            background: rgba(255, 101, 85, 1);
            border-radius: 30upx;
            text-align: center;
            line-height: 60upx;
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
