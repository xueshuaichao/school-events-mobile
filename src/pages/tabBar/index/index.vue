<template>
    <view class="page-index">
        <!-- swiper -->
        <view class="swiper main-swiper">
            <view class="page-section-spacing">
                <swiper
                    class="swiper"
                    :indicator-dots="indicatorDots"
                    :autoplay="autoplay"
                    :interval="interval"
                    :duration="duration"
                >
                    <swiper-item>
                        <view class="swiper-item uni-bg-red">
                            <image
                                class="banner-image"
                                src="/static/images/index/banner.png"
                            />
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item uni-bg-green">
                            B
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item uni-bg-blue">
                            C
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </view>

        <!-- menu -->
        <view class="menu-list">
            <navigator
                class="item"
                url="/pages/detail/intro/intro"
            >
                <view class="icon-wrap purple">
                    <!-- <view class="icon icon-intro"></view> -->
                    <image
                        class="icon"
                        src="/static/images/index/intro.png"
                    />
                </view>
                <text class="name">
                    大赛简介
                </text>
            </navigator>

            <navigator
                class="item"
                url="/pages/detail/rule/rule"
            >
                <view class="icon-wrap green">
                    <image
                        class="icon"
                        src="/static/images/index/rule.png"
                    />
                </view>
                <text class="name">
                    大赛须知
                </text>
            </navigator>

            <navigator
                class="item"
                url="/pages/detail/flow/flow"
            >
                <view class="icon-wrap yellow">
                    <image
                        class="icon"
                        src="/static/images/index/flow.png"
                    />
                </view>
                <text class="name">
                    大赛流程
                </text>
            </navigator>

            <navigator class="item">
                <view class="icon-wrap blue">
                    <image
                        class="icon"
                        src="/static/images/index/time.png"
                    />
                </view>
                <text class="name">
                    大赛时间
                </text>
            </navigator>

            <navigator class="item">
                <view class="icon-wrap orange">
                    <image
                        class="icon"
                        src="/static/images/index/news.png"
                    />
                </view>
                <text class="name">
                    大赛动态
                </text>
            </navigator>
        </view>

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
                <navigator
                    class="link"
                    url="/pages/news/list/list"
                >
                    更多 >
                </navigator>
            </view>
            <view class="panel-bd news-list">
                <view
                    v-for="item in news"
                    :key="item.id"
                    class="news-item"
                >
                    <text class="text-two-line">
                        · {{ item.title }}
                    </text>
                </view>
            </view>
        </view>

        <!-- work show -->

        <work
            :title="'优秀个人作品展'"
            :more-url="'/pages/tabBar/list/list'"
        />
        <work
            :title="'优秀团体作品展'"
            :more-url="'/pages/tabBar/list/list'"
        />
        <work :title="'优秀才艺达人作品展'" />

        <!-- <view class="link-wrap">
            <navigator class="link" url="/pages/news/list/list">
                <button type="default">资讯列表</button>
            </navigator>
            <navigator class="link" url="/pages/news/detail/detail" hover-class="other-navigator-hover">
                <button type="default">资讯详情</button>
            </navigator>
        </view> -->
    </view>
</template>

<script>
import work from '../../../widgets/work/work.vue';

export default {
    components: {
        work,
    },
    data() {
        return {
            background: ['color1', 'color2', 'color3'],
            indicatorDots: true,
            autoplay: false,
            interval: 2000,
            duration: 500,

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
            ],

            newsTabActiveIndex: 0,
        };
    },
    onLoad() {},
    methods: {
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
        },
    },
};
</script>

<style lang="less">
uni-swiper {
    .swiper-item {
        height: 100%;
    }
}

.page-index {
    padding-bottom: 20upx;

    .main-swiper {
        padding: 30upx;

        uni-swiper {
            height: 280upx;

            .swiper-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .banner-image {
            width: 690upx;
            height: 280upx;
        }
    }

    .menu-list {
        display: flex;
        margin-bottom: 40upx;

        .item {
            flex: 1;
            text-align: center;

            .icon-wrap {
                margin: 0 auto;
                width: 106upx;
                height: 70upx;
                border-radius: 35upx;
                margin-bottom: 15upx;

                &.purple {
                    background: rgb(192, 170, 255);
                    background: linear-gradient(
                        180deg,
                        rgba(192, 170, 255, 1) 0%,
                        rgba(138, 133, 255, 1) 100%
                    );
                    box-shadow: 0 2upx 4upx 0 #928bff;
                }
                &.green {
                    background: rgb(124, 239, 145);
                    background: linear-gradient(
                        180deg,
                        rgba(124, 239, 145, 1) 0%,
                        rgba(84, 232, 80, 1) 100%
                    );
                    box-shadow: 0 2upx 4upx 0 #8bffb3;
                }
                &.yellow {
                    background: rgb(255, 205, 58);
                    background: linear-gradient(
                        180deg,
                        rgba(255, 205, 58, 1) 0%,
                        rgba(254, 161, 35, 1) 100%
                    );
                    box-shadow: 0 2upx 4upx 0 #fea525;
                }
                &.blue {
                    background: rgb(141, 197, 255);
                    background: linear-gradient(
                        180deg,
                        rgba(141, 197, 255, 1) 0%,
                        rgba(111, 132, 255, 1) 100%
                    );
                    box-shadow: 0 2upx 4upx 0 #6f84ff;
                }
                &.orange {
                    background: rgb(255, 181, 101);
                    background: linear-gradient(
                        180deg,
                        rgba(255, 181, 101, 1) 0%,
                        rgba(254, 96, 51, 1) 100%
                    );
                    box-shadow: 0 2upx 4upx 0 #fe6033;
                }

                .icon {
                    top: 15upx;
                    position: relative;
                    margin: auto;
                    width: 40upx;
                    height: 40upx;
                    background-size: 40upx 40upx;

                    // &.icon-intro {
                    //     background-image: url('/static/images/index/intro.png');
                    // }
                    // &.icon-rule {
                    //     background-image: url('/static/images/index/rule.png');
                    // }
                    // &.icon-flow {
                    //     background-image: url('/static/images/index/flow.png');
                    // }
                    // &.icon-time {
                    //     background-image: url('/static/images/index/time.png');
                    // }
                    // &.icon-news {
                    //     background-image: url('/static/images/index/news.png');
                    // }
                }
            }

            .name {
                font-size: 24upx;
                color: #333;
            }
        }
    }

    .news-list {
        .news-item {
            font-size: 28upx;
            color: #666;
            line-height: 45upx;
            border-bottom: 1px solid #f0f0f0;
            padding: 25upx 0;
        }
    }
}

.uni-bg-green {
    background: green;
}
.uni-bg-blue {
    background: blue;
}
</style>
