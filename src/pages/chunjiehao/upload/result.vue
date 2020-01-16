<template>
    <view class="page-upload-result">
        <image
            class="icon"
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/upload_success.png"
        />
        <view>上传成功，请等待审核</view>
        <navigator
            url="/pages/chunjiehao/myWork/myWork?type=myWork"
            class="btn"
        >
            我的作品
        </navigator>
    </view>
</template>

<script>
export default {};
</script>

<style lang="less">
.page-upload-result {
    background: #ff2e3f;
    height: 100vh;
    box-sizing: border-box;
    padding-top: 425rpx;
    text-align: center;
    color: #fff;
    font-size: 28rpx;

    .icon {
        width: 140rpx;
        height: 140rpx;
        display: block;
        margin: 0 auto 30rpx;
    }

    .btn {
        display: block;
        margin: 80rpx auto;
        width: 450rpx;
        height: 110rpx;
        background: linear-gradient(
            0deg,
            rgba(255, 149, 71, 1),
            rgba(255, 222, 152, 1)
        );
        border-radius: 55rpx;
        color: #ff2e3f;
        font-size: 36rpx;
        line-height: 110rpx;
    }
}
</style>
