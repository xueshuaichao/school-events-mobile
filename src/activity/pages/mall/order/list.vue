<template>
    <view class="order-list-page">
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="tab-view">
                <view
                    class="item"
                    :class="{ active: status === 1 }"
                    @click="changeStatus(1)"
                >
                    兑换成功
                </view>
                <view
                    class="item"
                    :class="{ active: status === 2 }"
                    @click="changeStatus(2)"
                >
                    兑换待审核
                </view>
                <view
                    class="item"
                    :class="{ active: status === 3 }"
                    @click="changeStatus(3)"
                >
                    兑换未通过
                </view>
            </view>
            <view
                v-if="list.length"
                class="list-content"
            >
                <view
                    v-for="item in list"
                    :key="item.list"
                    class="item"
                    @click="jumpDetail(item.id)"
                >
                    <view class="order-number">
                        订单编号：{{ item.order_no }}
                    </view>
                    <view class="item-detail">
                        <view class="image">
                            <image
                                :src="item.gift_img"
                                mode=""
                            />
                        </view>
                        <view class="title">
                            {{ item.gift_name }}
                        </view>
                    </view>
                    <view class="item-info">
                        <view class="score">
                            <text>消耗积分：{{ item.gift_price }}</text>

                            <text>兑换数量</text><text>1{{ item.gift_unit || "" }}</text>
                        </view>
                        <view class="time">
                            <view class="title">
                                兑换时间：
                            </view>
                            <view class="text">
                                {{ item.created_at }}
                            </view>
                        </view>
                        <view
                            v-if="status === 3"
                            class="reason"
                        >
                            <view class="title">
                                驳回原因：
                            </view>
                            <view class="text">
                                {{ item.reason }}
                            </view>
                        </view>
                    </view>
                    <view class="address-detail">
                        <text>{{ item.addressee }}</text>
                        <text>{{ item.mobile }}</text>
                        <text class="address text-one-line">
                            {{ item.address }}
                        </text>
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
                    color="#333"
                />
            </view>
            <view
                v-else
                class="no-data"
            >
                <view class="image">
                    <image
                        src=""
                        mode=""
                    />
                </view>
                <view>当前暂无兑换的商品</view>
                <view>快去兑换吧！</view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../../common/api';
import login from '../../../../widgets/login/login.vue';
import uniLoadMore from '../../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
        login,
    },
    data() {
        return {
            activityId: 12,
            loadMoreStatus: 'none',
            list: [],
            filter: {
                page_size: 10,
                page_num: 1,
            },
            status: 1,
            userInfo: '',
        };
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getOrderList();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getOrderList();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getOrderList('reachBottom');
            }
        },
        changeStatus(status) {
            this.status = status;
            console.log(this.status);
            this.filter.page_num = 1;
            this.getOrderList();
        },
        getOrderList(type) {
            api.get('/api/market/recordlist', {
                ...this.filter,
                status: this.status,
                activity_id: this.activityId,
            }).then(({ list, total }) => {
                if (type === 'reachBottom') {
                    this.list = this.list.concat(list);
                } else {
                    this.list = list;
                }
                this.total = total;
                if (
                    this.total
                    <= this.filter.page_num * this.filter.page_size
                ) {
                    this.loadMoreStatus = type === 'reachBottom' ? 'noMore' : 'none';
                } else {
                    this.loadMoreStatus = 'more';
                }
            });
        },
        jumpDetail(id) {
            uni.navigateTo({
                url: `detail?id=${id}&activity_id=${this.activityId}`,
            });
        },
    },
    onLoad() {
        this.isLogin();
    },
};
</script>
<style lang="less" scoped>
page {
    background-color: #f0f0f3;
}
.order-list-page {
    padding-top: 80upx;
    .tab-view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 80upx;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .item {
            position: relative;
            flex: 1;
            text-align: center;
            &.active {
                color: #000;
                &:after {
                    content: "";
                    width: 40upx;
                    height: 2upx;
                    background-color: #1166ff;
                    position: absolute;
                    bottom: -8upx;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }
    }
    .list-content {
        padding: 32upx 40upx;
        .item {
            border-radius: 16upx;
            background-color: #fff;
            padding: 20upx 0 0;
            margin-bottom: 32upx;
        }
        .order-number,
        .item-detail,
        .item-info,
        .item-reason,
        .address-detail {
            padding: 0 32upx;
        }
        .order-number {
            line-height: 36upx;
            margin-bottom: 34upx;
            font-size: 26upx;
            color: #666;
        }
        .item-detail {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 32upx;
            .image {
                width: 228upx;
                height: 128upx;
                margin-right: 20upx;
                & > image {
                    width: 100%;
                    height: 100%;
                }
            }
            .title {
                font-size: 28upx;
                color: #333;
                line-height: 40upx;
                word-break: break-all;
                flex: 1;
            }
        }
        .item-info {
            color: #999;
            font-size: 24upx;
            margin-bottom: 32upx;
            .score {
                margin-bottom: 20upx;
                line-height: 36upx;
                & > text {
                    display: inline-block;
                    margin-right: 8upx;
                    &:first-of-type {
                        color: #333;
                    }
                }
            }
            .text {
                color: #333;
                display: inline-block;
                margin-right: 8upx;
                font-size: 26upx;
            }
            .time,
            .reason {
                line-height: 34upx;
                display: flex;
                margin-bottom: 20upx;
                .title {
                    width: 120upx;
                }
                .text {
                    word-break: break-all;
                    flex: 1;
                }
            }
        }
        .address-detail {
            border-top: 1px solid #d8d8d8;
            line-height: 80upx;
            color: #333;
            font-size: 28upx;
            display: flex;
            & > text {
                display: inline-block;
                margin-right: 16upx;
            }
            .address {
                color: #999999;
                display: inline-block;
                word-break: break-all;
            }
        }
    }
    .no-data {
        margin-top: 100upx;
        line-height: 34upx;
        text-align: center;
        view {
            color: #999;
        }
        .image {
            width: 200upx;
            height: 200upx;
            margin: 0 auto 20upx;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
