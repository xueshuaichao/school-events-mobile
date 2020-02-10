<template>
    <view class="page-upload-result">
        <image
            class="icon"
            src="/static/images/yiqing/success.png"
        />
        <view>上传成功，请等待审核</view>
        <navigator
            url="/pages/yiqing/myWork/myWork?type=myWork"
            class="btn"
        >
            我的作品
        </navigator>
    </view>
</template>

<script>
export default {
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const titleList = [
            '抗击疫情“艺”起来，参与活动为武汉加油！向英雄致敬！',
        ];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http: //aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png',
            path: '/pages/chunjiehao/index',
        };
    },
};
</script>

<style lang="less">
.page-upload-result {
    background: #1154ff;
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
        background: #0084ff;
        border-radius: 55rpx;
        color: #fff;
        font-size: 36rpx;
        line-height: 110rpx;
    }
}
</style>
