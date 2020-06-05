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
                    :disabled="true"
                    @change="onSelect"
                >
                    <view
                        v-if="!formData.cat_id"
                        class="uni-input placeholder fake-input"
                    >
                        选择分类
                    </view>
                    <view
                        v-else
                        class="uni-input fake-input"
                    >
                        <template>
                            {{ catData[index].name }}
                        </template>
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
                            v-if="formData.resource_type === 1"
                            class="show-type-title active"
                        >
                            视频
                        </text>
                        <text
                            v-else
                            class="show-type-title active"
                        >
                            图片
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
            <upload
                v-if="uploadMode === 'video'"
                :type="'video'"
                :source="formData.video_id"
                @change="updateVideo"
            />
            <upload
                :type="'image'"
                :preview="uploadMode === 'video' ? true : false"
                :source="formData.video_img_url"
                @change="updateImage"
            />

            <template v-if="uploadMode === 'image'">
                <image-drag-sort
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
            id: '',
            init: true,
            tabs: [
                { type: 'video', column_name: '视频' },
                { type: 'image', column_name: '图片' },
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
            from: '',
        };
    },
    created() {
        // this.getData();
    },
    // onShow() {
    //     this.getData();
    // },
    methods: {
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
            api.get('/api/works/childcat', {
                cat_id: 3,
            }).then((res) => {
                this.catData = res;
                if (this.id) {
                    api.get('/api/user/workinfo', {
                        id: this.id,
                    }).then((res) => {
                        let {
                            img,
                            resource_type: resourceType,
                            cat_id: catId,
                            cat_name: catName,
                            video_img_url: videoImgUrl,
                        } = res;
                        this.isLoading = false;
                        // pm删除了几个分类 因此如果不存在默认选择其它
                        // 编辑的作品分类是否存在 catIndex === -1 不存在
                        const catIndex = this.catData.findIndex(
                            v => v.cat_id === catId,
                        );
                        if (catIndex === -1) {
                            // pm删除了几个分类 因此如果不存在默认选择其它
                            catId = 102;
                            catName = '其他表演';
                            this.index = this.catData.findIndex(
                                v => v.cat_id === 102,
                            );
                        } else {
                            this.index = catIndex;
                            // pm要求： 如果该分类不支持图片类型 强制改成视频类型 并清空之前上传的图片
                            if (
                                (catId === 16 || catId === 18)
                                && resourceType === 2
                            ) {
                                resourceType = 1;
                                img = [];
                                videoImgUrl = '';
                            }
                        }

                        if (resourceType === 2) {
                            this.uploadMode = 'image';
                            this.images = img;
                        }

                        this.formData = {
                            ...this.formData,
                            ...res,
                            img,
                            cat_id: catId,
                            cat_name: catName,
                            video_img_url: videoImgUrl,
                            resource_type: 1,
                        };
                    });
                }
            });
        },
        onSelect(e) {
            this.init = false;
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
        upload() {
            const formData = Object.assign({}, this.formData);

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
                formData.img = this.$refs.preview.dump();
                if (!formData.img.length) {
                    this.lock = true;
                    return this.errTip('请上传作品图片');
                }
            }

            // check input
            console.log(this.formData);
            return api.post('/api/user/editwork', formData).then(
                (res) => {
                    console.log(res);
                    uni.navigateTo({
                        url: `/pages/upload/result/result?type=success&from=${this.from}`,
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
    onLoad(params) {
        console.log(params);
        this.id = params.id;
        this.from = params.from || '';
        this.getData();
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
