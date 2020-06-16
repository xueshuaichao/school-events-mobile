<template>
    <view class="page-uc-index">
        <uc
            :refresh="refreshPage"
            :reach-bottom="reachBottom"
            :page-show="pageShow"
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
            pageShow: false,
        };
    },
    created() {},
    methods: {
        onReachBottom() {
            this.reachBottom = !this.reachBottom;
        },
    },
    onShow() {
        this.pageShow = !this.pageShow;
    },
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
