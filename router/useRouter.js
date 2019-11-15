/* eslint-disable no-unused-vars */
import Vue from 'vue';
import Router, { RouterMount } from 'uni-simple-router';

Vue.use(Router);

const whitelist = {
    '/pages/tabBar/list/list': 'list',
    '/pages/tabbar/tabbar-2/tabbar-2': 'tabbar-2',
    '/pages/tabbar/tabbar-3/tabbar-3': 'tabbar-3',
    '/pages/tabbar/tabbar-4/tabbar-4': 'tabbar-4',
    '/pages/tabbar/tabbar-5/tabbar-5': 'tabbar-5',
};

const routesConfig = {
    h5: {
        loading: true,
        vueRouterDev: false,
        useUniConfig: true,
        resetStyle: () => ({
            style: `
            #router-loadding .loadding {
                background-color: #f00 !important;
                box-shadow: 0 0 15px #f00 !important;
            }
            `,
        }),
    },
    encodeURI: true,
    debugger: true,
    routes: [
        {
            path: '/pages/tabBar/index/index',
            name: 'index',
        },
        {
            path: '/pages/tabBar/list/list',
            name: 'list',
        },
        {
            path: '/pages/tabBar/upload/upload',
        },
        {
            path: '/pages/tabBar/uc/uc',
        },
        {
            path: '/pages/doc/detail/detail',
        },
        {
            path: '/pages/tabBar/upload/upload',
        },
        {
            path: '/pages/tabBar/upload/upload',
        },
        {
            path: '*',
            name: 'moddle',
            redirect: (to) => {
                console.log(to);
                const name = whitelist[to.path];
                if (name) {
                    return {
                        name,
                    };
                }
                return {
                    name: '404',
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
