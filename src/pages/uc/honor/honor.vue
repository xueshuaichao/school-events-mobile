<template>
    <view class="honor-page">
        <template v-if="loading">
            <honor-card
                v-for="(item, index) in dataList"
                :key="index"
                :info="item"
            />
            <uni-load-more
                v-if="total >= 20"
                class="loadMore"
                :status="loadMoreStatus"
                :content-text="{
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '———— 已经到底了~ ————'
                }"
                color="#999"
            />
        </template>
    </view>
</template>
<script>
import honorCard from '../../../components/uc/honor.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import api from '../../../common/api';

export default {
    components: {
        honorCard,
        uniLoadMore,
    },
    data() {
        return {
            loading: false,
            loadMoreStatus: 'none',
            dataList: [],
            total: 0,
            filter: {
                page_num: 1,
                page_size: 20,
                uid: 1,
            },
        };
    },
    created() {},
    methods: {
        getData(title) {
            return api.get('/api/user/honorlist', this.filter).then(
                ({ data, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(data);
                    } else {
                        this.dataList = data;
                    }
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
                () => {
                    this.dataList = [];
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
    },
    onLoad({ uid }) {
        this.filter.uid = uid;
        this.loading = true;
        this.getData();
    },
};
</script>
<style scoped lang="less">
.honor-page {
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .loadMore {
        width: 100%;
    }
}
</style>
