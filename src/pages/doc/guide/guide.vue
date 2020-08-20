<template>
    <view class="page-doc-list">
        <view class="menu-list">
            <view
                v-for="(item, k) in menuList"
                :key="k"
                @click.prevent="selectMenu(item)"
            >
                <view
                    class="menu-item"
                    :class="{
                        active: activeMenuItem.code === item.code
                    }"
                >
                    {{ item.name }}
                    <view
                        v-if="item.children && item.children.length > 0"
                        :class="{
                            fold: item.fold === true
                        }"
                        class="arror"
                    />
                </view>

                <template
                    v-if="
                        item.children && item.children.length > 0 && !item.fold
                    "
                >
                    <view
                        v-for="(subItem, index) in item.children"
                        :key="index"
                        class="sub-item"
                        :class="{
                            active:
                                activeMenuSubCode === subItem.code &&
                                activeMenuItem.code === item.code
                        }"
                        @click.stop="selectSubItem(item, subItem)"
                    >
                        {{ subItem.name }}
                    </view>
                </template>
            </view>
        </view>
        <view class="content">
            <!-- 非项目 -->
            <template v-if="activeMenuItem.code !== 'items'">
                <view class="page-rich-text rich-content">
                    <rich-text :nodes="contentNodes[activeMenuItem.code]" />
                </view>
                <view
                    v-if="!isH5 && contentNodes[activeMenuItem.code].length > 0"
                    class="share-wrap"
                >
                    <button
                        class="share-btn"
                        open-type="share"
                    >
                        <text class="text">
                            分享好友
                        </text>
                        <image
                            class="icon-btn icon-wechat"
                            src="/static/images/news/weixin.png"
                        />
                    </button>
                </view>
            </template>
            <template v-else>
                <view
                    v-for="(item, index) in itermData[activeMenuSubCode]"
                    :key="index"
                    class="item-box"
                >
                    <view class="title">
                        {{ item.name || item.title }}
                    </view>
                    <view class="item-content">
                        <text>{{ item.shortDesc }}</text>
                        <text
                            class="more"
                            @click="selectItem(item)"
                        >
                            更多
                        </text>
                    </view>
                </view>
            </template>
        </view>
        <!-- 项目弹框 -->
        <guide-modal
            :show="showModal"
            :modal-content="itemObj"
            :modal-type="activeMenuSubCode"
            :user-info="userInfo"
            @closeModal="closeModal"
        />
    </view>
</template>

<script>
import api from '../../../common/api';
import conf from '../../../data/doc/items';
import parseHtml from '../../../common/third-party/html-parser';
import share from '../../../common/share';
import guideModal from './modal.vue';

export default {
    components: {
        guideModal,
    },
    data() {
        return {
            menuList: [
                {
                    name: '大赛简介',
                    code: 'intro',
                    id: 191,
                },
                {
                    name: '大赛须知',
                    code: 'notice',
                    id: 189,
                },
                {
                    name: '大赛流程',
                    code: 'process',
                    id: 191,
                },
                {
                    name: '大赛项目',
                    code: 'items',
                    fold: false, // 展开收起
                    children: [
                        {
                            name: '爱挑战竞技',
                            code: 'challenge',
                        },
                        {
                            name: '爱挑战吉尼斯',
                            code: 'guinness',
                        },
                        {
                            name: '才艺秀',
                            code: 'talent',
                        },
                    ],
                },
            ],
            activeMenuItem: {},
            activeMenuCode: 'intro',
            activeMenuSubCode: 'challenge',
            userInfo: null,
            contentNodes: {
                intro: [],
                notice: [],
                process: [],
            },
            itermData: {
                challenge: [],
                guinness: [],
                talent: [],
            },
            showModal: false,
            itemObj: {},
            id: '',
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    onShow() {
        if (!this.userInfo) {
            this.getUserInfo();
        }
    },
    onLoad(options) {
        if (!options.index) {
            const item = this.menuList[0];
            this.selectMenu(item);
        }
        this.handleItemData('challenge');
        this.handleItemData('guinness');
        this.handleItemData('talent');
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            return {
                title:
                    '不服你来战-陕西青少年“爱挑战”嘉年华完美收官陕西青少年“爱挑战”嘉年华完美收官',
                imageUrl: '/static/images/index/banner.png',
                path: `/pages/news/detail/detail?id=${this.id}`,
            };
        }
        return {
            title: '大赛指南',
        };
    },
    methods: {
        handleItemData(key) {
            this.itermData[key] = conf[key].content.map((item) => {
                const content = item.content || item.describe.join('');
                return {
                    ...item,
                    shortDesc: `${content.slice(0, 27)}...`,
                };
            });
        },
        getContentData() {
            uni.hideLoading();
            const { id, code } = this.activeMenuItem;

            api.get('/api/article/info', {
                id,
            }).then((res) => {
                this.info = res;
                try {
                    this.contentNodes[code] = parseHtml(res.content);
                } catch (e) {
                    console.log(e);
                }
                share({
                    title: this.info.title,
                });
            });
        },
        getUserInfo() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                },
                () => {
                    this.userInfo = null;
                },
            );
        },
        selectMenu(item) {
            if (item.code === this.activeMenuItem.code) {
                if (item.children) {
                    // eslint-disable-next-line no-param-reassign
                    item.fold = !item.fold;
                }
                return;
            }
            this.activeMenuItem = item;
            if (item.id && this.contentNodes[item.code].length === 0) {
                // 非项目
                this.id = item.id;
                this.getContentData();
            }
        },
        selectSubItem(item, subItem) {
            this.activeMenuItem = item;
            this.activeMenuSubCode = subItem.code;
        },
        selectItem(item) {
            this.itemObj = item;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
        },
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
        text-align: left;
        font-size: 28rpx;
        color: #3c3c3c;
        padding: 28rpx 10rpx 28rpx 24rpx;
        position: relative;

        &.active {
            background: #1166ff;
            color: #fff;
            .arror {
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
            right: 30upx;
            top: 50%;
            margin-top: -10upx;
            transform: rotate(180deg);
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
            &.fold {
                transform: rotate(0deg);
            }
        }
    }
    .sub-item {
        font-size: 22rpx;
        line-height: 1.5;
        padding: 14rpx 10rpx 14rpx 32rpx;
        color: #3c3c3c;
        &.active {
            color: #1166ff;
            background: #cfe0ff;
        }
    }
    .rich-content {
        padding: 40upx 30upx;
    }
    .content {
        flex: 1;
        font-size: 28rpx;
        color: #333333;
        overflow-y: auto;
        .title {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 24upx;
        }
        .more {
            color: #1166ff;
        }
        .item-box {
            padding: 40upx 30upx 40upx 40upx;
            border-bottom: 1px solid #f2f2f2;
            line-height: 40upx;
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

    .share-wrap {
        padding-bottom: 20px;
        display: flex;

        .share-btn {
            width: 240upx;
            height: 64upx;
            border-radius: 33upx;
            background: #f7f7f7;
            font-size: 28upx;
            color: #333;
            border: none;
            line-height: 64upx;
            padding: 0;

            &::after {
                display: none;
            }
        }

        .icon-btn {
            display: inline-block;
            margin: 0 0 0 26upx;
            position: relative;
        }
    }
    .icon-wechat {
        width: 42upx;
        height: 34upx;
        top: 8upx;
    }
}
</style>
