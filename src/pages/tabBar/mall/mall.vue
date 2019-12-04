<template>
    <view class="page-mall">
        <view class="top-sec">
            <image
                class="banner"
                src="/static/images/mall/banner.png"
            />
            <view class="menu">
                <view class="item">
                    <image
                        class="icon"
                        src="/static/images/mall/coin.png"
                    />
                    <template v-if="!isLoading">
                        <view
                            v-if="userInfo.name"
                            class="text need-login"
                        >
                            {{ userInfo.challenge_coin }}
                        </view>
                        <view
                            v-if="!userInfo.name"
                            class="text need-login"
                        >
                            登录查看挑战币
                        </view>
                    </template>
                </view>
                <view class="item">
                    <image
                        class="icon"
                        src="/static/images/mall/record.png"
                    />
                    <view class="text">
                        兑换记录
                    </view>
                </view>
                <navigator
                    class="item"
                    :url="`/pages/doc/detail/detail?id=earn-coin`"
                >
                    <image
                        class="icon"
                        src="/static/images/mall/doc.png"
                    />
                    <view class="text">
                        如何赚挑战币
                    </view>
                </navigator>
            </view>
        </view>

        <gift-list
            v-for="item in giftList"
            :key="item.cat_name"
            :data="item"
        />

        <view class="btm-sec">
            <image
                class="banner"
                src="/static/images/mall/continue.png"
            />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import GiftList from '../../../components/gift-list/index.vue';

export default {
    components: {
        GiftList,
    },
    data() {
        return {
            isLoading: true,
            giftList: [],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
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

            api.get('/api/market/gift').then((data) => {
                this.giftList = data;
            });
        },
    },
};
</script>

<style lang="less">
.page-mall {
    background: rgba(247, 247, 247, 1);

    .top-sec {
        background: #fff;

        .banner {
            display: block;
            width: 690rpx;
            height: 280rpx;
            margin: 30rpx auto 40rpx;
        }
    }

    .menu {
        display: flex;
        padding-bottom: 35rpx;

        .item {
            flex: 1;
            text-align: center;

            .icon {
                width: 100rpx;
                height: 100rpx;
                margin-bottom: 10px;
            }
            .text {
                color: #333;
                font-size: 24rpx;
            }

            .need-login {
                color: #ff6e00;
            }
        }
    }

    .btm-sec {
        margin-top: 30rpx;
        padding-bottom: 60rpx;

        .banner {
            width: 690rpx;
            height: 120rpx;
            display: block;
            margin: 0 auto;
        }
    }
}
</style>
