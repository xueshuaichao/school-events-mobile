<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view class="main">
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
    onShow() {},
    methods: {
        resetForm() {
            this.formData = {
                activity_id: 3,
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
                        url: '/pages/chunjiehao/upload/result',
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
</style>
