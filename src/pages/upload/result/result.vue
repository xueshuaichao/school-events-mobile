<template>
    <div class="page-upload-result">
        <view class="icon-wrap">
            <image
                v-if="type === 'success'"
                class="icon icon-success"
                src="/static/images/upload/success.png"
            />
            <image
                v-else
                class="icon icon-fail"
                src="/static/images/upload/fail.png"
            />
        </view>

        <view
            v-if="type === 'success'"
            class="main-title"
        >
            恭喜您，上传成功!
        </view>
        <view
            v-if="type === 'fail'"
            class="main-title"
        >
            很抱歉，上传失败!
        </view>
        <view
            v-if="type === 'deny'"
            class="main-title"
        >
            很抱歉
        </view>

        <view
            v-if="type === 'success'"
            class="sub-title"
        >
            <text
                class="link mr-right"
                @click="reUpload"
            >
                再次上传作品
            </text>
            <text
                class="link"
                @click="goToUc"
            >
                查看作品
            </text>
        </view>
        <view
            v-if="type === 'fail'"
            class="sub-title"
        >
            <text class="mr-right">
                请重新编辑后再次
            </text>
            <text
                class="link"
                @click="reUpload"
            >
                上传作品
            </text>
        </view>
        <view
            v-if="type === 'deny'"
            class="sub-title"
        >
            您无参赛资格，谢谢参与！
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
    data() {
        return {
            type: '',
            from: '',
        };
    },
    methods: {
        reUpload() {
            if (this.from === 'upload') {
                uni.switchTab({
                    url: '/pages/tabBar/upload/upload',
                });
            } else if (this.from === 'festival') {
                uni.reLaunch({
                    url: '/pages/chunjie/upload/upload',
                });
            }
        },
        goToUc() {
            if (this.from === 'upload') {
                uni.reLaunch({
                    url: '/pages/tabBar/uc/uc',
                });
            } else if (this.from === 'festival') {
                uni.reLaunch({
                    url: '/pages/chunjie/myWork/myWork?type=myWork',
                });
            }
        },
        goHome() {
            uni.reLaunch({
                url: '/pages/tabBar/index/index',
            });
        },
    },
    onLoad(params) {
        this.type = params.type || 'success';
        this.from = params.from || 'upload';
    },
};
</script>

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
