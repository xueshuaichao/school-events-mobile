/* eslint-disable no-restricted-globals */
let host;

// #ifdef H5
host = `${location.protocol}//${location.host}`; /* 根域名不同 */
// #endif

// #ifndef H5
host = 'http://aitiaozhan.wdyclass.com:8000';
// #endif

export default {
    host,
};
