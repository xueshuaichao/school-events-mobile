const webpack = require('webpack');

const API_ENV = process.env.API_ENV || 'dev';
// const API_ENV = "test";
console.log('API ENV ---:');
console.log(API_ENV);

const HOST = {
    // dev: 'http://aitiaozhan.wdyclass.com:8000',
    dev: 'http://aitiaozhan.dev.wdyclass.com',
    test: 'http://aitiaozhan.test.wdyclass.com',
    online: 'https://aitiaozhan.wdyedu.com',
};

module.exports = {
    configureWebpack: () => ({
        plugins: [
            new webpack.DefinePlugin({
                SERVER_HOST: `"${HOST[API_ENV]}"`,
            }),
        ],
    }),
    transpileDependencies: ['uni-simple-router'],
};
