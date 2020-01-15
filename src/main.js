/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import Vue from 'vue';
// main.js

// #ifdef H5
import RouterMount from '../router/useRouter';
// #endif
import routerLink from '../node_modules/uni-simple-router/component/router-link.vue';

import App from './App.vue';
import share from './common/share';
import logger from './common/logger';

console.log(share);

const common = {
    onShow: (option) => {
        uni.showShareMenu();
        // 自定义分享的网址 应该忽略初始化分享，否则会覆盖掉页面级别的分享

        // #ifdef H5
        if (
            ['/pages/chunjie/index', '/pages/work/festival/festival'].indexOf(
                location.pathname,
            ) === -1
        ) {
            share();
        }
        // #endif
    },
    onReady: () => {},
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
        console.log('on<<<<<');
        logger.onPageView();
    },
};

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.mixin(common);
const app = new Vue({
    ...App,
});
Vue.component('router-link', routerLink);
// app.$mount();
// #ifdef H5
RouterMount(app, '#app');
// #endif

// #ifndef H5
app.$mount(); // 为了兼容小程序及app端必须这样写才有效果
// #endif
