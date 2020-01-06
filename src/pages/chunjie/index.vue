<template>
    <view class="page-index">
        <!-- swiper -->
        <!-- 一个简单的name跳转 -->
        <view
            v-if="prompt"
            class="activerulebox"
        >
            <view
                class="close"
                @click="handleClose"
            />
            <view class="title-icon">
                活动规则
            </view>
            <view class="active-content">
                <view>
                    <view class="title">
                        活动时间
                    </view>
                    <view class="text">
                        2020年1月10日至2020年2月6日
                    </view>
                </view>
                <view>
                    <view class="title">
                        活动对象
                    </view>
                    <view class="text">
                        本次活动仅限3-18岁的青少年参与。
                    </view>
                </view>
                <view>
                    <view class="title">
                        参赛节目
                    </view>
                    <view class="text">
                        节目类别分为歌唱表演、舞蹈表演、创意制作、口才表演、乐器演奏、书法绘画、杂技、魔术、摄影
                    </view>
                </view>
                <view>
                    <view class="title">
                        作品要求
                    </view>
                    <view class="text">
                        <ul>
                            <li>
                                视频格式：支持MP4、MOV、3GP、MP4V、M4V、MKV、AVI、FLV等，视频时长不超过3分钟；单张图片小于10MB。
                            </li>
                            <li>
                                内容：如果发现有用户上传不合规内容，如涉及攻击我国政治制度、法律制度、黄赌毒、封建迷信等违背社会主义核心价值观的内容、
                                非原创、盗窃他人或平台的内容、或恶意刷点赞量等扰乱秩序者，该账户将取消活动参与资格，不合规视频将被删除。
                            </li>
                        </ul>
                    </view>
                </view>
                <view>
                    <view class="title">
                        参赛规则
                    </view>
                    <view class="text">
                        <ul>
                            <li>
                                参赛者在爱挑战注册并通过小程序活动界面上传作品，审核通过后可邀请亲友点赞
                            </li>
                            <li>
                                未传视频的注册用户只能为参赛选手投票，无法参与排行榜活动。
                            </li>
                            <li>
                                每个账户每天只能为同一作品投票1次。
                            </li>
                            <li>
                                排行榜，将根据视频点赞量进行排名，排行榜将以2020年2月6日11：59分时的排名为最终结果，上榜者可获得相应礼品
                            </li>
                            <li>
                                获奖名单将于2月8日（元宵节）在爱挑战官网(http://atz.qsnatz.com)
                                及官方服务号（UP青少年爱挑战）进行公布
                            </li>
                        </ul>
                    </view>
                </view>
            </view>
        </view>
        <!-- 奖项设置 -->
        <view
            v-if="prompt01"
            class="activerulebox"
        >
            <view
                class="close"
                @click="handleClose"
            />
            <view class="title-icon">
                奖项设置
            </view>
            <view class="active-content">
                <view class="prize-box">
                    <view
                        v-for="item in prizeList"
                        :key="item.name"
                        class="prize-item"
                    >
                        <view>{{ item.prize_score }}</view>
                        <view>
                            <image :src="item.prize" />
                        </view>
                        <view>{{ item.name }}</view>
                    </view>
                </view>
                <view>
                    <view class="title">
                        奖品兑换说明
                    </view>
                    <view class="text">
                        <view>
                            1、每名参赛选手只有1次可兑换机会，如有同时获得了不同奖项以最高奖项为准。
                        </view>
                        <view>
                            2、工作人员将于2月10日至2月12日期间电话联系获奖账号所绑定的手机号，电话无法联系的将视为自动放弃兑奖资格。
                        </view>
                        <view>
                            3、礼品将于2月13-14日期间通过普通快递寄出。
                        </view>
                        <view>
                            4、礼品属于用户奖励活动，不提供发票、收据。
                        </view>
                        <view>
                            5、礼品不支持退换和售后，请当面核实无质量问题再签收。
                        </view>
                        <view>
                            6、若因用户提供的收货地址等信息有误而未收到礼品，概不补发。
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="main-swiper">
            <view class="banner">
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
            <view class="active-schedule">
                <text>活动时间：1月10日-2月6日</text>
                <text>结果公布：2月8日</text>
            </view>
            <view class="prize">
                <view>
                    <text>一等奖</text>
                    <image src="../../static/images/chunjie/prize.png" />
                    <text>学习机*1个</text>
                </view>
                <view>
                    <text>一等奖</text>
                    <image src="../../static/images/chunjie/prize.png" />
                    <text>学习机*1个</text>
                </view>
                <view>
                    <text>一等奖</text>
                    <image src="../../static/images/chunjie/prize.png" />
                    <text>学习机*1个</text>
                </view>
                <view
                    class="prize-more"
                    @click="handleMorePrize"
                />
            </view>
            <image
                class="cansai-text"
                src="../../static/images/chunjie/cansai_text.png"
            />
            <!-- work show -->
            <view class="menu-list">
                <!-- <ul>
                            <li>
                                视频格式：支持MP4、MOV、3GP、MP4V、M4V、MKV、AVI、FLV等，视频时长不超过3分钟；单张图片小于10MB。
                            </li>
                            <li>
                            内容：如果发现有用户上传不合规内容，如涉及攻击我国政治制度、法律制度、黄赌毒、封建迷信等违背社会主义核心价值观的内容、
                        非原创、盗窃他人或平台的内容、或恶意刷点赞量等扰乱秩序者，该账户将取消活动参与资格，不合规视频将被删除。
                            </li>
                        </ul> -->
                <view class="search-box">
                    <button
                        :class="{
                            active: activeMenuIndex === 1
                        }"
                        @click="toggle('hot')"
                    >
                        最热
                    </button>
                    <button
                        :class="{
                            active: activeMenuIndex === 2
                        }"
                        @click="toggle('new')"
                    >
                        最新
                    </button>
                    <view class="search">
                        <image
                            src="../../static/images/chunjie/search-icon.png"
                        />

                        <input
                            placeholder="请输入作者姓名或作品名称"
                            bindconfirm="bindconfirm"
                        >
                    </view>
                </view>
                <view class="media-box">
                    <view
                        v-for="item in dataList"
                        :key="item.id"
                        class="media-content"
                    >
                        <!-- <video
                            v-if="item.resource_type === 1"
                            class="video"
                            :poster="item.video_img_url"
                            controls
                            @play="onPlay"
                        /> -->
                        <image
                            v-if="item.resource_type === 1"
                            src="https://via.placeholder.com/150/771796"
                            class="video"
                        />
                        <image
                            v-else-if="item.resource_type === 2"
                            src="https://via.placeholder.com/150/771796"
                            class="video"
                        />
                        <image
                            class="media-icon"
                            :src="mediaIcon[item.resource_type]"
                        />
                        <view class="media-name">
                            dfgdgdgdfgfg
                        </view>
                        <text class="vote-num">
                            1200票
                        </text>
                        <view
                            class="vote"
                            @click="handleVote(item.id)"
                        >
                            帮TA投票
                        </view>
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
            <view class="upload">
                上传作品
            </view>
            <view class="footer">
                本次活动最终解释权在法律范围内属活动举办方所有
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            activeMenuIndex: 1,
            loadMoreStatus: 'more',
            mediaIcon: {
                1: '../../static/images/chunjie/video-icon.png',
                2: '../../static/images/chunjie/img-icon.png',
            },
            prompt: false,
            prompt01: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
            dataList: [],
            filter: {
                activity_id: 3,
                page_num: 1,
                page_size: 10,
            },
            prizeList: [
                {
                    prize_score: '一等奖',
                    name: '学习机*1个',
                    prize: '../../static/images/chunjie/prize01.png',
                },
                {
                    prize_score: '二等奖',
                    name: '小度*4个',
                    prize: '../../static/images/chunjie/prize02.png',
                },
                {
                    prize_score: '三等奖',
                    name: '无人机*6个',
                    prize: '../../static/images/chunjie/prize03.png',
                },
                {
                    prize_score: '四等奖',
                    name: '护眼灯*8个',
                    prize: '../../static/images/chunjie/prize04.png',
                },
                {
                    prize_score: '五等奖',
                    name: '液晶手写板*20个',
                    prize: '../../static/images/chunjie/prize05.png',
                },
                {
                    prize_score: '六等奖',
                    name: '蓝牙音箱*20个',
                    prize: '../../static/images/chunjie/prize06.png',
                },
            ],
        };
    },
    onLoad() {},
    created() {
        this.getData();
    },
    methods: {
        handleMorePrize() {
            this.prompt01 = true;
        },
        getData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    this.isLoading = false;
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
                        this.loadMoreStatus = 'noMore';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
        bindconfirm(e) {
            if (!e.target.value) {
                return;
            }
            this.filter.search = e.target.value.trim();
            this.filter.page_num = 1;
            this.getData();
        },
        toggle(k) {
            this.activeMenuIndex = k;
            this.filter.sort = k;
            this.filter.page_num = 1;
            this.getData();
        },
        handleActiverule() {
            this.prompt = true;
        },
        handleMywork() {
            uni.navigateTo({
                url: '/pages/upload/work/work',
            });
        },
        handleClose() {
            this.prompt = false;
            this.prompt01 = false;
        },

        onPlay() {
            if (!this.isPlayed) {
                api.get('/api/works/playcount', {
                    id: this.id,
                });
            }

            this.isPlayed = true;
        },
        handleVote(id) {
            api.post('/api/activity/vote', {
                id,
            }).then((res) => {
                console.log(res);
            });
        },
    },
};
</script>

<style lang="less">
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
.prize-box {
    // overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    .prize-item {
        float: left;
        width: 194upx;
        text-align: center;
        margin-bottom: 40upx;

        view:first-child {
            color: #fff4b8;
            font-size: 34upx;
            margin-bottom: 10upx;
        }
        view:nth-child(2) {
            background: url("../../static/images/chunjie/prize-bg.png") 100%
                100%;
            width: 193upx;
            height: 221upx;
        }
        image {
            width: 131upx;
            height: 120upx;
            margin-top: 50upx;
        }
        view:last-child {
            color: #fff;
            font-size: 24upx;
            margin-top: 10upx;
        }
    }
}
.loadMore {
    width: 100%;
}
.footer {
    text-align: center;
    font-size: 22upx;
    color: #fff;
}
.upload {
    background: url("../../static/images/chunjie/upload_bg.png") no-repeat 100%;
    background-size: 100% 100%;
    text-align: center;
    width: 100%;
    line-height: 175upx;
    height: 175upx;
    font-size: 0;
}
.cansai-text {
    width: 312upx;
    height: 44upx;
    margin-left: 220upx;
    margin-top: 20upx;
}
.prize {
    background: url("../../static/images/chunjie/prize_bg.png") no-repeat 100%
        100%;
    height: 242upx;
    // display:flex;
    // justify-content: space-between;
    & view:first-child {
        margin-left: 63upx;
    }
    view {
        font-size: 24upx;
        text-align: center;
        float: left;
        width: 154upx;

        & text:first-child {
            color: #ff3442;
            width: 100%;
            float: left;
            margin-top: 20upx;
        }
        & text:last-child {
            color: #ab7e3c;
            width: 100%;
            float: left;
        }
        image {
            width: 116upx;
            height: 116upx;
        }
    }
    .prize-more {
        width: 189upx;
        height: 224upx;
        background: url("../../static/images/chunjie/more-prize-bg.png");
        background-position: center 5upx;
        font-size: 34upx;
        color: #ffe57b;
    }
}
.active-schedule {
    display: flex;
    justify-content: space-between;
    padding: 0 30upx;
    margin-bottom: 15upx;

    & text {
        border: 1px solid #ffcea2;
        border-radius: 20upx;
        color: #ffcea2;
        height: 42upx;
        line-height: 42upx;
        font-size: 12px;
        padding: 0 20upx;
    }
}
.banner {
    height: 740upx;
    background: url(http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner.png)
        no-repeat;
    background-size: contain;
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

        .video {
            width: 335upx;
            height: 225upx;
        }
        .media-name {
            color: #fff;
            width: 100%;
            // left:0;
            // top:290upx;
            font-size: 24upx;
            margin-bottom: 10upx;
        }
        .vote-num {
            color: #ffdf9f;
            font-size: 30upx;
            // left:0;
            // position: absolute;
            // top: 283upx;
            float: left;
        }
        .vote {
            background: url("../../static/images/chunjie/vote_bg.png") 100% 100%;
            height: 78upx;
            width: 171upx;
            color: #ff481e;
            font-size: 24upx;
            // position: absolute;
            // right:0;
            text-align: center;
            line-height: 58upx;
            font-weight: 700;
            float: right;
        }
        .media-icon {
            width: 40upx;
            height: 40upx;
            position: absolute;
            top: 175upx;
            right: 10upx;
        }
    }
}

.activerulebox {
    background: url("../../static/images/chunjie/bg.png") no-repeat;
    background-position: 25upx 57upx;
    background-color: rgba(0, 0, 0, 0.8);
    background-size: 93% 94%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    color: #fff;
    z-index: 999;
    &:first-child {
        font-size: 28upx;
    }
    .title {
        font-size: 32upx;
        color: #fff0a8;
        font-weight: bold;
        margin-bottom: 24upx;
    }

    .text {
        margin-bottom: 40upx;
        font-size: 24upx;
    }
    .title-icon {
        background: url("../../static/images/chunjie/title.png") 100% 100%;
        width: 387upx;
        height: 99upx;
        position: absolute;
        top: 23upx;
        left: 167upx;
        text-align: center;
        line-height: 69upx;
    }
    .close {
        background: url("../../static/images/chunjie/close.png") 100% 100%;
        width: 62upx;
        height: 62upx;
        top: 30upx;
        right: 13upx;
        position: absolute;
    }
    .active-content {
        .size {
            font-size: 28upx;
        }
        overflow-y: scroll;
        position: absolute;
        top: 116upx;
        left: 29upx;
        height: 1033upx;
        width: 678upx;
        padding: 0 30upx;
        box-sizing: border-box;
        padding-right: 20upx;
    }
}
::-webkit-scrollbar {
    width: 4upx;
    background-color: transparent;
}
::-webkit-scrollbar-thumb {
    background-color: #ffe4a2;
}
.page-index {
    padding-bottom: 20upx;
    display: relative;
    background: url("../../static/images/chunjie/main_bg.png") repeat-y;
    // background:pink;
    background-size: contain;
    .chunjie-entry {
        width: 100upx;
        height: 100upx;
        background: red;
        position: fixed;
        top: 200upx;
        right: 0upx;
        z-index: 999;
    }
    .main-swiper {
        .active-rule {
            position: absolute;
            top: 16upx;
            left: 10upx;
            width: 128upx;
            height: 40upx;
            font-size: 0;
        }
        .menu-title {
            position: absolute;
            top: 16upx;
            right: 10upx;
            width: 128upx;
            height: 40upx;
            font-size: 0;
        }
    }

    .menu-list {
        padding: 30upx;
        padding-bottom: 0;
        .search-box {
            overflow: hidden;

            button {
                width: 140upx;
                height: 94upx;
                float: left;
                line-height: 72upx;
                color: #ffffff;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;

                &.active {
                    background: url("../../static/images/chunjie/neworhot.png")
                        no-repeat;
                    background-size: 100% 100%;
                    color: #ff3849;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                background: url("../../static/images/chunjie/search_bg.png")
                    no-repeat 100% 100%;
                width: 400upx;
                height: 73upx;
                position: relative;
                float: right;
                background-size: 100% 100%;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 18upx;
                    left: 24upx;
                }
                input {
                    // margin-left:11upx;
                    width: 325upx;
                    position: absolute;
                    top: 10upx;
                    left: 60upx;
                    font-size: 24upx;
                    color: #c9ac67;
                }
                input::-webkit-input-placeholder {
                    color: #c9ac67;
                    font-size: 24upx;
                }
            }
        }
    }
}
</style>
