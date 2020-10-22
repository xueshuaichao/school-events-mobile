<template>
    <view :class="[`${publicConfig.activityName}-page`]">
        <template v-if="isH5 && activityId === 12">
            <img
                class="preload-img"
                crossorigin="anonymous"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/bayi_upload_success.png"
                alt=""
            >
        </template>
        <div class="page-read-upload-result">
            <view class="icon-wrap">
                <image
                    v-if="publicConfig.activityName"
                    class="icon icon-success"
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_success.png`
                    "
                />
            </view>
            <view class="main-title">
                恭喜您，上传成功!
            </view>
            <view class="sub-title">
                <view
                    v-if="addNum === 1"
                    class="tips"
                >
                    恭喜您获得一次抽奖机会，快去抽大奖吧！
                </view>
                <view
                    v-else
                    class="tips"
                >
                    管理员会尽快审核，请耐心等候！
                </view>
                <text
                    class="link btn mr-right"
                    @click="reUpload"
                >
                    再次上传作品
                </text>
                <text
                    class="link btn blue-bg"
                    @click="goToUc"
                >
                    查看作品
                </text>
            </view>
            <view
                v-if="addNum === 1"
                class="add-img"
                @click="jumpHome"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_add.png"
                />
            </view>
            <goHome :path="publicConfig.homePath" />
            <template v-if="activityId === 12">
                <posterh5
                    ref="posterh5"
                    :config="posterCommonConfig"
                    :hide-loading="true"
                    :width="630"
                    :height="886"
                    @success="onPosterSuccess"
                    @fail="onPosterFail"
                />
                <!-- 我的海报 -->
                <savePoster
                    v-if="showPosterMask"
                    ref="savePoster"
                    class="clocked"
                    :image="myPoster"
                    @togglePoster="togglePoster"
                />
            </template>
            <!-- 生成海报 -->
        </div>
    </view>
</template>

<script>
import api from '../../../common/api';
import posterh5 from '../brand/posterh5.vue';
import savePoster from '../brand/savePoster.vue';
import goHome from '../common/goHome.vue';

export default {
    components: {
        savePoster,
        posterh5,
        goHome,
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            userInfo: {},
            activityId: '',
            publicConfig: {},
            resultConfig: {},
            addNum: 0, // 六一活动上传次数
            showPosterMask: false,
            myPoster: '',
            posterCommonConfig: {
                pixelRatio: 2,
                width: 630,
                height: 866,
                debug: false,
                texts: [
                    {
                        text: '每天进步一点点，坚持带来大改变！',
                        textAlign: 'center',
                        x: 314,
                        y: 470,
                        fontSize: '26',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '我已连续打卡',
                        textAlign: 'left',
                        x: 124,
                        y: 320,
                        fontSize: '34',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: '400',
                        zIndex: 10,
                    },
                    {
                        text: '0',
                        textAlign: 'left',
                        x: 350,
                        y: 320,
                        fontSize: '40',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '9',
                        textAlign: 'left',
                        x: 406,
                        y: 320,
                        fontSize: '40',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '天！',
                        textAlign: 'left',
                        x: 450,
                        y: 320,
                        fontSize: '34',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: '400',
                        zIndex: 10,
                    },
                    {
                        text: '超过',
                        textAlign: 'left',
                        x: 136,
                        y: 400,
                        fontSize: '34',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: '400',
                        zIndex: 10,
                    },
                    {
                        text: '10%',
                        textAlign: 'left',
                        x: 220,
                        y: 400,
                        fontSize: '40',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '的小伙伴啦',
                        textAlign: 'left',
                        x: 320,
                        y: 400,
                        fontSize: '34',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: '400',
                        zIndex: 10,
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/bayi_upload_success.png',
                        width: 630,
                        height: 866,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 100,
                        height: 100,
                        x: 490,
                        y: 746,
                        borderRadius: this.isH5 ? 0 : 100,
                    },
                ],
                radiusRects: [
                    {
                        x: 340,
                        y: 270,
                        w: 44,
                        h: 64,
                        br: 4,
                        color: '#FFE464',
                        color2: '#FFE464',
                    },
                    {
                        x: 394,
                        y: 270,
                        w: 44,
                        h: 64,
                        br: 4,
                        color: '#FFE464',
                        color2: '#FFE464',
                    },
                ],
            },
            preStatus: 0,
            days: 0,
            ac_type: 0,
        };
    },
    onLoad(params) {
        this.activityId = Number(params.activity_id) || params.activity_id;
        this.preStatus = Number(params.pre_status) || 0; // 判断是否打卡了
        this.ac_type = Number(params.ac_type) || 0;
        let days = Number(params.days) + 1 || '0';
        days = String(days);
        this.days = days;
        this.publicConfig = this.$store.getters.getPublicConfig(
            this.activityId,
        );
        this.resultConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'resultConfig',
        });
        if (this.activityId === '9') {
            this.getLotteryNum();
        }

        if (this.activityId === 12 && !this.preStatus) {
            if (days.length === 1) {
                this.posterCommonConfig.texts[2].text = '0';
                this.posterCommonConfig.texts[3].text = days;
            } else if (days.length === 2) {
                this.posterCommonConfig.texts[2].text = days.slice(0, 1);
                this.posterCommonConfig.texts[3].text = days.slice(1);
            }
            // 60-90之间的数字
            this.posterCommonConfig.texts[6].text = `${Math.floor(
                Math.random() * 30,
            ) + 60}%`;
            this.$nextTick(() => {
                if (this.isH5) {
                    this.getH5QrCode();
                } else {
                    this.getMpQrCode();
                }
            });
        }

        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                },
                () => {
                    this.isLoading = false;
                },
            );
        },
        reUpload() {
            let params = '';
            if (this.activityId === 12) {
                params = `&status=1&days=${this.days}&ac_type=${this.ac_type}`;
            }
            uni.reLaunch({
                url: `/activity/pages/upload/modify?activity_id=${this.activityId}${params}`,
            });
        },
        goToUc() {
            let url = `/activity/pages/mywork/mywork?status=1&type=myWork&activity_id=${this.activityId}`;
            if (this.activityId === 10) {
                url = `/activity/pages/brand/ucenter?status=1&activity_id=${this.activityId}&user_id=${this.userInfo.user_id}`;
            }
            if (this.activityId === 12) {
                url = `/activity/pages/clocked/ucenter?status=1&activity_id=${this.activityId}&user_id=${this.userInfo.user_id}`;
            }
            uni.reLaunch({
                url,
            });
        },
        getLotteryNum() {
            api.get('/api/activity/getuserlotterynum').then((res) => {
                this.addNum = Number(res.add_activity);
            });
        },
        jumpHome() {
            uni.reLaunch({
                url: '/activity/pages/children/index',
            });
        },
        togglePoster(status) {
            this.showPosterMask = status;
        },
        onPosterSuccess(path) {
            this.myPoster = path;
            uni.hideLoading();
            this.togglePoster(true);
        },
        onPosterFail() {
            uni.showToast({
                title: '海报获取失败，请稍后再试',
                icon: 'none',
            });
            uni.hideLoading();
        },
        toCreatePoster() {
            uni.showLoading();
            const txts = [
                '每天进步一点点，坚持带来大改变！',
                '你每天的小坚持，都会有大意义！',
                '每天打卡一小步！成长提升一大步！',
                '我在坚持打卡进步，你也快来参加吧！',
                '坚持锻炼意志，努力收获成长！',
                '每天进步一点点, 成长足迹看得见！',
            ];
            const index = Math.floor(Math.random() * 6);
            this.posterCommonConfig.texts[0].text = txts[index];
            this.$refs.posterh5.createPoster(this.posterCommonConfig);
        },
        getH5QrCode() {
            const uCenterUrl = `${window.location.origin}/activity/pages/index?activity_id=12&wsaasaok=1`;
            this.posterCommonConfig.images[1].url = `${
                window.location.origin
            }/api/common/qrcode?url=${encodeURIComponent(uCenterUrl)}`;
            this.posterCommonConfig.images[1].borderRadius = 0;
            this.toCreatePoster();
        },
        getMpQrCode() {
            // 小程序二维码
            const url = 'activity/pages/index';
            const scene = 'activity_id=12';
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    if (url) {
                        this.base64src(url, (res) => {
                            this.posterCommonConfig.images[1].url = res;
                            this.toCreatePoster();
                        });
                    } else {
                        this.posterCommonConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                        this.toCreatePoster();
                    }
                },
                () => {
                    this.posterCommonConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    this.toCreatePoster();
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
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const titleList = this.publicConfig.shareConfig.title;
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.homePath,
        };
    },
};
</script>
<style lang="less">
.preload-img {
    width: 0;
    height: 0;
}
.page-read-upload-result {
    min-height: 100vh;
    text-align: center;
    background-color: #a1debe;

    .icon-wrap {
        padding-top: 270upx;
        margin-bottom: 50upx;
    }

    .icon {
        display: inline-block;
        width: 140upx;
        height: 140upx;
    }

    .main-title {
        color: #08402f;
        font-size: 40upx;
        margin-bottom: 20upx;
        font-weight: bold;
    }

    .sub-title {
        font-size: 32upx;
        color: #08402f;
        .tips {
            color: #08402f;
            font-size: 28upx;
            margin-bottom: 60upx;
        }
        .link {
            color: #1166ff;
        }
        .link.btn {
            padding: 0 34upx;
            height: 74upx;
            line-height: 74upx;
            border: 1px solid #0f8c64;
            text-align: center;
            display: inline-block;
            min-width: 236upx;
            color: #0f8c64;
            border-radius: 55upx;
        }
        .link.blue-bg {
            background-color: #0f8c64;
            color: #fff;
        }

        .mr-right {
            margin-right: 40upx;
        }
    }

    .mt {
        margin-top: 40rpx;
    }
    @keyframes mymove {
        0% {
            transform: scale(1); /*开始为原始大小*/
        }
        25% {
            transform: scale(1.04); /*放大1.1倍*/
            // margin-right: 26upx;
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.04);
            // margin-right: 26upx;
        }
    }
    .add-img {
        width: 322upx;
        height: 133upx;
        display: block;
        margin: 30upx auto 0;
        animation: mymove 2s infinite;
        & > image {
            width: 100%;
            height: 100%;
        }
    }
    .goHome {
        position: fixed;
        bottom: 40upx;
        right: 0upx;
        color: #0f8c64;
        font-size: 24upx;
        width: 166upx;
        height: 54upx;
        background: #fff;
        border-radius: 27upx 0 0 27upx;
        line-height: 54upx;
        text-align: center;
        padding: 0;
        .arr-left {
            width: 12upx;
            height: 21upx;
            margin-right: 10upx;
        }
    }
}
@import "../theme/upload.less";
</style>
