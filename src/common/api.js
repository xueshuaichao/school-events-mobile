import { http } from './third-party/request';

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

            throw new Error(res.data.msg);
        },
        (res) => {
            if (res.statusCode !== 200) {
                throw new Error('服务器开小差了~');
            }
        },
    );
}

function isLogin() {
    return new Promise((resolve, reject) => {
        if (isLogin.userInfo) {
            return resolve(isLogin.user_info);
        }

        return get('/api/user/info').then(
            (res) => {
                if (res && res.user_info && res.user_info.user_id) {
                    isLogin.userInfo = res.user_info;
                    resolve(res.user_info);
                } else {
                    uni.navigateTo({
                        url: '/pages/login/login',
                    });
                    reject();
                }
            },
            () => {
                uni.navigateTo({
                    url: '/pages/login/login',
                });
                reject();
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
