<template>
    <view :class="['activity-page-index', className]">
        <view
            :class="['page-index', { 'stop-scroll': prompt || isStopScroll }]"
        >
            <view class="main-swiper">
                <view class="banner">
                    <view>
                        <image
                            class="banner-image"
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${
                                    publicConfig.activityName
                                }_main.${publicConfig.isPNG ? 'png' : 'jpg'}`
                            "
                        />
                    </view>

                    <view
                        class="active-rule"
                        @click="handleActiverule"
                    >
                        活动规则
                    </view>
                    <view
                        class="menu-title"
                        @click="handleMywork"
                    >
                        我的作品
                    </view>
                    <template v-show="publicConfig.time !== ''">
                        <i class="active-time">
                            {{ publicConfig.time }}
                        </i>
                    </template>
                </view>
                <view class="main-content">
                    <slot name="main-data" />
                    <!-- work show -->
                    <view class="menu-list">
                        <view class="cansai-text">
                            <template v-if="publicConfig.activityId !== 12">
                                ——
                                {{
                                    publicConfig.activityId === 10
                                        ? "参赛作品"
                                        : "活动作品"
                                }}
                                ——
                            </template>
                            <template v-else>
                                活动作品
                            </template>
                        </view>
                        <view class="search-box">
                            <button
                                v-for="(item, index) in publicConfig.catMenu"
                                :key="index"
                                :class="{
                                    active: filter.activity_cat === index + 1
                                }"
                                @click="toggle(index + 1)"
                            >
                                {{ item }}
                            </button>
                            <button
                                v-for="(item, index) in publicConfig.sort"
                                :key="index"
                                :class="{
                                    active:
                                        filter.sort ===
                                        (index === 0 ? 'new' : 'hot')
                                }"
                                @click="toggle(index === 0 ? 'new' : 'hot')"
                            >
                                {{ item }}
                            </button>
                            <view class="search">
                                <image
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_search.png`
                                    "
                                />
                                <input
                                    v-model="changeValue"
                                    :placeholder-style="
                                        `color:${publicConfig.placeholderColor}`
                                    "
                                    type="text"
                                    confirm-type="search"
                                    confirm-hold="true"
                                    maxlength="13"
                                    placeholder="请输入作者姓名或作品名称"
                                    @confirm="bindconfirm"
                                >
                                <text
                                    class="search-button"
                                    @click="bindconfirm"
                                >
                                    搜索
                                </text>
                            </view>
                        </view>
                        <view
                            v-if="filter.activity_id === 'tiktok'"
                            class="search-box tiktok"
                        >
                            <button
                                v-for="(item, index) in tiktokCats"
                                :key="index"
                                :class="{
                                    active: filter.cat_id === item.cat_id
                                }"
                                @click="tiktokToggle(item.cat_id)"
                            >
                                {{ item.name }}
                            </button>
                        </view>
                        <view class="media-box">
                            <view
                                v-for="(item, index) in dataList"
                                :key="item.id"
                                class="media-content"
                            >
                                <event-craft-cover
                                    :info="item"
                                    :bg-color="publicConfig.primaryBgColor"
                                    class="clocked-work"
                                    :activity-id="publicConfig.activityId"
                                    @click.native="viewDetail(item, index)"
                                />
                                <view
                                    v-if="publicConfig.activityId === 10"
                                    class="media-name create-by text-one-line"
                                >
                                    {{ `${item.user_name}` }}
                                </view>
                                <view class="media-name text-one-line">
                                    {{ `${item.resource_name}` }}
                                </view>
                                <view
                                    v-if="publicConfig.activityId === 'tiktok'"
                                    :class="[
                                        'work-author',
                                        item.is_team_resource ? 's' : ''
                                    ]"
                                >
                                    <view
                                        v-if="!item.is_team_resource"
                                        class="name text-one-line"
                                    >
                                        {{ item.create_name || "" }}
                                    </view>
                                    <view class="from text-one-line">
                                        {{ item.create_user_class || "" }}
                                    </view>
                                </view>

                                <text class="vote-num">
                                    {{
                                        item.ticket || item.praise_count || 0
                                    }}赞
                                </text>
                                <view
                                    class="vote"
                                    @click="handleVote(item)"
                                >
                                    <image
                                        class="like-icon"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_like_icon.png`
                                        "
                                    />
                                    点赞
                                </view>
                            </view>
                            <view
                                v-if="dataList.length === 0"
                                class="media-fill"
                            >
                                暂无数据～
                            </view>
                            <uni-load-more
                                class="loadMore"
                                :status="loadMoreStatus"
                                :content-text="{
                                    contentdown: '上拉显示更多',
                                    contentrefresh: '正在加载...',
                                    contentnomore: '———— 已经到底了~ ————'
                                }"
                                :color="publicConfig.primaryColor"
                            />
                        </view>
                    </view>
                </view>
                <view
                    v-if="!hideButton"
                    :class="
                        status === 2 || status === 1 || isH5
                            ? 'upload'
                            : 'upload-disable'
                    "
                    @click="handleUpload"
                >
                    <!-- // 1未开始，2进行中，3已结束 -->
                    <template v-if="status === 1">
                        活动未开始
                    </template>
                    <template v-else-if="status === 2">
                        上传作品
                    </template>
                    <template v-else>
                        活动已结束
                    </template>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';
// import utils from '../../../common/utils';

export default {
    filters: {
        plusXing: (val) => {
            if (val.length === 11) {
                return `${val.substr(0, 3)}****${val.substr(7)}`;
            }
            return val;
        },
    },
    components: {
        uniLoadMore,
        EventCraftCover,
    },
    props: {
        className: {
            type: String,
            default: '',
        },
        mainImage: {
            type: String,
            default: '',
        },
        isStopScroll: {
            type: Boolean,
            default: false,
        },
        indexConfig: {
            type: Object,
            default() {
                return {};
            },
        },
        publicConfig: {
            type: Object,
            default() {
                return {};
            },
        },
        fr: {
            type: String,
            default: '',
        },
        hideButton: {
            type: Boolean,
            default: false,
        },
        myWorkPath: {
            type: String,
            default: '',
        },
        listUrl: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            changeValue: '',
            loadMoreStatus: 'more',
            prompt: false,
            isPlayed: false,
            dataList: [],
            filter: {
                cat_id: this.publicConfig.catId,
                activity_id: this.publicConfig.activityId,
                page_num: 1,
                page_size: 10,
                sort: 'new',
                activity_cat: 1,
            },
            status: 2,
            crouselList: [],
            setId: '',
            userkey: '',
            tiktokCats: [
                {
                    cat_id: '',
                    name: '全部',
                },
                {
                    cat_id: 133,
                    name: '教育抖音微视频',
                },
                {
                    cat_id: 134,
                    name: '校园宣传短视频',
                },
                {
                    cat_id: 135,
                    name: '校园微电影',
                },
            ],
        };
    },
    computed: {
        workPath() {
            return this.myWorkPath;
        },
    },
    mounted() {
        uni.$on('onReachBottom', () => {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        });
    },
    created() {
        this.getData();
        if (!this.hideButton) {
            this.activityStatus();
        }
    },
    onShow() {},
    onHide() {
        this.changeValue = '';
    },
    onUnload() {
        clearInterval(this.setId);
    },
    methods: {
        getData(title) {
            if (this.filter.activity_id === 'tiktok') {
                delete this.filter.sort;
                delete this.filter.activity_cat;
            }
            api.post(
                this.listUrl || '/api/activity/resourcelist',
                this.filter,
            ).then(({ list, total }) => {
                if (title === 'reachBottom') {
                    this.dataList = this.dataList.concat(list);
                } else {
                    this.dataList = list;
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
                uni.hideLoading();
            });
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: this.filter.activity_id,
            }).then((res) => {
                this.status = res.status;
            });
        },
        handleUpload() {
            if (this.status === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    uni.navigateTo({
                        url: `/activity/pages/upload/modify?activity_id=${this.filter.activity_id}`,
                    });
                });
            } else {
                uni.showToast({
                    title:
                        this.status === 1
                            ? '活动未开始，敬请期待'
                            : '活动已结束',
                    icon: 'none',
                });
            }
            return true;
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/activity/pages/mywork/mywork?type=search&name=${this.changeValue.trim()}&activity_id=${
                    this.filter.activity_id
                }`,
            });
        },
        viewDetail({ id }, index) {
            let from = '/api/activity/resourcelist';
            if (this.filter.activity_id === 'tiktok') {
                this.filter.parent_scope = 3;
                from = '/api/works/list';
            }
            this.$store.commit('setFilterData', {
                position: {
                    total: this.total,
                    curposition: index,
                    from,
                },
                filter: this.filter,
            });
            uni.navigateTo({
                url: `/pages/work/detail/detail?id=${id}&activity_id=${this.filter.activity_id}`,
            });
        },
        toggle(k) {
            uni.showLoading();
            if (this.publicConfig.catMenu.length) {
                this.filter.activity_cat = Number(k);
            }
            if (this.publicConfig.sort.length) {
                this.filter.sort = k;
            }
            this.filter.page_num = 1;
            this.getData();
        },
        tiktokToggle(k) {
            this.filter.cat_id = k;
            this.filter.page_num = 1;
            this.getData();
        },
        handleActiverule() {
            // this.prompt = true;
            this.$emit('showMask', { title: '活动规则', type: 0 });
        },
        handleMywork() {
            if (this.filter.activity_id !== 12) {
                api.isLogin({
                    fr: this.fr,
                }).then(
                    () => {
                        uni.navigateTo({
                            url: this.workPath
                                ? this.workPath
                                : `/activity/pages/mywork/mywork?type=myWork&activity_id=${this.filter.activity_id}`,
                        });
                    },
                    () => {},
                );
            } else {
                this.$emit('toUcenter');
            }
        },
        handleVote(item) {
            if (this.status === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    const isTiktok = this.filter.activity_id === 'tiktok';
                    const activityParams = {
                        id: item.id,
                        activity_id: this.filter.activity_id,
                    };
                    const tiktokParams = {
                        object_id: item.id,
                        object_type: 1,
                        type: 1,
                    };
                    const url = isTiktok
                        ? '/api/common/like'
                        : '/api/activity/vote';
                    const params = isTiktok ? tiktokParams : activityParams;

                    api.post(url, params).then(
                        () => {
                            if (isTiktok) {
                                // eslint-disable-next-line no-param-reassign
                                item.praise_count += 1;
                            } else {
                                // eslint-disable-next-line no-param-reassign
                                item.ticket += 1;
                            }
                            // eslint-disable-next-line no-param-reassign
                            item.vote_status = 1;
                            uni.showToast({
                                title: '已点赞',
                                icon: 'none',
                            });
                            this.$emit('voteCallBack');
                        },
                        (res) => {
                            uni.showToast({
                                title: res.message,
                                icon: 'none',
                            });
                        },
                    );
                });
            } else {
                uni.showToast({
                    title:
                        this.status === 1
                            ? '活动未开始，敬请期待'
                            : '活动已结束',
                    icon: 'none',
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.loadMore {
    width: 100%;
}
.upload {
    position: fixed;
    bottom: 0upx;
    background: #04a875;
    text-align: center;
    width: 100%;
    color: #fff;
    height: 116upx;
    font-size: 36upx;
    line-height: 116upx;
    text-align: center;
    z-index: 10;
}
.upload-disable {
    position: fixed;
    bottom: 0upx;
    background: linear-gradient(
        0deg,
        rgba(133, 115, 102, 1),
        rgba(179, 170, 152, 1)
    );
    // background-size: 100% 100%;
    text-align: center;
    width: 100%;
    height: 116upx;
    color: #e4ded4;
    font-size: 36upx;
    line-height: 116upx;
    z-index: 10;
}
.cansai-text {
    // width: 312upx;
    height: 44upx;
    // margin-left: 220upx;
    margin-top: 35upx;
    color: #138256;
    text-align: center;
}

.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
    .media-content {
        width: 335upx;
        justify-items: space-betwen;
        position: relative;
        margin-bottom: 50upx;
        .video {
            width: 335upx;
            height: 225upx;
        }
        .media-name {
            color: #056446;
            width: 100%;
            // left:0;
            // top:290upx;
            font-size: 24upx;
            margin-bottom: 10upx;
        }
        .vote-num {
            color: #08402f;
            font-size: 30upx;
            float: left;
            margin-top: 10upx;
        }
        .like-icon {
            width: 27upx;
            height: 27upx;
            margin-right: 5upx;
        }
        .vote {
            float: right;
            width: 130upx;
            height: 60upx;
            background: #0f8c64;
            border-radius: 30upx;
            color: rgba(255, 255, 255, 1);
            font-size: 28upx;
            line-height: 60upx;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .media-icon {
            width: 40upx;
            height: 40upx;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 20upx;
            text-align: center;
            line-height: 42upx;
            position: absolute;
            top: 175upx;
            right: 10upx;
            image {
                width: 22upx;
                height: 22upx;
            }
        }
        .work-author {
            display: flex;
            color: #fff;
            font-size: 22upx;
            line-height: 30upx;
            margin-bottom: 18upx;

            .name {
                width: 135upx;
            }
            .from {
                flex: 1;
                text-align: right;
            }
            &.s {
                .from {
                    text-align: left;
                }
            }
        }
    }
    .media-fill {
        height: 253upx;
        text-align: center;
        color: #0f8c64;
        width: 100%;
        line-height: 253upx;
    }
}

.page-index {
    padding-bottom: 20upx;
    display: relative;
    .main-swiper {
        .banner {
            position: relative;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            text-align: center;
            margin-bottom: 12upx;
            .banner-image {
                width: 100%;
                height: 100%;
            }
            .active-rule,
            .menu-title {
                position: absolute;
                top: 19upx;
                width: 120upx;
                height: 48upx;
                line-height: 48upx;
                font-size: 22upx;
                color: #fff;
            }
            .active-rule {
                left: 0;
                border-radius: 0px 24px 24px 0px;
            }
            .menu-title {
                right: 0;
                border-radius: 24px 0px 0px 24px;
            }
            .active-time {
                position: absolute;
                top: 310upx;
                left: 218upx;
                color: #fff;
                font-size: 22upx;
                font-style: normal;
            }
        }
        .main-content {
            position: relative;
            z-index: 1;
        }
    }

    .menu-list {
        padding: 30upx;
        padding-top: 35upx;
        padding-bottom: 120upx;
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
            &.tiktok {
                display: flex;
                justify-content: space-between;
                button {
                    width: auto;
                    color: #fff;
                    border: 0 none;
                    font-size: 26upx;
                    min-width: 98upx;
                    padding: 0 10upx;
                    box-sizing: content-box;
                    &.active {
                        background: #f73944;
                    }
                }
            }
            button {
                width: 144upx;
                height: 68upx;
                float: left;
                line-height: 68upx;
                color: #000;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;
                border-radius: 34upx;
                padding: 0;
                &.active {
                    background: #05af7c;
                    color: #fff;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                width: 400upx;
                height: 72upx;
                position: relative;
                float: right;
                border-radius: 60upx;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 12upx;
                }
                input {
                    width: 276upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 50upx;
                    font-size: 22upx;
                    color: #fff;
                }
                .search-button {
                    font-size: 24upx;
                    color: #fff;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 22upx;
                }
            }
        }
    }
}
.stop-scroll {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
