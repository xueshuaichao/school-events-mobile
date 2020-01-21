<template>
    <view class="page-download-app">
        <view
            v-if="type !== 'android'"
            class="text"
        >
            <view>爱挑战{{ type === "ios" ? "IOS版" : "相关版本" }}</view>
            <view>近期上线，敬请期待!</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            type: 'android',
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
            if (isAndroid) {
                window.location = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/apk/app-andriod.apk';
            } else if (isIos) {
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
    padding: 120rpx 0;
    font-size: 32rpx;
    color: #333;
    .text {
        text-align: center;
        line-height: 60rpx;
    }
}
</style>
