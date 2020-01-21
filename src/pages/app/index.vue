<template>
    <view class="page-download-app">
        <view
            v-if="showText"
            class="text"
        >
            <view>爱挑战iOS版</view>
            <view>近期上线，敬请期待!</view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showText: false,
        };
    },
    created() {
        this.downLoadApp();
    },
    methods: {
        downLoadApp() {
            const ua = navigator.userAgent.toLowerCase();
            const isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;
            if (isAndroid) {
                window.location = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/apk/app-andriod.apk';
            } else {
                this.showText = true;
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
