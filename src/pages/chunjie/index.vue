<template>
    <view>
        <official-account />
        <view :class="['page-index', { 'stop-scroll': prompt || prompt01 }]">
            <!-- 活动规则 -->
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
                            2020年1月10日至2020年2月8日
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            活动对象
                        </view>
                        <view class="text">
                            本次活动仅限3-18岁的青少年参与
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            参赛作品
                        </view>
                        <view class="text">
                            作品类别分为歌唱表演、舞蹈表演、创意制作、口才表演、乐器演奏、书法绘画、杂技、魔术、摄影
                        </view>
                    </view>
                    <view>
                        <view class="title">
                            作品要求
                        </view>
                        <view class="text">
                            <ul>
                                <li>
                                    视频格式：支持MP4、MOV、3GP、MP4V、M4V、MKV、AVI、FLV等，视频时长不超过5分钟；单张图片小于10MB。
                                </li>
                                <li>
                                    内容：如果发现有用户上传不合规内容，如涉及攻击我国政治制度、法律制度、黄赌毒、封建迷信等违背社会主义核心价值观的内容、
                                    非原创、盗窃他人或平台的内容、或恶意刷票等扰乱秩序者，该账号将取消活动参与资格，不合规视频/图片将被删除。
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
                                    参赛者在“青少年爱挑战”平台注册并通过活动页面上传作品，审核通过后可邀请亲友投票。
                                </li>
                                <li>
                                    每个账户每天只能为同一作品投票1次。
                                </li>
                                <li>
                                    根据参赛作品获得的投票数进行排名，排行榜将以2020年2月8日23:59时的排名为最终结果，上榜者（排名前39名）可获得相应奖品。
                                </li>
                                <li>
                                    活动组委会根据才艺秀作品质量和内容，综合评选出20名优秀参赛者，送出奖品。
                                </li>
                                <li>
                                    获奖名单将于2020年2月11日在爱挑战官网（http://atz.qsnatz.com/）及官方微信公众号（UP青少年爱挑战）进行公布。
                                </li>
                                <li>
                                    本活动最终解释权在法律允许范围内归活动举办方所有。
                                </li>
                            </ul>
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
                    <view class="renqi-prize">
                        <view class="renqi-title">
                            人气奖
                        </view>
                        <view>
                            截止到2020年2月8日23:59，按投票名次可获得如下奖品
                        </view>
                    </view>
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
                    <view class="caiyi-box">
                        <view class="caiyi-title">
                            才艺达人奖
                        </view>
                        <view class="caiyi-text">
                            <view>
                                由活动组委会根据才艺秀作品质量和内容，综合评选出20名优秀参赛者，奖励蓝牙音箱1个
                            </view>
                            <image
                                src="../../static/images/chunjie/prize06.png"
                            />
                        </view>
                        <view class="prize-prompt">
                            图片仅供参考，奖品以实物为准
                        </view>
                    </view>

                    <image
                        class="register02"
                        src="../../static/images/chunjie/register02.png"
                    />
                    <view class="jinguizi">
                        <view>
                            <image
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/jinguizi01.png"
                            />
                            <view>金龟子陪你过大年</view>
                            <view>
                                小朋友的拜年神器，让孩子成为最受欢迎的拜年小达人
                            </view>
                        </view>
                        <view>
                            <image
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/jinguizi02.png"
                            />
                            <view>金龟子看图写话漫游古都之西安篇 </view>
                            <view>
                                有趣实用的传统文化故事，帮助小朋友敢表达、会表达
                            </view>
                        </view>
                    </view>
                    <view class="getStyle">
                        <view>
                            <view class="title">
                                领取方式：
                            </view>
                            <view class="text">
                                {{
                                    isH5 ? "扫描" : "点击"
                                }}小程序码，进入“我的”开始学习
                            </view>
                        </view>
                        <image
                            src="../../static/images/chunjie/mini-pro.png"
                            @click="openMiniProgram"
                        />
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
                <view class="active-schedule">
                    <text>活动时间：1月10日-2月8日</text>
                    <text>结果公布：2月11日</text>
                </view>
                <view class="register">
                    <image src="../../static/images/chunjie/register.png" />
                </view>
                <view class="prize">
                    <view>
                        <text>一等奖</text>
                        <image src="../../static/images/chunjie/prize01.png" />
                        <text>学习机*1个</text>
                    </view>
                    <view>
                        <text>二等奖</text>
                        <image src="../../static/images/chunjie/prize02.png" />
                        <text>小度*4个</text>
                    </view>
                    <view>
                        <text>三等奖</text>
                        <image src="../../static/images/chunjie/prize03.png" />
                        <text>无人机*6个</text>
                    </view>
                    <view
                        class="prize-more"
                        @click="handleMorePrize"
                    />
                </view>
                <!-- 跑马灯 -->
                <view class="page-section-spacing">
                    <swiper
                        class="swiper"
                        :indicator-dots="false"
                        :autoplay="true"
                        :interval="3000"
                        :duration="500"
                        vertical="true"
                        circular="true"
                        :disable-touch="true"
                        easing-function="easeInOutCubic"
                    >
                        <swiper-item
                            v-for="item in crouselList"
                            :key="item.id"
                        >
                            <view class="swiper-item">
                                <image src="/static/images/chunjie/horn.png" />
                                <text>用户{{ item.user_name | plusXing }}</text>
                                <text>发布了</text>
                                <text>#{{ item.cat_name }}#</text>
                                <text>{{ item.resource_name }}</text>
                                <text>刚刚</text>
                            </view>
                        </swiper-item>
                    </swiper>
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
                                src="../../static/images/chunjie/search-icon.png"
                            />
                            <input
                                v-model="changeValue"
                                placeholder-style="color:#C9AC67"
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
                                :bg-color="'B11A27'"
                                @click="viewDetail(item)"
                            />

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
    </view>
</template>

<script>
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import share from '../../common/share';
import logger from '../../common/logger';
import EventCraftCover from '../../components/event-craft-cover/index.vue';

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
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif

            fr: '',
            changeValue: '',
            activeMenuIndex: 'new',
            loadMoreStatus: 'more',
            prompt: false,
            prompt01: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
            dataList: [],
            filter: {
                activity_id: 3,
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
            crouselList: [],
            setId: '',
        };
    },
    created() {
        this.getData();
        this.chunjieStatus();
        this.getCrouselList();
    },
    onLoad(params) {
        this.fr = logger.getFr('xchd', params);
    },
    onHide() {
        this.changeValue = '';
    },
    onUnload() {
        clearInterval(this.setId);
    },

    methods: {
        getCrouselList() {
            this.setId = setInterval(() => {
                console.log('再次请求crousel');
                api.post('/api/activity/resourcelist', {
                    activity_id: 3,
                    page_num: 1,
                    page_size: 10,
                    sort: 'new',
                }).then(({ list }) => {
                    this.crouselList = list;
                });
            }, 1000 * 60 * 5);
        },
        getData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
                        this.crouselList = list;
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
        chunjieStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 3,
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
                        url: '/pages/chunjie/upload/upload',
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
        handleMorePrize() {
            this.prompt01 = true;
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
                url: `/pages/chunjie/myWork/myWork?type=search&name=${this.changeValue.trim()}`,
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
            // eslint-disable-next-line prefer-destructuring
            this.shareDesc = titleList[0];

            share({
                title,
                desc,
                thumbnail:
                    'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            });
        },
        viewDetail(item) {
            uni.navigateTo({
                url: `/pages/chunjie/detail/detail?id=${item.id}&fr=${this.fr}`,
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
                    url: '/pages/chunjie/myWork/myWork?type=myWork',
                });
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
        openMiniProgram() {
            // #ifndef H5
            // eslint-disable-next-line no-undef
            wx.navigateToMiniProgram({
                appId: 'wxe8f8e50ab33cbce8',
                path: 'pages/account/index',
                success(res) {
                    console.log(res);
                    // 打开成功
                },
            });
            // #endif
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
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            // imageUrl: '/static/images/index/banner.png',
            path: '/pages/chunjie/index',
        };
    },
};
</script>

<style lang="less">
// 跑马灯
.page-section-spacing {
    width: 710upx;
    height: 46upx;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 23upx;
    padding: 0 20upx;
    font-size: 24rpx;
    box-sizing: border-box;
    margin-left: 20rpx;
    line-height: 46rpx;

    .swiper {
        width: 100%;
        height: 100%;
        .swiper-item {
            image {
                width: 37upx;
                height: 26upx;
                vertical-align: middle;
                margin-right: 9upx;
            }
            & > text:nth-child(2) {
                color: #fccda2;
            }
            & > text:nth-child(3) {
                color: #ff3849;
                margin: 0 5upx;
            }
            & > text:nth-child(4) {
                color: #f5c59c;
            }
            & > text:nth-child(5) {
                color: #ff3849;
            }
            & > text:nth-child(6) {
                color: #ff3849;
                float: right;
            }
        }
    }
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

.caiyi-box {
    text-align: center;
    .prize-prompt {
        width: 350upx;
        height: 30upx;
        font-size: 22upx;
        background: #c24124;
        color: #ff5630;
        border-radius: 16upx;
        padding: 0 12px;
        text-align: center;
        margin-top: 28upx;
        margin-bottom: 36upx;
        display: inline-block;
    }
    .caiyi-title {
        width: 240upx;
        height: 60upx;
        background: linear-gradient(
            0deg,
            rgba(255, 22, 16, 1),
            rgba(255, 189, 103, 1)
        );
        border: 2upx solid #ffe19a;
        border-radius: 30upx;
        display: inline-block;
        line-height: 60rpx;
        margin-bottom: 11rpx;
        font-size: 34upx;
        color: rgba(255, 255, 255, 1);
    }
    .caiyi-text {
        display: flex;
        justify-content: space-between;
        view {
            width: 530upx;
            text-align: left;
            font-size: 22upx;
        }
        image {
            width: 69upx;
            height: 64upx;
        }
    }
}
.renqi-prize {
    text-align: center;
    margin-bottom: 30upx;
    .renqi-title {
        width: 240upx;
        height: 60upx;
        background: linear-gradient(
            0deg,
            rgba(255, 22, 16, 1),
            rgba(255, 189, 103, 1)
        );
        border: 2upx solid #ffe19a;
        border-radius: 30upx;
        display: inline-block;
        line-height: 60rpx;
        margin-bottom: 11rpx;
        font-size: 34upx;
        color: rgba(255, 255, 255, 1);
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
.prize-box {
    // overflow: hidden;
    display: flex;
    justify-content: space-around;
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
            background: url("../../static/images/chunjie/prize-bg.png")
                no-repeat;
            background-size: 100% 100%;
            width: 193upx;
            height: 221upx;
        }
        image {
            width: 150upx;
            height: 150upx;
            margin-top: 35upx;
        }
        view:last-child {
            color: #a23820;
            font-size: 24upx;
            margin-top: 10upx;
        }
    }
}
.loadMore {
    width: 100%;
}
.upload {
    position: fixed;
    bottom: 0upx;
    text-align: center;
    width: 100%;
    height: 113upx;
    font-size: 36upx;
    z-index: 10;
    color: #ffe57b;
    text-shadow: 0px 4px 6px rgba(241, 0, 0, 0.65);
    line-height: 113upx;
    background: linear-gradient(
        0deg,
        rgba(255, 22, 16, 1),
        rgba(255, 189, 103, 1)
    );
    border-image: linear-gradient(
            -57deg,
            rgba(255, 231, 174, 1),
            rgba(255, 225, 154, 1)
        )
        2 2;
    box-shadow: 0px 16px 30px 0px rgba(203, 20, 34, 0.69);
}
.upload-disable {
    position: fixed;
    bottom: 0upx;
    text-align: center;
    width: 100%;
    height: 113upx;
    font-size: 36upx;
    background: linear-gradient(
        0deg,
        rgba(167, 140, 139, 1),
        rgba(212, 207, 200, 1)
    );
    box-shadow: 0px 16px 30px 0px rgba(203, 20, 34, 0.11);
    color: #ffffff;
    line-height: 113upx;
}
.cansai-text {
    width: 312upx;
    height: 44upx;
    margin-left: 220upx;
    margin-top: 20upx;
}
.prize {
    background: url("../../static/images/chunjie/prize_bg.png") no-repeat;
    background-size: 100% 100%;
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
        background: url("../../static/images/chunjie/more-prize-bg.png")
            no-repeat;
        background-size: 100% 100%;
        background-position: center 24upx;
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
    background: url(http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner.png?t=2)
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
            background: url("../../static/images/chunjie/vote_bg.png");
            background-size: 100% 100%;
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
        background: url("../../static/images/chunjie/title.png") no-repeat;
        background-size: 100% 100%;
        font-size: 34upx;
        width: 387upx;
        height: 99upx;
        position: absolute;
        top: 23upx;
        left: 190upx;
        text-align: center;
        line-height: 69upx;
    }
    .close {
        background: url("../../static/images/chunjie/close.png") no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: 30upx;
        right: 13upx;
        position: absolute;
    }
    .active-content {
        overflow-y: scroll;
        position: absolute;
        top: 116upx;
        left: 29upx;
        max-height: 88%;
        width: 678upx;
        padding: 0 30upx;
        box-sizing: border-box;
        padding-right: 20upx;
        .size {
            font-size: 28upx;
        }
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
    background-size: contain;
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

            button {
                width: 120upx;
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
                background: #ffedc3;
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
                    // margin-left:11upx;
                    width: 325upx;
                    position: absolute;
                    top: 20upx;
                    // #ifndef H5
                    top: 15upx;
                    // #endif
                    left: 60upx;
                    font-size: 24upx;
                    color: #ff3849;
                }
                .search-button {
                    font-size: 24upx;
                    color: #ff5831;
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
