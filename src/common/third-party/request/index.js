/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import Request from "./request";
import conf from "../../config";
import utils from "../../utils";

const test = new Request();
test.setConfig(config => {
    /* 设置全局配置 */
    config.baseUrl = "http://www.aaa.cn";
    config.header = {
        a: 1,
        b: 2
    };
    return config;
});
test.interceptor.request((config, cancel) => {
    /* 请求之前拦截器 */
    config.header = {
        ...config.header,
        a: 1
    };
    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
        cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config;
});
// test.interceptor.response(response => /* 请求之后拦截器 */
//     response,
// );

const http = new Request();
http.setConfig(config => {
    /* 设置全局配置 */

    config.baseUrl = conf.host;

    config.header = {};
    return config;
});
http.interceptor.request((config, cancel) => {
    /* 请求之前拦截器 */

    config.header = {
        ...config.header
    };

    const userKey = utils.getToken();
    if (userKey) {
        config.header.userkey = userKey;
    }

    /*
    if (!token) { // 如果token不存在，调用cancel 会取消本次请求，但是该函数的catch() 仍会执行
        cancel('token 不存在') // 接收一个参数，会传给catch((err) => {}) err.errMsg === 'token 不存在'
    }
    */
    return config;
});
http.interceptor.response(
    response =>
        /* 请求之后拦截器 */
        response
    // if (response.data && response.data.status === 200) {
    //     return response.data.data;
    // }

    // if (response.statusCode !== 200) {
    //     return new Error('服务器开小差了');
    // }

    // throw new Error(response.data.msg);
);
export { http, test };
