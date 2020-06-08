<template>
    <div
        :class="[
            'activity-init-page',
            { 'stop-scroll': maskPrompt || showPacketRain }
        ]"
    >
        <!-- 右侧随屏 -->
        <view class="right-fixed">
            <view class="animation-box">
                <view class="tips">
                    收集糖果赢大奖
                </view>
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_right.png"
                />
                <view
                    v-if="lotteryNum.lottery_num > 0 && status === 2"
                    class="text"
                >
                    X{{ lotteryNum.lottery_num }}
                </view>
            </view>
        </view>
        <!-- 我的海报 -->
        <template>
            <template>
                <canvas
                    v-if="isH5"
                    class="canvas pro"
                    style="width: 538px; height: 760px;"
                    canvas-id="firstCanvas"
                />
            </template>
            <view
                v-if="showPosterMask"
                class="poster-img-mask"
            >
                <view class="poster-img-mask-box">
                    <view
                        v-if="canvasImg"
                        class="canvas-img"
                    >
                        <image :src="canvasImg" />
                    </view>
                    <template v-if="isH5">
                        <view class="children-btn btn">
                            长按图片保存到本地
                        </view>
                    </template>
                    <template v-else>
                        <template v-if="!imgAuthBtn">
                            <view
                                class="children-btn btn"
                                @click="handleSave"
                            >
                                保存图片
                            </view>
                        </template>
                        <template v-else>
                            <button
                                open-type="openSetting"
                                class="children-btn btn"
                                @opensetting="checkImgAuthFun"
                            >
                                授权相册并保存到本地
                            </button>
                        </template>
                    </template>
                    <image
                        class="close"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                        @click="onHidePoster"
                    />
                </view>
            </view>
        </template>
        <view>
            <indexPage
                v-if="loading"
                :index-config="indexConfig"
                :public-config="publicConfig"
                :is-stop-scroll="false"
                class-name="children-page"
                :fr="fr"
                @showMask="showMask"
                @voteCallBack="voteCallBack"
            >
                <template v-slot:prize>
                    <view class="prize-box">
                        <view
                            v-for="(prize, list) in indexConfig.prizes"
                            :key="list"
                            class="prize-list"
                        >
                            <view class="prize-list-title">
                                <view class="title-text children-btn">
                                    {{ prize.title }}
                                </view>
                                <view class="handel-text">
                                    <text @click="prizeList(list + 1)">
                                        {{
                                            list === 0
                                                ? "奖项设置说明"
                                                : "幸运榜单"
                                        }}
                                    </text>
                                </view>
                            </view>
                            <view
                                :class="[
                                    'prize-list-item',
                                    `prize-list-item-${list}`
                                ]"
                            >
                                <view
                                    v-for="(item, k) in prize.item"
                                    :key="k"
                                    class="prize-item"
                                >
                                    <view class="prize-img">
                                        <image
                                            :src="
                                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_${list}_${k}.png`
                                            "
                                        />
                                    </view>
                                    <view class="pirze-text">
                                        <text
                                            v-if="item.text[0]"
                                            class="pirze-rank"
                                        >
                                            {{ item.text[0] }}
                                        </text>
                                        <view>{{ item.text[1] }}</view>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <view class="prize-handel-item">
                            <view
                                class="btn"
                                @click="getPrizeNum"
                            >
                                获取抽奖机会
                            </view>
                            <view
                                v-if="isH5"
                                class="btn"
                                @click="h5CreatePoster(2)"
                            >
                                我的中奖
                            </view>
                            <view
                                v-else
                                class="btn"
                                @click="createPoster(2)"
                            >
                                我的中奖
                            </view>
                        </view>
                    </view>
                </template>
                <template v-slot:rank />
            </indexPage>
        </view>
        <!-- 规则 中奖说明 中奖榜单 -->
        <maskBox
            v-if="maskPrompt"
            class="mask"
            :type="type"
            :title="maskTitle"
            :theme="{
                bgColor:
                    publicConfig.maskBgColor || publicConfig.primaryBgColor,
                titleColor: publicConfig.titleColor
            }"
            :name="publicConfig.activityName"
            :prize-list="indexConfig.prizes"
            :lucky-list="luckyList"
            :lottery-num="lotteryNum"
            :show-qr-code="type === 1 || type === 0"
            :rules="indexConfig.rules"
            @close="handleClose"
            @getNewLotteryNum="getNewLotteryNum"
        />
        <view
            v-if="showOpenLotteryPanel"
            class="lottery-panel open-lottery"
        >
            <view class="lottery-panel-box">
                <image
                    class="lottery-panel-img"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_lottery_open.png"
                />
                <view class="packet-num">
                    恭喜您抢到<text>{{ packetNum }}</text>颗糖果
                </view>
                <view
                    v-if="isH5"
                    class="children-btn join-lottery"
                    @click="h5CreatePoster(1)"
                >
                    点击开奖
                </view>
                <view
                    v-else
                    class="children-btn join-lottery"
                    @click="createPoster(1)"
                >
                    点击开奖
                </view>
            </view>
        </view>
    </div>
</template>

<script>
import indexPage from '../common/index.vue';
import logger from '../../../common/logger';
import maskBox from '../common/mask.vue';
import api from '../../../common/api';

export default {
    components: {
        indexPage,
        maskBox,
    },
    props: {
        activityId: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return {
            showPoster: false, // 由于中奖和位中奖config有差异 需要等配置文件修改后初始化海报组件
            // #ifdef H5
            isH5: true,
            // #endif
            status: 2,
            lock: false,
            loading: false,
            publicConfig: {},
            indexConfig: {},
            fr: 'qyhd',
            maskPrompt: false,
            type: 0,
            maskTitle: '',
            luckyFilter: {
                page_size: 20,
                page_num: 1,
            },
            luckyList: {
                list: [],
                total: -1,
            },
            lotteryNum: {
                type: ['每日登录', '点赞5个作品', '发布1个作品'],
            },
            showLotteryPanel: false, // 显示抽奖弹框 false-隐藏 登录后每天只显示一次
            showOpenLotteryPanel: false, // 开奖 false-隐藏
            myPrizeList: false,
            packetNum: 0,
            lotteryDetail: '',
            poster: null,
            imgAuthBtn: false,
            showPosterMask: false,
            canvasImg: '',
            posterWin: true,
            posterCommonConfig: {
                pixelRatio: 2,
                width: 538,
                height: 760,
                debug: false,
                images: [],
            },
            posterFailConfig: {
                images: [
                    {
                        url: '',
                        width: 538,
                        height: 760,
                        y: 0,
                        x: 0,
                        borderRadius: 1,
                    },
                    {
                        url: '',
                        width: 126,
                        height: 126,
                        y: 602,
                        x: 79,
                        borderRadius: 100,
                    },
                ],
            },
            posterSuccessConfig: {
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster.png?x-oss-process=image/format,jpg/interlace,1/quality,Q_70/resize,m_pad,w_538,h_760',
                        width: 538,
                        height: 760,
                        y: 0,
                        x: 0,
                        borderRadius: 1,
                    },
                    {
                        url: '',
                        width: 362,
                        height: 190,
                        y: 356,
                        x: 88,
                    },
                    {
                        url: '',
                        width: 260,
                        height: 34,
                        y: 655,
                        x: 140,
                    },
                    {
                        url: '',
                        width: 86,
                        height: 86,
                        y: 581,
                        x: 417,
                        borderRadius: 100,
                    },
                ],
            },
        };
    },
    onUnload() {},
    created() {
        this.publicConfig = {
            ...this.$store.getters.getPublicConfig(this.activityId),
            ...this.$store.getters.getColorConfig({
                activityId: this.activityId,
                page: 'indexColorConfig',
            }),
        };
        this.indexConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'indexConfig',
        });
        this.fr = logger.getFr(this.publicConfig.log, {});
        this.loading = true;
        this.activityStatus();
        this.getAuthStatus();
        this.ctx = uni.createCanvasContext('firstCanvas');
    },
    methods: {
        unload() {},
        luckyDraw() {
            // 中途退出 消耗次数
            api.get('/api/activity/luckydraw', {
                draw: 0,
            }).then((res) => {
                api.get('/api/activity/updrawlist', {
                    cover_id: 2,
                    id: res.id,
                });
            });
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: this.activityId,
            }).then((res) => {
                this.status = res.status;
            });
        },
        isLogin() {
            api.isLogin({
                fr: this.fr,
            }).then(() => {
                this.showLotteryPanel = false;
                this.showLotteryPanel = true;
            });
        },
        handleClose() {
            this.maskPrompt = false;
        },
        startLottery() {
            // 参与抽奖 消耗次数
            if (!this.lock) {
                this.lock = true;
                api.isLogin({
                    fr: this.fr,
                }).then(
                    () => {
                        this.lock = false;
                    },
                    () => {
                        this.lock = false;
                    },
                );
            }
        },
        openLottery(type, status = true) {
            // 开奖 我的中奖
            const url = type === 1 ? '/api/activity/luckydraw' : '/api/activity/mydraw';
            this.myPrizeList = type !== 1;
            return api.get(url, status ? {} : { draw: 0 }).then(
                (res) => {
                    if (res.status) {
                        // 中奖了
                        return this.winDrawImage(res);
                    }
                    // 没中奖
                    return this.loseDrawImage(res);
                },
                (err) => {
                    uni.showToast({
                        title: err.message,
                        icon: 'none',
                    });
                },
            );
        },
        h5WinDrawImage(config) {
            // h5 中奖海报
            const wxGetImageInfo = this.promisify(uni.getImageInfo);
            Promise.all([
                wxGetImageInfo({
                    src: config.images[0].url, // 背景图片
                }),
                wxGetImageInfo({
                    src: config.images[1].url,
                }),
                wxGetImageInfo({
                    src: config.images[2].url,
                }),
                wxGetImageInfo({
                    src: config.images[3].url,
                }),
            ]).then((res) => {
                const ctx = uni.createCanvasContext('firstCanvas');
                ctx.drawImage(res[0].path, 0, 0, 538, 760);
                ctx.drawImage(res[1].path, 88, 356, 362, 190);
                ctx.drawImage(res[2].path, 140, 566, 260, 34);
                ctx.drawImage(res[3].path, 417, 591, 86, 86);
                ctx.draw();
                setTimeout(() => {
                    this.saveCanvas();
                }, 200);
            });
        },
        h5LoseDrawImage(config) {
            // h5 未中奖海报
            const wxGetImageInfo = this.promisify(uni.getImageInfo);
            Promise.all([
                wxGetImageInfo({
                    src: config.images[0].url, // 背景图片
                }),
                wxGetImageInfo({
                    src: config.images[1].url,
                }),
            ]).then((res) => {
                this.ctx.drawImage(res[0].path, 0, 0, 538, 760);
                this.ctx.drawImage(res[1].path, 79, 602, 126, 126);
                this.ctx.draw(
                    false,
                    setTimeout(() => {
                        // 需要异步 不然画不出来
                        this.saveCanvas();
                    }, 500),
                );
            });
        },
        winDrawImage(res) {
            const drawDetail = [
                '航拍无人机',
                '多功能棋盘',
                '水彩笔套装',
                '小米书包',
            ];
            let index = res.draw;
            // 由于后端将中奖排序写错 需将3、4调换
            if (res.draw === 3) {
                index = 4;
            } else if (res.draw === 4) {
                index = 3;
            }
            this.lotteryDetail = drawDetail[index - 1];
            const imgPath = this.isH5
                ? '/activity/static/children_img'
                : 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx';
            this.posterSuccessConfig.images[0].url = `${imgPath}/children_poster.png`;
            this.posterSuccessConfig.images[1].url = `${imgPath}/children_poster_${index}.png`;
            this.posterSuccessConfig.images[2].url = `${imgPath}/children_poster_t${index}.png`;
            this.posterSuccessConfig.images[3].url = `${imgPath}/activity_code_${this.activityId}.png`;
            return {
                config: this.posterSuccessConfig,
                status: true,
            };
        },
        loseDrawImage(res) {
            const index = res.cover_id || Math.floor(Math.random() * 4);
            const imgPath = this.isH5
                ? '/activity/static/children_img'
                : 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx';
            this.posterFailConfig.images[0].url = `${imgPath}/children_poster_fail_${index}.png`;
            this.posterFailConfig.images[1].url = `${imgPath}/activity_code_${this.activityId}.png`;
            this.posterWin = false;
            // 抽奖失败 记录海报
            api.get('/api/activity/updrawlist', {
                cover_id: index,
                id: res.id,
            });
            return {
                config: this.posterFailConfig,
                status: false,
            };
        },
        createPoster(type = 1, status) {
            this.getAuthStatus();
            if (!this.lock) {
                this.lock = true;
                api.isLogin({
                    fr: this.fr,
                }).then(
                    () => {
                        this.openLottery(type, status).then(({ config }) => {
                            this.lock = false;
                            if (config) {
                                uni.showLoading({
                                    title: type === 1 ? '正在开奖' : '请稍等',
                                });
                                this.posterCommonConfig = {
                                    ...this.posterCommonConfig,
                                    ...config,
                                };
                                this.$emit(
                                    'createPoster',
                                    this.posterCommonConfig,
                                );
                            }
                        });
                    },
                    () => {
                        this.lock = false;
                    },
                );
            }
        },
        h5CreatePoster(type = 1, status) {
            // type 1-开奖 2-我的中奖
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    this.openLottery(type, status).then(
                        ({ config, status }) => {
                            if (config) {
                                uni.showLoading({
                                    title: type === 1 ? '正在开奖' : '请稍等',
                                });
                                this.posterWin = status;
                                if (status) {
                                    // 中奖
                                    this.h5WinDrawImage(config);
                                } else {
                                    // 未中奖
                                    this.h5LoseDrawImage(config);
                                }
                            }
                        },
                    );
                },
                () => {
                    this.lock = false;
                },
            );
        },
        promisify: api => (options, ...params) => new Promise((resolve, reject) => {
            const extras = {
                success: resolve,
                fail: reject,
            };
            api({ ...options, ...extras }, ...params);
        }),
        saveCanvas() {
            const that = this;
            uni.canvasToTempFilePath({
                // 把画布转化成临时文件
                x: 0,
                y: 0,
                width: 538, // 截取的画布的宽
                height: 760, // 截取的画布的高
                destWidth: 538, // 保存成的画布宽度
                destHeight: 760, // 保存成的画布高度
                fileType: 'png', // 保存成的文件类型
                quality: 1, // 图片质量
                canvasId: 'firstCanvas', // 画布ID
                success(res) {
                    that.onShowPosterMask();
                    that.canvasImg = res.tempFilePath;
                    uni.hideLoading();
                },
                fail() {
                    uni.hideLoading();
                    uni.showToast({
                        title: '保存失败，稍后再试',
                        duration: 2000,
                        icon: 'none',
                    });
                },
            });
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
        onPosterSuccess(canvasImg) {
            this.canvasImg = canvasImg;
            this.onHideOpenLotteryPanel();
            this.onShowPosterMask();
            this.lock = false;
            uni.hideLoading();
        },
        onPosterFail(err) {
            uni.hideLoading();
            this.lock = false;
            console.log(111, err);
        },
        onShowOpenLotteryPanel() {
            this.showOpenLotteryPanel = true;
        },
        onHideOpenLotteryPanel() {
            this.showOpenLotteryPanel = false;
        },
        handleSave() {
            uni.showLoading({ mask: true, title: '保存中' });
            const that = this;
            // 图片保存到本地
            // eslint-disable-next-line no-undef
            wx.saveImageToPhotosAlbum({
                filePath: this.canvasImg,
                success() {
                    uni.hideLoading();
                    that.prompt = false;
                    that.showTicketMask = true;
                    uni.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000,
                    });
                },
                fail(err) {
                    uni.hideLoading();
                    if (
                        err.errMsg
                            === 'saveImageToPhotosAlbum:fail:auth denied'
                        || err.errMsg === 'saveImageToPhotosAlbum:fail auth deny'
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
                            fail(failData) {
                                that.imgAuthBtn = true;
                                console.log('failData', failData);
                            },
                            complete(finishData) {
                                console.log('finishData', finishData);
                            },
                        });
                    }
                },
            });
        },
        onHidePoster() {
            // 关闭海报
            this.showPosterMask = false;
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
                        that.handleSave();
                    },
                });
            }
        },
        jumpSearch(item) {
            uni.navigateTo({
                url: `/pages/activity-pages/mywork/mywork?type=search&activity_id=${this.activityId}&user_id=${item.user_id}`,
            });
        },
        onReachBottom() {
            uni.$emit('onReachBottom');
        },
        showMask({ title, type }) {
            this.maskTitle = title;
            this.type = type;
            console.log(type);
            this.maskPrompt = true;
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
.canvas.pro {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translate3d(-9999rpx, 0, 0);
}
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.activity-init-page {
    .fixed-input {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100upx;
        z-index: 10000;
        background-color: #f00;
    }
    position: relative;
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
    .right-fixed {
        position: fixed;
        right: 0upx;
        top: 50%;
        margin-top: -36upx;
        z-index: 999;
        .tips {
            position: absolute;
            top: 50%;
            right: 10upx;
            font-size: 22upx;
            margin-top: -26upx;
            color: #fff;
            width: 88upx;
            text-align: right;
            z-index: 1;
        }
        .animation-box {
            width: 196upx;
            height: 144upx;
            position: relative;
            animation: mymove 2s infinite;
        }
        image {
            width: 100%;
            height: 100%;
        }
        .text {
            position: absolute;
            width: 80upx;
            height: 72upx;
            left: 16upx;
            top: 16upx;
            text-align: center;
            line-height: 72upx;
            font-size: 34upx;
            color: #fff;
            font-weight: bold;
        }
    }
    .mask {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 999;
    }
}
</style>
