<template>
    <view class="page-uc-index">
        <uc
            :isfrom-uc="false"
            :reach-bottom="reachBottom"
            :uid="uid"
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
            uid: 1,
        };
    },
    methods: {
        onReachBottom() {
            this.reachBottom = !this.reachBottom;
        },
    },
    onLoad({ uid }) {
        this.uid = Number(uid);
        console.log(uid, 'pageg-----');
    },
};
</script>
<style scoped>
.page-uc-index {
    padding-bottom: 20upx;
    position: relative;
}
</style>
