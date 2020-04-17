<template>
    <view class="page-upload">
        <view class="item-card">
            <image
                class="banner"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/read-banner.png"
            />
            <view class="top clearfix">
                <text class="title fl-l">
                    世界读书日
                </text>
                <text class="count fl-r">
                    {{ activity_num }}人关注
                </text>
            </view>
            <view class="btm clearfix">
                <image
                    class="time fl-l"
                    src="/static/images/upload/time.png"
                />
                <view class="fl-l time-start-end">
                    活动日期：4月20日-5月8日
                </view>
                <view
                    class="join-game fl-r"
                    @click="jumpRoute"
                >
                    立即参加
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import logger from '../../../common/logger';

export default {
    data() {
        return {
            fr: '',
            activity_num: 8659,
        };
    },
    methods: {
        jumpRoute() {
            this.fr = logger.getFr('dshd', {});
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    uni.navigateTo({
                        url: '/pages/read/upload/modify',
                    });
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
    },
    onLoad() {
        api.post('/api/activity/getactivitystatus', {
            activity_id: 6,
        }).then((data) => {
            this.activity_num = data.activity_num;
        });
    },
};
</script>

<style lang="less" scoped>
.clearfix {
    display: block;
}
.clearfix:after {
    content: "";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}
.fl-l {
    float: left;
}
.fl-r {
    float: right;
}
.page-upload {
    .item-card {
        width: 670upx;
        margin: 40upx;
        box-shadow: 0px -4px 28px 0px rgba(0, 0, 0, 0.06);
        padding-bottom: 20upx;
        .banner {
            width: 100%;
            height: 277upx;
            border-radius: 30upx 30upx 0 0;
            margin-bottom: 20upx;
        }
        .time {
            width: 20upx;
            height: 20upx;
            margin-top: 30upx;
            margin-right: 10upx;
            margin-left: 20upx;
        }
        .title {
            font-size: 32upx;
            color: #333;
            margin-left: 20upx;
        }
        .count {
            color: #ff6555;
            font-size: 24upx;
            margin-right: 40upx;
        }
        .btm {
            height: 60upx;
        }
        .time-start-end {
            font-size: 20upx;
            color: #999;
            line-height: 80upx;
        }
        .join-game {
            width: 200upx;
            height: 60upx;
            line-height: 60upx;
            text-align: center;
            color: #fff;
            border-radius: 35upx;
            background: #ff6555;
            margin-right: 10upx;
        }
    }
}
</style>
