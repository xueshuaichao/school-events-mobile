<template>
    <view
        class="activity-page-index"
        :style="{ 'background-color': config.mainBgColor }"
    >
        <official-account />
        <view :class="['page-index', { 'stop-scroll': prompt }]">
            <!-- 活动规则 -->
            <rule
                v-if="prompt"
                :rules="config.rules"
                bg-color="#f00"
                name="labor"
                @handle-close="handleClose"
            />

            <view class="main-swiper">
                <view
                    class="banner"
                    :style="{
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${config.activityName}_main.jpg)`
                    }"
                >
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
                </view>
                <view class="main-content">
                    <!-- 奖品 -->
                    <view class="prize">
                        <view
                            v-for="(item, index) in prizeList"
                            :key="index"
                            class="prize-item"
                        >
                            <text class="prize-text-1">
                                {{ item.text[0] }}
                            </text>
                            <image
                                class="prize-img"
                                :src="
                                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize${index +
                                        1}.png`
                                "
                            />
                            <text class="prize-text-2">
                                {{ item.text[1] }}
                            </text>
                        </view>
                        <view class="prize-item">
                            <image
                                class="prize-img-text"
                                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize5.png"
                                @click="handleActiverule"
                            />
                        </view>
                    </view>
                    <!-- 跑马灯 -->
                    <tipsList
                        :crousel-list="crouselList"
                        text-color="#ffde6d"
                    />

                    <view class="cansai-text">
                        —— 活动作品 ——
                    </view>
                    <!-- work show -->
                    <view class="menu-list">
                        <view class="search-box">
                            <button
                                :style="{
                                    'background-color':
                                        activeMenuIndex === '1' ? bgColor : '',
                                    color: activeMenuIndex === '1' ? '#fff' : ''
                                }"
                                @click="toggle('1')"
                            >
                                中文组
                            </button>
                            <button
                                :style="{
                                    'background-color':
                                        activeMenuIndex === '2' ? bgColor : '',
                                    color:
                                        activeMenuIndex === '2'
                                            ? '#fff'
                                            : '#000'
                                }"
                                @click="toggle('2')"
                            >
                                英文组
                            </button>
                            <view class="search">
                                <image
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_search.png"
                                />
                                <input
                                    v-model="changeValue"
                                    placeholder-style="color:#E5FFF7"
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
                                    :bg-color="'11CD95'"
                                    @click.native="viewDetail(item)"
                                />

                                <view class="media-name text-one-line">
                                    {{ `${item.resource_name}` }}
                                </view>
                                <text class="vote-num">
                                    {{ item.ticket }}赞
                                </text>
                                <view
                                    class="vote"
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
                                color="#fff"
                            />
                        </view>
                    </view>
                </view>
                <view
                    :class="status === 2 || isH5 ? 'upload' : 'upload-disable'"
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
import tipsList from './tips-list.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import share from '../../../common/share';
import logger from '../../../common/logger';
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
        tipsList,
        EventCraftCover,
    },
    props: {
        bgColor: {
            type: String,
            default: '#f5f5f5',
        },
        mainColor: {
            type: String,
            default: '#f5f5f5',
        },
        shareConfig: {
            type: Object,
            default() {
                return {};
            },
        },
        log: {
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
            fr: '',
            shareDesc: '',
            changeValue: '',
            activeMenuIndex: '1',
            loadMoreStatus: 'more',
            prompt: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
            dataList: [],
            filter: {
                cat_id: this.$store.state.activity.config.catId,
                activity_id: this.$store.state.activity.config.activityId,
                page_num: 1,
                page_size: 10,
                activity_cat: 1,
            },
            status: 2,
            crouselList: [],
            setId: '',
        };
    },
    computed: {
        config() {
            return this.$store.state.activity.config;
        },
    },
    created() {
        this.getData();
        this.activityStatus();
        this.getCrouselList();
    },
    onLoad(params) {
        this.fr = logger.getFr(this.log, params);
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
                activity_id: this.config.activityId,
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

                    this.initShare();
                    uni.hideLoading();
                },
            );
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: this.config.activityId,
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
                        url: '/pages/read/upload/modify',
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

        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/pages/read/myWork/myWork?type=search&name=${this.changeValue.trim()}`,
            });
        },
        initShare() {
            share(this.shareConfig);
        },
        viewDetail({ id }) {
            uni.navigateTo({
                url: `/pages/work/detail/detail?id=${id}&activity_id=${this.config.activityId}`,
            });
        },
        toggle(k) {
            uni.showLoading();
            this.activeMenuIndex = k;
            this.filter.activity_cat = k;
            this.filter.page_num = 1;
            this.getData();
        },
        handleActiverule() {
            this.prompt = true;
        },
        handleMywork() {
            api.isLogin({
                fr: this.fr,
            }).then(() => {
                uni.navigateTo({
                    url: '/pages/read/myWork/myWork?type=myWork',
                });
            });
        },
        handleClose() {
            this.prompt = false;
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
.prize {
    height: 242upx;
    width: 725upz;
    margin: 0 12upx;
    background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize.png")
        no-repeat center;
    background-size: 100% 100%;
    padding: 0 47upx;
    display: flex;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .prize-item {
        font-size: 20upx;
        text-align: center;
        width: 141upx;
        height: 176upx;
        &:last-of-type {
            height: 238upx;
            width: 169upx;
        }
        .prize-text-1 {
            color: #ff3442;
            width: 100%;
            font-size: 24upx;
        }
        .prize-text-2 {
            color: #08986d;
            width: 100%;
        }
        .prize-img {
            width: 116upx;
            height: 116upx;
        }
        .prize-img-text {
            width: 100%;
            height: 100%;
            margin-top: 16upx;
            display: block;
        }
    }
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
            height: 889upx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .active-rule,
            .menu-title {
                position: absolute;
                top: 19upx;
                width: 120upx;
                height: 48upx;
                line-height: 48upx;
                font-size: 22upx;
                background: #fff;
                color: #128544;
                border-radius: 24upx;
            }
            .active-rule {
                left: 15upx;
            }
            .menu-title {
                right: 15upx;
            }
        }
        .main-content {
            margin-top: -85upx;
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
                background: #05af7c;
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
                    color: #e5fff7;
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
