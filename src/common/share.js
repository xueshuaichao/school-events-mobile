// #ifdef H5
import wx from 'weixin-js-sdk';
import api from './api';

const { location } = window;

function initWechatShare(config, params) {
    try {
        const conf = {
            debug: true,
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
                desc: params.desc,
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

const contentList = [
    '青少年爱挑战，激发学生创新精神',
    '第二届“青少年爱挑战活动大赛”',
    '青少年爱挑战活动大赛，少年强则国强',
    '“爱挑战”探索青少年综合素质',
];

function h5InitShare(customShareConfig) {
    let params = {};
    const index = Math.floor(Math.random() * contentList.length);

    const defaultParams = {
        title: '青少年爱挑战',
        desc: contentList[index],
        thumbnail:
            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/images/logo.png?x-oss-process=image/format,png/interlace,1/quality,Q_80',
        // url: `${location.protocol}//${location.host}${location.pathname}`,
        url: location.href,
    };

    if (!customShareConfig) {
        params = defaultParams;
    } else if (customShareConfig.url) {
        // 作品详情切换id
        params = customShareConfig;
        params.url = `${location.origin}//${location.pathname}${params.url}`;
    } else {
        params = Object.assign(defaultParams, customShareConfig);
    }
    console.log(params, 'before--share--');
    // if (!h5InitShare.config) {
    api.get('/api/weixin/getshareconfig', {
        url: location.href,
    }).then((data) => {
        console.log(params);
        h5InitShare.config = data;
        initWechatShare(data, params);
    });
    // } else {
    //     initWechatShare(h5InitShare.config, params);
    // }
}

// initShare();
// #endif

function initShare(params) {
    // #ifdef H5
    h5InitShare(params);
    // #endif
}

export default initShare;
