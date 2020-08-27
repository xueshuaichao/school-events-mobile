<template>
    <view
        v-if="show"
        class="clocked-modal"
    >
        <view class="modal-main">
            <view class="modal-top">
                奖品说明
            </view>
            <view class="modal-body" />
            <image
                class="close"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                @click="toggelModel"
            />
        </view>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {};
    },
    methods: {
        toggelModel() {
            this.$emit('toggelModel');
        },
    },
};
</script>
<style scoped lang="less">
.clocked-modal {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    .modal-main {
        width: 690upx;
        margin: 100upx auto 0;
    }
    .modal-top {
        color: #fff;
        font-size: 32upx;
        line-height: 72upx;
        text-align: center;
        background: linear-gradient(
            180deg,
            rgba(255, 162, 132, 1) 0%,
            rgba(255, 104, 76, 1) 100%
        );
        box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5);
        border-radius: 20upx 20upx 0 0;
    }
    .modal-body {
        background: #ffdada;
        border-radius: 0 0 20upx 20upx;
        height: 896upx;
        padding: 30upx;
        box-sizing: border-box;
        overflow: auto;
    }
    .close {
        width: 60upx;
        height: 60upx;
        margin-top: 40upx;
        margin-left: 315upx;
    }
}
</style>
