<template>
    <!-- eslint-disable -->
    <view>
        <view class="imgs">
            <!-- images -->
            <view
                v-for="(item, key) in list"
                v-if="item.type == 'image'"
                :key="key"
                class="single"
            >
                <image
                    :src="item.url"
                    mode="aspectFit"
                    @click="previewImg(item.url)"
                />
                <progress
                    v-if="mode == 'create' && showProcess"
                    :percent="item.process"
                    activeColor="#67C23A"
                    :backgroundColor="
                        item.process == 100 || item.process == undefined
                            ? '#67C23A'
                            : '#F56C6C'
                    "
                    stroke-width="3"
                />
                <view class="del" @click="deleteItem(key)">
                    ×
                </view>
            </view>
            <!-- file -->
            <view
                v-for="(item, key) in list"
                v-if="item.type == 'file'"
                :key="key"
                class="file"
            >
                <view
                    class="noImg"
                    @click="downLoad(item.url)"
                    @longpress="deleteItem(key)"
                >
                    {{ item.fileName }}
                </view>
                <progress
                    v-if="mode == 'create' && showProcess"
                    :percent="item.process"
                    activeColor="#67C23A"
                    :backgroundColor="
                        item.process == 100 || item.process == undefined
                            ? '#67C23A'
                            : '#F56C6C'
                    "
                    stroke-width="3"
                />
                <view class="del" @tap="deleteItem(key)">
                    ×
                </view>
            </view>
            <!-- add button -->
            <view
                v-if="mode == 'create'"
                class="single addNew"
                @click="chooseFile"
            >
                <text class="cuIcon-add">
                    +
                </text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        attachmentList: {
            type: Array // 附件列表
        },
        mode: {
            type: String // 模式： create => 可新增或编辑附件 不填或其他 => 只能查看附件
        },
        uploadFileUrl: {
            type: String,
            dafault: "#" // 上传文件的服务器url
        },
        showProcess: {
            type: Boolean,
            default: true // 是否显示进度，默认显示
        },
        header: {
            type: Object // 上传图片到服务器时，HTTP 请求 Header
        },
        limit: {
            type: Number, // 限制可上传的图片数量
            default: null
        },
        fileKeyName: {
            type: String,
            default: "file" // 用于在服务端通过自定义key值获取该文件数据
        },
        canUploadFile: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {};
    },
    computed: {
        list() {
            return this.attachmentList;
        }
    },
    methods: {
        previewImg(url) {
            uni.previewImage({
                current: 0,
                urls: [url]
            });
        },
        downLoad(url) {
            uni.showModal({
                title: "确定要下载此附件吗",
                content: " ",
                success: res => {
                    if (res.confirm) {
                        uni.showLoading({
                            title: "下载中,请稍后"
                        });
                        console.log(url);
                        uni.downloadFile({
                            url,
                            success: res => {
                                const tempFile = res.tempFilePath;
                                uni.saveFile({
                                    tempFilePath: res.tempFilePath,
                                    success: res => {
                                        const { savedFilePath } = res;
                                        uni.hideLoading();
                                        uni.showToast({
                                            title: `保存成功，路径为${savedFilePath}`
                                        });
                                        uni.openDocument({
                                            filePath: savedFilePath,
                                            success(res) {
                                                console.log(res);
                                            }
                                        });
                                    }
                                });
                            },
                            fail: res => {
                                console.log(res);
                                uni.hideLoading();
                                uni.showToast({
                                    title: "下载失败",
                                    icon: "none"
                                });
                            }
                        });

                        setTimeout(() => {
                            uni.hideLoading();
                        }, 20000);

                        // downloadTask.onProgressUpdate((res) => {
                        //     console.log('下载中,进度' +  res.progress)
                        // });
                    }
                }
            });
        },
        deleteItem(index) {
            uni.showModal({
                title: "提示",
                content: "确定要删除此项吗？",
                success: res => {
                    if (res.confirm) {
                        if (this.list[index].process != 100) {
                            typeof this.list[index].uploadTask !==
                                "undefined" &&
                                this.list[index].uploadTask.abort();
                        }
                        this.list.splice(index, 1);
                        this.$forceUpdate();
                        this.$emit("update:attachmentList", this.list);
                    }
                }
            });
        },
        async chooseFile() {
            if (this.limit != null && !isNaN(this.limit)) {
                if (this.list.length >= this.limit) {
                    uni.showToast({
                        title: "已达到最大上传数量",
                        icon: "none"
                    });
                    return;
                }
            }

            let { canUploadFile } = this;
            // 非APP平台不可以上传文件
            // #ifndef APP-PLUS || MP-WEIXIN
            canUploadFile = false;
            // #endif

            // #ifdef APP-PLUS
            // APP 需调用uniapp插件市场的chuck-filemanager插件，可以选择试用，然后在mainfest.json中勾选该插件，既可在自定义基座中运行
            // chuck-filemanager插件地址 https://ext.dcloud.net.cn/plugin?id=680
            if (canUploadFile) {
                const open = uni.requireNativePlugin("chuck-filemanager");
                const temp = await new Promise(resoleve => {
                    open.onIntent("996", path => {
                        resoleve(path);
                    });
                });
                var tempFiles = [`file:///${temp}`];
            }
            // #endif

            if (!canUploadFile) {
                var temps = await uni.chooseImage({
                    count:
                        this.limit == null || this.limit - this.list.length > 9
                            ? 9
                            : 9 - limit,
                    sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ["album"] // 从相册选择
                });

                if (typeof temps[1] === "undefined") {
                    return;
                }
                var tempFiles = temps[1].tempFilePaths;
            } else {
                // #ifdef MP-WEIXIN
                const res = await uni.showActionSheet({
                    itemList: ["选择图片", "选择文件"]
                });
                if (res[1].tapIndex == 0) {
                    var temps = await uni.chooseImage({
                        count:
                            this.limit == null ||
                            this.limit - this.list.length > 9
                                ? 9
                                : 9 - limit,
                        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ["album"] // 从相册选择
                    });

                    if (typeof temps[1] === "undefined") {
                        return;
                    }
                    var tempFiles = temps[1].tempFilePaths;
                } else {
                    // 微信从客户端选择文件
                    var temps = await new Promise((resolve, reject) => {
                        wx.chooseMessageFile({
                            count:
                                this.limit == null ||
                                this.limit - this.list.length > 9
                                    ? 9
                                    : 9 - limit,
                            type: "file",
                            success(res) {
                                // tempFilePath可以作为img标签的src属性显示图片
                                const tempFilePaths = res.tempFiles;
                                resolve(tempFilePaths);
                            }
                        });
                    });

                    var tempFiles = temps.map((ele, index) => ele.path);

                    var fileNames = temps.map((ele, index) => ele.name);
                }
                // #endif
            }

            for (const i in tempFiles) {
                const path = tempFiles[i];
                if (
                    typeof fileNames !== "undefined" &&
                    typeof fileNames[i] !== "undefined"
                ) {
                    var fileName = fileNames[i];
                } else {
                    var fileName = path.split("/");
                    fileName = fileName[fileName.length - 1];
                }
                const index = this.list.length;

                // 开始上传，先暂存文件
                this.list.push({
                    fileName,
                    url: path,
                    type: this.isImg(path) ? "image" : "file",
                    index,
                    uploadTask,
                    process: 0
                });
                this.$forceUpdate();

                var uploadTask = await uni.uploadFile({
                    url: this.uploadFileUrl,
                    filePath: path,
                    name: this.fileKeyName,
                    headers: this.header,
                    success: res => {
                        // 上传完成后处理
                        this.$emit("uploadSuccess", res);
                        if (res.statusCode == 200) {
                            this.$set(this.list[index], "process", 100);
                            this.$emit("update:attachmentList", this.list);
                            this.$forceUpdate();
                        } else {
                        }
                    }
                });

                uploadTask.onProgressUpdate(res => {
                    // 此接口不显示真实进度， 所以需要特殊处理
                    if (res.progress < 90) {
                        this.$set(this.list[index], "process", res.progress);
                        this.$forceUpdate();
                    }
                });
            }
        },
        // 根据文件名，返回时是否是图片类型
        isImg(filePath) {
            const index = filePath.lastIndexOf(".");
            const ext = filePath.substr(index + 1);
            const temp =
                [
                    "png",
                    "jpg",
                    "jpeg",
                    "bmp",
                    "gif",
                    "webp",
                    "svg",
                    "tiff"
                ].indexOf(ext.toLowerCase()) !== -1;
            return temp;
        }
    }
};
</script>

<style lang="less" scoped>
.imgs {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% + 15rpx);

    & .file {
        min-width: calc(100% - 15rpx);
        border: 1px solid #ccc;
        // border-radius: 10upx;
        box-sizing: border-box;
        margin-top: 20upx;
        position: relative;

        & .noImg {
            padding: 20rpx;
            display: flex;
            justify-content: center;
            text-align: left;
            width: 100%;
            font-size: 26upx;
            // flex-wrap: wrap;
            color: #999;
            word-break: break-all;
            box-sizing: border-box;
        }
    }

    progress {
        margin-top: -6rpx;
        border-radius: 20rpx;
    }

    .del {
        position: absolute;
        width: 35rpx;
        height: 35rpx;
        background: #f56c6c;
        color: #fff;
        border-radius: 35rpx;
        top: -18rpx;
        text-align: center;
        right: -18rpx;
        line-height: 35rpx;
        font-size: 30rpx;
        z-index: 100;
    }

    & .single {
        width: 200upx;
        height: 112upx;
        // border: 1px solid #ccc;
        box-shadow: 0px 0px 6rpx #ccc;
        border-radius: 6rpx;
        margin-top: 20upx;
        margin-right: 12rpx;
        position: relative;

        // &:nth-of-type(5n) {
        // 	margin-right: 0;
        // }

        &.addNew {
            display: flex;
            justify-content: center;
            align-items: center;

            text {
                font-size: 50rpx;
                color: #999;
            }
        }

        & image {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
}
</style>
