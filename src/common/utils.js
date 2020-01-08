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

export default {
    getToken,
    store,
};
