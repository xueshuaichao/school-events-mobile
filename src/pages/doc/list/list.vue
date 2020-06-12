<template>
    <view class="page-doc-list">
        <template v-if="type">
            <view class="menu-list">
                <view
                    v-for="(item, k) in conf.menu"
                    :key="item"
                    class="menu-item"
                    :class="{
                        active: activeMenuIndex === k
                    }"
                    @click="toggle(k)"
                >
                    {{ item }}
                </view>
            </view>
            <view class="content">
                <template v-if="type === 'guinness'">
                    <view class="title">
                        项目说明:
                    </view>
                </template>
                <view
                    v-for="content in conf.content[activeMenuIndex]"
                    :key="content.title"
                    class="item"
                >
                    <view class="title">
                        <template v-if="type === 'challenge'">
                            ·
                        </template>
                        {{ content.title }}
                    </view>
                    <view class="text">
                        {{ content.content }}
                    </view>
                </view>
                <view>
                    <template v-if="type !== 'guinness'">
                        <view class="title">
                            参赛视频拍摄说明：
                        </view>
                        <view class="text">
                            1、视频要求3-10分钟 <br>
                            2、要求视频画质清晰可见（不低于720P) <br>
                            <template v-if="type === 'challenge'">
                                3、内容健康，符合爱挑战规则
                            </template>
                        </view>
                    </template>
                    <template v-if="!isH5">
                        <navigator
                            v-if="type === 'challenge'"
                            :url="
                                userInfo === null
                                    ? '/pages/login/login'
                                    : '/pages/openGame/jingjiupload?type=jingji'
                            "
                        >
                            <view class="btn">
                                我要来挑战
                            </view>
                        </navigator>
                        <navigator
                            v-if="type === 'talent'"
                            :url="
                                userInfo === null
                                    ? '/pages/login/login'
                                    : '/pages/upload/default/upload'
                            "
                            hover-class="other-navigator-hover"
                        >
                            <view class="btn">
                                我要秀才艺
                            </view>
                        </navigator>
                        <navigator
                            v-if="type === 'guinness'"
                            :url="
                                userInfo === null
                                    ? '/pages/login/login'
                                    : '/pages/openGame/jingjiupload?type=jinisi'
                            "
                            hover-class="other-navigator-hover"
                        >
                            <view class="btn">
                                我要来挑战
                            </view>
                        </navigator>
                    </template>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';
import conf from '../../../data/doc/list';

export default {
    data() {
        return {
            conf: {},
            type: '',
            activeMenuIndex: 0,

            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    methods: {
        toggle(index) {
            console.log(index);
            this.activeMenuIndex = index;
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                },
                () => {
                    this.userInfo = null;
                },
            );
        },
    },
    onShow() {
        if (!this.userInfo) {
            this.getData();
        }
    },
    onLoad(query) {
        const { type } = query;
        this.type = type;
        this.conf = conf[type];
        this.activeMenuIndex = 0;

        this.getData();
    },
};
</script>

<style lang="less">
.page-doc-list {
    display: flex;
    height: 100vh;
    overflow-y: hidden;
    .menu-list {
        width: 220rpx;
        background: rgba(245, 245, 245, 1);
        height: 100vh;
    }

    .menu-item {
        line-height: 32rpx;
        text-align: center;
        font-size: 24rpx;
        color: #3c3c3c;
        padding: 28rpx 8rpx;

        &.active {
            background: #268fff;
            color: #fff;
        }
    }

    .content {
        flex: 1;
        padding: 40rpx;
        font-size: 28rpx;
        color: #333333;
        overflow-y: auto;
        .item {
            margin-bottom: 40rpx;
            line-height: 44rpx;
        }
        .title {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
        }
        .text {
            margin-top: 6rpx;
        }
    }

    .btn {
        background: #1166ff;
        color: #fff;
        line-height: 94rpx;
        text-align: center;
        width: 400rpx;
        height: 94rpx;
        background: rgba(17, 102, 255, 1);
        border-radius: 2rpx;
        margin: 40rpx auto 40rpx;
    }
}
</style>
