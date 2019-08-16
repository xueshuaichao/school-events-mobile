<template>
    <view class="blank-wrap">
        <image
            class="blank-icon"
            src="/static/images/widgets/blank/blank.png"
        />
        <view class="text">
            暂无数据
        </view>
    </view>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.blank-wrap {
    .blank-icon {
        display: block;
        margin: 0 auto;
        width: 194upx;
        height: 194upx;
    }

    .text {
        color: #333;
        font-size: 40upx;
        margin-top: 50upx;
        text-align: center;
    }
}
</style>
