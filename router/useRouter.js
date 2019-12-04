/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Router, { RouterMount } from 'uni-simple-router';

Vue.use(Router);

const whitelist = {
    '/pages/tabBar/index/index': 'tabbar-index',
    '/pages/tabBar/list/list': 'tabbar-list',
    '/pages/address/index': 'address-index',
    '/pages/tabBar/upload/upload': 'tabbar-upload',
    '/pages/tabBar/uc/uc': 'tabbar-uc',
    '/pages/tabBar/mall/mall': 'tabbar-mall',
    '/pages/work/detail/detail': 'work-detail',
    '/pages/news/detail/detail': 'news-detail',
    '/pages/mall/detail/detail': 'mall-detail',
};

const routesConfig = {
    h5: {
        loading: true,
        vueRouterDev: false,
        useUniConfig: true,
        resetStyle: () => ({
            style: `
            #router-loadding .loadding {
                display: none;
                // background-color: #f00 !important;
                // box-shadow: 0 0 15px #f00 !important;
            }
            `,
        }),
    },
    encodeURI: false,
    debugger: true,
    routes: [
        {
            path: '/pages/tabBar/index/index',
            name: 'tabbar-index',
            aliasPath: '/',
            component: () => import('@/pages/tabBar/index/index.vue'),
            // 对于h5端你必须在首页加上aliasPath并设置为/
        },
        {
            path: '/pages/tabBar/list/list',
            component: () => import('@/pages/tabBar/list/list.vue'),
            aliasPath: '/list',
            name: 'tabbar-list',
        },
        {
            path: '/pages/tabBar/challenge/challenge',
            component: () => import('@/pages/tabBar/challenge/challenge.vue'),
            aliasPath: '/challenge',
            name: 'tabbar-challenge',
        },
        {
            path: '/pages/tabBar/upload/upload',
            component: () => import('@/pages/tabBar/upload/upload.vue'),
            aliasPath: '/upload',
            name: 'tabbar-upload',
        },
        {
            path: '/pages/tabBar/mall/mall',
            component: () => import('@/pages/tabBar/mall/mall.vue'),
            aliasPath: '/mall',
            name: 'tabbar-mall',
        },
        {
            path: '/pages/mall/detail/detail',
            component: () => import('@/pages/mall/detail/detail.vue'),
            aliasPath: '/mall/detail',
            name: 'mall-detail',
        },
        {
            path: '/pages/tabBar/uc/uc',
            component: () => import('@/pages/tabBar/uc/uc.vue'),
            aliasPath: '/uc',
            name: 'tabbar-uc',
        },
        {
            path: '/pages/uc/myWork/myWork',
        },
        {
            path: '/pages/doc/detail/detail',
            name: 'doc',
            component: () => import('@/pages/doc/detail/detail.vue'),
        },
        {
            path: '/pages/address/index',
            component: () => import('@/pages/address/index.vue'),
            aliasPath: '/mall/exchange',
            name: 'address-index',
        },
        {
            path: '/pages/address/address',
        },
        {
            path: '/pages/address/edit',
        },
        {
            path: '/pages/address/exchangeRecord',
        },
        {
            path: '/pages/doc/list/list',
        },
        {
            path: '/pages/qa/detail/detail',
        },
        {
            path: '/pages/news/list/list',
            aliasPath: '/information/news',
        },
        {
            path: '/pages/news/detail/detail',
            aliasPath: '/information/detail',
            name: 'news-detail',
        },
        {
            path: '/pages/work/list/list',
        },
        {
            path: '/pages/work/detail/detail',
            aliasPath: '/works/list/detail',
            name: 'work-detail',
            component: () => import('@/pages/work/detail/detail.vue'),
        },
        // {
        //     path: '/pages/test/404',
        //     aliasPath: '/404',
        //     name: '404',
        //     component: () => import('@/pages/tabBar/index/index.vue'),
        // },
        {
            path: '*',
            name: 'moddle',
            redirect: (to) => {
                const name = whitelist[to.path];
                if (name) {
                    return {
                        name,
                    };
                }
                // 404
                return {
                    name: 'tabbar-index',
                };
            },
        },
    ],
};

const router = new Router(routesConfig);

router.beforeEach(async (to, from, next) => {
    console.log(to);
    console.log(from);
    next();
});
router.afterEach((to, from) => {
    console.log('afterEach');
});

// setTimeout(() => {
//  router.push({name:'router5'})
// }, 5000);

export default RouterMount;
