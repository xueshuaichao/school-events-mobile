<template>
    <view
        v-if="!isLoading"
        class="main-box"
    >
        <template v-if="title === '详情'">
            <view class="default-address">
                <!-- 添加收货地址 -->
                <image
                    class="icon-position"
                    src="/static/images/address/position.png"
                />
                <view class="first-line">
                    <text class="name">
                        {{ exchangeDetail.user_name }}
                    </text>
                    <text class="phone">
                        {{ exchangeDetail.phone }}
                    </text>
                </view>
                <text class="address">
                    {{ exchangeDetail.address }}
                </text>
            </view>

            <view class="image-box">
                <image
                    class="image"
                    :src="exchangeDetail.gift_img"
                />
                <text class="image-intro">
                    {{ exchangeDetail.gift_name }}
                </text>
            </view>
            <form>
                <view class="uni-form-item">
                    <view class="title">
                        商品单价
                    </view>
                    <view class="title">
                        <text style="color:#FF740B">
                            {{ exchangeDetail.price }}
                        </text>挑战币
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        商品数量
                    </view>
                    <view class="title">
                        {{ exchangeDetail.gift_num }}
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        商品总价
                    </view>
                    <view class="title">
                        <text style="color:#FF740B">
                            {{ exchangeDetail.total_price }}
                        </text>挑战币
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        订单状态
                    </view>
                    <view class="title">
                        <text
                            v-if="exchangeDetail.record_status === 1"
                            class="address-send"
                        >
                            待发货
                        </text>
                        <text
                            v-else
                            class="address-sent"
                        >
                            已发货
                        </text>
                        <!-- {{exchangeDetail.record_status===1?'待发货':'已发货'}} -->
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        订单编号
                    </view>
                    <view class="title">
                        {{ exchangeDetail.show_id }}
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        兑换时间
                    </view>
                    <view class="title">
                        {{ exchangeDetail.updated_at }}
                    </view>
                </view>
            </form>
        </template>
        <template v-else>
            <navigator
                v-if="exchangeDetail.address.name"
                :url="'/pages/address/address'"
            >
                <view class="default-address">
                    <image
                        class="icon-position"
                        src="/static/images/address/position.png"
                    />
                    <view class="first-line">
                        <text class="name">
                            {{ exchangeDetail.address.name }}
                        </text>
                        <text class="phone">
                            {{ exchangeDetail.address.phone }}
                        </text>
                    </view>

                    <text class="address">
                        {{ exchangeDetail.address.address }}
                    </text>
                    <image
                        class="icon-arrow"
                        src="/static/images/address/arrow.png"
                    />
                </view>
            </navigator>

            <view
                v-else
                class="default-address"
            >
                <navigator :url="'/pages/address/edit'">
                    <view class="add-address">
                        +添加收货地址
                    </view>
                </navigator>
            </view>

            <view class="image-box">
                <!-- <image class="image" :src="exchangeDetail.img[0]"></image> -->
                <image
                    class="image"
                    :src="'https://via.placeholder.com/150/24f355'"
                />

                <text class="image-intro">
                    {{ exchangeDetail.name }}
                </text>
            </view>
            <form @submit="formSubmit">
                <view class="uni-form-item">
                    <view class="title">
                        剩余数量
                    </view>
                    <view
                        style="color:#FF740B"
                        class="title"
                    >
                        {{ exchangeDetail.stock }}
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        礼品价值
                    </view>
                    <view class="title">
                        <text style="color:#FF740B">
                            {{ exchangeDetail.price }}
                        </text>挑战币
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        兑换数量
                    </view>
                    <view
                        class="title"
                        style="padding-left: 103px;box-sizing: border-box;"
                    >
                        <uni-number-box
                            :min="1"
                            :max="100"
                            @change="handleChange"
                        />
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        礼品总价
                    </view>
                    <view class="title">
                        <text style="color:#FF740B">
                            {{ totalPrice }}
                        </text>挑战币
                    </view>
                </view>
                <view class="uni-form-item">
                    <view class="title">
                        我的挑战币
                    </view>
                    <view class="title">
                        <text style="color:#FF740B">
                            {{ userPrice }}
                        </text>挑战币
                    </view>
                </view>
                <view class="uni-btn-v">
                    <button form-type="submit">
                        确定
                    </button>
                </view>
            </form>
        </template>
    </view>
</template>

<script>
import uniNumberBox from './uniNumberBoxs.vue';
import api from '../../common/api';

export default {
    components: {
        uniNumberBox,
    },
    data() {
        return {
            id: '',
            src: 'https://via.placeholder.com/150/771796',
            info: {},
            contentNodes: [],
            isLoading: true,
            recommendData: [],
            exchangeDetail: {},
            totalPrice: '',
            userPrice: 9000,
            title: '',
        };
    },
    methods: {
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
        handleChange(num) {
            this.num = num;
            this.totalPrice = this.exchangeDetail.price * num;
        },
        formSubmit() {
            if (this.totalPrice > this.userPrice) {
                uni.showToast({
                    icon: 'none',
                    title: '挑战币余额不足',
                });
                return;
            }
            if (this.num > this.exchangeDetail.stock) {
                uni.showToast({
                    icon: 'none',
                    title: '商品剩余数量不足',
                });
                return;
            }

            api.post('/api/market/giftexchange', {
                gift_id: this.id,
                gift_num: this.num,
                addr_id: this.exchangeDetail.addr_id,
            }).then(
                () => {
                    uni.showToast({
                        icon: 'none',
                        title: '兑换成功',
                    });
                    uni.navigateTo({
                        url: '/pages/address/exchangeRecord',
                    });
                },
                err => uni.showToast({
                    icon: 'none',
                    title: err.message,
                }),
            );
        },

        getData(id, title) {
            this.id = id;
            if (title === '详情') {
                api.get(`/api/market/giftrecord/${id}`).then((res) => {
                    this.isLoading = false;
                    this.exchangeDetail = res;
                });
            } else {
                api.get(`/api/market/gift/${id}`).then((res) => {
                    this.isLoading = false;
                    this.exchangeDetail = res;
                    this.exchangeDetail.addr_id = (this.exchangeDetail
                            && this.exchangeDetail.address
                            && this.exchangeDetail.address.id)
                        || '';
                });
            }
        },
    },
    onLoad(query) {
        const { id, title } = query;
        if (id) {
            this.getData(id, title);
        }

        if (title) {
            this.title = title;
            uni.setNavigationBarTitle({
                title,
            });
        }
    },
    onShow() {
        const pages = getCurrentPages(); // eslint-disable-line
        const currPage = pages[pages.length - 1];
        this.exchangeDetail = currPage.data.exchangeDetail;
    },
};
</script>

<style lang="less" scoped>
.main-box {
    font-size: 28upx;
}
.uni-btn-v button {
    width: 690upx;
    height: 110upx;
    line-height: 110upx;
    background: #1166ff;
    color: #fff;
    border-radius: 0;
    margin-top: 50upx;
}
.image-box {
    display: flex;
    height: 180upx;
    align-items: center;
    background: #fff;
    margin-top: 20upx;
    border: 1px solid #e6e6e6;
    padding: 0 15px;
}
.image {
    width: 112upx;
    height: 106upx;
    margin-right: 34upx;
}
.default-address {
    // text-align: center;
    font-size: 28upx;
    padding: 0 30upx;
    position: relative;
    height: 170upx;
    background: #fff;
    .icon-position {
        position: absolute;
        top: 50upx;
        left: 30upx;
        width: 72upx;
        height: 72upx;
    }
    .icon-arrow {
        position: absolute;
        top: 60upx;
        right: 30upx;
        width: 50upx;
        height: 50upx;
    }
    .first-line {
        top: 40upx;
        left: 122upx;
        width: 492upx;
        position: absolute;
        word-break: break-all;
        .name {
            font-size: 32upx;
            margin-right: 10upx;
            color: #333333;
            font-weight: 700;
        }
        .phone {
            font-size: 28upx;
            color: #666666;
        }
    }

    .address {
        position: absolute;
        top: 90upx;
        left: 122upx;
        color: #666666;
        font-size: 28upx;
        width: 536upx;
        word-break: break-all;
    }
}
.uni-form-item {
    padding: 30upx;
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    background: #fff;
    view:first-child {
        width: 200px;
        text-align: left;
    }
    view:nth-child(2) {
        width: 200px;
        text-align: right;
    }
    .address-send {
        display: inline-block;
        background: #fff1e6;
        color: #ff740b;
        width: 108upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;
    }
    .address-sent {
        display: inline-block;
        background: #e2f2ed;
        color: #40c69b;
        width: 108upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;
    }
}
.image-intro {
    display: inline-block;
    color: #333333;
    width: 540upx;
    font-size: 32upx;
    font-weight: 700;
    word-wrap: break-word;
}
.add-address {
    width: 380upx;
    height: 100upx;
    line-height: 100upx;
    color: #1166ff;
    text-align: center;
    border: 1upx dashed #1166ff;
    position: absolute;
    top: 34upx;
    left: 182upx;
}
</style>
