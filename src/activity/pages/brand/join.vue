<template>
    <div :class="['join-page', !userInfo ? 'join-page-login' : '']">
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <view v-else>
            <posterh5
                ref="posterh5"
                :config="posterCommonConfig"
                :hide-loading="true"
                @success="onPosterSuccess"
                @fail="onPosterFail"
            />
            <form>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        <text>*</text>姓名
                    </view>
                    <view class="input-box">
                        <input
                            v-model="formData.name"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="6"
                            placeholder="请填写您的真实姓名"
                        >
                        <text class="text-num">
                            {{ formData.name.length }}/6
                        </text>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        学校
                    </view>
                    <view class="input-box">
                        <input
                            v-model="formData.school_name"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="15"
                            placeholder="请填写您的学校名称"
                        >
                        <text class="text-num">
                            {{ formData.school_name.length }}/15
                        </text>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        <text>*</text>代言宣言
                    </view>
                    <view class="input-box">
                        <input
                            v-model="formData.slogan"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="20"
                            placeholder="让世界听到你的声音"
                        >
                        <text class="text-num">
                            {{ formData.slogan.length }}/20
                        </text>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        推荐老师
                    </view>
                    <view class="input-box">
                        <input
                            v-model="formData.teacher"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="6"
                            placeholder="请填写推荐老师姓名"
                        >
                        <text class="text-num">
                            {{ formData.teacher.length }}/6
                        </text>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        自我介绍
                    </view>
                    <view class="input-box textarea">
                        <textarea
                            v-model="formData.desc"
                            class="uni-textarea"
                            maxlength="150"
                            placeholder-style="color:#999;"
                            placeholder="如有获奖经历可描述"
                        />
                        <text class="text-num">
                            {{ formData.desc.length }}/150
                        </text>
                    </view>
                </view>
                <view class="uni-form-item uni-column">
                    <view class="title">
                        <text>*</text>自信靓照
                    </view>
                    <view class="content">
                        <view class="image-box">
                            <image
                                v-if="formData.image"
                                class="user-img"
                                :src="formData.image"
                            />
                            <view
                                v-else
                                class="choose-image-box"
                                @tap="chooseImage()"
                            >
                                <image
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_upload_bg.png"
                                />
                            </view>
                        </view>

                        <view class="tips-box">
                            <view class="text">
                                建议竖版照片，大小不超过2M
                            </view>
                            <view
                                v-if="formData.image"
                                class="btn-box"
                            >
                                <text
                                    class="btn-item"
                                    @click="togglePreview(true)"
                                >
                                    预览海报
                                </text>
                                <text
                                    class="btn-item"
                                    @tap="chooseImage()"
                                >
                                    更换图片
                                </text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="uni-btn-v">
                    <button @click="formSubmit">
                        提交
                    </button>
                </view>
            </form>
        </view>
        <view
            v-if="posterPreview"
            class="poster-preview"
        >
            <view class="poster-preview-box">
                <view class="poster-bg">
                    <image
                        class="user-image"
                        :src="formData.image"
                    />
                    <view class="name-slogan-bg">
                        <view class="name">
                            我是{{ formData.name }}
                        </view>
                        <view class="slogan">
                            {{ formData.slogan }}
                        </view>
                    </view>
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-10.png"
                        class="qr-code"
                    />
                </view>
                <view
                    class="close-btn"
                    @click="togglePreview(false)"
                >
                    <img
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_close.png"
                    >
                </view>
            </view>
        </view>
        <view class="image-cutter-zindex">
            <imageCutter
                v-if="url"
                :url="url"
                :fixed="true"
                :blob="false"
                :width="380"
                :height="506"
                @ok="onok"
                @cancel="oncancle"
            />
        </view>
    </div>
</template>
<script>
// import QRCode from 'qrcodejs2';
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';
import imageCutter from '../../../components/image-cutter/image-cutter.vue';
import config from '../../../common/config';
import utils from '../../../common/utils';
import posterh5 from './posterh5.vue';
import share from '../../../common/share';

export default {
    components: {
        login,
        imageCutter,
        posterh5,
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            userInfo: {},
            formData: {
                school_name: '',
                name: '',
                desc: '',
                teacher: '',
                slogan: '',
                image: '',
            },
            url: '',
            width: 192,
            height: 256,
            validateRule: [
                {
                    type: 'name',
                    errorMsg: '请填写您的姓名',
                },
                {
                    type: 'slogan',
                    errorMsg: '请填写您的代言宣言',
                },
                {
                    type: 'image',
                    errorMsg: '请上传您的照片',
                },
            ],
            posterPreview: false,
            posterCommonConfig: {
                pixelRatio: 2,
                width: 568,
                height: 818,
                debug: false,
                texts: [
                    {
                        text: '',
                        height: 30,
                        textAlign: 'center',
                        y: 568,
                        x: 233,
                        fontSize: '30',
                        color: '#fff',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '',
                        width: 570,
                        height: 25,
                        textAlign: 'center',
                        y: 649,
                        x: 285,
                        fontSize: '24',
                        color: '#FFC953',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        zIndex: 100,
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster.jpg?x-oss-process=image/format,jpg/interlace,1/quality,Q_70/resize,m_pad,w_570,h_818',
                        width: 570,
                        height: 818,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 372,
                        height: 500,
                        y: 168,
                        x: 99,
                        borderRadius: 40,
                    },
                    {
                        url: '',
                        width: 528,
                        height: 145,
                        y: 526,
                        x: 21,
                    },
                    {
                        url: '',
                        width: 122,
                        height: 122,
                        y: 677,
                        x: 428,
                        borderRadius: this.isH5 ? 0 : 122,
                    },
                ],
            },
        };
    },
    created() {
        this.getUserInfo();
        this.publicConfig = this.$store.getters.getPublicConfig(10);
        this.initShare();
    },
    methods: {
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[0];
            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
            });
        },
        initFormat(userInfo) {
            this.formData.name = userInfo.name.length > 6
                ? userInfo.name.slice(0, 6)
                : userInfo.name;
            if (userInfo.identity === 4) {
                this.formData.school_name = userInfo.student_info.school_name || '';
            } else {
                this.formData.school_name = userInfo.teacher_info.school_name || '';
            }
        },
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            if (this.userInfo.identity !== 1) {
                this.initFormat(this.userInfo);
            }
            this.getQrCode();
        },
        onPosterSuccess(detail) {
            this.submit(detail);
        },
        onPosterFail(err) {
            console.log(err);
            uni.showToast({
                title: '生成失败，稍后再试',
                duration: 2000,
                icon: 'none',
            });
        },
        getUserInfo() {
            api.get('/api/user/info').then((res) => {
                this.userInfo = res.user_info;
                if (this.userInfo.identity !== 1) {
                    this.initFormat(this.userInfo);
                }
                this.getQrCode();
            });
        },
        getQrCode() {
            if (this.isH5) {
                this.getH5QrCode();
            } else {
                this.getMpQrCode();
            }
        },
        getH5QrCode() {
            const uCenterUrl = `${window.location.origin}/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.user_id}&w=244`;
            this.posterCommonConfig.images[3].url = `${
                window.location.origin
            }/api/common/qrcode?url=${decodeURI(uCenterUrl)}`;
            this.posterCommonConfig.images[3].borderRadius = 0;
        },
        getMpQrCode() {
            // 小程序二维码
            const url = '/activity/pages/brand/ucenter';
            const scene = `activity_id=10&user_id=${this.userInfo.user_id}`;
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    if (url) {
                        this.base64src(url, (res) => {
                            this.posterCommonConfig.images[3].url = res;
                        });
                    } else {
                        this.posterCommonConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    }
                },
                () => {
                    this.posterCommonConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
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
        chooseImage() {
            uni.chooseImage({
                count: 1,
                sourceType: ['album'],
                success: (res) => {
                    console.log(res);
                    // 设置url的值，显示控件
                    [this.url] = res.tempFilePaths;
                },
            });
        },
        onok(ev) {
            this.uploadFile(ev.path).then((data) => {
                this.url = '';
                this.formData.image = data.path;
                console.log(data);
            });
        },
        oncancle() {
            // url设置为空，隐藏控件
            this.url = '';
        },
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                        file_type: 'image',
                    },
                    header: {
                        userKey: utils.getToken(),
                    },
                    success: (uploadFileRes) => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: '服务器开小差了~',
                                icon: 'none',
                            });
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            uni.hideToast();
                            resolve(resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: 'none',
                            });
                            return reject(resp.msg);
                        }
                        return false;
                    },
                });
            });
        },
        formSubmit() {
            if (!this.lock) {
                this.lock = true;
                if (this.validate()) {
                    uni.showLoading();
                    this.createPoster();
                }
            }
        },
        createPoster() {
            this.posterCommonConfig.images[1].url = this.formData.image;
            this.posterCommonConfig.images[2].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster_name.png';
            this.posterCommonConfig.texts[0].text = `我是${this.formData.name}`;
            this.posterCommonConfig.texts[1].text = `${this.formData.slogan}`;
            this.$refs.posterh5.createPoster(this.posterCommonConfig);
        },
        submit(path) {
            this.uploadFile(path).then((data) => {
                this.formData[this.isH5 ? 'poster_h5' : 'poster_mp'] = data.path;
                api.post('/api/activity/enroll', {
                    detail: this.formData,
                    activity_id: 10,
                }).then(
                    () => {
                        this.lock = false;
                        uni.showToast({
                            title: '提交成功',
                            icon: 'success',
                        });
                        uni.setStorageSync('brand_first', true);
                        setTimeout(() => {
                            uni.reLaunch({
                                url: '/activity/pages/index?activity_id=10',
                            });
                        }, 2000);
                    },
                    (err) => {
                        this.lock = false;
                        uni.showToast({
                            icon: 'none',
                            title: err.message,
                        });
                    },
                );
            });
        },
        validate() {
            let status = true;
            try {
                this.validateRule.forEach((item) => {
                    if (this.formData[item.type].trim() === '') {
                        throw Error(item.type);
                    }
                });
            } catch (e) {
                this.lock = false;
                status = false;
                uni.showToast({
                    title: this.validateRule.filter(
                        v => v.type === e.message,
                    )[0].errorMsg,
                    icon: 'none',
                });
            }
            return status;
        },
        resetData() {
            Object.keys(this.formData).forEach((item) => {
                this.formData[item] = '';
            });
        },
        togglePreview(status) {
            if (!this.lock) {
                this.lock = true;
                if (this.validate()) {
                    this.posterPreview = status;
                    this.lock = false;
                }
            }
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.shareConfig.path,
        };
    },
};
</script>
<style lang="less" scoped>
.join-page {
    padding: 40upx 30upx 110upx;
    background-color: #583ed4;
    &.join-page-login {
        background-color: #fff;
    }
    .image-cutter-zindex {
        position: relative;
        z-index: 100;
    }
    .canvas.pro {
        position: absolute;
        bottom: 0;
        left: 0;
        transform: translate3d(-9999rpx, 0, 0);
    }
    .uni-form-item {
        margin-bottom: 40upx;
        .title {
            color: #fff;
            font-size: 30upx;
            line-height: 34upx;
            margin-bottom: 16upx;
            text {
                color: #f00;
                display: inline-block;
                margin-right: 8upx;
                font-size: 32upx;
                vertical-align: middle;
            }
        }
        .input-box {
            position: relative;
            &.textarea {
                .text-num {
                    bottom: 10upx;
                    top: auto;
                    transform: translateY(0%);
                }
            }
        }
        .text-num {
            position: absolute;
            right: 24upx;
            top: 50%;
            transform: translateY(-50%);
            color: #999999;
            font-size: 30upx;
        }
        .uni-input,
        .uni-textarea {
            border: 1px solid #ccc;
            border-radius: 44upx;
            font-size: 30upx;
            height: 88upx;
            padding: 0 110upx 0 24upx;
            box-sizing: border-box;
            background-color: #fff;
        }
        .uni-textarea {
            width: 100%;
            height: 277upx;
            padding: 21upx 24upx 50upx 24upx;
            box-sizing: border-box;
            border-radius: 20upx;
        }
        .uni-placeholder {
            color: #999;
            font-size: 30upx;
        }
        .uni-input-code {
            display: flex;
            .uni-input {
                width: 480upx;
                margin-right: 24upx;
            }
        }
        .content {
            display: flex;
            .image-box {
                width: 192upx;
                height: 256upx;
                margin-right: 20upx;
                border-radius: 20upx;
                background-color: #fff;
                .user-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 20upx;
                }
                .choose-image-box {
                    image {
                        width: 79upx;
                        height: 57upx;
                        margin: 93upx auto 0;
                        display: block;
                    }
                }
            }
            .tips-box {
                padding: 40upx 0 65upx 0;
                .text {
                    color: #fff;
                    font-size: 30upx;
                    margin-bottom: 60upx;
                }
                .btn-item {
                    height: 60upx;
                    line-height: 60upx;
                    padding: 0 24upx;
                    border-radius: 30upx;
                    font-size: 30upx;
                    background-color: #906fff;
                    margin-right: 43upx;
                    display: inline-block;
                    color: #fff;
                }
            }
        }
    }
    .uni-btn-v {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        button {
            background-color: #ff685c;
            color: #fff;
            height: 108upx;
            line-height: 108upx;
            border-radius: 0;
        }
    }
    .poster-preview {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10;
        .poster-preview-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .poster-bg {
            width: 570upx;
            height: 820upx;
            padding: 169upx 21upx 20upx;
            box-sizing: border-box;
            background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster.jpg");
            background-size: 100% 100%;
            position: relative;
        }
        .close-btn {
            width: 52upx;
            height: 52upx;
            margin: 37upx auto 0;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
        .user-image {
            width: 371upx;
            height: 498upx;
            margin: 0 auto;
            display: block;
            border-radius: 20upx;
        }
        .name-slogan-bg {
            position: absolute;
            bottom: 150upx;
            left: 21upx;
            width: 528upx;
            height: 145upx;
            background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster_name.png");
            background-size: 100% 100%;
        }
        .name {
            color: #fff;
            height: 71upx;
            line-height: 68upx;
            font-size: 32upx;
            margin-bottom: 14upx;
            width: 270upx;
            margin-left: 34upx;
            text-align: center;
        }
        .slogan {
            text-align: center;
            font-size: 24upx;
            color: #ffc953;
            height: 62upx;
            line-height: 62upx;
            font-style: italic;
        }
        .qr-code {
            width: 122upx;
            height: 122upx;
            position: absolute;
            right: 20upx;
            bottom: 20upx;
            border-radius: 50%;
        }
    }
}
</style>
