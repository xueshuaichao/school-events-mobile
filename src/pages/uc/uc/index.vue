<template>
    <view class="page-uc-index">
        <uc
            :isfrom-uc="false"
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
            reachBottom: false,
        };
    },
    methods: {
        onReachBottom() {
            this.reachBottom = !this.reachBottom;
        },
    },
};
</script>
<style scoped>
.page-uc-index {
    padding-bottom: 20upx;
    position: relative;
}
</style>
