<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            v-if="!needBindMobile"
            class="main"
        >
            <view
                v-if="needTab"
                class="selection bb-sep"
            >
                <view class="label">
                    表现形式
                </view>
                <view class="items">
                    <text
                        v-for="(item, k) in tabs"
                        :key="item.id"
                        class="item"
                        :class="{ active: newsTabActiveIndex === k }"
                        @click="setNewsTabActive(k)"
                    >
                        {{ item.column_name }}
                    </text>
                </view>
            </view>

            <view class="uni-form-item uni-column bt-sep">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    :placeholder="
                        (uploadMode === 'video' ? '视频' : '作品') +
                            '名称*（不超过30字）'
                    "
                >
            </view>

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                :placeholder="
                    (uploadMode === 'video' ? '视频' : '作品') +
                        '介绍（不超过80字）'
                "
            />
            <upload
                v-if="uploadMode === 'video'"
                :theme="'red'"
                :type="'video'"
                @change="updateVideo"
            />
            <!-- <view
                v-if="uploadMode === 'image'"
                class="upload-desc"
            >
                拖动图片可调整展示顺序，第一张图片会作为该作品的封面图
            </view> -->
            <!-- <upload
                v-if="uploadMode === 'video'"
                :type="'image'"
                :count="1"
                @change="updateImage"
            /> -->

            <template v-if="uploadMode === 'image'">
                <upload
                    :type="'image'"
                    :theme="'red'"
                    :preview="false"
                    @change="updateImage"
                />
                <template v-if="isH5">
                    <attachment
                        :can-upload-file="false"
                        :upload-file-url="uploadFileUrl"
                        :attachment-list.sync="images"
                    />
                </template>
                <template v-else>
                    <image-drag-sort
                        ref="preview"
                        :list="images"
                    />
                </template>
            </template>

            <view
                class="btn"
                @click="upload"
            >
                确认上传
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
                    placeholder-style="color:#6691ff"
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
                    placeholder-style="color:#6691ff"
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
// #ifdef H5
import Attachment from '../../../components/third-party/jin-attachment/index.vue';
// #endif
import config from '../../../common/config';

export default {
    components: {
        upload,
        imageDragSort,
        // #ifdef H5
        Attachment,
        // #endif
    },
    data() {
        return {
            disabled: false,
            // #ifdef H5
            isH5: true,
            // #endif

            uploadFileUrl: `${config.host}/api/file/uploadfile`,

            isLoading: false,

            tabs: [
                { id: '1', column_name: '视频' },
                { id: '2', column_name: '图片' },
            ],
            images: [],

            newsTabActiveIndex: 0,
            needTab: true,
            uploadMode: 'video',

            formData: {
                activity_id: 4,
                cat_id: 25,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
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
            catData: [
                {
                    cat_id: 16,
                    name: '歌唱',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-16',
                    resource_type: 1,
                },
                {
                    cat_id: 17,
                    name: '舞蹈',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-17',
                    resource_type: 1,
                },
                {
                    cat_id: 18,
                    name: '口才',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-18',
                    resource_type: 1,
                },
                {
                    cat_id: 19,
                    name: '乐器',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-19',
                    resource_type: 1,
                },
                {
                    cat_id: 21,
                    name: '书画',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-21',
                    resource_type: 2,
                },
                {
                    cat_id: 20,
                    name: '创意',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-20',
                },
                {
                    cat_id: 23,
                    name: '杂技',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-23',
                    resource_type: 1,
                },
                {
                    cat_id: 24,
                    name: '魔术',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-24',
                    resource_type: 1,
                },
                {
                    cat_id: 101,
                    name: '摄影',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-101',
                    resource_type: 2,
                },
            ],
            title: 'picker',
            array: ['中国', '美国', '巴西', '日本'],
            index: 0,
            time: '12:01',
        };
    },
    onLoad() {},
    created() {},
    onShow() {
        // this.getData();
    },
    methods: {
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.needBindMobile = res.user_info && res.user_info.is_bind_mobile === 0;
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
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
        resetForm() {
            this.formData = {
                activity_id: 4,
                cat_id: 16,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
            };
        },
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
            if (index === 0) {
                this.uploadMode = 'video';
                this.formData.video_img_url = '';
            } else {
                this.uploadMode = 'image';
                this.formData.video_img_url = '';
            }
        },
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data[0] && data[0].path;
            if (this.uploadMode === 'image') {
                if (!this.isH5) {
                    data.forEach((item) => {
                        this.$refs.preview.add(item.path);
                    });
                    setTimeout(() => {
                        this.$refs.preview.init();
                    }, 100);
                } else {
                    data.forEach((item) => {
                        if (this.images.length >= 10) {
                            this.errTip('最多选择10张图片');
                        } else {
                            let suffix;
                            try {
                                suffix = item.path.split('.').pop();
                                // eslint-disable-next-line no-empty
                            } catch {}
                            if (
                                ['jpg', 'jpeg', 'png', 'gif'].indexOf(
                                    suffix,
                                ) !== -1
                            ) {
                                this.images.push({
                                    url: item.path,
                                    type: 'image',
                                    fileName: 'xxx.png',
                                });
                            }
                        }
                    });
                }
            }
        },
        onSelectCat(item) {
            this.needTab = false;
            this.formData.cat_id = item.cat_id;
            const resourceType = item.resource_type;

            if (resourceType === 1) {
                this.uploadMode = 'video';
            } else if (resourceType === 2) {
                this.uploadMode = 'image';
            } else {
                this.needTab = true;
                this.newsTabActiveIndex = 0;
                this.uploadMode = 'video';
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

        upload() {
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
                    return this.errTip('请输入视频名称');
                }
                if (!formData.cat_id) {
                    return this.errTip('请选择视频分类');
                }
                if (!formData.video_id) {
                    return this.errTip('请上传视频文件');
                }
                // if (!formData.video_img_url) {
                //     return this.errTip('请上传视频封面');
                // }
            } else {
                formData.resource_type = 2;
                if (!formData.resource_name) {
                    return this.errTip('请输入作品名称');
                }
                if (!formData.cat_id) {
                    return this.errTip('请选择作品分类');
                }
                formData.img = this.isH5
                    ? this.images.map(elem => elem.url)
                    : this.$refs.preview.dump();
                if (!formData.img.length) {
                    return this.errTip('请上传作品图片');
                }
            }

            if (formData.introduce.length >= 80) {
                return this.errTip('作品介绍不得超过80字');
            }

            uni.showLoading();
            this.disabled = true;
            // check input
            console.log(this.formData);
            return api.post('/api/activity/add', formData).then(
                (res) => {
                    this.disabled = false;
                    console.log(res);
                    uni.hideLoading();
                    uni.navigateTo({
                        url: '/history/chunjiehao/upload/result',
                    });
                    this.resetForm();
                },
                (err) => {
                    this.disabled = false;
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                },
            );
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const titleList = [
            '一幅幅春节影像作品，是最想留下的幸福瞬间！我的春节作品，正在等你来投票哦！',
            '记录新年，赢大奖！小伙伴们快来帮我投票吧～～',
            '快来看我记录的春节快乐瞬间！请为我投票，晒年味，赢好礼！',
            '快来看我家的新年有什么不一样！快来为我投票吧！晒年俗，赢大奖！',
            '家家“年味”各不同，快来围观我家的欢乐新年吧～别忘了投票哦！',
            '嗨～我在参加“记录新年赢大奖”活动，动动手指为我投票吧！',
        ];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/chunjiehao-banner.png',
            path: '/history/chunjiehao/index',
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
        background: #ff3849;
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
        background: #b11a27;
        border-radius: 12rpx;
        color: #ffbec4;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #fff;

        .cover-wrap {
            background: #ffde98;

            .icon-desc {
                color: #ff2e3f;
            }
        }

        .desc {
            color: #fff;
        }
    }

    /deep/ .placeholder {
        color: #ff3849;
        font-size: 28upx;
    }

    .btn {
        width: 100%;
        color: #ff2e3f;
        height: 110rpx;
        line-height: 110rpx;
        text-align: center;
        margin-top: 168rpx;
        background: linear-gradient(
            0deg,
            rgba(255, 149, 71, 1),
            rgba(255, 222, 152, 1)
        );
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
            color: #ffde98;
            margin-bottom: 15rpx;
        }

        .items {
            margin-right: -20rpx;
        }

        .item {
            // width: 110rpx;
            padding: 0 24rpx;
            height: 56rpx;
            line-height: 56rpx;
            border: 1px solid #ffde98;
            border-radius: 28rpx;
            display: inline-block;
            margin-right: 20rpx;
            text-align: center;
            color: #ffde98;
            margin-bottom: 20rpx;

            &.active {
                background: #ffde98;
                color: #ff2e3f;
            }
        }
    }
}
.page-bind-mobile {
    .btn {
        width: 100%;
        color: #fff;
        height: 110rpx;
        line-height: 110rpx;
        text-align: center;
        margin-top: 168rpx;
        background: #0084ff;
        border-radius: 55px;
    }
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
