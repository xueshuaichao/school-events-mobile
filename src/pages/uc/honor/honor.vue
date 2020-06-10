<template>
    <view class="honor-page">
        <template v-if="loading">
            <honor-card
                v-for="(item, index) in list"
                :key="index"
            />
        </template>
    </view>
</template>
<script>
import honorCard from '../../../components/uc/honor.vue';

export default {
    components: {
        honorCard,
    },
    data() {
        return {
            loading: false,
            list: [2, 3, 4, 5, 5],
        };
    },
    created() {
        this.loading = true;
    },
};
</script>
<style scoped>
.honor-page {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
</style>
