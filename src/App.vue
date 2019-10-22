<script>
import wx from 'weixin-js-sdk';
import api from './common/api';

const { location } = window;

function initWechatShare(config, params) {
    try {
        const conf = {
            debug: false,
            appId: config.appId,
            timestamp: config.timestamp,
            nonceStr: config.nonceStr,
            signature: config.signature,
            jsApiList: [
                'checkJsApi',
                'getLocation',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
            ],
        };

        wx.config(conf);

        wx.ready(() => {
            wx.onMenuShareTimeline({
                title: params.title,
                link: params.url,
                imgUrl: params.thumbnail,
                success() {
                    // utils.cheese.toast.text('分享成功');
                    uni.showToast({
                        title: '分享成功~',
                        icon: 'none',
                    });
                },
                cancel() {
                    // alert('你没有分享到朋友圈');
                    // utils.cheese.toast.text('未完成分享');
                    uni.showToast({
                        title: '未完成分享',
                        icon: 'none',
                    });
                    // Toast.toast('分享失败', 'error');
                    // 用户取消分享后执行的回调函数
                },
                fail() {
                    // Toast.toast('分享失败', 'error');
                    // alert(JSON.stringify(res));
                },
            });
            wx.onMenuShareAppMessage({
                title: params.title,
                desc: params.desc,
                link: params.url,
                imgUrl: params.thumbnail,
                trigger() {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，
                    // 因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                },
                success() {},
                cancel() {},
                fail() {
                    // Toast.toast('分享失败', 'error');
                    // alert(JSON.stringify(res));
                },
            });
            // 分享qq
            wx.onMenuShareQQ({
                title: params.title, // 分享标题
                desc: params.desc, // 分享描述
                link: params.url, // 分享链接
                imgUrl: params.thumbnail, // 分享图标
                success() {
                    // Toast.toast('分享成功', 'success');
                    // 用户确认分享后执行的回调函数
                },
                cancel() {
                    // Toast.toast('分享失败', 'error');
                    // 用户取消分享后执行的回调函数
                },
            });
            // 腾讯微博
            wx.onMenuShareWeibo({
                title: params.title,
                desc: params.desc,
                link: params.url,
                imgUrl: params.thumbnail,
                success() {
                    // Toast.toast('分享成功', 'success');
                    // 用户确认分享后执行的回调函数
                },
                cancel() {
                    // Toast.toast('分享失败', 'error');
                    // 用户取消分享后执行的回调函数
                },
            });
            // qq空间
            wx.onMenuShareQZone({
                title: params.title,
                desc: params.desc,
                link: params.url,
                imgUrl: params.thumbnail,
                success() {
                    // 用户确认分享后执行的回调函数
                },
                cancel() {
                    // 用户取消分享后执行的回调函数
                },
            });
        });

        wx.error((res) => {
            console.error(res);
            // alert(JSON.stringify(res));
        });
    } catch (e) {
        // console.error(e)
    }
}

function initShare() {
    let params = {};
    const defaultParams = {
        title: '活动大赛',
        desc: '由芝士工场提供内容付费服务，欢迎体验！',
        thumbnail:
            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/images/logo.png?x-oss-process=image/format,webp/interlace,1/quality,Q_80',
        url: `${location.protocol}//${location.host}${location.pathname}`,
    };

    if (!window.customShareConfig) {
        params = defaultParams;
    } else {
        params = Object.assign(defaultParams, window.customShareConfig);
    }

    api.get('/api/weixin/getshareconfig', {
        url: location.href,
    }).then((data) => {
        console.log(data);
        initWechatShare(data, params);
    });
}

initShare();

export default {
    onLaunch() {
        console.log('App Launch');
    },
    onShow() {
        console.log('App Show');
        uni.showShareMenu();
    },
    onHide() {
        console.log('App Hide');
    },
};
</script>

<style>
@import "./common/animate.css";
/*每个页面公共css */
uni-tabbar .uni-tabbar__bd {
    height: 60px;
}

.uni-body {
    font-size: 24upx;
}

.text-one-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.text-two-line {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.page-rich-text {
    color: #333;
    font-size: 28upx;
    line-height: 42upx;

    padding: 30upx;
}

.page-rich-text.no-indent {
    text-indent: 0;
}

.page-rich-text view {
    margin-bottom: 32upx;
}

.navigator-hover {
    background-color: initial;
    opacity: initial;
}
</style>

<style lang="less">
.uni-video-type-fullscreen {
    height: 100% !important;
}

.panel {
    text-align: left;
    .panel-hd {
        border-bottom: 1upx solid #ddd;
        margin: 0 30upx;
        .panel-title {
            color: #333;
            font-size: 32upx;
            display: inline-block;
            margin-right: 24upx;
            padding: 20upx;

            &.active {
                color: #1166ff;
                position: relative;

                &::after {
                    content: " ";
                    background: #1166ff;
                    width: 40upx;
                    height: 6upx;
                    display: block;
                    position: absolute;
                    left: 50%;
                    margin-left: -20upx;
                    bottom: -4upx;
                }
            }
        }

        .link {
            float: right;
            font-size: 24upx;
            color: #666;
            padding: 22upx 0;
        }
    }
    .panel-bd {
        margin: 0 30upx;

        &.has-swiper {
            margin-right: 0;
        }
    }
}

// theme
.uni-page-refresh-inner {
    svg {
        fill: #1166ff !important;
    }

    circle {
        stroke: #1166ff !important;
    }
}

uni-picker .uni-picker-action.uni-picker-action-confirm {
    color: #1166ff;
}
</style>
