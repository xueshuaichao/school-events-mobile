<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
    >
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
                                :src="item"
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
                    id="myVideo"
                    class="video"
                    :poster="pageData.video_img_url"
                    :src="pageData.video.cloud_path_sd"
                    :controls="false"
                    @play="onPlay"
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
                {{
                    pageData.school_name + pageData.grade_name ||
                        "北京小学-一年级"
                }}
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
            >
                帮TA拉票
            </button>
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

export default {
    data() {
        return {
            // video: 'https://node.imgio.in/demo/birds.m3u8',
            video:
                'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
            isLoading: true,
            pageData: {},
            likeStatus: 0,
            isPlayed: false,

            // #ifdef H5
            isH5: true,
            // #endif

            isFullScreen: false,

            shareDesc: '',
        };
    },
    methods: {
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
                    console.log(err);
                },
            );

            this.getLikeStatus();
        },
        toggleLike() {
            api.isLogin().then(
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
                            // this.likeStatus = isLiked ? 0 : 1;
                            this.getData();
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
                this.likeStatus = res.status;
            });
        },
        onPlay() {
            if (!this.isPlayed) {
                this.pageData.play_count = this.pageData.play_count + 1;
                api.get('/api/works/playcount', {
                    id: this.id,
                });
            }

            this.isPlayed = true;
        },

        onFullScreenChange(e) {
            const isFullScreenMode = e.detail.fullScreen;
            this.isFullScreen = isFullScreenMode;
        },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        initShare() {
            const normalList = [
                '我正在参加"青少年爱挑战"，快来为我点赞',
                '勇于挑战，不服来战！',
                '我刷新记录啦，快来看！',
            ];
            const artList = [
                '我正在参加"青少年爱挑战"，快来为我点赞',
                '炫出风采，为我点赞，你也一起来参加吧',
                '我正在参加“爱挑战”才艺展示，快来围观我的精彩作品～',
                '亮出才艺，秀我风采！',
                '才艺小达人，等你来打call',
                '嗨～动动手指，为才艺小达人点个赞吧！',
                '天生有才，SHOW出精彩！快来看～',
                '精彩才艺秀出来，你不来看看吗？',
                '我怎么这么有才！快快来围观我的才艺展示～',
                '在吗？给你看看超精彩的才艺秀，小朋友都可以参加～',
            ];
            let desc;

            const scope = this.pageData.resource_scope;

            if (scope === 4) {
                desc = '教育梦想，创新起航，青少年爱挑战创新共享平台';
            } else if (scope === 3) {
                desc = artList[Math.floor(Math.random() * artList.length)];
            } else if (scope === 2 || scope === 1) {
                desc = normalList[Math.floor(Math.random() * normalList.length)];
            }

            console.log(desc);
            this.shareDesc = desc;

            share({
                desc,
            });
        },
        joinGame() {
            uni.navigateTo({
                url: '/pages/upload/festival/festival',
            });
        },
    },
    onLoad(query) {
        const { id } = query;
        this.id = id;
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
            margin-bottom: 15rpx;
        }

        .author-from {
            font-size: 24rpx;
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

    .main-swiper {
        position: absolute;
        width: 100%;
        top: 50%;
        margin-top: -210rpx;

        uni-swiper {
            height: 422upx;

            .swiper-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .banner-image {
            width: 750upx;
            height: 422upx;
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
            width: 280rpx;
            display: inline-block;
        }

        .teacher {
            display: inline-block;
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
}
</style>
