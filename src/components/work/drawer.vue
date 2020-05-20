<template>
    <view
        class="topic-drawer"
        :animation="animationData"
    />
</template>
<script>
export default {
    data() {
        return {
            list: [1, 2, 3, 4, 5, 5, 6],
            animationData: {},
            animation: {},
        };
    },
    created() {
        const animation = uni.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
            delay: 0,
        });
        this.animation = animation;
        this.animationData = this.animation.export();
    },
    methods: {
        show() {
            this.animation.translateY(400).step({ duration: 1000 });
            this.animationData = this.animation.export();
        },
        hide() {
            this.animation.translateY(100).step({ duration: 1000 });
            this.animationData = this.animation.export();
        },
    },
};
</script>
<style scoped>
.topic-drawer {
    width: 100%;
    height: 400upx;
}
</style>
