<template>
    <view class="mall-page">
        <view class="main-content">
            <view class="banner-content">
                <view class="tips">
                    <view class="icon" />
                    <view>亲，你有200积分，将于9月30日之前清零哦～</view>
                </view>
                <view class="integral-content">
                    <view class="text-content">
                        可用积分
                        <view class="num text-one-line">
                            1000
                        </view>
                    </view>
                </view>
                <view class="handel-content">
                    <view class="item">
                        <view class="icon icon-1" />
                        我的兑换
                    </view>
                    <view class="item">
                        <view class="icon icon-2" />
                        积分规则
                    </view>
                    <view class="item">
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
            padding: 16upx 39upx;
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
    }
}
</style>
