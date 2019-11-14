<template>
    <view class="page-bind-mobile">
        <view class="tabs row">
            <view
                class="tab tab-login"
                :class="{ active: activeTab === 0 }"
                @click="activeTab = 0"
            >
                帐号登录
            </view>
            <view
                class="tab col tab-register"
                :class="{ active: activeTab === 1 }"
                @click="activeTab = 1"
            >
                手机号注册
            </view>
            <view class="col" />
        </view>

        <!-- 帐号登录 -->
        <template v-if="activeTab === 0">
            <view
                class="form-item-wrap"
                :class="{
                    inValid: accountData.isValid === false
                }"
            >
                <input
                    v-model="formData.username"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="请输入手机号"
                >
                <view class="error-tip">
                    {{ accountData.isValid ? "" : accountData.msg || "" }}
                </view>
            </view>

            <view
                v-if="loginMode === 'password'"
                class="form-item-wrap"
            >
                <input
                    v-model="formData.password"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="请输入密码"
                    password
                >
                <!-- <view
                        v-if="!captcha.isSend"
                        class="send-captcha"
                        @click="sendCaptcha"
                    >
                        获取验证码
                    </view> -->
                <view
                    v-if="captcha.isSend"
                    class="send-captcha is-send"
                >
                    {{ captcha.remain }}S后重新发
                </view>
            </view>

            <view
                v-if="loginMode !== 'password'"
                class="form-item-wrap"
            >
                <input
                    v-model="formData.password"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
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
                    {{ captcha.remain }}S后重新发
                </view>
            </view>
            <view class="login-mode">
                <view
                    v-if="loginMode === 'sms'"
                    @click="loginMode = 'password'"
                >
                    密码登录
                </view>
                <view
                    v-if="loginMode === 'password'"
                    @click="loginMode = 'sms'"
                >
                    短信验证码登录
                </view>
            </view>

            <view class="form-item-wrap">
                <view
                    class="btn login-btn"
                    @click="login()"
                >
                    确定
                </view>
            </view>
        </template>

        <!-- 手机号注册 -->
        <template v-if="activeTab === 1">
            <view class="form-item-wrap">
                <view class="form-item-wrap">
                    <input
                        v-model="newUser.phone"
                        class="form-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="请输入手机号"
                    >
                    <view class="error-tip">
                        {{ accountData.isValid ? "" : accountData.msg || "" }}
                    </view>
                </view>

                <input
                    v-model="newUser.captcha"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="请输入验证码"
                >
                <view
                    v-if="!captchaNewUser.isSend"
                    class="send-captcha"
                    @click="sendRegisterCaptcha()"
                >
                    获取验证码
                </view>
                <view
                    v-if="captchaNewUser.isSend"
                    class="send-captcha is-send"
                >
                    {{ captchaNewUser.remain }}S后重新发
                </view>
            </view>

            <view class="form-item-wrap">
                <view
                    class="btn login-btn"
                    @click="doRegister()"
                >
                    确定
                </view>
            </view>
        </template>
    </view>

    <!--
    -->
</template>

<script>
import api from '../../common/api';

export default {
    data() {
        return {
            formData: {
                username: '',
                password: '',
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
            activeTab: 0,
            loginMode: 'sms',
        };
    },
    methods: {
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
            return api.post('/api/account/login', this.formData).then(
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
        doSMSLogin() {
            console.log('sms login');
            return api
                .post('/api/account/userlogin', {
                    captcha: this.formData.password,
                    phone: this.formData.username,
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
                    phone: this.newUser.phone,
                    captcha: this.newUser.captcha,
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
                            if (this.activeTab === 0) {
                                this.captcha.create_at = new Date() - 0;
                                this.captcha.remain = 30;
                                this.captcha.isSend = true;
                                this.countDown();
                            } else {
                                this.captchaNewUser.create_at = new Date() - 0;
                                this.captchaNewUser.remain = 30;
                                this.captchaNewUser.isSend = true;
                                this.newUserCountDown();
                            }
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
    padding: 96rpx 65rpx;

    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }

    .login-mode {
        color: #1166ff;
        font-size: 30rpx;
        margin-top: 24rpx;
        text-align: right;
    }

    .tabs {
        margin-bottom: 80rpx;

        .tab {
            color: #999;
            font-size: 36rpx;
            padding-bottom: 24rpx;

            &.active {
                color: #1166ff;
                border-bottom: 4rpx solid #1166ff;
            }
        }

        .tab-login {
            text-align: center;
            width: 160rpx;
            margin-right: 80rpx;
        }
        .tab-register {
            width: 200rpx;
            text-align: center;
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
            font-size: 30rpx;
            border-bottom: 1rpx solid #d8d8d8;
            height: 90rpx;
            margin-top: 20rpx;
        }

        &.inValid {
            .form-input {
                border-bottom: 1rpx solid #fa6855;
            }
        }

        input::placeholder {
            color: #666;
        }

        .error-tip {
            color: #fa6855;
            font-size: 26rpx;
            height: 30rpx;
            margin-top: 10rpx;
        }

        .send-captcha {
            position: absolute;
            right: 0rpx;
            color: #1166ff;
            font-size: 30rpx;
            bottom: 25rpx;
            z-index: 100;

            &.is-send {
                color: #999;
                height: 50rpx;
                background: #eeeeee;
                padding: 0 10rpx;
                font-size: 28rpx;
                line-height: 50rpx;
            }
        }
    }

    .btn {
        width: 100%;
        background: #1166ff;
        color: #fff;
        height: 98rpx;
        line-height: 98rpx;
        text-align: center;
        margin-top: 72rpx;
        font-size: 36rpx;
    }
}
</style>
