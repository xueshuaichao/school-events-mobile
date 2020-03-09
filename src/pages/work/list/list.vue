<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :has-page-params="hasPageParams"
            :is-from-tabbar="false"
            @changeBottom="changeBottom"
        />
    </view>
</template>

<script>
import list from '../../../widgets/list/list.vue';

export default {
    components: {
        list,
    },

    data() {
        return {
            isReachBtm: false,
            hasPageParams: false,
            filter: {
                keyword: '',
                sort: 2,
                cat_id: {
                    one_level_id: 0,
                },
            },
        };
    },
    created() {},
    methods: {
        changeBottom() {
            this.isReachBtm = false;
        },
    },
    onReachBottom() {
        this.isReachBtm = true;
    },
    onLoad(params) {
        const id = params.cat_id;
        this.filter.cat_id.one_level_id = id;

        this.filter.keyword = params.keyword || '';
        const title = '作品展示';
        this.hasPageParams = true;
        uni.setNavigationBarTitle({
            title,
        });
    },
};
</script>
