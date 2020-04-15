<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :has-page-params="hasPageParams"
            :is-show="isShow"
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
                sort: 1,
                cat_id: {
                    one_level_id: 0,
                },
                from: '/list/list',
            },
            isShow: false,
        };
    },
    created() {},
    methods: {
        changeBottom() {
            this.isReachBtm = !this.isReachBtm;
        },
    },
    onReachBottom() {
        this.isReachBtm = !this.isReachBtm;
    },
    onLoad(params) {
        const id = params.cat_id || -1;
        this.filter.keyword = params.keyword || '';
        this.filter.cat_id.one_level_id = id;

        const title = '作品展示';
        this.hasPageParams = true;
        uni.setNavigationBarTitle({
            title,
        });
    },
    onShow() {
        this.isShow = !this.isShow;
    },
};
</script>
