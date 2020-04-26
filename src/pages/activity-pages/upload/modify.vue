<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            class="main"
            :style="{ background: publicConfig.mainBgColor }"
        >
            <view
                v-if="uploadConfig.activityCat.length"
                class="selection bb-sep"
            >
                <view
                    class="label"
                    :style="{ color: publicConfig.primaryColor }"
                >
                    选择组别
                </view>
                <view class="items">
                    <text
                        v-for="(item, k) in uploadConfig.activityCat"
                        :key="k"
                        class="item"
                        :class="{ active: formData.activity_cat === k + 1 }"
                        :style="{
                            'border-color': publicConfig.primaryColor,
                            'background-color':
                                formData.activity_cat === k + 1
                                    ? publicConfig.primaryColor
                                    : '',
                            color:
                                formData.activity_cat === k + 1
                                    ? '#fff'
                                    : publicConfig.primaryColor
                        }"
                        @click="setActivityCat(k + 1)"
                    >
                        {{ item }}
                    </text>
                </view>
            </view>
            <view
                v-if="uploadConfig.uploadMode.length > 1"
                class="selection bb-sep"
            >
                <view
                    class="label"
                    :style="{ color: publicConfig.primaryColor }"
                >
                    表现形式
                </view>
                <view class="items">
                    <text
                        v-for="(item, k) in uploadConfig.uploadMode"
                        :key="k"
                        class="item"
                        :class="{ active: formData.resource_type === k + 1 }"
                        :style="{
                            'border-color': publicConfig.primaryColor,
                            'background-color':
                                formData.resource_type === k + 1
                                    ? publicConfig.primaryColor
                                    : '',
                            color:
                                formData.resource_type === k + 1
                                    ? '#fff'
                                    : publicConfig.primaryColor
                        }"
                        @click="setNewsTabActive(k + 1)"
                    >
                        {{ item === "video" ? "视频" : "图片" }}
                    </text>
                </view>
            </view>

            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    :placeholder-style="
                        `color:${publicConfig.placeholderColor}`
                    "
                    :maxlength="uploadConfig.nameMaxLength"
                    :style="{ background: publicConfig.primaryBgColor }"
                    :placeholder="uploadConfig.placeholderNameText"
                >
            </view>

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                :placeholder-style="`color:${publicConfig.placeholderColor}`"
                :style="{ background: publicConfig.primaryBgColor }"
                :maxlength="uploadConfig.descMaxLength"
                :placeholder="uploadConfig.placeholderDescText"
            />
            <template v-if="uploadMode === 'video'">
                <upload
                    :type="'video'"
                    :source="formData.video_id"
                    :theme="theme"
                    @change="updateVideo"
                />
                <upload
                    :type="'image'"
                    :is-video="true"
                    :source="formData.video_img_url"
                    :theme="theme"
                    @change="updateImage"
                />
            </template>
            <template v-if="uploadMode === 'image'">
                <upload
                    :type="'image'"
                    :preview="false"
                    :theme="theme"
                    :source="formData.video_img_url"
                    @change="updateImage"
                />
                <image-drag-sort
                    ref="preview"
                    :text-color="publicConfig.primaryColor"
                    :list="images"
                />
            </template>

            <view
                class="btn"
                :style="{ background: publicConfig.primaryColor }"
                @click="upload"
            >
                上传
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import upload from '../common/upload.vue';
import imageDragSort from '../../../components/image-drag-sort/index.vue';

export default {
    components: {
        upload,
        imageDragSort,
    },
    data() {
        return {
            isLoading: true,
            publicConfig: {},
            uploadConfig: {},
            newsTabActiveIndex: 0,
            uploadMode: '',
            formData: {
                cat_id: '',
                activity_id: '',
                activity_cat: 1,
                resource_name: '',
                resource_type: 1,
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
            },
            images: [],
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
            theme: {},
        };
    },
    computed: {
        config() {
            return this.$store.state.activity.config;
        },
    },
    onLoad(params) {
        this.id = params.id;
        this.formData.activity_id = params.activity_id;
        if (this.id) {
            uni.setNavigationBarTitle({ title: '编辑作品' });
            this.getItemData();
        }
        this.publicConfig = this.$store.getters.getPublicConfig(
            this.formData.activity_id,
        );
        this.uploadConfig = this.$store.getters.getActivityConfig({
            activityId: this.formData.activity_id,
            page: 'uploadConfig',
        });
        [this.uploadMode] = [this.uploadConfig.uploadMode[0]];
        this.formData.cat_id = this.publicConfig.catId;
        this.formData.resource_type = this.uploadMode === 'video' ? 1 : 2;
        this.theme = {
            primaryColor: this.publicConfig.primaryColor,
            bgColor: this.publicConfig.primaryBgColor,
        };
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
                    activity_id: this.formData.activity_id,
                }).then((res) => {
                    this.isLoading = false;
                    this.uploadMode = res.resource_type === 1 ? 'video' : 'image';
                    this.formData = {
                        ...this.formData,
                        ...res,
                    };
                    if (res.resource_type === 2) {
                        this.uploadMode = 'image';
                        this.images = res.img;
                    } else {
                        this.formData.video_id = res.video_id;
                        this.formData.video_img_url = res.video_img_url;
                    }
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
                resource_type:
                    this.publicConfig.uploadMode[0] === 'video' ? 1 : 2,
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
            };
            this.newsTabActiveIndex = 0;
        },
        setActivityCat(index) {
            this.formData.activity_cat = index;
        },
        setNewsTabActive(index) {
            if (this.id) {
                return false;
            }
            this.formData.resource_type = index;
            this.uploadMode = this.uploadConfig.uploadMode[index - 1];
            return true;
        },
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data[0] && data[0].path;
            if (this.uploadMode === 'image') {
                data.forEach((item) => {
                    this.$refs.preview.add(item.path);
                });
            }
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
                if (this.uploadMode === 'video') {
                    formData.resource_type = 1;
                    if (!formData.resource_name) {
                        this.lock = true;
                        return this.errTip('请输入视频名称');
                    }
                    if (!formData.video_id) {
                        this.lock = true;
                        return this.errTip('请上传视频文件');
                    }
                } else {
                    formData.resource_type = 2;
                    if (!formData.resource_name) {
                        return this.errTip('请输入作品名称');
                    }
                    formData.img = this.$refs.preview.dump();
                    if (!formData.img.length) {
                        this.lock = true;
                        return this.errTip('请上传作品图片');
                    }
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
                            url: `/pages/activity-pages/upload/result?activity_id=${this.activityId}`,
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
        const titleList = this.publicConfig.shareConfig.title;
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.homePath,
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
