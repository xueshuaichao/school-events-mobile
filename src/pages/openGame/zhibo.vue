<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            class="video"
            src="http://prdsecurelive.ainemo.com/prdnemo/2c949a29723d273c01724bb492cc3f8d.flv?auth_key=b9d901b908c48cae7d82a9d1298e23ce-1590559200-f86085360118473483d601689da2681e-"
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
