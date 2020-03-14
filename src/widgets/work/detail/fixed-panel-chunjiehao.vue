<template>
    <view>
        <view class="fixed-panel">
            <view class="result">
                {{ pageData.ticket }}票
            </view>
            <button
                class="btn"
                @click="toggleLike"
            >
                {{ likeStatus === 0 ? "投TA一票" : "已投票" }}
            </button>

            <button
                class="btn"
                @click="handleCanvass"
            >
                帮TA拉票
            </button>
            <button
                class="btn"
                @click="goHome"
            >
                返回首页
            </button>
        </view>
        <!-- v-if="!isH5" -->
        <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/join.png"
            class="join-game"
            @click="joinGame"
        />
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
    position: fixed;
    width: 146rpx;
    right: 27rpx;
    bottom: 160rpx;
    color: #ffde98;
    font-size: 24rpx;
    text-align: center;
    z-index: 100;
}

.btn {
    color: #ffde98;
    font-size: 24rpx;
    width: 134rpx;
    height: 56rpx;
    background: linear-gradient(
        90deg,
        rgba(255, 124, 53, 1),
        rgba(255, 31, 73, 1)
    );
    border-radius: 28rpx;
    line-height: 56rpx;
    text-align: center;
    margin-bottom: 30rpx;
    padding: 0;
}
.join-game {
    width: 134rpx;
    height: 140rpx;
    position: fixed;
    right: 30rpx;
    bottom: 20rpx;
    z-index: 100;
}
</style>
