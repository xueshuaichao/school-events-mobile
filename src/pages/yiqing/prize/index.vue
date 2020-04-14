<template>
    <view class="page-upload">
        <view
            v-show="prompt"
            class="activerulebox"
        >
            <image
                class="saveImg"
                :src="canvasImg"
            />
            <!-- 保存图片 -->
            <view
                v-show="!imgAuthBtn"
                class="saveBtn"
                @click="handleSave"
            >
                保存到本地
            </view>
            <button
                v-show="imgAuthBtn"
                open-type="openSetting"
                class="saveBtn"
                @opensetting="checkImgAuthFun"
            >
                授权相册并保存到本地
            </button>
            <!-- <image
                class="close"
                src="/static/images/yiqing/close-icon.png"
                @click="handleClose"
            /> -->
        </view>
        <view class="main">
            <view class="uni-form-item uni-column bt-sep">
                <view class="uni-name">
                    姓名
                </view>
                <input
                    v-model="formData.name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="5"
                    placeholder="真实姓名（最多5个字符）"
                >
            </view>
            <view class="uni-form-item uni-column bt-sep">
                <view class="uni-name">
                    作品名称
                </view>
                <input
                    v-model="formData.work"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="8"
                    placeholder="作品名称（最多8个字符）"
                >
            </view>
            <poster
                id="poster"
                :config="posterConfig"
                @success="onPosterSuccess"
                @fail="onPosterFail"
            />
            <view
                class="btn"
                @click="handleupload"
            >
                领取证书
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    components: {},
    data() {
        return {
            imgAuthBtn: false,
            // #ifdef H5
            isH5: true,
            // #endif
            poster: null,
            isLoading: false,
            prompt: false,
            formData: {
                name: '',
                work: '',
            },
            title: 'picker',
            canvasImg: '',
            posterConfig: {
                pixelRatio: 3,
                width: 690,
                height: 988,
                debug: false,
                texts: [
                    {
                        // 0
                        x: 61,
                        y: 243,
                        text: [
                            {
                                text: '一二三',
                                fontSize: 32,
                                color: '#333333',
                                opacity: 1,
                                lineHeight: 40,
                                // lineNum: 1,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 1
                        x: 61, // 5：220, 3:160
                        y: 243,
                        text: [
                            {
                                text: '',
                                fontSize: 28,
                                color: '#666666',
                                opacity: 1,
                                lineHeight: 40,
                                // lineNum: 1,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 2
                        x: 61,
                        y: 320,
                        text: [
                            {
                                text:
                                    '       感谢您参与“抗击疫情艺起来”主题公益活动，在这个特殊的时期，您用才艺和爱心传递力量，共同抗击疫情，用自己独特的方式为武汉加油！为中国加油！',
                                fontSize: 28,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 4,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 3
                        x: 61,
                        y: 495,
                        text: [
                            {
                                text: '       经评审，您的作品',
                                fontSize: 28,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 2,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 4
                        x: 61,
                        y: 495,
                        text: [
                            {
                                text: '', // 《来为武汉加油啊啊》
                                fontSize: 32,
                                color: '#333333',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 2,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 5
                        x: 61,
                        y: 495,
                        text: [
                            {
                                text: '', // 在本次活动中荣获青少年组
                                fontSize: 28,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 2,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 6
                        // x: 400,
                        // y: 533,
                        x: 61,
                        y: 495,
                        text: [
                            {
                                text: '优秀奖',
                                fontSize: 32,
                                color: '#FF481E',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 2,
                                width: 1600,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 7
                        x: 374,
                        y: 633,
                        text: [
                            {
                                text: '特颁此证，以资纪念',
                                fontSize: 28,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                // lineNum: 1,
                                width: 800,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 8
                        x: 335,
                        y: 821,
                        text: [
                            {
                                text: '青少年“爱挑战”活动组委会',
                                fontSize: 24,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 1,
                                width: 900,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                    {
                        // 9
                        x: 360,
                        y: 856,
                        text: [
                            {
                                text: '一',
                                fontSize: 24,
                                color: '#666',
                                opacity: 1,
                                lineHeight: 40,
                                lineNum: 1,
                                width: 900,
                                // textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                ],
                images: [
                    {
                        url:
                            'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/prize.png',
                        width: 690,
                        height: 988,
                        x: 0,
                        y: 0,
                    },
                    {
                        url: '',
                        width: 152,
                        height: 152,
                        x: 65,
                        y: 752,
                    },
                ],
            },
            activityCat: '1',
        };
    },
    onLoad(query) {
        const { activity_cat: activityCat, id } = query;
        this.activityCat = activityCat;
        this.poster = this.selectComponent('#poster');
        this.handleTicketMask(id);
        this.getAuthStatus();
    },
    created() {},
    onShow() {},
    methods: {
        getAuthStatus() {
            const that = this;
            // eslint-disable-next-line no-undef
            wx.getSetting({
                // 获取设置
                success(res) {
                    if (res.authSetting['scope.writePhotosAlbum'] === false) {
                        // 说明未授权
                        that.imgAuthBtn = true;
                    } else {
                        that.imgAuthBtn = false;
                    }
                },
            });
        },
        checkImgAuthFun(res) {
            // 二次以上检验是否授权图片
            const that = this;
            if (!res.detail.authSetting['scope.writePhotosAlbum']) {
                // 二次以上授权, 如果未授权
                // eslint-disable-next-line no-undef
                wx.showToast({
                    title: '授权失败',
                    icon: 'none',
                });
            } else {
                // eslint-disable-next-line no-undef
                wx.showToast({
                    title: '授权成功',
                    icon: 'none',
                    success() {
                        uni.showLoading({
                            mask: true,
                        });
                        that.saveImage();
                    },
                });
            }
        },
        handleSave() {
            console.log('保存触发');
            const that = this;
            // eslint-disable-next-line no-undef
            wx.authorize({
                // 获取相册授权信息
                scope: 'scope.writePhotosAlbum',
                success() {
                    // 已授权
                    that.saveImage();
                },
                fail() {
                    // 未授权
                    that.imgAuthBtn = true;
                    // eslint-disable-next-line no-undef
                    wx.showToast({
                        title: '保存失败请授权',
                        icon: 'none',
                    });
                },
            });
        },
        saveImage() {
            const that = this;
            // 图片保存到本地
            // eslint-disable-next-line no-undef
            wx.saveImageToPhotosAlbum({
                filePath: this.canvasImg,
                success() {
                    uni.hideLoading();
                    that.prompt = false;
                    uni.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000,
                    });
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 2000);
                },
                fail() {},
            });
        },
        handleTicketMask(id) {
            uni.showLoading({
                mask: true,
            });
            const url = 'pages/yiqing/detail/detail';
            const scene = `id=${id}` || 'id=325';
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    uni.hideLoading();
                    if (url) {
                        this.base64src(url, (res) => {
                            this.posterConfig.images[1].url = res;
                        });
                    } else {
                        this.posterConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    }
                },
                () => {
                    this.posterConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    uni.hideLoading();
                },
            );
        },
        // base64转url
        base64src(base64data, cb) {
            // eslint-disable-next-line no-undef
            const fsm = wx.getFileSystemManager();
            // const FILE_BASE_NAME = 'tmp_base64src'; // 自定义文件名
            const FILE_BASE_NAME = `tmp_base64src_${new Date() - 0}`; // 自定义文件名
            const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
            if (!format) {
                return new Error('ERROR_BASE64SRC_PARSE');
            }
            // eslint-disable-next-line no-undef
            const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
            // eslint-disable-next-line no-undef
            const buffer = wx.base64ToArrayBuffer(bodyData);
            fsm.writeFile({
                filePath,
                data: buffer,
                encoding: 'binary',
                success() {
                    cb(filePath);
                },
                fail() {
                    return new Error('ERROR_BASE64SRC_WRITE');
                },
            });
            return '';
        },
        resetForm() {
            this.formData = {
                name: '',
                work: '',
            };
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
        onPosterSuccess(e) {
            const { detail } = e;
            this.canvasImg = detail;
            this.prompt = true;
        },
        onPosterFail(e) {
            console.log(e, 'fail');
        },
        handleClose() {
            this.prompt = false;
        },
        ConverToDate() {
            const date = new Date();
            const chinese = [
                '零',
                '一',
                '二',
                '三',
                '四',
                '五',
                '六',
                '七',
                '八',
                '九',
            ];
            const y = date.getFullYear().toString();
            const m = (date.getMonth() + 1).toString();
            const d = date.getDate().toString();

            let result = '';
            for (let i = 0; i < y.length; i += 1) {
                result += chinese[y.charAt(i)];
            }
            result += '年';
            if (m.length === 2) {
                result += `十${
                    m.charAt(1) === '0' ? '' : chinese[m.charAt(1)]
                }月`;
            } else {
                result += `${chinese[m.charAt(0)]}月`;
            }
            if (d.length === 2) {
                if (d.charAt(0) === '1') {
                    result += `十${
                        d.charAt(1) === '0' ? '' : chinese[d.charAt(1)]
                    }日`;
                } else {
                    result += `${chinese[d.charAt(0)]}十${
                        d.charAt(1) === '0' ? '' : chinese[d.charAt(1)]
                    }日`;
                }
            } else {
                result += `${chinese[d.charAt(0)]}日`;
            }
            return result;
        },
        handleupload() {
            const formData = Object.assign({}, this.formData);
            // 移除首尾空格
            formData.name = formData.name.replace(/(^\s*)|(\s*$)/g, '');
            if (!formData.name) {
                return this.errTip('请填写真实姓名！');
            }
            if (!formData.work) {
                return this.errTip('请填写作品名称！');
            }
            this.posterConfig.texts[0].text[0].text = this.formData.name;
            if (this.activityCat === '1') {
                this.posterConfig.texts[1].text[0].text = `${this.getTextPadding(
                    this.formData.name.length,
                )}同学`;
            }
            this.posterConfig.texts[4].text[0].text = `${this.getTextPadding(
                7,
            )}《${this.formData.work}》`;
            const texts5 = `在本次活动中荣获${
                this.activityCat === '1' ? '青少年组' : '成年组'
            }`;
            this.posterConfig.texts[5].text[0].text = `${this.getTextPadding(
                this.formData.work.length + 10,
            )}${texts5}`;
            this.posterConfig.texts[6].text[0].text = `${this.getTextPadding(
                this.formData.work.length + 5 + texts5.length,
                '',
            )}优秀奖`;
            this.posterConfig.texts[9].text[0].text = `${this.ConverToDate()}`;
            uni.showLoading();

            this.poster.onCreate(this.posterConfig);
            return '';
        },
        getTextPadding(length, space) {
            let padding5 = ' ';
            if (space) {
                padding5 += space;
            }
            for (let i = 0; i < length; i += 1) {
                padding5 += '    ';
            }
            return padding5;
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
    .activerulebox {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        z-index: 999;
        .saveImg {
            position: absolute;
            width: 690upx;
            height: 988upx;
            left: 30upx;
            top: 30upx;
        }
        .saveBtn {
            position: absolute;
            width: 100%;
            height: 110upx;
            // left: 115upx;
            bottom: 0upx;
            background: #0084ff;
            // border-radius: 55upx;
            color: #fff;
            font-weight: 600;
            font-size: 36upx;
            line-height: 110upx;
            text-align: center;
            letter-spacing: 2rpx;
        }
        .close {
            position: absolute;
            width: 54upx;
            height: 54upx;
            left: 348upx;
            top: 1074upx;
        }
    }
    .main {
        min-height: 100vh;
        box-sizing: border-box;
        padding: 30rpx;
        background: #1154ff;
        color: #fff;
    }
    .uni-name {
        margin-left: 20upx;
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
        border-radius: 44rpx;
        color: #6691ff;
        margin-top: 20rpx;
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
