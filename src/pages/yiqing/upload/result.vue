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
            '一幅幅春节影像作品，是最想留下的幸福瞬间！我的春节作品，正在等你来投票哦！',
            '记录新年，赢大奖！小伙伴们快来帮我投票吧～～',
            '快来看我记录的春节快乐瞬间！请为我投票，晒年味，赢好礼！',
            '快来看我家的新年有什么不一样！快来为我投票吧！晒年俗，赢大奖！',
            '家家“年味”各不同，快来围观我家的欢乐新年吧～别忘了投票哦！',
            '嗨～我在参加“记录新年赢大奖”活动，动动手指为我投票吧！',
        ];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao-banner.png',
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
