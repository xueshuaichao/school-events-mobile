<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view class="main">
            <view class="selection bb-sep">
                <view class="label">
                    选择组别
                </view>
                <view class="items">
                    <text
                        v-for="(item, k) in tabs"
                        :key="item.id"
                        class="item"
                        :class="{ active: formData.activity_cat === k + 1 }"
                        @click="setNewsTabActive(k + 1)"
                    >
                        {{ item.column_name }}
                    </text>
                </view>
            </view>

            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    placeholder-style="color:#A6CBBC"
                    maxlength="30"
                    placeholder="视频名称*（不超过30字）"
                >
            </view>

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                placeholder-style="color:#A6CBBC"
                maxlength="80"
                placeholder="视频介绍（不超过80字）"
            />
            <template v-if="uploadMode !== ''">
                <upload
                    :type="'video'"
                    :source="formData.video_id"
                    theme="blue"
                    @change="updateVideo"
                />
                <upload
                    :type="'image'"
                    :is-video="true"
                    :source="formData.video_img_url"
                    theme="blue"
                    @change="updateImage"
                />
            </template>

            <view
                class="btn"
                @click="upload"
            >
                上传
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
            tabs: [
                { id: '1', column_name: '中文组' },
                { id: '2', column_name: '英文组' },
            ],

            newsTabActiveIndex: 0,
            uploadMode: 'video',

            formData: {
                activity_id: 6,
                activity_cat: 1,
                resource_name: '',
                resource_type: 1,
                cat_id: 18,
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
            index: 0,
            lock: true,
            // 编辑
            id: '',
        };
    },
    onLoad(params) {
        this.id = params.id;
        if (this.id) {
            uni.setNavigationBarTitle({ title: '编辑作品' });
        }
        this.getItemData();
    },
    created() {
        // this.getData();
    },
    onShow() {
        this.getData();
    },
    methods: {
        // 编辑作品
        getItemData() {
            if (this.id) {
                api.get('/api/activity/info', {
                    id: this.id,
                    activity_id: 6,
                }).then((res) => {
                    this.isLoading = false;
                    console.log(res);
                    this.formData = {
                        ...this.formData,
                        ...res,
                    };
                    console.log(this.formData);
                });
            }
        },
        resetData() {
            this.formData = {
                ...this.formData,
                activity_id: 6,
                activity_cat: 1,
                resource_name: '',
                resource_type: 1,
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
            };
            this.newsTabActiveIndex = 0;
        },
        setNewsTabActive(index) {
            this.formData.activity_cat = index;
        },
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data[0] && data[0].path;
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info && res.user_info.is_bind_mobile === 0;
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                    this.needBindMobile = false;
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
            if (this.lock) {
                this.lock = false;
                if (this.disabled) {
                    return false;
                }
                const formData = Object.assign({}, this.formData);
                // 移除首尾空格
                formData.resource_name = formData.resource_name.replace(
                    /(^\s*)|(\s*$)/g,
                    '',
                );

                formData.resource_type = 1;
                if (!formData.resource_name) {
                    this.lock = true;
                    return this.errTip('请输入视频名称');
                }
                if (!formData.video_id) {
                    this.lock = true;
                    return this.errTip('请上传视频文件');
                }

                uni.showLoading();
                this.disabled = true;
                let apiUrl = '/api/activity/add';
                if (this.id) {
                    apiUrl = '/api/activity/edit';
                }
                // check input
                return api.post(apiUrl, formData).then(
                    () => {
                        this.disabled = false;
                        uni.hideLoading();
                        uni.navigateTo({
                            url: '/pages/read/upload/result',
                        });
                        this.resetData();
                        this.lock = true;
                    },
                    (err) => {
                        this.disabled = false;
                        this.lock = true;
                        uni.hideLoading();
                        uni.showToast({
                            icon: 'none',
                            title: err.message,
                        });
                    },
                );
            }
            return true;
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const titleList = ['4.23世界读书日，读书赢好礼，一起来读书吧！'];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http: //aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png',
            path: '/pages/read/index',
        };
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    .main {
        min-height: 100vh;
        box-sizing: border-box;
        padding: 30rpx;
        background: #a1debe;
        color: #fff;
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

    .bt-sep {
        margin-top: 40rpx;
    }

    .uni-input,
    .uni-textarea {
        // border: 1upx solid #ccc;
        margin-bottom: 40rpx;
        font-size: 28rpx;
        background: #0f8c64;
        border-radius: 12rpx;
        color: #fff;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #fff;

        .cover-wrap {
            background: #0f8c64;

            .icon-desc {
                color: #0f8c64;
            }
        }

        .desc {
            color: #0f8c64;
            line-height: 32upx;
            &.image {
                line-height: 32upx;
            }
        }
        .normal-text {
            display: inline-flex;
            background-color: #0f8c64;
            border-radius: 25upx;
            padding: 0 29upx;
            height: 40upx;
            line-height: 40upx;
            font-size: 24upx;
            margin-top: 4upx;
        }
        .comp-title {
            color: #0f8c64;
        }
        .text-success {
            color: #fff;
        }
        .tips {
            color: #0f8c64;
        }
    }

    /deep/ .placeholder {
        color: #6691ff;
        font-size: 28upx;
    }

    .btn {
        width: 100%;
        color: #fff;
        height: 110rpx;
        line-height: 110rpx;
        text-align: center;
        margin-top: 168rpx;
        background: #0f8c64;
        border-radius: 55px;
    }

    .panel-hd {
        margin: 0 0 40rpx 0;
        text-align: center;
    }

    .upload-desc {
        font-size: 24rpx;
        color: #c9ac67;
        margin-bottom: 20rpx;
    }

    .selection {
        font-size: 28rpx;

        .label {
            color: #08402f;
            margin-bottom: 15rpx;
        }

        .items {
            margin-right: -20rpx;
        }

        .item {
            // width: 110rpx;
            padding: 0 44rpx;
            height: 56rpx;
            line-height: 56rpx;
            border: 1px solid #0f8c64;
            border-radius: 28rpx;
            display: inline-block;
            margin-right: 20rpx;
            text-align: center;
            color: #0f8c64;
            margin-bottom: 30rpx;

            &.active {
                background: #0f8c64;
                color: #fff;
            }
        }
    }
}
</style>
