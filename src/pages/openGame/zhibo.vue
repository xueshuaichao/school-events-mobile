<template>
    <view
        class="main"
        :class="{ 'h5-main': isH5 }"
    >
        <view
            v-if="showKeybord"
            class="marker"
            :style="{ height: markerheight + 'px' }"
        />

        <view class="page-top">
            <image
                class="logo"
                src="/static/images/uc/avatar.png"
            />
            <view>
                <view class="school">
                    {{ pageDetail.live_name }}
                </view>
                <view class="time">
                    直播时间： {{ pageDetail.start_time }}
                    {{ pageDetail.end_time }}
                </view>
            </view>
        </view>
        <cover-view
            v-if="isFullScreen"
            class="mp-weixin-full-screen-title"
        >
            {{ pageDetail.live_name }}
        </cover-view>
        <video
            class="video"
            :src="pageDetail.live_uri"
            @error="error"
            @fullscreenchange="onFullScreenChange"
        />
        <view class="title">
            精彩评论
        </view>
        <scroll-view
            scroll-y
            :style="{
                height: scrollHeight + 'px'
            }"
            class="page-comment"
            @scrolltoupper="toUper"
            @scrolltolower="toLower"
        >
            <template v-for="item in commentList">
                <view
                    :key="item.id"
                    class="comment-item"
                >
                    <view class="avatar">
                        <image
                            :src="
                                item.user_info.avatar_url ||
                                    '/static/images/uc/avatar.png'
                            "
                        />
                    </view>
                    <view class="main-text">
                        <view class="content-info">
                            <view class="name">
                                {{ item.user_info.name }}
                            </view>
                            <view class="time">
                                {{ item.created_at }}
                            </view>
                        </view>
                        <view class="content">
                            {{ item.content }}
                        </view>
                    </view>
                </view>
            </template>
            <view
                v-if="loading && !commentList.length"
                class="no-comment"
            >
                暂无评论，快来抢沙发吧！
            </view>
        </scroll-view>
        <view
            class="input-wrap"
            :class="{ absolute: showKeybord }"
            :style="{ bottom: inputBtm + 'px' }"
        >
            <template v-if="showKeybord">
                <image
                    src="/static/images/work/write.png"
                    class="write-icon"
                />
            </template>
            <input
                v-model="changeVal"
                placeholder-class="placeholderStyle"
                type="text"
                placeholder="快来留下评论吧"
                maxlength="80"
                :adjust-position="false"
                @blur="blur"
                @focus="onFoucs"
                @confirm="bindconfirm"
            >
            <view
                v-if="showKeybord"
                class="fabu"
                :class="{ disable: !changeVal }"
                @click="bindconfirm"
            >
                发布
            </view>
            <template v-if="!showKeybord">
                <image
                    class="like-img"
                    :src="
                        pageDetail.is_like === 0
                            ? '/static/images/yiqing/detail/like.png'
                            : '/static/images/yiqing/detail/like-ac.png'
                    "
                    @click="clickLike"
                />
                <view class="num">
                    {{ pageDetail.like_num }}
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    data() {
        return {
            url:
                'http://vodplay.wdyedu.com/e999836814aa41f69ed121a5bed0a0a9/f98c33c72f7a428ab5d6175eabf4cc13-a34205b3f14bc615785cd8abc2ee3c2c-sd.mp4',
            changeVal: '',
            showKeybord: false,
            id: 0,
            pageDetail: {
                id: 0,
                live_name: '',
                img: '',
                start_time: 120012012,
                end_time: 21092810820,
                live_uri: '',
                status: 1,
                is_like: 0,
            },
            filter: {
                page_size: 10,
                page_num: 1,
                topic_id: 0,
                topic_type: 6,
                to_comment_id: 0,
                last_id: 0,
            },
            // #ifdef H5
            isH5: true,
            // #endif
            hasLogin: false,
            commentList: [],
            scrollHeight: 200,
            markerheight: 0,
            hasKeybordEnterUp: false,
            screenHeight: 500,
            pix: 1,
            inputBtm: 0,
            loading: false,
            kbHeight: 0,
            isFullScreen: false,
        };
    },
    watch: {
        showKeybord(val) {
            if (!val) {
                this.inputBtm = 0;
                this.showKeybord = false;
            }
        },
    },
    mounted() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                const pix = res.screenWidth / 750;
                that.pix = pix;
                that.screenHeight = res.windowHeight;
                that.scrollHeight = res.windowHeight - 776 * pix;
            },
        });

        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        this.$nextTick(() => {
            document.querySelector('.uni-video-cover-duration').style.display = 'none';
        });

        // #endif
    },
    onLoad({ id }) {
        this.id = id;
        this.filter.topic_id = this.id;
        this.getDetail();
        this.getCommentList();
    },
    methods: {
        onFullScreenChange(e) {
            const isFullScreenMode = e.detail.fullScreen;
            this.isFullScreen = isFullScreenMode;
        },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
            window.screen.orientation.lock('natural');
        },
        getDetail() {
            api.get('/api/live/detail', { id: this.id }).then(
                (Detail) => {
                    const detail = Detail;
                    detail.start_time = detail.start_time.slice(0, 16);
                    detail.end_time = detail.end_time.slice(11, 16);
                    detail.like_num = this.setLikeNum(detail.like_num + 1);
                    this.pageDetail = detail;
                    uni.setNavigationBarTitle({
                        title: detail.live_name,
                    });
                },
                () => {
                    uni.showToast({
                        title: '',
                        icon: 'none',
                    });
                },
            );
        },
        handleBack() {
            uni.reLaunch({
                url: '/pages/tabBar/index/index',
            });
        },
        clickLike() {
            if (!this.pageDetail.is_like) {
                const url = '/api/common/like';
                const param = {
                    object_id: this.id,
                    object_type: 2,
                };
                api.isLogin().then(() => {
                    api.get(url, param).then(
                        () => {
                            // 点赞成功了，
                            this.is_like = 1;
                            this.pageDetail.like_num += 1;
                            this.pageDetail.like_num = this.setLikeNum(
                                this.pageDetail.like_num + 1,
                            );
                        },
                        () => {},
                    );
                });
            }
        },
        setLikeNum(value) {
            let val = value;
            if (value > 100000) {
                val = Math.floor(value / 10000);
                if (val > 9999) {
                    val = '9999W+';
                } else {
                    val += 'W+';
                }
            }
            return val;
        },
        error(e) {
            console.log(e.target.errMsg);
        },
        onFoucs(e) {
            this.isFocus = true;
            if (!this.isH5) {
                this.showKeybord = true;
                if (!this.hasKeybordEnterUp) {
                    e.detail.height = e.detail.height || 180;
                    this.inputBtm = e.detail.height;
                    this.kbHeight = e.detail.height;
                    this.markerheight = this.screenHeight - e.detail.height - this.pix * 124;
                    this.hasKeybordEnterUp = true;
                } else {
                    this.inputBtm = this.kbHeight;
                }
            }
        },
        blur() {
            if (this.changeVal.trim()) {
                this.bindconfirm();
            } else {
                this.initSetInput();
            }
        },
        initSetInput() {
            this.showKeybord = false;
            this.isFocus = false;
            this.inputBtm = 0;
        },
        bindconfirm() {
            this.showKeybord = false;
            this.isFocus = false;
            if (this.changeVal.trim()) {
                const content = this.changeVal.trim();
                if (this.hasLogin) {
                    this.addComment(content);
                } else {
                    api.isLogin().then(
                        () => {
                            this.addComment(content);
                        },
                        () => {
                            this.changeVal = '';
                            uni.showToast({
                                icon: 'none',
                                title: '请先登录',
                            });
                        },
                    );
                }
            } else {
                this.changeVal = '';
            }
        },
        addComment(content) {
            this.hasLogin = true;
            const params = {
                content,
                topic_type: 6,
                topic_id: this.id,
                comment_type: 1,
            };
            api.post('/api/comment/add', params).then(() => {
                this.toUper();
                this.initSetInput();
                uni.showToast({
                    title: '已提交',
                    icon: 'none',
                });
            });
            this.changeVal = '';
        },
        getCommentList() {
            api.post('/api/comment/list', this.filter).then(
                ({ list, total }) => {
                    let List = list;
                    List = List.map((D) => {
                        const d = D;
                        d.created_at = d.created_at.slice(5, 16);
                        return d;
                    });
                    this.total = total;
                    this.loading = true;
                    if (this.filter.page_num === 1) {
                        this.commentList = List;
                    } else {
                        this.commentList = this.commentList.concat(List);
                    }
                },
            );
        },
        toUper() {
            this.filter.page_num = 1;
            this.getCommentList();
        },
        toLower() {
            if (this.filter.page_num * this.filter.page_size < this.total) {
                this.filter.page_num += 1;
                this.getCommentList();
            }
        },
    },
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100vh;
    position: relative;
    background: #000;
    color: #fff;
    &.h5-main {
        height: 100%;
    }
    .marker {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        left: 0;
        width: 100%;
        z-index: 101;
    }

    .video {
        width: 100%;
        height: 420upx;
    }
    .page-top {
        display: flex;
        padding: 20upx 30upx;
        .logo {
            width: 72upx;
            height: 72upx;
            margin-right: 24upx;
        }
        .school {
            font-size: 28upx;
        }
        .time {
            font-size: 22upx;
            color: #aaa;
        }
    }
    .title {
        font-size: 30upx;
        font-weight: 500;
        padding: 34upx 30upx;
    }
    .page-comment {
        .comment-item {
            padding: 0 10upx 42upx 30upx;
            display: flex;
            .avatar {
                width: 72upx;
                height: 72upx;
                border-radius: 36upx;
                border: 2upx solid #fff;
                box-sizing: border-box;
                margin-right: 16upx;
                image {
                    width: 68upx;
                    height: 68upx;
                    border-radius: 34upx;
                }
            }
            .main-text {
                width: 600upx;
                .content-info {
                    display: flex;
                    justify-content: space-between;

                    .name {
                        font-size: 26upx;
                        color: #888;
                        line-height: 28upx;
                        margin-bottom: 12upx;
                        width: 460upx;
                    }
                    .time {
                        font-size: 22upx;
                        color: #666;
                    }
                }
                .content {
                    font-size: 26upx;
                    line-height: 44upx;
                    word-break: break-all;
                }
            }
        }
        .no-comment {
            margin-top: 100upx;
            text-align: center;
            color: #fff;
            font-size: 28upx;
        }
    }
    .input-wrap {
        display: flex;
        justify-content: space-between;
        padding: 30upx;
        width: 100%;
        box-sizing: border-box;
        line-height: 64upx;
        z-index: 102;
        background: #000;
        position: relative;
        &.absolute {
            position: absolute;
            left: 0;
            background: #fff;
            input {
                width: 600upx;
                background: #f0f0f2;
                color: #666;
                padding-left: 74upx;
            }
        }

        .like-img {
            width: 40upx;
            height: 40upx;
            vertical-align: top;
            margin-top: 10upx;
        }
        .num {
            font-size: 30upx;
            min-width: 40rpx;
        }
        input {
            width: 530upx;
            height: 64upx;
            border-radius: 32upx;
            background: rgba(255, 255, 255, 0.25);
            padding-left: 40upx;
            padding-right: 40upx;
            box-sizing: border-box;
        }
        .placeholderStyle {
            color: #fff;
            font-size: 28upx;
        }
        .write-icon {
            width: 48rpx;
            height: 48rpx;
            position: absolute;
            left: 56rpx;
            top: 50%;
            margin-top: -24rpx;
        }
        .fabu {
            color: #2f3033;
            font-size: 28rpx;
            line-height: 64rpx;
            margin-left: 14rpx;
            &.disable {
                color: #b0b5bf;
            }
        }
    }
    .mp-weixin-full-screen-title {
        position: absolute;
        top: 46upx;
        width: 100%;
        z-index: 10000;
        color: #fff;
        box-sizing: border-box;
        padding: 0 30upx 0 100upx;
        color: #fff;
        font-size: 28upx;
    }
}
</style>
