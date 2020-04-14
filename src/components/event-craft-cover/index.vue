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
        <!-- <view
            v-if="info.grade"
            class="is-excellect"
        >
            优秀
        </view> -->
        <view class="media-icon">
            <image :src="mediaIcon[info.resource_type]" />
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
    },
    data() {
        return {
            mediaIcon: {
                1: '../../static/images/chunjie/video-icon.png',
                2: '../../static/images/chunjie/img-icon.png',
            },
        };
    },
    methods: {
        optimizeImage(val) {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 335;
            const height = 225;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_${this.bgColor}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_${this.bgColor}`;
            }
            return newUrl;
        },
    },
};
</script>

<style lang="less">
.event-craft-cover {
    position: relative;

    .media-icon {
        width: 40upx;
        height: 40upx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20upx;
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

    .video {
        width: 335upx;
        height: 225upx;
        border-radius: 12rpx;
    }

    .tag {
        width: 150rpx;
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
        line-height: 36rpx;
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
