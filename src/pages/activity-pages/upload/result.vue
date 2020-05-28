<template>
    <view :class="[`${publicConfig.activityName}-page`]">
        <div class="page-read-upload-result">
            <view class="icon-wrap">
                <image
                    v-if="publicConfig.activityName"
                    class="icon icon-success"
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_success.png`
                    "
                />
            </view>
            <view class="main-title">
                恭喜您，上传成功!
            </view>
            <view class="sub-title">
                <view
                    v-if="addNum === 1"
                    class="tips"
                >
                    恭喜您获得一次抽奖机会，快去抽大奖吧！
                </view>
                <view
                    v-else
                    class="tips"
                >
                    管理员会尽快审核，请耐心等候！
                </view>
                <text
                    class="link btn mr-right"
                    :style="{
                        color: publicConfig.primaryColor,
                        'border-color': publicConfig.primaryColor
                    }"
                    @click="reUpload"
                >
                    再次上传作品
                </text>
                <text
                    class="link btn blue-bg"
                    :style="{
                        'background-color': publicConfig.primaryColor,
                        'border-color': publicConfig.primaryColor
                    }"
                    @click="goToUc"
                >
                    查看作品
                </text>
            </view>
            <view
                v-if="addNum === 1"
                class="add-img"
                @click="jumpHome"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_add.png"
                />
            </view>
            <goHome
                :path="publicConfig.homePath"
                :text-color="publicConfig.primaryColor"
                :name="publicConfig.activityName"
            />
        </div>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            activityId: '',
            publicConfig: {},
            resultConfig: {},
            addNum: 0, // 六一活动上传次数
        };
    },
    onLoad(params) {
        this.activityId = params.activity_id;
        this.publicConfig = this.$store.getters.getPublicConfig(
            this.activityId,
        );
        this.resultConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'resultConfig',
        });
        if (this.activityId === '9') {
            this.getLotteryNum();
        }
    },
    methods: {
        reUpload() {
            uni.reLaunch({
                url: `/pages/activity-pages/upload/modify?activity_id=${this.activityId}`,
            });
        },
        goToUc() {
            uni.reLaunch({
                url: `/pages/activity-pages/mywork/mywork?status=1&type=myWork&activity_id=${this.activityId}`,
            });
        },
        getLotteryNum() {
            api.get('/api/activity/getuserlotterynum').then((res) => {
                this.addNum = Number(res.add_activity);
            });
        },
        jumpHome() {
            uni.reLaunch({
                url: '/pages/pages/children/index',
            });
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const titleList = this.publicConfig.shareConfig.title;
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.homePath,
        };
    },
};
</script>
<style lang="less">
.page-read-upload-result {
    min-height: 100vh;
    text-align: center;
    background-color: #a1debe;

    .icon-wrap {
        padding-top: 270upx;
        margin-bottom: 50upx;
    }

    .icon {
        display: inline-block;
        width: 140upx;
        height: 140upx;
    }

    .main-title {
        color: #08402f;
        font-size: 40upx;
        margin-bottom: 20upx;
        font-weight: bold;
    }

    .sub-title {
        font-size: 32upx;
        color: #08402f;
        .tips {
            color: #08402f;
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
            border: 1px solid #0f8c64;
            text-align: center;
            display: inline-block;
            min-width: 236upx;
            color: #0f8c64;
            border-radius: 55upx;
        }
        .link.blue-bg {
            background-color: #0f8c64;
            color: #fff;
        }

        .mr-right {
            margin-right: 40upx;
        }
    }

    .mt {
        margin-top: 40rpx;
    }
    @keyframes mymove {
        0% {
            transform: scale(1); /*开始为原始大小*/
        }
        25% {
            transform: scale(1.04); /*放大1.1倍*/
            // margin-right: 26upx;
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.04);
            // margin-right: 26upx;
        }
    }
    .add-img {
        width: 322upx;
        height: 133upx;
        display: block;
        margin: 30upx auto 0;
        animation: mymove 2s infinite;
        & > image {
            width: 100%;
            height: 100%;
        }
    }
    .goHome {
        position: fixed;
        bottom: 40upx;
        right: 0upx;
        color: #0f8c64;
        font-size: 24upx;
        width: 166upx;
        height: 54upx;
        background: #fff;
        border-radius: 27upx 0 0 27upx;
        line-height: 54upx;
        text-align: center;
        padding: 0;
        .arr-left {
            width: 12upx;
            height: 21upx;
            margin-right: 10upx;
        }
    }
}
@import "../theme/upload.less";
</style>
