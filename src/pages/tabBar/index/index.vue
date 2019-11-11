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
                    :circular="circular"
                >
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="/static/images/index/banner1.jpg"
                            />
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="/static/images/index/banner2.jpg"
                            />
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="/static/images/index/banner3.jpg"
                            />
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </view>

        <view class="menu-list">
            <navigator
                class="item"
                :url="`/pages/doc/detail/detail?id=rule`"
            >
                <view class="icon-wrap red">
                    <image
                        class="icon"
                        src="/static/images/index/0001.png"
                    />
                </view>
                <text class="name">
                    参赛指南
                </text>
            </navigator>

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=challenge`"
            >
                <view class="icon-wrap light-blue">
                    <image
                        class="icon"
                        src="/static/images/index/0002.png"
                    />
                </view>
                <text class="name">
                    爱挑战项目
                </text>
            </navigator>

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=talent`"
            >
                <view class="icon-wrap dark-blue">
                    <image
                        class="icon"
                        src="/static/images/index/0003.png"
                    />
                </view>
                <text class="name">
                    才艺秀项目
                </text>
            </navigator>

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=guinness`"
            >
                <view class="icon-wrap pink">
                    <image
                        class="icon"
                        src="/static/images/index/0004.png"
                    />
                </view>
                <text class="name">
                    吉尼斯项目
                </text>
            </navigator>
        </view>
        <!-- menu -->
        <view class="menu-list">
            <navigator
                class="item"
                :url="
                    `/pages/news/detail/detail?id=${menuConf.intro.id}&title=大赛简介`
                "
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
                :url="
                    `/pages/news/detail/detail?id=${menuConf.notice.id}&title=大赛须知`
                "
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
                :url="
                    `/pages/news/detail/detail?id=${menuConf.process.id}&title=大赛流程`
                "
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

            <navigator
                class="item"
                :url="
                    `/pages/news/detail/detail?id=${menuConf.time.id}&title=大赛时间`
                "
            >
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
        </view>
        <!-- work show -->

        <work
            :title="'优秀个人作品展'"
            :more-url="'/pages/work/list/list?cat_id=1'"
            :info="workData.individual"
        />
        <work
            :title="'优秀团体作品展'"
            :more-url="'/pages/work/list/list?cat_id=2'"
            :info="workData.team"
        />
        <work
            :title="'优秀才艺达人作品展'"
            :more-url="'/pages/work/list/list?cat_id=3'"
            :info="workData.talent"
        />

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

                <view
                    class="link"
                    @click="moreArticle"
                >
                    更多 >
                </view>
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
            </view>
        </view>
    </view>
</template>

<script>
import work from '../../../widgets/work/work.vue';
import api from '../../../common/api';

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
            circular: true,

            newsTabActiveIndex: 0,

            menuConf: {
                intro: {},
                notice: {},
                process: {},
                time: {},
            },
            newsColumn: [
                { id: '1', column_name: '大赛动态', sort_ids: '1,2,3,4,5' },
                { id: '2', column_name: '新闻资讯', sort_ids: '1,2,3,4,5' },
                { id: '3', column_name: '最新公告', sort_ids: '2,2,2,2,2' },
            ],
            newsData: [],
            workData: {
                individual: [],
                team: [],
                talent: [],
            },
        };
    },
    onLoad() {},
    created() {
        this.getData();
    },
    methods: {
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
            this.getArticle(this.newsColumn[index].id);
        },
        moreArticle() {
            uni.navigateTo({
                url: `/pages/news/list/list?tab=${this.newsTabActiveIndex}`,
            });
        },
        getArticle(columnId) {
            return api
                .get('/api/article/list', {
                    column: columnId,
                    page_num: 1,
                    page_size: 5,
                })
                .then((res) => {
                    this.newsData = res.list;
                });
        },
        getMenuData() {
            api.get('/api/index/entry').then((res) => {
                this.menuConf = res;
            });
        },
        getWorkList(type) {
            let catId;
            if (type === 'individual') {
                catId = 1;
            } else if (type === 'team') {
                catId = 2;
            } else if (type === 'talent') {
                catId = 3;
            }

            api.post('/api/works/list', {
                cat_id: {
                    one_level_id: catId,
                },
                sort: 2,
                page_size: 6,
            }).then((res) => {
                if (type === 'individual') {
                    this.workData.individual = res.list;
                } else if (type === 'team') {
                    this.workData.team = res.list;
                } else if (type === 'talent') {
                    this.workData.talent = res.list;
                }
            });
        },

        getData() {
            // api.get('/api/column/list').then(res => {
            //     // 首页不展示第一个大赛动态 tab
            //     res.list.shift();

            //     this.newsColumn = res.list;

            this.getArticle(this.newsColumn[0].id);
            this.getMenuData();
            this.getWorkList('individual');
            this.getWorkList('team');
            this.getWorkList('talent');
            // })
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

                &.red {
                    background: linear-gradient(
                        180deg,
                        rgba(255, 142, 148, 1) 0%,
                        rgba(255, 82, 109, 1) 100%
                    );
                    box-shadow: 0rpx 2rpx 4rpx 0px rgba(255, 134, 153, 1);
                }

                &.light-blue {
                    background: linear-gradient(
                        180deg,
                        rgba(131, 225, 255, 1) 0%,
                        rgba(70, 176, 255, 1) 100%
                    );
                    box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(70, 176, 255, 1);
                }

                &.dark-blue {
                    background: linear-gradient(
                        180deg,
                        rgba(58, 138, 255, 1) 0%,
                        rgba(35, 98, 254, 1) 100%
                    );
                    box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(38, 103, 254, 1);
                }

                &.pink {
                    background: linear-gradient(
                        180deg,
                        rgba(243, 141, 255, 1) 0%,
                        rgba(182, 111, 255, 1) 100%
                    );
                    box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(189, 114, 255, 1);
                }

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
        margin-bottom: 40upx;

        .news-item {
            font-size: 28upx;
            color: #666;
            line-height: 45upx;
            border-bottom: 1px solid #f0f0f0;
            padding: 25upx 0;
        }
    }
}
</style>
