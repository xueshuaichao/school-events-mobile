<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view class="main">
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
            <view class="selection bb-sep">
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

            <view class="uni-form-item uni-column">
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
                        '介绍（不超过500字）'
                "
            />

            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.recommend"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="推荐机构名称(选填)"
                >
            </view>

            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.teacher"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="指导老师姓名(选填)"
                >
            </view>

            <upload
                v-if="uploadMode === 'video'"
                :type="'video'"
                @change="updateVideo"
            />
            <view
                v-if="uploadMode === 'image'"
                class="upload-desc"
            >
                拖动图片可调整展示顺序，第一张图片会作为该作品的封面图
            </view>
            <upload
                v-if="uploadMode === 'video'"
                :type="'image'"
                @change="updateImage"
            />

            <template v-if="uploadMode === 'image'">
                <upload
                    :type="'image'"
                    :preview="false"
                    @change="updateImage"
                />
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

            tabs: [
                { id: '1', column_name: '视频' },
                { id: '2', column_name: '图片' },
            ],
            images: [],

            newsTabActiveIndex: 0,
            uploadMode: 'video',

            formData: {
                activity_id: 3,
                cat_id: '',
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
                data.forEach((item) => {
                    this.$refs.preview.add(item.path);
                });
            }
        },
        getData() {
            api.get('/api/works/childcat', {
                cat_id: 3,
            }).then((res) => {
                this.isLoading = false;
                this.catData = res;
            });
        },

        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            console.log(this.formData);
        },
        onSelectCat(item) {
            console.log(item);
            this.formData.cat_id = item.cat_id;
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
                    return this.errTip('请上传作品图片');
                }
            }

            uni.showLoading();
            // check input
            console.log(this.formData);
            return api.post('/api/activity/add', formData).then(
                (res) => {
                    console.log(res);
                    uni.hideLoading();
                    uni.navigateTo({
                        url:
                            '/pages/upload/result/result?type=success&from=festival',
                    });
                },
                (err) => {
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

    .bb-sep {
        margin-bottom: 40rpx;
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
            padding: 0 28rpx;
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
