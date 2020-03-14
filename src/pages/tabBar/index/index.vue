<template>
    <view class="page-index">
        <view
            v-if="prompt && status === 2"
            class="cover"
        >
            <image
                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/suspension01.png"
                @click="handleChunjie"
            />
            <image
                src="../../../static/images/chunjie/third_entry_close.png"
                @click="handleClose"
            />
            疫情入口
        </view>
        <navigator
            v-if="yiqingshow === 1 && isShow"
            url="/pages/yiqing/index"
        >
            <view class="chunjie-entry">
                <image
                    src="/static/images/yiqing/close.png"
                    class="close-icon"
                    @click.stop="handleCloseSuspension"
                />
                春节入口
            </view>
        </navigator>
        <!-- search -->
        <view class="search">
            <input
                v-model="changeValue"
                placeholder-class="placeholderStyle"
                placeholder="请输入作品名称/作者姓名"
                @confirm="bindconfirm"
            >
            <text
                class="button"
                @click="bindconfirm"
            >
                搜索
            </text>
        </view>
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
                    <!-- 疫情入口 -->
                    <swiper-item v-if="!isH5 && yiqingshow === 1">
                        <navigator
                            url="/pages/yiqing/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-banner.png?t=2"
                            />
                        </navigator>
                    </swiper-item>
                    <swiper-item v-if="show === 1">
                        <navigator
                            url="/pages/chunjie/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner4.png"
                            />
                        </navigator>
                    </swiper-item>
                    <!-- 春节好入口 -->
                    <swiper-item v-if="!isH5 && chunjiehaoshow === 1">
                        <navigator
                            url="/pages/chunjiehao/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao.png?t=1"
                            />
                        </navigator>
                    </swiper-item>
                    <!-- <swiper-item>
                        <navigator
                            url="/pages/doc/notice/notice"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner0.jpg"
                            />
                        </navigator>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner1.jpg"
                            />
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner2.jpg"
                            />
                        </view>
                    </swiper-item>
                    <swiper-item>
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner3.jpg"
                            />
                        </view>
                    </swiper-item> -->
                </swiper>
            </view>
        </view>

        <view class="menu-list">
            <navigator
                class="item"
                :url="`/pages/doc/intro/intro?id=rule`"
            >
                <view class="icon-wrap">
                    <image
                        class="icon"
                        src="/static/images/index/0001.png"
                    />
                </view>
                <text class="name">
                    大赛简介
                </text>
            </navigator>
            <!-- <navigator
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
            </navigator> -->

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=challenge`"
            >
                <view class="icon-wrap">
                    <image
                        class="icon"
                        src="/static/images/index/0002.png"
                    />
                </view>
                <text class="name">
                    爱挑战
                </text>
            </navigator>

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=talent`"
            >
                <view class="icon-wrap">
                    <image
                        class="icon"
                        src="/static/images/index/0003.png"
                    />
                </view>
                <text class="name">
                    才艺秀
                </text>
            </navigator>

            <navigator
                class="item"
                :url="`/pages/doc/list/list?type=guinness`"
            >
                <view class="icon-wrap">
                    <image
                        class="icon"
                        src="/static/images/index/0004.png"
                    />
                </view>
                <text class="name">
                    吉尼斯
                </text>
            </navigator>
            <navigator
                url="/pages/activities/index"
                class="item"
            >
                <view class="icon-wrap">
                    <image
                        class="icon"
                        src="/static/images/index/0005.png"
                    />
                </view>
                <text class="name">
                    精彩活动
                </text>
            </navigator>
        </view>
        <!-- menu -->
        <!-- work show -->

        <work
            :title="'爱挑战优秀个人'"
            :more-url="'/pages/work/list/list?cat_id=1'"
            :info="workData.individual.list"
            :cat-id="1"
            :sort="4"
            :total="workData.individual.total"
        />
        <work
            :title="'爱挑战优秀团体'"
            :more-url="'/pages/work/list/list?cat_id=2'"
            :info="workData.team.list"
            :cat-id="2"
            :sort="4"
            :total="workData.team.total"
        />
        <work
            :title="'才艺秀优秀作品'"
            :more-url="'/pages/work/list/list?cat_id=3'"
            :info="workData.talent.list"
            :cat-id="3"
            :sort="4"
            :total="workData.talent.total"
        />

        <!-- news -->
        <!-- <view class="panel">
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
        </view> -->
    </view>
</template>

<script>
import work from '../../../widgets/work/work.vue';
import api from '../../../common/api';
// import bindMobile from '../../../components/bind-mobile/index.vue';

export default {
    components: {
        work,
        // bindMobile,
    },
    data() {
        return {
            background: ['color1', 'color2', 'color3'],
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,
            circular: false,
            isShow: true,
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
                individual: { list: [], total: 0 },
                team: { list: [], total: 0 },
                talent: { list: [], total: 0 },
            },
            prompt: false,
            isFirstLogin: 'isFirstLogin3',
            status: 2,
            show: 1,
            chunjiehaoshow: 1,
            yiqingshow: 1,
            // #ifdef H5
            isH5: true,
            // #endif
            needBindMobile: false,
            changeValue: '',
        };
    },
    onHide() {
        this.changeValue = '';
        this.prompt = false;
    },
    onLoad() {
        this.chunjieStatus();
        this.chunjiehaoStatus();
        this.yiqingStatus();
        this.thirdEntryPrompt();
        this.getData();
        this.getUserInfo();
    },
    onShow() {
        this.chunjieStatus();
    },
    created() {},
    methods: {
        bindconfirm() {
            if (!this.changeValue.trim()) {
                uni.showToast({
                    title: '请输入搜索内容',
                    icon: 'none',
                });
                return;
            }
            uni.navigateTo({
                url: `/pages/work/list/list?keyword=${this.changeValue.trim()}`,
            });
        },
        getUserInfo() {
            console.log('首页请求个人信息');
            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info
                        && res.user_info.is_bind_mobile === 0
                        && res.user_info.shop_id === 1;
                    // this.needBindMobile = true;
                    if (this.needBindMobile) {
                        uni.removeStorageSync('medusa_key');
                        uni.navigateTo({
                            url: '/pages/login/login',
                        });
                    }
                },
                () => {},
            );
        },
        handleCloseSuspension() {
            this.isShow = false;
        },
        chunjieStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 3,
            }).then((res) => {
                // this.status = res.status;
                // 1显示  0不显示
                this.show = res.show;
            });
        },
        chunjiehaoStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 4,
            }).then((res) => {
                // 1显示  0不显示
                this.chunjiehaoshow = res.show;
            });
        },
        yiqingStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 5,
            }).then((res) => {
                this.status = res.status;
                // 1显示  0不显示
                this.yiqingshow = res.show;
            });
        },
        thirdEntryPrompt() {
            const isFirstLogin = uni.getStorageSync(this.isFirstLogin);
            console.log(isFirstLogin, 'isFirstLogin');
            if (!isFirstLogin) {
                this.prompt = true;
            }
        },
        handleChunjie() {
            uni.setStorageSync(this.isFirstLogin, true);
            uni.navigateTo({
                url: '/pages/yiqing/index',
            });
        },
        handleClose() {
            this.prompt = false;
            uni.setStorageSync(this.isFirstLogin, true);
        },
        // setNewsTabActive(index) {
        //     this.newsTabActiveIndex = index;
        //     this.getArticle(this.newsColumn[index].id);
        // },
        moreArticle() {
            uni.navigateTo({
                url: `/pages/news/list/list?tab=${this.newsTabActiveIndex}`,
            });
        },
        // getArticle(columnId) {
        //     return api
        //         .get('/api/article/list', {
        //             column: columnId,
        //             page_num: 1,
        //             page_size: 5,
        //         })
        //         .then((res) => {
        //             this.newsData = res.list;
        //         });
        // },
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
                sort: 4,
                page_size: 10,
            }).then((res) => {
                if (type === 'individual') {
                    this.workData.individual = res;
                } else if (type === 'team') {
                    this.workData.team = res;
                } else if (type === 'talent') {
                    this.workData.talent = res;
                }
            });
        },

        getData() {
            // api.get('/api/column/list').then(res => {
            //     // 首页不展示第一个大赛动态 tab
            //     res.list.shift();

            //     this.newsColumn = res.list;

            // this.getArticle(this.newsColumn[0].id);
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
.cover {
    position: fixed;
    z-index: 9999;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    text-align: center;
    font-size: 0;
    image:first-child {
        width: 591upx;
        height: 518upx;
        margin-top: 193upx;
        display: block;
        margin-left: 90upx;
    }
    image:nth-child(2) {
        margin-top: 40upx;
        width: 54upx;
        height: 54upx;
        margin-left: 357upx;
        display: block;
    }
    view {
        position: absolute;
        top: 680upx;
        left: 210upx;
        font-size: 0;
        width: 360upx;
        height: 100upx;
    }
}
uni-swiper {
    .swiper-item {
        height: 100%;
    }
}

.page-index {
    padding-bottom: 20upx;
    display: relative;
    .search {
        width: 100%;
        font-size: 24upx;
        overflow: hidden;
        padding: 20upx 0 20upx 30upx;
        background: #fff;
        box-shadow: 0 0upx 5upx 0 rgba(0, 0, 0, 0.05);
        margin-bottom: 10upx;
        input {
            background: #f3f3f3;
            border: none;
            border-radius: 30upx;
            width: 606upx;
            height: 60upx;
            float: left;
            display: block;
            padding-left: 40upx;
            box-sizing: border-box;
        }
        .placeholderStyle {
            color: #999999;
            text-align: left;
            font-size: 24upx;
        }
        .button {
            float: left;
            height: 60upx;
            line-height: 60upx;
            color: #666666;
            font-size: 32upx;
            margin-left: 28upx;
        }
    }
    .chunjie-entry {
        .close-icon {
            width: 20upx;
            height: 20upx;
            position: absolute;
            top: 0;
            right: 0;
        }
        font-size: 0;
        background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/suspension.png")
            no-repeat;
        background-size: 100% 100%;
        width: 144upx;
        height: 156upx;
        position: fixed;
        top: 640upx;
        right: 0upx;
        z-index: 999;
    }
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
                    width: 78upx;
                    height: 70upx;
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
