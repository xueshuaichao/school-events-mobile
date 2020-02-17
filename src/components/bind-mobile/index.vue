<template>
    <view class="page-bind-mobile">
        <div class="tip">
            上传作品需要绑定手机号，后面也可以用该手机号登录
        </div>
        <view
            class="form-item-wrap"
            :class="{
                inValid: accountData.isValid === false
            }"
        >
            <input
                v-model="accountData.mobile"
                class="form-input"
                placeholder-class="placeholder"
                maxlength="30"
                placeholder="请输入手机号"
            >
            <view class="error-tip">
                {{ accountData.isValid ? "" : accountData.msg }}
            </view>
        </view>

        <view class="form-item-wrap">
            <input
                v-model="accountData.verify_code"
                class="form-input"
                placeholder-class="placeholder"
                maxlength="30"
                placeholder="请输入验证码"
            >
            <view
                v-if="!captcha.isSend"
                class="send-captcha"
                @click="sendCaptcha"
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

        <view class="form-item-wrap">
            <view
                class="btn"
                @click="bindMobile"
            >
                确定
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    components: {},
    data() {
        return {
            accountData: {
                mobile: '',
                verify_code: '',
                isValid: true,
                msg: '',
            },
            captcha: {
                create_at: '',
                remain: '',
                isSend: false,
            },
        };
    },
    methods: {
        bindMobile() {
            const { mobile } = this.accountData;
            const captcha = this.accountData.verify_code;

            console.log(mobile);
            if (mobile.length !== 11 || mobile[0] !== '1') {
                this.accountData.isValid = false;
                this.accountData.msg = '手机号码不正确';
                return false;
            }
            this.accountData.isValid = true;

            if (!captcha) {
                return uni.showToast({
                    icon: 'none',
                    title: '请输入验证码',
                });
            }
            const that = this;
            // api bind mobile
            return api
                .post('/api/account/bindphone', {
                    phone: mobile,
                    captcha,
                })
                .then(
                    () => {
                        uni.showToast({
                            icon: 'none',
                            title: '绑定成功！',
                            complete() {
                                setTimeout(() => {
                                    that.$emit('bindMobile');
                                }, 1500);
                            },
                        });
                    },
                    err => uni.showToast({
                        icon: 'none',
                        title: err.message,
                    }),
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
        sendCaptcha() {
            console.log('-000');
            this.captcha.create_at = new Date() - 0;
            this.captcha.remain = 30;
            this.captcha.isSend = true;

            // 切换绑定手机号接口
            api.get('/api/account/sendbindmsg', {
                phone: this.accountData.mobile,
            }).then(
                () => {
                    try {
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
    padding: 30rpx 60rpx 0;
    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }
    .login-mode {
        color: #1166ff;
        font-size: 30rpx;
        margin-top: 50rpx;
        height: 30rpx;
        text-align: center;
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
            width: 200rpx;
            margin-left: 60rpx;
            margin-right: 60rpx;
        }
        .tab-register {
            text-align: center;
            width: 240rpx;
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
            padding-left: 72rpx;
        }

        .icon {
            position: absolute;
            width: 34rpx;
            height: 32rpx;
            left: 20rpx;
            top: 30rpx;
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
        margin-top: 100rpx;
        font-size: 36rpx;
    }

    .logo {
        width: 438rpx;
        height: 264rpx;
        display: block;
        margin: 30rpx auto 60rpx;
    }

    .desc {
        color: #aaa;
        font-size: 32rpx;
    }
}
</style>
