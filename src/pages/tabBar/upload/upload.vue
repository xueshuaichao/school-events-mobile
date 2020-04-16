<template>
    <view class="page-upload-btns">
        <view class="title">
            参加活动，赢好礼
        </view>
        <view class="sub-title">
            秀才艺
        </view>
        <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/upload-girl1.png"
        />
        <!-- <navigator
            url="/pages/upload/default/upload"
            class="swiper-item"
        > -->
        <view
            class="btn"
            @click="jumpRoute()"
        >
            报名参加
        </view>
        <!-- </navigator> -->
        <view class="sub-title">
            世界读书日
        </view>
        <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/upload-girl2.png"
        />
        <!-- <navigator
            url="/pages/read/upload/modify"
            class="swiper-item"
        > -->
        <view
            class="btn"
            @click="jumpRoute('read')"
        >
            报名参加
        </view>
        <!-- </navigator> -->
    </view>
</template>

<script>
import api from '../../../common/api';
import logger from '../../../common/logger';

export default {
    data() {
        return {
            fr: '',
        };
    },
    methods: {
        jumpRoute(activity) {
            if (activity === 'read') {
                this.fr = logger.getFr('dshd', {});
                console.log(this.fr);
            }
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    if (activity) {
                        uni.navigateTo({
                            url: '/pages/read/upload/modify',
                        });
                    } else {
                        uni.navigateTo({
                            url: '/pages/upload/default/upload',
                        });
                    }
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
    },
};
</script>

<style lang="less" scoped>
.page-upload-btns {
    text-align: center;
    .title {
        font-size: 34upx;
        font-weight: 600;
        line-height: 40upx;
        margin-top: 90upx;
        margin-bottom: 50upx;
        color: #333;
    }
    image {
        width: 200upx;
        height: 200upx;
    }
    .sub-title {
        font-size: 28upx;
        line-height: 40upx;
        margin: 20upx 0;
    }
    .btn {
        width: 200upx;
        height: 60upx;
        line-height: 60upx;
        color: #fff;
        font-size: 24upx;
        text-align: center;
        margin-bottom: 40upx;
        border-radius: 30upx;
        background: #1165ff;
        box-shadow: -3upx 5upx 6upx 0 rgba(17, 101, 255, 0.3);
        margin: 50upx auto;
    }
}
</style>
