<template>
    <button
        class="btn goHome"
        @click="goHome"
    >
        返回首页
    </button>
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            default: '',
        },
    },
    methods: {
        goHome() {
            uni.reLaunch({
                url: this.path,
            });
        },
    },
};
</script>
<style lang="less">
.goHome {
    position: fixed;
    bottom: 40upx;
    right: 0upx;
    color: #08402f;
    font-size: 24upx;
    width: 166upx;
    height: 54upx;
    background: #fff;
    border-radius: 100upx 0 0 100upx;
    line-height: 54upx;
    text-align: right;
    padding-right: 20upx;
    &::before {
        content: "";
        position: absolute;
        left: 26rpx;
        top: 20rpx;
        width: 14rpx;
        height: 14rpx;
        transform: rotate(-135deg);
        box-sizing: border-box;
    }
}
</style>
