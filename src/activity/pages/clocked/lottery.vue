<template>
    <view class="lottery-page">
        <view class="banner-content">
            <view class="handel-content">
                <view class="btn-item">
                    <view class="icon icon-lottery" />
                    我的中奖
                </view>
                <view class="btn-item">
                    <view class="icon icon-rule" />
                    抽奖攻略
                </view>
            </view>
            <view class="lottery-status-content">
                <view class="text">
                    连续打卡
                </view>
                <view class="status">
                    <view class="line" />
                    <view class="item-content">
                        <view
                            v-for="item in 4"
                            :key="item"
                            class="item"
                        >
                            <view>抽奖X{{ item }}</view>
                            <view class="icon icon-gift" />
                            <view>
                                {{ item === 4 ? "累计28天" : `${item * 7}天` }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <!-- 跑马灯 -->
            <tipsList
                text="抽中了"
                :crousel-list="crouselList"
            />
        </view>
        <view class="lottery-main">
            <lotteryDraw
                :winning="winning"
                :not-winning="notWinning"
            />
        </view>
    </view>
</template>
<script>
import lotteryDraw from '../../../components/lottery-draw.vue';
import tipsList from '../common/tips-list.vue';

export default {
    components: {
        lotteryDraw,
        tipsList,
    },
    data() {
        return {
            crouselList: [],
        };
    },
    methods: {
        winning() {},
        notWinning() {},
    },
};
</script>
<style lang="less">
page {
    background-color: #ff685c;
}
</style>
<style lang="less" scoped>
.lottery-page {
    padding-bottom: 40upx;
    .banner-content {
        padding: 0 40upx;
        height: 558upx;
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery-banner.png");
        background-position: center center;
        background-size: 100% 100%;
    }
    .handel-content {
        padding: 20upx 0 228upx;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .btn-item {
            margin-left: 20upx;
            height: 48upx;
            padding: 0 12upx;
            background-color: #0054b1;
            color: #fff;
            display: flex;
            justify-items: center;
            align-items: center;
            border-radius: 24upx;
        }
    }
    .lottery-status-content {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 4upx 10upx 0px rgba(86, 7, 0, 0.15);
        border-radius: 20upx;
        display: flex;
        align-items: center;
        padding: 20upx;
        box-sizing: border-box;
        margin-bottom: 20upx;

        .text {
            width: 116upx;
            color: #333;
            font-size: 24upx;
        }
        .status {
            flex: 1;
            position: relative;
        }
        .line {
            position: absolute;
            top: 50%;
            left: 20upx;
            right: 0upx;
            height: 4upx;
            transform: translateY(-50%);
            background-color: #ff685c;
        }
        .item-content {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            .item {
                width: 88upx;
                margin-right: 56upx;
                font-size: 22upx;
                text-align: center;
                & > view {
                    font-size: 20upx;
                    color: #333;
                    &:first-of-type {
                        font-size: 22upx;
                        color: #ff5547;
                    }
                }
                .icon-gift {
                    width: 70upx;
                    height: 70upx;
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery-icon-gift.png");
                    background-size: 100% 100%;
                    margin: 10upx auto;
                }
                &:last-of-type {
                    width: 96upx;
                    margin: 0;
                }
            }
            .status-image {
                background-color: #f00;
            }
        }
    }
    .lottery-main {
        margin-top: -48upx;
    }
}
</style>
