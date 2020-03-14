<template>
    <view>
        <view class="fixed-panel">
            <view class="result">
                {{ pageData.ticket || 0 }}票
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
        <image
            v-if="pageFrom === '3'"
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/festival.png"
            class="join-game"
            @click="joinGame"
        />
        <image
            v-else
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
        pageFrom: {
            type: String,
            default: '3',
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
    color: #fff0cc;
    font-size: 24rpx;
    text-align: center;
    z-index: 100;
}

.btn {
    color: #fff0cc;
    font-size: 24rpx;
    width: 134rpx;
    height: 56rpx;
    background: linear-gradient(
        0deg,
        rgba(255, 22, 16, 1),
        rgba(255, 189, 103, 1)
    );
    border-image: linear-gradient(
            -57deg,
            rgba(255, 231, 174, 1),
            rgba(255, 225, 154, 1)
        )
        2 2;
    border-radius: 28rpx;
    border: 2rpx solid;
    line-height: 56rpx;
    text-align: center;
    margin-bottom: 30rpx;
    padding: 0;
}
.join-game {
    width: 134rpx;
    height: 143rpx;
    position: fixed;
    right: 30rpx;
    bottom: 20rpx;
    z-index: 100;
}
</style>
