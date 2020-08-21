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
    onLoad(params) {
        this.filter.cat_id.one_level_id = params.cat_id || -1;
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
