<template>
    <cover-view
        class="topic-drawer"
        :animation="animationData"
    >
        <scroll-view class="scroll-context">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
            >
                {{ item }}
            </view>
        </scroll-view>
    </cover-view>
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
            list: [1, 2, 3, 4, 5, 5, 6, 5, 7, 8, 8, 8, 8],
            animationData: {},
            animation: {},
        };
    },
    watch: {
        show(val) {
            console.log('111111', val);
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
            timingFunction: 'linear',
            delay: 0,
        });
        this.animation = animation;
        this.animationData = this.animation.export();
    },
    methods: {
        showing() {
            this.animation.bottom('0').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        hide() {
            this.animation.bottom('-60%').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
    },
};
</script>
<style scoped lang="less">
.topic-drawer {
    width: 100%;
    height: 60vh;
    position: absolute;
    left: 0;
    bottom: -60vh;
    background: #fff;
    border-radius: 16rpx 16rpx 0 0;
    z-index: 100;

    .scroll-context {
        height: 100%;
        overflow-y: auto;
    }
}
</style>
