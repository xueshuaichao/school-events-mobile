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

export default {
    getToken,
    store,
    getParam,
};
