<template>
    <view
        class="activity-page-index"
        :style="{ 'background-color': publicConfig.mainBgColor }"
    >
        <official-account v-if="!isH5" />
        <view :class="['page-index', { 'stop-scroll': prompt }]">
            <!-- 活动规则 -->
            <rule
                v-if="prompt"
                :rules="indexConfig.rules"
                :theme="{
                    bgColor: publicConfig.primaryBgColor,
                    titleColor: publicConfig.titleColor
                }"
                :name="publicConfig.activityName"
                @close="handleClose"
            />
            <!-- 奖品说明 -->
            <prize-desc
                v-if="prizePrompt"
                :prizes-detail="indexConfig.prizesDetail"
                :theme="{
                    bgColor: publicConfig.primaryBgColor,
                    titleColor: publicConfig.titleColor
                }"
                :name="publicConfig.activityName"
                @close="handleClose"
            />
            <view class="main-swiper">
                <view class="banner">
                    <view>
                        <image
                            class="banner-image"
                            style="height:914upx"
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_main.jpg`
                            "
                        />
                    </view>

                    <view
                        class="active-rule"
                        :style="{
                            'background-color': publicConfig.primaryColor
                        }"
                        @click="handleActiverule"
                    >
                        活动规则
                    </view>
                    <view
                        class="menu-title"
                        :style="{
                            'background-color': publicConfig.primaryColor
                        }"
                        @click="handleMywork"
                    >
                        我的作品
                    </view>
                    <template v-show="publicConfig.time !== ''">
                        <i
                            class="active-time"
                            :style="{ color: publicConfig.primaryColor }"
                        >
                            活动时间：{{ publicConfig.time }}
                        </i>
                    </template>
                </view>
                <view class="main-content">
                    <!-- 奖品 -->
                    <prize
                        :name="publicConfig.activityName"
                        :text-color="publicConfig.primaryColor"
                        :prize-list="indexConfig.prizes"
                        @handleActiveprize="handleActiveprize"
                    />
                    <slot name="rank" />
                    <!-- 跑马灯 -->
                    <tipsList
                        :crousel-list="crouselList"
                        :theme="{
                            mainColor: publicConfig.primaryColor,
                            bgColor: publicConfig.primaryBgColor
                        }"
                    />
                    <view
                        class="cansai-text"
                        :style="{ color: publicConfig.primaryColor }"
                    >
                        —— 活动作品 ——
                    </view>
                    <!-- work show -->
                    <view class="menu-list">
                        <view class="search-box">
                            <button
                                v-for="(item, index) in publicConfig.catMenu"
                                :key="index"
                                :style="{
                                    'background-color':
                                        filter.activity_cat === index + 1
                                            ? publicConfig.primaryColor
                                            : '',
                                    color:
                                        filter.activity_cat === index + 1
                                            ? '#fff'
                                            : publicConfig.darkPrimaryColor
                                }"
                                @click="toggle(index + 1)"
                            >
                                {{ item }}
                            </button>
                            <button
                                v-for="(item, index) in publicConfig.sort"
                                :key="index"
                                :style="{
                                    'background-color':
                                        filter.sort ===
                                        (index === 0 ? 'new' : 'hot')
                                            ? publicConfig.primaryColor
                                            : '',
                                    color:
                                        filter.sort ===
                                        (index === 0 ? 'new' : 'hot')
                                            ? '#fff'
                                            : publicConfig.darkPrimaryColor
                                }"
                                @click="toggle(index === 0 ? 'new' : 'hot')"
                            >
                                {{ item }}
                            </button>
                            <view
                                class="search"
                                :style="{
                                    'background-color':
                                        publicConfig.primaryBgColor
                                }"
                            >
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
                        <view class="media-box">
                            <view
                                v-for="item in dataList"
                                :key="item.id"
                                class="media-content"
                            >
                                <event-craft-cover
                                    :info="item"
                                    :bg-color="publicConfig.primaryBgColor"
                                    @click.native="viewDetail(item)"
                                />

                                <view
                                    class="media-name text-one-line"
                                    :style="{
                                        color: publicConfig.infoColor
                                    }"
                                >
                                    {{ `${item.resource_name}` }}
                                </view>
                                <text
                                    class="vote-num"
                                    :style="{
                                        color: publicConfig.darkPrimaryColor
                                    }"
                                >
                                    {{ item.ticket }}赞
                                </text>
                                <view
                                    class="vote"
                                    :style="{
                                        'background-color':
                                            publicConfig.primaryColor
                                    }"
                                    @click="handleVote(item)"
                                >
                                    <image
                                        class="like-icon"
                                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_like_icon.png"
                                    />
                                    点赞
                                </view>
                            </view>
                            <view
                                v-if="dataList.length === 0"
                                class="media-fill"
                                :style="{
                                    color: publicConfig.primaryColor
                                }"
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
                    :class="status === 2 || isH5 ? 'upload' : 'upload-disable'"
                    :style="{ 'background-color': publicConfig.primaryColor }"
                    @click="handleUpload"
                >
                    上传作品
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import rule from './rule.vue';
import prizeDesc from './prize-desc.vue';
import prize from './prize.vue';
import tipsList from './tips-list.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
// import share from '../../../common/share';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';

export default {
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 335;
            const height = 225;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
        plusXing: (val) => {
            if (val.length === 11) {
                return `${val.substr(0, 3)}****${val.substr(7)}`;
            }
            return val;
        },
    },
    components: {
        uniLoadMore,
        rule,
        prizeDesc,
        prize,
        tipsList,
        EventCraftCover,
    },
    props: {
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
        shareConfig: {
            type: Object,
            default() {
                return {};
            },
        },
        fr: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            prizeList: [
                {
                    text: ['一等奖', '护眼仪'],
                },
                {
                    text: ['二等奖', '护眼灯'],
                },
                {
                    text: ['三等奖', '书包'],
                },
                {
                    text: ['四等奖', '奖状'],
                },
            ],
            shareDesc: '',
            changeValue: '',
            activeMenuIndex: 1,
            loadMoreStatus: 'more',
            prompt: false,
            prizePrompt: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
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
        };
    },
    mounted() {
        uni.$once('onReachBottom', () => {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        });
    },
    created() {
        this.getData();
        this.activityStatus();
        this.getCrouselList();
    },
    onShow() {},
    onHide() {
        this.changeValue = '';
    },
    onUnload() {
        clearInterval(this.setId);
    },
    methods: {
        getCrouselList() {
            this.postCrouselList();
            this.setId = setInterval(() => {
                this.postCrouselList();
            }, 1000 * 60 * 5);
        },
        postCrouselList() {
            api.post('/api/activity/resourcelist', {
                activity_id: this.filter.activity_id,
                page_num: 1,
                page_size: 10,
            }).then(({ list }) => {
                this.crouselList = list;
            });
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
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                    uni.hideLoading();
                },
            );
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: this.filter.activity_id,
            }).then((res) => {
                this.status = res.status;
            });
        },
        handleUpload() {
            if (this.isH5) {
                return uni.showToast({
                    title: '请在UP爱挑战小程序上传作品',
                    icon: 'none',
                });
            }
            if (this.status === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    uni.navigateTo({
                        url: `/pages/activity-pages/upload/modify?activity_id=${this.filter.activity_id}`,
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

        // onReachBottom() {

        // },
        bindconfirm() {
            uni.navigateTo({
                url: `/pages/activity-pages/mywork/mywork?type=search&name=${this.changeValue.trim()}&activity_id=${
                    this.filter.activity_id
                }`,
            });
        },
        viewDetail({ id }) {
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
        handleActiverule() {
            this.prompt = true;
        },
        handleActiveprize() {
            this.prizePrompt = true;
        },
        handleMywork() {
            api.isLogin({
                fr: this.fr,
            }).then(() => {
                uni.navigateTo({
                    url: `/pages/activity-pages/mywork/mywork?type=myWork&activity_id=${this.filter.activity_id}`,
                });
            });
        },
        handleClose() {
            this.prompt = false;
            this.prizePrompt = false;
        },

        onPlay() {
            if (!this.isPlayed) {
                api.get('/api/works/playcount', {
                    id: this.id,
                });
            }

            this.isPlayed = true;
        },
        handleVote(item) {
            if (this.status === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    api.post('/api/activity/vote', {
                        id: item.id,
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
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            path: '/pages/read/index',
        };
    },
};
</script>

<style lang="less" scoped>
.read-page-index {
    background-color: #a1debe;
}

.getStyle {
    margin-top: 45upx;
    display: flex;
    justify-content: space-between;
    view {
        text:first-child {
            color: #fff0a8;
            font-size: 28upx;
        }
        text:nth-child(2) {
            color: #fff;
            font-size: 24upx;
        }
    }
    image {
        width: 128upx;
        height: 128upx;
    }
}
.jinguizi {
    display: flex;
    justify-content: space-between;
    & > view {
        width: 305upx;
        padding: 20upx;
        height: 330upx;
        box-sizing: border-box;
        background: #ffeac9;
        border-radius: 12upx;
        image {
            width: 100%;
            height: 150upx;
        }
        & view:nth-child(2) {
            font-size: 28upx;
            color: #ff5630;
        }
        & view:last-child {
            font-size: 22upx;
            color: #c9ac67;
        }
    }
}
.register02 {
    width: 598upx;
    height: 68upx;
}

.renqi-prize {
    text-align: center;
    margin-bottom: 30upx;
    image {
        width: 248upx;
        height: 68upx;
    }
    view {
        font-size: 22upx;
        color: #fff;
    }
}
.register {
    padding: 0 30upx;
    image {
        width: 100%;
        height: 102upx;
    }
}
body.dialog-open {
    position: fixed;
    width: 100%;
}
.abc {
    position: fixed;
    z-index: 999;
    right: 0;
    top: 100upx;
}
._ul {
    ._li {
        position: relative;
        padding-left: 23upx;
        &::before {
            position: absolute;
            width: 10upx;
            height: 10upx;
            background: #fff;
            border-radius: 50%;
            content: "";
            top: 13upx;
            left: 1upx;
        }
    }
}

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
    margin-top: 20upx;
    color: #138256;
    text-align: center;
}
.active-schedule {
    display: flex;
    justify-content: space-between;
    padding: 0 30upx;
    margin-bottom: 15upx;

    & text {
        // border: 1px solid #ffcea2;
        // border-radius: 20upx;
        color: #ffcea2;
        height: 42upx;
        line-height: 42upx;
        font-size: 12px;
        padding: 0 20upx;
    }
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
        }
        .like-icon {
            width: 27upx;
            height: 27upx;
            margin-right: 5upx;
        }
        .vote {
            float: right;
            width: 170upx;
            height: 60upx;
            background: #0f8c64;
            border-radius: 30upx;
            color: rgba(255, 255, 255, 1);
            font-size: 28upx;
            text-align: center;
            line-height: 60upx;
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
    }
    .media-fill {
        height: 253upx;
        text-align: center;
        color: #0f8c64;
        width: 100%;
        line-height: 253upx;
    }
}

.activerulebox {
    // background: url("../../static/images/chunjie/bg.png") no-repeat;
    // background-position: 25upx 57upx;
    background-color: rgba(0, 0, 0, 0.8);
    // background-size: 93% 94%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    color: #fff;
    z-index: 999;
    font-size: 24upx;
    &:first-child {
        font-size: 28upx;
    }
    .title {
        font-size: 28upx;
        color: #ffde6d;
        font-weight: bold;
        margin-bottom: 17upx;
    }

    .text {
        margin-bottom: 40upx;
        font-weight: 300;
        font-size: 28upx;
    }
    .title-icon {
        background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_title.png")
            no-repeat;
        background-size: 100% 100%;
        font-size: 0upx;
        width: 303upx;
        height: 90upx;
        position: absolute;
        top: -43upx;
        left: 190upx;
        text-align: center;
        line-height: 69upx;
        z-index: 222;
    }
    .close {
        background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_close.png")
            no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background-color: #04a875;
        position: absolute;
        top: 62upx;
        left: 35upx;
        height: 92%;
        width: 678upx;
        padding: 76upx 30upx 38upx;
        box-sizing: border-box;
        padding-right: 20upx;
        border-radius: 46rpx;
        .active-rule-box {
            width: 100%;
            overflow-y: scroll;
            max-height: 100%;
            overflow-x: hidden;
        }
        .size {
            font-size: 28upx;
        }
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
        padding-bottom: 120upx;
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
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
                    width: 293upx;
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

    .qr-wrap {
        .qr-code {
            width: 190rpx;
            height: 190rpx;
            display: block;
            margin: 35rpx auto 15rpx;
            border-radius: 15rpx;
        }

        .text {
            font-size: 24rpx;
            text-align: center;
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
