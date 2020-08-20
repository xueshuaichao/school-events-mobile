/* eslint-disable no-undef */
<template>
    <view>
        <view class="page-bind-mobile">
            <template>
                <!-- 账号密码登录 -->
                <image
                    class="logo"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/login_logo.png"
                />
                <view class="tabs row">
                    <view
                        class="tab tab-register"
                        :class="{ active: loginMode === 'password' }"
                        @click="loginMode = 'password'"
                    >
                        帐号密码登录
                    </view>
                    <view
                        class="tab tab-login"
                        :class="{ active: loginMode === 'sms' }"
                        @click="loginMode = 'sms'"
                    >
                        手机号登录
                    </view>
                </view>

                <!-- 帐号登录 -->
                <template v-if="true">
                    <view
                        class="form-item-wrap"
                        :class="{
                            inValid: accountData.isValid === false
                        }"
                    >
                        <image
                            v-if="loginMode === 'password'"
                            class="icon"
                            src="/static/images/widgets/login/phone.png"
                        />
                        <image
                            v-if="loginMode === 'sms'"
                            class="icon"
                            src="/static/images/widgets/login/user.png"
                        />

                        <input
                            v-model="formData.username"
                            class="form-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            :placeholder="
                                loginMode === 'password'
                                    ? '请输入手机号或用户名'
                                    : '请输入手机号'
                            "
                        >
                    </view>
                    <view
                        v-if="loginMode === 'password'"
                        class="form-item-wrap"
                    >
                        <image
                            class="icon"
                            src="/static/images/widgets/login/lock.png"
                        />
                        <input
                            v-model="formData.password"
                            class="form-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="请输入密码"
                            password
                        >
                    </view>
                    <view
                        v-if="loginMode === 'password'"
                        class="forget-text"
                    >
                        <navigator
                            url="/pages/login/forget"
                            hover-class="className"
                        >
                            忘记密码
                        </navigator>
                    </view>
                    <view
                        v-if="loginMode === 'sms'"
                        class="form-item-wrap"
                    >
                        <image
                            class="icon"
                            src="/static/images/widgets/login/captcha.png"
                        />
                        <input
                            v-model="formData.password"
                            class="form-input captcha"
                            placeholder-class="placeholder"
                            maxlength="6"
                            placeholder="请输入验证码"
                        >
                        <view
                            v-if="!captcha.isSend"
                            class="send-captcha"
                            @click="sendCaptcha(2)"
                        >
                            获取验证码
                        </view>
                        <view
                            v-if="captcha.isSend"
                            class="send-captcha is-send"
                        >
                            {{ captcha.remain }}s 后重新发
                        </view>
                    </view>
                    <view
                        v-if="loginMode === 'sms'"
                        class="login-mode"
                    >
                        <view class="desc">
                            未注册手机号验证后即完成注册
                        </view>
                    </view>

                    <view class="form-item-wrap">
                        <view
                            class="btn login-btn"
                            :class="{ 'h5-btn': isH5 }"
                            @click="login()"
                        >
                            立即登录
                        </view>
                    </view>
                    <view
                        v-if="!isH5"
                        class="wx-login"
                    >
                        <view class="wx-login-text">
                            微信授权手机号登录
                        </view>
                        <button
                            class="weixin-login-btn"
                            type="primary"
                            open-type="getPhoneNumber"
                            withCredentials="true"
                            lang="zh_CN"
                            @getphonenumber="getphonenumber"
                        >
                            <image
                                class="wx-login-btn"
                                src="/static/images/uc/wx.png"
                            />
                        </button>
                    </view>
                    <view class="user-argement">
                        登录注册即代表您同意爱挑战
                        <navigator url="/pages/uc/argement/index">
                            《用户协议》
                        </navigator>
                    </view>
                </template>
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    props: {
        fr: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            formData: {
                username:
                    process.env.NODE_ENV === 'development' ? '13370123965' : '',
                password: process.env.NODE_ENV === 'development' ? '123456' : '',
            },
            newUser: {
                phone: '',
                captcha: '',
            },
            accountData: {},
            captcha: {
                create_at: '',
                remain: '',
                isSend: false,
            },
            captchaNewUser: {
                create_at: '',
                remain: '',
                isSend: false,
            },
            // #ifdef H5
            isH5: true,
            // #endif
            // loginMode: 'sms',
            loginMode: 'password',
            // needBindMobile: false,
            userInfo: {},
            userkey: '',
            isCanUse: uni.getStorageSync('isCanUse') || true,
            weixinData: {
                code: '',
            },
            jscode: '',
        };
    },
    created() {
        if (!this.isH5) {
            this.getCode();
        }
    },
    methods: {
        getLogIn() {
            uni.getStorage({
                key: 'medusa_key',
                success(res) {
                    console.log(res.data);
                },
            });
        },
        login() {
            if (!this.formData.username) {
                return uni.showToast({
                    title: `请输入${
                        this.loginMode === 'password' ? '用户名' : '手机号'
                    }`,
                    icon: 'none',
                });
            }
            if (!this.formData.password) {
                return uni.showToast({
                    title: `请输入${
                        this.loginMode === 'password' ? '密码' : '验证码'
                    }`,
                    icon: 'none',
                });
            }
            if (this.loginMode === 'password') {
                this.doLogin();
            } else {
                this.doSMSLogin();
            }
            return true;
        },
        doLogin() {
            uni.showLoading({
                mask: true,
            });
            return api.post('/api/account/login', this.formData).then(
                (res) => {
                    uni.hideLoading();
                    console.log(res);
                    const { userkey } = res;
                    try {
                        uni.setStorageSync('medusa_key', userkey);
                    } catch (e) {
                        // error
                    }
                    // 看是否是陕西用户
                    this.getUserInfo();
                },
                (err) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: err.message,
                        icon: 'none',
                    });
                },
            );
        },
        getUserInfo() {
            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info
                        && res.user_info.is_bind_mobile === 0
                        && res.user_info.shop_id === 1;
                    if (this.needBindMobile) {
                        uni.navigateTo({
                            url: '/history/yiqing/bind-mobile/index',
                        });
                    } else {
                        this.userInfo = res;
                        this.$emit('login', res);
                    }
                },
                () => {},
            );
        },
        doSMSLogin() {
            console.log('sms login');
            uni.showLoading({
                mask: true,
            });
            return api
                .post('/api/account/userlogin', {
                    channel: 'aitiaozhan/xian',
                    captcha: this.formData.password,
                    phone: this.formData.username,
                    fr: this.fr,
                })
                .then(
                    (res) => {
                        uni.hideLoading();
                        console.log(res);
                        const { userkey } = res;
                        try {
                            uni.setStorageSync('medusa_key', userkey);
                        } catch (e) {
                            // error
                        }
                        // console.log(res)
                        // this.$emit('login', res);
                        this.getUserInfo();
                    },
                    (err) => {
                        uni.hideLoading();
                        uni.showToast({
                            title: err.message,
                            icon: 'none',
                        });
                    },
                );
        },
        doRegister() {
            if (!this.newUser.phone) {
                return uni.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                });
            }
            if (!this.newUser.captcha) {
                return uni.showToast({
                    title: '请输入验证码',
                    icon: 'none',
                });
            }
            return api
                .post('/api/account/userlogin', {
                    channel: 'aitiaozhan/xian',
                    phone: this.newUser.phone,
                    captcha: this.newUser.captcha,
                    fr: this.fr,
                })
                .then(
                    (res) => {
                        console.log(res);
                        const { userkey } = res;
                        try {
                            uni.setStorageSync('medusa_key', userkey);
                        } catch (e) {
                            // error
                        }

                        this.$emit('login', res);
                    },
                    (err) => {
                        uni.showToast({
                            title: err.message,
                            icon: 'none',
                        });
                    },
                );
        },

        countDown() {
            const sep = 30 * 1000;
            const now = new Date() - 0;
            const duration = this.captcha.create_at + sep - now;

            if (duration > 0) {
                this.captcha.remain = Math.round(duration / 1000);

                setTimeout(() => {
                    this.countDown();
                }, 300);
            } else {
                this.captcha.isSend = false;
            }
        },

        newUserCountDown() {
            const sep = 30 * 1000;
            const now = new Date() - 0;
            const duration = this.captchaNewUser.create_at + sep - now;

            if (duration > 0) {
                this.captchaNewUser.remain = Math.round(duration / 1000);

                setTimeout(() => {
                    this.newUserCountDown();
                }, 300);
            } else {
                this.captchaNewUser.isSend = false;
            }
        },
        sendRegisterCaptcha() {
            console.log(this.newUser);
            if (!this.newUser.phone) {
                return uni.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                });
            }

            return api
                .get('/api/account/sendcaptcha', {
                    phone: this.newUser.phone,
                    type: 2,
                    code: 12345,
                    is_mobile: 1,
                })
                .then(
                    () => {
                        try {
                            this.captchaNewUser.create_at = new Date() - 0;
                            this.captchaNewUser.remain = 30;
                            this.captchaNewUser.isSend = true;
                            this.newUserCountDown();
                        } catch (e) {
                            console.log(e);
                        }
                    },
                    err => uni.showToast({
                        icon: 'none',
                        title: err.message,
                    }),
                );
        },

        sendCaptcha(type) {
            //  1 注册 2-登录  3-找回密码 8-绑定手机号
            console.log('-000');
            if (!this.formData.username) {
                return uni.showToast({
                    title: '请输入手机号',
                    icon: 'none',
                });
            }

            return api
                .get('/api/account/sendcaptcha', {
                    phone: this.formData.username,
                    type,
                    code: 12345,
                    is_mobile: 1,
                })
                .then(
                    () => {
                        try {
                            this.captcha.create_at = new Date() - 0;
                            this.captcha.remain = 30;
                            this.captcha.isSend = true;
                            this.countDown();
                        } catch (e) {
                            console.log(e);
                        }
                    },
                    err => uni.showToast({
                        icon: 'none',
                        title: err.message,
                    }),
                );
        },
        getCode(fn) {
            const _this = this;
            uni.login({
                provider: 'weixin',
                success({ code }) {
                    // console.log(5454545);
                    _this.jscode = code;
                    console.log(code);
                    if (fn) {
                        fn();
                    }
                },
                fail() {
                    uni.showToast({
                        title: '登录失败',
                    });
                },
            });
        },
        checkSession({ encryptedData, iv }) {
            const _this = this;
            uni.checkSession({
                success() {
                    // session_key 未过期，并且在本生命周期一直有效
                    _this.onGetPhoneNumber(encryptedData, iv);
                },
                fail() {
                    // session_key 已经失效，需要重新执行登录流程
                    _this.getCode(() => {
                        _this.onGetPhoneNumber(encryptedData, iv);
                    });
                },
            });
        },
        getphonenumber(e) {
            const { errMsg } = e.detail;
            if (errMsg === 'getPhoneNumber:ok') {
                this.checkSession(e.detail);
            }
        },
        onGetPhoneNumber(encryptedData, iv) {
            const _this = this;
            api.post('/api/account/miniprogramlogin', {
                code: this.jscode,
            }).then(
                (res) => {
                    const { userkey } = res;
                    if (res.is_bind) {
                        try {
                            uni.setStorageSync('medusa_key', userkey);
                        } catch (e) {
                            // error
                        }
                        _this.getUserInfo();
                        uni.hideLoading();
                    } else {
                        api.post('/api/account/getminipprogramphone', {
                            encrypted_data: encryptedData,
                            iv,
                            userkey,
                        }).then(
                            (data) => {
                                // 统计活动注册
                                // eslint-disable-next-line no-undef
                                wx.reportAnalytics('readregister', {
                                    num: 1,
                                    type: this.fr,
                                });

                                try {
                                    uni.setStorageSync(
                                        'medusa_key',
                                        data.userkey,
                                    );
                                } catch (e) {
                                    // error
                                }
                                _this.getUserInfo();
                                uni.hideLoading();
                            },
                            () => {
                                uni.hideLoading();
                            },
                        );
                    }
                },
                () => {
                    // eslint-disable-next-line no-undef
                    const page = getCurrentPages().pop();
                    if (!page) return;
                    page.onLoad();
                    uni.hideLoading();
                },
            );
        },
    },
};
</script>

<style lang="less">
.widget-login {
    padding: 65upx;
    .icon-user {
        display: inline-block;
        width: 58upx;
        height: 58upx;
        margin-right: 30upx;
        position: relative;
        top: 20upx;
    }

    .main-title {
        color: #333;
        font-size: 36upx;
        text-align: center;
        margin-bottom: 76upx;
    }

    .uni-input {
        // line-height: 94upx;
        line-height: 38upx;
        height: 94upx;
        border: 1px solid #ccc;
        font-size: 36upx;
        margin-bottom: 48upx;
        padding: 0 50upx;
    }

    .login-btn {
        margin-top: 72upx;
        font-size: 36upx;
        border-radius: 0;

        &.disabled {
            background: #1166ff;
        }
    }
}
.page-bind-mobile {
    padding: 0 50upx 0;
    .weixin-login {
        padding-top: 168upx;
        font-size: 36upx;
        text-align: center;
    }
    .login-text {
        width: 540upx;
        margin: 0 auto 60upx;
        color: #666;
        line-height: 60upx;
    }
    .weixin-login-btn {
        width: 80upx;
        height: 80upx;
        margin: 0 auto 30upx;
        background-color: rgba(0, 0, 0, 0);
        border-radius: 0;
        line-height: 100upx;
        color: #fff;
        padding: 0;
        border: 0 none;
        &:after {
            border: 0 none;
        }
    }
    .no-text {
        color: #999990;
    }
    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }

    .login-mode {
        color: #1166ff;
        font-size: 28rpx;
        min-height: 40upx;
        text-align: center;
        .desc {
            padding: 24upx 0 56upx;
        }
    }

    .tabs {
        margin: 0 auto 80upx;
        justify-content: flex-start;
        .tab {
            color: #666;
            font-size: 28upx;
            line-height: 50upx;
            &:first-of-type {
                margin-right: 40upx;
            }
            &.active {
                color: #333;
                font-size: 50upx;
                font-weight: 600;
            }
        }
    }

    .row {
        display: flex;

        .col {
            flex: 1;
        }
    }

    .form-item-wrap {
        position: relative;

        .form-input {
            color: #333;
            font-size: 36upx;
            border-radius: 55px;
            height: 96upx;
            background-color: #f5f5f5;
            margin-top: 30rpx;
            padding-left: 70rpx;
            &.captcha {
                width: 400upx;
                box-sizing: border-box;
            }
        }

        .icon {
            position: absolute;
            width: 44rpx;
            height: 44rpx;
            left: 18rpx;
            top: 50%;
            margin-top: -22upx;
        }

        &.inValid {
            .form-input {
                border-bottom: 1rpx solid #d8d8d8;
            }
        }

        .placeholder {
            color: #d8d8d8;
            font-size: 36upx;
        }

        .error-tip {
            color: #fa6855;
            font-size: 24rpx;
            height: 30rpx;
            margin-top: 10rpx;
        }

        .send-captcha {
            position: absolute;
            right: 0rpx;
            color: #5e6166;
            font-size: 28rpx;
            top: 50%;
            margin-top: -48upx;
            z-index: 100;
            border: 2upx solid #e8e8eb;
            border-radius: 55upx;
            display: block;
            width: 220upx;
            height: 96upx;
            line-height: 96upx;
            text-align: center;
            box-sizing: border-box;
            &.is-send {
                color: #999;
            }
        }
    }
    .forget-text {
        color: #5f98ff;
        padding: 24upx 40upx 56upx;
        font-size: 28upx;
    }
    .user-argement {
        display: flex;
        justify-content: center;
        font-size: 26rpx;
        color: #999;
        navigator,
        uni-navigator {
            color: #0086ff;
        }
    }

    .btn {
        width: 100%;
        background: #1166ff;
        color: #fff;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        margin-bottom: 60upx;
        font-size: 36rpx;
        border-radius: 55upx;
        &.h5-btn {
            margin-top: 100rpx;
        }
    }

    .logo {
        width: 316upx;
        height: 194upx;
        display: block;
        margin: 40upx auto 48upx;
    }

    .desc {
        color: #aaa;
        font-size: 28rpx;
    }
    .wx-login-text {
        color: #666;
        font-size: 32upx;
        line-height: 1;
        margin-bottom: 32upx;
        text-align: center;
        position: relative;
        &::before,
        &::after {
            content: "";
            height: 1upx;
            width: 100upx;
            background-color: #666;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        &::before {
            left: 50upx;
        }
        &::after {
            right: 50upx;
        }
    }
    .wx-login-btn {
        width: 80upx;
        height: 80upx;
        margin: 0 auto 40upx;
        display: block;
    }
}
</style>
