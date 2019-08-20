<template>
    <view class="page-upload">
        <view class="main">
            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="视频名称*（不超过30字）"
                >
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

            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                placeholder="视频介绍（不超过500字）"
            />

            <upload
                :type="'video'"
                @change="updateVideo"
            />
            <upload
                :type="'image'"
                @change="updateImage"
            />

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
            formData: {
                cat_id: '',
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
            },
            catData: [],
            title: 'picker',
            array: ['中国', '美国', '巴西', '日本'],
            index: 0,
            time: '12:01',
        };
    },

    created() {
        this.getData();
    },
    methods: {
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data.path;
        },
        getData() {
            api.get('/api/works/childcat', {
                cat_id: 3,
            }).then((res) => {
                this.catData = res;
            });

            if (this.id) {
                api.get('/api/user/workinfo', {
                    id: this.id,
                }).then((res) => {
                    this.formData.id = res.id;
                    this.formData.cat_id = res.cat_id;
                    this.formData.video_id = res.video_id;
                    this.formData.video_img_url = res.video_img_url;
                    this.formData.resource_name = res.resource_name;
                    this.formData.introduce = res.introduce;
                });
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
            const formData = Object.assign({}, this.formData);
            if (!formData.resource_name) {
                return this.errTip('请输入视频名称');
            }
            if (!formData.cat_id) {
                return this.errTip('请选择视频分类');
            }
            if (!formData.introduce) {
                return this.errTip('请填写视频介绍');
            }

            if (!formData.video_id) {
                return this.errTip('请上传视频文件');
            }
            if (!formData.video_img_url) {
                return this.errTip('请上传视频封面');
            }

            // check input
            console.log(this.formData);
            return api.post('/api/user/editwork', formData).then(
                (res) => {
                    console.log(res);
                    uni.navigateTo({
                        url: '/pages/upload/result/result?type=success',
                    });
                },
                err => uni.showToast({
                    icon: 'none',
                    title: err.message,
                }),
            );
        },
    },
    onLoad(params) {
        this.id = params.id;
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
        margin-top: 168upx;
    }
}
</style>
