<template>
    <view class="swiper-detail-box">
        <view
            v-show="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view>
        <template v-if="pageData.resource_type === 2">
            <view class="main-swiper">
                <swiper
                    class="swiper"
                    :indicator-dots="false"
                    :autoplay="false"
                    :interval="5000"
                    :duration="500"
                    :circular="true"
                    :loop="false"
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
                    :id="`detail${swiperPage}`"
                    ref="video"
                    class="video"
                    preload
                    :src="pageData.video.cloud_path_sd"
                    :autoplay="false"
                    :controls="true"
                    :loop="true"
                    :poster="pageData.video_img_url"
                    x5-video-player-type="h5-page"
                    @pause="onPause"
                    @play="onPlay"
                    @waiting="onWaiting"
                    @timeupdate="onTimeupdate"
                    @fullscreenchange="onFullScreenChange"
                />
            </template>
        </view>
        <view
            v-if="pageData.resource_type === 3 && pageData.title"
            class="audio-detail"
        >
            <view class="record-page-init">
                <view class="title">
                    {{ pageData.title }}
                </view>
                <view class="dynasty">
                    {{ pageData.dynasty }}
                    <template v-if="pageData.author">
                        /
                    </template>
                    {{ pageData.author }}
                </view>
                <scroll-view
                    :scroll-y="scrollY"
                    :style="{ height: scrollH + 'px' }"
                    class="scroll-Y"
                >
                    <view class="content-poetry">
                        <view
                            v-for="(txt, index) in pageData.content"
                            :key="index"
                            :class="{ left: pageData.display_type === 1 }"
                        >
                            {{ txt }}
                        </view>
                    </view>
                </scroll-view>
                <!-- <view
                    class="more-content"
                    @click="checkMore"
                >
                    上滑查看更多
                </view> -->
                <view class="zhusi">
                    <view
                        v-for="(txt, index) in pageData.annotate"
                        :key="index"
                    >
                        <template v-if="!index">
                            注释：
                        </template>
                        {{ txt }}
                    </view>
                </view>
            </view>
            <view class="cover">
                <image
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-${bgIndex}.png`
                    "
                />
            </view>
            <view class="page-btm" />
        </view>
        <view
            v-if="pageData.resource_type === 3"
            class="content2"
        >
            <view class="poetry-info">
                <view
                    class="poetry-create text-one-line"
                    @click="jumpUc"
                >
                    @{{ pageData.create_name }}
                </view>
                <view class="poetry-name text-two-line">
                    {{ pageData.resource_name }}
                </view>
                <view
                    class="cat-name"
                    :class="{ cur: pageData.cat_name }"
                    @click="jumpLabelList"
                >
                    {{ pageData.cat_name ? `#${pageData.cat_name}#` : "" }}
                </view>
            </view>
            <view class="controller">
                <!--<image
                    class=""
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-play.png"
                />-->
                <image
                    class="play-btn"
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-${
                            playStatus ? 'pause' : 'play'
                        }.png`
                    "
                    @click="clickCenter"
                />
                <!--<view class="play-time">
                    00:00
                </view>
                <view class="bar-wrap">
                    <view class="bar-way" />
                </view>
                <view class="play-time">
                    00:00
                </view>-->
                <view class="control">
                    <!-- <view class="walk-way">
                        <view
                            class="wark-bar"
                            :style="{ width: barWidth + 'px' }"
                        />
                    </view> -->
                    <!--:style="{ left: (slideValue / maxVal) * 100 + '%' }"-->
                    <!-- <image
                        class="btn"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/btn-dot.png"
                        :style="{ left: btnLeft + 'px' }"
                    /> -->
                    <slider
                        :value="slideValue"
                        min="0"
                        :max="maxVal"
                        active-color="#B5FFF5"
                        background-color="#277d73"
                        block-color="#54afa9"
                        block-size="20"
                        class="unseable-slider"
                        @change="sliderChange"
                        @changing="sliderChangeing"
                    />
                </view>
                <view class="time">
                    {{ currentSecond | secondsToText }}/{{
                        recordDuration | secondsToText
                    }}
                </view>
            </view>
        </view>
        <view
            v-if="pageData.resource_type < 3"
            class="content"
        >
            <view
                class="author-name text-one-line"
                @click="jumpUc"
            >
                @{{ pageData.create_name }}
            </view>
            <view
                v-if="pageData.school_name && pageData.resource_type < 3"
                class="school-and-record"
            >
                <text>{{ pageData.school_name }}</text>
            </view>
            <view v-if="pageData.record">
                <image
                    class="icon-grail"
                    :src="
                        `/static/images/work/icon-rank-${pageData.record}.png`
                    "
                />
                <text class="yellow">
                    {{ recordTxts[pageData.record - 1] }}
                </text>
                <text
                    v-if="pageData.group_type"
                    class="yellow"
                >
                    （组别:{{ groupTxts[pageData.group_type - 1] }}）
                </text>
            </view>
            <view class="work-name-wrap">
                <text class="work-name">
                    {{ pageData.resource_name }}
                </text>
                <text
                    v-if="pageData.achievement"
                    class="detail-achievement"
                >
                    成绩:
                    <template v-if="pageData.achievement_unit !== '秒'">
                        {{ pageData.achievement
                        }}{{ pageData.achievement_unit }}
                    </template>
                    <template v-else>
                        {{ setInfoTime(pageData.achievement) }}
                    </template>
                </text>
            </view>
            <view class="intro">
                <text>
                    {{
                        !showMore && introduce && introduce.length > 50
                            ? `${introduce.slice(0, 50)}...`
                            : introduce
                    }}
                </text>
                <text
                    v-if="!showMore && introduce.length > 50"
                    class="to-hide-open"
                    @click="changeClick"
                >
                    <text class="txt">
                        展开
                    </text>
                </text>
                <view
                    v-if="showMore && introduce.length > 50"
                    class="to-hide-open"
                    @click="changeClick"
                >
                    <text class="txt">
                        收起
                    </text>
                </view>
            </view>
            <view
                class="cat-name"
                :class="{ cur: pageData.cat_name }"
                @click="jumpLabelList"
            >
                {{ pageData.cat_name ? `#${pageData.cat_name}#` : "" }}
            </view>
        </view>
        <view class="fixed-panel">
            <view class="icon-wrap">
                <view
                    class="item"
                    @click="joinGame"
                >
                    <image
                        class="icon join"
                        src="/static/images/work/detail-join.png"
                    />
                </view>
                <view
                    class="item"
                    @click="jumpUc"
                >
                    <image
                        class="icon avator"
                        :src="
                            pageData.create_user_avatar_url ||
                                '/static/images/uc/avatar.png'
                        "
                    />
                </view>
                <view
                    class="item"
                    @click="toggleLike"
                >
                    <image
                        class="icon"
                        :status="likeStatus"
                        :src="
                            likeStatus === 0
                                ? '/static/images/yiqing/detail/like.png'
                                : '/static/images/yiqing/detail/like-ac.png'
                        "
                    />
                    <view> {{ praise_count || 0 }} </view>
                </view>
                <view
                    class="item"
                    @click.stop="showMessage"
                >
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/message.png"
                    />
                    <view>{{ commentTotal }}</view>
                </view>
                <view
                    v-if="isWechat || isApp || !isH5"
                    class="item"
                    @click="handleCanvass"
                >
                    <image
                        class="icon"
                        src="/static/images/yiqing/detail/share.png"
                    />
                </view>
                <view
                    v-if="activityId"
                    class="item primary"
                    @click="watchIndex"
                >
                    返回首页
                </view>
            </view>
        </view>
        <view
            v-if="isPaused && pageData.resource_type === 1"
            class="pause-cover"
        >
            <view
                class="uni-video-cover"
                @click="togglePlayStatus"
            >
                <div class="uni-video-cover-play-button" />
            </view>
        </view>
        <view
            v-if="isVideoWaiting && pageData.resource_type === 1"
            class="uni-video-cover"
            style="pointer-events: none;color: #fff"
        >
            加载中
        </view>
    </view>
</template>

<script>
import api from '../../common/api';

const innerAudioContext = uni.createInnerAudioContext();
const innerAudioContextBg = uni.createInnerAudioContext();

// innerAudioContext.autoplay = true;
innerAudioContext.volume = 1;
innerAudioContextBg.volume = 0.6;

const padTime = function (val) {
    const str = `${val}`;
    return str.length === 1 ? `0${str}` : str;
};

export default {
    filters: {
        optimizeImage: (val) => {
            let newUrl = '';
            let width = 330;
            let height = 667;
            try {
                const res = uni.getSystemInfoSync();
                width = res.windowWidth;
                height = res.windowHeight;
            } catch (e) {
                // error
            }

            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            }
            return newUrl;
        },
        secondsToText(secs) {
            if (typeof secs === 'string') {
                return secs;
            }
            // secs = Number(secs);
            const minutesDiv = (secs % 3600) / 60;
            let minutes = Math.floor(minutesDiv);
            let seconds = Math.ceil((secs % 3600) % 60);
            if (seconds > 59) {
                seconds = 0;
                minutes = Math.ceil(minutesDiv);
            }
            if (minutes > 59) {
                minutes = 0;
            }
            const toDouble = function (val) {
                if (val >= 0 && val.toString().length < 2) {
                    return `0${val}`;
                }
                return `${val}`;
            };
            return `${toDouble(minutes)}:${toDouble(seconds)}`;
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
        activityId: {
            type: Number,
            default: 0,
        },
        isFromShare: {
            type: String,
            default: '1',
        },
        from: {
            type: String,
            default: '',
        },
        showDrawer: {
            type: Boolean,
            default: false,
        },
        isChangeSlide: {
            type: Number,
            default: 1,
        },
        swiperPage: {
            type: Number,
            default: 1,
        },
        commentTotal: {
            type: Number,
            default: 0,
        },
        isChangeStatusLike: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isFullScreen: false,
            recordTxts: ['校级记录', '市级记录', '省级记录'],
            groupTxts: ['1-3年级', '4-6年级', '7-9年级', '高一-高三'],
            // #ifdef H5
            isH5: true,
            isWechat: false,
            isApp: false,
            // #endif
            canAutoPlay: false,
            isPaused: false,
            isVideoWaiting: false,
            // play_count: 1,
            showMore: false,
            introduce: this.pageData.introduce || '',
            total: 10,
            catName: this.pageData.cat_name,
            praise_count: this.pageData.praise_count || 0,
            toggleLikeObj: {},
            togglePlatCounts: {},
            bgIndex: 0,
            scrollH: 300,
            scrollY: true,
            playStatus: 0,
            recordDuration: 600,
            allowSetCurrentTime: true,
            setTimeoutId3: 0,
            slideValue: 0,
            maxVal: 600,
            maxTime: 10 * 60,
            curTime: 200,
            currentSecond: 0,
        };
    },
    watch: {
        isChangeSlide(val) {
            if (val !== this.swiperPage && this.pageData.resource_type === 1) {
                if (this.isH5) {
                    // h5的暂停方式需要专门处理。
                    const b = document.querySelector(
                        `#detail${this.swiperPage} video`,
                    );
                    if (b) {
                        b.pause();
                        this.isPaused = true;
                    }
                    this.togglePlatCounts[this.pageData.id] = 0;
                } else {
                    this.videoContext.pause();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 1) {
                // 当前作品

                if (this.isH5) {
                    const b = document.querySelector(
                        `#detail${this.swiperPage} video`,
                    );
                    if (b) {
                        b.pause();
                        this.isPaused = true;
                    }
                } else {
                    this.videoContext.seek(0);
                    this.videoContext.play();
                    this.setPlayCount();
                }
            }
            if (val === this.swiperPage && this.pageData.resource_type === 2) {
                this.setPlayCount();
            }
        },
        isChangeStatusLike() {
            if (
                this.swiperPage === this.isChangeSlide
                && !this.toggleLikeObj[this.pageData.id]
                && this.likeStatus
            ) {
                this.toggleLikeObj[this.pageData.id] = true;
                this.praise_count += 1;
            }
        },
        pageData(val) {
            if (val) {
                this.praise_count = this.pageData.praise_count || 0;
                this.introduce = this.pageData.introduce || '';
                this.catName = this.pageData.cat_name || '';
                innerAudioContext.src = this.pageData.audio_url; // 录音音频
                innerAudioContextBg.src = val.bg_url; // 背景音乐

                this.recordDuration = innerAudioContext.duration;
                // innerAudioContext.onCanplay(()=>{

                // })
                // console.log(111112323232, innerAudioContext.duration)
                console.log(val, val.poem, 'change');
            }
        },
    },
    created() {},
    mounted() {
        this.videoContext = uni.createVideoContext(
            `detail${this.swiperPage}`,
            this,
        );
        if (
            !this.isH5
            && this.swiperPage === 1
            && this.pageData.resource_type === 1
        ) {
            this.videoContext.play();
            this.setPlayCount();
            console.log('mounted--play-----');
        }
        if (this.swiperPage === 1 && this.pageData.resource_type === 2) {
            this.setPlayCount();
        }
        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        const ua = window.navigator.userAgent.toLowerCase();
        this.isWechat = ua.indexOf('micromessenger') !== -1;
        this.isApp = ua.toLowerCase().indexOf('wd-atz-ios') !== -1
            || ua.toLowerCase().indexOf('wd-atz-android') !== -1;
        // #endif
    },
    methods: {
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        setPlayCount() {
            api.post('/api/works/playcount', {
                id: this.pageData.id,
            });
        },
        handleCanvass() {
            this.$emit('doAction', 'handleCanvass');
        },
        toggleLike() {
            this.$emit('doAction', 'toggleLike');
        },
        joinGame() {
            this.$emit('doAction', 'joinGame');
        },
        showMessage() {
            this.$emit('doAction', 'showMessage');
        },
        onPause() {
            this.isPaused = true;
        },
        togglePlayStatus() {
            this.isPaused = false;
            this.videoContext.play();
        },
        onPlay() {
            if (!this.togglePlatCounts[this.pageData.id] && this.isH5) {
                this.togglePlatCounts[this.pageData.id] = 1;
                this.setPlayCount();
            }
            this.isVideoWaiting = false;
        },
        onWaiting() {
            this.isVideoWaiting = true;
            this.timeupdateCounter = 0;
        },
        onTimeupdate() {
            if (this.timeupdateCounter > 1) {
                this.isVideoWaiting = false;
            } else {
                this.timeupdateCounter += 1;
            }
        },
        onFullScreenChange(e) {
            const isFullScreenMode = e.detail.fullScreen;
            this.isFullScreen = isFullScreenMode;
        },
        changeClick() {
            this.showMore = !this.showMore;
        },
        watchIndex() {
            let url = `/activity/pages/index?activity_id=${this.activityId}`;
            if (this.activityId === 6) {
                url = '/history/read/index';
            }
            if (this.activityId === 9) {
                url = '/activity/pages/children/index';
            }
            if (this.from === 'openGame') {
                url = '/pages/openGame/index';
            }
            if (this.activityId === 3) {
                url = '/history/chunjie/index';
            }
            if (this.activityId === 4) {
                url = '/history/chunjiehao/index';
            }
            if (this.activityId === 5) {
                url = '/history/yiqing/index';
            }
            uni.navigateTo({
                url,
            });
        },
        jumpLabelList() {
            // 标签列表
            const {
                resource_scope: resourceScope,
                cat_id: catId,
                cat_name: catName,
            } = this.pageData;
            const url = `/pages/work/label/list?cat_id=${resourceScope},${catId}&cat_name=${catName}`;
            uni.navigateTo({
                url,
            });
        },
        jumpUc() {
            api.isLogin().then(() => {
                if (this.activityId && this.activityId > 9) {
                    api.get('/api/activity/activitystatus', {
                        activity_id: this.activityId,
                    }).then((data) => {
                        if (data.status === 2) {
                            this.jumpUcUrl('going');
                        } else {
                            this.jumpUcUrl();
                        }
                    });
                } else {
                    this.jumpUcUrl();
                }
            });
        },
        jumpUcUrl(going) {
            if (going && this.activityId === 10) {
                uni.navigateTo({
                    url: `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.pageData.create_by}`,
                });
            } else if (going && this.activityId === 12) {
                uni.navigateTo({
                    url: `/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.pageData.create_by}`,
                });
            } else if (going && this.activityId === 14) {
                uni.navigateTo({
                    url: `/activity/pages/poetry/ucenter?activity_id=14&user_id=${this.pageData.create_by}`,
                });
            } else {
                uni.navigateTo({
                    url: `/pages/uc/uc/index?uid=${this.pageData.create_by}`,
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
        percentToTime(p) {
            const seconds = this.maxTime * p;
            const minutes = seconds ? padTime(Math.floor(seconds / 60)) : '00';
            const second = seconds ? padTime(Math.round(seconds % 60)) : '00';
            this.currentSecond = `${minutes}:${second}`;
        },
        sliderChange(e) {
            // e.detail.value-秒数
            console.log(e.detail, this.slideValue, 'stoped');
            this.percentToTime(
                this.slideValue ? this.slideValue / this.maxVal : 0,
            );
            this.slideValue = e.detail.value;
            // let w = (this.slideValue * this.controllWidth) / 100;
            // this.barWidth = w;
            // this.btnLeft = w;
        },
        sliderChangeing(e) {
            this.slideValue = e.detail.value;
            // let w = (this.slideValue * this.controllWidth) / 100;
            // this.barWidth = w;
            // this.btnLeft = w;
        },
        // 音频播放
        palyAll() {
            innerAudioContext.play();
            innerAudioContextBg.play();
            // if (this.allowSetCurrentTime) {
            //     // 1秒只能重置一次currentTime（兼容iOS：iOS设置了currentTime之后可能会回溯前一段时间开始播放）
            //     innerAudioContextBg.currentTime = this.currentSecond;
            //     this.allowSetCurrentTime = false;
            //     setTimeout(() => {
            //         this.allowSetCurrentTime = true;
            //     }, 1000);
            //     console.log(innerAudioContextBg.currentTime);
            // }
        },
        // 音频暂停
        pauseAll() {
            console.log('pauseing');
            innerAudioContext.pause();
            innerAudioContextBg.pause();
        },
        stopAll() {
            innerAudioContext.stop();
            innerAudioContextBg.stop();
        },
        clickCenter() {
            // 没有播放的状态。使用同一个图标，显示不同的文本。
            // unPlayStatus ：-2 从未播放 -1 已经结束播放  0 暂停播放
            if (this.playStatus) {
                // 正在播放着，则暂停播放，根据状态显示重听
                this.playStatus = 0;
                if (this.unPlayStatus === -2) {
                    this.centerTxt = '试听';
                } else if (this.unPlayStatus === -1) {
                    this.centerTxt = '重听';
                } else {
                    this.centerTxt = '继续';
                }
                this.pauseAll();
            } else {
                // 已经暂停，则继续播放。
                this.playStatus = 1;
                this.unPlayStatus = 0; // 手动暂停的是0
                this.palyAll();
                setTimeout(() => {
                    innerAudioContext.onTimeUpdate(() => {
                        this.currentSecond = innerAudioContext.currentTime;
                        this.recordDuration = innerAudioContext.duration;
                        this.maxVal = innerAudioContext.duration;
                        // console.log(111,innerAudioContext.duration); // 总时长
                        // console.log(111,innerAudioContext.currentTime); // 当前播放进度
                        innerAudioContextBg.currentTime = this.currentSecond;
                    });
                }, 500);
            }
        },
    },
};
</script>

<style lang="less">
.swiper-detail-box {
    width: 100%;
    height: 100%;
    position: relative;
}
.yellow {
    color: #ffd339;
    text-shadow: 0 1upx 2upx #ff9b35;
    font-size: 24upx;
    line-height: 30upx;
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
    height: 100%;
}

.main-swiper {
    position: absolute;
    width: 100%;
    top: 0;
    height: 100vh;

    uni-swiper {
        height: 100%;
    }
    .swiper-item {
        height: 100%;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .banner-image {
        width: 750rpx;
        height: 100%;
    }
}
.content {
    position: absolute;
    bottom: 80upx;
    width: 480upx;
    padding: 30upx 30upx 0;
    color: #fff;
    left: 0;
    // pointer-events: none;
    z-index: 10;
    text-shadow: 0 2upx 3upx rgba(0, 0, 0, 0.35);

    .author-name {
        color: #fff;
        font-size: 34upx;
        position: relative;
        line-height: 34upx;
        display: inline-block;
        width: 400rpx;
        font-weight: 600;
    }
    .school-and-record {
        font-size: 26upx;
        margin: 6upx 0 20upx 0;
    }
    .work-name-wrap {
        width: 90%;
        margin-top: 16upx;
    }
    .work-name {
        font-size: 34upx;
        color: #fff;
        font-weight: 600;
        margin-right: 10upx;
        line-height: 40rpx;
    }
    .detail-achievement {
        font-size: 24upx;
        color: #ffd339;
        text-shadow: 0 1upx 2upx #ffd339;
        position: relative;
        bottom: 4upx;
    }

    .intro {
        font-size: 26upx;
        line-height: 35upx;
        position: relative;
        margin-top: 12upx;
        word-break: break-all;
    }
    .cat-name {
        font-size: 24upx;
        color: #fff;
        margin-top: 22upx;
        line-height: 42upx;
        display: inline-block;
        padding: 4upx 16upx;
        border-radius: 8upx;
        &.cur {
            background: rgba(119, 119, 119, 0.4);
        }
    }
    .to-hide-open {
        text-align: right;
        .txt {
            width: 72rpx;
            text-align: center;
            background: rgba(119, 119, 119, 0.4);
            padding: 4rpx 0;
            color: rgba(255, 255, 255, 0.5);
            display: inline-block;
            border-radius: 4rpx;
        }
    }
    .icon-grail {
        display: inline-block;
        width: 24upx;
        height: 30upx;
        margin-right: 4upx;
        vertical-align: middle;
        margin-top: 4upx;
    }
}
.fixed-panel {
    position: absolute;
    // width: 146rpx;
    right: 0;
    bottom: 80rpx;
    color: #ffde98;
    font-size: 26rpx;
    text-align: center;
    z-index: 10;
    min-width: 100upx;
    text-shadow: 0 2upx 3upx rgba(0, 0, 0, 0.35);

    .icon-wrap {
        //margin-right: 36rpx;
        text-align: center;
        position: relative;
        // right: -30rpx;
        margin-bottom: 20rpx;
        color: #fff;

        .item {
            margin-bottom: 32rpx;
            margin-left: 50rpx;
            // min-width: 120rpx;
            letter-spacing: 2upx;
        }
    }

    .icon {
        width: 80rpx;
        height: 80rpx;
        &.join {
            width: 112rpx;
            height: 108rpx;
        }
        &.avator {
            width: 86rpx;
            height: 86rpx;
            border-radius: 66rpx;
            box-shadow: 0 4upx 4upx 0 rgba(0, 0, 0, 0.28);
        }
    }
    .primary {
        color: #fff;
        font-size: 26rpx;
        text-align: center;
        line-height: 36rpx;
        background: #1166ff;
        width: 104rpx;
        height: 104rpx;
        border-radius: 56rpx;
        padding: 16rpx 16rpx 0;
        box-sizing: border-box;
    }
}
.uni-video-cover {
    position: absolute;
}
/deep/ .uni-video-container {
    .uni-video-cover-duration {
        display: none;
    }
}
.audio-detail {
    background: linear-gradient(#fefdf9, #c3efe4);
    height: 100%;
    .cover {
        position: fixed;
        bottom: 130upx;
        left: 0;
        width: 750upx;
        height: 598upx;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .page-btm {
        width: 100%;
        height: 248upx;
        position: fixed;
        bottom: 0;
        left: 0;
        background: url(../../static/images/work/audio-detail-btm2.png);
        background-size: cover;
    }
    .record-page-init {
        position: relative;
        z-index: 1;
        padding-top: 110upx;
        .title {
            font-size: 40upx;
            line-height: 56upx;
            color: #222;
            text-align: center;
        }
        .dynasty {
            font-size: 32upx;
            line-height: 56upx;
            color: #888;
            text-align: center;
        }
        .scroll-Y {
            .content-poetry {
                word-break: break-all;
                font-size: 32upx;
                line-height: 44upx;
                text-align: center;
                padding: 16upx 116upx 0;
                color: #444;
                .left {
                    text-align: left;
                    text-indent: 20upx;
                }
            }
        }

        .more-content {
            text-align: center;
            padding: 20upx;
            color: #cda972;
            font-size: 20upx;
        }
        .zhusi {
            color: #43a294;
            font-size: 24upx;
            line-height: 34upx;
            padding: 0 144upx 0 54upx;
        }
    }
}
.content2 {
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 20upx;
    .poetry-info {
        margin-left: 68upx;
        width: 300upx;
        color: #fff;
        font-size: 24upx;
        line-height: 34upx;
        .poetry-create {
            font-size: 24upx;
            line-height: 34upx;
            font-weight: 500;
        }
        .poetry-name {
            height: 68upx;
        }
        .cat-name {
            padding: 0 26upx;
            border-radius: 34upx;
            background: rgba(0, 65, 55, 0.3);
            display: inline-block;
        }
    }
    .controller {
        height: 30upx;
        display: flex;
        padding: 0 26upx 0 16upx;
        margin-top: 38upx;
        font-size: 20upx;
        color: #266158;
        justify-content: space-between;
        .play-btn {
            width: 60upx;
            height: 60upx;
            position: relative;
            bottom: 15upx;
        }
        .bar-wrap {
            padding-top: 6upx;
            .bar-way {
                width: 540upx;
                height: 20upx;
                background: linear-gradient(
                    180deg,
                    rgba(0, 65, 55, 0.3) 0%,
                    rgba(0, 65, 55, 0.08) 100%
                );
                border-radius: 10px;
            }
        }
        .control {
            margin: 0 0 0 10upx;
            width: 688upx;
            height: 68upx;
            border-radius: 48upx;
            position: relative;
            top: -20upx;
            .uni-slider {
                margin: 0 10upx;
            }
            .btn {
                width: 68upx;
                height: 68upx;
                position: absolute;
                top: 0;
                left: 0;
            }
            .walk-way {
                width: 624upx;
                height: 8upx;
                position: absolute;
                top: 30upx;
                left: 30upx;
                right: 30upx;
                background: #43a294;
                box-shadow: 0 2upx 6upx 0 rgba(0, 0, 0, 0.4) inset;
                border-radius: 8upx;
                .wark-bar {
                    position: absolute;
                    left: 0;
                    width: 0;
                    height: 100%;
                    top: 0;
                    background: #b5fff5;
                    box-shadow: 0 2upx 6upx 0 rgba(0, 0, 0, 0.5) inset;
                    border-radius: 8upx;
                }
            }
        }
    }
}
</style>
