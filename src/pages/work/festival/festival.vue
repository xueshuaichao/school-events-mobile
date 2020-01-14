<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
    >
        <!-- <poster
            id="poster"
            :config="posterConfig"
            @success="onPosterSuccess"
            @fail="onPosterFail"
        >
            <button>点击生成海报</button>
        </poster> -->
        <view
            v-if="showShareMask === true"
            class="share-mask"
            @click="showShareMask = false"
        >
            <image
                class="share-pic"
                src="/static/images/work/share-guide.png"
            />
        </view>
        <view
            v-if="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view>
        <template v-if="pageData.resource_type === 2">
            <view class="main-swiper">
                <swiper
                    class="swiper"
                    :indicator-dots="true"
                    :autoplay="true"
                    :interval="5000"
                    :duration="500"
                    :circular="true"
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
                    :autoplay="false"
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
                {{ pageData.school_name + pageData.grade_name }}
            </view>
            <view class="work-name-wrap">
                <image
                    class="avatar"
                    src="/static/images/work/file.png"
                />
                <text class="work-name text-one-line">
                    {{ pageData.resource_name }}
                </text>
            </view>
            <!-- <view class="extra">
                {{ pageData.publish_time }}
                {{ pageData.play_count }}次播放 点赞：{{
                    pageData.praise_count
                }}
            </view> -->
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
                open-type="share"
                @click="canvass"
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

        <view
            v-if="isPlayed && isPaused"
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

        <!-- v-if="!isH5" -->
        <image
            src="/static/images/work/festival.png"
            class="join-game"
            @click="joinGame"
        />
    </view>
</template>

<script>
import api from '../../../common/api';
import share from '../../../common/share';
import posterConfig from './posterConfig';

export default {
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 375;
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
    data() {
        return {
            // video: 'https://node.imgio.in/demo/birds.m3u8',
            video:
                'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
            isLoading: true,
            pageData: {},
            likeStatus: 0,
            isPlayed: false,
            isPaused: false,
            isVideoWaiting: false,
            showShareMask: false,

            // #ifdef H5
            isH5: true,
            // #endif

            isFullScreen: false,

            shareDesc: '',
            fr: '',

            posterConfig,
        };
    },
    methods: {
        onPosterSuccess(e) {
            const { detail } = e;
            console.log(detail);
            // eslint-disable-next-line no-undef
            wx.previewImage({
                current: detail,
                urls: [detail],
            });
        },
        onPosterFail(e) {
            console.log(e, 'fail');
        },
        getData() {
            api.get('/api/activity/detail', {
                id: this.id,
            }).then(
                (res) => {
                    this.isLoading = false;
                    console.log(res);
                    this.pageData = res;
                    this.initShare();
                    // const videoUrl = res.video.cloud_path_sd;
                    // console.log(videoUrl);
                    uni.setNavigationBarTitle({
                        title: res.resource_name,
                    });
                },
                (err) => {
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/tabBar/index/index',
                        });
                    }, 1500);
                },
            );

            this.getLikeStatus();
        },
        toggleLike() {
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    // const isLiked = this.likeStatus === 1;
                    api.get('/api/activity/vote', {
                        id: this.id,
                        // object_type: 1,
                        // 1-点赞 0 取消点赞
                        // type: isLiked ? 0 : 1,
                    }).then(
                        () => {
                            // console.log(res);
                            this.likeStatus = 1;
                            this.pageData.ticket += 1;
                            // this.likeStatus = isLiked ? 0 : 1;
                            // this.getData();
                        },
                        (err) => {
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                        },
                    );
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
        getLikeStatus() {
            api.get('/api/activity/getuserthumb', {
                id: this.id,
            }).then((res) => {
                this.likeStatus = res.status === true ? 1 : 0;
            });
        },
        onPlay() {
            if (!this.isPlayed) {
                this.pageData.play_count = this.pageData.play_count + 1;
                api.get('/api/works/playcount', {
                    id: this.id,
                });
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
        canvass() {
            // #ifdef H5
            this.showShareMask = true;
            // #endif
        },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        initShare() {
            // const titleList = [
            //     '鼠年大吉，快来看我的拜年才艺秀！',
            //     '才艺拜年乐趣多，我来表演你来赞！',
            //     '我来给你拜新年，表演才艺送祝福！',
            //     '鼠年春节我精彩，才艺拜年望喜爱！',
            // ];
            const titleList = [
                '我正在参加“才艺拜大年”有奖征集活动，快来帮我投票吧～',
                '才艺拜大年，好礼送不停，我需要你宝贵的一票！',
            ];
            const title = titleList[Math.floor(Math.random() * titleList.length)];
            const desc = `${this.pageData.resource_name}-${this.pageData.create_name}`;

            this.shareDesc = title;

            share({
                title,
                desc,
                thumbnail: this.pageData.video_img_url,
            });
        },
        joinGame() {
            api.isLogin({
                fr: this.fr,
            }).then(() => {
                // 1未开始，2进行中，3已结束
                api.post('/api/activity/getactivitystatus', {
                    activity_id: 3,
                }).then((res) => {
                    const { status } = res;
                    if (status === 2) {
                        uni.navigateTo({
                            url: '/pages/upload/festival/festival',
                        });
                    } else if (status === 1) {
                        uni.showToast({
                            icon: 'none',
                            title: '活动未开始',
                        });
                    } else if (status === 3) {
                        uni.showToast({
                            icon: 'none',
                            title: '活动已结束',
                        });
                    }
                });
            });
        },
        goHome() {
            uni.reLaunch({
                url: '/pages/chunjie/index',
            });
        },
        togglePlayStatus() {
            this.$refs.video.play();
            this.isPaused = false;
        },
    },
    onLoad(query) {
        const { id, fr } = query;
        this.id = id || '';
        this.fr = fr || '';

        this.getData(id);
        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        // #endif
    },
    onHide() {
        // this.isPaused = true;
    },
    onShow() {},
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            // imageUrl: '/static/images/index/banner.png',
            path: `/pages/work/detail/detail?id=${this.id}`,
        };
    },
};
</script>

<style lang="less">
.page-work-detail {
    background: #000;
    height: 100vh;

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
    }

    .video {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
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

    swiper {
        width: 750rpx;
        height: 1334rpx;
    }

    .main-swiper {
        position: absolute;
        width: 100%;
        top: 0;

        uni-swiper {
            // height: 422upx;
            height: 1334rpx;

            .swiper-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .banner-image {
            width: 750rpx;
            height: 1334rpx;
        }
    }

    .join-game {
        width: 134rpx;
        height: 143rpx;
        position: fixed;
        right: 30rpx;
        bottom: 20rpx;
        z-index: 1000;
    }

    .from {
        font-size: 24rpx;

        .recommend {
            width: 260rpx;
            display: inline-block;
        }

        .teacher {
            display: inline-block;
            width: 220rpx;
        }
    }

    .fixed-panel {
        position: fixed;
        width: 146rpx;
        right: 27rpx;
        bottom: 160rpx;
        color: #fff0cc;
        font-size: 24rpx;
        text-align: center;
        z-index: 1000;
    }

    .btn {
        color: #fff0cc;
        font-size: 24rpx;
        width: 134rpx;
        height: 56rpx;
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
        border-radius: 28rpx;
        border: 2rpx solid;
        line-height: 56rpx;
        text-align: center;
        margin-bottom: 30rpx;
        padding: 0;
    }

    .share-mask {
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;

        .share-pic {
            width: 438rpx;
            height: 216rpx;
            position: absolute;
            right: 40rpx;
            top: 28rpx;
        }
    }

    /deep/ .uni-video-container {
        .uni-video-cover-duration {
            display: none;
        }
    }
}
</style>
