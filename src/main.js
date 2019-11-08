/* eslint-disable no-undef */
import Vue from 'vue';
import App from './App.vue';
import share from './common/share';
import logger from './common/logger';

console.log(share);

const common = {
    onShow: () => {
        // #ifdef H5
        // 404
        const pages = getCurrentPages();
        if (!pages.length) {
            console.log('__404__');
            uni.switchTab({
                url: '/pages/tabBar/index/index',
            });
        }
        // #endif

        uni.showShareMenu();
        share();
    },
    onLoad: () => {
        logger.log();
    },
};

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.mixin(common);
const app = new Vue({
    ...App,
});
app.$mount();
