// 进行 环境判断 时，dev 模式 process.env.NODE_ENV 的值为 development，
// build 模式 process.env.NODE_ENV 的值为 production。
const ENV = process.env.NODE_ENV;
const HOST = {
    development: 'http://aitiaozhan.wdyclass.com:8000',
    production: 'http://aitiaozhan.test.wdyclass.com:8000',
};

/* eslint-disable no-restricted-globals */
let host;

// #ifdef H5
host = `${location.protocol}//${location.host}`; /* 根域名不同 */
// #endif

// #ifndef H5
host = HOST[ENV];
// #endif

export default {
    host,
};
