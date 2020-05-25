<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            class="video"
            src="http://prdsecurelive.ainemo.com/prdnemo/2c949711723d1f1701724ad73ffd427f.flv?auth_key=c75d5485de0d3c52cdfd1b35bbd5c07f-1590487217-fef0ef6cfa6d44e496cfc8f8562c469e-"
            @error="error"
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
        error(e) {
            console.log(e.target.errMsg);
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
        height: 100vh;
    }
}
</style>
