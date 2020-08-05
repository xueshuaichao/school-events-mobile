<template>
    <view>
        通关页面
        <view
            class="start"
            @click="start"
        >
            开始
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
                url: '/activity/pages/poetry/soundRecord',
            });
        },
    },
};
</script>
<style scoped></style>
