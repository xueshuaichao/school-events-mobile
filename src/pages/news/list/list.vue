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
                :url="`/pages/news/detail/detail?id=123`"
            >
                <text class="text-two-line">
                    · {{ item.title }}
                </text>
            </navigator>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            newsTabActiveIndex: 0,
            newsColumn: [],
            newsData: [],
        };
    },
    created() {
        this.getData();
    },
    methods: {
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
            this.getArticle(this.newsColumn[index].id);
        },
        getArticle(columnId) {
            return api
                .get('/api/article/list', {
                    column: columnId,
                    page_num: 1,
                    page_size: 20,
                })
                .then((res) => {
                    console.log(res);
                    this.newsData = res.list;
                });
        },
        getData() {
            api.get('/api/column/list').then((res) => {
                // console.log(res);
                this.newsColumn = res.list;

                this.getArticle(res.list[0].id);
            });
        },
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
