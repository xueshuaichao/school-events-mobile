<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            class="video"
            src="http://prdsecurelive.ainemo.com/prdnemo/2c94982b71364816017195a0650c4ee0.m3u8?auth_key=5e139ba69e2109b383410b579e000e90-1587461400-ee51cfabfb9d43fd9d0e9674675c14b0-"
        />
    </view>
</template>

<script>
export default {
    methods: {
        handleBack() {
            uni.reLaunch({
                url: '/pages/tabBar/index/index',
            });
        },
    },
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100vh;
    position: relative;
    background: #000;

    .video {
        width: 750upx;
        height: 640upx;
    }
}
</style>
