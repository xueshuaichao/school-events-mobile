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
                v-if="info.resource_type === 1 || info.resource_type === 3"
                class="thumbnail"
                :src="
                    info.video_img_url ||
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/pic.png'
                        | optimizeImage
                "
            />
            <image
                v-if="info.resource_type === 2"
                class="thumbnail"
                :src="
                    info.img_url ||
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/pic.png'
                        | optimizeImage
                "
            />
            <view class="img-mask" />
            <template v-if="info.record">
                <view class="icon-record-warp">
                    <image
                        class="icon-record"
                        :src="
                            `/static/images/work/icon-rank-${info.record}.png`
                        "
                    />
                </view>
            </template>
            <view class="browse-num">
                <image
                    class="icon-view"
                    src="/static/images/widgets/work/like-outline.png"
                />
                {{ info.praise_count || 0 }}
            </view>
            <!-- <view
                v-if="info.grade"
                class="is-excellect"
            >
                优秀
            </view> -->
            <slot name="tag" />
        </view>
        <view class="work-info">
            <view
                class="work-name"
                :class="{
                    'text-two-line': mode === 'single',
                    'text-one-line': mode === 'mini'
                }"
            >
                {{
                    info.resource_name || "爱挑战大赛-首页-1分钟单跳绳(男子组)"
                }}
                <text
                    v-if="info.achievement && mode === 'mini'"
                    class="achievement"
                >
                    <template v-if="info.achievement_unit !== '秒'">
                        | {{ info.achievement }}{{ info.achievement_unit }}
                    </template>
                    <template v-else>
                        | {{ setInfoTime(info.achievement) }}
                    </template>
                </text>
            </view>

            <template v-if="mode === 'mini'">
                <view class="work-author">
                    <view class="name text-one-line">
                        <image
                            class="icon-user"
                            src="/static/images/widgets/work/user.png"
                        />
                        {{ info.create_name || "" }}
                    </view>
                    <view class="from text-one-line">
                        {{ info.create_user_class || "" }}
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
                    <template v-if="info.achievement_unit !== '秒'">
                        {{ info.achievement }}{{ info.achievement_unit }}
                    </template>
                    <template v-else>
                        {{ setInfoTime(info.achievement) }}
                    </template>
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
            const width = 305;
            const height = 173;
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
            default: () => {},
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
        filter: {
            type: Object,
            default: () => {},
        },
        curposition: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            default: 1,
        },
        from: {
            type: String,
            default: '',
        },
        ableSlide: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {};
    },
    methods: {
        goDetail() {
            let jump = true;
            if (this.info.status !== 1 && this.from && this.ableSlide) {
                jump = false;
            }
            if (jump) {
                this.info.play_count = this.info.play_count + 1;

                const total = this.ableSlide ? this.total : 1;
                this.$store.commit('setFilterData', {
                    filter: this.filter,
                    position: {
                        curposition: this.curposition,
                        total,
                        from: this.from,
                    },
                });
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${this.info.id}&${
                        this.query
                    }&activity_id=${this.info.activity_id || ''}`,
                });
            }
        },
        setInfoTime(time) {
            let str = '';
            let millseconds = '';
            const times = String(time).split('.');
            if (times.length === 2) {
                [, millseconds] = times;
            }
            if (time < 59) {
                str = `${times[0]}秒${millseconds}`;
            } else {
                const minutes = Math.floor(times[0] / 60);
                str = `${minutes}分${times[0] - minutes * 60}秒${millseconds}`;
            }
            return str;
        },
    },
};
</script>

<style lang="less">
.comp-work {
    display: inline-block;
    width: 337upx;
    height: 294upx;
    box-sizing: border-box;
    &.mode-mini {
        padding: 16upx;
        box-shadow: 0upx 4upx 28upx 0upx rgba(0, 0, 0, 0.1);
        border-radius: 4upx;
    }

    .thumbnail-wrap {
        width: 305upx;
        height: 187upx;
        margin-bottom: 8upx;
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
            width: 100%;
            height: 100%;
            border-radius: 4upx;
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
            border-radius: 4upx;
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

        // .is-excellect {
        //     position: absolute;
        //     width: 66upx;
        //     height: 30upx;
        //     background: rgba(17, 102, 255, 1);
        //     border-radius: 0px 15upx 15upx 0px;
        //     border: 1px solid rgba(255, 255, 255, 0.75);
        //     left: 0;
        //     top: 8upx;
        //     font-size: 20upx;
        //     text-align: center;
        //     color: #fff;
        // }
    }

    .work-name {
        font-size: 26upx;
        color: #333;
        margin-bottom: 4upx;
        font-weight: 600;
        line-height: 34upx;
        .achievement {
            margin-left: 8upx;
        }
    }

    .work-author {
        display: flex;
        color: #999;
        font-size: 22upx;
        line-height: 30upx;

        .icon-user {
            display: inline-block;
            width: 21upx;
            height: 21upx;
            // background: url('/static/images/widgets/work/user.png');
            // background-size: 28upx 22upx;
            // position: relative;
            top: 2upx;
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
        box-shadow: 0 2upx 20upx 0 rgba(194, 216, 255, 1) inset;
        border-radius: 10upx;
        padding: 24rpx;
        border: 1px solid rgba(17, 102, 255, 0.18);
        box-sizing: border-box;

        .thumbnail-wrap {
            margin-right: 24upx;
            margin-bottom: 0;
            width: 300upx;
            height: 200upx;
        }

        .work-info {
            flex: 1;
            overflow: hidden;
        }

        .text-info {
            color: #999;
            font-size: 22upx;
            margin-top: 14upx;
        }
        .work-name {
            font-size: 28upx;
            font-weight: 500;
            line-height: 34upx;
        }
    }
}
</style>
