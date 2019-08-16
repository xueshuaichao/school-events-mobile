import { http } from './third-party/request';

function get(url, data) {
    return http.get(url, data).then((res) => {
        // http 异常
        if (res.statusCode !== 200) {
            throw new Error('服务器开小差了~');
        }

        if (res.data.status === 200) {
            return res.data.data;
        }

        throw new Error(res.data.msg);
    });
}

function post(url, data) {
    return http.post(url, data).then((res) => {
        // http 异常
        if (res.statusCode !== 200) {
            throw new Error('服务器开小差了~');
        }

        if (res.data.status === 200) {
            return res.data.data;
        }

        throw new Error(res.data.msg);
    });
}

export default {
    get,
    post,
};
