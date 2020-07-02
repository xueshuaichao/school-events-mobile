<template>
    <view class="swiper-detail-box">
        <view
            v-show="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view>
        <template v-if="pageData.resource_type === 2">
            <view class="main-swiper">
                <swiper
                    class="swiper"
                    :indicator-dots="false"
                    :autoplay="false"
                    :interval="5000"
                    :duration="500"
                    :circular="true"
                    :loop="false"
                >
                    <swiper-item
                        v-for="item in pageData.img"
                        :key="item"
                    >
                        <view class="swiper-item">
                            <image
                                class="banner-image"
                                :src="item | optimizeImage"
                            />
                        </view>
                    </swiper-item>
                </swiper>
            </view>
        </template>
        <view
            v-if="pageData.resource_type === 1"
            class="video-wrap"
        >
            <template>
                <cover-view
                    v-if="isFullScreen && !isH5"
                    class="mp-weixin-full-screen-title text-one-line"
                >
                    <cover-view class="cover-title" />
                    <cover-view class="cover-action">
                        <button
                            class="mini-btn"
                            open-type="share"
                        >
                            <cover-image
                                class="mini-icon"
                                :src="'/static/images/work/mini-share.png'"
                            />
                        </button>
                        <cover-image
                            class="cover-like"
                            :src="
                                likeStatus === 1
                                    ? '/static/images/work/mini-like-ac.png'
                                    : '/static/images/work/mini-like.png'
                            "
                            @click="toggleLike"
                        />
                    </cover-view>
                </cover-view>
                <video
                    :id="`detail${swiperPage}`"
                    ref="video"
                    class="video"
                    preload
                    :src="pageData.video.cloud_path_sd"
                    :autoplay="false"
                    :controls="true"
                    :loop="true"
                    :poster="pageData.video_img_url"
                    x5-video-player-type="h5-page"
                    @pause="onPause"
                    @play="onPlay"
                    @waiting="onWaiting"
                    @timeupdate="onTimeupdate"
                    @fullscreenchange="onFullScreenChange"
                />
            </template>
        </view>
        <view class="content">
            <view class="author-info">
                <view class="author-name text-one-line">
                    {{ pageData.create_name }}
                </view>
            </view>
            <view
                v-if="pageData.school_name || pageData.record"
                class="school-and-record"
            >
                <text>{{ pageData.school_name }}</text>
                <template v-if="pageData.record">
                    <image
                        class="icon-grail"
                        :src="
                            `/static/images/work/record-${pageData.record}.png`
                        "
                    />
                    <text class="yellow">
                        {{ recordTxts[pageData.record - 1] }}
                    </text>
                </template>
            </view>
            <view class="work-name-wrap">
                <text class="work-name">
                    {{ pageData.resource_name }}
                </text>
                <text
                    v-if="pageData.achievement"
                    class="deatil-achievement lightyellow"
                >
                    成绩:{{ pageData.achievement
                    }}{{ pageData.achievement_unit }}
                </text>
            </view>
            <view class="intro">
                <text>
                    {{
                        !showMore && introduce && introduce.length > 50
                            ? `${introduce.slice(0, 50)}...`
                            : introduce
                    }}
                </text>
                <text
                    v-if="!showMore && introduce.length > 50"
                    class="to-hide-open"
                    @click="changeClick"
                >
                    <text class="txt">
                        展开
                    </text>
                </text>
                <view
                    v-if="showMore && introduce.length > 50"
                    class="to-hide-open"
                    @click="changeClick"
                >
                    <text class="txt">
                        收起
                    </text>
                </view>
            </view>
            <view
                class="cat-name"
                :class="{ cur: pageData.cat_name }"
                @click="jumpLabelList"
            >
                {{ pageData.cat_name ? `#${pageData.cat_name}#` : "" }}
            </view>
        </view>
        <view class="fixed-panel">
            <view class="icon-wrap">
                <view
                    class="item"
                    @click="joinGame"
                >
                    <image
                        class="icon join"
                        src="/static/images/work/detail-join.png"
                    />
                </view>
                <view
                    class="item"
                    @click="jumpUc"
                >
                    <image
                        class="icon avator"
                        :src="
                            pageData.create_user_avatar_url ||
                                '/static/images/uc/avatar.png'
                        "
                    />
                </view>
                <view
                    class="item"
                    @click="toggleLike"
                >
                    <image
                        class="icon"
                        :status="likeStatus"
                        :src="
                            likeStatus === 0
                                ? '/static/images/yiqing/detail/like.png'
                                : '/static/images/yiqing/detail/like-ac.png'
                        "
                    />
                    <view> {{ praise_count || 0 }} </view>
                </view>
                <view
                    class="item"
                    @click.stop="showMessage"
                >
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/message.png"
                    />
                    <view>{{ commentTotal }}</view>
                </view>
                <view
                    v-if="isWechat || isApp || !isH5"
                    class="item"
                    @click="handleCanvass"
                >
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/share.png"
                    />
                </view>
                <view
                    v-if="activityId"
                    class="item primary"
                    @click="watchIndex"
                >
                    返回首页
                </view>
            </view>
        </view>
        <view
            v-if="isPaused && pageData.resource_type === 1"
            class="pause-cover"
        >
            <view
                class="uni-video-cover"
                @click="togglePlayStatus"
            >
                <div class="uni-video-cover-play-button" />
            </view>
        </view>
        <view
            v-if="isVideoWaiting && pageData.resource_type === 1"
            class="uni-video-cover"
            style="pointer-events: none;color: #fff"
        >
            加载中
        </view>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    filters: {
        optimizeImage: (val) => {
            let newUrl = '';
            let width = 330;
            let height = 667;
            try {
                const res = uni.getSystemInfoSync();
                width = res.windowWidth;
                height = res.windowHeight;
            } catch (e) {
                // error
            }

            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            }
            return newUrl;
        },
    },
    props: {
        pageData: {
            type: Object,
            default: () => ({
                show: false,
            }),
        },
        likeStatus: {
            type: Number,
            default: 0,
        },
        activityId: {
            type: Number,
            default: 0,
        },
        isFromShare: {
            type: String,
            default: '1',
        },
        from: {
            type: String,
            default: '',
        },
        showDrawer: {
            type: Boolean,
            default: false,
        },
        isChangeSlide: {
            type: Number,
            default: 1,
        },
        swiperPage: {
            type: Number,
            default: 1,
        },
        commentTotal: {
            type: Number,
            default: 0,
        },
        isChangeStatusLike: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],
            // #ifdef H5
            isH5: true,
            isWechat: false,
            isApp: false,
            // #endif
            canAutoPlay: false,
            isPaused: false,
            isVideoWaiting: false,
            // play_count: 1,
            showMore: false,
            introduce: this.pageData.introduce || '',
            total: 10,
            catName: this.pageData.cat_name,
            praise_count: this.pageData.praise_count || 0,
            toggleLikeObj: {},
            togglePlatCounts: {},
        };
    },
    watch: {
        isChangeSlide(val) {
            if (val !== this.swiperPage && this.pageData.resource_type === 1) {
                if (this.isH5) {
                    // h5的暂停方式需要专门处理。
                    const b = document.querySelector(
                        `#detail${this.swiperPage} video`,
                    );
                    if (b) {
                        b.pause();
                        this.isPaused = true;
                    }
                    this.togglePlatCounts[this.pageData.id] = 0;
                } else {
                    this.videoContext.pause();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 1) {
                // 当前作品

                if (this.isH5) {
                    const b = document.querySelector(
                        `#detail${this.swiperPage} video`,
                    );
                    if (b) {
                        b.pause();
                        this.isPaused = true;
                    }
                } else {
                    this.videoContext.seek(0);
                    this.videoContext.play();
                    this.setPlayCount();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 2) {
                this.setPlayCount();
            }
        },
        isChangeStatusLike() {
            if (
                this.swiperPage === this.isChangeSlide
                && !this.toggleLikeObj[this.pageData.id]
                && this.likeStatus
            ) {
                this.toggleLikeObj[this.pageData.id] = true;
                this.praise_count += 1;
            }
        },
        pageData(val) {
            if (val) {
                this.praise_count = this.pageData.praise_count || 0;
                this.introduce = this.pageData.introduce || '';
                this.catName = this.pageData.cat_name || '';
            }
        },
    },
    created() {},
    mounted() {
        this.videoContext = uni.createVideoContext(
            `detail${this.swiperPage}`,
            this,
        );
        if (
            !this.isH5
            && this.swiperPage === 1
            && this.pageData.resource_type === 1
        ) {
            this.videoContext.play();
            this.setPlayCount();
            console.log('mounted--play-----');
        }
        if (this.swiperPage === 1 && this.pageData.resource_type === 2) {
            this.setPlayCount();
        }
        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        const ua = window.navigator.userAgent.toLowerCase();
        this.isWechat = ua.indexOf('micromessenger') !== -1;
        this.isApp = ua.toLowerCase().indexOf('wd-atz-ios') !== -1
            || ua.toLowerCase().indexOf('wd-atz-android') !== -1;
        // #endif
    },
    methods: {
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        setPlayCount() {
            api.post('/api/works/playcount', {
                id: this.pageData.id,
            });
        },
        handleCanvass() {
            this.$emit('doAction', 'handleCanvass');
        },
        toggleLike() {
            this.$emit('doAction', 'toggleLike');
        },
        joinGame() {
            this.$emit('doAction', 'joinGame');
        },
        showMessage() {
            this.$emit('doAction', 'showMessage');
        },
        onPause() {
            this.isPaused = true;
        },
        togglePlayStatus() {
            this.isPaused = false;
            this.videoContext.play();
        },
        onPlay() {
            if (!this.togglePlatCounts[this.pageData.id] && this.isH5) {
                this.togglePlatCounts[this.pageData.id] = 1;
                this.setPlayCount();
            }
            this.isVideoWaiting = false;
        },
        onWaiting() {
            this.isVideoWaiting = true;
            this.timeupdateCounter = 0;
        },
        onTimeupdate() {
            if (this.timeupdateCounter > 1) {
                this.isVideoWaiting = false;
            } else {
                this.timeupdateCounter += 1;
            }
        },
        onFullScreenChange(e) {
            const isFullScreenMode = e.detail.fullScreen;
            this.isFullScreen = isFullScreenMode;
        },
        changeClick() {
            this.showMore = !this.showMore;
        },
        watchIndex() {
            let url = '/pages/read/index';
            if (this.activityId === 8) {
                url = '/pages/activity-pages/labor/index';
            }
            if (this.activityId === 9) {
                url = '/activity/pages/children/index';
            }
            if (this.from === 'openGame') {
                url = '/pages/openGame/index';
            }
            if (this.activityId === 3) {
                url = '/activity/chunjie/index';
            }
            if (this.activityId === 4) {
                url = '/activity/chunjiehao/index';
            }
            if (this.activityId === 5) {
                url = '/pages/yiqing/index';
            }
            if (this.activityId === 10) {
                url = '/activity/pages/index?activity_id=10';
            }
            uni.navigateTo({
                url,
            });
        },
        jumpLabelList() {
            // 标签列表
            const {
                resource_scope: resourceScope,
                cat_id: catId,
                cat_name: catName,
            } = this.pageData;
            const url = `/pages/work/label/list?cat_id=${resourceScope},${catId}&cat_name=${catName}`;
            uni.navigateTo({
                url,
            });
        },
        jumpUc() {
            if (this.activityId && this.activityId > 9) {
                api.get('/api/activity/activitystatus', {
                    activity_id: this.activityId,
                }).then((data) => {
                    if (data.status === 2) {
                        this.jumpUcUrl('activity');
                    } else {
                        this.jumpUcUrl();
                    }
                });
            } else {
                this.jumpUcUrl();
            }
        },
        jumpUcUrl(activity) {
            if (activity && this.activityId === 10) {
                uni.navigateTo({
                    url: `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.pageData.create_by}`,
                });
            } else {
                uni.navigateTo({
                    url: `/pages/uc/uc/index?uid=${this.pageData.create_by}`,
                });
            }
        },
    },
};
</script>

<style lang="less">
.swiper-detail-box {
    width: 100%;
    height: 100vh;
    position: relative;
}
.yellow {
    color: #ff9b35;
    text-shadow: 0 1upx 2upx #ff9b35;
    font-size: 22upx;
}
.lightyellow {
    color: #ffd339;
    text-shadow: 0 1upx 2upx #ffd339;
}
.h5-full-screen-title {
    position: fixed;
    width: 100%;
    z-index: 10000;
    color: #fff;
    padding-top: 20upx;
    padding-left: 20upx;
    box-sizing: border-box;
    top: 0;
}
.mp-weixin-full-screen-title {
    position: absolute;
    top: 46upx;
    width: 100%;
    z-index: 10000;
    color: #fff;
    display: flex;
    box-sizing: border-box;
    padding: 0 30upx 0 100upx;

    .video-title {
        flex: 1;
    }
}

.cover-title {
    flex: 1;
}

.mini-btn {
    background: transparent;
    padding: 0px;
    width: 37rpx;
    height: 37rpx;
    line-height: 37rpx;
    border-radius: 0;
    display: inline-block;
    margin-right: 48upx;
}

.mini-icon {
    width: 37rpx;
    height: 37rpx;
    display: inline-block;
}

.cover-like {
    width: 37upx;
    height: 37upx;
    display: inline-block;
}

.video-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
}

.swiper {
    width: 750rpx;
    // height: 1334rpx;
    height: 100vh;
}

.main-swiper {
    position: absolute;
    width: 100%;
    top: 0;

    uni-swiper {
        height: 100vh;

        .swiper-item {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .banner-image {
        width: 750rpx;
        height: 100vh;
    }
}
.content {
    position: absolute;
    bottom: 80upx;
    width: 480upx;
    padding: 30upx 30upx 0;
    color: #fff;
    left: 0;
    // pointer-events: none;
    z-index: 10;
    text-shadow: 0 2upx 3upx rgba(0, 0, 0, 0.35);

    .author-info {
        position: relative;
        height: 34rpx;
        .author-name {
            color: #fff;
            font-size: 30upx;
            position: relative;
            line-height: 34upx;
            display: inline-block;
            width: 400rpx;
            font-weight: 600;
        }
    }
    .school-and-record {
        font-size: 26upx;
        margin: 6upx 0 24upx 0;
    }

    .author-from {
        font-size: 24rpx;
        margin-bottom: 10rpx;
    }
    .work-name-wrap {
        width: 90%;
        margin-top: 16upx;
    }
    .work-name {
        font-size: 30upx;
        color: #fff;
        font-weight: 600;
        margin-right: 10upx;
        line-height: 40rpx;
    }
    .deatil-achievement {
        font-size: 24upx;
        vertical-align: top;
    }

    .intro {
        font-size: 26upx;
        line-height: 35upx;
        position: relative;
        margin-top: 12upx;
    }
    .cat-name {
        font-size: 24upx;
        color: #fff;
        margin-top: 22upx;
        line-height: 42upx;
        display: inline-block;
        padding: 4upx 16upx;
        border-radius: 8upx;
        &.cur {
            background: rgba(119, 119, 119, 0.4);
        }
    }
    .to-hide-open {
        text-align: right;
        .txt {
            width: 72rpx;
            text-align: center;
            background: rgba(119, 119, 119, 0.4);
            padding: 4rpx 0;
            color: rgba(255, 255, 255, 0.5);
            display: inline-block;
            border-radius: 4rpx;
        }
    }
    .icon-grail {
        display: inline-block;
        width: 24upx;
        height: 22upx;
        margin-left: 22upx;
        margin-right: 2upx;
        vertical-align: middle;
    }
}
.fixed-panel {
    position: absolute;
    // width: 146rpx;
    right: 0;
    bottom: 80rpx;
    color: #ffde98;
    font-size: 26rpx;
    text-align: center;
    z-index: 10;
    min-width: 100upx;
    text-shadow: 0 2upx 3upx rgba(0, 0, 0, 0.35);

    .icon-wrap {
        //margin-right: 36rpx;
        text-align: center;
        position: relative;
        // right: -30rpx;
        margin-bottom: 20rpx;
        color: #fff;

        .item {
            margin-bottom: 52rpx;
            margin-left: 50rpx;
            min-width: 120rpx;
            letter-spacing: 2upx;
        }
    }

    .icon {
        width: 80rpx;
        height: 80rpx;
        &.join {
            width: 136rpx;
            height: 130rpx;
        }
        &.avator {
            width: 90rpx;
            height: 90rpx;
            border-radius: 66rpx;
            box-shadow: 0 4upx 4upx 0 rgba(0, 0, 0, 0.28);
        }
    }
    .primary {
        color: #fff;
        font-size: 28rpx;
        text-align: center;
        line-height: 36rpx;
        background: #1166ff;
        width: 102rpx;
        height: 118rpx;
        border-radius: 56rpx;
        padding: 24rpx 24rpx 0;
        box-sizing: border-box;
    }
}
.uni-video-cover {
    position: absolute;
}
/deep/ .uni-video-container {
    .uni-video-cover-duration {
        display: none;
    }
}
</style>
