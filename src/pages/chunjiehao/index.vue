<template>
    <view :class="['page-index', { 'stop-scroll': prompt }]">
        <!-- 活动规则 -->
        <view
            v-show="prompt"
            class="activerulebox"
        >
            <view class="active-content">
                <view
                    class="close"
                    @click="handleClose"
                />
                <view class="title-icon">
                    活动规则
                </view>
                <view class="active-rule-box">
                    <view>
                        <view class="title">
                            活动时间
                        </view>
                        <view class="text">
                            2020年1月20日——2月15日（2月18日公布结果）
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            活动对象
                        </view>
                        <view class="text">
                            全员可参与
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            参赛作品
                        </view>
                        <view class="text">
                            围绕春节主题，创作以春节、年为元素的视频或图片作品，记录你的美好春节。
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            作品要求
                        </view>
                        <view class="text">
                            <ul>
                                <li>
                                    视频格式：支持MP4、MOV、3GP、MP4V、M4V、MKV、AVI、FLV等，视频时长不超过5分钟；视频清晰、画面精美。
                                </li>
                                <li>
                                    图片格式：单张图片小于10MB，图片清晰、完整。
                                </li>
                                <li>
                                    内容：如果发现有用户上传不合规内容、黄赌毒、封建迷信等违背社会主义核心价值观的内容、非原创、
                                    盗窃他人或平台的内容、或恶意刷投票量等扰乱秩序者，该账户将取消活动参与资格，不合规视频将被删除。
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
                                    参赛者需注册并通过活动界面上传作品，审核通过后可邀请亲友投票。
                                </li>
                                <li>
                                    未传视频的注册用户只能为参赛选手投票，无法参与排行榜活动。
                                </li>
                                <li>
                                    每个账户每天只能为同一作品投票1次。
                                </li>
                                <li>
                                    排行榜将根据视频投票数进行排名，排行榜将以2020年2月15日23:59:59时的排名为最终结果，上榜者可获得相应礼品。
                                </li>
                                <li>
                                    获奖名单将于2月18日在爱挑战官网(http://atz.qsnatz.com/)
                                    及官方服务号（UP青少年爱挑战）进行公布。
                                </li>
                            </ul>
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            奖品兑换说明
                        </view>
                        <view class="text">
                            <view>
                                1、每名参赛选手只有1次可兑奖机会，如同时获得了不同奖项，以最高奖项为准。
                            </view>
                            <view>
                                2、工作人员将于2月19日期间电话联系获奖账号所绑定的手机号，电话无法联系的将视为自动放弃兑奖资格。
                            </view>
                            <view>
                                3、礼品将于2月20-21日期间通过普通快递寄出。
                            </view>
                            <view>
                                4、奖品属于用户奖励活动，不提供发票、收据。
                            </view>
                            <view>
                                5、奖品不支持退换和售后，请当面核实无质量问题再签收。
                            </view>
                            <view>
                                6、因用户提供的收货地址等信息有误而导致奖品未收到的，不予补发。
                            </view>
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            活动奖品
                        </view>
                        <view class="text">
                            <view>
                                截止到2020年2月15日23:59:59整，按投票名次可获得如下奖品：
                            </view>
                        </view>
                    </view>
                    <view class="prize-prompt">
                        <view class="prize-item-prompt">
                            <view>
                                <text>一等奖</text>
                                <image
                                    src="../../static/images/chunjie/chunjiehao-prize01.png"
                                />
                                <text>空气炸锅*1</text>
                            </view>
                            <view>
                                <text>二等奖</text>
                                <image
                                    src="../../static/images/chunjie/chunjiehao-prize02.png"
                                />
                                <text>美的养生壶*2</text>
                            </view>
                            <view>
                                <text>三等奖</text>
                                <image
                                    src="../../static/images/chunjie/chunjiehao-prize03.png"
                                />
                                <text>欧普护眼台灯*3</text>
                            </view>
                            <view>
                                <text>四等奖</text>
                                <image
                                    src="../../static/images/chunjie/chunjiehao-prize04.png"
                                />
                                <text>小熊加湿器*4</text>
                            </view>
                        </view>
                        <view class="prize-slogan-prompt">
                            礼品图片仅供参考，请以实物为准
                        </view>
                    </view>
                    <view class="qr-wrap">
                        <image
                            class="qr-code"
                            src="/static/images/chunjie/qrcode.jpg"
                        />
                        <view class="text">
                            关注“UP青少年爱挑战”公众号，了解更多活动信息
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
            <view class="register">
                <image src="../../static/images/chunjie/chunjiehao-title.png" />
            </view>
            <view class="active-schedule">
                <text>活动时间：1月10日-2月15日</text>
                <text>结果公布：2月18日</text>
            </view>

            <view class="prize">
                <view class="prize-item">
                    <view>
                        <text>一等奖</text>
                        <image
                            src="../../static/images/chunjie/chunjiehao-prize01.png"
                        />
                        <text>空气炸锅*1</text>
                    </view>
                    <view>
                        <text>二等奖</text>
                        <image
                            src="../../static/images/chunjie/chunjiehao-prize02.png"
                        />
                        <text>美的养生壶*2</text>
                    </view>
                    <view>
                        <text>三等奖</text>
                        <image
                            src="../../static/images/chunjie/chunjiehao-prize03.png"
                        />
                        <text>欧普护眼台灯*3</text>
                    </view>
                    <view>
                        <text>四等奖</text>
                        <image
                            src="../../static/images/chunjie/chunjiehao-prize04.png"
                        />
                        <text>小熊加湿器*4</text>
                    </view>
                </view>
                <view class="prize-slogan01">
                    截止到2020年2月15日23:59:59整，按投票名次可获得以上奖品
                </view>
            </view>
            <image
                class="cansai-text"
                src="../../static/images/chunjie/cansai_text.png"
            />

            <!-- work show -->
            <view class="menu-list">
                <view class="search-box">
                    <button
                        :class="{
                            active: activeMenuIndex === 'new'
                        }"
                        @click="toggle('new')"
                    >
                        最新
                    </button>
                    <button
                        :class="{
                            active: activeMenuIndex === 'hot'
                        }"
                        @click="toggle('hot')"
                    >
                        最热
                    </button>
                    <view class="search">
                        <image
                            src="../../static/images/chunjie/search-icon01.png"
                        />
                        <input
                            v-model="changeValue"
                            placeholder-style="color:#FF2E3F"
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
                        <navigator
                            :url="
                                `/pages/chunjiehao/detail/detail?id=${item.id}&fr=${fr}`
                            "
                        >
                            <image
                                v-if="item.resource_type === 1"
                                :src="item.video_img_url | optimizeImage"
                                class="video"
                            />
                            <image
                                v-else-if="item.resource_type === 2"
                                :src="item.img_url | optimizeImage"
                                class="video"
                            />
                            <view class="media-icon">
                                <image :src="mediaIcon[item.resource_type]" />
                            </view>
                        </navigator>

                        <view class="media-name text-one-line">
                            {{ `#${item.cat_name}# ${item.resource_name}` }}
                        </view>
                        <text class="vote-num">
                            {{ item.ticket }}票
                        </text>
                        <view
                            class="vote"
                            @click="handleVote(item)"
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

            <view
                :class="status === 2 ? 'upload' : 'upload-disable'"
                @click="handleUpload"
            >
                上传作品
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import share from '../../common/share';
import logger from '../../common/logger';

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
    },
    components: {
        uniLoadMore,
    },
    data() {
        return {
            fr: '',
            changeValue: '',
            activeMenuIndex: 'new',
            loadMoreStatus: 'more',
            mediaIcon: {
                1: '../../static/images/chunjie/video-icon.png',
                2: '../../static/images/chunjie/img-icon.png',
            },
            prompt: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
            dataList: [],
            filter: {
                activity_id: 4,
                page_num: 1,
                page_size: 10,
                sort: 'new',
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
            ],
            status: 2,
        };
    },
    created() {
        this.getData();
        this.chunjieStatus();
    },
    onLoad(params) {
        this.fr = logger.getFr('xchd', params);
    },
    onHide() {
        this.changeValue = '';
    },
    methods: {
        chunjieStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 4,
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
                        url: '/pages/chunjiehao/upload/upload',
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
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
        bindconfirm() {
            if (!this.changeValue.trim()) {
                uni.showToast({
                    title: '请输入搜索内容',
                    icon: 'none',
                });
                return;
            }
            uni.navigateTo({
                url: `/pages/chunjiehao/myWork/myWork?type=search&name=${this.changeValue.trim()}`,
            });
        },
        initShare() {
            // const titleList = [
            //     '鼠年大吉，快来看我的拜年才艺秀！',
            //     '才艺拜年乐趣多，我来表演你来赞！',
            //     '我来给你拜新年，表演才艺送祝福！',
            //     '鼠年春节我精彩，才艺拜年望喜爱！',
            // ];
            const titleList = ['我来给你拜新年，表演才艺送祝福'];
            const title = titleList[Math.floor(Math.random() * titleList.length)];
            const desc = '快乐过寒假，才艺拜大年！';

            share({
                title,
                desc,
                thumbnail:
                    'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao-banner.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            });
        },
        toggle(k) {
            uni.showLoading();
            this.activeMenuIndex = k;
            this.filter.sort = k;
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
                    url: '/pages/chunjiehao/myWork/myWork?type=myWork',
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
                            uni.showToast({
                                title: '投票成功',
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

<style lang="less" scoped>
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
    background: linear-gradient(
        0deg,
        rgba(255, 149, 71, 1),
        rgba(255, 222, 152, 1)
    );
    text-align: center;
    width: 100%;
    color: #ff2e3f;
    height: 116upx;
    font-size: 36upx;
    line-height: 116upx;
    text-align: center;
    z-index: 10;
}
.upload-disable {
    position: fixed;
    bottom: 40upx;
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
}
.cansai-text {
    width: 312upx;
    height: 44upx;
    margin-left: 220upx;
    margin-top: 20upx;
}
.prize-prompt {
    text-align: center;
    .prize-item-prompt {
        display: flex;
        justify-content: space-between;
        view {
            font-size: 22upx;
            text-align: center;
            color: #ffde98;
            width: 154upx;
            & text:first-child {
                width: 100%;
                float: left;
                margin-top: 20upx;
                font-size: 24upx;
            }
            & text:last-child {
                width: 100%;
                float: left;
            }
            & image {
                width: 116upx;
                height: 116upx;
            }
        }
    }
    .prize-slogan-prompt {
        color: #b11a27;
        font-size: 20upx;
        display: inline-block;
    }
}

.prize {
    background: #ffde98;
    // background-size: 100% 100%;
    height: 242upx;
    border: 10upx solid #b11a27;
    margin: 0 30upx;
    border-radius: 16upx;
    padding-bottom: 20rpx;
    text-align: center;
    .prize-item {
        display: flex;
        justify-content: space-between;
        view {
            font-size: 20upx;
            text-align: center;
            // float: left;
            width: 154upx;
            & text:first-child {
                color: #ff3442;
                width: 100%;
                float: left;
                margin-top: 20upx;
                font-size: 24upx;
            }
            & text:last-child {
                color: #ab7e3c;
                width: 100%;
                float: left;
            }
            & image {
                width: 116upx;
                height: 116upx;
            }
        }
    }
    .prize-slogan {
        width: 576upx;
        height: 32upx;
        background: #b69755;
        color: #932210;
        border-radius: 16upx;
        padding: 0 26upx;
        line-height: 32upx;
        text-align: center;
        margin-top: 15rpx;
        display: inline-block;
        font-size: 20upx;
    }
    .prize-slogan01 {
        width: 576upx;
        height: 32upx;
        background: #b69755;
        color: #ffde98;
        border-radius: 16upx;
        padding: 0 26upx;
        line-height: 32upx;
        text-align: center;
        margin-top: 15rpx;
        display: inline-block;
        font-size: 20upx;
    }
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
.banner {
    height: 740upx;
    background: url(http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao-banner.png?t=2)
        no-repeat;
    background-size: 100% 100%;
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
            background: #ffde98;
            height: 52upx;
            width: 140upx;
            color: #ff2e3f;
            font-size: 24upx;
            // position: absolute;
            // right:0;
            text-align: center;
            line-height: 52upx;
            font-weight: 700;
            float: right;
            border-radius: 26rpx;
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
        color: #fff0a8;
        font-weight: bold;
        margin-bottom: 17upx;
    }

    .text {
        margin-bottom: 40upx;
    }
    .title-icon {
        background: url("../../static/images/chunjie/chunjiehao-rule.png")
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
        background: url("../../static/images/chunjie/prompt-close.png")
            no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background: #ff2e3f;
        position: absolute;
        top: 62upx;
        left: 29upx;
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
    background: #ff2e3f;
    .main-swiper {
        .active-rule {
            position: absolute;
            top: 22upx;
            left: 6upx;
            width: 142upx;
            height: 74upx;
            font-size: 0;
        }
        .menu-title {
            position: absolute;
            top: 22upx;
            right: 6upx;
            width: 142upx;
            height: 74upx;
            font-size: 0;
        }
    }

    .menu-list {
        padding: 30upx;
        padding-bottom: 120upx;
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
            button {
                width: 120upx;
                height: 68upx;
                float: left;
                line-height: 68upx;
                color: #ffffff;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;
                border-radius: 34upx;
                &.active {
                    background: #ffde98;
                    color: #ff3849;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                background: #b11a27;
                width: 440upx;
                height: 72upx;
                position: relative;
                float: right;
                border-radius: 60upx;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 23upx;
                    left: 24upx;
                }
                input {
                    width: 325upx;
                    position: absolute;
                    top: 20upx;
                    // #ifndef H5
                    top: 15upx;
                    // #endif
                    left: 60upx;
                    font-size: 24upx;
                    color: #ffbec4;
                }
                .search-button {
                    font-size: 24upx;
                    color: #ffde98;
                    position: absolute;
                    top: 20upx;
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
