<template>
    <view class="page-index">
        <view
            v-if="prompt && status === 2"
            class="cover"
        >
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/suspension-jiuyi.png"
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
        </view>
        <!-- search -->
        <view class="search">
            <input
                v-model="changeValue"
                placeholder-class="placeholderStyle"
                :placeholder="searchWord"
                maxlength="13"
                @confirm="bindconfirm"
                @focus="showSearchDrop = true"
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
                    <swiper-item
                        v-for="(item, index) in bannerlist"
                        :key="index"
                        class="swiper-item"
                        @click="jumpIndex(item)"
                    >
                        <image
                            class="banner-image"
                            :src="item.banner_image"
                        />
                    </swiper-item>
                    <!-- <swiper-item>
                        <navigator
                            url="/pages/activity-pages/labor/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/wuyi-banner.png"
                            />
                        </navigator>
                    </swiper-item> -->
                    <!-- <swiper-item v-if="!isH5">
                        <navigator
                            url="/pages/openGame/index"
                            class="swiper-item"
                        >
                            <image
                                class="banner-image"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/opengame-banner.png"
                            />
                        </navigator>
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
        </view>
        <!-- <navigator
            v-if="!isH5"
            url="/pages/openGame/zhibo"
        >
            <image
                class="zhibo-entry"
                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/zhibo-entry01.png"
            />
        </navigator> -->
        <work
            :title="'热门活动'"
            :more-url="'/pages/tabBar/upload/upload'"
            :info="hotList"
            :show-card="false"
        />
        <!-- menu -->
        <work
            :title="'爱挑战竞技优秀作品'"
            :more-url="'/pages/work/list/list?cat_id=0'"
            :info="workData.individual.list"
            :cat-id="0"
        />
        <work
            :title="'爱挑战吉尼斯优秀作品'"
            :more-url="'/pages/work/list/list?cat_id=6'"
            :info="workData.team.list"
            :cat-id="6"
        />
        <work
            :title="'才艺秀优秀作品'"
            :more-url="'/pages/work/list/list?cat_id=3'"
            :info="workData.talent.list"
            :cat-id="3"
        />
        <my-dropdown
            :search-drop-status="showSearchDrop"
            :drop-list="dropList"
            @searchStatus="searchStatus"
            @setHotWord="setHotWord"
        />
    </view>
</template>

<script>
import work from '../../../widgets/work/work.vue';
import api from '../../../common/api';
import myDropdown from '../../../components/search/my-dropdown.vue';
// import bindMobile from '../../../components/bind-mobile/index.vue';

export default {
    components: {
        work,
        myDropdown,
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
            isFirstLogin: 'hasBayiPromt',
            status: 1,
            // show: 1,
            // #ifdef H5
            isH5: true,
            // #endif
            needBindMobile: false,
            changeValue: '',
            hotList: [],
            bannerlist: [],
            confList: [
                {
                    id: 14,
                    url: '/activity/pages/index?activity_id=14',
                },
                {
                    id: 13,
                    url: '/activity/pages/index?activity_id=13',
                },
                {
                    id: 12,
                    url: '/activity/pages/index?activity_id=12',
                },
                {
                    id: 11,
                    url: '/pages/openGame/school-zhibo',
                },
                {
                    id: 10,
                    url: '/activity/pages/index?activity_id=10',
                },
                {
                    id: 9,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/liuyi-s-banner.png',
                    url: '/activity/pages/children/index',
                },
                {
                    id: 8,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/wuyi-s-banner.png',
                    url: '/activity/pages/index?activity_id=8',
                },
                {
                    id: 7,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/aitiaozhan-s-banner.png',
                    url: '/pages/openGame/index',
                },
            ],
            isSearchWord: false, // 是否设置了关键词
            searchWord: '',
            showSearchDrop: false,
            dropList: [],
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
        this.getBannerList();
    },
    onShow() {
        this.showSearchDrop = false;
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
        jumpIndex(item) {
            if (item.banner_url) {
                if (item.banner_url.indexOf('http') === -1) {
                    uni.navigateTo({
                        url: item.banner_url,
                    });
                } else {
                    window.location.href = item.banner_url;
                }
            }
        },
        getBannerList() {
            let id = 5;
            if (this.isH5) {
                id = 6;
            }
            api.get(`/api/banner/list?space_id=${id}`).then((list) => {
                this.bannerlist = list;
            });
        },
        searchStatus(val) {
            this.showSearchDrop = val;
        },
        setHotWord(word) {
            console.log(word, 'asa');
            if (word) {
                this.searchWord = word;
                this.bindconfirm();
            }
            this.showSearchDrop = false;
        },
        bindconfirm() {
            if (!this.changeValue.trim()) {
                this.showSearchDrop = false;
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

            const showType = this.dropList.includes(this.changeValue.trim())
                ? 1
                : '';
            return uni.navigateTo({
                url: `/pages/work/list/list?keyword=${this.changeValue.trim()}&show_type=${showType}&cat_id=-1`,
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
                activity_id: 13,
            }).then((data) => {
                if (data.status) {
                    this.status = data.status;
                }
            });
        },
        thirdEntryPrompt() {
            const isFirstLogin = uni.getStorageSync(this.isFirstLogin);
            if (uni.getStorageSync('hasBayiPromt')) {
                uni.removeStorageSync('hasBayiPromt');
            }
            if (!isFirstLogin) {
                this.prompt = true;
            }
        },
        handlePromt() {
            uni.setStorageSync(this.isFirstLogin, true);
            this.prompt = false;
            uni.navigateTo({
                url: '/activity/pages/index?activity_id=13',
            });
        },
        handleClose() {
            this.prompt = false;
            uni.setStorageSync(this.isFirstLogin, true);
        },
        getWorkList(type, refresh) {
            let catId;
            if (type === 'atz') {
                catId = 0;
            } else if (type === 'guiness') {
                catId = 6;
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
                if (type === 'atz') {
                    this.workData.individual = res;
                } else if (type === 'guiness') {
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
            this.getHotActivity();
            this.getBannerList();
            this.getWorkList('atz');
            this.getWorkList('guiness');
            this.getWorkList('talent', refresh);
        },
        getHotActivity() {
            api.get('/api/activity/hotactivity').then((data) => {
                this.hotList = data.map((item) => {
                    let obj = item;
                    obj.start_time = obj.start_time.slice(0, 10);
                    obj.end_time = obj.end_time.slice(0, 10);
                    if (obj.activity_base > 999999999) {
                        obj.activity_base_c = '99999W+';
                    } else {
                        obj.activity_base_c = obj.activity_base > 100000
                            ? `${Math.floor(obj.activity_base / 10000)}W+`
                            : `${obj.activity_base}人`;
                    }
                    this.confList.forEach((d) => {
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
                (data) => {
                    if (data && data.length) {
                        this.isSearchWord = true;
                        this.dropList = [];
                        data.forEach((d) => {
                            this.dropList.push(d.rec_word);
                        });
                        this.searchWord = data[0].rec_word;
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
        width: 558rpx;
        height: 700rpx;
        display: block;
        margin: 160upx auto 0;
    }
    .join-btn {
        width: 420upx;
        height: 110upx;
        margin: -50upx auto 30upx;
        border-radius: 60upx;
        color: #fff;
        font-size: 40upx;
        line-height: 110upx;
        text-align: center;
        background: linear-gradient(
            0deg,
            rgba(219, 78, 14, 1),
            rgba(255, 159, 115, 1)
        );
        position: relative;
        z-index: 1;
    }
    .close {
        width: 52upx;
        height: 52upx;
        border-radius: 50%;
        margin: 0 auto;
        position: relative;
        background: linear-gradient(
            0deg,
            rgba(219, 78, 14, 1),
            rgba(255, 159, 115, 1)
        );
        &::before,
        &::after {
            position: absolute;
            content: "";
            width: 24upx;
            height: 4upx;
            left: 14upx;
            top: 24upx;
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
        padding: 20upx 0 30upx 30upx;
        background: #fff;
        box-shadow: 0 0upx 5upx 0 rgba(0, 0, 0, 0.05);
        // margin-bottom: 10upx;
        position: fixed;
        z-index: 103;
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
            font-size: 28upx;
        }
        .placeholderStyle {
            color: #999999;
            text-align: left;
            font-size: 26upx;
        }
        .button {
            float: left;
            height: 60upx;
            line-height: 60upx;
            color: #666666;
            font-size: 32upx;
            margin-left: 26upx;
        }
    }
    .main-swiper {
        padding: 0 30rpx 30rpx;
        margin-top: 112rpx;

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
