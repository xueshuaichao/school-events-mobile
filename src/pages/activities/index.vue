<template>
    <view class="page-activity-box">
        <view class="ban-top">
            <image
                class="img"
                :src="activityList[tabIndex].path"
            />
        </view>
        <view
            class="tab-box"
            :class="[activityList[tabIndex].name]"
        >
            <view class="tab-btns">
                <button
                    :class="{
                        active: tabIndex === 0
                    }"
                    @click="toggle(0)"
                >
                    春节活动
                </button>
                <button
                    :class="{
                        active: tabIndex === 1
                    }"
                    @click="toggle(1)"
                >
                    dou说春节好
                </button>
            </view>
        </view>
        <view
            class="tab-btm"
            :class="[activityList[tabIndex].name]"
        >
            <text>
                ———— 精彩作品 ————
            </text>
        </view>
        <view
            class="media-box"
            :class="[activityList[tabIndex].name]"
        >
            <view
                v-for="(item, index) in dataList"
                :key="item.id"
                class="media-content"
            >
                <event-craft-cover
                    :info="item"
                    :bg-color="activityList[tabIndex].bgcolor"
                    @click.native="viewDetail(item, index)"
                />

                <view class="media-name text-one-line">
                    {{ item.resource_name }}
                </view>
                <text class="media-user">
                    {{ item.user_name }}
                </text>
                <view class="vote-num">
                    {{ item.ticket }}票
                </view>
            </view>
            <view class="load-box">
                <uni-load-more
                    class="loadMore"
                    :status="loadMoreStatus"
                    :content-text="{
                        contentdown: '上拉显示更多',
                        contentrefresh: '正在加载...',
                        contentnomore: '———— 已经到底了~ ————'
                    }"
                    color="#fff"
                />
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../components/event-craft-cover/index.vue';
import logger from '../../common/logger';

export default {
    components: {
        EventCraftCover,
        uniLoadMore,
    },
    data() {
        return {
            fr1: '',
            fr2: '',
            tabIndex: 0,
            activityList: [
                {
                    path:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/activity-chunjie.png',
                    title: '春节活动',
                    activity_id: 3,
                    name: 'chunjie',
                    bgcolor: 'B11A27',
                },
                {
                    path:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/activity-chunjiehao.png',
                    title: 'dou说春节好',
                    activity_id: 4,
                    name: 'chunjiehao',
                    bgcolor: 'B11A27',
                },
            ],
            dataList: [],
            filter: {
                activity_id: 3,
                page_num: 1,
                page_size: 10,
            },
            loadMoreStatus: 'more',
            total: 0,
        };
    },
    onLoad(params) {
        this.fr1 = logger.getFr('xchd', params);
        this.fr2 = logger.getFr('dsxnh', params);
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title:
                '不服你来战-陕西青少年“爱挑战”嘉年华完美收官陕西青少年“爱挑战”嘉年华完美收官',
            imageUrl: '/static/images/index/banner.png',
            path: '/pages/activities/index',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        toggle(val) {
            if (this.tabIndex !== val) {
                this.tabIndex = val;
                this.filter.activity_id = this.activityList[val].activity_id;
                this.filter.page_num = 1;
                this.getData();
                uni.showLoading();
            }
        },
        viewDetail(item, position) {
            if (this.tabIndex) {
                uni.navigateTo({
                    url: `/pages/chunjiehao/detail/detail?id=${item.id}&total=${
                        this.total > 100 ? 100 : this.total
                    }&fr=${this.fr2}&curPosition=${position + 1}`,
                });
            } else {
                uni.navigateTo({
                    url: `/pages/chunjie/detail/detail?id=${item.id}&total=${
                        this.total > 100 ? 100 : this.total
                    }&fr=${this.fr1}&curPosition=${position + 1}`,
                });
            }
        },
        getData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
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
                    uni.hideLoading();
                },
            );
            uni.hideLoading();
        },
        onReachBottom() {
            console.log(`${this.total}------total`);
            if (
                this.total > this.filter.page_num * this.filter.page_size
                && this.filter.page_num * this.filter.page_size < 100
            ) {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            } else {
                this.loadMoreStatus = 'noMore';
            }
        },
    },
};
</script>

<style lang="less">
.page-activity-box {
    .chunjie {
        background: #ff3442;
    }
    .chunjiehao {
        background: #ff2d42;
    }
    .ban-top {
        .img {
            width: 750upx;
            height: 760upx;
        }
    }
    .tab-box {
        height: 90upx;
        margin-top: -10upx;
        padding-top: 50upx;
        text-align: center;
        padding: 40upx 50upx 0 50upx;
        .tab-btns {
            // width: 100%;
            display: flex;
            padding: 0 100upx;
        }
        button {
            width: 200upx;
            height: 66upx;
            float: left;
            line-height: 66upx;
            color: #ffffff;
            background: transparent;
            font-size: 30upx;
            font-weight: 700;
            border-radius: 33upx;
            border: 1px solid #fff;
            padding: 0;
            &.active {
                background: #ffde98;
                color: #ff2e3f;
                border-color: #ffde98;
            }
            &::after {
                border: none;
            }
        }
    }
    .tab-btm {
        color: #ffdbb2;
        font-size: 32upx;
        padding: 20upx 0;
        text-align: center;
    }
    .media-box {
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        overflow: hidden;
        padding: 20upx 30upx;
        .load-box {
            width: 100%;
        }
        .uni-load-more {
            margin: 0 auto !important;
        }
        .media-content {
            width: 335upx;
            justify-items: space-betwen;
            position: relative;
            margin-bottom: 50upx;
            .video {
                width: 335upx;
                height: 225upx;
            }
            .media-name {
                color: #fff;
                width: 100%;
                font-size: 24upx;
                margin-bottom: 10upx;
            }
            .vote-num {
                color: #ffdf9f;
                font-size: 30upx;
                float: right;
            }
            .media-user {
                float: left;
                color: #fff;
            }
            .vote {
                float: right;
                width: 170upx;
                height: 60upx;
                background: rgba(255, 88, 75, 1);
                border-radius: 30upx;
                color: rgba(255, 255, 255, 1);
                font-size: 28upx;
                text-align: center;
                line-height: 60upx;
            }
            .media-icon {
                width: 40upx;
                height: 40upx;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 20upx;
                text-align: center;
                line-height: 42upx;
                position: absolute;
                top: 175upx;
                right: 10upx;
                image {
                    width: 22upx;
                    height: 22upx;
                }
            }
        }
    }
}
</style>
