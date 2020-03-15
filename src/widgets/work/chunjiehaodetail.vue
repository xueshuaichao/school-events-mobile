<template>
    <view class="swiper-detail-box">
        <template v-if="pageData.resource_type === 2">
            <view class="main-swiper">
                <swiper
                    class="swiper"
                    :indicator-dots="false"
                    :autoplay="false"
                    :interval="5000"
                    :duration="500"
                    :circular="true"
                    loop="true"
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
                    :src="pageData.video.cloud_path_sd"
                    :autoplay="isAutoPlay"
                    :controls="true"
                    :loop="true"
                    :poster="pageData.video_img_url"
                    x5-video-player-type="h5-page"
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
            <view class="author-from">
                {{ pageData.school_name }}
            </view>
            <view class="work-name-wrap text-one-line">
                <image
                    class="avatar"
                    src="/static/images/work/file.png"
                />
                <text class="work-name text-one-line">
                    {{ pageData.resource_name }}
                </text>
            </view>
            <view class="intro text-three-line">
                {{ pageData.introduce || "暂无简介" }}
            </view>
            <view class="from">
                <text
                    v-if="pageData.recommend"
                    class="recommend text-one-line"
                >
                    单位：{{ pageData.recommend || "是简介信息这是简介信息这" }}
                </text>
                <text
                    v-if="pageData.teacher"
                    class="teacher text-one-line"
                >
                    指导老师：{{ pageData.teacher || "李四" }}
                </text>
            </view>
        </view>
        <view class="fixed-panel">
            <view class="result">
                {{ pageData.ticket }}票
            </view>
            <button
                class="btn"
                @click="toggleLike"
            >
                {{ likeStatus === 0 ? "投TA一票" : "已投票" }}
            </button>

            <button
                class="btn"
                @click="handleCanvass"
            >
                帮TA拉票
            </button>
            <button
                class="btn"
                @click="goHome"
            >
                返回首页
            </button>
        </view>
        <!-- v-if="!isH5" -->
        <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/join.png"
            class="join-game"
            @click="joinGame"
        />
    </view>
</template>

<script>
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
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],

            // #ifdef H5
            isH5: true,
            // #endif
            isAutoPlay: false,
        };
    },
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
        onPlay() {},
        onWaiting() {},
        onTimeupdate() {},
        onFullScreenChange() {},
    },
};
</script>

<style lang="less">
.swiper-detail-box {
    width: 100%;
    height: 100vh;
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
    bottom: 0;
    width: 480rpx;
    padding: 30upx;
    color: #fff;
    pointer-events: none;
    .avatar {
        display: inline-block;
        width: 24rpx;
        height: 26rpx;
        margin-right: 16upx;
    }

    .author-info {
        .author-name {
            color: #fff;
            font-size: 28upx;
            position: relative;
            top: -2rpx;
        }
        margin-bottom: 10rpx;
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
        top: -2rpx;
    }

    .extra {
        font-size: 22upx;
        margin-bottom: 32upx;
    }

    .intro {
        font-size: 28upx;
        line-height: 44upx;
        margin-bottom: 30rpx;
    }

    .icon-grail {
        display: inline-block;
        width: 32upx;
        height: 32upx;
        margin-left: 32upx;
    }
}
.fixed-panel {
    position: fixed;
    width: 146rpx;
    right: 27rpx;
    bottom: 160rpx;
    color: #ffde98;
    font-size: 24rpx;
    text-align: center;
    z-index: 100;
}

.btn {
    color: #ffde98;
    font-size: 24rpx;
    width: 134rpx;
    height: 56rpx;
    background: linear-gradient(
        90deg,
        rgba(255, 124, 53, 1),
        rgba(255, 31, 73, 1)
    );
    border-radius: 28rpx;
    line-height: 56rpx;
    text-align: center;
    margin-bottom: 30rpx;
    padding: 0;
}
.join-game {
    width: 134rpx;
    height: 140rpx;
    position: fixed;
    right: 30rpx;
    bottom: 20rpx;
    z-index: 100;
}
</style>
