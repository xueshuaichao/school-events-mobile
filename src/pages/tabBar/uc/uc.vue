<template>
    <view
        v-show="loading"
        class="page-uc-index"
    >
        <uc
            :refresh="refreshPage"
            :reach-bottom="reachBottom"
            :page-show="pageShow"
        />
    </view>
</template>

<script>
import uc from '../../../widgets/uc/uc.vue';
import api from '../../../common/api';

export default {
    components: {
        uc,
    },
    data() {
        return {
            refreshPage: false,
            reachBottom: false,
            pageShow: false,
            loading: false,
        };
    },
    created() {},
    methods: {
        onReachBottom() {
            this.reachBottom = !this.reachBottom;
        },
    },
    onShow() {
        uni.showLoading({
            title: '加载中',
            icon: 'none',
        });
        api.isLogin().then(() => {
            this.loading = true;
            uni.hideLoading();
        });
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
