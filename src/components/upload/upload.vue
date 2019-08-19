<template>
    <view class="comp-upload">
        <view
            class="cover-wrap"
            @click="chooseResource"
        >
            <template v-if="type === 'video'">
                <image
                    class="icon-video"
                    src="/static/images/comp/upload/video.png"
                />
                <view class="icon-desc">
                    上传视频
                </view>
            </template>
            <template v-if="type === 'image'">
                <image
                    class="icon-image"
                    src="/static/images/comp/upload/image.png"
                />
                <view class="icon-desc">
                    上传封面
                </view>
            </template>
        </view>
        <view class="desc">
            {{ src }}
            <template v-if="type === 'video'">
                <view>
                    视频文件大小不超过100MB
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
    },
    data() {
        return {
            src: '',
        };
    },
    methods: {
        uploadFile(tempFilePath) {
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
                    const resp = JSON.parse(uploadFileRes.data);
                    if (resp.status === 200) {
                        // success
                        this.$emit('change', resp.data.path);
                        this.src = resp.data.path;
                        uni.showToast({
                            title: '已上传',
                        });
                    } else {
                        // fail
                        uni.hideToast();
                    }
                    console.log(resp);
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
                        this.uploadFile(filePath);
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
        margin-top: 12upx;
    }

    .icon-image {
        display: inline-block;
        width: 46upx;
        height: 36upx;
        margin-top: 18upx;
    }

    .icon-desc {
        color: #666;
        margin-top: 6upx;
        font-size: 28upx;
    }
}
</style>
