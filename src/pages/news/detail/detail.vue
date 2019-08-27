<template>
    <view v-if="!isLoading">
        <view class="page-news-detail">
            <template v-if="!noticeMode">
                <view class="title">
                    {{ info.title }}
                </view>
                <view class="info">
                    来源： {{ info.user_name }} {{ info.publish_at }}
                </view>
            </template>

            <view class="content page-rich-text">
                <rich-text :nodes="contentNodes" />
            </view>

            <view class="share-wrap">
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

                <button
                    v-if="isH5"
                    class="share-btn"
                    @click="shareToTimeline"
                >
                    分享朋友圈
                    <image
                        class="icon-btn icon-timeline"
                        src="/static/images/news/timeline.png"
                    />
                </button>
            </view>
        </view>

        <!-- news -->
        <view
            v-if="recommendData.length > 0"
            class="panel"
        >
            <view class="panel-hd">
                <text class="panel-title">
                    相关阅读：
                </text>
            </view>
            <view class="panel-bd news-list">
                <navigator
                    v-for="item in recommendData"
                    :key="item.id"
                    class="news-item"
                    :url="`/pages/news/detail/detail?id=${item.id}`"
                >
                    <text class="text-two-line">
                        · {{ item.title }}
                    </text>
                </navigator>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import parseHtml from '../../../common/third-party/html-parser';

export default {
    data() {
        return {
            id: '',

            // #ifdef H5
            isH5: true,
            // #endif

            noticeMode: false,
            info: {},
            contentNodes: [],
            isLoading: true,

            recommendData: [],
        };
    },
    methods: {
        getData(id) {
            this.id = id;

            api.get('/api/article/info', {
                id,
            }).then((res) => {
                this.isLoading = false;
                this.info = res;
                try {
                    this.contentNodes = parseHtml(res.content);
                } catch (e) {
                    console.log(e);
                }

                if (this.info.is_proclamation === 0) {
                    // 获取推荐信息
                    this.getArticle(res.column);
                }
            });
        },
        getArticle(columnId) {
            api.get('/api/article/list', {
                column: columnId,
                except_new_id: this.id,
                page_size: 5,
            }).then((res) => {
                this.recommendData = res.list;
            });
        },
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
        shareToTimeline() {
            uni.share({
                provider: 'weixin',
                scene: 'WXSenceTimeline',
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
    },
    onLoad(query) {
        const { id, title } = query;
        this.getData(id);
        if (title) {
            this.noticeMode = true;
        }

        if (title) {
            uni.setNavigationBarTitle({
                title,
            });
        }
    },
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
};
</script>

<style lang="less" scoped>
.page-news-detail {
    padding-bottom: 48upx;

    image {
        width: 690upx;
        height: 280upx;
        display: block;
        margin: 30upx auto;
    }
    .title {
        padding: 30upx;
        color: #333;
        font-size: 32upx;
        font-weight: 500;
    }
    .info {
        font-size: 22upx;
        color: #999;
        padding: 0 30upx;
    }

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

    .icon-wechat {
        width: 42upx;
        height: 34upx;
        top: 8upx;
    }
    .icon-timeline {
        width: 36upx;
        height: 36upx;
        top: 8upx;
    }

    /deep/ .rich-text-image {
        width: 100% !important;
        margin: 20upx 0;
    }
}

.news-list {
    .news-item {
        font-size: 28upx;
        color: #666;
        line-height: 45upx;
        border-bottom: 1px solid #f0f0f0;
        padding: 25upx 0;
    }
}
</style>
