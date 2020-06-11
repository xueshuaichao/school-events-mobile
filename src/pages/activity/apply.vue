<template>
    <div class="activity-apply-page">
        <view class="logo-img">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/apply_logo.png"
            />
        </view>
        <view>
            <form>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        学校名称
                    </view>
                    <input
                        v-model="formData.school_name"
                        class="uni-input"
                        placeholder-class="uni-placeholder"
                        maxlength="20"
                        placeholder="请输入学校名称（不超过20字）"
                    >
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        学校联系人
                    </view>
                    <input
                        v-model="formData.name"
                        class="uni-input"
                        placeholder-class="uni-placeholder"
                        maxlength="10"
                        placeholder="请输入学校联系人（不超过10字）"
                    >
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        联系人手机号
                    </view>
                    <input
                        v-model="formData.phone"
                        class="uni-input"
                        placeholder-class="uni-placeholder"
                        maxlength="13"
                        placeholder="请输入联系人手机号"
                    >
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        手机号验证码
                    </view>
                    <view class="uni-input-code">
                        <input
                            v-model="formData.verify_code"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="6"
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
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        活动名称
                    </view>
                    <input
                        v-model="formData.activity_name"
                        class="uni-input"
                        placeholder-class="uni-placeholder"
                        maxlength="30"
                        placeholder="请输入活动名称（不超过30字）"
                    >
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        活动描述
                    </view>
                    <textarea
                        v-model="formData.activity_desc"
                        class="uni-textarea"
                        maxlength="100"
                        placeholder-style="color:#999;"
                        placeholder="请描述活动主题、活动流程等细节（不超过100字）"
                    />
                </view>
                <view class="uni-btn-v">
                    <button @click="formSubmit">
                        提交
                    </button>
                </view>
            </form>
        </view>
    </div>
</template>
<script>
import api from '../../common/api';

export default {
    data() {
        return {
            formData: {
                school_name: '',
                name: '',
                phone: '',
                verify_code: '',
                activity_name: '',
                activity_desc: '',
            },
            isMobile: /^1[0-9]{10}$/,
            validateRule: [
                {
                    type: 'school_name',
                    errorMsg: '请输入学校名称',
                },
                {
                    type: 'name',
                    errorMsg: '请输入学校联系人',
                },
                {
                    type: 'phone',
                    errorMsg: '请输入正确的手机号',
                },
                {
                    type: 'verify_code',
                    errorMsg: '请输入验证码',
                },
                {
                    type: 'activity_name',
                    errorMsg: '请输入活动名称',
                },
                {
                    type: 'activity_desc',
                    errorMsg: '请描述活动主题、活动流程等细节',
                },
            ],
            captcha: {
                create_at: '',
                remain: '',
                isSend: false,
            },
        };
    },
    methods: {
        countDown() {
            const sep = 60 * 1000;
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
            if (!this.formData.phone) {
                return uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none',
                });
            }
            if (!this.isMobile.test(this.formData.phone)) {
                return uni.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none',
                });
            }
            this.captcha.create_at = new Date() - 0;
            this.captcha.remain = 60;
            this.captcha.isSend = true;

            api.get('/api/account/sendbindmsg', {
                phone: this.formData.phone,
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
            return true;
        },
        formSubmit() {
            if (!this.lock) {
                this.lock = true;
                if (this.validate()) {
                    api.post('/api/activity/schoolcommit', this.formData).then(
                        () => {
                            this.lock = false;
                            uni.showToast({
                                title: '提交成功',
                                icon: 'success',
                            });
                            this.resetData();
                        },
                        (err) => {
                            this.lock = false;
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                        },
                    );
                }
            }
        },
        validate() {
            let status = true;
            try {
                Object.keys(this.formData).forEach((item) => {
                    if (this.formData[item].trim() === '') {
                        throw Error(item);
                    } else if (item === 'phone') {
                        if (!this.isMobile.test(this.formData.phone)) {
                            throw Error(item);
                        }
                    }
                });
            } catch (e) {
                this.lock = false;
                status = false;
                uni.showToast({
                    title: this.validateRule.filter(
                        v => v.type === e.message,
                    )[0].errorMsg,
                    icon: 'none',
                });
            }
            return status;
        },
        resetData() {
            this.captcha.isSend = false;
            Object.keys(this.formData).forEach((item) => {
                this.formData[item] = '';
            });
        },
    },
};
</script>
<style lang="less" scoped>
.activity-apply-page {
    padding: 0 30upx 110upx;
    .logo-img {
        width: 284upx;
        height: 174upx;
        margin: 16upx auto 31upx;
        & > image {
            width: 100%;
            height: 100%;
        }
    }
    .uni-form-item {
        margin-bottom: 40upx;
        .title {
            color: #333;
            font-size: 30upx;
            line-height: 34upx;
            margin-bottom: 16upx;
        }
        .uni-input,
        .uni-textarea {
            border: 1px solid #ccc;
            border-radius: 4upx;
            font-size: 28upx;
            height: 88upx;
            padding: 0 24upx;
            box-sizing: border-box;
        }
        .uni-textarea {
            width: 100%;
            height: 277upx;
            padding: 21upx 24upx;
            box-sizing: border-box;
        }
        .uni-placeholder {
            color: #999;
            font-size: 28upx;
        }
        .uni-input-code {
            display: flex;
            .uni-input {
                width: 480upx;
                margin-right: 24upx;
            }
            .send-captcha {
                width: 186upx;
                height: 88upx;
                line-height: 88upx;
                border-radius: 4upx;
                background-color: #1166ff;
                color: #fff;
                text-align: center;
                &.is-send {
                    background-color: #ccc;
                }
            }
        }
    }
    .uni-btn-v {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        button {
            background-color: #1166ff;
            color: #fff;
            height: 108upx;
            line-height: 108upx;
            border-radius: 0;
        }
    }
}
</style>
