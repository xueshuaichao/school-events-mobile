function getToken() {
    let userKey = null;
    try {
        userKey = uni.getStorageSync('medusa_key');
    } catch (e) {
        userKey = null;
        // error
    }
    return userKey;
}

const store = {
    get: (key) => {
        try {
            const value = uni.getStorageSync(key);
            if (value) {
                return value;
            }
        } catch (e) {
            // error
        }
        return null;
    },
    set: (key, value) => {
        try {
            uni.setStorageSync(key, value);
            return true;
        } catch (e) {
            // error
        }
        return false;
    },
};

/**
 * 根据QueryString参数名称获取值
 */
function getQueryStringByName(searchStr, name) {
    const str = decodeURIComponent(searchStr);
    const result = str.match(new RegExp(`[?&]?${name}=([^&]+)`, 'i'));
    if (result == null || result.length < 1) {
        return '';
    }
    return result[1];
}

// 处理 onLoad 的参数 params
// 如果有 scene 从 scene 中解析参数，否则返回 params 中的参数
function getParam(params, name) {
    const { scene } = params;

    if (scene) {
        const value = getQueryStringByName(scene, name);
        if (value) {
            return value;
        }
    }
    return params[name];
}

// 获取当前日期
function isOverDate() {
    const myDate = new Date();
    let myArray = '';
    myArray += myDate.getFullYear();
    myArray
        += myDate.getMonth() + 1 > 9
            ? myDate.getMonth() + 1
            : `0${myDate.getMonth() + 1}`;
    myArray += myDate.getDate() > 9 ? myDate.getDate() : `0${myDate.getDate()}`;
    myArray
        += myDate.getHours() > 9 ? myDate.getHours() : `0${myDate.getHours()}`;
    myArray
        += myDate.getMinutes() > 9
            ? myDate.getMinutes()
            : `0${myDate.getMinutes()}`;
    myArray
        += myDate.getSeconds() > 9
            ? myDate.getSeconds()
            : `0${myDate.getSeconds()}`;
    console.log(parseFloat(myArray));
    return 20200530235959 - parseFloat(myArray) > 0;
}
function getAppType() {
    const u = navigator.userAgent;
    const isIOS = u.toLowerCase().indexOf('wd-atz-ios') !== -1;
    const isAndroid = u.toLowerCase().indexOf('wd-atz-android') !== -1;
    if (isIOS || isAndroid) {
        return isIOS ? 'ios' : 'android';
    }
    return null;
}

export default {
    getToken,
    store,
    getParam,
    isOverDate,
    // #ifdef H5
    getAppType,
    // #endif
};
