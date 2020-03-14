<template>
    <view class="fixed-panel">
        <view class="icon-wrap">
            <view
                class="item"
                @click="toggleLike"
            >
                <image
                    class="icon"
                    :src="
                        likeStatus === 0
                            ? '/static/images/yiqing/detail/like.png'
                            : '/static/images/yiqing/detail/like-ac.png'
                    "
                />
                <view> {{ pageData.praise_count }} </view>
            </view>

            <view
                class="item"
                @click="handleCanvass"
            >
                <image
                    class="icon"
                    src="/static/images/yiqing/detail/share.png"
                />
            </view>

            <view class="item">
                <image
                    class="icon"
                    src="/static/images/yiqing/detail/view.png"
                />
                <view> {{ pageData.play_count }} </view>
            </view>
        </view>

        <view
            class="btn primary"
            @click="joinGame"
        >
            我要参与
            <image
                class="join"
                src="/static/images/yiqing/arrow.png"
            />
        </view>
    </view>
</template>

<script>
export default {
    props: {
        pageData: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            likeStatus: 0,
        };
    },
    methods: {
        handleCanvass() {
            this.$emit('panelAction', 'handleCanvass');
        },
        toggleLike() {
            this.$emit('panelAction', 'toggleLike');
        },
        joinGame() {
            this.$emit('panelAction', 'joinGame');
        },
    },
};
</script>

<style lang="less">
.fixed-panel {
    position: absolute;
    width: 146rpx;
    right: 30rpx;
    bottom: 20rpx;
    color: #ffde98;
    font-size: 24rpx;
    text-align: center;
    z-index: 9999;

    .icon-wrap {
        //margin-right: 36rpx;
        text-align: center;
        position: relative;
        right: -30rpx;
        margin-bottom: 20rpx;
        color: #fff;

        .item {
            margin-bottom: 10rpx;
        }
    }

    .icon {
        width: 56rpx;
        height: 56rpx;
    }

    .btn-icon {
        width: 56rpx;
        height: 56rpx;
        background: transparent;
        display: inline-block;
        padding: 0;
        font-size: 0;
    }
}
.btn {
    width: 174rpx;
    height: 54rpx;
    background: rgba(222, 39, 30, 1);
    border-radius: 27rpx 0px 0px 27rpx;
    color: #0096ff;
    font-size: 24rpx;
    background: #fff;
    line-height: 54rpx;
    text-align: center;
    margin-bottom: 30rpx;
    padding: 0;

    &.primary {
        background: #0096ff;
        color: #fff;
    }
    .join {
        width: 34upx;
        height: 31upx;
        vertical-align: middle;
        margin-right: 8upx;
    }
    .arrow {
        width: 12upx;
        height: 21upx;
        vertical-align: middle;
        margin-right: 8upx;
    }
}
</style>
