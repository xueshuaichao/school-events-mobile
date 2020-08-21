<template>
    <view class="page-bind-mobile">
        <template>
            <!-- 账号密码登录 -->
            <image
                class="logo"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/login_logo.png"
            />
            <!-- 帐号登录 -->
            <view class="title">
                忘记密码通过手机号重设密码
            </view>
            <view class="form-item-wrap">
                <image
                    class="icon"
                    src="/static/images/widgets/login/phone.png"
                />
                <input
                    v-model="formData.phone"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="11"
                    placeholder="请输入手机号"
                >
            </view>

            <view class="form-item-wrap">
                <image
                    class="icon"
                    src="/static/images/widgets/login/captcha.png"
                />
                <input
                    v-model="formData.captcha"
                    class="form-input captcha"
                    placeholder-class="placeholder"
                    maxlength="6"
                    placeholder="请输入验证码"
                >
                <view
                    v-if="!captcha.isSend"
                    class="send-captcha"
                    @click="sendCaptcha(3)"
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
            <view class="form-item-wrap">
                <image
                    class="icon"
                    src="/static/images/widgets/login/lock.png"
                />
                <input
                    v-model="formData.first_pwd"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="请输入密码"
                    password
                >
            </view>
            <view class="form-item-wrap">
                <image
                    class="icon"
                    src="/static/images/widgets/login/lock.png"
                />
                <input
                    v-model="formData.second_pwd"
                    class="form-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="请再次输入密码"
                    password
                >
            </view>
            <view class="login-mode">
                <view class="desc">
                    密码为6到32位的字母、数字、特殊字符的任意两种组合
                </view>
            </view>

            <view class="form-item-wrap">
                <view
                    class="btn login-btn"
                    @click="login()"
                >
                    提交
                </view>
            </view>
            <view class="forget-text">
                <navigator
                    url="/pages/login/login"
                    class="text"
                    open-type="navigateBack"
                >
                    返回登录
                </navigator>
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    data() {
        return {
            formData: {
                phone: '',
                captcha: '',
                first_pwd: '',
                second_pwd: '',
            },
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
            // eslint-disable-next-line no-useless-escape
            isPassword: /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*()_+`\-={}:";'<>?,.\/]+)$)^[\w~!@#$%^&*()_+`\-={}:";'<>?,.\/]{6,32}$/,
            isMobile: /^1[0-9]{10}$/,
            validateRule: [
                {
                    type: 'phone',
                    errorMsg: '请输入手机号',
                },
                {
                    type: 'phoneReg',
                    errorMsg: '请输入正确的手机号',
                },
                {
                    type: 'captcha',
                    errorMsg: '请输入验证码',
                },
                {
                    type: 'first_pwd',
                    errorMsg: '请输入密码',
                },
                {
                    type: 'first_pwd_reg',
                    errorMsg: '密码格式错误，请重新输入',
                },
                {
                    type: 'second_pwd',
                    errorMsg: '请再次确认密码',
                },
                {
                    type: 'second_pwd_reg',
                    errorMsg: '密码输入不一致，请重新输入',
                },
            ],
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    methods: {
        validate() {
            let status = true;
            try {
                this.validateRule.forEach((item) => {
                    const val = String(this.formData[item.type]).trim();
                    if (val === '') {
                        throw Error(item.type);
                    } else if (item.type === 'phone') {
                        if (!this.isMobile.test(this.formData.phone)) {
                            throw Error('phoneReg');
                        }
                    } else if (item.type === 'first_pwd') {
                        if (!this.isPassword.test(this.formData.first_pwd)) {
                            throw Error('first_pwd_reg');
                        }
                    } else if (item.type === 'second_pwd_reg') {
                        if (
                            this.formData.second_pwd !== this.formData.first_pwd
                        ) {
                            throw Error('second_pwd_reg');
                        }
                    }
                });
            } catch (e) {
                this.lock = false;
                status = false;
                const msg = this.validateRule.filter(
                    v => v.type === e.message,
                )[0].errorMsg;
                uni.showToast({
                    title: msg,
                    icon: 'none',
                });
            }
            return status;
        },
        login() {
            if (this.validate()) {
                this.doLogin();
            }
        },
        doLogin() {
            uni.showLoading({
                mask: true,
            });
            return api.post('/api/account/forgetpwd', this.formData).then(
                () => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '密码设置成功!',
                        icon: 'none',
                    });
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/login/login',
                        });
                    }, 2000);
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

        sendCaptcha(type) {
            //  1 注册 2-登录  3-找回密码 8-绑定手机号
            if (!this.isMobile.test(this.formData.phone)) {
                return uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none',
                });
            }

            return api
                .get('/api/account/sendcaptcha', {
                    phone: this.formData.phone,
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
    },
};
</script>

<style lang="less">
.page-bind-mobile {
    padding: 0 50upx 0;
    .title {
        text-align: center;
        color: #333;
        font-size: 28upx;
    }
    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }

    .login-mode {
        color: #1166ff;
        font-size: 30rpx;
        margin: 10upx 0;
        min-height: 40upx;
        text-align: center;
        .desc {
            padding: 20upx 0 40upx;
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
            width: 34rpx;
            height: 32rpx;
            left: 18rpx;
            top: 50%;
            margin-top: -16upx;
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
            &.is-send {
                color: #999;
            }
        }
    }

    .btn {
        width: 100%;
        background: #1166ff;
        color: #fff;
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 36rpx;
        border-radius: 55upx;
    }

    .logo {
        width: 316upx;
        height: 194upx;
        display: block;
        margin: 40upx auto 48upx;
    }

    .desc {
        color: #666;
        font-size: 24rpx;
    }
    .forget-text {
        color: #5f98ff;
        padding: 24upx 40upx;
        font-size: 28upx;
        .text {
            display: inline-block;
        }
    }
}
</style>
