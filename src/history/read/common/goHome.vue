<template>
    <button
        class="btn goHome"
        @click="goHome"
    >
        <image
            class="arr-left"
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_home.png"
            mode=""
        />
        返回首页
    </button>
</template>

<script>
export default {
    props: {
        homePath: {
            type: String,
            default: '',
        },
    },
    methods: {
        goHome() {
            uni.reLaunch({
                url: this.homePath,
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
    border-radius: 27upx 0 0 27upx;
    line-height: 54upx;
    text-align: center;
    padding: 0;
    .arr-left {
        width: 12upx;
        height: 21upx;
        margin-right: 10upx;
    }
}
</style>
