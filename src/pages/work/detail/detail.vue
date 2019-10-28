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
            :src="pageData.video.cloud_path_sd"
            controls
            @play="onPlay"
            @fullscreenchange="onFullScreenChange"
        />
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
                        {{ pageData.school_name }}{{ pageData.grade_name }}
                    </view>
                </view>
            </view>
            <view class="work-name">
                {{ pageData.resource_name }}
                <image
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
                点赞
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
                },
                (err) => {
                    console.log(err);
                },
            );

            this.getLikeStatus();
        },
        toggleLike() {
            const isLiked = this.likeStatus === 1;
            api.get('/api/common/like', {
                object_id: this.id,
                object_type: 1,
                // 1-点赞 0 取消点赞
                type: isLiked ? 0 : 1,
            }).then(
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

            share({
                desc,
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
}
</style>
