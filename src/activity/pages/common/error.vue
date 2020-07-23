<template>
    <view class="error-page">
        <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/icon-404.png"
            mode=""
        />
        <view class="error-message">
            {{ message }}
        </view>
        <view class="tips">
            {{ second }}秒将跳转到{{ tips }}
        </view>
    </view>
</template>

<script>
export default {
    name: 'ErrorPage',
    props: {
        message: {
            type: String,
            default: '请求错误',
        },
        tips: {
            type: String,
            default: '首页',
        },
        path: {
            type: String,
            default: '/',
        },
    },
    data() {
        return {
            second: 5,
            timer: null,
        };
    },
    mounted() {
        this.timer = setInterval(() => {
            if (this.second === 0) {
                clearInterval(this.timer);
                this.backHome();
            } else {
                this.second -= 1;
            }
        }, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        backHome() {
            uni.reLaunch({
                url: this.path,
            });
        },
    },
};
</script>
<style lang="less" scoped>
.error-page {
    padding-top: 204upx;
    background-color: #fff;
    min-height: 100vh;
    box-sizing: border-box;
    & > image {
        width: 300upx;
        height: 204upx;
        margin: 0 auto 54upx;
        display: block;
    }
    .error-message {
        font-size: 36upx;
        line-height: 50upx;
        color: #333;
        font-weight: 600;
        margin-bottom: 24upx;
        text-align: center;
    }
    .tips {
        text-align: center;
        font-size: 30upx;
        line-height: 34upx;
        color: #999;
    }
}
</style>
