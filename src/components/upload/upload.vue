<template>
    <view
        class="comp-upload"
        @click="chooseResource"
    >
        <view class="cover-wrap">
            <template v-if="type === 'video'">
                <image
                    class="icon-video"
                    src="/static/images/comp/upload/video.png"
                />
                <view
                    v-if="!url"
                    class="icon-desc"
                >
                    上传视频
                </view>
                <view
                    v-else
                    class="icon-desc"
                >
                    视频已上传
                </view>
            </template>
            <template v-if="type === 'image'">
                <image
                    class="icon-image"
                    src="/static/images/comp/upload/image.png"
                />
                <view class="icon-desc">
                    {{ preview ? "上传封面" : "上传图片" }}
                </view>
                <image
                    v-if="preview && url"
                    class="preview"
                    :src="url"
                />
            </template>
        </view>
        <view class="desc">
            <template v-if="type === 'video'">
                <view>
                    视频文件大小不超过1GB
                </view>
                <view>
                    支持 MP4 等格式
                </view>
            </template>
            <template v-if="type === 'image'">
                <view>
                    图片尺寸建议950*550
                </view>
                <view>
                    支持.jpg, png格式
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import config from '../../common/config';
import utils from '../../common/utils';

export default {
    props: {
        type: {
            type: String,
            default: 'video',
        },
        source: {
            type: String,
            default: '',
        },
        preview: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        console.log(this.preview);
        return {
            src: '',
            tempFilePath: '',
            url: this.source,
        };
    },
    watch: {
        source(val) {
            this.url = val;
        },
    },
    methods: {
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            uni.uploadFile({
                url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                filePath: tempFilePath,
                name: 'file',
                formData: {
                    file_type: this.type === 'image' ? 1 : 2,
                },
                header: {
                    userKey: utils.getToken(),
                },
                success: (uploadFileRes) => {
                    let resp;
                    try {
                        resp = JSON.parse(uploadFileRes.data);
                    } catch (e) {
                        return uni.showToast({
                            title: '服务器开小差了~',
                            icon: 'none',
                        });
                    }
                    if (resp.status === 200) {
                        // success
                        this.url = resp.data.path;
                        this.$emit('change', resp.data);
                        uni.showToast({
                            title: '已上传',
                        });
                    } else {
                        // fail
                        return uni.showToast({
                            title: resp.msg,
                            icon: 'none',
                        });
                    }
                    return false;
                },
            });
        },
        uploadVideo(tempFilePath) {
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            uni.uploadFile({
                url: `${config.host}/api/file/backendvideoupload`,
                filePath: tempFilePath,
                name: 'file',
                header: {
                    userKey: utils.getToken(),
                },
                success: (uploadFileRes) => {
                    let resp;
                    try {
                        resp = JSON.parse(uploadFileRes.data);
                    } catch (e) {
                        return uni.showToast({
                            title: '服务器开小差了~',
                            icon: 'none',
                        });
                    }
                    if (resp.status === 200) {
                        // success
                        this.$emit('change', resp.data);
                        uni.showToast({
                            title: '已上传',
                        });
                        this.url = resp.data.video_id;
                    } else if (resp.status === 706) {
                        uni.hideToast();
                        uni.navigateTo({
                            url: '/pages/upload/result/result?type=deny',
                        });
                    } else {
                        // fail
                        return uni.showToast({
                            title: resp.msg,
                            icon: 'none',
                        });
                    }
                    return false;
                },
            });
        },
        chooseResource() {
            if (this.type === 'image') {
                uni.chooseImage({
                    success: (res) => {
                        const filePath = res.tempFilePaths[0];
                        this.src = filePath;
                        this.uploadFile(filePath);
                    },
                });
            } else if (this.type === 'video') {
                uni.chooseVideo({
                    success: (res) => {
                        const filePath = res.tempFilePath;
                        this.src = filePath;
                        this.uploadVideo(filePath);
                    },
                });
            }

            // let fn = this.type === 'image' ? uni.chooseImage : uni.chooseVideo;

            // fn({
            //     success: (res) => {
            //         this.src = res.tempFilePath;
            //         this.uploadFile(res.tempFilePath);
            //     }
            // });
        },
    },
};
</script>

<style lang="less">
.comp-upload {
    display: flex;

    .cover-wrap {
        width: 192upx;
        height: 108upx;
        background: #f0f0f0;
        margin-right: 16upx;
        text-align: center;
        position: relative;

        .preview {
            position: absolute;
            z-index: 100;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }

    .desc {
        flex: 1;
        overflow: hidden;
        font-size: 24upx;
        color: #666;
        line-height: 40upx;
        padding-top: 14upx;
    }

    .icon-video {
        display: inline-block;
        width: 43upx;
        height: 28upx;
        margin-top: 16upx;
    }

    .icon-image {
        display: inline-block;
        width: 46upx;
        height: 36upx;
        margin-top: 12upx;
    }

    .icon-desc {
        color: #666;
        font-size: 28upx;
    }
}
</style>
