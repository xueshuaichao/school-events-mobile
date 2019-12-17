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
/* eslint-disable */
import config from "../../common/config";
import utils from "../../common/utils";

export default {
    props: {
        type: {
            type: String,
            default: "video"
        },
        source: {
            type: String,
            default: ""
        },
        preview: {
            type: Boolean,
            default: true
        }
    },
    data() {
        console.log(this.preview);
        return {
            src: "",
            tempFilePath: "",
            url: this.source,
            uploader: ""
        };
    },
    watch: {
        source(val) {
            this.url = val;
        }
    },
    mounted() {
        const uploader = new AliyunUpload.Vod({
            // 阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
            userId: "1923859927839944",
            // 上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
            // region:"",
            // 分片大小默认1M，不能小于100K
            partSize: 1048576,
            // 并行上传分片个数，默认5
            parallel: 5,
            // 网络原因失败时，重新上传次数，默认为3
            retryCount: 3,
            // 网络原因失败时，重新上传间隔时间，默认为2秒
            retryDuration: 2,
            // 开始上传
            onUploadstarted(uploadInfo) {
                api.post("/cert/createtoken", {
                    type: "media",
                    file_name: uploadInfo.file.name
                }).then(({ data: { result } }) => {
                    const uploadAuth = result.upload_auth;
                    const uploadAddress = result.upload_address;
                    const videoId = result.video_id;
                    uploader.setUploadAuthAndAddress(
                        uploadInfo,
                        uploadAuth,
                        uploadAddress,
                        videoId
                    );
                });
            },
            // 文件上传成功
            onUploadSucceed(uploadInfo) {},
            // 文件上传失败
            onUploadFailed(uploadInfo, code, message) {},
            // 文件上传进度，单位：字节
            onUploadProgress(uploadInfo, totalSize, loadedPercent) {},
            // 上传凭证超时
            onUploadTokenExpired(uploadInfo) {},
            // 全部文件上传结束
            onUploadEnd(uploadInfo) {}
        });

        this.uploader = uploader;
    },
    methods: {
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: "loading",
                title: "上传中",
                duration: 200000
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: "file",
                    formData: {
                        file_type: this.type === "image" ? 1 : 2
                    },
                    header: {
                        userKey: utils.getToken()
                    },
                    success: uploadFileRes => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: "服务器开小差了~",
                                icon: "none"
                            });
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            // success
                            this.url = resp.data.path;
                            uni.showToast({
                                title: "已上传"
                            });
                            resolve(resp.data);
                            // this.$emit('change', resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: "none"
                            });
                            return reject(resp.msg);
                        }
                        return false;
                    }
                });
            });
        },
        uploadVideo(tempFilePath) {
            uni.showToast({
                icon: "loading",
                title: "上传中",
                duration: 200000
            });
            uni.uploadFile({
                url: `${config.host}/api/file/backendvideoupload`,
                filePath: tempFilePath,
                name: "file",
                header: {
                    userKey: utils.getToken()
                },
                success: uploadFileRes => {
                    let resp;
                    try {
                        resp = JSON.parse(uploadFileRes.data);
                    } catch (e) {
                        return uni.showToast({
                            title: "服务器开小差了~",
                            icon: "none"
                        });
                    }
                    if (resp.status === 200) {
                        // success
                        this.$emit("change", resp.data);
                        uni.showToast({
                            title: "已上传"
                        });
                        this.url = resp.data.video_id;
                    } else if (resp.status === 706) {
                        uni.hideToast();
                        uni.navigateTo({
                            url: "/pages/upload/result/result?type=deny"
                        });
                    } else {
                        // fail
                        return uni.showToast({
                            title: resp.msg,
                            icon: "none"
                        });
                    }
                    return false;
                }
            });
        },
        chooseResource() {
            if (this.type === "image") {
                uni.chooseImage({
                    success: res => {
                        Promise.all(
                            res.tempFilePaths.map(filePath =>
                                this.uploadFile(filePath)
                            )
                        ).then(data => {
                            // console.log(data);
                            this.$emit("change", data);
                        });
                        [this.src] = res.tempFilePaths;
                    }
                });
            } else if (this.type === "video") {
                uni.chooseVideo({
                    success: res => {
                        const filePath = res.tempFilePath;
                        this.src = filePath;
                        // this.uploadVideo(filePath);
                        console.log(res);
                        // const fileList = e.target.files;
                        // this.uploader.cleanList();
                    }
                });
            }

            // let fn = this.type === 'image' ? uni.chooseImage : uni.chooseVideo;

            // fn({
            //     success: (res) => {
            //         this.src = res.tempFilePath;
            //         this.uploadFile(res.tempFilePath);
            //     }
            // });
        }
    }
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
