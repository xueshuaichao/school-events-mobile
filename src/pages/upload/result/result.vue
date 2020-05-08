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
            <view class="tips">
                管理员会尽快审核，请耐心等候！
            </view>
            <text
                class="link btn mr-right"
                @click="reUpload"
            >
                再次上传作品
            </text>
            <text
                class="link btn blue-bg"
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
                    url: '/pages/upload/default/upload',
                });
            } else if (this.from === 'festival') {
                uni.reLaunch({
                    url: '/pages/chunjie/upload/upload',
                });
            } else if (this.from === 'openGame') {
                uni.reLaunch({
                    url: '/pages/openGame/zhibo-list',
                });
            }
        },
        goToUc() {
            if (this.from === 'upload') {
                uni.navigateTo({
                    url: '/pages/uc/myWork/myWork?type=0',
                });
            } else if (this.from === 'festival') {
                uni.reLaunch({
                    url: '/pages/chunjie/myWork/myWork?type=myWork',
                });
            } else if (this.from === 'openGame') {
                uni.reLaunch({
                    url: '/pages/openGame/myWork/myWork?type=myWork',
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
