<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            v-if="!needBindMobile"
            class="main"
        >
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

            <view class="show-type">
                <view class="show-type-hd">
                    <text class="show-type-text">
                        表现形式
                    </text>
                    <view class="show-type-list">
                        <text
                            v-for="(item, k) in tabs"
                            :key="k"
                            class="show-type-title"
                            :class="{
                                active: newsTabActiveIndex === k,
                                disabled: item.disabled
                            }"
                            @click="setNewsTabActive(k, item.disabled)"
                        >
                            {{ item.column_name }}
                        </text>
                    </view>
                </view>
            </view>

            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="11"
                    :placeholder="
                        (uploadMode === 'video' ? '视频' : '作品') +
                            '名称*（不超过11字）'
                    "
                >
            </view>

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                maxlength="80"
                :placeholder="
                    (uploadMode === 'video' ? '视频' : '作品') +
                        '介绍（不超过80字）'
                "
            />
            <template v-if="uploadMode !== ''">
                <template v-if="uploadMode === 'video'">
                    <upload
                        :type="'video'"
                        :source="formData.video_id"
                        @change="updateVideo"
                    />
                    <upload
                        :type="'image'"
                        :is-video="true"
                        :source="formData.video_img_url"
                        @change="updateImage"
                    />
                </template>

                <template v-if="uploadMode === 'image'">
                    <upload
                        :type="'image'"
                        :preview="false"
                        @change="updateImage"
                    />
                    <image-drag-sort
                        v-show="images.length"
                        ref="preview"
                        :list="images"
                    />
                </template>
            </template>
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
import imageDragSort from '../../../components/image-drag-sort/index.vue';

export default {
    components: {
        upload,
        imageDragSort,
    },
    data() {
        return {
            isLoading: true,
            type: '',
            tabs: [
                { id: '1', column_name: '视频', disabled: false },
                { id: '2', column_name: '图片', disabled: false },
            ],
            images: [],

            newsTabActiveIndex: 0,
            uploadMode: 'video',

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
            index: 0,
            lock: true,
            id: 0,
        };
    },
    created() {
        // this.getData();
    },
    onLoad(query) {
        this.type = query.type;
        // this.id = query.id;

        // if (this.id) {
        //     api.get('/api/works/detail', {id: this.id}).then((data) => {
        //         this.formData = {...this.formData, ...data};
        //         if (data.resource_type === 2) {
        //             this.uploadMode = 'image';
        //             this.newsTabActiveIndex = 1;
        //             this.formData.video_img_url = '';
        //             this.images = data.img;
        //         }
        //         this.formDate.resource_id = this.id;
        //     })
        // }
    },
    onShow() {
        this.getData();
    },
    methods: {
        resetData() {
            this.formData = {
                ...this.formData,
                cat_id: '',
                resource_name: '',
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
                img: [],
            };
            this.newsTabActiveIndex = 0;
            this.uploadMode = 'video';
            this.images = [];
        },
        setNewsTabActive(index, disable) {
            let Index = index;
            if (disable) {
                Index = 0;
            }
            this.newsTabActiveIndex = Index;
            if (Index === 0) {
                this.uploadMode = 'video';
                this.formData.video_img_url = '';
            } else {
                this.uploadMode = 'image';
                this.formData.video_img_url = '';
            }
        },
        updateVideo(data) {
            this.formData.video_id = data.video_id;
            this.formData.file_name = data.tempFilePath.substring(
                data.tempFilePath.lastIndexOf('/') + 1,
            );
            this.formData.file_size = data.size;
            this.formData.file_suffix = data.tempFilePath.split('.').pop() || '';
        },

        updateImage(data) {
            this.formData.video_img_url = data[0] && data[0].path;
            if (this.uploadMode === 'image') {
                data.forEach((item) => {
                    this.$refs.preview.add(item.path);
                });
                setTimeout(() => {
                    this.$refs.preview.init();
                }, 100);
            }
        },
        getData() {
            console.log(this.needBindMobile, '我要秀才艺');
            // this.isLoading = true;
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
                    this.isLoading = false;
                    this.needBindMobile = false;
                    // uni.switchTab({
                    //     url: '/pages/tabBar/uc/uc',
                    // });
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

        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            if (catId === 16 || catId === 18) {
                this.$set(this.tabs[1], 'disabled', true);
                this.setNewsTabActive(0, true);
            } else {
                this.$set(this.tabs[1], 'disabled', false);
            }
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
            if (this.lock) {
                this.lock = false;
                const formData = Object.assign({}, this.formData);

                if (this.uploadMode === 'video') {
                    formData.resource_type = 1;
                    if (!formData.resource_name) {
                        this.lock = true;
                        return this.errTip('请输入视频名称');
                    }
                    if (!formData.cat_id) {
                        this.lock = true;
                        return this.errTip('请选择视频分类');
                    }
                    if (!formData.video_id) {
                        this.lock = true;
                        return this.errTip('请上传视频文件');
                    }
                    // if (!formData.video_img_url) {
                    //     return this.errTip('请上传视频封面');
                    // }
                } else {
                    formData.resource_type = 2;
                    if (!formData.resource_name) {
                        this.lock = true;
                        return this.errTip('请输入作品名称');
                    }
                    if (!formData.cat_id) {
                        this.lock = true;
                        return this.errTip('请选择作品分类');
                    }
                    formData.img = this.$refs.preview.dump();
                    if (!formData.img.length) {
                        this.lock = true;
                        return this.errTip('请上传作品图片');
                    }
                }

                uni.showLoading();
                return api.isLogin().then(() => {
                    api.post('/api/user/editwork', formData).then(
                        () => {
                            uni.hideLoading();
                            if (this.type) {
                                uni.navigateTo({
                                    url:
                                        '/pages/upload/result/result?type=success&from=openGame',
                                });
                            } else {
                                uni.navigateTo({
                                    url:
                                        '/pages/upload/result/result?type=success',
                                });
                            }

                            this.resetData();
                            this.lock = true;
                        },
                        (err) => {
                            uni.hideLoading();
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                            this.lock = true;
                        },
                    );
                });
            }
            return true;
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const title = '青少年网络活动大赛';
        return {
            title,
            imageUrl:
                'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/logo-h5.png',

            path: '/pages/tabBar/index/index',
        };
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
        margin-top: 80upx;
    }

    .show-type-hd {
        margin: 0 0 40rpx 0;
        display: flex;
        align-items: center;
        .show-type-text {
            margin-right: 40upx;
            color: #999;
            font-size: 28upx;
        }
    }
    .show-type-title {
        margin-right: 30rpx;
        padding: 0 40rpx;
        height: 64rpx;
        line-height: 64rpx;
        color: #1166ff;
        border: 1rpx solid #1166ff;
        display: inline-block;
        &.active {
            background-color: #1166ff;
            color: #fff;
        }
        &.disabled {
            color: #eee;
            border-color: #eee;
        }
    }

    .upload-desc {
        font-size: 24rpx;
        color: #333;
        margin-bottom: 20rpx;
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
