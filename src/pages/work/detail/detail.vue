<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
        :style="{ height: pageHeight + 'px' }"
    >
        <view
            v-if="prompt"
            class="activerulebox"
            :class="[
                { read: activity_id === 6 },
                { chunjie: activity_id === 3 || activity_id === 4 },
                { wuyi: activity_id === 8 || activity_id === 13 },
                { openGame: from === 'openGame' },
                { liuyi: activity_id === 9 },
                { qiyi: activity_id === 10 },
                { bayi: activity_id === 12 },
                { shiyi: activity_id === 14 }
            ]"
        >
            <view class="activerule">
                <image
                    class="saveImg"
                    :style="{
                        height: canvasImgH + 'px',
                        width: canvasImgW + 'px'
                    }"
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

                <view
                    class="close"
                    @click="handleClose"
                />
            </view>
        </view>

        <!-- 小程序分享 -->
        <template v-if="!isH5">
            <view
                v-if="showTicketMask"
                class="ticket-mask"
            >
                <view class="ticket-mask-content">
                    <poster
                        id="poster"
                        :config="posterConfig"
                        @success="onPosterSuccess"
                        @fail="onPosterFail"
                    >
                        <view class="ticket-poster">
                            <image src="/static/images/work/posters.png" />
                            <view>生成海报</view>
                        </view>
                    </poster>
                    <view class="ticket-friend">
                        <button open-type="share" />
                        <view>发送给好友</view>
                    </view>

                    <view
                        class="ticket-close"
                        @click="showTicketMask = false"
                    />
                </view>
            </view>
        </template>

        <!-- h5 分享 -->
        <template v-if="isH5">
            <view
                v-if="showShareMask === true"
                class="share-mask"
                @click="showShareMask = false"
            >
                <image
                    class="share-pic"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/share-guide.png"
                />
            </view>
        </template>
        <swiper
            class="out-swiper"
            vertical="true"
            current="1"
            :indicator-dots="false"
            circular="true"
            @change="changeOutSwiper"
        >
            <swiper-item
                id="1"
                class="pre-swiper"
            >
                <detail
                    :page-data="pageDataOne"
                    :like-status="likeStatus"
                    :is-change-slide="currentSwiper"
                    :swiper-page="0"
                    :activity-id="activity_id"
                    :is-from-share="isFromShare"
                    :from="from"
                    :show-drawer="showDrawer"
                    :comment-total="commentTotal"
                    :is-change-status-like="isChangeStatusLike"
                    @doAction="doAction"
                />
            </swiper-item>
            <template>
                <swiper-item
                    v-if="disableslide"
                    class="cur-swiper"
                    @touchmove.stop="stopTouchMove"
                >
                    <detail
                        :page-data="pageDataTwo"
                        :like-status="likeStatus"
                        :is-change-slide="currentSwiper"
                        :swiper-page="1"
                        :activity-id="activity_id"
                        :is-from-share="isFromShare"
                        :from="from"
                        :show-drawer="showDrawer"
                        :comment-total="commentTotal"
                        :is-change-status-like="isChangeStatusLike"
                        @doAction="doAction"
                    />
                </swiper-item>
                <swiper-item
                    v-else
                    class="cur-swiper"
                >
                    <detail
                        :page-data="pageDataTwo"
                        :like-status="likeStatus"
                        :is-change-slide="currentSwiper"
                        :swiper-page="1"
                        :activity-id="activity_id"
                        :is-from-share="isFromShare"
                        :from="from"
                        :show-drawer="showDrawer"
                        :comment-total="commentTotal"
                        :is-change-status-like="isChangeStatusLike"
                        @doAction="doAction"
                    />
                </swiper-item>
            </template>

            <swiper-item class="next-swiper">
                <detail
                    :page-data="pageDataThree"
                    :like-status="likeStatus"
                    :is-change-slide="currentSwiper"
                    :swiper-page="2"
                    :activity-id="activity_id"
                    :is-from-share="isFromShare"
                    :from="from"
                    :show-drawer="showDrawer"
                    :comment-total="commentTotal"
                    :is-change-status-like="isChangeStatusLike"
                    @doAction="doAction"
                />
            </swiper-item>
        </swiper>
        <drawer
            :show="showDrawer"
            :page-data="pageData"
            :fr="fr"
            @doAction="doAction"
            @getcommentTotal="getcommentTotal"
        />
    </view>
</template>

<script>
import api from '../../../common/api';
import utils from '../../../common/utils';
import share from '../../../common/share';
import logger from '../../../common/logger';
import detail from '../../../widgets/work/detail.vue';
import detailConf from './detail.config';
import drawer from '../../../widgets/work/drawer.vue';
// 上下滑动的功能的拆解
// 使用Swiper组件，把页面的主要内容，当作独立的部分，迁移到../../../widgets/work/detail.vue。
// 页面滑动的时候，确定下当前显示的数据，用来做转发，二维码的数据

// 页面进入时候，分别获取前一页面，后一页面的数据，显示在swiper-item里面。
// 根据页面翻动的方向, 获取相对的第二页面的数据，并修改视图。

export default {
    components: {
        detail,
        drawer,
    },
    data() {
        let pix = 2;
        try {
            const res = uni.getSystemInfoSync();
            pix = res.windowWidth / 750;
        } catch (e) {
            // error
        }
        return {
            id: '',
            detailId: '',
            // video: 'https://node.imgio.in/demo/birds.m3u8',
            video:
                'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
            isLoading: true,
            pageData: {
                video_img_url: '',
            },
            likeStatus: 0,
            showShareMask: false,

            // #ifdef H5
            isH5: true,
            isWechat: false,
            // #endif
            shareDesc: '',
            fr: '',
            posterConfig: detailConf[0].posterConfig,
            prompt: false,
            canvasImg: '',

            showTicketMask: false,
            curDetailConf: detailConf[0],
            activity_id: 0,
            imgAuthBtn: false,
            isFromShare: '',
            from: '',
            showDrawer: false,
            disableslide: false,
            pageDataTwo: {},
            pageDataThree: {},
            pageDataOne: {},

            prePageParam: {},
            currentSwiper: 1,
            outSwiperIncrease: true,
            filterObj: {},
            apiFrom: '',
            commentTotal: 0,
            isChangeStatusLike: false,
            canvasImgH: 570 * pix,
            canvasImgW: 826 * pix,
            pix,
            userInfo: null,
            shareConfig: {},
            pageHeight: 500,
        };
    },
    mounted() {
        if (this.isH5) {
            const ua = window.navigator.userAgent.toLowerCase();
            this.isWechat = ua.indexOf('micromessenger') !== -1;
        }
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                that.pageHeight = res.windowHeight;
            },
        });
    },
    methods: {
        getcommentTotal(val) {
            this.commentTotal = val;
        },
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
                that.imgAuthBtn = true;
            } else {
                // eslint-disable-next-line no-undef
                wx.showToast({
                    title: '授权成功',
                    icon: 'none',
                    success() {
                        uni.showLoading({
                            mask: true,
                        });
                        that.imgAuthBtn = false;
                        that.handleSave();
                    },
                });
            }
        },
        handleCanvass() {
            // alert(Object.keys(this.shareConfig).length);
            api.appShare(this.shareConfig).then(() => {
                // #ifdef H5
                this.showShareMask = true;
                // #endif
                // #ifndef H5
                if (
                    this.pageData.resource_scope === 3
                    && this.from !== 'openGame'
                    && !this.activity_id
                ) {
                    this.posterConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/aitiaozhan-poster2.png';
                }
                this.handleTicketMask();
                // #endif
            });
        },
        // 生成二维码，并弹出mask
        handleTicketMask() {
            uni.showLoading({
                mask: true,
            });
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages(); // 获取加载的页面
            const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
            const url = currentPage.route || 'pages/work/detail/detail';
            const scene = `id=${this.id}&aid=${this.activity_id}&y=${
                this.from === 'openGame' ? '2' : '1'
            }` || 'id=325';
            // const scene = `id=${this.id}`;
            console.log(url, scene, 'url---scene---');
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    console.log(!!url, 'asasasas');
                    uni.hideLoading();
                    if (url) {
                        this.base64src(url, (res) => {
                            console.log('url------', res);
                            this.posterConfig.images[2].url = res;
                            this.showTicketMask = true;
                        });
                    } else {
                        this.posterConfig.images[2].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                        this.showTicketMask = true;
                    }
                },
                () => {
                    this.posterConfig.images[2].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    this.showTicketMask = true;
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

        onPosterSuccess(e) {
            const { detail } = e;
            this.canvasImg = detail;
            this.showTicketMask = false;
            this.prompt = true;
        },
        handleSave() {
            const that = this;
            // 图片保存到本地
            // eslint-disable-next-line no-undef
            wx.saveImageToPhotosAlbum({
                filePath: this.canvasImg,
                success() {
                    that.prompt = false;
                    that.showTicketMask = false;
                    that.imgAuthBtn = false;
                    uni.showToast({
                        title: '已保存成功到相册',
                        icon: 'success',
                        duration: 2000,
                    });
                },
                fail(err) {
                    if (
                        err.errMsg
                            === 'saveImageToPhotosAlbum:fail:auth denied'
                        || err.errMsg === 'saveImageToPhotosAlbum:fail auth deny'
                    ) {
                        uni.hideLoading();
                        that.imgAuthBtn = true;
                        // eslint-disable-next-line no-undef
                        wx.showToast({
                            title: '保存失败请授权',
                            icon: 'none',
                        });
                    }
                },
            });
        },
        handleClose() {
            this.prompt = false;
        },
        onPosterFail(e) {
            console.log(e, 'fail-------------------');
        },
        getData(reget) {
            let url = '/api/works/detail';
            if (this.activity_id) {
                url = '/api/activity/detail';
            }
            api.get(url, {
                id: this.id,
            }).then(
                (res) => {
                    this.isLoading = false;
                    this.detailId = res.id;
                    this.pageData = res;
                    if (!reget) {
                        this.pageDataTwo = res;
                        this.setGetDetail(res);
                    }
                },
                (err) => {
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                    setTimeout(() => {
                        uni.reLaunch({
                            url: '/pages/tabBar/index/index',
                        });
                    }, 1500);
                },
            );
            this.getLikeStatus();
        },
        setGetDetail(res) {
            if (
                this.apiFrom === '/api/user/worklist'
                || this.apiFrom === '/api/works/list'
            ) {
                this.activity_id = res.activity_id || 0;
            }
            this.id = res.id;
            // activity_id,  没有7..没有11
            if (this.activity_id) {
                // wyhd 五一活动
                const arr = [
                    'xchd',
                    'dsxnh',
                    'dsxnh',
                    'dshd',
                    '',
                    'wyhd',
                    'lyhd',
                    'qyhd',
                    '',
                    'byhd',
                    'qyhd',
                ];
                const type = arr[this.activity_id - 3];
                this.fr = logger.getFr(type, {});
            }

            if (this.from !== 'openGame') {
                if (this.activity_id > 2) {
                    this.curDetailConf = detailConf[this.activity_id - 1];
                } else if (this.pageData.resource_scope === 3) {
                    [, this.curDetailConf] = detailConf;
                } else {
                    [this.curDetailConf] = detailConf;
                }
                this.posterConfig = {
                    ...this.posterConfig,
                    ...this.curDetailConf.posterConfig,
                };
            } else {
                //  中间穿插的
                // eslint-disable-next-line prefer-destructuring
                this.curDetailConf = detailConf[6];
                this.posterConfig = {
                    ...this.posterConfig,
                    ...detailConf[6].posterConfig,
                };
            }
            const bgColor = this.posterConfig.images[1].color || 'ffffff';
            this.posterConfig.images[1].url = `${res.video_img_url}?x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,w_460,h_300,color_${bgColor}`;
            this.canvasImgW = this.posterConfig.width * this.pix;
            this.canvasImgH = this.posterConfig.height * this.pix;
            if (this.from === 'openGame') {
                this.posterConfig.texts[0].text = `${res.resource_name}${
                    res.achievement
                        ? `|${res.achievement}${res.achievement_unit}`
                        : ''
                }`;
            } else {
                this.posterConfig.texts[0].text = res.resource_name;
            }
            if (this.activity_id === 10) {
                // 作者
                this.posterConfig.texts[1].text = `我是${res.create_name}`;
            }
            this.pageData.video_img_url = res.video_img_url;

            this.initShare(res);
        },
        toggleLike() {
            let url = '/api/common/like';
            let param = {
                object_id: this.id,
                object_type: 1,
                type: 1,
            };
            if (this.activity_id) {
                url = '/api/activity/vote';
                param = {
                    id: this.id,
                    activity_id: this.activity_id,
                };
            }
            api.isLogin({
                fr: this.fr,
            }).then(
                () => api.get(url, param).then(
                    () => {
                        this.likeStatus = 1;
                        this.isChangeStatusLike = !this.isChangeStatusLike;
                        if (this.activity_id === 9) {
                            this.getUserLotteryNum();
                        }
                        // this.getData('reget');
                    },
                    (err) => {
                        if (this.activity_id) {
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                        } else {
                            uni.showToast({
                                icon: 'none',
                                title: '今日已点赞',
                            });
                        }
                    },
                ),
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
        getLikeStatus() {
            let url = '/api/common/getlikestatus';
            let param = {
                object_type: 1,
                object_id: this.id,
            };
            if (this.activity_id) {
                url = '/api/activity/getuserthumb';
                param = {
                    id: this.id,
                };
            }

            api.get(url, param).then((res) => {
                this.likeStatus = res.status ? 1 : 0;
            });
        },
        // html5VideoAutoAdjust() {
        //     document.querySelector('.uni-video-type-fullscreen').style = '';
        // },
        initShare(res) {
            const { titleList } = this.curDetailConf;
            let title = titleList[Math.floor(Math.random() * titleList.length)];
            const arr = Object.entries(res);
            arr.forEach(([key, val]) => {
                title = title
                    .toString()
                    .replace(key, val)
                    .replace(',', '');
            });
            const desc = `${res.resource_name}-${res.create_name}`;
            this.shareDesc = title;
            const scene = `id=${this.id}&aid=${this.activity_id}&y=${
                this.from === 'openGame' ? '2' : '1'
            }` || 'id=325';
            // #ifdef H5
            share({
                title,
                desc,
                thumbnail: res.video_img_url,
                url: `${window.location.origin}${window.location.pathname}?${scene}`,
            });
            this.shareConfig = {
                ...this.shareConfig,
                share_url: `${window.location.origin}${window.location.pathname}?${scene}`,
                share_image: res.video_img_url,
                share_title: title,
                share_desc: desc,
            };
            // #endif
            uni.setNavigationBarTitle({
                title: res.resource_name || '',
            });
        },
        joinGame() {
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    if (this.activity_id) {
                        this.joinActivity();
                    } else {
                        uni.navigateTo({
                            url: '/pages/openGame/zhibo-list',
                        });
                    }
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
        joinActivity() {
            api.post('/api/activity/getactivitystatus', {
                activity_id: this.activity_id,
            }).then((res) => {
                const { status } = res;
                if (status === 2) {
                    if (this.activity_id >= 10 || this.activity_id === 8) {
                        // 代言人活动，打卡活动详情跳转 活动首页。
                        uni.navigateTo({
                            url: `/activity/pages/index?activity_id=${this.activity_id}`,
                        });
                    } else {
                        // 才艺秀的上传页 网络大赛的上传入口不一样。
                        api.isLogin({ fr: this.fr }).then(() => {
                            uni.navigateTo({
                                url: `/activity/pages/upload/modify?activity_id=${this.activity_id}`,
                            });
                        });
                    }
                } else if (status === 1) {
                    uni.showToast({
                        icon: 'none',
                        title: '活动未开始',
                    });
                } else if (status === 3) {
                    uni.showToast({
                        icon: 'none',
                        title: '活动已结束',
                    });
                }
            });
        },
        setEnroll() {
            api.get('/api/activity/getenrollinfo', {
                activity_id: this.activity_id,
                user_id: this.userInfo.user_id,
            }).then((data) => {
                if (Array.isArray(data) && data.length === 0) {
                    uni.navigateTo({
                        url: '/activity/pages/brand/join',
                    });
                } else {
                    uni.navigateTo({
                        url: `/activity/pages/upload/modify?activity_id=${this.activity_id}`,
                    });
                }
            });
        },
        doAction(action) {
            if (action === 'handleCanvass') {
                this.handleCanvass();
            }
            if (action === 'joinGame') {
                this.joinGame();
            }

            if (action === 'toggleLike') {
                this.toggleLike();
            }
            if (action === 'showMessage') {
                this.showDrawer = !this.showDrawer;
            }
        },
        stopTouchMove() {
            //  禁止滑动。
        },
        changeOutSwiper(event) {
            // 判断滑动的方向
            if (this.currentSwiper > event.detail.current) {
                this.outSwiperIncrease = false;
            } else {
                this.outSwiperIncrease = true;
            }
            if (this.currentSwiper === 2 && event.detail.current === 0) {
                this.outSwiperIncrease = true;
            }
            if (this.currentSwiper === 0 && event.detail.current === 2) {
                this.outSwiperIncrease = false;
            }
            // 计算即将请求数据的位置  targetPosition与slideCurPosition，并处理临界值。
            let objPosition = {};
            const oldSlideCurPosition = this.prePageParam.slideCurPosition;
            let newSlideCurPosition = oldSlideCurPosition;
            let targetPosition = oldSlideCurPosition;

            if (this.outSwiperIncrease) {
                if (this.prePageParam.MaxPosition === 2) {
                    if (oldSlideCurPosition === 1) {
                        targetPosition = 1;
                        newSlideCurPosition = 0;
                    }
                    if (oldSlideCurPosition === 0) {
                        targetPosition = 0;
                        newSlideCurPosition = 1;
                    }
                } else if (
                    oldSlideCurPosition
                    === this.prePageParam.MaxPosition - 2
                ) {
                    newSlideCurPosition += 1;
                    targetPosition = 0;
                } else if (
                    oldSlideCurPosition
                    === this.prePageParam.MaxPosition - 1
                ) {
                    newSlideCurPosition = 0;
                    targetPosition = 1;
                } else {
                    newSlideCurPosition += 1;
                    targetPosition = oldSlideCurPosition + 2;
                }
            } else if (oldSlideCurPosition === 1) {
                targetPosition = this.prePageParam.MaxPosition - 1;
                newSlideCurPosition -= 1;
            } else if (oldSlideCurPosition === 0) {
                targetPosition = this.prePageParam.MaxPosition - 2;
                newSlideCurPosition = this.prePageParam.MaxPosition - 1;
            } else {
                newSlideCurPosition -= 1;
                targetPosition = oldSlideCurPosition - 2;
            }
            this.prePageParam.slideCurPosition = newSlideCurPosition;
            objPosition = this.getPageSizeInfo(targetPosition);
            this.setSwiperPageData(event, objPosition);
        },
        setSwiperPageData(event, objPosition) {
            this.getPageMoreDate(
                objPosition,
                this.filterObj,
                this.apiFrom,
            ).then((res) => {
                // 切换item的时候，修改item.
                if (res) {
                    if (this.outSwiperIncrease) {
                        // 下一个
                        switch (this.currentSwiper) {
                            case 0:
                                this.pageDataThree = res;
                                break;
                            case 1:
                                this.pageDataOne = res;
                                break;
                            case 2:
                                this.pageDataTwo = res;
                                break;
                            default:
                                console.log('1');
                        }
                    } else {
                        switch (this.currentSwiper) {
                            case 2:
                                this.pageDataOne = res;
                                break;
                            case 1:
                                this.pageDataThree = res;
                                break;
                            case 0:
                                this.pageDataTwo = res;
                                break;
                            default:
                                console.log('-');
                        }
                    }
                } else {
                    console.log('没有获取到数据呀。');
                }
                this.currentSwiper = event.detail.current;
            });

            // 使用当前显示的item的pageData,修改导航标题
            let curPageData = {};
            switch (event.detail.current) {
                case 0:
                    curPageData = this.pageDataOne;
                    break;
                case 1:
                    curPageData = this.pageDataTwo;
                    break;
                case 2:
                    curPageData = this.pageDataThree;
                    break;
                default:
                    console.log('-');
            }
            this.pageData = curPageData;
            this.setGetDetail(curPageData);
            this.getLikeStatus();
        },
        getPageMoreDate(postionObj, filterObj = {}, url) {
            const obj = JSON.parse(JSON.stringify(filterObj));
            if (Object.prototype.hasOwnProperty.call(obj, 'page_size')) {
                delete obj.page_size;
                delete obj.page_num;
            }
            if (Object.prototype.hasOwnProperty.call(obj, 'show_type')) {
                delete obj.show_type;
            }

            return api.post(url, {
                ...obj,
                ...postionObj,
            });
        },
        getPageSizeInfo(position) {
            // 获取位置参数
            const obj = {
                current_position: position,
                list_type: 2,
            };
            return obj;
        },
        initOtherSwiperData() {
            const params = this.$store.getters.getWorkParams;
            const { position, filter } = params;
            const { curposition, total, from } = position;
            this.filterObj = filter;
            this.apiFrom = from || '/api/works/list';

            if (total < 2 || this.isFromShare) {
                this.disableslide = true;
            }
            if (
                !this.disableslide
                && !Object.prototype.hasOwnProperty.call(filter, 'page_size')
            ) {
                // h5页面刷新，禁止滑动。
                this.disableslide = true;
                if (filter.sort) {
                    this.disableslide = false;
                }
            }
            // 获取前后两页面的内容。
            if (!this.disableslide) {
                this.prePageParam.initPosition = curposition;
                this.prePageParam.slideCurPosition = curposition; // 第一次进来的位置
                this.prePageParam.MaxPosition = total;

                let toPreTarget = curposition;
                let toNewTarget = curposition;

                if (curposition === 0) {
                    toPreTarget = total - 1;
                    toNewTarget += 1;
                } else if (curposition + 1 === total) {
                    toNewTarget = 0;
                    toPreTarget -= 1;
                } else {
                    toPreTarget -= 1;
                    toNewTarget += 1;
                }
                if (total === 2) {
                    if (curposition === 0) {
                        toPreTarget = 1;
                        toNewTarget = 1;
                    }
                    if (curposition === 1) {
                        toPreTarget = 0;
                        toNewTarget = 0;
                    }
                }

                const paramPre = this.getPageSizeInfo(toPreTarget);
                const paramNext = this.getPageSizeInfo(toNewTarget);
                this.getPageMoreDate(
                    paramPre,
                    this.filterObj,
                    this.apiFrom,
                ).then((res) => {
                    this.pageDataOne = res;
                });
                this.getPageMoreDate(
                    paramNext,
                    this.filterObj,
                    this.apiFrom,
                ).then((res) => {
                    this.pageDataThree = res;
                });
                try {
                    const value = uni.getStorageSync('hasPromtSlide');
                    if (!value) {
                        uni.setStorageSync('hasPromtSlide', 'true');
                        uni.showToast({
                            title: '上下滑动可以切换喔～',
                            duration: 3000,
                            position: 'top',
                            mask: true,
                            icon: 'none',
                        });
                    }
                } catch (e) {
                    // error
                }
            }
        },
        getUserLotteryNum() {
            api.get('/api/activity/getuserlotterynum').then((res) => {
                if (res.vote_num === '5') {
                    uni.showToast({
                        title: '恭喜你获得一次免费的抽奖资格，快来抽奖吧',
                        icon: 'none',
                    });
                }
            });
        },
    },
    onLoad(query) {
        this.id = utils.getParam(query, 'id');
        this.fr = utils.getParam(query, 'fr') || '';
        this.isFromShare = utils.getParam(query, 'isFromShare')
            || utils.getParam(query, 'y')
            || '';
        this.activity_id = Number(utils.getParam(query, 'activity_id'))
            || Number(utils.getParam(query, 'aid'))
            || 0;
        this.from = utils.getParam(query, 'from') || '';
        if (this.isFromShare === '2') {
            this.from = 'openGame';
        }

        console.log(
            this.activity_id,
            this.isFromShare,
            '-----this.activity_id---',
        );

        // 获取detail页面的内容
        this.getData();
        this.initOtherSwiperData();
        // #ifndef H5
        this.poster = this.selectComponent('#poster');
        this.getAuthStatus();
        // #endif

        // hack for html5 video size notwoking
        // #ifdef H5
        // window.removeEventListener(
        //     'orientationchange',
        //     this.html5VideoAutoAdjust,
        // );
        // window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        // #endif
    },
    onHide() {
        // this.isPaused = true;
        console.log('hidiiing--------');
    },
    onShow() {
        // 返回列表，刷新作品页，首页的点赞
        uni.setStorageSync('onShowFrom', 'detail');
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            imageUrl: `${this.pageData.video_img_url}?x-oss-process=image/resize,m_fill,w_250,h_150`,
            path: `/pages/work/detail/detail?id=${this.id}&activity_id=${this.activity_id}&isFromShare=1&from=${this.from}`,
        };
    },
};
</script>

<style lang="less">
.page-work-detail {
    background: #000;
    height: 100%;
    #poster {
        // position: absolute;
        // left:-999upx;
    }
    .out-swiper {
        width: 100%;
        height: 100%;
    }
    .activerulebox {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        z-index: 999;
        .activerule {
            padding-top: 120upx;
        }
        .saveImg {
            position: relative;
            left: 50%;
            // top: 150upx;
            transform: translateX(-50%);
        }
        .saveBtn {
            // position: absolute;
            position: relative;
            width: 520upx;
            height: 96upx;
            // left: 50%;
            // transform: translateX(-50%);
            // top: 938upx;
            background: linear-gradient(
                180deg,
                rgba(0, 132, 255, 1),
                rgba(44, 233, 255, 1)
            );
            border-radius: 55upx;
            color: #fff;
            font-weight: 600;
            font-size: 36upx;
            line-height: 96upx;
            text-align: center;
            letter-spacing: 2rpx;
            margin: 30rpx auto 0;
        }
        .close {
            position: relative;
            width: 54upx;
            height: 54upx;
            background: rgba(0, 132, 255, 1);
            left: 50%;
            // top: 1074upx;
            border-radius: 50%;
            transform: translateX(-50%);
            display: inline-block;
            margin-top: 30rpx;
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
        &.openGame {
            .activerule {
                padding-top: 30upx;
            }
            .saveBtn {
                background: url("../../../static/images/zhibo/openGame-btn.png");
                background-size: 100% 100%;
                border-radius: 0;
                color: #333;
                line-height: 80rpx;
                margin-top: 14rpx;
            }
            .close {
                margin-top: 14rpx;
                background: transparent;
                border: 2upx solid #fff;
            }
        }
        &.read {
            .saveBtn {
                background: linear-gradient(
                    180deg,
                    rgba(4, 168, 117, 1),
                    rgba(9, 231, 162, 1)
                );
            }
            .close {
                background: #06d08e;
            }
        }
        &.chunjie {
            .saveBtn {
                background: linear-gradient(
                    0deg,
                    rgba(255, 22, 16, 1),
                    rgba(255, 189, 103, 1)
                );
                color: #ffe57b;
            }
            .close {
                background: rgb(255, 22, 16);
            }
        }
        &.wuyi {
            .saveBtn {
                background: linear-gradient(
                    180deg,
                    rgba(219, 78, 14, 1),
                    rgba(255, 159, 115, 1)
                );
                border-radius: 55rpx;
                color: #fff;
            }
            .close {
                background: #e76a31;
            }
        }
        &.liuyi {
            .saveBtn {
                color: #fff;
                background-color: #c790ff;
                background-image: url(../../../static/images/work/querter-circle.png);
                background-repeat: no-repeat;
                background-position: 12rpx 12rpx;
                background-size: 34rpx 36rpx;
                box-shadow: 0 0 24rpx 0 rgba(255, 255, 255, 1) inset;
            }
            .close {
                background: transparent;
                border: 2rpx solid #fff;
            }
        }
        &.qiyi {
            .saveBtn {
                width: 570upx;
                background: linear-gradient(
                    180deg,
                    rgba(255, 142, 133, 1),
                    rgba(255, 87, 74, 1)
                );
                box-shadow: 0 4upx 6upx 0 rgba(0, 0, 0, 0.4);
            }
            .close {
                background: linear-gradient(
                    180deg,
                    rgba(255, 142, 133, 1),
                    rgba(255, 87, 74, 1)
                );
            }
        }
        &.bayi {
            .saveBtn {
                width: 570upx;
                background: linear-gradient(
                    180deg,
                    rgba(255, 162, 132, 1),
                    rgba(255, 104, 76, 1)
                );
                box-shadow: 0 4upx 6upx 0 rgba(0, 0, 0, 0.4);
            }
            .close {
                background: linear-gradient(
                    180deg,
                    rgba(255, 162, 132, 1),
                    rgba(255, 104, 76, 1)
                );
            }
        }
        &.shiyi {
            .saveBtn {
                width: 216upx;
                height: 72upx;
                line-height: 72upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/show-bg.png);
                font-size: 28upx;
                background-size: 100%;
                margin-top: 0;
            }
            .close {
                position: absolute;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-close.png);
                background-size: 100%;
                top: 0;
                right: 40upx;
                width: 52upx;
                height: 52upx;
                left: auto;
                &::before,
                &::after {
                    display: none;
                }
            }
            .activerule {
                padding-top: 20upx;
                position: relative;
            }
        }
    }

    .share-mask {
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;

        .share-pic {
            width: 438rpx;
            height: 216rpx;
            position: absolute;
            right: 40rpx;
            top: 28rpx;
        }
    }
    .ticket-mask {
        position: fixed;
        z-index: 9999;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        color: #999;
        font-size: 28upx;
        .ticket-mask-content {
            width: 100%;
            height: 272upx;
            background: #fff;
            border-radius: 30upx 30upx 0 0;
            position: absolute;
            bottom: 0;
            left: 0;
        }
        .ticket-friend {
            position: absolute;
            left: 180rpx;
            top: 46rpx;
            text-align: center;
            button {
                width: 110rpx;
                height: 110rpx;
                background: url("../../../static/images/work/weixin.png");
                background-size: 100% 100%;
                background-color: transparent;
                &:after {
                    border-width: 0;
                }
            }
            view {
                margin-top: 14upx;
            }
        }

        .ticket-poster {
            position: absolute;
            left: 420rpx;
            top: 44rpx;
            text-align: center;
            image {
                width: 110rpx;
                height: 110rpx;
            }
            view {
                margin-top: 4upx;
            }
        }
        .ticket-close {
            position: absolute;
            right: 0;
            top: 0;
            padding: 50upx;
            color: #333;
            font-size: 28upx;
            &::before,
            &::after {
                content: "";
                position: absolute;
                display: block;
                width: 28upx;
                height: 4upx;
                background: #999;
                right: 30upx;
                top: 30upx;
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
}
</style>
