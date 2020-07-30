<template>
    <view class="rematch-list-page">
        <view class="fixed-top">
            复赛名单公布了，快来看看有你吗
        </view>
        <view class="list-wrap">
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
                @click="jumpUcCenter(item)"
            >
                <view class="avatar">
                    <template v-if="item.image">
                        <img
                            v-if="isH5"
                            crossorigin="anonymous"
                            :src="item.image"
                            alt=""
                        >
                        <image
                            v-else
                            :src="item.image"
                        />
                    </template>
                    <view
                        v-if="item.score"
                        class="score"
                    >
                        综合评分：{{ item.score }}
                    </view>
                </view>
                <view class="info">
                    <view class="name">
                        {{ item.name }}
                    </view>
                    <view class="school">
                        {{ item.school_name }}
                    </view>
                    <view class="slogan">
                        宣言：{{ item.slogan }}
                    </view>
                </view>
            </view>
        </view>
        <view class="fixed-bottom">
            排名不分先后，7月31日将公布代言人结果，敬请期待～
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';
import share from '../../../common/share';

export default {
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            list: [],
            publicConfig: {},
        };
    },
    created() {
        api.get('/api/activity/semimember').then((list) => {
            this.list = list;
        });
    },
    onLoad() {
        this.publicConfig = this.$store.getters.getPublicConfig(10);
        this.initShare();
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.shareConfig.path,
        };
    },
    methods: {
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[0];
            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
            });
        },
        jumpUcCenter(item) {
            uni.navigateTo({
                url: `/activity/pages/brand/ucenter?activity_id=10&user_id=${item.user_id}`,
            });
        },
    },
};
</script>
<style scoped lang="less">
.rematch-list-page {
    background: #583ed4;
    height: 100vh;

    .fixed-top {
        position: fixed;
        top: 0;
        left: 0;
        line-height: 110rpx;
        font-size: 30rpx;
        color: #fff;
        text-align: center;
        width: 100%;
        background: #583ed4;
        z-index: 1;
    }
    .fixed-bottom {
        position: fixed;
        bottom: 0;
        left: 0;
        line-height: 104rpx;
        color: #ff8e85;
        font-size: 24rpx;
        text-align: center;
        width: 100%;
        background: #583ed4;
    }
    .list-wrap {
        padding: 0 30rpx 104upx;
        margin: 110rpx 0 104rpx;
        box-sizing: border-box;
        background: #583ed4;
        .item {
            margin-bottom: 20rpx;
            box-shadow: 0 0 24rpx 0 rgba(152, 130, 255, 1) inset;
            border-radius: 20rpx;
            padding: 20rpx;
            background: #fff;
            color: #333;
            display: flex;
            justify-content: space-evenly;
            .avatar {
                width: 160rpx;
                height: 231rpx;
                border-radius: 10rpx;
                position: relative;
                image,
                img {
                    width: 100%;
                    height: 100%;
                }
                .score {
                    position: absolute;
                    left: -20rpx;
                    bottom: 32rpx;
                    min-width: 192rpx;
                    height: 40rpx;
                    text-align: center;
                    line-height: 40rpx;
                    background: #ff574a;
                    color: #fff;
                    font-size: 22rpx;
                    border-radius: 0 20rpx 20rpx 0;
                    padding: 0 2upx;
                    word-break: break-all;
                }
            }
            .info {
                word-break: break-all;
                margin-left: 20rpx;
                width: 470rpx;
            }
            .name {
                font-size: 30rpx;
                line-height: 60rpx;
                font-weight: 600;
            }
            .school {
                font-size: 28rpx;
                line-height: 50rpx;
            }
            .slogan {
                color: #583ed4;
                font-size: 26rpx;
                line-height: 40rpx;
            }
        }
    }
}
</style>
