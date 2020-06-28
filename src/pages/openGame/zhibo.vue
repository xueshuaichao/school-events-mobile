<template>
    <view class="main">
        <view class="page-top">
            <image
                class="logo"
                src="/static/images/uc/avatar.png"
            />
            <view>
                <view class="school">
                    西安市第二中学直播
                </view>
                <view class="time">
                    直播时间： 2020.6.30 11:30-14:30
                </view>
            </view>
        </view>
        <video
            class="video"
            src="http://vodplay.wdyedu.com/e999836814aa41f69ed121a5bed0a0a9/f98c33c72f7a428ab5d6175eabf4cc13-a34205b3f14bc615785cd8abc2ee3c2c-sd.mp4"
            @error="error"
        />
        <view class="title">
            精彩评论
        </view>
        <view class="page-comment">
            <view class="comment-item">
                <view class="avatar">
                    <image src="/static/images/uc/avatar.png" />
                </view>
                <view class="main-text">
                    <view class="content-info">
                        <view class="name">
                            亮默默
                        </view>
                        <view class="time">
                            12-11 18:30
                        </view>
                    </view>
                    <view class="content">
                        唉一想到要放寒假了就浑身的难受。
                    </view>
                </view>
            </view>
        </view>
        <view class="input-wrap">
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
                    likeStatus === 0
                        ? '/static/images/yiqing/detail/like.png'
                        : '/static/images/yiqing/detail/like-ac.png'
                "
            />
            <view class="num">
                23121
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            url:
                'http://prdsecurelive.ainemo.com/prdnemo/2c94982b723d252601724f8672594c46.m3u8?auth_key=a48e18e75d30760e6bdbca4a0981b319-1590580500-3bf4eb722f8345a5a1f84611dbdcdd47-',
            changeVal: '',
            showKeybord: false,
            likeStatus: false,
        };
    },
    mounted() {
        console.log(
            'http://prdsecurelive.ainemo.com/prdnemo/2c94982b723d252601724f8672594c46.m3u8?auth_key=a48e18e75d30760e6bdbca4a0981b319-1590580500-3bf4eb722f8345a5a1f84611dbdcdd47-',
            'url',
        );
        uni.setNavigationBarTitle({
            title: '西安市将领取第二中学附属小学直播正在进行中',
        });
    },
    methods: {
        handleBack() {
            uni.reLaunch({
                url: '/pages/tabBar/index/index',
            });
        },
        error(e) {
            console.log(e.target.errMsg);
        },
        onFoucs() {
            this.showKeybord = true;
        },
        bindconfirm() {},
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
                    }
                    .time {
                        font-size: 22upx;
                        color: #666;
                    }
                }
                .content {
                    font-size: 26upx;
                    line-height: 44upx;
                }
            }
        }
    }
    .input-wrap {
        display: flex;
        justify-content: space-between;
        position: absolute;
        bottom: 26upx;
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
