<template>
    <view class="page-gift-detail">
        <view class="top-main section">
            <swiper
                class="swiper"
                :indicator-dots="indicatorDots"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
                :circular="circular"
            >
                <swiper-item
                    v-for="item in data.img"
                    :key="item"
                >
                    <view class="swiper-item">
                        <image
                            class="banner-image"
                            :src="item"
                        />
                        <view class="cover" />
                    </view>
                </swiper-item>
            </swiper>
            <view class="gift-name">
                {{ data.name }}
            </view>
            <view class="gift-info">
                <view class="left">
                    <text class="em">
                        {{ data.price }}
                    </text>挑战币
                </view>
                <view class="right">
                    剩余<text class="em">
                        {{ data.stock }}
                    </text>件
                </view>
            </view>
        </view>

        <view class="section">
            <view class="title-wrap">
                <view class="line-wrap left">
                    <view class="line" />
                </view>
                <view class="title">
                    礼品介绍
                </view>
                <view class="line-wrap right">
                    <view class="line" />
                </view>
            </view>
            <view class="content page-rich-text">
                <rich-text :nodes="contentNodes" />
            </view>
        </view>

        <view class="section">
            <view class="title-wrap">
                <view class="line-wrap left">
                    <view class="line" />
                </view>
                <view class="title">
                    兑换须知
                </view>
                <view class="line-wrap right">
                    <view class="line" />
                </view>
            </view>

            <view class="content-earn-coin">
                <view class="content">
                    <text class="em">
                        1
                    </text>挑战币兑换礼品属于回馈用户活动，不提供发票、收据;
                </view>
                <view class="content">
                    <text class="em">
                        2
                    </text>商城礼品在不同阶段会有所更新，图片仅供参考，礼品以实物为准，部分商品颜色随机发放;
                </view>
                <view class="content">
                    <text class="em">
                        3
                    </text>商城兑换礼品不支持退换和售后，请当面核实无质量问题再签收;
                </view>
                <view class="content">
                    <text class="em">
                        4
                    </text>礼品寄送为普通快递，正常情况下，兑换人提出申请后 5-10
                    个工作日寄到(法定 节假日、特殊自然因素除外);
                </view>
                <view class="content">
                    <text class="em">
                        5
                    </text>手机号码解绑平台账号后，挑战币自动清零;
                </view>
                <view class="content">
                    <text class="em">
                        6
                    </text>挑战币每年的5月 31 日清零， 新一届活动开始重新计算挑战币
                </view>
            </view>
        </view>

        <view class="fixed-bottom-bar">
            <view
                class="my-coin"
                @click="goLogin"
            >
                <image
                    class="main-coin"
                    src="/static/images/mall/main-coin.png"
                />
                <view class="main-text">
                    <view>我的挑战币</view>
                    <view
                        v-if="!isLoading"
                        class="coin-num"
                    >
                        <view v-if="userInfo.name">
                            {{ userInfo.challenge_coin }}
                        </view>
                        <view v-if="!userInfo.name">
                            登录查看
                        </view>
                    </view>
                </view>
            </view>
            <view
                class="gift-coin"
                @click="handleExchange"
            >
                <text>兑换 {{ data.price }}</text>
                <image
                    class="sub-coin"
                    src="/static/images/mall/sub-coin.png"
                />
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import parseHtml from '../../../common/third-party/html-parser';

export default {
    data() {
        const { id } = this.$route.query;

        return {
            id,
            data: {},
            contentNodes: [],

            // swiper start
            indicatorDots: true,
            autoplay: false,
            interval: 2000,
            duration: 500,
            circular: true,
            // swiper end

            isLoading: true,
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            api.get(`/api/market/gift/${this.id}`).then((res) => {
                this.data = res;
                try {
                    this.contentNodes = parseHtml(res.introduction);
                } catch (e) {
                    console.log(e);
                }
            });

            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    console.log(this.userInfo);
                    this.isLoading = false;
                },
                () => {
                    this.userInfo = {};
                    this.isLoading = false;
                },
            );
        },
        goLogin() {
            if (!this.isLoading && !this.userInfo.name) {
                uni.switchTab({
                    url: '/pages/tabBar/uc/uc',
                });
            }
        },
        handleExchange() {
            console.log('跳转');
            uni.navigateTo({
                url: `/pages/address/index?id=${this.id}&title=兑换确认`,
            });
        },
    },
};
</script>

<style lang="less">
.page-gift-detail {
    background: rgba(247, 247, 247, 1);
    padding-bottom: 120rpx;

    .section {
        padding: 30rpx;
        margin-bottom: 20rpx;
        background: #fff;
    }

    .swiper {
        margin-bottom: 20rpx;

        .swiper-item {
            position: relative;
            height: 300rpx;
        }

        .banner-image {
            display: block;
            margin: 0 auto;
            height: 300rpx;
            width: auto;
        }

        .cover {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 150rpx;
            background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.03) 51%,
                rgba(0, 0, 0, 0.15) 100%
            );
        }
    }

    .gift-name {
        color: #333;
        font-size: 32rpx;
        margin-bottom: 10rpx;
    }

    .gift-info {
        overflow: hidden;
        font-size: 28rpx;
        color: #999;

        .left {
            float: left;
        }
        .right {
            float: right;
        }

        .em {
            color: #ff6e00;
        }
    }

    .title-wrap {
        display: flex;
        margin: 50rpx 0 30rpx;
        line-height: 45rpx;

        .line-wrap {
            flex: 1;
            line-height: 22rpx;

            &.left {
                text-align: right;
            }
        }

        .line {
            width: 165rpx;
            height: 2rpx;
            background: rgba(230, 230, 230, 1);
            display: inline-block;
        }
    }

    .title {
        color: #333;
        font-size: 32rpx;
        text-align: center;

        margin: 0 15rpx;
        font-weight: bold;
    }

    .page-rich-text {
        color: #666;
        line-height: 40rpx;
        font-size: 28rpx;
        word-break: break-all;
    }

    .content-earn-coin {
        padding: 30rpx;

        .hd {
            margin-bottom: 18rpx;
            color: #333;
            font-size: 32rpx;
        }

        .em {
            display: inline-block;
            width: 40rpx;
            height: 40rpx;
            background: #ccc;
            color: #fff;
            border-radius: 40rpx;
            text-align: center;
            line-height: 40rpx;
            margin-right: 10rpx;
        }

        .content {
            color: #666;
            font-size: 28rpx;
            line-height: 44rpx;
            margin-bottom: 20rpx;
        }

        .sep {
            border-top: 1rpx solid #e6e6e6;
            margin: 0 -30rpx 30rpx;
        }
    }

    .fixed-bottom-bar {
        height: 110rpx;
        text-align: center;
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        font-size: 28rpx;
        color: #333;
        border-top: 1upx solid #ddd;

        .my-coin {
            background: #fff;
            width: 300rpx;
            display: flex;
            text-align: left;

            .main-coin {
                width: 80rpx;
                margin: 15rpx 25rpx;
            }
            .main-text {
                flex: 1;
                padding-top: 15rpx;
            }

            .coin-num {
                font-size: 28rpx;
                color: #ff6e00;
            }
        }
        .gift-coin {
            flex: 1;
            background: #1166ff;
            font-size: 36rpx;
            color: #fff;
            padding-top: 24rpx;
        }

        .main-coin {
            width: 80rpx;
            height: 80rpx;
        }

        .sub-coin {
            width: 62rpx;
            height: 62rpx;
            margin-left: 10rpx;
            margin-bottom: -18rpx;
        }
    }
}
</style>
