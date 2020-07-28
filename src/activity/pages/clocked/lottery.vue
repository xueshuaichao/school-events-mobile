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
                        <view
                            class="btn-item"
                            @click="toggleModal"
                        >
                            <view class="icon icon-luck" />
                            抽奖攻略
                        </view>
                    </view>
                    <view class="lottery-status-content">
                        <view class="text">
                            连续打卡
                        </view>
                        <view class="status">
                            <view class="line" />
                            <view class="item-content">
                                <view
                                    v-for="item in 4"
                                    :key="item"
                                    class="item"
                                >
                                    <view>抽奖X{{ item }}</view>
                                    <view class="icon icon-gifts" />
                                    <view>
                                        {{
                                            item === 4
                                                ? "累计28天"
                                                : `${item * 7}天`
                                        }}
                                    </view>
                                </view>
                            </view>
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
                        <view class="title">
                            <template v-if="status === 1">
                                恭喜您！抽中
                                <text>{{ prizeDetail.name }}</text> 1{{
                                    prizeDetail.unit
                                }}
                            </template>
                            <template v-else-if="status === 2">
                                未中奖，别气馁，还有机会！
                            </template>
                        </view>
                        <view
                            class="poster-main"
                            :class="{ no: status === 2 }"
                        >
                            <image
                                v-if="status === 1"
                                class="image"
                                :src="prizeDetail.image"
                                mode=""
                            />
                            <view
                                v-if="status === 1"
                                class="name"
                            >
                                {{ prizeDetail.name }}
                            </view>
                            <image
                                class="qrcode"
                                :class="{ h5: isH5 }"
                                :src="codeUrl"
                                mode=""
                            />
                        </view>
                        <template v-if="isH5">
                            <view
                                v-if="isWechat"
                                class="brand-btn btn"
                            >
                                长按图片保存到本地
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
                        <image
                            class="close"
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_close.png"
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
            <view
                v-if="isShowModal"
                class="modal"
            >
                <view class="modal-content">
                    <view class="title">
                        抽奖攻略
                    </view>
                    <view class="text-content">
                        <view class="text-item">
                            1、用户每天坚持打卡，达到一定天数，即可获得相应的抽奖次数，每个用户最多可获得10次抽奖机会。
                        </view>
                        <view class="text-item">
                            2、连续打卡7天可获得1次抽奖机会；连续打卡14天可再获得2次抽奖机会；连续打卡21天可再获得3次抽奖机会；累计打卡28天可再获得4次抽奖机会。
                        </view>
                        <view class="text-item">
                            3、用户可在抽奖后即时查看获奖情况，如果中奖，需在“我的中奖”页面填写自己的收货地址，奖品将于活动结束后统一发出。
                        </view>
                    </view>
                    <view
                        class="close"
                        @click="toggleModal"
                    >
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                            mode=""
                        />
                    </view>
                </view>
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
            codeUrl: '',
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
            failConfig: {
                texts: [],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_poster_no.png',
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
                ],
            },
            successConfig: {
                texts: [
                    {
                        text: '',
                        height: 40,
                        textAlign: 'center',
                        y: 600,
                        x: 315,
                        fontSize: '40',
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
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_poster.png',
                        width: 630,
                        height: 800,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 192,
                        height: 144,
                        y: 400,
                        x: 219,
                    },
                    {
                        url: '',
                        width: 126,
                        height: 126,
                        y: 655,
                        x: 464,
                        borderRadius: 126,
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
            prizeDetail: {},
            imgAuthBtn: false,
            isShowModal: false,
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
        toggleModal() {
            this.isShowModal = !this.isShowModal;
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
            this.prizeDetail = detail;
            this.successConfig.images[1].url = this.isH5
                ? this.prizeDetail.image
                : utils.mapHttpToHttps(this.prizeDetail.image);

            this.successConfig.texts[0].text = this.prizeDetail.name;
            this.togglePoster(true);
            this.posterCommonConfig = {
                ...this.posterCommonConfig,
                ...this.successConfig,
            };
            this.status = 1;
        },
        notWinning() {
            this.togglePoster(true);
            this.posterCommonConfig = {
                ...this.posterCommonConfig,
                ...this.failConfig,
            };
            this.status = 2;
        },
        onPosterSuccess(detail) {
            this.canvasImage = detail;
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
        },
        onPosterFail() {},
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
            console.log(this.posterCommonConfig);
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
            ? `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-h5-${this.activityId}.png`
            : `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/applet-code-${this.activityId}.png`;
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
    .modal {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 1;
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffdada;
            border-radius: 20upx;
            width: 690upx;
            height: 968upx;

            .title {
                height: 72upx;
                background: linear-gradient(
                    rgba(255, 162, 132, 1) 0%,
                    rgba(255, 104, 76, 1) 100%
                );
                box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5);
                border-radius: 20upx 20upx 0 0;
                line-height: 72upx;
                color: #ffff;
                text-align: center;
            }
            .close {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                width: 63upx;
                height: 63upx;
                bottom: -103upx;
                & > image {
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .text-content {
            padding: 40upx 30upx;
            .text-item {
                color: #ff5547;
                font-size: 26upx;
                margin-bottom: 20upx;
                line-height: 40upx;
            }
        }
    }
}
.lottery-content {
    background-color: #ff685c;
    padding-bottom: 40upx;
    min-height: 100vh;
    // box-sizing: border-box;
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
            top: 50%;
            transform: translateY(-50%);
        }
        .title {
            text-align: center;
            font-size: 30upx;
            height: 99upx;
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
            margin: 0 auto;
            background: #ccc;
            overflow: hidden;
            position: relative;
            background-size: 100% 100%;
            background-position: center center;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_poster.png);
            &.no {
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_poster_no.png);
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
            background: linear-gradient(
                0deg,
                rgba(255, 141, 133, 1),
                rgba(255, 87, 73, 1)
            );
            box-shadow: 0 4upx 6upx 0 rgba(0, 0, 0, 0.4);
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
        }
    }

    .banner-content {
        padding: 0 40upx;
        height: 558upx;
        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery-banner.png");
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
            background-color: #0054b1;
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
            &.icon-luck {
                background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_icon_luck.png");
            }
        }
    }
    .lottery-status-content {
        background-color: rgba(255, 255, 255, 1);
        box-shadow: 0px 4upx 10upx 0px rgba(86, 7, 0, 0.15);
        border-radius: 20upx;
        display: flex;
        align-items: center;
        padding: 20upx;
        box-sizing: border-box;
        margin-bottom: 20upx;

        .text {
            width: 116upx;
            color: #333;
            font-size: 24upx;
        }
        .status {
            flex: 1;
            position: relative;
        }
        .line {
            position: absolute;
            top: 50%;
            left: 20upx;
            right: 0upx;
            height: 4upx;
            transform: translateY(-50%);
            background-color: #ff685c;
        }
        .item-content {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 1;
            .item {
                width: 88upx;
                margin-right: 56upx;
                font-size: 22upx;
                text-align: center;
                & > view {
                    font-size: 20upx;
                    color: #333;
                    &:first-of-type {
                        font-size: 22upx;
                        color: #ff5547;
                    }
                }
                .icon-gifts {
                    width: 70upx;
                    height: 70upx;
                    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_icon_gifts.png");
                    background-size: 100% 100%;
                    margin: 10upx auto;
                }
                &:last-of-type {
                    width: 96upx;
                    margin: 0;
                }
            }
            .status-image {
                background-color: #f00;
            }
        }
    }
    .lottery-list {
        margin: -48upx 40upx 68upx;
        /deep/.page-section-spacing {
            background-color: #ffdada;
            margin-top: 0;
        }
        /deep/.page-section-spacing .swiper .swiper-item {
            .icon-horn {
                background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/icon-horn.png");
            }
            & > text:last-child {
                color: #999;
            }
            .swiper-info {
                color: #ff685c;
            }
            .swiper-info > text {
                &:nth-child(1),
                &:nth-child(3),
                &:nth-child(4) {
                    color: #ff685c;
                }
                &:nth-child(2) {
                    color: #999;
                }
            }
        }
    }
    .lottery-main {
        margin-top: -48upx;
    }
}
</style>
