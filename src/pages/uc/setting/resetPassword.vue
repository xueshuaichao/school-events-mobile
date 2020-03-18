<template>
    <div class="page-password">
        <form
            class="password-form"
            @submit="formSubmit"
        >
            <view class="uni-form-item uni-column">
                <view class="title">
                    手机号
                </view>
                <view class="input-flex">
                    <input
                        v-model="phone"
                        name="phone"
                        class="uni-input"
                        maxlength="11"
                        type="text"
                        placeholder="请输入手机号"
                    >
                </view>
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    验证码
                </view>
                <view class="input-flex get-captcha">
                    <input
                        v-model="captcha"
                        name="captcha"
                        class="uni-input captcha-input"
                        maxlength="6"
                        type="text"
                        placeholder="请输入验证码"
                    >
                    <view
                        v-if="!captchaAll.isSend"
                        class="send-captcha"
                        @click="sendCaptcha"
                    >
                        获取验证码
                    </view>
                    <view
                        v-if="captchaAll.isSend"
                        class="send-captcha is-send"
                    >
                        {{ captchaAll.remain }}s 后重新发
                    </view>
                </view>
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    新密码
                </view>
                <input
                    class="uni-input input-flex"
                    password
                    name="first_pwd"
                    type="text"
                    maxlength="16"
                    placeholder="请输入新密码"
                >
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    再次输入密码
                </view>
                <input
                    class="uni-input input-flex"
                    password
                    name="second_pwd"
                    maxlength="16"
                    type="text"
                    placeholder="请再次输入确认"
                >
            </view>
            <text class="psw-tips">
                密码必须时8-16位的数字，字符组合（不能是纯数字）
            </text>
            <view class="uni-btn-v">
                <button form-type="submit">
                    提交
                </button>
            </view>
        </form>
    </div>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            captcha: '',
            isMobile: /^1[0-9]{10}$/,
            isPassword: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
            phone: '',
            first_pwd: '',
            second_pwd: '',
            captchaText: '获取验证码',
            time: null,
            lock: true,
            captchaAll: {
                create_at: '',
                remain: '',
                isSend: false,
            },
        };
    },
    methods: {
        formSubmit(e) {
            if (this.lock) {
                this.lock = false;
                const formdata = e.detail.value;
                const keyArr = {
                    phone: '手机号',
                    captcha: '验证码码',
                    first_pwd: '密码',
                };
                if (formdata.phone && !this.isMobile.test(this.phone)) {
                    this.lock = true;
                    return uni.showToast({
                        title: '请输入正确的手机号',
                        icon: 'none',
                    });
                }
                try {
                    Object.keys(formdata).forEach((item) => {
                        if (!formdata[item]) {
                            throw Error(item);
                        }
                    });
                } catch (e) {
                    this.lock = true;
                    return uni.showToast({
                        title: `请输入${keyArr[e.message]}`,
                        icon: 'none',
                    });
                }
                if (
                    formdata.first_pwd
                    && !this.isPassword.test(formdata.first_pwd)
                ) {
                    this.lock = true;
                    return uni.showToast({
                        title: '密码格式错误，请重新输入',
                        icon: 'none',
                    });
                }
                if (formdata.first_pwd !== formdata.second_pwd) {
                    this.lock = true;
                    return uni.showToast({
                        title: '密码输入不一致，请重新输入',
                        icon: 'none',
                    });
                }
                api.post('/api/account/resetpassword', formdata).then(
                    () => {
                        this.lock = true;
                        uni.navigateTo({
                            url: '/pages/uc/setting/resetPasswordResult',
                        });
                    },
                    (err) => {
                        this.lock = true;
                        uni.showToast({
                            title: err.message,
                            icon: 'none',
                        });
                    },
                );
            }
            return true;
        },
        sendCaptcha() {
            //  1 注册 2-登录  3-找回密码 8-绑定手机号
            console.log('-000');
            if (this.lock) {
                this.lock = false;
                if (!this.phone) {
                    return uni.showToast({
                        title: '请输入手机号',
                        icon: 'none',
                    });
                }
                if (!this.isMobile.test(this.phone)) {
                    return uni.showToast({
                        title: '请输入正确的手机号',
                        icon: 'none',
                    });
                }

                return api
                    .get('/api/account/sendbindmsg', {
                        phone: this.phone,
                    })
                    .then(
                        () => {
                            try {
                                this.captchaAll.create_at = new Date() - 0;
                                this.captchaAll.remain = 30;
                                this.captchaAll.isSend = true;
                                this.countDown();
                            } catch (e) {
                                console.log(e);
                            }
                            this.lock = true;
                        },
                        (err) => {
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                            this.lock = true;
                        },
                    );
            }
            return true;
        },
        countDown() {
            const sep = 30 * 1000;
            const now = new Date() - 0;
            const duration = this.captchaAll.create_at + sep - now;

            if (duration > 0) {
                this.captchaAll.remain = Math.round(duration / 1000);

                setTimeout(() => {
                    this.countDown();
                }, 300);
            } else {
                this.captchaAll.isSend = false;
            }
        },
    },
};
</script>

<style lang="less">
.page-password {
    padding: 0 32upx;
    .uni-form-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1upx solid #ddd;
        height: 110upx;
        line-height: 110upx;
        font-size: 30upx;
    }
    .uni-input {
        height: 110upx;
        text-align: right;
        font-size: 28upx;
    }
    .input-flex {
        flex: 1;
        margin-left: 10upx;
    }
    .get-captcha {
        display: flex;
        .captcha-input {
            flex: 1;
        }
        .send-captcha {
            color: #1166ff;
            margin-left: 20upx;
            text-align: right;
        }
    }
    .psw-tips {
        color: #999;
        font-size: 24upx;
    }
    .uni-btn-v {
        button {
            margin-top: 80upx;
            color: #fff;
            background-color: #1166ff;
            width: 690upx;
            height: 98upx;
            line-height: 98upx;
            font-size: 32upx;
            border-radius: 0;
        }
    }
}
</style>
