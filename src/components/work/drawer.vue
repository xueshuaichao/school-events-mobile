<template>
    <view
        class="topic-drawer"
        :animation="animationData"
    >
        <view
            v-for="(item, index) in list"
            :key="index"
            class="item"
        >
            {{ item }}
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
        return {
            list: [1, 2, 3, 4, 5, 5, 6],
            animationData: {},
            animation: {},
        };
    },
    watch: {
        show(val) {
            if (val) {
                this.showing();
            } else {
                this.hide();
            }
        },
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
        showing() {
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
<style scoped lang="less">
.topic-drawer {
    width: 100%;
    height: 450rpx;
    position: absolute;
    left: 0;
    bottom: 0;
}
</style>
