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
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }

        const contentList = [
            '陕西青少年爱挑战，激发学生创新精神',
            '第二届陕西“青少年爱挑战活动大赛”',
            '陕西青少年爱挑战活动大赛，少年强则国强',
            '陕西“爱挑战”探索青少年综合素质',
        ];
        const index = Math.floor(Math.random() * contentList.length);

        return {
            title: contentList[index],
            // imageUrl: 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/images/logo.png?x-oss-process=image/format,png/interlace,1/quality,Q_80',
            path: '/pages/tabBar/index/index',
        };
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
