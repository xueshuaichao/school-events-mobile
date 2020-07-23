<template>
    <view class="result-page">
        <view class="icon-wrap">
            <image
                class="icon icon-success"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-result.png"
            />
        </view>
        <view class="main-title">
            恭喜您，兑换成功!
        </view>
        <view class="sub-title">
            <view class="tips">
                兑换申请已提交至后台处理，请耐心等待～
            </view>
            <text
                class="link btn mr-right"
                @click="jumpOrderList"
            >
                查看兑换
            </text>
            <text
                class="link btn blue-bg"
                @click="jumpMallIndex"
            >
                继续兑换
            </text>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import share from '../common/shareMinxin';

export default {
    mixins: [share.initShare],
    data() {
        return {
            userInfo: {},
            activityId: '',
            publicConfig: {},
            resultConfig: {},
        };
    },
    onLoad(parms) {
        this.activityId = parms.activity_id || 12;
        this.getShareConfig(this.activityId);
    },
    methods: {
        getUserInfo() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                },
                () => {
                    this.isLoading = false;
                },
            );
        },
        jumpOrderList() {
            uni.redirectTo({
                url: `/activity/pages/mall/order/list?status=1&activity_id=${this.activityId}`,
            });
        },
        jumpMallIndex() {
            uni.redirectTo({
                url: `index?activity_id=${this.activityId}`,
            });
        },
    },
};
</script>
<style lang="less">
.result-page {
    min-height: 100vh;
    text-align: center;
    background-color: #fff;

    .icon-wrap {
        padding-top: 270upx;
        margin-bottom: 50upx;
    }

    .icon {
        display: inline-block;
        width: 242upx;
        height: 214upx;
    }

    .main-title {
        color: #333333;
        font-size: 40upx;
        margin-bottom: 20upx;
        font-weight: bold;
    }

    .sub-title {
        font-size: 32upx;
        color: #333333;
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
            color: #1166ff;
            border-radius: 55upx;
        }
        .link.blue-bg {
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
