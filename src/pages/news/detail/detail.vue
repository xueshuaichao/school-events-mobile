<template>
    <view>
        <view class="page-news-detail">
            <view class="title">
                不服你来战-陕西青少年“爱挑战”嘉年华完美收官陕西青少年“爱挑战”嘉年华完美收官
            </view>
            <view class="info">
                来源： xxx 学校 2019-06-06 12:12:18
            </view>

            <view class="content page-rich-text">
                <image src="/static/images/index/banner.png" />
                <view>
                    4月8日，陕西青少年“爱挑战”嘉年华暨吉尼斯世界纪录现场挑战大会由陕西省教育厅主办，陕西省电化教育馆、
                    北京天仕博科技有限公司承办，新华社、中央电视台、吉尼斯世界纪录、欧亚学院协办。中央电化教育馆馆长王珠珠、
                    陕西省教育厅厅长王建利；副厅长王海波、吉尼斯世界纪录全球商务副总裁Blythe
                    Ryan Fitzwiliam 等教育相关人士出席本次盛会。
                </view>
                <view>
                    吉尼斯世界纪录亚太地区认证官程东先生和罗琼女士宣布来自西安市雁塔区航天小学的李信衡、
                    贾轺阳和宝鸡实验小学的杨佳倩、王欣华分别创造《最快100米悬浮纸飞机接力（双人）》、
                    《一分钟双人毽子互踢传递次数最多（双人）》两项吉尼斯世界纪录，成为青少年吉尼斯记录保持者。
                </view>
            </view>

            <view class="share-wrap">
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
                <button class="share-btn">
                    分享朋友圈
                    <image
                        class="icon-btn icon-timeline"
                        src="/static/images/news/timeline.png"
                    />
                </button>
            </view>
        </view>

        <!-- news -->
        <view class="panel">
            <view class="panel-hd">
                <text class="panel-title">
                    相关阅读：
                </text>
            </view>
            <view class="panel-bd news-list">
                <navigator
                    v-for="item in news"
                    :key="item.id"
                    class="news-item"
                    :url="`/pages/news/detail/detail?id=123`"
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
export default {
    data() {
        return {
            id: '',

            news: [
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
                {
                    title: '陕西省关于举办2019年爱挑战大赛通知',
                },
                {
                    title: '人社部：上半年养老基金收大于支，社保时足额发放',
                },
                {
                    title:
                        '陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示陕西省爱挑战大赛复赛作品名单公示名单公示名单公示名单公示名单公示',
                },
            ],
        };
    },
    methods: {
        getData(id) {
            this.id = id;
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
        const { id } = query;
        this.getData(id);
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
