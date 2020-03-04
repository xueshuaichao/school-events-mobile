<template>
    <view>
        <official-account />
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
                                一、活动主题
                            </view>
                            <view class="text">
                                《抗击疫情，“艺”起来》主题绘画、书法、摄影、朗诵、舞蹈、音乐、设计...作品征集！
                                假如我们上不了一线，就让我们拿起画笔、相机、手机...携手同心，以“艺”作枪，打赢疫情防控阻击战！用特别的方式向一线工作者致敬。
                                用自己独特的方式为武汉加油！为中国加油！
                            </view>
                        </view>
                        <view>
                            <view class="title">
                                二、活动时间
                            </view>
                            <view class="text">
                                即日起-2020年3月31日
                            </view>
                        </view>
                        <view>
                            <view class="title">
                                三、参与对象
                            </view>
                            <view class="text">
                                <ul>
                                    <li>
                                        青少年组：3-18岁青少年
                                    </li>
                                    <li>
                                        成年组：18岁以上的成年
                                    </li>
                                </ul>
                            </view>
                        </view>
                        <view>
                            <view class="title">
                                四、作品类型
                            </view>
                            <view class="text">
                                <view>
                                    1、书法、绘画、摄影、朗诵、歌唱、创意设计等（类型不限）；
                                </view>
                                <view>
                                    2、照片、视频格式均可；
                                </view>
                            </view>
                        </view>
                        <view>
                            <view class="title">
                                五、作品要求
                            </view>
                            <view class="text">
                                <view>
                                    1、作品需符合“抗击疫情”、“加油武汉”等相关主题；
                                </view>
                                <view>
                                    2、作品要求积极向上，充满正能量，必须原创。如发现用户上传不合规内容，如涉及攻击我国政治制度、法律制度、黄赌毒等违背社会主义核心价值观的内容，该账号将取消活动参与资格；
                                </view>
                                <view>
                                    3、视频格式：支持MP4、MOV、3GP、MP4V、M4V、MKV、AVI、FLV等，视频时长不超过10分钟；单张图片小于10MB；
                                </view>
                            </view>
                        </view>
                        <view>
                            <view class="title">
                                六、活动规则
                            </view>
                            <view class="text">
                                <view>
                                    1、参与活动用户在“青少年爱挑战”平台注册并通过活动页面上传作品，审核通过后可进行点赞分享等；
                                </view>
                                <view>
                                    2、每个账户每天只能为同一个作品点赞1次；
                                </view>
                                <view>
                                    3、活动组委会将根据作品质量、内容以及获赞数量进行综合评选，每个组别选出20件优秀作品，
                                    将获得组委会颁发的荣誉证书；对于参与积极的学校、机构或单位组委会也将综合评选给予荣誉奖励；并对获奖作品、优秀组织单位进行报道宣传；
                                </view>
                                <view>
                                    4、优秀作品及优秀组织单位获奖名单将于2020年4月10日在爱挑战官网（http://atz.qsnatz.com/)及官方微信公众号进行公布；荣誉证书将在5月下旬的爱挑战吉尼斯嘉年华现场进行统一颁发（不方便到现场的个人或单位将快递邮寄）；
                                </view>
                                <view>
                                    5、本活动最终解释权在法律允许范围内归活动举办方所有；
                                </view>
                            </view>
                        </view>
                        <view class="qr-wrap">
                            <image
                                class="qr-code"
                                src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/qrcode.jpg"
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
                    <i class="active-time">
                        活动时间：即日起——3月31号
                    </i>
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
                                <image src="/static/images/yiqing/horn.png" />
                                <view class="swiper-info">
                                    <text>
                                        用户{{ item.user_name | plusXing }}
                                    </text>
                                    <text>发布了</text>
                                    <text>#{{ item.cat_name }}#</text>
                                    <text>{{ item.resource_name }}</text>
                                </view>
                                <text>刚刚</text>
                            </view>
                        </swiper-item>
                    </swiper>
                </view>
                <view class="cansai-text">
                    —— 活动作品 ——
                </view>
                <!-- work show -->
                <view class="menu-list">
                    <view class="search-box">
                        <button
                            :class="{
                                active: activeMenuIndex === '1'
                            }"
                            @click="toggle('1')"
                        >
                            青少年组
                        </button>
                        <button
                            :class="{
                                active: activeMenuIndex === '2'
                            }"
                            @click="toggle('2')"
                        >
                            成年组
                        </button>
                        <view class="search">
                            <image
                                src="../../static/images/yiqing/search.png"
                            />
                            <input
                                v-model="changeValue"
                                placeholder-style="color:#6691FF"
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
                                :bg-color="'006EDE'"
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
                                点赞加油
                            </view>
                        </view>
                        <view
                            v-if="dataList.length === 0"
                            class="media-fill"
                        />
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
        EventCraftCover,
    },
    data() {
        return {
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
                activity_id: 5,
                page_num: 1,
                page_size: 10,
                activity_cat: 1,
            },
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
        this.fr = logger.getFr('dsxnh', params);
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
            this._crouselList();
            this.setId = setInterval(() => {
                this._crouselList();
            }, 1000 * 60 * 5);
        },
        _crouselList() {
            api.post('/api/activity/resourcelist', {
                activity_id: 5,
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
        chunjieStatus() {
            // 1未开始，2进行中，3已结束
            api.post('/api/activity/getactivitystatus', {
                activity_id: 5,
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
                        url: '/pages/yiqing/upload/upload',
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
                url: `/pages/yiqing/myWork/myWork?type=search&name=${this.changeValue.trim()}`,
            });
        },
        initShare() {
            // const titleList = [
            //     '鼠年大吉，快来看我的拜年才艺秀！',
            //     '才艺拜年乐趣多，我来表演你来赞！',
            //     '我来给你拜新年，表演才艺送祝福！',
            //     '鼠年春节我精彩，才艺拜年望喜爱！',
            // ];
            const titleList = [
                '抗击疫情“艺”起来，参与活动为武汉加油！向英雄致敬！',
            ];
            const title = titleList[Math.floor(Math.random() * titleList.length)];
            const desc = '快乐过寒假，才艺拜大年！';
            this.shareDesc = title;

            share({
                title,
                desc,
                thumbnail:
                    'http: //aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            });
        },
        viewDetail(item) {
            uni.navigateTo({
                url: `/pages/yiqing/detail/detail?id=${item.id}&fr=${this.fr}`,
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
                    url: '/pages/yiqing/myWork/myWork?type=myWork',
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
            path: '/pages/yiqing/index',
        };
    },
};
</script>

<style lang="less" scoped>
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
    margin-top: 20rpx;
    .swiper {
        width: 100%;
        height: 100%;
        .swiper-item {
            image {
                float: left;
                width: 37upx;
                height: 26upx;
                margin-right: 9upx;
                // vertical-align: middle;
                margin-top: 11rpx;
            }
            .swiper-info {
                float: left;
                width: 560upx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                color: #fff;
                & > text:nth-child(1) {
                    color: #ffde6d;
                }
                & > text:nth-child(2) {
                    color: #fff;
                    margin: 0 5upx;
                }
                & > text:nth-child(3) {
                    color: #ffde6d;
                }
                & > text:nth-child(4) {
                    color: #ffde6d;
                }
            }

            & > text:last-child {
                color: #fff;
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
    background: #0096ff;
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
    color: #ffde98;
    text-align: center;
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
            // width: 154upx;
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
            // width: 154upx;
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
            float: right;
            width: 170upx;
            height: 60upx;
            background: rgba(255, 88, 75, 1);
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
        background: url("../../static/images/yiqing/title.png") no-repeat;
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
        background: url("../../static/images/yiqing/close-icon.png") no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background: #1154ff;
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
    background: #1154ff;
    .main-swiper {
        .banner {
            position: relative;
            height: 740upx;
            background: url(http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png?t=2)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .active-rule {
                position: absolute;
                top: 19upx;
                left: 15upx;
                width: 120upx;
                height: 48upx;
                line-height: 48upx;
                font-size: 22upx;
                background: #fff;
                color: #1154ff;
                border-radius: 24upx;
            }
            .menu-title {
                position: absolute;
                top: 19upx;
                right: 15upx;
                width: 120upx;
                height: 48upx;
                line-height: 48upx;
                font-size: 22upx;
                background: #fff;
                color: #1154ff;
                border-radius: 24upx;
            }
            .active-time {
                position: absolute;
                top: 310upx;
                left: 218upx;
                color: #fff;
                font-size: 22upx;
                font-style: italic;
            }
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
                color: #ffffff;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;
                border-radius: 34upx;
                padding: 0;
                &.active {
                    background: #0096ff;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                background: #003dd7;
                width: 400upx;
                height: 72upx;
                position: relative;
                float: right;
                border-radius: 60upx;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 23upx;
                    left: 12upx;
                }
                input {
                    width: 293upx;
                    position: absolute;
                    top: 20upx;
                    // #ifndef H5
                    top: 15upx;
                    // #endif
                    left: 50upx;
                    font-size: 22upx;
                    color: #ffbec4;
                }
                .search-button {
                    font-size: 24upx;
                    color: #fff;
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
