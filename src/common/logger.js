/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

function onPageView() {
    // #ifdef H5
    if (location.host === 'atz.qsnatz.com') {
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];

        console.log(page);

        try {
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
function getFr(type, params) {
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
