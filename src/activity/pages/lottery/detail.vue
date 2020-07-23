<template>
    <view
        v-if="loading"
        class="order-detail-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <error-page
                v-if="showError"
                message="奖品不存在"
                tips="商城首页"
                :path="`/activity/pages/mall/index?activity_id=${activityId}`"
            />
            <template v-else-if="detailLoading">
                <view class="address-content">
                    <view
                        v-if="!detailData.address"
                        class="text"
                    >
                        当前没有可用地址，快去设置收件信息吧～
                    </view>
                    <template v-else>
                        <view class="name-mobile">
                            <text>{{ detailData.address.name }}</text>
                            <text>{{ detailData.address.mobile }}</text>
                        </view>
                        <view class="address">
                            {{ detailData.address.address }}
                        </view>
                    </template>
                </view>
                <view class="detail-content">
                    <view class="item">
                        <view class="item-detail">
                            <view class="image">
                                <image
                                    :src="detailData.image"
                                    mode=""
                                />
                            </view>
                            <view class="title">
                                {{ detailData.prize_name }}
                            </view>
                        </view>
                        <view class="item-info">
                            <view class="time">
                                <view class="title">
                                    兑换时间：
                                </view>
                                <view class="text">
                                    {{ detailData.created_at }}
                                </view>
                            </view>
                            <view
                                v-if="detailData.status === 3"
                                class="reason"
                            >
                                <view class="title">
                                    驳回原因：
                                </view>
                                <view class="text">
                                    {{ detailData.reason }}
                                </view>
                            </view>
                        </view>
                        <view
                            v-if="detailData.logistics"
                            class="item-delivery"
                        >
                            <text>
                                物流信息：{{ detailData.logistics.name }}
                            </text><text>{{ detailData.logistics.code }}</text>
                            <text
                                class="icon icon-copy"
                                @click="
                                    copyDeliveryCode(detailData.logistics.code)
                                "
                            />
                        </view>
                    </view>
                </view>
                <view class="tips-content">
                    <template v-if="detailData.logistics">
                        ～可复制快递单号到快递官网查询快递进度～
                    </template>
                    <template v-else>
                        ～奖品寄出后将通过消息通知您～
                    </template>
                </view>
            </template>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';
import utils from '../../../common/utils';
import share from '../common/shareMinxin';
import errorPage from '../common/error.vue';

export default {
    components: {
        login,
        errorPage,
    },
    mixins: [share.initShare],
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            loading: false,
            detailLoading: false,
            detailData: {},
            userInfo: '',
            showError: false,
        };
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getData();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getData();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        getData() {
            api.get('/api/draw/info', {
                id: this.id,
            }).then(
                (res) => {
                    this.detailLoading = true;
                    if (Array.isArray(res) && !res.length) {
                        this.showError = true;
                    } else {
                        this.detailData = res;
                    }
                },
                (err) => {
                    uni.showToast({
                        title: err.message,
                        icon: 'none',
                    });
                },
            );
        },
        copyDeliveryCode(data) {
            if (this.isH5) {
                utils.handleClipboard(
                    data,
                    // eslint-disable-next-line no-restricted-globals
                    event,
                    () => {
                        this.copyToast(true);
                    },
                    () => {
                        this.copyToast(false);
                    },
                );
            } else {
                uni.setClipboardData({
                    data,
                    success: () => {
                        this.copyToast(true);
                    },
                    fail: () => {
                        this.copyToast(false);
                    },
                });
            }
        },
        copyToast(status) {
            uni.showToast({
                icon: 'none',
                title: status ? '物流单号复制成功' : '复制失败，可长按复制',
            });
        },
    },
    onLoad(parms) {
        this.id = parms.id;
        this.activityId = parms.activity_id;
        this.getShareConfig();
        this.isLogin();
    },
};
</script>
<style lang="less">
page {
    background-color: #f0f0f3;
}
</style>
<style lang="less" scoped>
.order-detail-page {
    .address-content {
        background-color: #ffffff;
        margin-bottom: 20upx;
        padding: 20upx 40upx 40upx;
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-address.png");
        background-size: 76upx 6upx;
        background-repeat: repeat-x;
        background-position: left bottom;
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
    }
    .detail-content {
        background-color: #ffffff;
        margin-bottom: 48upx;
        .item {
            border-radius: 16upx;
            background-color: #fff;
            padding: 20upx 42upx 0upx;
            overflow: hidden;
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
        .item-delivery {
            border-top: 1px solid #d8d8d8;
            min-height: 98upx;
            display: flex;
            align-items: center;
            color: #999;
            font-size: 24upx;
            & > text {
                display: inline-block;
                margin-right: 8upx;
            }
            .icon {
                margin-left: 8upx;
                width: 32upx;
                height: 32upx;
                background-image: url("../../static/icon_copy.png");
                background-size: 100% 100%;
            }
        }
    }
    .tips-content {
        line-height: 36upx;
        text-align: center;
        color: #999;
        font-size: 26upx;
    }
}
</style>
