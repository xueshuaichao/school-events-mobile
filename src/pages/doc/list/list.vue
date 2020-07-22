<template>
    <view class="page-doc-list">
        <template v-if="type">
            <view class="menu-list">
                <template>
                    <view
                        v-for="(item, k) in conf.menu"
                        :key="k"
                        @click.prevent="toggle(k)"
                    >
                        <view
                            class="menu-item"
                            :class="{
                                change: type === 'challenge',
                                active:
                                    item.show ||
                                    (activeMenuIndex === k &&
                                    type !== 'challenge')
                            }"
                        >
                            {{ type === "challenge" ? item.txt : item }}
                            <view
                                v-if="type === 'challenge'"
                                class="arror"
                            />
                        </view>

                        <template v-if="type === 'challenge' && item.show">
                            <view
                                v-for="(subItem, index) in item.subLists"
                                :key="index"
                                class="sub-item"
                                :class="{
                                    active:
                                        activeMenuIndex ===
                                        activeOldMenuIndex &&
                                        activeOldMenuIndex === k &&
                                        activeSubMenuIndex === index
                                }"
                                @click.stop="toggleSubItem(k, index)"
                            >
                                {{ subItem }}
                            </view>
                        </template>
                    </view>
                </template>
            </view>
            <view class="content">
                <template v-if="type === 'guinness'">
                    <view class="title">
                        项目说明:
                    </view>
                </template>
                <template v-if="type !== 'challenge'">
                    <view
                        v-for="(content, m) in conf.content[activeMenuIndex]"
                        :key="m"
                        class="item"
                    >
                        <view class="title">
                            {{ content.title }}
                        </view>
                        <view class="text">
                            {{ content.content }}
                        </view>
                    </view>
                </template>
                <template v-else>
                    <view class="title">
                        {{ curtitle }}
                    </view>
                    <view
                        v-for="content in curContents"
                        :key="content"
                        class="item"
                    >
                        <view class="text">
                            {{ content }}
                        </view>
                    </view>
                </template>

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
                    <template
                        v-if="
                            type === 'talent' &&
                                activeMenuIndex &&
                                activeMenuIndex !== 2
                        "
                    >
                        <view class="title">
                            图片作品要求如下：
                        </view>
                        <view class="text">
                            1、建议尺寸比例为16:9 <br>
                            2、格式为JPG、PNG
                            小于10M，用于在首页、列表和作品详情页展示
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
            activeOldMenuIndex: 0,

            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif
            activeSubMenuIndex: 0,
            curtitle: '',
            curContents: [],
        };
    },
    methods: {
        toggle(index) {
            if (this.type === 'challenge') {
                this.conf.menu = this.conf.menu.map((D, idx) => {
                    const d = D;
                    if (index === idx) {
                        d.show = !d.show;
                    } else {
                        d.show = false;
                    }
                    return d;
                });
            }
            this.activeMenuIndex = index;
        },
        toggleSubItem(index, subIndex) {
            this.activeOldMenuIndex = index;
            this.activeMenuIndex = index;
            this.activeSubMenuIndex = subIndex;
            this.curtitle = this.conf.content[index].children[subIndex].name;
            this.curContents = this.conf.content[index].children[
                subIndex
            ].describe;
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
        if (this.type === 'challenge') {
            this.curtitle = this.conf.menu[this.activeMenuIndex].subLists[
                this.activeSubMenuIndex
            ];
            this.curContents = this.conf.content[this.activeMenuIndex].children[
                this.activeSubMenuIndex
            ].describe;
        }

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
        width: 212rpx;
        background: rgba(245, 245, 245, 1);
        height: 100vh;
    }

    .menu-item {
        line-height: 32rpx;
        text-align: center;
        font-size: 28rpx;
        color: #3c3c3c;
        padding: 28rpx 8rpx;
        position: relative;
        &.change {
            padding: 28rpx;
            text-align: left;
        }

        &.active {
            background: #268fff;
            color: #fff;
            .arror {
                transform: rotate(180deg);
                &::before,
                &::after {
                    background: #fff;
                }
            }
        }
        .arror {
            position: absolute;
            width: 20upx;
            height: 20upx;
            right: 46upx;
            top: 50%;
            margin-top: -10upx;
            &::before,
            &::after {
                content: "";
                position: absolute;
                display: block;
                width: 15upx;
                height: 4upx;
                background: #777;
                border-radius: 2upx;
            }
            &::before {
                bottom: 8upx;
                left: 0;
                transform: rotate(-40deg);
            }
            &::after {
                bottom: 8upx;
                right: -2upx;
                transform: rotate(40deg);
            }
        }
    }
    .sub-item {
        font-size: 22rpx;
        line-height: 1.5;
        padding: 14rpx 30rpx;
        color: #3c3c3c;
        &.active {
            color: #1166ff;
            background: #cfe0ff;
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
