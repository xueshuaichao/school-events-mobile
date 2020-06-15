<template>
    <view class="page-uc-index">
        <uc
            :refresh="refreshPage"
            :reach-bottom="reachBottom"
        />
    </view>
</template>

<script>
import uc from '../../../widgets/uc/uc.vue';

export default {
    components: {
        uc,
    },
    data() {
        return {
            refreshPage: false,
            reachBottom: false,
        };
    },
    created() {},
    methods: {
        onReachBottom() {
            this.reachBottom = !this.reachBottom;
        },
    },
    onHide() {},
    onPullDownRefresh() {
        this.refreshPage = !this.refreshPage;
    },
};
</script>

<style lang="less">
.page-uc-index {
    padding-bottom: 20upx;
    position: relative;
}
</style>
