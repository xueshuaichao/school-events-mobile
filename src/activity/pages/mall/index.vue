<template>
    <view class="mall-page">
        <view class="main-content">
            <view class="banner-content">
                <view class="tips">
                    <view class="icon" />
                    <view>
                        亲，你有{{
                            integral.useful_score
                        }}积分，将于9月30日之前清零哦～
                    </view>
                </view>
                <view class="integral-content">
                    <view class="text-content">
                        可用积分
                        <view class="num text-one-line">
                            {{ integral.score }}
                        </view>
                    </view>
                </view>
                <view class="handel-content">
                    <view
                        class="item"
                        @click="jumpOrderList"
                    >
                        <view class="icon icon-1" />
                        我的兑换
                    </view>
                    <view class="item">
                        <view class="icon icon-2" />
                        积分规则
                    </view>
                    <view
                        class="item"
                        @click="jumpIntegralList"
                    >
                        <view class="icon icon-3" />
                        积分明细
                    </view>
                </view>
                <view class="banner-cm">
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_banner_cm.png"
                    />
                </view>
            </view>

            <view class="list-content">
                <view class="title-content">
                    <text class="text">
                        好物兑换
                    </text>
                </view>
                <view class="list-item-box">
                    <template v-if="list.length">
                        <view
                            v-for="item in list"
                            :key="item.id"
                            class="item"
                            @click="exchangeItem(item)"
                        >
                            <view class="item-image">
                                <text
                                    v-if="item.num <= 0"
                                    class="item-status"
                                >
                                    已兑完
                                </text>
                                <image :src="item.img" />
                            </view>
                            <view class="item-info">
                                <view class="tit text-one-line">
                                    {{ item.name }}
                                </view>
                                <view class="price-num">
                                    <view class="price text-one-line">
                                        {{ item.price }}/{{ item.unit }}
                                    </view>
                                    <view class="num text-one-line">
                                        剩余：{{ item.num }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                    <view
                        v-else
                        class="no-data"
                    >
                        暂无可兑换商品～
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
            </view>
        </view>
        <view
            class="exchange-mask"
            :class="`${exchangeMask ? 'slide-in' : 'slide-out'}`"
        >
            <view class="mask" />
            <view class="detail-panel">
                <view class="detail-info">
                    <view class="info-image">
                        <image :src="itemDetail.img" />
                    </view>
                    <view class="info-text">
                        <view class="title text-one-line">
                            {{ itemDetail.name }}
                        </view>
                        <view class="price">
                            {{ itemDetail.price }}
                        </view>
                        <view class="num">
                            {{ itemDetail.num }}
                        </view>
                    </view>
                </view>
                <view class="handel">
                    <view
                        class="btn-item"
                        @click="toggleExchangeMask"
                    >
                        取消
                    </view>
                    <view
                        class="btn-item"
                        @click="confirmExchange(itemDetail.id)"
                    >
                        确定
                    </view>
                </view>
            </view>
        </view>
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
            activityId: 11,
            loadMoreStatus: 'none',
            list: [],
            filter: {
                page_size: 10,
                page_num: 1,
            },
            integral: {},
            exchangeDetail: {},
            itemDetail: {},
            exchangeMask: false,
        };
    },
    methods: {
        init() {
            this.getList();
            this.getIntegral();
            this.getExchangeDetail();
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getList('reachBottom');
            }
        },
        getIntegral() {
            // 获取积分兑换详情
            api.get('/api/market/userscoreinfo', {
                activity_id: this.activityId,
            }).then((res) => {
                this.integral = res;
            });
        },
        getExchangeDetail() {
            // 兑换详情（活动时间、活动状态、兑换时间、兑换状态）
            api.get('/api/market/marketinfo', {
                activity_id: this.activityId,
            }).then((res) => {
                this.exchangeDetail = res;
            });
        },
        getList(type) {
            // 商品列表
            api.get('/api/market/giftlist', {
                ...this.filter,
                activity_id: this.activityId,
            }).then(
                ({ list, total }) => {
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
                },
                () => {},
            );
        },
        jumpOrderList() {
            // 兑换列表
            uni.redirectTo({
                url: 'order_list',
            });
        },
        jumpIntegralList() {
            // 积分明细
            uni.redirectTo({
                url: 'integral_list',
            });
        },
        toggleExchangeMask() {
            this.exchangeMask = !this.exchangeMask;
        },
        exchangeItem({
            name, img, id, price, num,
        }) {
            // 兑换
            if (num <= 0) {
                return false;
            }
            if (price > this.integra) {
                return uni.showToast({
                    title: '积分不足',
                    icon: 'none',
                });
            }
            if (this.status === 2) {
                return uni.showToast({
                    title: '兑换时间已结束',
                    icon: 'none',
                });
            }
            this.itemId = id;
            this.itemDetail = {
                ...this.itemDetail,
                id,
                name,
                img,
                num,
                price,
            };
            return this.toggleExchangeMask();
        },
        confirmExchange(id) {
            uni.redirectTo({
                url: `exchange_detail?id=${id}`,
            });
        },
    },
    onLoad() {
        api.isLogin().then((res) => {
            this.userInfo = res;
            this.init();
        });
    },
};
</script>
<style lang="less" scoped>
.mall-page {
    .banner-content {
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_banner.png");
        background-position: top center;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-color: #fff;
        border-bottom: 16upx solid #f0f0f3;
        .tips {
            height: 56upx;
            line-height: 56upx;
            padding: 0 16upx;
            color: #fff;
            font-size: 26upx;
            background: linear-gradient(
                to right,
                rgba(87, 87, 87, 0.34),
                rgba(143, 143, 143, 0)
            );
            display: flex;
            align-items: center;
            .icon {
                width: 32upx;
                height: 32upx;
                margin-right: 2upx;
                background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_notice.png")
                    no-repeat center / 100% 100%;
            }
        }
        .integral-content {
            margin: -28upx auto 0;
            width: 466upx;
            height: 266upx;
            background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_circle.png")
                no-repeat center / 100% 100%;
            font-size: 28upx;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            .text-content {
                text-align: center;
                margin-top: 40upx;
            }
            .num {
                font-size: 40upx;
                font-weight: 600;
                margin-top: 8upx;
                line-height: 44upx;
                max-width: 250upx;
            }
        }
        .handel-content {
            width: 670upx;
            padding: 16upx 39upx 26upx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            border-radius: 16upx;
            background-color: #fff;
            box-sizing: border-box;
            box-shadow: 0px 8upx 20upx 0px rgba(0, 0, 0, 0.15);
            .item {
                margin: 0 39upx;
                text-align: center;
                font-size: 24upx;
                color: #000;
                text-align: center;
                line-height: 34upx;
            }
            .icon {
                width: 120upx;
                height: 120upx;
                background-size: 100% 100%;
                margin-bottom: 2upx;
                &.icon-1 {
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_1.png");
                }
                &.icon-2 {
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_2.png");
                }
                &.icon-3 {
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_3.png");
                }
            }
        }
        .banner-cm {
            padding: 26upx 30upx;
            height: 180upx;
            box-sizing: border-box;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
    }
    .no-data {
        text-align: center;
        font-size: 28upx;
        width: 100%;
        margin-top: 40upx;
    }
    .list-content {
        padding: 0 20upx;
        .title-content {
            padding: 32upx 0 34upx;
            text-align: center;
            .text {
                position: relative;
                color: #333;
                font-size: 36upx;
                font-weight: bold;
                &::before,
                &::after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 48upx;
                    height: 48upx;
                    background-size: 100% 100%;
                    background-position: center center;
                }
                &::before {
                    left: -64upx;
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_tit_2.png");
                }
                &::after {
                    right: -64upx;
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_tit_1.png");
                }
            }
        }
        .list-item-box {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding-top: 32upx;
            .item {
                box-shadow: 0 4upx 12upx 0 rgba(0, 0, 0, 0.15);
                width: 345upx;
                border-radius: 10upx;
                margin-bottom: 32upx;
            }
            .item-image {
                position: relative;
                height: 196upx;
                image {
                    width: 100%;
                    height: 100%;
                    border-radius: 10upx 10upx 0 0;
                }
                .item-status {
                    position: absolute;
                    top: 18upx;
                    left: 0;
                    height: 44upx;
                    line-height: 44upx;
                    padding: 0 16upx;
                    border-radius: 0 26upx 26upx 0;
                    z-index: 1;
                    color: #fff;
                    font-size: 24upx;
                    background: linear-gradient(
                        231deg,
                        rgba(255, 200, 44, 1) 0%,
                        rgba(255, 172, 0, 1) 100%
                    );
                }
            }
            .item-info {
                padding: 20upx 24upx;
                .tit {
                    font-size: 28upx;
                    color: #333;
                    line-height: 40upx;
                    margin-bottom: 22upx;
                }
                .price-num {
                    display: flex;
                    justify-content: space-between;
                    font-size: 24upx;
                    line-height: 34upx;
                    .price {
                        color: #ffaf03;
                        position: relative;
                        padding-left: 40upx;
                        max-width: 50%;
                        box-sizing: border-box;
                        &::before {
                            content: "";
                            position: absolute;
                            top: 50%;
                            left: 0;
                            transform: translateY(-50%);
                            width: 32upx;
                            height: 32upx;
                            background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_money.png")
                                no-repeat center / 100% 100%;
                        }
                    }
                    .num {
                        max-width: 50%;
                        color: #72777d;
                    }
                }
            }
        }
    }
    .exchange-mask {
        position: fixed;
        z-index: 100;
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        bottom: 0;
        z-index: 101;
        backface-visibility: hidden;
        transform: translate(0, 100%);
        transition: transform 0.3s;
        .mask {
            position: fixed;
            z-index: 1;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
        }
        .detail-panel {
            position: absolute;
            height: 372upx;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: #fff;
            z-index: 2;
            padding: 30upx;
            box-sizing: border-box;
            .detail-info {
                display: flex;
                margin-bottom: 32upx;
                .info-image {
                    width: 280upx;
                    height: 158upx;
                    margin-right: 24upx;
                    & > image {
                        width: 100%;
                        height: 100%;
                    }
                }
                .info-text {
                    .title {
                        font-size: 28upx;
                        color: #333;
                        line-height: 40upx;
                        margin-bottom: 20upx;
                    }
                    .price {
                        color: #ffaf03;
                        position: relative;
                        padding-left: 40upx;
                        max-width: 50%;
                        box-sizing: border-box;
                        margin-bottom: 20upx;
                        &::before {
                            content: "";
                            position: absolute;
                            top: 50%;
                            left: 0;
                            transform: translateY(-50%);
                            width: 32upx;
                            height: 32upx;
                            background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_money.png")
                                no-repeat center / 100% 100%;
                        }
                    }
                    .num {
                        color: #72777d;
                        font-size: 24upx;
                        line-height: 34upx;
                    }
                }
            }
            .handel {
                display: flex;
                justify-content: center;
                .btn-item {
                    border: 1px solid #ccc;
                    height: 64upx;
                    line-height: 64upx;
                    box-sizing: border-box;
                    color: #666;
                    font-size: 28upx;
                    background-color: #fff;
                    margin: 0 44upx;
                    padding: 0 48upx;
                    border-radius: 32upx;
                    &:last-of-type {
                        background-color: #1166ff;
                        border-color: #1166ff;
                        color: #fff;
                    }
                }
            }
        }
        &.slide-in {
            animation: slideIn ease 0.3s forwards;
        }
        &.slide-out {
            animation: slideOut ease 0.3s forwards;
        }

        @keyframes slideIn {
            from {
                -webkit-transform: translate3d(0, 100%, 0);
                transform: translate3d(0, 100%, 0);
            }
            to {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
        }
        @keyframes slideOut {
            from {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0);
            }
            to {
                -webkit-transform: translate3d(0, 100%, 0);
                transform: translate3d(0, 100%, 0);
            }
        }
        .slide-in {
            animation: slideIn ease 0.3s forwards;
        }
        .slide-out {
            animation: slideOut ease 0.3s forwards;
        }
    }
}
</style>
