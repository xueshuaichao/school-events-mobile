<template>
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
</style>
