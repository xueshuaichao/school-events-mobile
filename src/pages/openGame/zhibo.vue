<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            class="video"
            src="http://prdsecurelive.ainemo.com/prdnemo/2c949824713649570171819755361521.m3u8?auth_key=b4218638e43e57952f5df736335d1367-1587110880-5da384e65aab41f4aacd7494fdea1ad6-"
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
