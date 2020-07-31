<template>
    <view
        v-if="!isLoading"
        :class="[`${publicConfig.activityName}-page`]"
    >
        <view :class="['page-upload']">
            <theme
                :show="showtheme"
                @toggelModel="toggelModel"
            />
            <view
                v-if="!needBindMobile"
                class="main"
            >
                <view
                    v-if="formData.activity_id === 12"
                    class="uni-list-cell-db"
                >
                    <view
                        class="uni-input placeholder fake-input"
                        @click="selTheme"
                    >
                        {{ themeTxts[ac_type] }}
                    </view>
                </view>
                <view
                    v-if="publicConfig.showAllCat"
                    class="uni-list-cell-db"
                >
                    <picker
                        :value="index"
                        :range="catData"
                        :range-key="'name'"
                        :disabled="id"
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
                <view
                    v-if="uploadConfig.activityCat.length"
                    class="selection bb-sep"
                >
                    <view class="label">
                        选择组别
                    </view>
                    <view class="items">
                        <text
                            v-for="(item, k) in uploadConfig.activityCat"
                            :key="k"
                            class="select-item"
                            :class="{ active: formData.activity_cat === k + 1 }"
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
                    <view class="label">
                        表现形式
                    </view>
                    <view class="items">
                        <text
                            v-for="(item, k) in uploadConfig.uploadMode"
                            :key="k"
                            class="select-item for-disable"
                            :class="{
                                active: formData.resource_type === k + 1,
                                disabled:
                                    ((formData.cat_id === 18 ||
                                    formData.cat_id === 16) &&
                                    item === 'image') ||
                                    id
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
                        :placeholder="uploadConfig.placeholderNameText"
                    >
                </view>
                <view
                    class="textarea-view"
                    :class="{ hide: showtheme }"
                >
                    <text class="max-length">
                        {{ formData.introduce.length || 0 }}/{{
                            uploadConfig.descMaxLength
                        }}
                    </text>

                    <textarea
                        v-model="formData.introduce"
                        class="uni-textarea"
                        placeholder-class="placeholder"
                        :placeholder-style="
                            `color:${publicConfig.placeholderColor}`
                        "
                        :maxlength="uploadConfig.descMaxLength"
                        :placeholder="uploadConfig.placeholderDescText"
                    />
                </view>
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
                        :source="formData.video_img_url"
                        @change="updateImage"
                    />
                    <image-drag-sort
                        v-show="images.length"
                        ref="preview"
                        :list="images"
                    />
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
    </view>
</template>
<script>
import api from '../../../common/api';
import upload from '../common/upload.vue';
import imageDragSort from '../../../components/image-drag-sort/index.vue';
import theme from '../clocked/theme.vue';

export default {
    components: {
        upload,
        imageDragSort,
        theme,
    },
    data() {
        return {
            isLoading: true,
            publicConfig: {},
            uploadConfig: {},
            newsTabActiveIndex: 0,
            uploadMode: 'video',
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
            ac_type: 0,
            showtheme: false,
            themeTxts: [
                '选择分类',
                '劳动实践',
                '读书学习',
                '才艺展示',
                '体育锻炼',
            ],
            preStatus: 0,
            days: 0,
        };
    },
    computed: {
        config() {
            return this.$store.state.activity.config;
        },
    },
    onLoad(params) {
        this.id = params.id;
        this.formData.activity_id = Number(params.activity_id);
        this.ac_type = Number(params.ac_type) || 0;
        this.preStatus = Number(params.status) || 0;
        this.days = Number(params.days) || 0;
        const isFrommyWork = params.from || '';
        if (this.id) {
            uni.setNavigationBarTitle({ title: '编辑作品' });
        }
        const uploadColorConfig = this.$store.getters.getColorConfig({
            activityId: this.formData.activity_id,
            page: 'uploadColorConfig',
        });
        this.publicConfig = {
            ...this.$store.getters.getPublicConfig(this.formData.activity_id),
            ...uploadColorConfig,
        };
        this.uploadConfig = this.$store.getters.getActivityConfig({
            activityId: this.formData.activity_id,
            page: 'uploadConfig',
        });
        this.formData.cat_id = this.publicConfig.catId;
        if (this.formData.activity_id === 12) {
            if (isFrommyWork) {
                // 个人中心，没有直接获取 days ac_type status,
                this.getTheme();
            } else {
                this.setClockedCatId(this.ac_type);
            }
        }
        this.formData.resource_type = this.uploadMode === 'video' ? 1 : 2;
        this.getData();
    },
    created() {},
    methods: {
        getTheme() {
            api.get('/api/activity/curtheme', {
                activity_id: 12,
            }).then(({ type, status }) => {
                this.preStatus = status;
                if (type) {
                    this.ac_type = type;
                } else {
                    this.ac_type = 0;
                }
            });
        },
        getsigninfo() {
            api.get('/api/activity/signinfo', {
                user_id: this.userInfo.user_id,
                activity_id: 12,
            }).then((signinfo) => {
                this.days = signinfo.serial_day;
            });
        },
        // 编辑作品
        getItemData() {
            if (this.id) {
                api.get('/api/activity/info', {
                    id: this.id,
                    activity_id: this.formData.activity_id,
                }).then((res) => {
                    console.log(this.formData, res);
                    let {
                        img,
                        resource_type: resourceType,
                        cat_id: catId,
                        cat_name: catName,
                        video_img_url: videoImgUrl,
                    } = res;
                    // pm删除了几个分类 因此如果不存在默认选择其它
                    // 编辑的作品分类是否存在 catIndex === -1 不存在
                    const catIndex = this.catData.findIndex(
                        v => v.cat_id === catId,
                    );

                    if (catIndex === -1) {
                        catId = 102;
                        catName = '其他表演';
                        this.index = this.catData.findIndex(
                            v => v.cat_id === 102,
                        );
                    } else {
                        this.index = catIndex;
                        // 如果该分类不支持图片类型 强制改成视频类型 并清空之前上传的图片封面图
                        if (
                            (catId === 16 || catId === 18)
                            && resourceType === 2
                        ) {
                            resourceType = 1;
                            img = [];
                            videoImgUrl = '';
                            catName = catId === 16 ? '歌唱表演' : '口才表演';
                        }
                    }
                    this.uploadMode = resourceType === 1 ? 'video' : 'image';

                    if (resourceType === 2) {
                        this.uploadMode = 'image';
                        this.images = img;
                    }
                    this.formData = {
                        ...this.formData,
                        ...res,
                        introduce: res.introduce || '',
                        img,
                        resource_type: resourceType,
                        cat_id: catId,
                        cat_name: catName,
                        video_img_url: videoImgUrl,
                    };
                    console.log(this.formData);
                    this.isLoading = false;
                });
            }
        },
        resetData() {
            this.formData = {
                ...this.formData,
                activity_cat: 1,
                resource_name: '',
                resource_type:
                    this.uploadConfig.uploadMode[0] === 'video' ? 1 : 2,
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
            let Index = index;
            if (this.id) {
                return false;
            }
            if (this.formData.cat_id === 16 || this.formData.cat_id === 18) {
                Index = 1;
            }
            this.formData.resource_type = Index;
            this.uploadMode = this.uploadConfig.uploadMode[Index - 1];
            return true;
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
                    console.log(item.path);
                    this.$refs.preview.add(item.path);
                });
                setTimeout(() => {
                    this.$refs.preview.init();
                }, 300);
            }
        },
        getData() {
            if (
                this.publicConfig.configCatId
                && this.publicConfig.configCatId.length
            ) {
                this.catData = this.publicConfig.configCatId;
                this.getItemData();
            } else {
                api.get('/api/works/childcat', {
                    cat_id: 3,
                }).then((res) => {
                    if (this.formData.activity_id === '10') {
                        const index = res.findIndex(
                            item => item.cat_id === 102,
                        );
                        // eslint-disable-next-line no-param-reassign
                        res[index].name = '体育锻炼';
                    }
                    this.catData = res;
                    this.getItemData();
                });
            }
            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info && res.user_info.is_bind_mobile === 0;
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                    if (this.formData.activity_id === 12) {
                        this.getsigninfo();
                    }
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
        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            if (catId === 16 || catId === 18) {
                this.setNewsTabActive(1);
            }
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
                if (formData.cat_id === '') {
                    this.lock = true;
                    return this.errTip('请选择分类');
                }
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
                        this.lock = true;
                        return this.errTip('请输入作品名称');
                    }
                    formData.img = this.$refs.preview.dump();
                    if (!formData.img.length) {
                        this.lock = true;
                        return this.errTip('请上传作品图片');
                    }
                }
                if (formData.activity_id === 12) {
                    if (!this.ac_type) {
                        this.lock = true;
                        return this.errTip('请选择分类');
                    }
                    formData.ac_type = this.ac_type;
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
                            url: `/activity/pages/upload/result?activity_id=${this.formData.activity_id}&pre_status=${this.preStatus}&days=${this.days}&ac_type=${this.ac_type}`,
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
        selTheme() {
            if (!this.ac_type) {
                this.showtheme = true;
            }
        },
        toggelModel(id) {
            this.showtheme = false;
            if (id) {
                this.ac_type = id;
                this.setClockedCatId(id);
            } else {
                this.ac_type = 0;
            }
        },
        setClockedCatId(type) {
            switch (type) {
                case 1:
                    this.formData.cat_id = 20;
                    break;
                case 2:
                    this.formData.cat_id = 102;
                    break;
                case 3:
                    this.formData.cat_id = 102;
                    break;
                case 4:
                    this.formData.cat_id = 132;
                    break;
                default:
                    this.formData.cat_id = '';
                    break;
            }
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
        height: 80upx;
        box-sizing: border-box;
        // line-height: 80upx;
        padding-left: 24upx;
        padding-top: 0;
    }
    .textarea-view {
        position: relative;
        &.hide {
            opacity: 0;
        }
        .max-length {
            position: absolute;
            bottom: 10upx;
            right: 10upx;
            z-index: 1;
            color: #cdcdcd;
            font-size: 24upx;
        }
    }
    .uni-textarea {
        height: 160upx;
        padding: 16upx 20upx 38upx;
        width: 100%;
        box-sizing: border-box;
        line-height: 42upx;
    }

    .fake-input {
        padding-top: 0upx;
        line-height: 80upx;
        color: #999;
    }

    .bt-sep {
        margin-top: 40rpx;
    }
    .uni-input,
    .uni-textarea {
        border: 1upx solid transparent;
        margin-bottom: 40rpx;
        font-size: 28rpx;
        background: #0f8c64;
        border-radius: 24upx;
        color: #fff;
    }
    .uni-input {
        border-radius: 40upx;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #fff;

        .cover-wrap {
            background: #0f8c64;
            border-radius: 12upx;

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
        height: 98rpx;
        line-height: 98rpx;
        text-align: center;
        margin-top: 33upx;
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

        .select-item {
            // width: 110rpx;
            padding: 0 57rpx;
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
            &.for-disable.disabled {
                color: #eee;
                border-color: #eee;
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
    }
}
@import "../theme/upload.less";
</style>
