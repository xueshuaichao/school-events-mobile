/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
const getCookie = (name) => {
    const strcookie = document.cookie; // 获取cookie字符串
    const arrcookie = strcookie.split('; '); // 分割
    // 遍历匹配
    for (let i = 0; i < arrcookie.length; i += 1) {
        const arr = arrcookie[i].split('=');
        if (arr[0] === name) {
            return arr[1];
        }
    }
    return '';
};
function onPageView() {
    // #ifdef H5
    console.log(1111);
    if (location.host === 'atz.qsnatz.com') {
        try {
            // 伟东云统计
            // - 设置采集系统帐户, 必须设置账户,
            window._gaq.push(['_setAccount', 'aitiaozhan']);

            // 当只有一个域名时可以不用设置域名;存在多个二级域名时,设置为一级域名
            window._gaq.push(['_setDomainName', 'qsnatz.com']);

            // 如果用户在登录状态下访问页面，设置loginID变量
            window._gaq.push([
                '_setCustomVar',
                'loginID',
                getCookie('user_id'),
                3,
            ]); // 用户id

            // 页面采集，url默认为location.href,如需要指定页面url，请使用_gaq.push(['_trackPageview', url]);
            window._gaq.push([
                '_trackPageview',
                location.pathname + location.search,
            ]);

            // 事件采集
            // window._gaq.push(['_trackEvent', category, action, label, cnt, amt, content]);

            window._hmt.push([
                '_trackPageview',
                location.pathname + location.search,
            ]);
        } catch (e) {
            console.log(e);
        }
    }
    // #endif

    log();
}

// prepare fr
function getFr(type, params, mode = '') {
    // mode online - 线上
    const { from } = params;
    const defaultFr = [type];
    let isH5 = false;
    // #ifdef H5
    isH5 = true;
    // #endif

    const platform = isH5 ? 'h5' : 'mini';
    defaultFr.push(platform);

    if (from) {
        defaultFr.push(from);
    }
    if (mode) {
        defaultFr.push(mode);
    }
    return defaultFr.join('_');
}

function log() {
    // api.get('http://crawler.wdcloud.cc/images/__utm.gif', {
    //     utmdt: 'page',
    //     utmhn: 'hostname',
    // });
}

export default {
    onPageView,
    getFr,
    log,
};
