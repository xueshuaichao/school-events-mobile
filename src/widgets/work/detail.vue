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
            <view class="author-info clearfix">
                <image
                    class="avatar-top fl-l"
                    src="/static/images/work/avatar.png"
                />
                <view class="author-name text-one-line fl-l">
                    {{ pageData.create_name }}
                </view>
            </view>
            <view class="school-and-record">
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
            <view class="work-name-wrap clearfix">
                <image
                    class="avatar file fl-l"
                    src="/static/images/work/file.png"
                />
                <view class="fl-l text-two-line">
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
            </view>
            <view
                v-if="activityId !== 8"
                class="intro text-three-line"
            >
                {{ introduce }}
            </view>
            <view
                v-if="activityId === 8"
                class="intro"
            >
                <text>
                    {{
                        !showMore && introduce && introduce.length > 50
                            ? `${introduce.slice(0, 50)}...`
                            : introduce
                    }}
                </text>
                <text
                    v-if="!showMore && introduce.length > 50"
                    class="to-open orange"
                    @click="changeClick"
                >
                    展开
                </text>
                <view
                    v-if="showMore && introduce.length > 50"
                    class="to-hide orange"
                    @click="changeClick"
                >
                    收起
                </view>
            </view>
            <view
                class="cat-name"
                :class="{ cur: pageData.cat_name }"
                @click="jumpLabelList"
            >
                {{ pageData.cat_name ? `#${pageData.cat_name}` : "" }}
            </view>
        </view>
        <view class="fixed-panel">
            <view class="icon-wrap">
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
                    class="item"
                    @click="handleCanvass"
                >
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/share.png"
                    />
                </view>
            </view>

            <view
                v-if="
                    activityId < 5 &&
                        pageData.resource_scope > 2 &&
                        from !== 'openGame'
                "
                class="btn primary"
                @click="joinGame"
            >
                我要参与
            </view>
            <view
                v-if="activityId > 5 || from === 'openGame'"
                class="join-game-read"
                :class="[
                    { wuyi: activityId === 8 },
                    { openGame: from === 'openGame' },
                    { liuyi: activityId === 9 }
                ]"
                @click="joinGame"
            >
                <image
                    class="icon"
                    src="/static/images/yiqing/detail/like.png"
                />
                <text>
                    我要参与
                </text>
            </view>
            <view
                v-if="isFromShare && (activityId > 5 || from === 'openGame')"
                class="join-game-read to-activty-index"
                :class="[
                    { 'read-index': activityId === 6 },
                    { 'wuyi-index': activityId === 8 },
                    { 'liuyi-index': activityId === 9 },
                    { openGame1: from === 'openGame' }
                ]"
                @click="watchIndex"
            >
                <image
                    class="icon"
                    :src="labaPath"
                />
                <text>
                    查看活动
                </text>
            </view>
        </view>
        <view
            v-if="isPaused && isPlayed"
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
            const width = 330;
            const height = 667;
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
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],
            // #ifdef H5
            isH5: true,
            // #endif
            canAutoPlay: false,
            isPlayed: false,
            isPaused: false,
            isVideoWaiting: false,
            // play_count: 1,
            showMore: false,
            introduce: this.pageData.introduce || '',
            total: 10,
            catName: this.pageData.cat_name,
            praise_count: this.pageData.praise_count || 0,
            toggleLikeObj: {},
        };
    },
    computed: {
        labaPath() {
            let id = this.activityId;
            if (this.from === 'openGame') {
                id = 7;
            }
            return `/static/images/work/laba-${id}.png`;
        },
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
                        this.isPlayed = true;
                    }
                } else {
                    this.videoContext.stop();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 1) {
                this.isPlayed = false;
                this.videoContext.seek(0);

                if (this.isH5) {
                    const b = document.querySelector(
                        `#detail${this.swiperPage} video`,
                    );
                    if (b) {
                        b.pause();
                        this.isPaused = true;
                        this.isPlayed = true;
                    }
                } else {
                    this.videoContext.play();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 2) {
                this.setPlayCount();
            }
        },
        likeStatus(newVal, oldVal) {
            if (newVal && !oldVal && !this.toggleLikeObj[this.pageData.id]) {
                this.praise_count += 1;
                this.toggleLikeObj[this.pageData.id] = 1;
            }
        },
        pageData(val) {
            if (val) {
                this.praise_count = this.pageData.praise_count || 0;
                this.introduce = this.pageData.introduce || '';
                this.catName = this.pageData.cat_name || '';
                // this.play_count = this.pageData.play_count;
            }
        },
    },
    created() {
        // this.play_count = this.pageData.play_count;
        // if (this.pageData.resource_type === 2) {
        //     this.play_count += 1;
        // }
    },
    mounted() {
        this.videoContext = uni.createVideoContext(
            `detail${this.swiperPage}`,
            this,
        );
        if (!this.isH5 && this.swiperPage === 1) {
            this.videoContext.play();
        }
        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        // #endif
    },
    methods: {
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        setPlayCount() {
            api.post('/api/works/playcount', {
                id: this.pageData.id,
            }).then(() => {
                // this.play_count += 1;
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
            this.$refs.video.play();
        },
        onPlay() {
            if (!this.isPlayed) {
                this.setPlayCount();
            }
            this.isVideoWaiting = false;
            this.isPlayed = true;
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
    text-shadow: 0 2upx 2upx rgba(0, 0, 0, 0.35);
    .file {
        display: inline-block;
        height: 24rpx;
        margin-right: 12upx;
        width: 24rpx;
        // vertical-align: middle;
    }

    .author-info {
        padding-left: 32rpx;
        position: relative;
        height: 34rpx;
        .avatar-top {
            position: absolute;
            left: 0;
            top: 50%;
            width: 24rpx;
            height: 24rpx;
            margin-top: -12rpx;
        }
        .author-name {
            color: #fff;
            font-size: 28upx;
            position: relative;
            line-height: 34upx;
            display: inline-block;
            width: 400rpx;
        }
    }
    .school-and-record {
        font-size: 24upx;
        margin: 6upx 0 24upx 0;
    }

    .author-from {
        font-size: 24rpx;
        margin-bottom: 10rpx;
    }

    .work-name {
        font-size: 28rpx;
        color: #fff;
        margin-bottom: 13rpx;
        font-weight: 600;
        position: relative;
        vertical-align: super;
        display: inline;
        word-break: break-all;
    }
    .deatil-achievement {
        margin-left: 10upx;
        font-size: 24upx;
        display: inline;
        vertical-align: super;
        word-break: break-all;
    }

    .intro {
        font-size: 25upx;
        line-height: 35upx;
        position: relative;
    }
    .cat-name {
        font-size: 24upx;
        color: #fff;
        margin-top: 18upx;
        line-height: 42upx;
        display: inline-block;
        padding: 0 11upx;
        border-radius: 8upx;
        &.cur {
            border: 1px solid rgba(255, 255, 255, 0.7);
        }
    }
    .orange {
        color: #db4e0e;
    }
    .to-hide {
        text-align: right;
    }
    .icon-grail {
        display: inline-block;
        width: 25upx;
        height: 21upx;
        margin-left: 22upx;
        margin-right: 2upx;
        vertical-align: middle;
    }
    .work-name-wrap {
        line-height: 24upx;
        .text-two-line {
            width: 90%;
        }
    }
}
.fixed-panel {
    position: absolute;
    // width: 146rpx;
    right: 0;
    bottom: 80rpx;
    color: #ffde98;
    font-size: 24rpx;
    text-align: center;
    z-index: 10;
    min-width: 100upx;

    .icon-wrap {
        //margin-right: 36rpx;
        text-align: center;
        position: relative;
        // right: -30rpx;
        margin-bottom: 20rpx;
        color: #fff;

        .item {
            margin-bottom: 10rpx;
            margin-left: 50rpx;
            min-width: 120rpx;
        }
    }

    .icon {
        width: 56rpx;
        height: 56rpx;
    }

    .btn-icon {
        width: 56rpx;
        height: 56rpx;
        background: transparent;
        display: inline-block;
        padding: 0;
        font-size: 0;
    }
    .join-game-read {
        background: #0f8c64;
        width: 150rpx;
        text-align: left;
        padding: 10rpx 20rpx;
        border-radius: 27rpx 0 0 27rpx;
        color: #fff;
        line-height: 40rpx;
        &.wuyi {
            background: #db4e0e;
        }
        &.liuyi {
            background: #c790ff;
        }
        &.openGame {
            background: #9f1ff3;
        }

        .icon {
            width: 44rpx;
            height: 42rpx;
            margin-right: 10rpx;
            vertical-align: middle;
        }

        &.to-activty-index {
            background: #fff;
            margin-top: 10rpx;
            .icon {
                width: 32rpx;
                height: 30rpx;
                margin-right: 14rpx;
                margin-left: 8rpx;
            }
            &.wuyi-index {
                color: #db4e0e;
            }
            &.read-index {
                color: #0f8c64;
            }
            &.liuyi-index {
                color: #c790ff;
            }
            &.openGame1 {
                color: #9f1ff3 !important;
            }
        }
    }
}
.btn {
    width: 146rpx;
    height: 56rpx;
    background: rgba(222, 39, 30, 1);
    border-radius: 27rpx 0px 0px 27rpx;
    color: #0096ff;
    font-size: 24rpx;
    background: #fff;
    line-height: 56rpx;
    text-align: center;
    padding: 0;
    position: relative;
    &::before {
        display: block;
        position: absolute;
        right: 12rpx;
        top: 20rpx;
        content: "";
        width: 13rpx;
        height: 13rpx;
        border-top: 1rpx solid #fff;
        border-right: 1rpx solid #fff;
        transform: rotate(45deg);
    }
    &.primary {
        background: #0096ff;
        color: #fff;
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
