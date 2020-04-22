<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view class="content-box">
            <view class="title">
                参赛项目信息
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    项目名称
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
                            项目名称
                        </view>
                        <view
                            v-if="formData.cat_id"
                            class="uni-input fake-input"
                        >
                            {{ catData[index].name }}
                        </view>
                    </picker>
                </view>
            </view>
            <upload
                :type="'video'"
                @change="updateVideo"
            />

            <template>
                <upload
                    :type="'image'"
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
            <view class="show-type-input">
                <view class="show-type-text">
                    成绩
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.grade"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="成绩"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    指导老师
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.teacher"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="指导老师"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    认证官姓名
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.teacher"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="认证官姓名"
                    >
                </view>
            </view>
            <view
                class="content-box"
                style="height:633upx;margin-top:20upx;padding-top:114upx"
            >
                <view class="show-type-input">
                    <view class="show-type-text">
                        参赛者姓名
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.teacher"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="参赛者姓名"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        学校名称：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.teacher"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="学校名称："
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        学 段：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.teacher"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="参赛者姓名"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        年 级：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.teacher"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="参赛者姓名"
                        >
                    </view>
                </view>
            </view>
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
import api from '../../common/api';
import upload from '../../components/upload/upload.vue';
import imageDragSort from '../../components/image-drag-sort/index.vue';
import Attachment from '../../components/third-party/jin-attachment/index.vue';
import config from '../../common/config';

export default {
    components: {
        upload,
        imageDragSort,
        Attachment,
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
            uploadMode: 'video',

            formData: {
                activity_id: 3,
                cat_id: 16,
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
                    name: '一分钟单人跳绳',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-16',
                    resource_type: 1,
                },
                {
                    cat_id: 17,
                    name: '一分钟仰卧起坐',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-17',
                    resource_type: 1,
                },
                {
                    cat_id: 18,
                    name: '手指转球',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-18',
                    resource_type: 1,
                },
                {
                    cat_id: 19,
                    name: '一分钟单人拍篮球',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-19',
                    resource_type: 1,
                },
                {
                    cat_id: 21,
                    name: '呼啦圈',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-21',
                    resource_type: 2,
                },
                {
                    cat_id: 20,
                    name: '单人毽子',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-20',
                },
                {
                    cat_id: 23,
                    name: '一分钟背诵圆周率',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-23',
                    resource_type: 1,
                },
                {
                    cat_id: 24,
                    name: '四阶魔方六面复原',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-24',
                    resource_type: 1,
                },
                {
                    cat_id: 101,
                    name: '绕口令快速说',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-101',
                    resource_type: 2,
                },
                {
                    cat_id: 102,
                    name: '一分钟双人跳绳',
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
                    setTimeout(() => {
                        this.$refs.preview.init();
                    }, 100);
                } else {
                    data.forEach((item) => {
                        if (this.images.length >= 10) {
                            this.errTip('最多选择10张图片');
                        } else {
                            let suffix = '';
                            try {
                                suffix = item.path.split('.').pop();
                                // eslint-disable-next-line no-empty
                            } catch {}
                            if (
                                ['jpg', 'jpeg', 'png', 'gif'].indexOf(
                                    suffix.toLowerCase(),
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

            uni.showLoading();
            this.disabled = true;
            // check input
            console.log(this.formData);
            return api.post('/api/activity/add', formData).then(
                (res) => {
                    this.resetForm();
                    this.disabled = false;
                    console.log(res);
                    uni.hideLoading();
                    uni.navigateTo({
                        url:
                            '/pages/upload/result/result?type=success&from=festival',
                    });
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
        const titleList = ['我来给你拜新年，表演才艺送祝福'];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner.png',
            path: '/pages/chunjie/index',
        };
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    background: #ff3844;
    padding: 30rpx;

    .main {
        border-radius: 20rpx;
        padding: 40upx 30upx;
        background: #ffd583;
        color: #c9ac67;
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
        background: #ffedc3;
        border-radius: 12rpx;
        color: #9d7c2f;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #c9ac67;

        .cover-wrap {
            background: #ffedc3;

            .icon-desc {
                color: #c9ac67;
            }
        }

        .desc {
            color: #c9ac67;
        }
    }

    /deep/ .placeholder {
        color: #c9ac67;
        font-size: 28upx;
    }

    .btn {
        width: 100%;
        color: #fff;
        height: 98rpx;
        border-radius: 49rpx;
        line-height: 98rpx;
        text-align: center;
        margin-top: 168rpx;
        background: rgb(255, 152, 84);
        background: linear-gradient(
            180deg,
            rgba(255, 152, 84, 1) 0%,
            rgba(255, 31, 21, 1) 100%
        );
        box-shadow: 0 2.8rpx 2.2rpx rgba(255, 31, 21, 0.034),
            0 6.7rpx 5.3rpx rgba(255, 31, 21, 0.048),
            0 12.5rpx 10rpx rgba(255, 31, 21, 0.06),
            0 22.3rpx 17.9rpx rgba(255, 31, 21, 0.072),
            0 41.8rpx 33.4rpx rgba(255, 31, 21, 0.086),
            0 100rpx 80rpx rgba(255, 31, 21, 0.12);
        margin-bottom: 70rpx;
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
            color: #ff3849;
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
            border: 1px solid #ff3849;
            border-radius: 28rpx;
            display: inline-block;
            margin-right: 20rpx;
            text-align: center;
            color: #ff3849;
            margin-bottom: 20rpx;

            &.active {
                background: #ff3849;
                color: #fff;
            }
        }
    }
}
</style>
