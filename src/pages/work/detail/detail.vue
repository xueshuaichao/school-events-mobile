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
                    controls
                    @play="onPlay"
                    @fullscreenchange="onFullScreenChange"
                />
            </template>
        </view>
        <view class="content">
            <view class="author">
                <view class="author-avator">
                    <image
                        class="avatar"
                        :src="
                            pageData.create_user_avatar_url ||
                                '/static/images/uc/avatar.png'
                        "
                    />
                </view>
                <view class="author-info">
                    <view class="author-name text-one-line">
                        {{ pageData.create_name }}
                    </view>
                    <view class="author-from">
                        {{
                            pageData.school_name + pageData.grade_name ||
                                "北京小学-一年级"
                        }}
                    </view>
                </view>
            </view>
            <view class="work-name">
                {{ pageData.resource_name }}
                <image
                    v-if="
                        pageData.resource_scope === 1 ||
                            pageData.resource_scope === 2
                    "
                    class="icon-grail"
                    src="/static/images/work/grail.png"
                />
            </view>
            <view class="extra">
                {{ pageData.publish_time }}
                {{ pageData.play_count }}次播放 点赞：{{
                    pageData.praise_count
                }}
            </view>
            <view class="intro">
                {{ pageData.introduce || "这是简介信息" }}
            </view>
        </view>

        <view class="fixed-bottom-bar">
            <view
                class="sect"
                @click="toggleLike"
            >
                <image
                    v-if="likeStatus === 0"
                    class="icon"
                    src="/static/images/work/like.png"
                />
                <image
                    v-if="likeStatus === 1"
                    class="icon"
                    src="/static/images/work/liked.png"
                />
                {{ likeStatus === 0 ? "点赞" : "已点赞" }}
            </view>
            <view class="sep" />
            <button
                v-if="!isH5"
                class="sect share-btn"
                open-type="share"
            >
                <image
                    class="icon"
                    src="/static/images/work/share.png"
                />分享
            </button>
        </view>

        <image
            v-if="!isH5"
            src="/static/images/work/join.png"
            class="join-game"
            @click="joinGame"
        />
    </view>
</template>

<script>
import api from '../../../common/api';
import share from '../../../common/share';
import utils from '../../../common/utils';

export default {
    data() {
        return {
            id: '',
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
            api.get('/api/works/detail', {
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
                    const isLiked = this.likeStatus === 1;
                    return api
                        .get('/api/common/like', {
                            object_id: this.id,
                            object_type: 1,
                            // 1-点赞 0 取消点赞
                            type: isLiked ? 0 : 1,
                        })
                        .then(
                            (res) => {
                                console.log(res);
                                this.likeStatus = isLiked ? 0 : 1;
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
            api.get('/api/common/getlikestatus', {
                object_type: 1,

                object_id: this.id,
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
            uni.switchTab({
                url: '/pages/tabBar/upload/upload',
            });
        },
    },
    onLoad(query) {
        this.id = utils.getParam(query, 'id');
        this.getData();

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
        height: 422rpx;
    }

    .video {
        width: 100%;
        height: 422upx;
    }

    .content {
        padding: 30upx;
        color: #666;

        .author {
            margin-bottom: 32upx;
            display: flex;

            .author-avator {
                width: 72upx;
                margin-right: 16upx;

                .avatar {
                    display: inline-block;
                    width: 72upx;
                    height: 72upx;
                    border-radius: 36upx;
                }
            }

            .author-info {
                flex: 1;
                overflow: hidden;

                .author-name {
                    color: #333;
                    font-size: 28upx;
                    margin-bottom: 10upx;
                }

                .author-from {
                    font-size: 22upx;
                }
            }
        }

        .work-name {
            font-size: 32upx;
            color: #333;
            margin-bottom: 24upx;
            font-weight: 500;
        }

        .extra {
            font-size: 22upx;
            margin-bottom: 32upx;
        }

        .intro {
            font-size: 28upx;
            line-height: 44upx;
        }

        .icon-grail {
            display: inline-block;
            width: 32upx;
            height: 32upx;
            margin-left: 32upx;
        }
    }

    .fixed-bottom-bar {
        line-height: 100upx;
        text-align: center;
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        font-size: 32upx;
        color: #679eff;
        border-top: 1upx solid #ddd;

        .sep {
            border-right: 1px solid #ddd;
        }

        .sect {
            flex: 1;
            border-radius: 0;
            background: #fff;
            color: #679eff;

            &::after {
                border: none;
            }

            .icon {
                width: 40upx;
                height: 40upx;
                margin-right: 16upx;
                position: relative;
                top: 6upx;
            }
        }

        .share-btn {
            padding-top: 10upx;
        }
    }

    .main-swiper {
        padding: 30upx;

        uni-swiper {
            height: 280upx;

            .swiper-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .banner-image {
            width: 690upx;
            height: 280upx;
        }
    }

    .join-game {
        width: 160rpx;
        height: 151rpx;
        position: fixed;
        right: 30rpx;
        bottom: 200rpx;
    }
}
</style>
