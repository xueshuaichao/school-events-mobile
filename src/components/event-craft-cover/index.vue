<template>
    <view class="event-craft-cover">
        <image
            v-if="info.resource_type === 1"
            :src="optimizeImage(info.video_img_url)"
            class="video"
        />
        <image
            v-else-if="info.resource_type === 2"
            :src="optimizeImage(info.img_url)"
            class="video"
        />
        <view
            v-if="info.grade && bestIcon"
            class="is-excellect"
        >
            优秀
        </view>
        <view
            v-if="mediaIcon"
            class="media-icon"
        >
            <image :src="mediaIconArr[info.resource_type]" />
        </view>
        <view
            v-if="info.record"
            class="icon-record-warp"
        >
            <image
                class="icon-record"
                :src="`/static/images/work/icon-rank-${info.record}.png`"
            />
        </view>
        <view
            v-if="likeIcon"
            class="like-icon"
        >
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_like.png"
            /><text>{{ info.ticket || 0 }}</text>
        </view>
        <view
            v-if="info.rank"
            class="tag"
        >
            当前排名：{{ info.rank }}
        </view>
    </view>
</template>

<script>
export default {
    filters: {},
    props: {
        info: {
            type: Object,
            default() {
                return {};
            },
        },
        fr: {
            type: String,
            default: '',
        },
        bgColor: {
            type: String,
            default: 'ffffff',
        },
        bestIcon: {
            type: Boolean,
            default: false,
        },
        likeIcon: {
            type: Boolean,
            default: false,
        },
        mediaIcon: {
            type: Boolean,
            default: true,
        },
        activityId: {
            type: [Number, String],
            default: 10,
        },
    },
    data() {
        return {
            mediaIconArr: {
                1: '/static/images/work/video-icon.png',
                2: '/static/images/work/img-icon.png',
            },
        };
    },
    methods: {
        optimizeImage(val) {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = this.activityId === 12 ? 306 : 335;
            const height = this.activityId === 12 ? 205 : 225;
            const bgColor = this.bgColor.indexOf('#') !== -1
                ? this.bgColor.replace('#', '')
                : this.bgColor;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_${bgColor}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_${bgColor}`;
            }
            return newUrl;
        },
    },
};
</script>

<style lang="less">
.event-craft-cover {
    position: relative;

    .media-icon,
    .like-icon {
        height: 40upx;
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
    .media-icon {
        width: 40upx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20upx;
    }
    .like-icon {
        font-size: 24upx;
        image {
            width: 24upx;
            height: 24upx;
            margin-right: 9upx;
            vertical-align: middle;
            display: inline-block;
        }
        text {
            vertical-align: middle;
        }
    }
    .icon-record-warp {
        position: absolute;
        left: 8upx;
        top: 8upx;
        width: 40upx;
        height: 40upx;
        text-align: center;
        background: #fff;
        border-radius: 50%;
        .icon-record {
            margin-top: 6upx;
            width: 24upx;
            height: 30upx;
        }
    }

    .video {
        width: 335upx;
        height: 225upx;
        border-radius: 12rpx;
    }

    .tag {
        min-width: 150rpx;
        height: 36rpx;
        background: linear-gradient(
            270deg,
            rgba(255, 46, 63, 1),
            rgba(255, 222, 152, 1)
        );
        border-radius: 0px 18rpx 18rpx 0px;
        position: absolute;
        left: 0;
        bottom: 24rpx;
        color: #fff;
        font-size: 20rpx;
        box-sizing: border-box;
        padding-left: 10rpx;
        padding-right: 4rpx;
        line-height: 36rpx;
        padding-right: 4rpx;
    }
    .is-excellect {
        position: absolute;
        width: 66upx;
        height: 30upx;
        background: rgba(17, 102, 255, 1);
        border-radius: 0px 15upx 15upx 0px;
        border: 1px solid rgba(255, 255, 255, 0.75);
        left: 0;
        top: 8upx;
        font-size: 20upx;
        text-align: center;
        color: #fff;
    }
}
</style>
