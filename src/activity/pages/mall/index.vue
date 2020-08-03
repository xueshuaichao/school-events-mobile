<template>
    <view
        v-if="loading"
        :class="[
            'mall-page',
            {
                'stop-scroll': isShowRule
            }
        ]"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="main-content">
                <view class="banner-content">
                    <view
                        v-if="integral.useful_score"
                        class="tips"
                    >
                        <view class="icon" />
                        <view>
                            亲，你有{{ integral.useful_score }}积分，将于{{
                                exchangeDetail.pay_end_time | setTime
                            }}之前清零哦～
                        </view>
                    </view>
                    <view class="integral-content">
                        <view class="text-content">
                            可用积分
                            <view class="num text-one-line">
                                {{ integral.useful_score || 0 }}
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
                        <view
                            class="item"
                            @click="toggleRule"
                        >
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
                                    <image :src="item.img | optimizeImage" />
                                </view>
                                <view class="item-info">
                                    <view class="tit text-one-line">
                                        {{ item.name }}
                                    </view>
                                    <view class="price-num">
                                        <view class="price text-one-line">
                                            {{ item.price
                                            }}<text class="unit">
                                                /{{ item.unit }}
                                            </text>
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
                            礼品正在飞奔而来，先去努力获得积分吧~
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
                        color="#666"
                    />
                </view>
            </view>
            <view
                class="exchange-mask"
                :class="{
                    'slide-in': exchangeMask === 1,
                    'slide-out': exchangeMask === 2
                }"
            >
                <view class="mask" />
                <view class="detail-panel">
                    <view class="detail-info">
                        <view class="info-image">
                            <image :src="itemDetail.img | optimizeImage" />
                        </view>
                        <view class="info-text">
                            <view class="title text-one-line">
                                {{ itemDetail.name }}
                            </view>
                            <view class="price text-one-line">
                                {{ itemDetail.price
                                }}<text class="unit">
                                    /{{ itemDetail.unit }}
                                </text>
                            </view>
                            <view class="num">
                                兑换数量：1
                            </view>
                        </view>
                    </view>
                    <view class="handel">
                        <view
                            class="btn-item"
                            @click="toggleExchangeMask(2)"
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
            <view
                v-if="isShowRule"
                class="model"
            >
                <view class="model-content">
                    <view
                        class="close"
                        @click="toggleRule()"
                    >
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                            mode=""
                        />
                    </view>
                    <view class="title">
                        兑换规则
                    </view>
                    <view class="text-item">
                        <text class="index">
                            1
                        </text>
                        <view class="text">
                            用户获得一定数量的积分后，可到积分商城进行消分兑换相应礼品。
                        </view>
                    </view>
                    <view class="text-item">
                        <text class="index">
                            2
                        </text>
                        <view class="text">
                            兑换完礼品扣除相应积分后，如果积分还有剩余，用户可继续兑换积分范围内的礼品，每人最多可兑换3次。
                        </view>
                    </view>
                    <view class="text-item">
                        <text class="index">
                            3
                        </text>
                        <view class="text">
                            提交兑换礼品申请后，工作人员将在3个工作日内进行审核，审核通过后，所兑礼品将于活动结束后统一寄出。
                        </view>
                    </view>
                    <view class="text-item">
                        <text class="index">
                            4
                        </text>
                        <view class="text">
                            积分商城的礼品数量有限，先兑先得，各类礼品兑完不再补货。
                        </view>
                    </view>
                    <view class="text-item">
                        <text class="index">
                            5
                        </text>
                        <view class="text">
                            礼品兑换截至日期为9月3日18:00，如果到截至日还有积分未兑换，则积分自动清零，视为自愿放弃兑换。
                        </view>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import login from '../../../widgets/login/login.vue';
import share from '../common/shareMinxin';

export default {
    components: {
        uniLoadMore,
        login,
    },
    filters: {
        setTime(val) {
            if (val) {
                const time = val.split(' ')[0].split('-');
                return `${time[1]}月${time[2]}日`;
            }
            return '';
        },
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 345;
            const height = 196;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    mixins: [share.initShare],
    data() {
        return {
            loading: false,
            activityId: '',
            loadMoreStatus: 'none',
            list: [],
            filter: {
                page_size: 20,
                page_num: 1,
            },
            integral: {},
            exchangeDetail: {},
            itemDetail: {},
            exchangeMask: 0,
            isShowRule: false,
            userInfo: '',
        };
    },
    onShow() {
        this.filter.page_num = 1;
        this.isLogin();
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.init();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.init();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        init() {
            uni.showLoading();
            Promise.all([
                this.getList(),
                this.getIntegral(),
                this.getExchangeDetail(),
            ]).then(() => {
                uni.hideLoading();
            });
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
            return api
                .get('/api/market/userscoreinfo', {
                    activity_id: this.activityId,
                })
                .then(
                    (res) => {
                        this.integral = res;
                    },
                    (err) => {
                        console.log(err);
                    },
                );
        },
        getExchangeDetail() {
            // 兑换详情（活动时间、活动状态、兑换时间、兑换状态）
            return api
                .get('/api/market/marketinfo', {
                    activity_id: this.activityId,
                })
                .then((res) => {
                    this.exchangeDetail = res;
                });
        },
        getList(type) {
            // 商品列表
            return api
                .get('/api/market/giftlist', {
                    ...this.filter,
                    activity_id: this.activityId,
                })
                .then(
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
            uni.navigateTo({
                url: `/activity/pages/mall/order/list?activity_id=${this.activityId}`,
            });
        },
        toggleRule() {
            this.isShowRule = !this.isShowRule;
        },
        jumpIntegralList() {
            // 积分明细
            uni.navigateTo({
                url: `/activity/pages/mall/score/list?activity_id=${this.activityId}`,
            });
        },
        toggleExchangeMask(status) {
            this.exchangeMask = status;
        },
        exchangeItem(item) {
            const { num, price, id } = item;
            // 兑换
            if (this.status === 2) {
                return uni.showToast({
                    title: '兑换时间已结束',
                    icon: 'none',
                });
            }
            if (num <= 0) {
                return uni.showToast({
                    title: '该商品已兑完',
                    icon: 'none',
                });
            }
            if (price > this.integral.useful_score) {
                return uni.showToast({
                    title: '可用积分不足',
                    icon: 'none',
                });
            }
            this.itemId = id;
            this.itemDetail = {
                ...this.itemDetail,
                ...item,
            };
            return this.toggleExchangeMask(1);
        },
        confirmExchange(id) {
            this.exchangeMask = 0;
            uni.navigateTo({
                url: `/activity/pages/mall/detail?id=${id}&activity_id=${this.activityId}`,
            });
        },
    },
    onLoad(parms) {
        this.activityId = parms.activity_id || 12;
        this.getShareConfig(this.activityId);
    },
};
</script>
<style lang="less" scoped>
.mall-page {
    &.stop-scroll {
        position: fixed !important;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
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
                        max-width: 55%;
                        box-sizing: border-box;
                        font-size: 24upx;
                        .unit {
                            color: #999;
                            font-size: 24upx;
                            margin-left: 8upx;
                            display: inline-block;
                        }
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
                        max-width: 45%;
                        color: #72777d;
                        font-size: 24upx;
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
            position: absolute;
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
                    flex: 1;
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
                        font-size: 24upx;
                        .unit {
                            color: #999;
                            font-size: 24upx;
                            margin-left: 8upx;
                            display: inline-block;
                        }
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
            display: block;
        }
        &.slide-out {
            animation: slideOut ease 0.3s forwards;
        }

        @keyframes slideIn {
            from {
                transform: translate3d(0, 100%, 0);
            }
            to {
                transform: translate3d(0, 0, 0);
            }
        }
        @keyframes slideOut {
            from {
                transform: translate3d(0, 0, 0);
            }
            to {
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
    .model {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10;
        .close {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 60upx;
            height: 60upx;
            bottom: -103upx;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
        .model-content {
            width: 690upx;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 68upx 33upx 174upx;
            background-color: #fff;
            box-sizing: border-box;
            border-radius: 20upx;
            background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-index-rule.png");
            background-position: center bottom;
            background-size: 100% auto;
            background-repeat: no-repeat;
        }
        .title {
            position: absolute;
            top: -35upx;
            left: 50%;
            transform: translateX(-50%);
            height: 70upx;
            line-height: 70upx;
            background: rgba(17, 102, 255, 1);
            box-shadow: 0px 4upx 20upx 0px rgba(17, 102, 255, 0.3);
            border-radius: 35upx;
            color: #fff;
            font-size: 32upx;
            padding: 0 52upx;
        }
        .text-item {
            margin-bottom: 48upx;
            display: flex;
            .index {
                text-align: center;
                width: 40upx;
                height: 40upx;
                line-height: 40upx;
                background-color: #1166ff;
                color: #fff;
                margin-right: 14upx;
                display: inline-block;
                border-radius: 50%;
            }
            .text {
                flex: 1;
                color: #333;
                font-size: 28upx;
                line-height: 40upx;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
}
</style>
