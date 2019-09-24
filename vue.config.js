const webpack = require('webpack');

const API_ENV = process.env.API_ENV || 'dev';
console.log('API ENV ---:');
console.log(API_ENV);

const HOST = {
    dev: 'http://aitiaozhan.wdyclass.com:8000',
    test: 'http://aitiaozhan.test.wdyclass.com:8000',
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
};
