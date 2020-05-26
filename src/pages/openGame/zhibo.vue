<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            class="video"
            src="http://prdsecurelive.ainemo.com/prdnemo/2c949a29723d273c01724bb492cc3f8d.m3u8?auth_key=1c332100acad35b0946103819039d949-1590559200-eafc6ab0c4124a1dba68c87294fa4c51-"
            @error="error"
        />
    </view>
</template>

<script>
export default {
    mounted() {
        console.log(
            'http://prdsecurelive.ainemo.com/prdnemo/2c949a29723d273c01724bb492cc3f8d.m3u8?auth_key=1c332100acad35b0946103819039d949-1590559200-eafc6ab0c4124a1dba68c87294fa4c51-',
            'url',
        );
    },
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
