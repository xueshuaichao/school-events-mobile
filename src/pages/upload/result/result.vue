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
    </div>
</template>

<script>
export default {
    methods: {
        reUpload() {
            uni.switchTab({
                url: '/pages/tabBar/upload/upload',
            });
        },
        goToUc() {
            uni.switchTab({
                url: '/pages/tabBar/uc/uc',
            });
        },
    },
    onLoad(params) {
        this.type = params.type || 'success';
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
}
</style>
