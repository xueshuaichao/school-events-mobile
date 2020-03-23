<template>
    <div class="page-upload-result">
        <view class="icon-wrap">
            <image
                class="icon"
                src="/static/images/upload/success.png"
            />
        </view>
        <view class="main-title">
            恭喜您，作品上传成功！管理员<br>会尽快审核,请耐心等待
        </view>
        <view class="red-text">
            您可以在管理后台查看上报作品
        </view>
        <view class="sub-title mt">
            <navigator
                url="/pages/uc/reported/reported"
                class="link mr-right"
            >
                再次上报成绩
            </navigator>
        </view>
    </div>
</template>

<style lang="less">
.page-upload-result {
    text-align: center;

    .icon-wrap {
        padding-top: 375upx;
        margin-bottom: 50upx;
    }

    .icon {
        display: inline-block;
        width: 190upx;
        height: 168upx;
    }

    .main-title {
        color: #333;
        font-size: 40upx;
        margin-bottom: 20upx;
    }
    .red-text {
        color: #999;
        font-size: 30upx;
    }

    .sub-title {
        font-size: 32upx;
        color: #333;

        .link {
            color: #1166ff;
        }

        .mr-right {
            margin-right: 40upx;
        }
    }

    .mt {
        margin-top: 40rpx;
    }
}
</style>
