<template>
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll': maskPrompt
            }
        ]"
    >
        活动主页
        <view
            class="start"
            @click="start"
        >
            开始闯关
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            maskPrompt: false,
        };
    },
    methods: {
        start() {
            uni.navigateTo({
                url: '/activity/pages/poetry/clearance',
            });
        },
    },
};
</script>
<style scoped lang="less">
.start {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80upx;
    text-align: center;
    line-height: 80upx;
    font-size: 40upx;
    border: 2upx solid #eee;
}
</style>
