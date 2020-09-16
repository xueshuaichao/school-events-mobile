<template>
    <view
        v-if="loading"
        class="lottery-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else-if="activityLoading">
            <error-page
                v-if="showError"
                message="活动不存在"
                tips="商城首页"
                :path="`/activity/pages/index?activity_id=${activityId}`"
            />
            <view
                v-else
                class="lottery-content"
            >
                <view class="banner-content">
                    <view class="handel-content">
                        <view
                            class="btn-item"
                            @click="jumpLotteryList"
                        >
                            <view class="icon icon-gift" />
                            我的中奖
                        </view>
                        <view @click="serPrize">
                            抽奖了
                        </view>
                    </view>
                </view>
                <!-- 跑马灯 -->
                <view class="lottery-list">
                    <tipsList
                        class="l"
                        text="抽中了"
                        :crousel-list="crouselList"
                    />
                </view>
                <view class="lottery-main">
                    <view
                        v-for="(item, index) in listLuck"
                        :key="index"
                        class="luck"
                    />
                    <lotteryDraw
                        v-if="lotteryData.length === 8"
                        ref="lottery"
                        :lottery-data="lotteryData"
                        :num="num"
                        :status="lotteryStatus"
                        @winning="winning"
                        @notwinning="notWinning"
                        @start="startLottery"
                    />
                </view>
                <view
                    v-if="previewMask"
                    class="poster-previwe"
                >
                    <view class="poster-previwe-content">
                        <view class="sun" />
                        <view class="title">
                            <template v-if="status === 1">
                                恭喜您！抽中
                                <text>{{ prizeDetail.name }}</text>
                                {{ prizeDetail.unit }}
                            </template>
                            <template v-else-if="status === 2">
                                <text>未中奖!</text> 别气馁，还有机会！
                            </template>
                        </view>
                        <view
                            class="poster-main"
                            :class="{ no: status === 2 }"
                        >
                            <view class="poster-title">
                                “爱挑战”趣味诗词大闯关
                            </view>
                            <template v-if="isH5 && isWechat && canvasImage">
                                <image
                                    class="image-bg"
                                    :src="canvasImage"
                                />
                            </template>
                            <template v-else>
                                <img
                                    v-if="isH5"
                                    class="image-bg"
                                    crossorigin="anonymous"
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-poster-bg.png"
                                    alt=""
                                >
                                <image
                                    v-else
                                    class="image-bg"
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-poster-bg.png"
                                />
                                <view class="image-detail">
                                    <template v-if="status === 1">
                                        <img
                                            v-if="isH5"
                                            class="lucky-img"
                                            crossorigin="anonymous"
                                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-1-lucky.png"
                                            alt=""
                                        >
                                        <image
                                            v-else
                                            class="lucky-img"
                                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-1-lucky.png"
                                        />
                                        <img
                                            v-if="isH5"
                                            class="word-img"
                                            crossorigin="anonymous"
                                            :src="successConfig.images[4].url"
                                            alt=""
                                        >
                                        <image
                                            v-else
                                            class="word-img"
                                            :src="successConfig.images[4].url"
                                        />
                                    </template>
                                    <template v-if="status === 2">
                                        <img
                                            v-if="isH5"
                                            class="error-poetry"
                                            crossorigin="anonymous"
                                            :src="failConfig.images[2].url"
                                        >
                                        <image
                                            v-else
                                            class="error-poetry"
                                            :src="failConfig.images[2].url"
                                        />
                                        <view class="poster-title">
                                            “爱挑战”趣味诗词大闯关
                                        </view>
                                    </template>

                                    <image
                                        v-if="status === 1"
                                        class="image"
                                        :src="prizeDetail.image"
                                    />
                                    <view
                                        v-if="status === 1"
                                        class="name"
                                    >
                                        {{ prizeDetail.name }}
                                    </view>
                                    <template v-if="isH5">
                                        <img
                                            class="qrcode h5"
                                            crossorigin="anonymous"
                                            :src="codeUrl"
                                        >
                                    </template>
                                    <template v-else>
                                        <image
                                            class="qrcode"
                                            :class="{ h5: isH5 }"
                                            :src="codeUrl"
                                        />
                                    </template>
                                </view>
                            </template>
                        </view>
                        <template v-if="isH5">
                            <view
                                v-if="isWechat"
                                class="brand-btn btn"
                            >
                                <view
                                    v-if="!canvasImage"
                                    @click="createPoster"
                                >
                                    生成海报
                                </view>
                                <view v-else>
                                    长按图片保存到本地
                                </view>
                            </view>
                            <view
                                v-else
                                class="brand-btn btn"
                                @click="saveImage"
                            >
                                保存图片
                            </view>
                        </template>
                        <template v-else>
                            <template v-if="!imgAuthBtn">
                                <view
                                    class="brand-btn btn"
                                    @click="saveImage"
                                >
                                    保存图片
                                </view>
                            </template>
                            <template v-else>
                                <button
                                    open-type="openSetting"
                                    class="brand-btn btn"
                                    @opensetting="checkImgAuthFun"
                                >
                                    授权相册并保存到本地
                                </button>
                            </template>
                        </template>
                        <view
                            v-if="status === 1"
                            class="tips"
                        >
                            记得到我的中奖页面设置邮寄地址哦~
                        </view>
                        <view
                            class="close"
                            @click="togglePoster(false)"
                        />
                    </view>
                </view>
                <!-- 生成海报 -->
                <posterh5
                    v-if="status !== 0"
                    ref="posterh5"
                    :config="posterCommonConfig"
                    :width="630"
                    :height="800"
                    :hide-loading="true"
                    @success="onPosterSuccess"
                    @fail="onPosterFail"
                />
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import lotteryDraw from '../../../components/lottery-draw.vue';
import login from '../../../widgets/login/login.vue';
import tipsList from '../common/tips-list.vue';
import utils from '../../../common/utils';
import posterh5 from '../brand/posterh5.vue';
import errorPage from '../common/error.vue';
import share from '../common/shareMinxin';

export default {
    components: {
        lotteryDraw,
        tipsList,
        posterh5,
        errorPage,
        login,
    },
    mixins: [share.initShare],
    data() {
        return {
            loading: false,
            activityLoading: false,
            activityId: '',
            codeUrl:
                'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-12.png',
            userInfo: '',
            status: 0,
            lotteryStatus: 1,
            previewMask: false,
            // #ifdef H5
            isH5: true,
            isWechat: false,
            // #endif
            crouselList: [],
            lotteryData: [],
            num: 0,
            listLuck: [1, 2, 3, 4, 5, 6, 7],
            failConfig: {
                texts: [
                    {
                        text: '“爱挑战”趣味诗词大闯关',
                        height: 50,
                        textAlign: 'center',
                        y: 108,
                        x: 400,
                        fontSize: '36',
                        color: '#254834',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-poster-bg.png',
                        width: 630,
                        height: 800,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 126,
                        height: 126,
                        y: 655,
                        x: 464,
                        borderRadius: 126,
                    },
                    {
                        url: '',
                        width: 420,
                        height: 252,
                        y: 300,
                        x: 106,
                    },
                ],
            },
            successConfig: {
                texts: [
                    {
                        text: '“爱挑战”趣味诗词大闯关',
                        height: 50,
                        textAlign: 'center',
                        y: 70,
                        x: 300,
                        fontSize: '36',
                        color: '#254834',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '我抽到了',
                        height: 50,
                        textAlign: 'center',
                        y: 358,
                        x: 300,
                        fontSize: '30',
                        color: '#666666',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: 'hahhah',
                        height: 50,
                        textAlign: 'center',
                        y: 586,
                        x: 300,
                        fontSize: '34',
                        color: '#FF685C',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-poster-bg.png',
                        width: 630,
                        height: 800,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 192,
                        height: 104,
                        y: 400,
                        x: 210,
                    },
                    {
                        url: '',
                        width: 126,
                        height: 126,
                        y: 655,
                        x: 464,
                        borderRadius: 126,
                    },
                    // 运气爆棚
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-1-lucky.png',
                        width: 396,
                        height: 96,
                        x: 120,
                        y: 234,
                    },
                    // 诗句
                    {
                        url: '',
                        width: 592,
                        height: 42,
                        x: 18,
                        y: 106,
                    },
                ],
            },
            posterCommonConfig: {
                pixelRatio: 1,
                width: 630,
                height: 800,
                debug: false,
                texts: [],
                images: [],
            },
            canvasImage: '',
            showError: false,
            prizeDetail: {
                name: '百度音响',
                unit: '一台',
                image:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-1-1.png',
            },
            imgAuthBtn: false,
        };
    },
    mounted() {
        if (this.isH5) {
            const ua = window.navigator.userAgent.toLowerCase();
            this.isWechat = ua.indexOf('micromessenger') !== -1;
        }
        this.getLotteryData();
    },
    methods: {
        serPrize() {
            this.winning();
        },
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getCrouselList();
            this.getLotteryData();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getCrouselList();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        initLottery() {
            this.status = 0;
        },
        getLotteryData() {
            api.get('/api/draw/getprize', {
                activity_id: this.activityId,
            }).then(
                (res) => {
                    this.activityLoading = true;
                    if (res.list.length === 0) {
                        this.showError = true;
                    } else {
                        this.lotteryData = res.list;
                        this.num = Number(res.num);
                        this.lotteryStatus = Number(res.status);
                        // 如果配置奖品不足7个 自动补谢谢参与；另外需增加一个谢谢参与保证最终为8个奖品
                        if (this.lotteryData.length < 8) {
                            const len = this.lotteryData.length;
                            for (let i = 7; i >= len; i -= 1) {
                                this.$set(this.lotteryData, i, {
                                    name: '谢谢参与',
                                    image:
                                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_icon_thanks.png',
                                });
                            }
                        }
                    }
                },
                () => {
                    this.activityLoading = true;
                    this.showError = true;
                },
            );
        },
        startLottery() {
            if (!this.lock) {
                this.lock = true;
                api.post('/api/draw/active', {
                    activity_id: this.activityId,
                }).then(
                    (res) => {
                        const { prize_id: prizeId, num } = res;

                        this.num = Number(num);
                        this.$refs.lottery.startLottery(prizeId);
                        this.lock = false;
                    },
                    () => {
                        this.$refs.lottery.startLottery();
                        this.lock = false;
                    },
                );
            }
        },
        winning(detail) {
            this.prizeDetail = detail || this.prizeDetail;
            this.successConfig.images[1].url = this.isH5
                ? this.prizeDetail.image
                : utils.mapHttpToHttps(this.prizeDetail.image);
            this.successConfig.images[4].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-1-${Math.floor(
                Math.random() * 5 + 1,
            )}.png`;
            // this.successConfig.texts[2].text = this.prizeDetail.name;
            this.togglePoster(true);
            this.posterCommonConfig = {
                ...this.posterCommonConfig,
                ...this.successConfig,
            };
            this.status = 1;
        },
        notWinning() {
            this.togglePoster(true);
            this.failConfig.images[2].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-0-${Math.floor(
                Math.random() * 5 + 1,
            )}.png`;
            this.posterCommonConfig = {
                ...this.posterCommonConfig,
                ...this.failConfig,
            };
            this.status = 2;
        },
        onPosterSuccess(detail) {
            this.canvasImage = detail;
            if (this.isWechat) {
                uni.hideLoading();
                return false;
            }
            this.$nextTick(() => {
                if (this.isH5) {
                    api.saveImage('lotteryCanvas', this.canvasImage).then(
                        () => {
                            uni.hideLoading();
                            uni.showToast({
                                title: '保存成功',
                            });
                        },
                    );
                } else {
                    // eslint-disable-next-line no-undef
                    wx.saveImageToPhotosAlbum({
                        filePath: this.canvasImage,
                        success: () => {
                            uni.hideLoading();
                            this.prompt = false;
                            this.showTicketMask = true;
                            uni.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 2000,
                            });
                        },
                        fail: (err) => {
                            console.log(err);
                            uni.hideLoading();
                            if (
                                err.errMsg
                                    === 'saveImageToPhotosAlbum:fail:auth denied'
                                || err.errMsg
                                    === 'saveImageToPhotosAlbum:fail auth deny'
                            ) {
                                // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                                console.log('开始授权');
                                // eslint-disable-next-line no-undef
                                wx.openSetting({
                                    success(settingdata) {
                                        console.log('settingdata', settingdata);
                                        if (
                                            settingdata.authSetting[
                                                'scope.writePhotosAlbum'
                                            ]
                                        ) {
                                            // eslint-disable-next-line no-undef
                                            wx.showModal({
                                                title: '提示',
                                                content:
                                                    '获取权限成功,再次点击图片即可保存',
                                                showCancel: false,
                                            });
                                        } else {
                                            // eslint-disable-next-line no-undef
                                            wx.showModal({
                                                title: '提示',
                                                content:
                                                    '获取权限失败，将无法保存到相册哦~',
                                                showCancel: false,
                                            });
                                        }
                                    },
                                    fail: (failData) => {
                                        this.imgAuthBtn = true;
                                        console.log('failData', failData);
                                    },
                                    complete(finishData) {
                                        console.log('finishData', finishData);
                                    },
                                });
                            }
                        },
                    });
                }
            });
            return true;
        },
        onPosterFail() {
            uni.hideLoading();
            uni.showToast({
                title: '图片生成失败，请稍后再试',
                icon: 'none',
            });
        },
        jumpLotteryList() {
            uni.navigateTo({
                url: `/activity/pages/lottery/list?activity_id=${this.activityId}`,
            });
        },
        getCrouselList() {
            this.postCrouselList();
            this.setId = setInterval(() => {
                this.postCrouselList();
            }, 1000 * 60 * 5);
        },
        getAuthStatus() {
            const that = this;
            // eslint-disable-next-line no-undef
            wx.getSetting({
                // 获取设置
                success(res) {
                    console.log(res);
                    if (res.authSetting['scope.writePhotosAlbum'] === false) {
                        // 说明未授权
                        that.imgAuthBtn = true;
                    } else {
                        that.imgAuthBtn = false;
                    }
                    console.log(that.imgAuthBtn);
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
        saveImage() {
            uni.showLoading({ mask: true, title: '保存中' });
            this.createPoster();
        },
        togglePoster(status) {
            this.previewMask = status;
        },
        createPoster() {
            if (this.isWechat) {
                uni.showLoading({ mask: true, title: '生成中' });
            }
            this.$refs.posterh5.createPoster(this.posterCommonConfig);
        },
        postCrouselList() {
            api.post('/api/draw/getuser', {
                page_num: 1,
                page_size: 10,
                activity_id: this.activityId,
            }).then((res) => {
                this.crouselList = res;
            });
        },
    },
    onLoad(parms) {
        this.activityId = parms.activity_id;
        this.codeUrl = this.isH5
            ? 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-h5-12.png'
            : 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-12.png';
        this.successConfig.images[2].url = this.codeUrl;
        this.successConfig.images[2].borderRadius = this.isH5 ? 0 : 126;
        this.failConfig.images[1].url = this.codeUrl;
        this.failConfig.images[1].borderRadius = this.isH5 ? 0 : 126;
        this.isLogin();
        this.getShareConfig();
    },
};
</script>
<style lang="less" scoped>
.lottery-page {
    background: linear-gradient(
        180deg,
        #efebbb 0,
        #fff 750upx,
        #e5f8ee 800upx; #a4e6dc 1800upx,
        #a4e6dc 2000upx
    );
    .luck {
        position: relative;
        width: 100%;
        height: 100%;
        &:nth-child(1) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/fish1.png);
            background-size: 100% 100%;
            width: 61upx;
            height: 87upx;
            bottom: 24%;
            z-index: 1;
        }
        &:nth-child(2) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/fish2.png);
            background-size: 100% 100%;
            width: 61upx;
            height: 127upx;
            bottom: 0;
            right: 0;
            z-index: 1;
        }
        &:nth-child(3) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/flower1.png);
            background-size: 100% 100%;
            width: 640upx;
            height: 328upx;
            bottom: 33%;
            right: 0;
        }
        &:nth-child(4) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/river1.png);
            background-size: 100% 100%;
            width: 206upx;
            height: 103upx;
            bottom: 44%;
            left: 0;
        }
        &:nth-child(5) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/river2.png);
            background-size: 100% 100%;
            width: 324upx;
            height: 286upx;
            bottom: -6%;
            left: 0;
        }
        &:nth-child(6) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/river3.png);
            background-size: 100% 100%;
            width: 461upx;
            height: 298upx;
            bottom: -6%;
            right: 0;
        }
        &:nth-child(7) {
            position: absolute;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/flower.png);
            background-size: 100% 100%;
            width: 100upx;
            height: 100upx;
            bottom: 62%;
            right: 0;
        }
    }
}
.lottery-content {
    padding-bottom: 40upx;
    min-height: 100vh;
    .poster-previwe {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
        z-index: 10;
        .poster-previwe-content {
            position: absolute;
            width: 100%;
            top: 46%;
            transform: translateY(-50%);
        }
        .sun {
            position: absolute;
            width: 100%;
            top: 2%;
            left: 26%;
            height: 80%;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/sun.png)
                no-repeat;
            background-size: 50% 50%;
        }
        .title {
            text-align: center;
            font-size: 30upx;
            height: 300upx;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            & > text {
                font-size: 40upx;
                color: #ff685c;
                display: inline-block;
                margin: 0 10upx;
            }
        }
        .poster-main {
            width: 630upx;
            height: 800upx;
            margin: -100upx auto 0;
            overflow: hidden;
            position: relative;
            background-size: 100% 100%;
            background-position: center center;
            .poster-title {
                position: absolute;
                left: 114upx;
                top: 36upx;
                color: #254834;
                font-size: 36upx;
                font-weight: 600;
                z-index: 1;
            }
            .image-bg,
            .image-detail {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                bottom: 0;
            }
            .image-detail {
                z-index: 1;
                .error-poetry {
                    width: 420upx;
                    height: 252upx;
                    position: absolute;
                    left: 106upx;
                    top: 300upx;
                }
                .lucky-img {
                    width: 396upx;
                    height: 96upx;
                    left: 120upx;
                    top: 224upx;
                    position: absolute;
                }
                .word-img {
                    position: absolute;
                    left: 18upx;
                    top: 106upx;
                    width: 592upx;
                    height: 42upx;
                }
                .poster-title {
                    position: absolute;
                    left: 114upx;
                    top: 108upx;
                    color: #254834;
                    font-size: 36upx;
                    font-weight: 500;
                }
            }
            .image {
                width: 192upx;
                height: 144upx;
                display: block;
                margin: 400upx auto 0;
            }
            .name {
                height: 74upx;
                line-height: 74upx;
                font-size: 40upx;
                color: #ff685c;
                text-align: center;
            }
            .qrcode {
                position: absolute;
                width: 126upx;
                height: 126upx;
                right: 40upx;
                bottom: 20upx;
                border-radius: 50%;
                &.h5 {
                    border-radius: 0;
                }
            }
        }
        .btn {
            text-align: center;
            background: linear-gradient(180deg, #a6cda0 0%, #49896c 100%);
            line-height: 98upx;
            width: 540upx;
            box-sizing: border-box;
            margin: 0 auto;
            border-radius: 55upx;
            color: #fff;
            font-size: 36upx;
            font-weight: 600;
            margin-top: 37upx;
            a {
                color: #fff;
                text-decoration: none;
            }
        }
        .tips {
            font-size: 26upx;
            text-align: center;
            line-height: 1;
            margin-top: 20upx;
        }
        .close {
            display: block;
            margin: 20upx auto 0;
            width: 52upx;
            height: 52upx;
            background: linear-gradient(180deg, #a6cda0 0%, #49896c 100%);
            border-radius: 50%;
            position: relative;
            &::before,
            &::after {
                content: "";
                position: absolute;
                display: block;
                width: 20upx;
                height: 2upx;
                background: #fff;
                left: 17upx;
                top: 26upx;
                border-radius: 2upx;
            }
            &:before {
                transform: rotate(45deg);
            }
            &:after {
                transform: rotate(-45deg);
            }
        }
    }

    .banner-content {
        padding: 0 40upx;
        height: 602upx;
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/lottery-top.png");
        background-position: center center;
        background-size: 100% 100%;
    }
    .handel-content {
        padding: 20upx 0 228upx;
        width: 100%;
        display: flex;
        justify-content: flex-end;
        .btn-item {
            margin-left: 20upx;
            font-size: 26upx;
            height: 48upx;
            padding: 0 12upx;
            background-color: #395e4d;
            color: #fff;
            display: flex;
            justify-items: center;
            align-items: center;
            border-radius: 24upx;
        }
        .icon {
            width: 24upx;
            height: 24upx;
            margin-right: 8upx;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            &.icon-gift {
                background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_icon_gift.png");
            }
        }
    }
    .lottery-list {
        margin: -100upx 40upx 68upx;
        /deep/.page-section-spacing {
            background-color: #fff;
            margin-top: 0;
        }
        /deep/.page-section-spacing .swiper .swiper-item {
            .icon-horn {
                background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/icon-horn.png");
            }
            & > text:last-child {
                color: #999;
            }
            .swiper-info {
                color: #355b45;
            }
            .swiper-info > text {
                &:nth-child(1),
                &:nth-child(3) {
                    color: #355b45;
                }
                &:nth-child(2),
                &:nth-child(4) {
                    color: #999;
                }
            }
        }
    }
    .lottery-main {
        position: relative;
        margin-top: -48upx;
        /deep/.container {
            background-color: #adcca8;
            .frame-view {
                background-color: #c3e2be;
                .frame-view-box {
                    background-color: #355b45;
                    .frame-item {
                        background-color: #c3e2be;
                        box-shadow: 0 4upx 12upx 0 #1d2b21;
                        color: #ff5547;
                        &.btn {
                            background-color: #ffd300;
                        }
                        &.disabled {
                            background-color: #a5a5a5;
                        }
                        .title {
                            color: #254834;
                        }
                    }
                }
                .row-2 {
                    .bot {
                        background: #ffe463;
                        box-shadow: 0 4upx 8upx 0 #355b45,
                            0px 4px 4px 0px rgba(255, 255, 255, 0.5);
                        &:nth-child(even) {
                            background: #a6cda0;
                            box-shadow: 0 4upx 8upx 0 #345944,
                                0px 4px 4px 0px rgba(255, 255, 255, 0.5);
                        }
                    }
                }
                .row-1,
                .row-3,
                .row-4 {
                    .bot {
                        background: #ffe463;
                        box-shadow: 0 4upx 8upx 0 #355b45,
                            0px 4px 4px 0px rgba(255, 255, 255, 0.5);
                        &:nth-child(even) {
                            background: #a6cda0;
                            box-shadow: 0 4upx 8upx 0 #345944,
                                0px 4px 4px 0px rgba(255, 255, 255, 0.5);
                        }
                    }
                }
            }
        }
    }
}
</style>
