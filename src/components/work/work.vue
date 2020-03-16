<template>
    <view
        class="comp-work"
        :class="{
            'mode-mini': mode === 'mini',
            'mode-single': mode === 'single'
        }"
        @click="goDetail"
    >
        <view class="thumbnail-wrap">
            <image
                class="thumbnail"
                :src="
                    info.video_img_url ||
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/pic.png'
                        | optimizeImage
                "
            />
            <view class="img-mask" />
            <view class="browse-num">
                <image
                    class="icon-view"
                    src="/static/images/widgets/work/like-outline.png"
                />
                {{ info.praise_count || 0 }}
            </view>
            <view
                v-if="info.grade"
                class="is-excellect"
            >
                优秀
            </view>
            <slot name="tag" />
        </view>
        <view class="work-info">
            <view class="work-name text-one-line">
                {{
                    info.resource_name || "爱挑战大赛-首页-1分钟单跳绳(男子组)"
                }}
            </view>

            <template v-if="mode === 'mini'">
                <view class="work-author">
                    <view class="name text-one-line">
                        <image
                            class="icon-user"
                            src="/static/images/widgets/work/user.png"
                        />
                        {{ info.create_name }}
                    </view>
                    <view class="from text-one-line">
                        {{ info.create_user_class }}
                    </view>
                </view>
            </template>

            <template v-if="mode === 'single'">
                <view
                    v-if="showClass"
                    class="text-info"
                >
                    {{ info.cat_name }}
                </view>
                <view
                    v-if="showTime"
                    class="text-info"
                >
                    {{ info.created_at }}
                </view>
                <view
                    v-if="showAchievement"
                    class="text-info"
                >
                    {{ info.achievement }}{{ info.achievement_unit }}
                </view>
            </template>
        </view>
    </view>
</template>

<script>
export default {
    filters: {
        optimizeImage: (val) => {
            let newUrl = '';
            const width = 330;
            const height = 187;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    props: {
        info: {
            type: Object,
        },
        mode: {
            type: String,
            // mini, single
            default: 'mini',
        },
        showClass: {
            type: Boolean,
            default: true,
        },
        curPosition: {
            type: Number,
            default: 0,
        },
        levelid: {
            type: Number,
            default: -1,
        },
        sort: {
            type: Number,
            default: 1,
        },
        total: {
            type: Number,
            default: 1,
        },
        keyword: {
            type: String,
            default: '',
        },
        showTime: {
            type: Boolean,
            default: true,
        },
        showAchievement: {
            type: Boolean,
            default: false,
        },
        query: {
            type: String,
            default: '',
        },
    },
    data() {
        return {};
    },
    methods: {
        goDetail() {
            if (this.info.status === 1) {
                this.info.play_count = this.info.play_count + 1;
                //
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${this.info.id}&total=${this.total}&curPosition=${this.curPosition}&sort=${this.sort}&levelid=${this.levelid}&keyword=${this.keyword}`,
                });
            }
        },
    },
};
</script>

<style lang="less">
.comp-work {
    display: inline-block;
    width: 330upx;
    height: 300upx;
    margin-right: 20upx;

    .thumbnail-wrap {
        width: 330upx;
        height: 187upx;
        margin-bottom: 24upx;
        position: relative;

        .browse-num {
            position: absolute;
            right: 16upx;
            bottom: 16upx;
            color: rgba(255, 255, 255, 0.8);
            font-size: 22upx;
            line-height: 20upx;
            .icon-view {
                display: inline-block;
                width: 20upx;
                height: 20upx;
                margin-right: 8upx;
                vertical-align: top;
            }
        }

        .thumbnail {
            width: 330upx;
            height: 187upx;
        }

        img {
            width: 100%;
            height: 100%;
        }

        .img-mask {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: -webkit-gradient(
                linear,
                left top,
                left bottom,
                from(transparent),
                color-stop(42%, rgba(0, 0, 0, 0.1)),
                to(rgba(0, 0, 0, 0.4))
            );
            background: linear-gradient(
                180deg,
                transparent,
                rgba(0, 0, 0, 0.1) 42%,
                rgba(0, 0, 0, 0.4)
            );
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

    .work-name {
        font-size: 28upx;
        color: #333;
        margin-bottom: 16upx;
    }

    .work-author {
        display: flex;
        color: #999;
        font-size: 22upx;

        .icon-user {
            display: inline-block;
            width: 28upx;
            height: 22upx;
            // background: url('/static/images/widgets/work/user.png');
            // background-size: 28upx 22upx;
            // position: relative;
            top: 4upx;
            margin-right: 10upx;
        }

        .name {
            width: 135upx;
        }

        .from {
            flex: 1;
            text-align: right;
        }
    }

    &.mode-single {
        width: 100%;
        height: auto;
        display: flex;

        .thumbnail-wrap {
            margin-right: 24upx;
            margin-bottom: 0;
        }

        .work-info {
            flex: 1;
            overflow: hidden;
        }

        .text-info {
            color: #999;
            font-size: 22upx;
            margin-top: 24upx;
        }
    }
}
</style>
