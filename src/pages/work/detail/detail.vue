<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
    >
        <video
            id="myVideo"
            class="video"
            :src="pageData.video.cloud_path_sd"
            controls
        />
        <view class="content">
            <view class="author">
                <view class="author-avator">
                    <image
                        class="avatar"
                        :src="pageData.create_user_avatar_url"
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
            <view class="sect">
                <image
                    class="icon"
                    src="/static/images/work/share.png"
                />分享
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            // video: 'https://node.imgio.in/demo/birds.m3u8',
            video:
                'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
            isLoading: true,
            pageData: {},
            likeStatus: 0,
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
            }).then((res) => {
                console.log(res);
                this.likeStatus = isLiked ? 0 : 1;
                this.getData();
            });
        },
        getLikeStatus() {
            api.get('/api/common/getlikestatus', {
                object_type: 1,
                object_id: this.id,
            }).then((res) => {
                console.log(res);
                this.likeStatus = res.status;
            });
        },
    },
    onLoad(query) {
        const { id } = query;
        this.id = id;
        this.getData(id);
    },
};
</script>

<style lang="less">
.page-work-detail {
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

            .icon {
                width: 40upx;
                height: 40upx;
                margin-right: 16upx;
                position: relative;
                top: 6upx;
            }
        }
    }
}
</style>
