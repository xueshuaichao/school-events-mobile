<template>
    <view class="page-download-app">
        <view
            v-if="type !== 'android'"
            class="ios-text text"
        >
            <view>爱挑战{{ type === "ios" ? "IOS版" : "相关版本" }}</view>
            <view>近期上线，敬请期待!</view>
        </view>
        <view
            v-else-if="isWechat"
            class="android-mask"
        >
            <view class="step1">
                <text class="step-icon" />
            </view>
            <view class="step2">
                <text>1、点击右上角</text><text class="step-icon" />
            </view>
            <view class="step3">
                <text class="step-icon" />
            </view>
            <view class="step4">
                <view class="step4-text">
                    <view>2、在菜单中点击</view>
                    <text class="tips">
                        (在浏览器中打开）
                    </text>
                </view>
                <text class="step-icon" />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            type: 'android',
            isWechat: false,
        };
    },
    created() {
        this.downLoadApp();
    },
    methods: {
        downLoadApp() {
            const ua = navigator.userAgent;
            const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            const isIos = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
            const isWechat = /MicroMessenger/.test(navigator.userAgent);
            if (isAndroid) {
                if (isWechat) {
                    this.isWechat = true;
                } else {
                    window.location.href = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/apk/app-andriod.apk${
                        new Date()}`;
                }
            } else if (isIos) {
                if (isWechat) {
                    this.isWechat = true;
                } else {
                    console.log('ios------');
                    window.open(
                        `https://apps.apple.com/cn/app/up%E7%88%B1%E6%8C%91%E6%88%98/id1495615436?date=${
                            new Date()}`,
                    );
                }
                this.type = 'ios';
            } else {
                this.type = 'other';
            }
        },
    },
};
</script>

<style lang="less">
.page-download-app {
    .ios-text {
        padding: 120rpx 0;
        font-size: 32rpx;
        color: #333;
    }
    .text {
        text-align: center;
        line-height: 60rpx;
    }
    .android-mask {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.7);
        text-align: right;
        color: #fff;
        font-size: 36rpx;
    }
    .step-icon {
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 100% 100%;
        display: inline-block;
        margin-bottom: 1rpx;
        margin-left: 15rpx;
        vertical-align: middle;
    }
    .step1 {
        .step-icon {
            background-image: url("../../static/images/app/step1.png");
            width: 114rpx;
            height: 151rpx;
            margin-right: 56rpx;
        }
    }
    .step2 {
        .step-icon {
            background-image: url("../../static/images/app/step2.png");
            width: 141rpx;
            height: 141rpx;
            margin-right: 125rpx;
        }
    }
    .step3 {
        margin: 76rpx 0;
        .step-icon {
            background-image: url("../../static/images/app/step3.png");
            background-size: 43rpx 45rpx;
            width: 43rpx;
            height: 45rpx;
            margin-right: 174rpx;
        }
    }
    .step4 {
        height: 141rpx;
        .step-icon {
            background-image: url("../../static/images/app/step4.png");
            width: 141rpx;
            height: 141rpx;
            margin-right: 125rpx;
        }
        .step4-text {
            display: inline-block;
            position: relative;
            top: 30rpx;
        }
        .tips {
            font-size: 29rpx;
        }
    }
}
</style>
