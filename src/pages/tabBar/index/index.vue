<template>
    <view class="page-index">
        <view
            v-if="prompt && status === 2"
            class="cover"
        >
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/suspension-liuyi.png"
            />
            <view
                class="join-btn"
                @click="handlePromt"
            >
                立即参与
            </view>
            <view
                class="close"
                @click="handleClose"
            />
            <!-- <image
                src="/static/images/chunjie/third_entry_close.png"

            /> -->
        </view>
        <!-- <navigator
            v-if="yiqingshow === 1 && isShow"
            url="/pages/read/index"
        >
            <view class="chunjie-entry">
                <image
                    src="/static/images/yiqing/close.png"
                    class="close-icon"
                    @click.stop="handleCloseSuspension"
                />
            </view>
        </navigator> -->
        <!-- search -->
        <view class="search">
            <input
                v-model="changeValue"
                placeholder-class="placeholderStyle"
                :placeholder="searchWord"
                maxlength="13"
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
                    :circular="true"
                >
                    <swiper-item>
                        <navigator
                            url="/pages/activity-pages/children/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/liuyi-banner.png"
                            />
                        </navigator>
                    </swiper-item>
                    <swiper-item>
                        <navigator
                            url="/pages/activity-pages/labor/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/wuyi-banner.png"
                            />
                        </navigator>
                    </swiper-item>
                    <swiper-item v-if="!isH5">
                        <navigator
                            url="/pages/openGame/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/opengame-banner.png"
                            />
                        </navigator>
                    </swiper-item>
                    <swiper-item>
                        <navigator
                            url="/pages/read/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/read-banner.png"
                            />
                        </navigator>
                    </swiper-item>
                    <!-- 疫情入口 -->
                    <swiper-item>
                        <navigator
                            url="/pages/yiqing/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/prize-banner.png"
                            />
                        </navigator>
                    </swiper-item>
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
        </view>
        <navigator
            v-if="!isH5"
            url="/pages/openGame/zhibo"
        >
            <image
                class="zhibo-entry"
                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/zhibo-entry01.png"
            />
        </navigator>
        <work
            :title="'热门活动'"
            :more-url="'/pages/tabBar/upload/upload'"
            :info="hotList"
            :show-card="false"
        />
        <!-- menu -->
        <work
            :title="'爱挑战优秀个人'"
            :more-url="'/pages/work/list/list?cat_id=1'"
            :info="workData.individual.list"
            :cat-id="1"
        />
        <work
            :title="'爱挑战优秀团体'"
            :more-url="'/pages/work/list/list?cat_id=2'"
            :info="workData.team.list"
            :cat-id="2"
        />
        <work
            :title="'才艺秀优秀作品'"
            :more-url="'/pages/work/list/list?cat_id=3'"
            :info="workData.talent.list"
            :cat-id="3"
        />
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
            // background: ['color1', 'color2', 'color3'],
            indicatorDots: true,
            autoplay: true,
            interval: 5000,
            duration: 500,
            workData: {
                individual: { list: [], total: 0 },
                team: { list: [], total: 0 },
                talent: { list: [], total: 0 },
            },
            prompt: false,
            isFirstLogin: 'hasLiuyiPromt',
            status: 1,
            // show: 1,
            // #ifdef H5
            isH5: true,
            // #endif
            needBindMobile: false,
            changeValue: '',
            hotList: [],
            confList: [
                {
                    id: 9,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/liuyi-s-banner.png',
                    url: '/pages/activity-pages/children/index',
                },
                {
                    id: 8,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/wuyi-s-banner.png',
                    url: '/pages/activity-pages/labor/index',
                },
                {
                    id: 7,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/aitiaozhan-s-banner.png',
                    url: '/pages/openGame/index',
                },
                {
                    id: 6,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/read-s-banner.png',
                    url: '/pages/read/index',
                },
                {
                    id: 5,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/yiqing-s-banner.png',
                    url: '/pages/yiqing/index',
                },
            ],
            isSearchWord: false, // 是否设置了关键词
            searchWord: '',
        };
    },
    onHide() {
        this.changeValue = '';
        this.prompt = false;
    },
    onLoad() {
        this.getNewActivityStatus();
        this.thirdEntryPrompt();
        this.getData();
        this.getUserInfo();
        this.getSearchWord();
    },
    onShow() {
        // 页面从详情过来的，则，需要刷新一下页面数据，点赞量会变化。
        try {
            const value = uni.getStorageSync('onShowFrom');
            if (value === 'detail') {
                this.getData();
                this.getUserInfo();
                uni.setStorageSync('onShowFrom', '');
            }
        } catch (e) {
            uni.setStorageSync('onShowFrom', '');
            // error
        }
    },
    created() {},
    methods: {
        bindconfirm() {
            if (!this.changeValue.trim()) {
                if (this.isSearchWord) {
                    this.changeValue = this.searchWord;
                } else {
                    return uni.showToast({
                        title: '请输入搜索内容',
                        icon: 'none',
                    });
                }
            }
            // fr 统计关键字是
            const showType = this.changeValue === this.searchWord ? 1 : '';
            return uni.navigateTo({
                url: `/pages/work/list/list?keyword=${this.changeValue.trim()}&show_type=${showType}`,
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
        getNewActivityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: 9,
            }).then((data) => {
                console.log(data, 'aaaa');
                this.status = data.status;
                // 1显示  0不显示
            });
        },
        thirdEntryPrompt() {
            const isFirstLogin = uni.getStorageSync(this.isFirstLogin);
            if (uni.getStorageSync('hasReadPromt')) {
                uni.removeStorageSync('hasReadPromt');
            }
            if (uni.getStorageSync('hasLaborPromt')) {
                uni.removeStorageSync('hasLaborPromt');
            }
            if (!isFirstLogin) {
                this.prompt = true;
            }
        },
        handlePromt() {
            uni.setStorageSync(this.isFirstLogin, true);
            this.prompt = false;
            uni.navigateTo({
                url: '/pages/activity-pages/children/index',
            });
        },
        handleClose() {
            this.prompt = false;
            uni.setStorageSync(this.isFirstLogin, true);
        },
        getWorkList(type, refresh) {
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
                page_size: 6,
            }).then((res) => {
                if (type === 'individual') {
                    this.workData.individual = res;
                } else if (type === 'team') {
                    this.workData.team = res;
                } else if (type === 'talent') {
                    this.workData.talent = res;
                }
                if (refresh) {
                    uni.stopPullDownRefresh();
                }
            });
        },

        getData(refresh) {
            this.getAllShowActivity();
            this.getWorkList('individual');
            this.getWorkList('team');
            this.getWorkList('talent', refresh);
        },
        getAllShowActivity() {
            api.post('/api/activity/list', {
                page_size: 4,
                page_num: 1,
                status: 2,
            }).then((data) => {
                this.hotList = data.list.map((item) => {
                    let obj = item;
                    this.confList.forEach((d) => {
                        obj.start_time = obj.start_time.slice(0, 10);
                        obj.end_time = obj.end_time.slice(0, 10);
                        if (d.id === obj.id) {
                            obj = { ...obj, ...d };
                        }
                    });
                    return obj;
                });
            });
        },
        getSearchWord() {
            api.get('/api/works/searchword', {
                type: 1,
            }).then(
                (res) => {
                    if (res && res.status === 1) {
                        this.isSearchWord = true;
                        this.searchWord = res.rec_word;
                    } else {
                        this.searchWord = '请输入学校名称/作品名称/作者名称';
                    }
                },
                () => {
                    this.isSearchWord = false;
                    this.searchWord = '请输入学校名称/作品名称/作者名称';
                },
            );
        },
    },
    onPullDownRefresh() {
        this.getData('refresh');
        this.getSearchWord();
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
        width: 558upx;
        height: 700upx;
        display: block;
        margin: 130upx auto 0;
    }
    .join-btn {
        width: 540upx;
        height: 98upx;
        margin: 30upx auto 50upx;

        border-radius: 50upx;
        color: #fff;
        font-size: 40upx;
        line-height: 98upx;
        text-align: center;
        background-color: #c790ff;
        background-image: url(../../../static/images/work/querter-circle.png);
        background-repeat: no-repeat;
        background-position: 12rpx 12rpx;
        background-size: 34rpx 36rpx;
        box-shadow: 0 0 24rpx 0 rgba(255, 255, 255, 1) inset;
    }
    .close {
        width: 62upx;
        height: 62upx;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        border: 2upx solid #fff;
        &::before,
        &::after {
            position: absolute;
            content: "";
            width: 34upx;
            height: 4upx;
            left: 14upx;
            top: 28upx;
            border-radius: 2upx;
            background: #fff;
            transform: rotate(45deg);
        }
        &::after {
            transform: rotate(-45deg);
        }
    }
}
uni-swiper {
    .swiper-item {
        height: 100%;
    }
}
.zhibo-entry {
    width: 100%;
}
.page-index {
    padding-bottom: 20upx;
    position: relative;
    overflow-x: hidden;
    .search {
        width: 100%;
        font-size: 24upx;
        overflow: hidden;
        padding: 20upx 0 14upx 30upx;
        background: #fff;
        box-shadow: 0 0upx 5upx 0 rgba(0, 0, 0, 0.05);
        // margin-bottom: 10upx;
        input {
            background: #f3f3f3;
            border: none;
            border-radius: 30upx;
            width: 606upx;
            height: 60upx;
            float: left;
            display: block;
            padding: 0 40upx;
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
        .swiper {
            height: 280upx;
        }

        .banner-image {
            width: 690upx;
            height: 280upx;
            border-radius: 16upx;
        }
    }
    .menu-list {
        display: flex;
        padding-bottom: 16upx;
        // margin-bottom: 40upx;
        background: #f6f6f6;

        .item {
            background: #fff;
            flex: 1;
            text-align: center;
            padding-bottom: 38upx;

            .icon-wrap {
                margin: 0 auto;
                width: 106upx;
                height: 66upx;
                border-radius: 35upx;
                .icon {
                    // top: 15upx;
                    position: relative;
                    margin: auto;
                    width: 56upx;
                    height: 56upx;
                    background-size: 56upx 56upx;
                }
            }

            .name {
                font-size: 26upx;
                line-height: 26upx;
                font-weight: 600;
                color: #333;
            }
        }
    }
}
</style>
