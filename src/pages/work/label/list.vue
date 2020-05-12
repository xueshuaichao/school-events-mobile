<template>
    <!-- 标签列表 -->
    <view v-if="loading">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :is-show="isShow"
            :is-from-tabbar="true"
            @changeBottom="changeBottom"
        />
    </view>
</template>
<script>
import list from '../../../widgets/work/list.vue';

export default {
    components: {
        list,
    },
    data() {
        return {
            loading: false,
            isReachBtm: false,
            isShow: false,
            filter: {
                cat_id: {
                    one_level_id: 0,
                    two_level_id: 0,
                    three_level_id: 0,
                    four_level_id: 0,
                },
                page_size: 10,
                page_num: 1,
            },
        };
    },
    methods: {
        changeBottom() {
            this.isReachBtm = !this.isReachBtm;
        },
    },
    onReachBottom() {
        this.isReachBtm = !this.isReachBtm;
    },
    onLoad(params) {
        const catId = params.cat_id.split(',');
        const catName = params.cat_name || '列表';
        this.$set(this.filter.cat_id, 'one_level_id', catId[0]);
        this.$set(this.filter.cat_id, 'four_level_id', catId[1]);
        uni.setNavigationBarTitle({ title: catName });
        this.loading = true;
        this.isShow = !this.isShow;
    },
};
</script>
