<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :has-page-params="hasPageParams"
            :is-show="isShow"
            :is-from-tabbar="true"
            :refresh="refresh"
            @changeBottom="changeBottom"
        />
    </view>
</template>

<script>
import list from '../../../widgets/list/list.vue';
// 内容迁移到组件里面了。

export default {
    components: {
        list,
    },

    data() {
        return {
            isReachBtm: false,
            hasPageParams: true,
            isShow: false,
            refresh: false,
            filter: {
                keyword: '',
                sort: 1,

                cat_id: {
                    one_level_id: -1,
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

    onShow() {
        this.isShow = !this.isShow;
    },
    onPullDownRefresh() {
        // this.getData('refresh')
        this.refresh = !this.refresh;
    },
};
</script>
