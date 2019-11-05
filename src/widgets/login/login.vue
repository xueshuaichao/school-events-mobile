<template>
    <view class="page-bind-mobile">
        <div class="tip">
            <!-- 上传作品需要绑定手机号，后面也可以用该手机号登录 -->
            账户登录
        </div>

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

        <view class="form-item-wrap">
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

        <view class="form-item-wrap">
            <view
                class="btn login-btn"
                @click="doLogin"
            >
                确定
            </view>
        </view>
    </view>
    <!--
    <view class="widget-login">

        <view class="main-title">
            <image
                class="icon-user"
                src="/static/images/widgets/login/user.png"
            />用户登录
        </view>
        <view class="input-wrap">
            <input
                v-model="formData.username"
                class="uni-input"
                placeholder="手机号或用户名"
            >
        </view>
        <view class="input-wrap">
            <input
                v-model="formData.password"
                class="uni-input"
                password
                placeholder="密码"
            >
        </view>
        <button
            type="primary"
            class="login-btn disabled"
            @click="doLogin"
        >
            登录
        </button>
    </view>
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
        };
    },
    methods: {
        doLogin() {
            if (!this.formData.username) {
                return uni.showToast({
                    title: '请输入账户名',
                    icon: 'none',
                });
            }
            if (!this.formData.password) {
                return uni.showToast({
                    title: '请输入密码',
                    icon: 'none',
                });
            }

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
    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }

    .form-item-wrap {
        padding: 0 65rpx;
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
            right: 65rpx;
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
        height: 98upx;
        line-height: 98upx;
        text-align: center;
        margin-top: 168upx;
    }
}
</style>
