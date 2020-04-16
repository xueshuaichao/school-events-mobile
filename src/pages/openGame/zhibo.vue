<template>
    <view class="main">
        <!-- <Icon class="success-icon" type="checkmark-circled" color="#3BCC70" size="60px"></Icon> -->
        <video
            src="http://prdsecurelive.ainemo.com/prdnemo/2c949824713649570171819755361521.m3u8?auth_key=b4218638e43e57952f5df736335d1367-1587110880-5da384e65aab41f4aacd7494fdea1ad6-"
        />
        <image
            class="success-icon"
            src="/static/images/zhibo/success-icon.png"
        />
        <view class="success-text">
            您已报名成功
        </view>
        <navigator url="/pages/openGame/successInfo">
            <text class="success-info">
                查看报名信息
            </text>
        </navigator>
        <text
            class="success-back"
            @click="handleBack"
        >
            返回首页
        </text>
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
    .success-icon {
        position: absolute;
        top: 200upx;
        left: 315upx;
        width: 120upx;
        height: 120upx;
    }
    .success-text {
        position: absolute;
        top: 380upx;
        left: 279upx;
        color: #333333;
        font-size: 32upx;
    }
    .success-info {
        position: absolute;
        top: 462upx;
        left: 291upx;
        color: #1166ff;
        font-size: 28upx;
    }
    .success-back {
        position: absolute;
        color: #999999;
        font-size: 28upx;
        bottom: 16upx;
        left: 321upx;
    }
}
</style>
