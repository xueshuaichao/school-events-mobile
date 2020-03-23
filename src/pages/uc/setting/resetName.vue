<template>
    <div class="page-password">
        <form
            class="password-form"
            @submit="formSubmit"
        >
            <view class="uni-form-item uni-column">
                <view class="title">
                    姓名
                </view>
                <input
                    class="uni-input"
                    name="name"
                    type="text"
                    maxlength="10"
                    :value="userInfo.name"
                    placeholder="请输入您的姓名"
                >
            </view>
            <view class="uni-btn-v">
                <button form-type="submit">
                    保存
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
            userInfo: {},
        };
    },
    methods: {
        updataUser(data) {
            api.post('/api/user/updateuser', data).then(
                () => {
                    uni.navigateTo({
                        url: '/pages/uc/setting/setting',
                    });
                },
                (err) => {
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                },
            );
        },
        getData() {
            api.get('/api/user/info').then((res) => {
                this.userInfo = res.user_info;
            });
        },
        formSubmit(e) {
            const formdata = e.detail.value;
            this.updataUser(formdata);
        },
    },
    onLoad() {
        this.getData();
    },
    onShow() {
        this.getData();
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
    }
    .tips {
        font-size: 24upx;
        color: #999;
    }
    .blue-text {
        color: #1166ff;
    }
    .uni-btn-v {
        button {
            color: #fff;
            background-color: #1166ff;
            width: 690upx;
            height: 98upx;
            line-height: 98upx;
            font-size: 32upx;
            border-radius: 0;
            margin-top: 80upx;
        }
    }
}
</style>
