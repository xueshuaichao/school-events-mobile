/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
import { http } from './third-party/request';
import utils from './utils';

function get(url, data) {
    return http.get(url, data).then(
        (res) => {
            // http 异常
            if (res.statusCode !== 200) {
                throw new Error('服务器开小差了~');
            }

            if (res.data.status === 200) {
                return res.data.data;
            }

            throw new Error(res.data.msg);
        },
        (err) => {
            console.log(err);
        },
    );
}

function pureGet(url, data) {
    return http.get(url, data).then(
        (res) => {
            // http 异常
            if (res.statusCode !== 200) {
                throw new Error('服务器开小差了~');
            }

            return res.data;
        },
        (err) => {
            console.log(err);
        },
    );
}

function post(url, data) {
    return http.post(url, data).then(
        (res) => {
            // http 异常
            if (res.statusCode !== 200) {
                throw new Error('服务器开小差了~');
            }

            if (res.data.status === 200) {
                return res.data.data;
            }
            if (res.data.status === 1402 && url === '/api/activity/vote') {
                throw new Error('今日点赞成功！明日再来');
            }
            throw new Error(res.data.msg);
        },
        (res) => {
            if (res.statusCode !== 200) {
                throw new Error('服务器开小差了~');
            }
        },
    );
}

// let callBackFn = null;
// function appLogin(type = 'ios', path = null, callback) {
//     const getData = (info) => {

//     };
//     // if (type === 'ios') {
//     //     window.webkit.messageHandlers.appLogin.postMessage(path);
//     // } else {
//     //     // eslint-disable-next-line no-undef
//     //     androidApp.appLogin(path);
//     // }
//     callBackFn = callback;
// }

function isLogin(params = {}) {
    let isH5 = false;
    const appType = utils.getAppType();
    // #ifdef H5
    isH5 = true;
    // #endif

    const { fr } = params;
    let query = '';
    if (fr) {
        query = `?fr=${fr}`;
    }
    if (isH5 && typeof appType !== 'object') {
        return new Promise((resolve, reject) => {
            window.getAppUserkey = (info) => {
                if (info) {
                    resolve(info);
                } else {
                    reject();
                }
            };

            if (appType === 'ios') {
                window.webkit.messageHandlers.appLogin.postMessage(null);
            } else {
                // eslint-disable-next-line no-undef
                androidApp.appLogin(null);
            }
        });
    }
    return new Promise((resolve, reject) => {
        if (isLogin.userInfo) {
            return resolve(isLogin.user_info);
        }

        return pureGet('/api/user/info').then(
            (res) => {
                const { data, status, msg } = res;

                if (status === 200) {
                    isLogin.userInfo = data.user_info;
                    resolve(data.user_info);
                } else if (status === 602) {
                    uni.navigateTo({
                        url: `/pages/login/login${query}`,
                    });
                    reject();
                } else {
                    uni.showToast({
                        title: msg,
                        icon: 'none',
                    });
                    reject();
                }
            },
            (err) => {
                // net work error
                console.log(err);
            },
        );
    });
}

function logout() {
    try {
        uni.removeStorageSync('medusa_key');
    } catch (e) {
        // error
        console.log(e);
    }
    isLogin.userInfo = null;
    return get('/api/account/logout');
}

export default {
    get,
    post,
    isLogin,
    logout,
};
