<template>
    <div class="page-upload-result">
        <view class="icon-wrap">
            <image
                class="icon icon-success"
                src="/static/images/upload/success.png"
            />
        </view>
        <view class="sub-title">
            <view class="tips">
                重置密码成功
            </view>
        </view>
        <view class="sub-title mt">
            <text
                class="link mr-right"
                @click="goHome"
            >
                返回首页
            </text>
        </view>
    </div>
</template>

<script>
export default {
    methods: {
        goHome() {
            uni.reLaunch({
                url: '/pages/tabBar/index/index',
            });
        },
    },
};
</script>

<style lang="less">
.page-upload-result {
    text-align: center;

    .icon-wrap {
        padding-top: 270upx;
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
        font-weight: bold;
    }

    .sub-title {
        font-size: 32upx;
        color: #333;
        .tips {
            color: #999;
            font-size: 28upx;
            margin-bottom: 60upx;
        }
        .link {
            color: #1166ff;
        }
        .link.btn {
            padding: 0 34upx;
            height: 74upx;
            line-height: 74upx;
            border: 1px solid #1166ff;
            text-align: center;
            display: inline-block;
            min-width: 236upx;
        }
        .blue-bg {
            background-color: #1166ff;
            color: #fff;
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
