<template>
    <view
        class="comp-upload"
        @click="chooseResource"
    >
        <view
            v-if="type === 'video'"
            class="comp-title"
            :style="{ color: theme.textColor }"
        >
            上传视频
        </view>
        <view
            v-if="type === 'image'"
            class="comp-title"
            :style="{ color: theme.textColor }"
        >
            {{ isVideo ? "上传封面（选填）" : "上传图片" }}
        </view>
        <view class="comp-upload-box">
            <view
                class="cover-wrap"
                :style="{ 'background-color': theme.bgColor }"
            >
                <template v-if="type === 'video'">
                    <template v-if="!url">
                        <image
                            class="icon-video red"
                            src="/static/images/comp/upload/video_blue.png"
                        />
                    </template>
                    <template v-else>
                        <image
                            class="icon-success"
                            :src="`/static/images/comp/upload/success.png`"
                        />
                    </template>
                    <view
                        v-if="url"
                        class="text-success"
                    >
                        已上传
                    </view>
                </template>
                <template v-if="type === 'image'">
                    <image
                        class="icon-image red"
                        src="/static/images/comp/upload/image_blue.png"
                    />
                    <image
                        v-if="preview && url"
                        class="preview"
                        :src="url"
                    />
                </template>
            </view>
            <view
                class="desc"
                :style="{ color: theme.tipsColor }"
                :class="{ image: type === 'image' }"
            >
                <template v-if="type === 'video'">
                    <view> 不支持大于{{ maxSize }}M的视频 </view>
                    <view>
                        支持 MP4 等格式
                    </view>
                    <view
                        v-if="url"
                        class="normal-text"
                    >
                        更换视频
                    </view>
                </template>
                <template v-if="type === 'image'">
                    <view>
                        支持.jpg、jpeg、png格式
                    </view>
                    <view>
                        图片尺寸建议950*550
                    </view>
                    <view
                        v-if="url && preview"
                        class="normal-text"
                    >
                        更换封面
                    </view>
                </template>
            </view>
        </view>
        <view
            v-if="type === 'image' && isVideo"
            class="tips"
            :style="{ color: theme.tipsColor }"
        >
            系统为您自动截取视频内容作为封面，可更换
        </view>
    </view>
</template>

<script>
/* eslint-disable */
import config from "../../../common/config";
import utils from "../../../common/utils";
import api from "../../../common/api";

export default {
    props: {
        isVideo: {
            type: Boolean,
            default: false
        },
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
        },
        theme: {
            type: Object,
            default() {
                return {};
            }
        },
        count: {
            type: Number,
            default: 9
        },
        maxSize: {
            type: Number,
            default: 200
        }
    },
    data() {
        console.log(this.preview);
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            src: "",
            tempFilePath: "",
            url: this.source,
            uploader: ""
        };
    },
    watch: {
        source(val) {
            console.log(val, "souce0------");
            this.url = val;
        }
    },
    mounted() {
        /*
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
        */
    },
    methods: {
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            let suffix;
            try {
                suffix = tempFilePath.split(".").pop();
                // eslint-disable-next-line no-empty
            } catch {}
            console.log(1111, tempFilePath);
            // if (["jpg", "jpeg", "png", "gif"].indexOf(suffix) === -1) {
            //     return uni.showToast({
            //         icon: "none",
            //         title: "图片规格不正确"
            //     });
            // }

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
                            uni.hideToast();
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
        uploadVideo(tempFilePath, file = {}) {
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
                        const data = {
                            ...resp.data,
                            ...file
                        };
                        this.$emit("change", data);
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
        chooseImage() {
            uni.chooseImage({
                count: this.count,
                success: res => {
                    console.log(res.type);
                    Promise.all(
                        res.tempFilePaths.map(filePath =>
                            this.uploadFile(filePath)
                        )
                    ).then(data => {
                        this.$emit("change", data);
                    });
                    [this.src] = res.tempFilePaths;
                },
                fail: res => {
                    // alert(res);
                }
            });
        },
        chooseVideo() {
            uni.chooseVideo({
                success: res => {
                    if (res.size / 1000 / 1000 > this.maxSize) {
                        return uni.showToast({
                            title: "视频规格过大，请在PC官网上传",
                            icon: "none"
                        });
                    }
                    const filePath = res.tempFilePath;
                    this.src = filePath;
                    return this.uploadVideo(filePath, res);
                }
            });
        },
        chooseResource() {
            const isAndroid =
                this.isH5 && utils.getAppType() === "android" ? true : false;
            if (this.type === "image") {
                if (isAndroid) {
                    this.chooseImage();
                } else {
                    api.Permissions("image").then(() => {
                        this.chooseImage();
                    });
                }
            } else if (this.type === "video") {
                if (isAndroid) {
                    this.chooseVideo();
                } else {
                    api.Permissions("video").then(() => {
                        this.chooseVideo();
                    });
                }
            }
        }
    }
};
</script>

<style lang="less">
.comp-upload {
    .comp-upload-box {
        display: flex;
    }
    .comp-title {
        font-size: 28upx;
        color: #999;
        margin-bottom: 15upx;
    }
    .cover-wrap {
        width: 192upx;
        height: 108upx;
        background: #f0f0f0;
        margin-right: 16upx;
        text-align: center;
        position: relative;
        background-color: #ecf3ff;

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
        .normal-text {
            color: #fff;
            line-height: 1.2;
        }
        .blue-text {
            color: #fff;
            line-height: 1.2;
        }
        &.image {
            padding-top: 0;
            line-height: 38upx;
        }
    }

    .icon-video,
    .icon-image {
        display: inline-block;
        width: 78upx;
        height: 56upx;
        margin-top: 26rpx;
    }
    .text-success {
        color: #999;
        font-size: 24upx;
    }

    .icon-success {
        display: inline-block;
        width: 42rpx;
        height: 42rpx;
        margin-top: 15rpx;
    }

    .icon-desc {
        position: absolute;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        width: 100%;
        height: 44upx;
        line-height: 44upx;
        color: #fff;
        font-size: 24upx;
    }
    .tips {
        font-size: 22upx;
        color: #bfbfbf;
        line-height: 24upx;
        padding-top: 10upx;
    }
}
</style>
