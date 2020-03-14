<template>
    <view class="swiper-detail-box">
        <template v-if="pageData.resource_type === 2">
            <view class="main-swiper">
                <swiper
                    class="swiper"
                    :indicator-dots="false"
                    :autoplay="false"
                    :interval="5000"
                    :duration="500"
                    :circular="true"
                    loop="true"
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
                    :autoplay="isAutoPlay"
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
        <template>
            <leftContent
                v-if="pageFrom === ''"
                :page-data="pageData"
            />
            <leftContentChunjie
                v-if="pageFrom === '3'"
                :page-data="pageData"
            />
            <leftContentChunjiehao
                v-if="pageFrom === '4' || pageFrom === '5'"
                :page-data="pageData"
            />
        </template>
        <template>
            <fixedPanel
                v-if="pageFrom === '' || pageFrom === '5'"
                :page-data="pageData"
                @panelAction="panelAction"
            />
            <fixedPanelChunjie
                v-if="pageFrom === '3' || pageFrom === '4'"
                :page-from="pageFrom"
                :page-data="pageData"
                @panelAction="panelAction"
            />
        </template>
    </view>
</template>

<script>
import leftContent from './detail/left-content.vue';
import leftContentChunjie from './detail/left-content-chunjie.vue';
import leftContentChunjiehao from './detail/left-content-chunjiehao.vue';
import fixedPanel from './detail/fixed-panel.vue';
import fixedPanelChunjie from './detail/fixed-panel-chunjie.vue';
// import fixedPanelChunjiehao from './detail/fixed-panel-chunjiehao.vue';

export default {
    components: {
        leftContent,
        fixedPanel,
        leftContentChunjiehao,
        leftContentChunjie,
        fixedPanelChunjie,
        // fixedPanelChunjiehao,
    },
    filters: {
        optimizeImage: (val) => {
            let newUrl = '';
            const width = 330;
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
    props: {
        pageData: {
            type: Object,
            default: () => ({
                show: false,
            }),
        },
        likeStatus: {
            type: Number,
            default: 0,
        },
        pageFrom: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],

            // #ifdef H5
            isH5: true,
            // #endif
            isAutoPlay: false,
        };
    },
    methods: {
        panelAction(action) {
            this.$emit('doAction', action);
        },
        onPlay() {},
        onWaiting() {},
        onTimeupdate() {},
        onFullScreenChange() {},
    },
};
</script>

<style lang="less">
.swiper-detail-box {
    width: 100%;
    height: 100vh;
}
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
    overflow: hidden;
}

.video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
}

.swiper {
    width: 750rpx;
    // height: 1334rpx;
    height: 100vh;
}

.main-swiper {
    position: absolute;
    width: 100%;
    top: 0;

    uni-swiper {
        height: 100vh;

        .swiper-item {
            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .banner-image {
        width: 750rpx;
        height: 100vh;
    }
}
</style>
