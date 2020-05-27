<template>
    <div
        :class="[
            'activity-init-page',
            { 'stop-scroll': maskPrompt || showPacketRain }
        ]"
    >
        <!-- 右侧随屏 -->
        <view
            class="right-fixed"
            @click="showLottery(true)"
        >
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
        <!-- 开始抽奖弹窗 -->
        <view
            v-if="showLotteryPanel"
            class="lottery-panel"
        >
            <view class="lottery-panel-box">
                <image
                    class="lottery-panel-img"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_lottery.png"
                />
                <view
                    class="children-btn join-lottery"
                    @click="startLottery"
                >
                    马上开始
                </view>
                <image
                    class="close"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                    @click="closeLotteryPanel"
                />
            </view>
        </view>
        <!-- 红包雨 -->
        <packetRain
            v-if="showPacketRain"
            :time="10000"
            :speed="{
                max: 3500,
                min: 2000
            }"
            :count-down="5000"
            :hide-index="hideIndex"
            @handelClick="handelClick"
            @result="packetResult"
        />
        <!-- 中奖海报 -->
        <template>
            <template>
                <poster
                    v-if="!isH5 && showPoster"
                    id="poster"
                    :config="posterCommonConfig"
                    :hide-loading="true"
                    @success="onPosterSuccess"
                    @fail="onPosterFail"
                />
                <canvas
                    v-else-if="isH5"
                    class="canvas pro"
                    style="width: 538px; height: 760px;"
                    canvas-id="firstCanvas"
                />
            </template>
            <view
                v-if="showPosterMask"
                class="poster-img-mask"
            >
                <template v-if="myPrizeList">
                    <view class="prize-btn children-btn">
                        我的中奖
                    </view>
                </template>
                <template v-else>
                    <view
                        v-if="posterWin"
                        class="tips"
                    >
                        恭喜您！抽中<text>{{ lotteryDetail }}</text>1个
                    </view>
                    <view
                        v-else
                        class="tips"
                    >
                        未中奖！别气馁，每天都有机会哦～
                    </view>
                </template>

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
                <view class="text-item-box">
                    <view
                        v-if="lotteryNum.vote_num < 5"
                        class="text-item"
                    >
                        今日点赞5个作品，抽奖次数<text>+1</text>
                    </view>
                    <view
                        v-if="lotteryNum.add_activity < 1"
                        class="text-item"
                    >
                        今日上传1个作品，抽奖次数<text>+1</text>
                    </view>
                </view>
                <image
                    class="close"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                    @click="closePoster"
                />
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
            @getLuckyList="getLuckyList"
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
import packetRain from '../../../components/packet-rain/index.vue';
import indexPage from '../common/index.vue';
import share from '../../../common/share';
import logger from '../../../common/logger';
import maskBox from '../common/mask.vue';
import api from '../../../common/api';

export default {
    components: {
        indexPage,
        packetRain,
        maskBox,
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
            fr: '',
            activityId: '',
            hideIndex: -1,
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
            showPacketRain: false, // 显示红包雨
            showLotteryPanel: false, // 显示抽奖弹框 false-隐藏 登录后每天只显示一次
            showOpenLotteryPanel: false, // 开奖 false-隐藏
            myPrizeList: false,
            packetNum: 0,
            lotteryDetail: '',
            poster: null,
            imgAuthBtn: false,
            startCreateCanvas: true,
            showPosterMask: false,
            canvasImg: '',
            posterCommonConfig: {
                pixelRatio: 2,
                width: 538,
                height: 760,
                debug: false,
                images: [],
            },
            posterWin: true,
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
    onLoad(params) {
        this.activityId = 9;
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
        this.fr = logger.getFr(this.publicConfig.log, params);
        this.loading = true;
        this.activityStatus();
        this.initShare();
        this.getAuthStatus();
    },
    onShow() {
        this.getLotteryNum();
    },
    onUnload() {
        if (this.showPacketRain) {
            this.luckyDraw();
            this.showPacketRain = false;
        }
    },
    created() {
        this.showLottery();
        this.ctx = uni.createCanvasContext('firstCanvas');
    },
    methods: {
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
        handelClick(index) {
            this.hideIndex = index;
        },
        packetResult(num) {
            this.packetNum = num;
            this.showPacketRain = false;
            if (num === 0) {
                const index = Math.floor(Math.random() * 4);
                this.posterFailConfig.images[0].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster_fail_${index}.png`;
                this.posterFailConfig.images[1].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/activity_code_${this.activityId}.png`;
                this.posterCommonConfig = {
                    ...this.posterCommonConfig,
                    ...this.posterFailConfig,
                };
                this.showPoster = true; // 需等海报报配置修改后才能生成
                this.$nextTick(() => {
                    if (this.isH5) {
                        this.h5CreatePoster(1, false);
                    } else {
                        this.createPoster(1, false);
                    }
                });
            } else {
                this.showOpenLotteryPanel = true;
            }
        },
        getLuckyList(num = 1) {
            this.luckyFilter.page_num = num;
            if (num === 1) {
                this.luckyList.list = [];
            }
            api.get('/api/activity/drawlist', this.luckyFilter).then((res) => {
                this.luckyList.list = this.luckyList.list.concat(res.list);
                this.luckyList.total = res.total;
                if (this.luckyFilter.page_num === 1) {
                    this.showMask({ title: '幸运榜单', type: 2 });
                }
            });
        },
        getLotteryNum() {
            api.get('/api/activity/getuserlotterynum').then(
                (res) => {
                    this.lotteryNum = {
                        ...this.lotteryNum,
                        ...res,
                    };
                },
                () => {
                    // 未登录时 抽奖次数显为3
                    this.$set(this.lotteryNum, 'lottery_num', 3);
                },
            );
        },
        voteCallBack() {
            api.get('/api/activity/getuserlotterynum').then((res) => {
                if (res.vote_num === '5') {
                    uni.showToast({
                        title: '恭喜你获得一次免费的抽奖资格，快来抽奖吧',
                        icon: 'none',
                    });
                    this.lotteryNum = {
                        ...this.lotteryNum,
                        ...res,
                    };
                }
            });
        },
        startLottery() {
            // 参与抽奖 消耗次数
            if (!this.lock) {
                this.lock = true;
                api.isLogin({
                    fr: this.fr,
                }).then(
                    () => {
                        if (this.lotteryNum.lottery_num > 0) {
                            this.lock = false;
                            this.showPacketRain = true;
                            this.showLotteryPanel = false;
                            this.lotteryNum.lottery_num -= 1;
                        } else if (
                            this.lotteryNum.vote_num >= 5
                            && this.lotteryNum.add_activity > 0
                            && this.lotteryNum.login > 0
                        ) {
                            uni.showToast({
                                title: '今日已无抽奖机会，明日再来吧',
                                icon: 'none',
                            });
                            this.lock = false;
                        } else {
                            this.showLotteryPanel = false;
                            this.getPrizeNum();
                            this.lock = false;
                        }
                    },
                    () => {
                        this.lock = false;
                    },
                );
            }
        },
        showLottery(type = false) {
            // 显示抽奖弹框
            // type-true 右侧悬浮按钮点击触发
            if (type) {
                if (this.status === 2) {
                    this.showLotteryPanel = true;
                } else {
                    uni.showToast({
                        title:
                            this.status === 1
                                ? '活动未开始，敬请期待'
                                : '活动已结束',
                        icon: 'none',
                    });
                }
            } else {
                api.get('/api/activity/firstlogin').then(
                    (res) => {
                        if (res === 0) {
                            this.showLotteryPanel = true;
                        }
                    },
                    () => {
                        this.showLotteryPanel = true;
                    },
                );
            }
        },
        closeLotteryPanel() {
            this.showLotteryPanel = false;
        },
        openLottery(type, status = true) {
            // 开奖 我的中奖
            const url = type === 1 ? '/api/activity/luckydraw' : '/api/activity/mydraw';
            this.myPrizeList = type !== 1;
            return api.get(url, status ? {} : { draw: 0 }).then(
                (res) => {
                    // 我的中奖 如果用户没有抽过奖 显示立即参与
                    if (type === 2 && Array.isArray(res) && res.length === 0) {
                        this.showLotteryPanel = true;
                        return true;
                    }
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
            this.lotteryDetail = res.draw;
            this.posterSuccessConfig.images[1].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster_${res.id}.png`;
            this.posterSuccessConfig.images[2].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster_t${res.id}.png`;
            this.posterSuccessConfig.images[3].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/activity_code_${this.activityId}.png`;
            return {
                config: this.posterSuccessConfig,
                status: true,
            };
        },
        loseDrawImage(res) {
            const index = res.cover_id || Math.floor(Math.random() * 4);
            this.posterFailConfig.images[0].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster_fail_${index}.png`;
            this.posterFailConfig.images[1].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/activity_code_${this.activityId}.png`;
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
                                // 需等画报配置修改后才能生成
                                this.showPoster = true;
                                this.$nextTick(() => {
                                    this.poster = this.selectComponent(
                                        '#poster',
                                    );
                                    this.poster.onCreate(
                                        this.posterCommonConfig,
                                    );
                                });
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
                    that.startCreateCanvas = false;
                    that.showPosterMask = true;
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
        onPosterSuccess({ detail }) {
            this.startCreateCanvas = false;
            this.showPosterMask = true;
            this.canvasImg = detail;
            this.showOpenLotteryPanel = false;
            this.lock = false;
            uni.hideLoading();
        },
        onPosterFail(err) {
            uni.hideLoading();
            this.lock = false;
            console.log(111, err);
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
        closePoster() {
            // 关闭抽奖结果
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
        getNewLotteryNum({ index, type }) {
            if (type) {
                return false;
            }
            switch (index) {
                case 0:
                    api.isLogin({
                        fr: this.fr,
                    });
                    break;
                case 1:
                    this.maskPrompt = false;
                    this.$nextTick(() => {
                        uni.pageScrollTo({
                            selector: '.activity-init-page >>> .menu-list',
                            duration: 300,
                        });
                    });
                    break;
                default:
                    api.isLogin({
                        fr: this.fr,
                    }).then(() => {
                        this.maskPrompt = false;
                        uni.navigateTo({
                            url: `/pages/activity-pages/upload/modify?activity_id=${this.activityId}`,
                        });
                    });
                    break;
            }

            return true;
        },
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
        jumpSearch(item) {
            uni.navigateTo({
                url: `/pages/activity-pages/mywork/mywork?type=search&activity_id=${this.activityId}&user_id=${item.user_id}`,
            });
        },
        onReachBottom() {
            uni.$emit('onReachBottom');
        },
        prizeList(type) {
            if (type === 1) {
                this.showMask({ title: '奖品设置说明', type });
            } else {
                this.getLuckyList();
            }
        },
        getPrizeNum() {
            if (this.status === 2) {
                this.showMask({ title: '获取抽奖机会', type: 3 });
            } else {
                uni.showToast({
                    title: this.status === 3 ? '活动已结束' : '活动未开始',
                    icon: 'none',
                });
            }
        },
        showMask({ title, type }) {
            // type 1-奖品设置 2-幸运榜单 3-获取抽奖机会
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
    .lottery-panel {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        z-index: 1001;
        background-color: rgba(0, 0, 0, 0.79);
        &.open-lottery {
            .lottery-panel-img {
                width: 540upx;
                height: 527upx;
            }
            .packet-num {
                font-size: 32upx;
                text-align: center;
                color: #bb77ff;
                position: absolute;
                top: 82upx;
                left: 50%;
                transform: translateX(-50%);
                width: 100%;
                line-height: 66upx;
                & > text {
                    font-size: 60upx;
                    display: inline-block;
                    margin: 0 14upx;
                    vertical-align: middle;
                }
            }
        }
        .lottery-panel-box {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .join-lottery {
            background-color: #c790ff;
            line-height: 98upx;
            text-align: center;
            margin-top: 26upx;
        }
        .close {
            width: 63upx;
            height: 63upx;
            margin: 38upx auto 0;
            display: block;
        }
        .lottery-panel-img {
            width: 541upx;
            height: 720upx;
            margin: 0 auto;
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
    .children-btn {
        padding: 0 40upx;
        line-height: 74upx;
        color: #fff;
        border-radius: 48upx;
        background-color: #ff78a5;
        box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
        position: relative;
        font-size: 32upx;
        &::before {
            content: "";
            position: absolute;
            left: 13upx;
            top: 12upx;
            width: 25upx;
            height: 27upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
            background-size: 100% 100%;
        }
    }
    .prize-box {
        box-shadow: inset 0 0px 24upx 0px rgba(182, 146, 255, 1);
        background-color: #fff;
        margin: -120upx 0upx 40upx;
        border-radius: 50upx;
        padding: 0 20upx 48upx;
        .prize-list {
            border-bottom: 2upx #c790ff dashed;
            &:nth-of-type(2) {
                border-bottom: 0 none;
            }
        }
        .prize-list-title {
            display: flex;
            justify-content: space-between;
            padding: 40upx 10upx 39upx 30upx;
            .title-text {
                &::after {
                    content: "";
                    position: absolute;
                    right: -30upx;
                    top: 5upx;
                    width: 70upx;
                    height: 60upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_a.png);
                    background-size: 100% 100%;
                }
            }
            .handel-text {
                color: #bb77ff;
                font-size: 24upx;
                font-weight: 500;
                position: relative;
                top: 10upx;
                min-width: 166upx;
                text-align: center;
                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0upx;
                    width: 166upx;
                    height: 42upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_flag.png);
                    background-size: 100% 100%;
                }
            }
        }
        .prize-list-item {
            display: flex;
            justify-content: space-between;

            .prize-item {
                border: 4upx solid #c790ff;
                border-bottom: 0 none;
                border-radius: 7upx;
                box-sizing: border-box;
                position: relative;
                image {
                    width: 132upx;
                    height: 120upx;
                }
            }
            .pirze-text {
                position: absolute;
                left: -8upx;
                right: -8upx;
                bottom: 0upx;
                background-color: #c790ff;
                border-radius: 0 0 10upx 10upx;
                font-size: 20upx;
                text-align: center;
                color: #fff;
                padding-top: 4upx;
                padding-bottom: 2upx;
                min-height: 36upx;
                &::before {
                    content: "";
                    position: absolute;
                    top: -14upx;
                    left: 0;
                    right: 0;
                    height: 17upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_bg.png);
                    background-position: top center;
                    background-size: 100% 100%;
                }
                .pirze-rank {
                    line-height: 26upx;
                    padding: 0 11upx;
                    background-color: #ffe79c;
                    color: #bb77ff;
                    display: inline-block;
                    border-radius: 16upx;
                }
            }
            &.prize-list-item-0 {
                padding: 0 50upx 50upx;
                .prize-item {
                    width: 153upx;
                    height: 188upx;
                    padding: 3upx 6upx 0;
                }
            }
            &.prize-list-item-1 {
                .pirze-text {
                    line-height: 36upx;
                }
                .prize-item {
                    width: 144upx;
                    height: 164upx;
                    padding: 3upx 2upx;
                }
            }
        }
        .prize-handel-item {
            display: flex;
            justify-content: space-between;
            margin: 48upx 31upx 0;
            .btn {
                height: 158upx;
                font-size: 28upx;
                font-weight: 600;
                color: #333;
                line-height: 176upx;
                background-position: center center;
                background-size: 100% 100%;
                text-align: center;
                font-weight: bold;
                &:nth-of-type(1) {
                    width: 274upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_0.png);
                }
                &:nth-of-type(2) {
                    width: 234upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_1.png);
                }
            }
        }
    }
    .poster-img-mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 63upx 0;
        box-sizing: border-box;
        background-color: rgba(0, 0, 0, 0.79);
        text-align: center;
        z-index: 1003;
        .prize-btn {
            background-color: #ff78a5;
            display: inline-block;
            margin: 18upx auto 16upx;
            padding: 0 50upx;
        }
        .tips {
            font-size: 30upx;
            color: #fff;
            line-height: 108upx;
            height: 108upx;
            & > text {
                color: #bb77ff;
                font-size: 40upx;
                display: inline-block;
                margin: 0 10upx;
                font-weight: bold;
            }
        }
        .canvas-img {
            width: 538upx;
            height: 760upx;
            margin: 0 auto 30upx;
            image {
                width: 100%;
                height: 100%;
            }
        }
        .btn {
            background-color: #c790ff;
            line-height: 98upx;
            width: 540upx;
            box-sizing: border-box;
            margin: 0 auto;
        }
        .text-item-box {
            min-height: 60upx;
        }
        .text-item {
            font-size: 26upx;
            line-height: 60upx;
            color: #fff;
            & > text {
                color: #bb77ff;
                font-size: 34upx;
                vertical-align: middle;
            }
        }

        .close {
            display: block;
            margin: 0 auto;
            width: 63upx;
            height: 63upx;
        }
    }
}
@import "../theme/index.less";
</style>
