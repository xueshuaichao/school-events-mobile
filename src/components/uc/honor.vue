<template>
    <view class="honor-card">
        <view class="top">
            <view class="name">
                世界读书日
            </view>
            <view>
                05/09-05/20
            </view>
        </view>
        <view class="btm">
            <view>
                <image src="/static/images/uc/honor-model.png" />
                中文组合： 滴六名
            </view>
            <view>
                <image src="/static/images/uc/honor-model.png" />
                中文组合： 滴六名
            </view>
        </view>
    </view>
</template>
<script>
export default {
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
        background: url(/static/images/uc/honor-bg.png);
        background-size: 100% 100%;
        color: #fff;
        padding: 24rpx;
        .name {
            font-size: 28rpx;
            font-weight: 600;
            line-height: 34rpx;
        }
    }
    .btm {
        padding: 24rpx;
        border: 2rpx solid #7fadff;
        border-radius: 0 0 4rpx 4rpx;
        border-top: none;
        color: #333;
        font-weight: 500;
        image {
            width: 24rpx;
            height: 24rpx;
        }
    }
}
</style>
