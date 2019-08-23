<template>
    <!-- news -->
    <view class="panel">
        <view class="panel-hd">
            <text
                v-for="(item, k) in newsColumn"
                :key="item.id"
                class="panel-title"
                :class="{ active: newsTabActiveIndex === k }"
                @click="setNewsTabActive(k)"
            >
                {{ item.column_name }}
            </text>
        </view>
        <view class="panel-bd news-list">
            <navigator
                v-for="item in newsData"
                :key="item.id"
                class="news-item"
                :url="`/pages/news/detail/detail?id=${item.id}`"
            >
                <text class="text-two-line">
                    · {{ item.title }}
                </text>
            </navigator>
            <uni-load-more :status="loadMoreStatus" />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            newsTabActiveIndex: 0,
            newsColumn: [],
            newsData: [],

            filter: {
                page_num: 1,
                page_size: 20,
                column: '',
            },
            loadMoreStatus: 'more',
        };
    },
    // created() {
    //     this.getData();
    // },
    methods: {
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
            this.filter.column = this.newsColumn[index].id;

            this.getArticle();
        },
        getArticle() {
            this.filter.page_num = 1;
            return api.get('/api/article/list', this.filter).then((res) => {
                this.newsData = res.list;
                this.total = res.total;
                if (this.total < 10) {
                    this.loadMoreStatus = 'noMore';
                }
            });
        },
        getArticleMore() {
            return api.get('/api/article/list', this.filter).then((res) => {
                this.loadMoreStatus = this.total > this.filter.page_num * this.filter.page_size
                    ? 'more'
                    : 'noMore';
                this.newsData = this.newsData.concat(res.list);
            });
        },
        getData() {
            api.get('/api/column/list').then((res) => {
                // console.log(res);
                this.newsColumn = res.list;
                this.filter.column = res.list[this.newsTabActiveIndex].id;

                this.getArticle();
            });
        },
    },
    onLoad(params) {
        const id = params.tab;
        if (id !== undefined) {
            this.newsTabActiveIndex = id - 0;
        }
        this.getData();
    },
    onReachBottom() {
        if (this.total > this.filter.page_num * this.filter.page_size) {
            this.filter.page_num = this.filter.page_num + 1;
            this.loadMoreStatus = 'loading';
            this.getArticleMore();
        } else {
            this.loadMoreStatus = 'noMore';
        }
    },
};
</script>

<style lang="less" scoped>
.news-list {
    .news-item {
        font-size: 28upx;
        color: #666;
        line-height: 45upx;
        border-bottom: 1px solid #f0f0f0;
        padding: 25upx 0;
    }
}
</style>
