<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :is-show="isShow"
            :is-from-tabbar="true"
            :can-refresh="canRefresh"
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
            isShow: false,
            filter: {
                keyword: '',
                sort: 1,
                cat_id: {
                    one_level_id: -1,
                },
            },
            canRefresh: false,
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

    onShow() {
        this.isShow = !this.isShow;
    },
    onPullDownRefresh() {
        this.canRefresh = !this.canRefresh;
    },
};
</script>
