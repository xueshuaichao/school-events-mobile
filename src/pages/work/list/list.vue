<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
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
            filter: {
                keyword: '',
                sort: 1,
                cat_id: {
                    one_level_id: -1,
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
        console.log(params, 'list-----from-----');
        this.filter.keyword = params.keyword || '';
        this.filter.cat_id.one_level_id = params.cat_id;
        this.filter.show_type = params.show_type;
        const title = '作品展示';
        uni.setNavigationBarTitle({
            title,
        });
    },
    onShow() {
        this.isShow = !this.isShow;
    },
};
</script>
