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
                <view
                    v-for="content in conf.content[activeMenuIndex]"
                    :key="content.title"
                >
                    <view class="title">
                        {{ content.title }}
                    </view>
                    <view class="text">
                        {{ content.content }}
                    </view>
                </view>
                <view v-if="type !== 'guinness'">
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

                    <template v-if="!isH5">
                        <navigator
                            v-if="type === 'challenge'"
                            url="/pages/openGame/jingjiupload?type=jingji"
                            open-type="redirect"
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

    .menu-list {
        width: 212rpx;
        background: rgba(245, 245, 245, 1);
        min-height: 100vh;
    }

    .menu-item {
        line-height: 108rpx;
        text-align: center;
        font-size: 28rpx;
        color: #3c3c3c;

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

        .title {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 24rpx;
        }

        .text {
            margin-bottom: 40rpx;
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
        margin: 0 auto;
    }
}
</style>
