const plugins = [];

if (process.env.UNI_PLATFORM === 'app-plus' && process.env.UNI_USING_V8) {
    const path = require('path');

    const isWin = /^win/.test(process.platform);

    const normalizePath = path => (isWin ? path.replace(/\\/g, '/') : path);

    const input = normalizePath(process.env.UNI_INPUT_DIR);
    try {
        plugins.push([
            require('@dcloudio/vue-cli-plugin-hbuilderx/packages/babel-plugin-console'),
            {
                file(file) {
                    const filePath = normalizePath(file);
                    if (filePath.indexOf(input) === 0) {
                        return path.relative(input, filePath);
                    }
                    return false;
                },
            },
        ]);
    } catch (e) {
        console.log(e);
    }
}

process.UNI_LIBRARIES = process.UNI_LIBRARIES || ['@dcloudio/uni-ui'];
process.UNI_LIBRARIES.forEach((libraryName) => {
    plugins.push([
        'import',
        {
            libraryName,
            customName: name => `${libraryName}/lib/${name}/${name}`,
        },
    ]);
});
module.exports = {
    presets: [
        [
            '@vue/app',
            {
                modules: 'commonjs',
                useBuiltIns:
                    process.env.UNI_PLATFORM === 'h5' ? 'usage' : 'entry',
            },
        ],
    ],
    plugins,
};
