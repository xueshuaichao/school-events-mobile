/* eslint-disable no-unused-vars */
// router/index.js

import Vue from 'vue';
// 这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router';
import modules from './modules';

Vue.use(Router);
// 初始化
const router = new Router({
    routes: [...modules], // 路由表
});

// 全局路由前置守卫
router.beforeEach((to, from, next) => {
    next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {});
export default router;
