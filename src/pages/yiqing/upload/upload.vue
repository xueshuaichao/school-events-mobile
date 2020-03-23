<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view class="main">
            <view class="selection">
                <view class="label">
                    选择组别
                </view>
                <view class="items">
                    <text
                        v-for="item in grpData"
                        :key="item.cat_id"
                        class="item"
                        :class="{
                            active: formData.activity_cat === item.cat_id
                        }"
                        @click="onSelectGrp(item)"
                    >
                        {{ item.name }}
                    </text>
                </view>
            </view>
            <view class="selection">
                <view class="label">
                    选择类别
                </view>
                <view class="items">
                    <text
                        v-for="item in catData"
                        :key="item.cat_id"
                        class="item"
                        :class="{ active: formData.cat_id === item.cat_id }"
                        @click="onSelectCat(item)"
                    >
                        {{ item.name }}
                    </text>
                </view>
            </view>
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
                :theme="'blue'"
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
                    :theme="'blue'"
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
            needTab: false,
            uploadMode: 'image',

            formData: {
                activity_id: 5,
                activity_cat: 1,
                cat_id: 21,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
            },
            grpData: [
                {
                    cat_id: 1,
                    name: '青少年组',
                },
                {
                    cat_id: 2,
                    name: '成年组',
                },
            ],
            catData: [
                {
                    cat_id: 21,
                    name: '书法绘画',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-17',
                    resource_type: 2,
                },
                {
                    cat_id: 101,
                    name: '摄影',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-18',
                    resource_type: 2,
                },
                {
                    cat_id: 18,
                    name: '朗诵',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-19',
                    resource_type: 1,
                },
                {
                    cat_id: 16,
                    name: '歌唱',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-21',
                    resource_type: 1,
                },
                {
                    cat_id: 17,
                    name: '舞蹈',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-20',
                    resource_type: 1,
                },
                {
                    cat_id: 102,
                    name: '创意设计',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-23',
                    resource_type: 3,
                },
                {
                    cat_id: 25,
                    name: '其他',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-24',
                    resource_type: 3,
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
                activity_id: 5,
                activity_cat: 1,
                cat_id: 21,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
            };
            this.images = [];
            this.$refs.preview.reset();
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
        onSelectGrp(item) {
            this.formData.activity_cat = item.cat_id;
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
            return api.post('/api/activity/add', formData).then(
                (res) => {
                    this.disabled = false;
                    console.log(res);
                    uni.hideLoading();
                    uni.navigateTo({
                        url: '/pages/yiqing/upload/result',
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
            '抗击疫情“艺”起来，参与活动为武汉加油！向英雄致敬！',
        ];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http: //aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png',
            path: '/pages/yiqing/index',
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
        background: #1154ff;
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
        background: #003dd7;
        border-radius: 12rpx;
        color: #6691ff;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #fff;

        .cover-wrap {
            background: #0084ff;

            .icon-desc {
                color: #fff;
            }
        }

        .desc {
            color: #fff;
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
        background: #0084ff;
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
            color: #ffde6d;
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
            border: 1px solid rgba(0, 132, 255, 1);
            border-radius: 28rpx;
            display: inline-block;
            margin-right: 20rpx;
            text-align: center;
            color: #fff;
            margin-bottom: 20rpx;

            &.active {
                background: #0084ff;
                color: #fff;
            }
        }
    }
}
</style>
