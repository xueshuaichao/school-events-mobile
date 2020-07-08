<template>
    <view class="mall-page">
        <view class="main-content">
            <view class="banner-content">
                <text>亲，你有200积分，将于9月30日之前清零哦～</text>
                <view class="integral-content">
                    <view class="text-content">
                        可用积分
                        <view>1000</view>
                    </view>
                </view>
                <view class="handel-content">
                    <view class="item">
                        <image
                            class="image"
                            src=""
                            mode=""
                        />
                        我的兑换
                    </view>
                    <view class="item">
                        <image
                            src=""
                            class="image"
                            mode=""
                        />
                        积分规则
                    </view>
                    <view class="item">
                        <image
                            src=""
                            class="image"
                            mode=""
                        />
                        积分明细
                    </view>
                </view>
            </view>

            <view class="list-content">
                <view class="titi">
                    好物兑换
                </view>
                <view class="list-item-box">
                    <view class="item" />
                </view>
            </view>
        </view>
        <view class="model" />
    </view>
</template>
<script>
export default {};
</script>
<style lang="less" scoped>
.mall-page {
    background-color: turquoise;
    .banner-content {
        .tips {
            height: 80upx;
            line-height: 80upx;
            padding: 0 40upx;
            color: #fff;
            font-size: 24upx;
            background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0.4),
                rgba(255, 255, 255, 0)
            );
        }
        .integral-content {
            margin: 0 auto;
            width: 300upx;
            height: 300upx;
        }
        .handel-content {
            width: 700upx;
            padding: 0 40upx;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            border-radius: 20upx;
            background-color: #fff;
            .item {
                margin: 0 10upx;
                text-align: center;
            }
            .image {
                width: 20upx;
                height: 20upx;
            }
        }
    }
}
</style>
