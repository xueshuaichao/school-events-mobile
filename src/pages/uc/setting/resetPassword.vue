<template>
    <div class="page-password">
        <form
            class="password-form"
            @submit="formSubmit"
        >
            <view class="uni-form-item uni-column">
                <view class="title">
                    用户名
                </view>
                <view class="uni-input">
                    43434
                </view>
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    原密码
                </view>
                <input
                    name="password"
                    class="uni-input"
                    password
                    type="text"
                    placeholder="填写原密码"
                >
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    新密码
                </view>
                <input
                    class="uni-input"
                    password
                    name="new_password"
                    type="text"
                    placeholder="填写新密码"
                >
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">
                    再次输入密码
                </view>
                <input
                    class="uni-input"
                    password
                    name="again_password"
                    type="text"
                    placeholder="再次填写确认"
                >
            </view>
            <view class="uni-column">
                <view>密码必须时8-16位的数字，字符组合（不能是纯数字）</view>
                忘记密码
            </view>
            <view class="uni-btn-v">
                <button form-type="submit">
                    提交
                </button>
            </view>
        </form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            password: '',
            new_password: '',
            again_password: '',
        };
    },
    methods: {
        formSubmit(e) {
            const formdata = e.detail.value;
            uni.showModal({
                content: `表单数据内容：${JSON.stringify(formdata)}`,
                showCancel: false,
            });
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
    }
}
</style>
