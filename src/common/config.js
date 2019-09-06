/* eslint-disable no-undef */
// 进行 环境判断 时，dev 模式 process.env.NODE_ENV 的值为 development，
// build 模式 process.env.NODE_ENV 的值为 production。
// const API_ENV = process.env.API_ENV || 'dev';

console.log('api env:');
console.log(SERVER_HOST);

/* eslint-disable no-restricted-globals */
let host;

// #ifdef H5
host = `${location.protocol}//${location.host}`; /* 根域名不同 */
// #endif

// #ifndef H5
host = SERVER_HOST;
// #endif

export default {
    host,
};
