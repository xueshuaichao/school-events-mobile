<template>
    <view class="main">
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
        <video
            class="video"
            :src="pageDetail.live_uri"
            @error="error"
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
                    :key="item.comment_id"
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
                                12-11 18:30
                            </view>
                        </view>
                        <view class="content">
                            {{ item.content }}
                        </view>
                    </view>
                </view>
            </template>
        </scroll-view>
        <view
            class="input-wrap"
            :style="{ bottom: inputBtm + 'px' }"
        >
            <input
                v-model="changeVal"
                placeholder-class="placeholderStyle"
                type="text"
                placeholder="快来留下评论吧"
                maxlength="80"
                :adjust-position="false"
                @focus="onFoucs"
                @confirm="bindconfirm"
            >
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
        };
    },
    mounted() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                const pix = res.screenWidth / 750;
                that.pix = pix;
                that.screenHeight = res.windowHeight;
                that.scrollHeight = res.windowHeight - 776 * pix;
                that.inputBtm = 30 * pix;
                console.log(that.scrollHeight, that.screenHeight, 'height----');
            },
        });
    },
    onLoad({ id }) {
        this.id = id;
        this.filter.topic_id = this.id;
        this.getDetail();
        this.getCommentList();
    },
    methods: {
        getDetail() {
            api.get('/api/live/detail', { id: this.id }).then(
                (detail) => {
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
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    api.get(url, param).then(
                        () => {
                            // 点赞成功了，
                            this.pageDetail.like_num += 1;
                        },
                        () => {},
                    );
                });
            }
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
                    this.inputBtm = e.detail.height + 30 * this.pix;
                    this.markerheight = this.screenHeight - e.detail.height - this.pix * 110;
                    this.hasKeybordEnterUp = true;
                }
            }
        },
        bindconfirm() {
            this.showKeybord = false;
            this.isFocus = false;
            if (this.changeVal.trim()) {
                const content = this.changeVal.trim();
                if (this.hasLogin) {
                    this.addComment(content);
                } else {
                    api.isLogin({
                        fr: this.fr,
                    }).then(
                        () => {
                            this.addComment(content);
                        },
                        () => uni.showToast({
                            icon: 'none',
                            title: '请先登录',
                        }),
                    );
                    this.changeVal = '';
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
                uni.showToast({
                    title: '已提交',
                    icon: 'none',
                });
            });
        },
        getCommentList() {
            api.post('/api/comment/list', this.filter).then(
                ({ list, total }) => {
                    this.commentList = list;
                    this.total = total;
                    if (this.filter.page_num === 1) {
                        this.commentList = list;
                    } else {
                        this.commentList = this.commentList.concat(list);
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
    .marker {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        left: 0;
        width: 100%;
        z-index: 101;
    }

    .video {
        width: 750upx;
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
    }
    .input-wrap {
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 30upx;
        left: 0;
        padding: 30upx 30upx 0;
        width: 100%;
        box-sizing: border-box;
        line-height: 64upx;

        .like-img {
            width: 40upx;
            height: 40upx;
            vertical-align: top;
            margin-top: 10upx;
        }
        .num {
            font-size: 30upx;
            min-width: 60rpx;
        }
        input {
            width: 530upx;
            height: 64upx;
            border-radius: 32upx;
            background: rgba(255, 255, 255, 0.25);
            text-indent: 30upx;
        }
        .placeholderStyle {
            color: #fff;
            font-size: 28upx;
        }
    }
}
</style>
