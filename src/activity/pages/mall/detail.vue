<template>
    <view
        v-if="loading"
        class="order-detail-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else-if="dataLoading">
            <error-page
                v-if="showError"
                message="该奖品已下架，暂不可兑换"
                tips="商城首页"
                :path="`/activity/pages/mall/index?activity_id=${activityId}`"
            />
            <template v-else>
                <view
                    class="address-detail"
                    @click="setAddress"
                >
                    <view
                        v-if="!Object.keys(addressDetail).length"
                        class="text"
                    >
                        当前没有可用地址，快去设置收件信息吧～
                    </view>
                    <template v-else>
                        <view class="address-info">
                            <view class="name-mobile">
                                <text>{{ addressDetail.name }}</text>
                                <text>{{ addressDetail.mobile }}</text>
                            </view>
                            <view class="address">
                                {{ addressDetail.address }}
                            </view>
                        </view>
                    </template>
                </view>
                <view class="shop-detail">
                    <view class="detail-info">
                        <view class="info-image">
                            <image :src="giftInfo.img | optimizeImage" />
                        </view>
                        <view class="info-text">
                            <view class="title text-one-line">
                                {{ giftInfo.name }}
                            </view>
                            <view class="price">
                                {{ giftInfo.price
                                }}<text class="unit">
                                    /{{ giftInfo.unit }}
                                </text>
                            </view>
                            <view class="num">
                                兑换数量：1
                            </view>
                        </view>
                    </view>
                </view>
                <view
                    class="btn"
                    @click="submit"
                >
                    提交
                </view>
            </template>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import share from '../common/shareMinxin';
import login from '../../../widgets/login/login.vue';
import errorPage from '../common/error.vue';

export default {
    components: {
        errorPage,
        login,
    },
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 280;
            const height = 158;
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
            // #ifdef H5
            isH5: true,
            // #endif
            activityId: '',
            loading: false,
            dataLoading: false,
            addressDetail: {},
            giftInfo: {},
            shareConfig: {},
            showError: false,
            userInfo: '',
        };
    },
    onShow() {
        uni.$once('setAddress', (data) => {
            this.id = data.id || '';
            this.addressId = data.address_id || '';
            this.activityId = data.activity_id;
        });
        this.isLogin();
    },
    onUnload() {
        uni.$off('setAddress');
    },
    beforeDestroy() {
        clearInterval(this.timer);
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
            const addressFn = this.addressId
                ? [this.getAddressInfo()]
                : [this.getDefaultAddress()];
            Promise.all([this.getGiftInfo()].concat(addressFn)).then(
                () => {
                    uni.hideLoading();
                    this.dataLoading = true;
                },
                () => {
                    uni.hideLoading();
                    this.dataLoading = true;
                },
            );
        },
        getAddressInfo() {
            return api
                .get('/api/market/getaddressinfo', {
                    id: this.addressId,
                })
                .then(
                    (res) => {
                        this.loading = true;
                        this.addressDetail = res;
                    },
                    (err) => {
                        this.loading = true;
                        uni.showToast({
                            icon: 'none',
                            title: err.message,
                        });
                    },
                );
        },
        getDefaultAddress() {
            return api.get('/api/market/defaultaddress').then(
                (res) => {
                    this.loading = true;
                    this.addressDetail = res;
                },
                (err) => {
                    this.loading = true;
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                },
            );
        },
        getGiftInfo() {
            return api
                .get('/api/market/getgiftinfo', {
                    id: this.id,
                })
                .then(
                    (res) => {
                        if (Array.isArray(res) && !res.length) {
                            this.showError = true;
                        } else {
                            this.giftInfo = res;
                        }
                    },
                    (err) => {
                        this.showError = true;
                        uni.showToast({
                            icon: 'none',
                            title: err.message,
                        });
                    },
                );
        },
        setAddress() {
            // 如果没有地址 跳至添加页面 否则跳到地址列表页
            const url = Object.keys(this.addressDetail).length
                ? `list?detail_id=${this.id}`
                : `edit?detail_id=${this.id}`;
            uni.navigateTo({
                url: `/activity/pages/mall/address/${url}&activity_id=${this.activityId}`,
            });
        },
        submit() {
            if (!this.lock) {
                this.lock = true;
                const { name, mobile, address } = this.addressDetail;
                if (!name || !mobile || !address) {
                    this.lock = false;
                    return uni.showToast({
                        title: '请选择兑换地址',
                        icon: 'none',
                    });
                }
                uni.showModal({
                    title: '兑换提示',
                    content: '最多可兑换3个奖品，确认兑换吗？',
                    cancelText: '取消',
                    confirmText: '确定',
                    cancelColor: '#999',
                    confirmColor: '#1166FF',
                    success: (res) => {
                        if (res.confirm) {
                            api.post('/api/market/pay', {
                                addressee: name,
                                mobile,
                                address,
                                gift_id: this.giftInfo.id,
                            }).then(
                                () => {
                                    this.lock = false;
                                    uni.showToast({
                                        title: '兑换成功',
                                        iocn: 'none',
                                    });
                                    uni.navigateTo({
                                        url: `/activity/pages/mall/result?activity_id=${this.activityId}`,
                                    });
                                },
                                (err) => {
                                    uni.showToast({
                                        title: err.message,
                                        icon: 'none',
                                    });
                                    this.lock = false;
                                },
                            );
                        } else if (res.cancel) {
                            this.lock = false;
                        }
                    },
                });
            }
            return true;
        },
    },

    onLoad(parms) {
        this.id = parms.id || '';
        this.addressId = parms.address_id || '';
        this.activityId = parms.activity_id;
        this.getShareConfig();
        this.initStatus = true;
    },
};
</script>
<style lang="less" scoped>
page {
    background-color: #f0f0f3;
}
.order-detail-page {
    padding: 28upx 30upx;
    .address-detail {
        position: relative;
        background-color: #ffffff;
        padding: 20upx 88upx 20upx 32upx;
        border-radius: 4upx;
        box-shadow: 0 4upx 28upx 0 rgba(0, 0, 0, 0.06);
        margin-bottom: 32upx;
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-address.png");
        background-size: 76upx 6upx;
        background-repeat: repeat-x;
        background-position: left bottom;
        &::after {
            content: "";
            position: absolute;
            right: 2px;
            top: 50%;
            margin-top: -13upx;
            right: 38upx;
            width: 26upx;
            height: 26upx;
            border-top: 1px solid #9d9d9d;
            border-right: 1px solid #9d9d9d;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
            box-sizing: border-box;
        }
    }
    .text {
        font-size: 26upx;
        color: #666;
        line-height: 128upx;
        text-align: center;
    }
    .address-info {
        margin-bottom: 32upx;
    }
    .name-mobile {
        line-height: 40upx;
        margin-bottom: 12upx;
        & > text {
            margin-right: 16upx;
            color: #333;
        }
    }
    .address {
        line-height: 36upx;
        color: #666;
    }
    .detail-info {
        display: flex;
        margin-bottom: 32upx;
        background-color: #fff;
        padding: 20upx 32upx;
        box-shadow: 0px 4upx 28upx 0px rgba(0, 0, 0, 0.06);
        border-radius: 4upx;
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
    .btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 108upx;
        line-height: 108upx;
        background-color: #1166ff;
        color: #fff;
        text-align: center;
        font-size: 36upx;
    }
}
</style>
