<template>
    <!-- news -->
    <view class="panel">
        <view class="panel-hd">
            <text
                class="panel-title"
                :class="{ active: newsTabActiveIndex === 0 }"
                @click="setNewsTabActive(0)"
            >
                新闻资讯
            </text>
            <text
                class="panel-title"
                :class="{ active: newsTabActiveIndex === 1 }"
                @click="setNewsTabActive(1)"
            >
                最新公告
            </text>
        </view>
        <view class="panel-bd news-list">
            <navigator
                v-for="item in news"
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
export default {
    data() {
        return {
            news: [
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title: '人社部：上半年养老基金收大于支，社保时足额发放',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title: '人社部：上半年养老基金收大于支，社保时足额发放',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
            ],

            newsTabActiveIndex: 0,
        };
    },
    methods: {
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
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
