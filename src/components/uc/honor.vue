<template>
    <view class="honor-card">
        <view class="top">
            <view class="name">
                {{ info.activity_name }}
            </view>
            <view class="time">
                {{ info.start_time }} - {{ info.end_time }}
            </view>
        </view>
        <view class="btm">
            <view>
                <image src="/static/images/uc/honor-model.png" />
                {{
                    info.activity_id === 5
                        ? "青少年组"
                        : info.activity_id === 6
                            ? "中文组"
                            : "总排名"
                }}： {{ info.one_final_rank }}
            </view>
            <template v-if="info.two_final_rank">
                <view>
                    <image src="/static/images/uc/honor-model.png" />
                    {{
                        info.activity_id === 5
                            ? "成年组"
                            : info.activity_id === 6
                                ? "英文组"
                                : "总排名"
                    }}： {{ info.two_final_rank }}
                </view>
            </template>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        info: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {};
    },
};
</script>
<style scoped lang="less">
.honor-card {
    width: 330rpx;
    margin-bottom: 30rpx;
    .top {
        border-radius: 4rpx 4rpx 0 0;
        background: url(../../static/images/uc/honor-bg.png);
        background-size: 100% 100%;
        color: #fff;
        padding: 20rpx;
        .name {
            font-size: 28rpx;
            font-weight: 600;
            line-height: 52rpx;
        }
        .time {
            font-size: 24rpx;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.8);
        }
    }
    .btm {
        padding: 22rpx;
        border: 2rpx solid #7fadff;
        border-radius: 0 0 4rpx 4rpx;
        border-top: none;
        color: #333;
        font-weight: 500;
        line-height: 44rpx;
        font-size: 26rpx;
        height: 132rpx;
        box-sizing: border-box;
        image {
            width: 24rpx;
            height: 24rpx;
        }
    }
}
</style>
