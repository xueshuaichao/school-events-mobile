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
                        大赛活动参与机制是“线下组织活动、线上展示推优、挑战汇演直播、统一认证表彰”。
                        各学校按照活动项目要求和技术规范，组织师生在官方平台上传视频进行展示分享和公平竞赛，
                        在挑战类项目中创造校级、县级、市级、全国纪录和吉尼斯世界纪录，在才艺秀项目中推优评选才艺之星。
                        活动参加方式主要是：学校组织师生快速注册入驻官方平台——选择挑战项目或才艺秀项目——在教师
                        和家长指导下录制微视频上传官方平台——大赛组委会开展评选、认证、表彰。
                        网络预选赛包括“爱挑战”网络竞技赛、吉尼斯网络预选赛和才艺秀网络推优赛。
                        各学校组织学生参与项目挑战，上报挑战赛网络预选赛和才艺秀网络推优赛。
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
                    <text class="active-time">
                        活动时间：2020年4月30-5月30日
                    </text>
                </view>
                <view class="cansai-text">
                    <view class="jingji-btn-bg">
                        <view
                            :class="
                                jingjiactiveMenuIndex === 1
                                    ? 'jingji-btn active'
                                    : 'jingji-btn'
                            "
                            @click="jingjitoggle(1)"
                        >
                            竞技项目
                        </view>
                    </view>
                    <view class="jingji-btn-bg">
                        <view
                            :class="
                                jingjiactiveMenuIndex === 2
                                    ? 'jingji-btn active'
                                    : 'jingji-btn'
                            "
                            @click="jingjitoggle(2)"
                        >
                            吉尼斯项目
                        </view>
                    </view>
                    <view class="jingji-btn-bg">
                        <view
                            :class="
                                jingjiactiveMenuIndex === 3
                                    ? 'jingji-btn active'
                                    : 'jingji-btn'
                            "
                            @click="jingjitoggle(3)"
                        >
                            才艺秀项目
                        </view>
                    </view>
                </view>
                <!-- work show -->
                <view class="menu-list">
                    <view class="search-box">
                        <button
                            v-if="jingjiactiveMenuIndex === 3"
                            :class="{
                                active: activeMenuIndex === 3
                            }"
                            @click="toggle(3)"
                        >
                            最新
                        </button>
                        <button
                            v-if="jingjiactiveMenuIndex === 3"
                            :class="{
                                active: activeMenuIndex === 1
                            }"
                            @click="toggle(1)"
                        >
                            最热
                        </button>
                        <view
                            class="search"
                            :class="{
                                searchjinji: jingjiactiveMenuIndex !== 3
                            }"
                        >
                            <image
                                src="../../static/images/zhibo/search.png"
                                @click="bindconfirm"
                            />
                            <input
                                v-model="changeValue"
                                placeholder-style="color:#999999"
                                type="text"
                                confirm-type="search"
                                confirm-hold="true"
                                placeholder="搜索作者或者作品"
                                @confirm="bindconfirm"
                            >
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
                                {{
                                    jingjiactiveMenuIndex === 3
                                        ? `${item.cat_name} | ${item.name}`
                                        : `${item.cat_name} | ${item.achievement}${item.achievement_unit}`
                                }}
                            </view>
                            <view class="nameAndSchool">
                                <view class="name text-one-line">
                                    <image
                                        src="../../static/images/zhibo/name-icon.png"
                                    />
                                    {{ `${item.create_name}` }}
                                </view>
                                <view class="school text-one-line">
                                    {{ `${item.create_user_class}` }}
                                </view>
                            </view>
                            <text class="vote-num">
                                {{ item.praise_count }}赞
                            </text>
                            <view
                                class="vote"
                                :class="item.is_like === 1 ? 'voted' : 'unvote'"
                                @click="handleVote(item)"
                            >
                                <image
                                    src="../../static/images/zhibo/vote.png"
                                />
                                {{ item.is_like === 1 ? "已赞" : "点赞" }}
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
                            color="#333"
                        />
                    </view>
                    <view class="bottom-bg-box">
                        <view class="bottom-bg" />
                    </view>
                </view>
                <image
                    class="goTop"
                    src="../../static/images/zhibo/toTop.png"
                    @click="handleToTop"
                />
                <view
                    class="upload"
                    @click="handleUpload"
                >
                    我要参赛
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
import utils from '../../common/utils';

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
            activeMenuIndex: 3,
            jingjiactiveMenuIndex: 1,
            loadMoreStatus: 'more',
            prompt: false,
            isPlayed: false,
            newsTabActiveIndex: 0,
            dataList: [],
            filter: {
                page_num: 1,
                page_size: 10,
                column: 1,
                sort: 3,
            },
            status: 2,
            setId: '',
        };
    },
    created() {
        this.getData();
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
        handleToTop() {
            // eslint-disable-next-line no-undef
            wx.pageScrollTo({
                scrollTop: 0,
            });
        },
        getData(title) {
            api.post('/api/works/competitionlist', this.filter).then(
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

                    // this.initShare();
                    uni.hideLoading();
                },
            );
        },
        handleUpload() {
            if (utils.isOverDate()) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    uni.navigateTo({
                        url: '/pages/openGame/zhibo-list',
                    });
                });
            } else {
                uni.showToast({
                    title: '活动已结束',
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
                url: `/pages/openGame/myWork/myWork?type=search&name=${this.changeValue.trim()}`,
            });
        },
        initShare() {
            const title = '世界吉尼斯青少年“爱挑战”网络预选赛';
            this.shareDesc = title;

            share({
                title,
                path: '/pages/openGame/index',
                thumbnail:
                    'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            });
        },
        viewDetail(item) {
            uni.navigateTo({
                // url: `/pages/work/detail/detail?id=${item.id}&fr=${this.fr}&activity_id=5`,
                url: `/pages/work/detail/detail?id=${item.id}&from=openGame`,
            });
        },
        toggle(k) {
            uni.showLoading();
            this.activeMenuIndex = k;
            this.filter.sort = k;
            this.filter.page_num = 1;
            this.getData();
        },
        jingjitoggle(k) {
            uni.showLoading();
            this.jingjiactiveMenuIndex = k;
            this.filter.column = k;
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
                    url: '/pages/openGame/myWork/myWork?type=myWork',
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
            if (utils.isOverDate()) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    api.post('/api/common/like', {
                        object_id: item.id,
                        object_type: 1,
                        type: 1,
                    }).then(
                        () => {
                            // eslint-disable-next-line no-param-reassign
                            item.praise_count += 1;
                            // eslint-disable-next-line no-param-reassign
                            item.is_like = 1;
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
                    title: '活动已结束',
                    icon: 'none',
                });
            }
        },
    },
    onShareAppMessage(res) {
        console.log(res, 'res111');
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: '世界吉尼斯青少年“爱挑战”网络预选赛',
            path: '/pages/openGame/index',
        };
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
.goTop {
    position: fixed;
    bottom: 200upx;
    right: 60upx;
    width: 104upx;
    height: 100upx;
    z-index: 10;
}
.upload {
    position: fixed;
    bottom: 0upx;
    background: #9f1ff3;
    text-align: center;
    width: 100%;
    color: #fff;
    height: 116upx;
    font-size: 32upx;
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
    text-align: center;
    padding: 0 25rpx;
    overflow: hidden;
    .jingji-btn-bg {
        background: url("../../static/images/zhibo/toggleBtn-bg.png");
        width: 223upx;
        height: 116upx;
        background-size: 100% 100%;
        margin-right: 12upx;
        float: left;
        position: relative;
        .jingji-btn {
            height: 64upx;
            font-size: 32upx;
            text-align: center;
            line-height: 64upx;
            font-weight: 700;
            color: #000;
            background: #fff;
            position: absolute;
            top: 3upx;
            left: 3upx;
            right: 22upx;
        }
        .active {
            background: #9f1ff3;
            color: #fff;
        }
    }
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
        width: 290upx;
        justify-items: space-betwen;
        position: relative;
        margin-bottom: 50upx;
        /deep/ .event-craft-cover .video {
            width: 290upx;
        }
        .video {
            width: 335upx;
            height: 225upx;
        }
        .media-name {
            color: #333;
            width: 100%;
            // left:0;
            // top:290upx;
            font-size: 24upx;
            margin-bottom: 10upx;
        }
        .nameAndSchool {
            // display: flex;
            // justify-content: space-between;
            font-size: 22upx;
            color: #999999;
            margin-top: 24rpx;
            margin-bottom: 24rpx;
            overflow: hidden;
            .name {
                width: 50%;
                float: left;
                image {
                    width: 28upx;
                    height: 22upx;
                    margin-right: 9rpx;
                }
            }
            .school {
                width: 50%;
                float: right;
                text-align: right;
            }
        }
        .vote-num {
            color: #9f1ff3;
            font-size: 22upx;
            float: left;
            height: 50rpx;
            line-height: 50rpx;
        }

        .vote {
            float: right;
            width: 120upx;
            color: #9f1ff3;
            font-size: 22upx;
            text-align: center;
            box-sizing: border-box;
            padding: 14upx 0 14upx 24upx;
            position: relative;
            line-height: 1;
            &.unvote {
                background: #fff;
                border: 1px solid rgba(159, 31, 243, 1);
            }
            &.voted {
                background: #f5e7ff;
                border: 1px solid transparent;
            }
            image {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 25upx;
                width: 18upx;
                height: 18upx;
            }
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
    background-color: rgba(0, 0, 0, 0.8);
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
        font-size: 28upx;
        width: 550upx;
        height: 740upx;
        position: absolute;
        top: 193upx;
        left: 60upx;
        z-index: 222;
        color: #333;
        line-height: 46upx;
    }
    .close {
        width: 62upx;
        height: 62upx;
        top: 12upx;
        right: 12upx;
        position: absolute;
    }
    .active-content {
        background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/openGame-intro.png")
            no-repeat;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 690upx;
        height: 1154upx;
        transform: translate(-50%, -50%);
        background-size: 100% 100%;
        .size {
            font-size: 28upx;
        }
    }
}

.page-index {
    padding-bottom: 20upx;
    display: relative;
    background: #34349c;
    .main-swiper {
        .banner {
            position: relative;
            height: 740upx;
            background: url(http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/openGame-mainBg.png)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .active-rule {
                position: absolute;
                top: 58upx;
                width: 123upx;
                height: 53upx;
                font-size: 0;
            }
            .menu-title {
                position: absolute;
                top: 58upx;
                right: 0;
                width: 123upx;
                height: 53upx;
                font-size: 0;
            }
            .active-time {
                position: absolute;
                top: 372upx;
                left: 160upx;
                color: #fff;
                font-size: 28upx;
            }
        }
    }

    .menu-list {
        margin-left: 30upx;
        width: 670upx;
        margin-bottom: 130upx;
        background: #fff;
        padding: 20px 15px;
        box-sizing: border-box;
        position: relative;
        // border-bottom: 19upx solid #5151c6;
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
            button {
                width: 83upx;
                height: 70upx;
                float: left;
                line-height: 70upx;
                color: #9f1ff3;
                background: #fff;
                font-size: 24upx;
                border-radius: 0upx;
                padding: 0;
                border: 1px solid rgba(84, 8, 68, 1);
                margin-right: 16rpx;
                &.active {
                    background: #9f1ff3;
                    color: #fff;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                width: 408upx;
                height: 70upx;
                position: relative;
                float: right;
                border: 1px solid rgba(84, 8, 68, 1);
                image {
                    width: 40upx;
                    height: 40upx;
                    position: absolute;
                    top: 50%;
                    margin-top: -20upx;
                    right: 22upx;
                }
                input {
                    width: 293upx;
                    position: absolute;
                    top: 20upx;
                    // #ifndef H5
                    top: 15upx;
                    // #endif
                    left: 22upx;
                    font-size: 28upx;
                    color: #000;
                }
                &.searchjinji {
                    width: 98%;
                    float: left;
                }
            }
        }
    }
    .bottom-bg-box {
        position: absolute;
        bottom: -16upx;
        left: 0;
        height: 16upx;
        width: 100%;
        .bottom-bg {
            width: 100%;
            height: 100%;
            background: #5151c6;
            border: 1upx solid #540844;
            border-right: 0 none;
            transform: skew(45deg);
            transform-origin: right top;
        }
    }

    .menu-list::after {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: -19upx;
        content: "";
        width: 19upx;
        height: 100%;
        background: #7c7cde;
        border: 1upx solid rgba(84, 8, 68, 1);
        transform: skewY(45deg);
        transform-origin: left;
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
