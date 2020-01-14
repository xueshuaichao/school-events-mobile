/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
export default {
    log() {
        // #ifdef H5
        if (location.host !== 'atz.qsnatz.com') {
            return;
        }

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
        // #endif
    },
    // prepare fr
    getFr(type, params) {
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
    },
};
