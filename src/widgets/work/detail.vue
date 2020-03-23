<template>
    <view
        :id="`detail${swiperPage}`"
        class="swiper-detail-box"
    >
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
                    ref="video"
                    class="video"
                    preload
                    :src="clear ? '' : pageData.video.cloud_path_sd"
                    :autoplay="!isH5"
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
                <image
                    class="avatar"
                    src="/static/images/work/avatar.png"
                />
                <text class="author-name text-one-line">
                    {{ pageData.create_name }}
                </text>
            </view>
            <view
                v-if="pageData.record"
                class="school-and-record"
            >
                <text>{{ pageData.school_name }}</text>
                <image
                    class="icon-grail"
                    :src="`/static/images/work/record-${pageData.record}.png`"
                />
                <text class="yellow">
                    {{ recordTxts[pageData.record - 1] }}
                </text>
            </view>
            <view class="work-name-wrap text-one-line">
                <text class="work-name text-one-line">
                    {{ pageData.resource_name }}
                </text>
                <text
                    v-if="pageData.achievement"
                    class="deatil-achievement lightyellow"
                >
                    成绩：{{ pageData.achievement
                    }}{{ pageData.achievement_unit }}
                </text>
            </view>
            <view class="intro text-three-line">
                {{ pageData.introduce || "暂无简介" }}
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
                    <view> {{ pageData.praise_count }} </view>
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

                <view class="item">
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/view.png"
                    />
                    <view> {{ pageData.play_count }} </view>
                </view>
            </view>

            <view
                v-if="pageData.resource_scope === 3"
                class="btn primary"
                @click="joinGame"
            >
                我要参与
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
            v-if="isVideoWaiting"
            class="uni-video-cover"
            style="pointer-events: none;color: #fff"
        >
            加载中
        </view>
    </view>
</template>

<script>
// import api from '../../common/api';

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
        isChangeSlide: {
            type: Number,
            default: 1,
        },
        swiperPage: {
            type: Number,
            default: 1,
        },
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],

            // #ifdef H5
            isH5: true,
            // #endif
            isAutoPlay: true,
            isPlayed: false,
            isPaused: false,
            isVideoWaiting: false,
            clear: false,
            showVideo: this.swiperPage === this.isChangeSlide,
            play_count: 0,
        };
    },
    watch: {
        isChangeSlide(val) {
            console.log(val, '滑动到的页面', this.swiperPage, '当前页面');
            this.showVideo = this.swiperPage === val;
            console.log(this.showVideo, '---------show');
            if (val !== this.swiperPage && this.pageData.resource_type === 1) {
                // this.$refs.video.pause();
                this.clear = true;
            }
            if (val === this.swiperPage && this.pageData.resource_type === 1) {
                this.clear = false;
            }
        },
    },
    created() {
        this.play_count = this.pageData.play_count;
    },
    mounted() {},
    methods: {
        panelAction(action) {
            this.$emit('doAction', action);
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
        onPause() {
            this.isPaused = true;
            console.log('暂停了-------');
        },
        togglePlayStatus() {
            console.log('--------togglePlayStatus---');
            this.isPaused = false;
            this.$refs.video.play();
        },
        onPlay() {
            // if (!this.isPlayed) {
            //     api.post('/api/works/playcount', {
            //         id: this.pageData.id,
            //     }).then(() => {
            //         this.play_count = this.play_count + 1;
            //     });
            // }
            this.isVideoWaiting = false;
            this.isPlayed = true;
        },
        onWaiting() {
            this.isPlayed = true;
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
    },
};
</script>

<style lang="less">
.swiper-detail-box {
    width: 100%;
    height: 100vh;
}
.yellow {
    color: #ff9b35;
}
.lightyellow {
    color: #ffd339;
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
    bottom: 20upx;
    width: 480rpx;
    padding: 30upx;
    color: #fff;
    left: 0;
    pointer-events: none;
    .avatar {
        display: inline-block;
        width: 34rpx;
        height: 32rpx;
        margin-right: 16upx;
        vertical-align: super;
    }

    .author-info {
        .author-name {
            color: #fff;
            font-size: 34upx;
            position: relative;
            top: -2rpx;
            display: inline-block;
            width: 400rpx;
        }
    }
    .school-and-record {
        font-size: 24upx;
        margin: -10upx 0 14upx 0;
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
    }
    .deatil-achievement {
        margin-left: 10upx;
        font-size: 24upx;
    }

    .intro {
        font-size: 25upx;
        line-height: 44upx;
        margin-bottom: 30rpx;
    }

    .icon-grail {
        display: inline-block;
        width: 26upx;
        height: 22upx;
        margin-left: 22upx;
        margin-right: 2upx;
        vertical-align: middle;
    }
}
.fixed-panel {
    position: absolute;
    width: 146rpx;
    right: 0;
    bottom: 20rpx;
    color: #ffde98;
    font-size: 24rpx;
    text-align: center;
    z-index: 9999;

    .icon-wrap {
        //margin-right: 36rpx;
        text-align: center;
        position: relative;
        right: -30rpx;
        margin-bottom: 20rpx;
        color: #fff;

        .item {
            margin-bottom: 10rpx;
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
    margin-bottom: 30rpx;
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
</style>
