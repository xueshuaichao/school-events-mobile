<template>
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll': rulePrompt || prizePromt
            }
        ]"
    >
        <rulemodel
            :show="rulePrompt"
            @toggelModel="toggelModel"
        />
        <prizemodel
            :show="prizePromt"
            @toggelModel="toggelModel"
        />
        <view class="activity-init-page">
            <view class="banner">
                <image
                    class="banner-image"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/banner.png"
                />
                <view
                    class="active-rule"
                    @click="handleActiverule"
                >
                    活动规则
                </view>
                <view
                    class="prize-rule"
                    @click="handlePrizerule"
                >
                    奖项说明
                </view>
                <template>
                    <i class="active-time">
                        活动时间： 9月30日-10月31日
                    </i>
                </template>
            </view>
            <view class="prizes-box">
                <image
                    class="block-title"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-prize-title.png"
                />
                <image
                    class="flower"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/flower.png"
                />
                <view
                    v-for="(item, index) in giftList"
                    :key="index"
                >
                    <view class="prize-types">
                        {{ item.title }}
                    </view>
                    <view class="block-prizes">
                        <view class="block-prizes-ctx">
                            <view class="rule">
                                {{ item.text }}
                            </view>
                            <view class="flex">
                                <view
                                    v-for="(subItem, key) in item.prizes"
                                    :key="key"
                                >
                                    <image
                                        class="img-gift"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-${index}-${key}.png`
                                        "
                                    />
                                    <view class="txt">
                                        {{ subItem.a }}
                                    </view>
                                    <view class="sub-txt">
                                        {{ subItem.b }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view
                    class="prize-more"
                    @click="handlePrizerule"
                >
                    更多奖品
                </view>
                <!-- 跑马灯 -->
                <tipsList
                    :text="'抽中了'"
                    :crousel-list="crouselList"
                />
            </view>
            <image
                class="block-title-act"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-act-title.png"
            />
            <view class="menu-list">
                <view class="search-box">
                    <view
                        class="btn"
                        :class="{ active: curBtn === 1 }"
                        @click="selBtn(1)"
                    >
                        人气榜
                    </view>
                    <view
                        class="btn"
                        :class="{ active: curBtn === 2 }"
                        @click="selBtn(2)"
                    >
                        闯关榜
                    </view>
                    <view class="search">
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_search.png"
                        />
                        <input
                            v-model="changeValue"
                            placeholder-style="color: #A4E6DC"
                            type="text"
                            confirm-type="search"
                            confirm-hold="true"
                            maxlength="13"
                            placeholder="请输入作者姓名或作品名称"
                            @confirm="bindconfirm"
                        >
                    </view>
                </view>
                <template v-if="curBtn === 1">
                    <view class="media-box">
                        <view
                            v-for="(item, index) in dataList"
                            :key="index"
                            class="poetry-work-card"
                        >
                            <view
                                class="top"
                                @click.native="viewDetail(item, index)"
                            >
                                <view
                                    v-if="item.rank"
                                    class="tag"
                                >
                                    排名{{ item.rank }}
                                </view>
                                <image
                                    class="img"
                                    :src="item.video_img_url"
                                />
                            </view>
                            <view class="name text-one-line">
                                {{ item.resource_name }}
                            </view>
                            <view class="vote-box">
                                <view class="vote-num">
                                    {{ item.ticket }}赞
                                </view>
                                <view
                                    class="vote"
                                    @click="handleVote(item)"
                                >
                                    <image
                                        class="like-icon"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_like_icon.png`
                                        "
                                    />
                                    赞
                                </view>
                            </view>
                        </view>
                        <view
                            v-if="!dataList.length"
                            class="data-none"
                        >
                            暂无数据
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view class="ranks-box">
                        <view class="rank-tip">
                            排行榜仅展示闯关关卡前100名用户，关卡相同取最先闯关成功的用户展示
                        </view>
                        <view class="rank-row th">
                            <view class="user">
                                头像
                            </view>
                            <view class="name">
                                用户名
                            </view>
                            <view class="level-title">
                                等级
                            </view>
                            <view class="barrier">
                                闯关关卡
                            </view>
                        </view>
                        <view
                            v-for="(item, index) in rankList"
                            :key="index"
                            class="rank-row infos"
                            @click="jumpUcenter(item)"
                        >
                            <view class="user">
                                <image
                                    class="avator"
                                    :src="
                                        item.avatar ||
                                            '/static/images/uc/avatar.png'
                                    "
                                />
                            </view>

                            <view class="name">
                                {{ item.name }}
                            </view>
                            <view class="level-title">
                                {{ item.level_title }}
                            </view>
                            <view class="barrier">
                                {{ item.barrier }}关
                            </view>
                        </view>
                        <view
                            v-if="rankList.length < 1"
                            class="data-none"
                        >
                            正在统计最新排名，敬请期待
                        </view>
                    </view>
                </template>
                <uni-load-more
                    class="loadMore"
                    :status="loadMoreStatus"
                    :content-text="{
                        contentdown: '',
                        contentrefresh: '正在加载...',
                        contentnomore: '———— 已经到底了~ ————'
                    }"
                    color="#254834"
                />
            </view>
            <view
                class="start"
                @click="start"
            >
                <template v-if="activityStatus == 1">
                    活动未开始
                </template>
                <template v-if="activityStatus == 2 && !hasJoin">
                    开始闯关
                </template>
                <template v-if="activityStatus == 2 && hasJoin">
                    继续闯关
                </template>
                <template v-if="activityStatus == 3">
                    查看关卡
                </template>
            </view>
        </view>
    </view>
</template>
<script>
import rulemodel from './rulemodel.vue';
import prizemodel from './prizemodel.vue';
import tipsList from './tips-list.vue';
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        rulemodel,
        prizemodel,
        tipsList,
        uniLoadMore,
    },
    data() {
        return {
            rulePrompt: false,
            prizePromt: false,
            changeValue: '',
            activityStatus: 1,
            hasJoin: false,
            isLogin: false,
            loadMoreStatus: 'more',
            dataList: [],
            total: 0,
            filter: {
                activity_id: 14,
                page_num: 1,
                page_size: 10,
                sort: 'new',
                activity_cat: 1,
            },
            giftList: [
                {
                    title: '闯关达人奖',
                    text: '参与诗词闯关关卡数量排名前20可获得如下奖品',
                    prizes: [
                        {
                            a: '小爱触屏音箱8',
                            b: '一等奖*2名',
                        },
                        {
                            a: '九阳养生壶',
                            b: '二等奖*6名',
                        },
                        {
                            a: '便携式榨汁机',
                            b: '二等奖*12名',
                        },
                    ],
                },
                {
                    title: '闯关人气奖',
                    text: '参与诗词作品点赞量排名前45的作品可获得如下奖品',
                    prizes: [
                        {
                            a: '苏泊尔豆浆机',
                            b: '一等奖*2名',
                        },
                        {
                            a: '小米电水壶',
                            b: '二等奖*15名',
                        },
                        {
                            a: '古风手账本套装',
                            b: '三等奖*28名',
                        },
                    ],
                },
                {
                    title: '闯关幸运奖',
                    text: '参与诗词闯关抽奖活动，即有机会获得如下奖品',
                    prizes: [
                        {
                            a: '小度音箱',
                            b: '',
                        },
                        {
                            a: '学生旅行箱',
                            b: '',
                        },
                        {
                            a: '无人机',
                            b: '',
                        },
                    ],
                },
            ],
            crouselList: [],
            curBtn: 1,
            dataList2: [
                {
                    id: '1',
                },
                {
                    id: '2',
                },
            ],
            rankList: [],
            fr: 'syhd',
        };
    },
    created() {
        this.getActivityStatus();
        this.getData();
        uni.$on('onReachBottom', () => {
            console.log(this.loadMoreStatus, 'onReachBottom');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                if (this.curBtn === 1) {
                    this.getData('reachBottom');
                } else {
                    this.getRankList('reachBottom');
                }
            }
        });
    },
    onLoad() {
        this.$refs.innerAudioContext.stop();
        this.$refs.innerAudioContextBg.stop();
    },
    onHide() {
        this.$refs.innerAudioContext.stop();
        this.$refs.innerAudioContextBg.stop();
    },

    methods: {
        onshow() {
            this.getActivityStatus();
        },
        getCrouselList() {
            this.postCrouselList();
            this.setId = setInterval(() => {
                this.postCrouselList();
            }, 1000 * 60 * 5);
        },
        postCrouselList() {
            api.post('/api/draw/getuser', {
                page_num: 1,
                page_size: 10,
                activity_id: 14,
            }).then((res) => {
                this.crouselList = res;
            });
        },
        viewDetail({ id }, index) {
            console.log(id, 'viewDetail');
            this.$store.commit('setFilterData', {
                position: {
                    total: this.total,
                    curposition: index,
                    from: '/api/activity/resourcelist',
                },
                filter: this.filter,
            });
            uni.navigateTo({
                url: `/pages/work/detail/detail?id=${id}&activity_id=${this.filter.activity_id}`,
            });
        },
        jumpUcenter(item) {
            uni.navigateTo({
                url: `/activity/pages/poetry/ucenter?activity_id=14&user_id=${item.user_id}`,
            });
        },
        getRankList(title) {
            api.post('/api/poem/barrierlist', {
                page_num: this.filter.page_num,
                page_size: this.filter.page_size,
            }).then(({ data, total }) => {
                if (!this.rankList.length) {
                    this.rankList = data;
                } else {
                    this.rankList = this.rankList.concat(data);
                }
                this.total = total;
                this.setUnimore(title);
            });
        },
        selBtn(num) {
            if (num !== this.curBtn) {
                this.curBtn = num;
                this.filter.page_num = 1;
                this.loadMoreStatus = 'more';
                this.total = 0;
                this.dataList = [];
                this.rankList = [];
                if (num === 2) {
                    this.getRankList();
                } else {
                    this.getData();
                }
            }
        },
        getData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
                    }

                    this.total = total;
                    this.setUnimore(title);
                    uni.hideLoading();
                },
            );
        },
        setUnimore(title) {
            const total = this.selBtn === 1 || (this.selBtn === 2 && this.total <= 100)
                ? this.total
                : 100;
            if (total <= this.filter.page_num * this.filter.page_size) {
                this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
            } else {
                this.loadMoreStatus = 'more';
            }
        },
        toggelModel() {
            this.rulePrompt = false;
            this.prizePromt = false;
        },
        handleActiverule() {
            this.rulePrompt = true;
        },
        handlePrizerule() {
            this.prizePromt = true;
        },
        getActivityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: 14,
            }).then((res) => {
                this.activityStatus = res.status;
                if (this.activityStatus > 1) {
                    this.userHasJoin();
                }
            });
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/activity/pages/mywork/myWorkList?type=search&name=${this.changeValue.trim()}&activity_id=14`,
            });
        },
        start() {
            if (this.activityStatus > 1) {
                api.isLogin({ fr: this.fr }).then(() => {
                    uni.navigateTo({
                        url: '/activity/pages/poetry/clearance',
                    });
                });
            }
        },
        userHasJoin() {
            api.get('/api/poem/userinfo').then((res) => {
                this.userInfo = res.user_info;
                this.getCrouselList();
                if (res.barrier > 0) {
                    this.hasJoin = true;
                } else {
                    this.hasJoin = false;
                }
            });
        },
        handleVote(item) {
            if (this.activityStatus === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    api.post('/api/activity/vote', {
                        id: item.id,
                        activity_id: this.filter.activity_id,
                    }).then(
                        () => {
                            // eslint-disable-next-line no-param-reassign
                            item.ticket += 1;
                            // eslint-disable-next-line no-param-reassign
                            item.vote_status = 1;
                            uni.showToast({
                                title: '已点赞',
                                icon: 'none',
                            });
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
<style scoped lang="less">
.start {
    position: fixed;
    bottom: 16upx;
    left: 100upx;
    width: 522upx;
    height: 90upx;
    text-align: center;
    line-height: 90upx;
    font-size: 32upx;
    color: #fff;
    font-weight: 600;
    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/upload-btn.png);
    background-size: 100% 100%;
    z-index: 2;
}
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.data-none {
    color: #254834;
    width: 690upx;
    text-align: center;
    line-height: 100upx;
}
.activity-init-page {
    background: #93d7cd;
    .banner {
        position: relative;
        height: 626upx;
        .banner-image {
            width: 100%;
            height: 626upx;
        }
        .active-rule,
        .prize-rule {
            position: absolute;
            top: 16upx;
            width: 185upx;
            height: 56upx;
            line-height: 56upx;
            font-size: 28upx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .active-rule {
            left: 0;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/act-top-bg.png);
            text-indent: 12upx;
            background-position-x: -4upx;
            color: #266a89;
        }
        .prize-rule {
            right: 0;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-top-bg.png);
            text-align: right;
            padding-right: 12upx;
            background-position-x: 4upx;
            color: #75a531;
        }
        .active-time {
            position: absolute;
            top: 520upx;
            left: 218upx;
            color: #64937c;
            font-size: 22upx;
            font-style: normal;
        }
    }
    .prizes-box {
        height: 1375upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-bg.png);
        background-size: 750upx 1375upx;
        padding: 0 50upx 0;
        position: relative;
        .block-title {
            width: 750upx;
            height: 86upx;
            top: -86upx;
            position: absolute;
            left: 0;
        }
        .flower {
            position: absolute;
            right: 0;
            top: 300upx;
            width: 135upx;
            height: 133upx;
        }
        .prize-types {
            width: 360upx;
            height: 28upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-prize-bg.png);
            background-size: 100% 15upx;
            background-repeat: no-repeat;
            background-position-y: 6px;
            text-align: center;
            color: #739c68;
            font-size: 28upx;
            font-weight: 600;
            margin: 0 auto 20upx;
        }
        .block-prizes {
            border: 2upx solid #c2deb4;
            padding: 8upx;
            margin-bottom: 10upx;
            .block-prizes-ctx {
                background: #c2deb4;
                padding: 0 0 10upx;
            }
            .rule {
                color: #83ab7e;
                font-size: 20upx;
                text-align: center;
                line-height: 50upx;
            }

            .flex {
                display: flex;
                justify-content: space-evenly;
                text-align: center;
                .img-gift {
                    width: 173upx;
                    height: 173upx;
                }
                .txt {
                    color: #254834;
                    font-size: 24upx;
                    line-height: 40upx;
                }
                .sub-txt {
                    color: #83aa7e;
                    font-size: 20upx;
                }
            }
        }
        .prize-more {
            text-align: center;
            color: #64937c;
            width: 167upx;
            height: 54upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-more-prize.png);
            background-size: 100%;
            line-height: 54upx;
            margin-left: 246upx;
        }
    }
    .block-title-act {
        width: 750upx;
        height: 63upx;
    }
    .menu-list {
        padding-bottom: 106upx;
        .search-box {
            margin-bottom: 30rpx;
            display: flex;
            padding: 0 30upx;
            justify-content: space-between;
            .btn {
                width: 148upx;
                height: 64upx;
                line-height: 64upx;
                color: #254834;
                font-size: 28upx;
                font-weight: 600;
                text-align: center;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-btn.png);
                background-size: 100% 100%;
                &.active {
                    color: #f9e19f;
                    text-shadow: 0px 2px 4px rgba(44, NaN, 28, 0.35);
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-btn-active.png);
                    background-size: 100% 100%;
                }
            }
            .search {
                width: 382upx;
                height: 64upx;
                position: relative;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-box.png);
                background-size: 100% 100%;
                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 34upx;
                }
                input {
                    width: 268upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 50upx;
                    font-size: 22upx;
                    color: #fff;
                }
            }
        }
        .ranks-box {
            .rank-tip {
                color: #fff;
                font-size: 20upx;
                line-height: 28upx;
                text-align: center;
            }
            .rank-row {
                display: flex;
                justify-content: space-around;
                font-size: 32upx;
                text-align: center;
                .user {
                    width: 15%;
                }
                .name {
                    width: 35%;
                }
                .level-title,
                .barrier {
                    width: 25%;
                }

                &.th {
                    color: #004137;
                    line-height: 44upx;
                    font-weight: 500;
                    margin-top: 20upx;
                    margin-bottom: 20upx;
                }
                &.infos {
                    color: #238375;
                    margin-bottom: 20upx;
                    text-align: center;
                    .avator {
                        width: 60upx;
                        height: 60upx;
                        border-radius: 50%;
                    }
                }
            }
        }
        .media-box {
            display: flex;
            justify-content: space-between;
            flex-flow: row wrap;
            padding: 0 30upx;
            .poetry-work-card {
                width: 335upx;
                height: 344upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-work-card.png);
                background-size: 100% 100%;
                padding: 16upx 12upx;
                box-sizing: border-box;
                .top {
                    width: 310upx;
                    height: 204upx;
                    background: #fff;
                    position: relative;
                    .tag {
                        background: #5f8b83;
                        padding: 0 18upx 0 6upx;
                        line-height: 38upx;
                        color: #fff;
                        font-size: 18upx;
                        position: absolute;
                        left: 0;
                        top: 20upx;
                        z-index: 1;
                        border-radius: 0 20upx 20upx 0;
                    }
                    .img {
                        width: 100%;
                        height: 100%;
                    }
                }
                .name {
                    font-size: 24upx;
                    line-height: 50upx;
                }
                .vote-box {
                    display: flex;
                    justify-content: space-between;
                    line-height: 58upx;
                    .vote-num {
                        color: #254834;
                        font-size: 30upx;
                    }
                    .vote {
                        width: 116upx;
                        height: 58upx;
                        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-vote-card.png);
                        background-size: 100% 100%;
                        color: #fff;
                        font-size: 24upx;
                        .like-icon {
                            width: 27upx;
                            height: 27upx;
                            margin-right: 36upx;
                            position: relative;
                            bottom: -2upx;
                            left: 20upx;
                        }
                    }
                }
            }
        }
    }
}
</style>
