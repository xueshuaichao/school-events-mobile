<template>
    <view class="page-work-box-list">
        <list
            :is-reach-btm="isReachBtm"
            :params-filter="filter"
            :is-show="isShow"
            :is-from-tabbar="false"
            @changeBottom="changeBottom"
        />
        <view
            class="join-fixed"
            @click="joinGame"
        >
            <image
                class="icon join"
                src="/static/images/work/detail-join.png"
            />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
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
        joinGame() {
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    if (this.activity_id) {
                        this.joinActivity();
                    } else {
                        uni.navigateTo({
                            url: '/pages/openGame/zhibo-list',
                        });
                    }
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
    },
    onReachBottom() {
        this.isReachBtm = !this.isReachBtm;
    },
    onLoad(params) {
        this.filter.keyword = params.keyword || '';
        this.filter.cat_id.one_level_id = params.cat_id;
        // show_type 关键字统计
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
<style lang="less" scoped>
.join-fixed {
    position: fixed;
    right: 20upx;
    bottom: 187upx;
}
.join {
    width: 136rpx;
    height: 130rpx;
}
</style>
