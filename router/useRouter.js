/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Router, { RouterMount } from 'uni-simple-router';

Vue.use(Router);

const whitelist = {
    '/pages/tabBar/index/index': 'tabbar-index',
    '/pages/tabBar/list/list': 'tabbar-list',
    '/pages/tabBar/upload/upload': 'tabbar-upload',
    '/pages/tabBar/uc/uc': 'tabbar-uc',
    '/pages/work/detail/detail': 'work-detail',
    '/pages/news/list/list': 'news-list',
    '/pages/news/detail/detail': 'news-detail',
    '/pages/doc/notice/notice': 'notice',
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
            path: '/pages/app/index',
        },
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
            path: '/pages/tabBar/upload/upload',
            component: () => import('@/pages/tabBar/upload/upload.vue'),
            aliasPath: '/upload',
            name: 'tabbar-upload',
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
            path: '/pages/uc/argement/index',
        },
        {
            path: '/pages/uc/honor/honor',
        },
        {
            path: '/pages/uc/uc/index',
        },
        {
            path: '/pages/doc/intro/intro',
            name: 'doc',
            component: () => import('@/pages/doc/intro/intro.vue'),
        },
        {
            path: '/history/chunjie/upload/upload',
        },
        {
            path: '/history/chunjiehao/upload/upload',
        },
        {
            path: '/pages/upload/result/result',
        },
        {
            path: '/pages/upload/modify/modify',
        },
        {
            path: '/history/chunjie/myWork/myWork',
        },
        {
            path: '/history/chunjiehao/myWork/myWork',
        },
        {
            path: '/history/chunjiehao/upload/result',
        },
        {
            path: '/history/chunjie/index',
        },
        {
            path: '/history/chunjiehao/index',
        },
        {
            path: '/history/yiqing/index',
        },
        {
            path: '/history/yiqing/myWork/myWork',
        },
        {
            path: '/history/yiqing/upload/upload',
        },
        {
            path: '/history/yiqing/upload/result',
        },
        {
            path: '/history/yiqing/bind-mobile/index',
        },
        {
            path: '/history/read/index',
        },
        {
            path: '/history/read/myWork/myWork',
        },
        {
            path: '/activity/pages/children/index',
        },
        {
            path: '/activity/pages/mywork/mywork',
        },
        {
            path: '/activity/pages/upload/modify',
        },
        {
            path: '/activity/pages/upload/result',
        },
        {
            path: '/activity/pages/brand/ucenter',
        },
        {
            path: '/activity/pages/index',
        },
        {
            path: '/activity/pages/brand/join',
        },
        {
            path: '/activity/pages/brand/rematch',
        },

        {
            path: '/activity/pages/clocked/lottery',
        },

        {
            path: '/activity/pages/mall/index',
        },
        {
            path: '/activity/pages/mall/detail',
        },
        {
            path: '/activity/pages/mall/result',
        },
        {
            path: '/activity/pages/mall/address/list',
        },
        {
            path: '/activity/pages/clocked/ucenter',
        },
        {
            path: '/activity/pages/mall/address/edit',
        },
        {
            path: '/activity/pages/mall/order/edit',
        },
        {
            path: '/activity/pages/mall/order/detail',
        },
        {
            path: '/activity/pages/mall/order/list',
        },
        {
            path: '/activity/pages/mall/score/list',
        },
        {
            path: '/activity/pages/lottery/list',
        },
        {
            path: '/activity/pages/lottery/detail',
        },
        {
            path: '/activityA/pages/poetry/index',
        },
        {
            path: '/activity/pages/poetry/bgmusic',
        },
        {
            path: '/activityA/pages/poetry/level',
        },
        {
            path: '/activity/pages/poetry/clearance',
        },
        // 录音
        {
            path: '/activity/pages/poetry/soundRecord',
        },
        {
            path: '/pages/activity-pages/mywork/mywork',
        },

        {
            path: '/pages/login/login',
        },
        {
            path: '/pages/doc/notice/notice',
            name: 'notice',
            aliasPath: '/notice',
            component: () => import('@/pages/doc/notice/notice.vue'),
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
            name: 'news-list',
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
        {
            path: '/pages/work/label/list',
        },
        {
            path: '/pages/uc/setting/setting',
        },
        {
            path: '/pages/uc/setting/resetPassword',
        },
        {
            path: '/pages/uc/setting/resetPasswordResult',
        },
        {
            path: '/pages/uc/setting/resetName',
        },
        {
            path: '/pages/uc/setting/resetSchool',
        },
        {
            path: '/pages/uc/setting/resetClass',
        },
        {
            path: '/pages/uc/message/message',
        },
        {
            path: '/pages/uc/reported/reported',
        },
        {
            path: '/pages/uc/record/record',
        },
        {
            path: '/pages/uc/record/result',
        },
        {
            path: '/pages/uc/reported/result',
        },
        {
            path: '/pages/openGame/index',
        },
        {
            path: '/pages/openGame/rank',
        },
        {
            path: '/pages/openGame/myWork/myWork',
        },
        {
            path: '/pages/openGame/jingjiupload',
        },
        {
            path: '/pages/openGame/zhibo-list',
        },
        {
            path: '/pages/openGame/zhibo',
        },
        {
            path: '/pages/openGame/school-zhibo',
        },
        {
            path: '/pages/upload/default/upload',
        },
        {
            path: '/pages/activity/apply',
        },
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
    console.log('afterEach------');
});

// setTimeout(() => {
//  router.push({name:'router5'})
// }, 5000);

export default RouterMount;
