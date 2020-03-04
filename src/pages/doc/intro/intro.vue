<template>
    <view class="page-doc-list">
        <template>
            <view class="menu-list">
                <view
                    v-for="item in menu"
                    :key="item"
                    class="menu-item"
                    :class="{
                        active: activeMenuIndex === item.code
                    }"
                    @click="toggle(item.code)"
                >
                    {{ item.name }}
                </view>
            </view>
            <view class="content">
                <view v-if="activeMenuIndex === 'guide'">
                    <guide />
                </view>
                <view else-if>
                    <view class="content page-rich-text">
                        <rich-text :nodes="contentNodes[activeMenuIndex]" />
                    </view>
                    <view
                        v-if="!isH5"
                        class="share-wrap"
                    >
                        <button
                            class="share-btn"
                            open-type="share"
                            @click="shareToFriend"
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
                </view>
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';
// import conf from '../../../data/doc/list';
import guide from './detail/guide.vue';
import parseHtml from '../../../common/third-party/html-parser';
import share from '../../../common/share';

export default {
    components: {
        guide,
    },
    data() {
        return {
            menu: [
                {
                    name: '参赛指南',
                    code: 'guide',
                },
                {
                    name: '大赛介绍',
                    code: 'intro',
                },
                {
                    name: '大赛须知',
                    code: 'notice',
                },
                {
                    name: '大赛流程',
                    code: 'process',
                },
                {
                    name: '大赛时间',
                    code: 'time',
                },
            ],
            menuConf: {
                intro: { id: 190 },
                notice: { id: 189 },
                process: { id: 191 },
                time: { id: 187 },
            },
            activeMenuIndex: 'guide',
            contentNodes: {
                intro: [],
                notice: [],
                process: [],
                time: [],
            },
            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    onLoad() {},
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title:
                '不服你来战-陕西青少年“爱挑战”嘉年华完美收官陕西青少年“爱挑战”嘉年华完美收官',
            imageUrl: '/static/images/index/banner.png',
            path: `/pages/news/detail/detail?id=${this.id}`,
        };
    },
    methods: {
        shareToFriend() {
            uni.share({
                provider: 'weixin',
                scene: 'WXSceneSession',
                type: 0,
                href: 'http://uniapp.dcloud.io/',
                title: 'uni-app分享',
                summary: '我正在使用HBuilderX开发uni-app，赶紧跟我一起来体验！',
                imageUrl:
                    'https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/uni@2x.png',
                success(res) {
                    console.log(`success:${JSON.stringify(res)}`);
                },
                fail(err) {
                    console.log(`fail:${JSON.stringify(err)}`);
                },
            });
        },
        getData(code) {
            uni.hideLoading();
            const { id } = this.menuConf[code];
            this.id = id;

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
                if (!this.noticeMode) {
                    uni.setNavigationBarTitle({
                        title: this.info.title,
                    });
                }

                if (this.info.is_proclamation === 0) {
                    // 获取推荐信息
                    this.getArticle(res.column);
                }
            });
        },
        toggle(code) {
            this.activeMenuIndex = code;
            if (code !== 'guide' && this.contentNodes[code].length === 0) {
                uni.showLoading();
                this.getData(code);
            }
        },
    },
};
</script>

<style lang="less">
.share-wrap {
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
.page-doc-list {
    // display: flex;

    .menu-list {
        width: 100%;
        background: rgba(245, 245, 245, 1);
        // min-height: 100vh;
    }

    .menu-item {
        line-height: 108rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999999;
        width: 20%;
        float: left;
        // border-bottom:4upx;
        // border-color:transparent;
        // &.active {
        //     background: #268fff;
        //     color: #fff;
        // }
        &.active {
            color: #333333;
            position: relative;

            &::after {
                content: " ";
                background: #333;
                width: 40upx;
                height: 4upx;
                display: block;
                position: absolute;
                left: 50%;
                margin-left: -20upx;
                bottom: -4upx;
            }
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
