<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            v-if="!needBindMobile"
            class="main"
        >
            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="视频名称*（不超过30字）"
                >
            </view>

            <view class="uni-list-cell-db">
                <picker
                    :value="index"
                    :range="catData"
                    :range-key="'name'"
                    @change="onSelect"
                >
                    <view
                        v-if="!formData.cat_id"
                        class="uni-input placeholder fake-input"
                    >
                        选择分类
                    </view>
                    <view
                        v-if="formData.cat_id"
                        class="uni-input fake-input"
                    >
                        {{ catData[index].name }}
                    </view>
                </picker>
            </view>

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                placeholder="视频介绍（不超过500字）"
            />
            <upload
                :type="'video'"
                @change="updateVideo"
            />
            <upload
                :type="'image'"
                @change="updateImage"
            />

            <view
                class="btn"
                @click="upload"
            >
                上传
            </view>
        </view>
        <view
            v-if="needBindMobile"
            class="page-bind-mobile"
        >
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
    </view>
</template>

<script>
import api from '../../../common/api';
import upload from '../../../components/upload/upload.vue';

export default {
    components: {
        upload,
    },
    data() {
        return {
            isLoading: true,

            formData: {
                cat_id: '',
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
            },
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
            needBindMobile: false,
            catData: [],
            title: 'picker',
            array: ['中国', '美国', '巴西', '日本'],
            index: 0,
            time: '12:01',
        };
    },
    onLoad() {},
    created() {
        // this.getData();
    },
    onShow() {
        this.getData();
    },
    methods: {
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data.path;
        },
        getData() {
            this.isLoading = true;
            api.get('/api/works/childcat', {
                cat_id: 3,
            }).then((res) => {
                this.catData = res;
            });

            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info && res.user_info.is_bind_mobile === 0;
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = true;
                    uni.switchTab({
                        url: '/pages/tabBar/uc/uc',
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

        sendCaptcha() {
            console.log('-000');
            this.captcha.create_at = new Date() - 0;
            this.captcha.remain = 30;
            this.captcha.isSend = true;

            api.get('/api/account/sendcaptcha', {
                phone: this.accountData.mobile,
                type: 8,
                is_mobile: 1,
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

        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            console.log(this.formData);
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
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

            // api bind mobile
            return api
                .post('/api/account/bindphone', {
                    phone: mobile,
                    captcha,
                })
                .then(
                    () => {
                        this.needBindMobile = false;
                        return uni.showToast({
                            icon: 'none',
                            title: '绑定成功！',
                        });
                    },
                    err => uni.showToast({
                        icon: 'none',
                        title: err.message,
                    }),
                );
        },
        upload() {
            const formData = Object.assign({}, this.formData);
            if (!formData.resource_name) {
                return this.errTip('请输入视频名称');
            }
            if (!formData.cat_id) {
                return this.errTip('请选择视频分类');
            }
            // if (!formData.introduce) {
            //     return this.errTip('请填写视频介绍');
            // }

            if (!formData.video_id) {
                return this.errTip('请上传视频文件');
            }
            if (!formData.video_img_url) {
                return this.errTip('请上传视频封面');
            }

            // check input
            console.log(this.formData);
            return api.post('/api/user/editwork', formData).then(
                (res) => {
                    console.log(res);
                    uni.navigateTo({
                        url: '/pages/upload/result/result?type=success',
                    });
                },
                err => uni.showToast({
                    icon: 'none',
                    title: err.message,
                }),
                // uni.navigateTo({
                //     url: '/pages/upload/result/result?type=fail',
                // });
            );
        },
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    .main {
        padding: 40upx 30upx;
    }

    .uni-input {
        height: 88upx;
        box-sizing: border-box;
        line-height: 38upx;
        padding-left: 24upx;
    }

    .uni-textarea {
        height: 190upx;
        padding: 30upx 20upx;
        width: 100%;
        box-sizing: border-box;
        line-height: 42upx;
    }

    .fake-input {
        padding-top: 26upx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        margin-bottom: 40upx;
        font-size: 28upx;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
    }

    /deep/ .placeholder {
        color: #999;
        font-size: 28upx;
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
}
</style>
