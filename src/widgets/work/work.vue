<template>
    <view class="panel widget-work">
        <view class="widget-work-ctx">
            <view class="index-panel-bd top">
                <text class="panel-title">
                    {{ title }}
                </text>
                <view
                    v-if="moreUrl"
                    class="link"
                    @click="openTab"
                >
                    更多
                </view>
            </view>
            <view
                v-if="!showCard"
                class="index-panel-bd"
            >
                <view
                    v-for="item in info"
                    :key="item.id"
                >
                    <view
                        v-if="item.id !== 7 || (item.id === 7 && !isH5)"
                        class="hot-act-card clearfix"
                    >
                        <view class="img-box fl-l">
                            <view class="going">
                                进行中
                            </view>
                            <image
                                class="banner"
                                :src="
                                    item.img ||
                                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/prize-banner.png'
                                        | optimizeImage
                                "
                            />
                        </view>
                        <view class="fl-r ctx">
                            <view class="title">
                                {{ item.activity_name || "" }}
                            </view>
                            <view class="time">
                                活动时间：{{ item.start_time || "" }}/{{
                                    item.end_time || ""
                                }}
                            </view>
                            <view class="clearfix">
                                <text class="fl-l num">
                                    {{ item.activity_base || 6000 }}人关注
                                </text>
                                <view
                                    class="fl-r join-game"
                                    @click="jumpRoute(item.url)"
                                >
                                    立即参加
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view
                v-if="showCard"
                class="index-panel-bd"
            >
                <view
                    v-for="item in info"
                    :key="item.id"
                    class="scroll-view-item"
                >
                    <work
                        :info="item"
                        class="item"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import work from '../../components/work/work.vue';

export default {
    components: {
        work,
    },
    filters: {
        optimizeImage: (val) => {
            let newUrl = '';
            const width = 254;
            const height = 160;
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
        title: {
            type: String,
            default: '',
        },
        moreUrl: {
            type: String,
            default: '',
        },
        info: {
            type: Array,
            default: () => [],
        },
        showCard: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            indicatorDots: false,
            autoplay: false,
            interval: 2000,
            duration: 500,
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    methods: {
        // scroll() {},
        jumpRoute(url) {
            uni.navigateTo({
                url,
            });
        },
        openTab() {
            // console.log(this.moreUrl);
            // utils.store.set('category', 2);
            if (!this.showCard) {
                uni.switchTab({
                    url: this.moreUrl,
                });
            } else {
                uni.navigateTo({
                    url: this.moreUrl,
                    success: () => {
                        // console.log('switch success');
                        // const page = getCurrentPages().pop();
                        // if (page === undefined || page === null) return;
                        // console.log(page);
                    },
                });
            }
        },
    },
};
</script>

<style lang="less">
.widget-work {
    padding-bottom: 16upx;
    background: #f6f6f6;
    .widget-work-ctx {
        background: #fff;
        padding: 0 30upx 15upx;
    }
    .index-panel-bd {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        // margin: 0 28upx;
        &.top {
            padding: 40upx 0;
        }
        .panel-title {
            font-size: 38upx;
            line-height: 40upx;
            color: #333;
        }
        .link {
            font-size: 24upx;
            color: #666;
            padding-right: 26upx;
            position: relative;
            height: 40upx;
            &::before {
                content: "";
                position: absolute;
                right: 4upx;
                top: 10upx;
                width: 14upx;
                height: 14upx;
                border-top: 1upx solid #bfbfbf;
                border-right: 1upx solid #bfbfbf;
                transform: rotate(45deg);
                box-sizing: border-box;
            }
        }

        .scroll-view-item {
            position: relative;
            z-index: 1;
            justify-content: space-between;
            width: 337upx;
            // height: 300upx;
            // margin-right: 28upx;
            margin-bottom: 16upx;
            // &:nth-child(2n) {
            //     margin-right: 0;
            // }
        }
        .hot-act-card {
            box-shadow: 0upx 4upx 28upx 0upx rgba(0, 0, 0, 0.06);
            border-radius: 4upx;
            padding: 15upx;
            // width: 100%;
            font-size: 22upx;
            margin-bottom: 16upx;
            .img-box {
                position: relative;
                .banner {
                    width: 254upx;
                    height: 160upx;
                    margin-right: 16upx;
                    border-radius: 4rpx;
                }
                .going {
                    position: absolute;
                    left: 0;
                    top: 10upx;
                    background: rgba(17, 102, 255, 1);
                    border-radius: 0px 20upx 20upx 0upx;
                    border: 1upx solid rgba(255, 255, 255, 1);
                    color: #fff;
                    z-index: 1;
                    line-height: 32upx;
                    padding: 0 10upx;
                    font-size: 20upx;
                }
            }
            .ctx {
                width: 392upx;
            }
            .title {
                font-size: 30upx;
                color: #323643;
                font-weight: 600;
                line-height: 40upx;
            }
            .time {
                color: #999;
                margin-bottom: 14upx;
                line-height: 36upx;
            }
            .num {
                color: #ff6555;
                line-height: 60upx;
            }
            .join-game {
                background: rgba(255, 101, 85, 1);
                border-radius: 35upx;
                line-height: 48upx;
                color: #fff;
                padding: 6upx 35upx;
            }
        }
    }
}
</style>
