/* eslint-disable no-restricted-globals */
export default {
    log() {
        // #ifdef H5
        // eslint-disable-next-line no-undef
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
};
