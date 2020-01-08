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
        const LSUserkey = utils.getToken();
        if (LSUserkey) {
            return resolve(LSUserkey);
        }
        if (!LSUserkey) {
            return get('/api/user/info').then(
                (res) => {
                    if (res && res.user_info && res.user_info.user_id) {
                        resolve(res);
                    } else {
                        reject();
                    }
                },
                () => {
                    reject();
                },
            );
        }
        return false;
    });
}

export default {
    get,
    post,
    isLogin,
};
