<template>
    <view>
        asasa
    </view>
</template>
<script>
export default {
    data() {
        return {
            recorder: null,
        };
    },
    created() {
        this.recorder = uni.getRecorderManager();
    },
    methods: {},
};
</script>
<style lang="less" scoped></style>
