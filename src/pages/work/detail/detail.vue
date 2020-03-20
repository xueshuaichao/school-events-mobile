<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
    >
        <view
            v-if="prompt"
            class="activerulebox"
        >
            <image
                class="saveImg"
                :src="canvasImg"
            />
            <!-- 保存图片 -->
            <view
                class="saveBtn"
                @click="handleSave"
            >
                保存到本地
            </view>
            <image
                class="close"
                src="/static/images/yiqing/close-icon.png"
                @click="handleClose"
            />
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

                    <text
                        class="ticket-close"
                        @click="showTicketMask = false"
                    >
                        取消
                    </text>
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

        <!-- <view
            v-show="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view> -->
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
                item-id="0"
            >
                <detail
                    ref="pageDataOne"
                    :page-data="pageDataOne"
                    :like-status="likeStatus"
                    :is-change-slide="currentSwiper"
                    :swiper-page="0"
                    @doAction="doAction"
                />
            </swiper-item>

            <template>
                <swiper-item
                    v-if="disableslideCurrent"
                    class="cur-swiper"
                    @touchmove.stop="stopTouchMove"
                >
                    <detail
                        ref="pageDataTwo"
                        :page-data="pageDataTwo"
                        :like-status="likeStatus"
                        :is-change-slide="currentSwiper"
                        :swiper-page="1"
                        @doAction="doAction"
                    />
                </swiper-item>
                <swiper-item
                    v-else
                    id="2"
                    class="cur-swiper"
                    item-id="1"
                >
                    <detail
                        ref="pageDataTwo"
                        :page-data="pageDataTwo"
                        :like-status="likeStatus"
                        :is-change-slide="currentSwiper"
                        :swiper-page="1"
                        @doAction="doAction"
                    />
                </swiper-item>
            </template>

            <swiper-item
                id="3"
                class="next-swiper"
                item-id="2"
            >
                <detail
                    ref="pageDataThree"
                    :page-data="pageDataThree"
                    :like-status="likeStatus"
                    :is-change-slide="currentSwiper"
                    :swiper-page="2"
                    @doAction="doAction"
                />
            </swiper-item>
        </swiper>

        <!-- <view
            v-if="isPlayed && isPaused"
            class="pause-cover"
        >
            <view
                class="uni-video-cover"
                @click="togglePlayStatus"
            >
                <div class="uni-video-cover-play-button" />
            </view>
        </view>
        <view
            v-if="isVideoWaiting"
            class="uni-video-cover"
            style="pointer-events: none;color: #fff"
        >
            加载中
        </view> -->
    </view>
</template>

<script>
import api from '../../../common/api';
import utils from '../../../common/utils';
import share from '../../../common/share';
import detail from '../../../widgets/work/detail.vue';
// 上下滑动的功能的拆解
// 使用Swiper组件，把页面的主要内容，当作独立的部分，迁移到../../../widgets/work/detail.vue。
// 页面滑动的时候，确定下当前显示的数据，用来做转发，二维码的数据

// 页面进入时候，分别获取前一页面，后一页面的数据，显示在swiper-item里面。
// 根据页面翻动的方向, 获取相对的第二页面的数据，并修改视图。

export default {
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 375;
            const height = 667;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2},color_000000`;
            }
            return newUrl;
        },
    },
    components: {
        detail,
    },
    data() {
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
            // isPlayed: false,
            // isPaused: false,
            // isVideoWaiting: false,
            showShareMask: false,

            // #ifdef H5
            isH5: true,
            // #endif

            // isFullScreen: false,

            shareDesc: '',
            fr: '',
            posterConfig: {
                pixelRatio: 3,
                width: 570,
                height: 826,
                debug: false,
                texts: [
                    {
                        x: 60,
                        y: 590,
                        text: [
                            {
                                text: '',
                                fontSize: 30,
                                color: '#333',
                                opacity: 1,
                                marginRight: 10,
                                lineHeight: 40,
                                lineNum: 1,
                                width: 1210,
                                textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/aitiaozhan-poster.png',
                        width: 570,
                        height: 826,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 469,
                        height: 315,
                        y: 233,
                        x: 50,
                    },
                    {
                        url: '',
                        width: 142,
                        height: 142,
                        y: 666,
                        x: 380,
                        borderRadius: 140,
                    },
                ],
            },

            prompt: false,
            canvasImg: '',
            showTicketMask: false,

            pageFrom: '',

            pageDataTwo: {},
            pageDataThree: {},
            pageDataOne: {},

            prePageParam: {},
            currentSwiper: 1,
            outSwiperIncrease: true,
            levelid: -1,
            sort: 1,
            actCat: 0,
            actSort: '',
            search: '',
            keyword: '',
            disableslide: false,
            filterUrl: {},
            queryUrl: '',
            isChangeSlide: false,
            disableslideCurrent: true,
        };
    },
    created() {},
    methods: {
        handleCanvass() {
            // #ifdef H5
            this.showShareMask = true;
            // #endif

            // #ifndef H5
            this.handleTicketMask();
            // #endif
            if (this.pageData.resource_scope === 3) {
                this.posterConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/aitiaozhan-poster2.png';
            }
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
            const scene = `id=${this.id}&${this.queryUrl}&curPosition=${this.prePageParam.slideCurPosition}`
                || 'id=325';
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    uni.hideLoading();
                    if (url) {
                        this.base64src(url, (res) => {
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
            console.log(1111, e);
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
                    uni.showToast({
                        title: '已保存成功',
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
        handleClose() {
            this.prompt = false;
        },
        onPosterFail(e) {
            console.log(e, 'fail-------------------');
        },
        getData() {
            api.get('/api/works/detail', {
                id: this.id,
            }).then(
                (res) => {
                    this.isLoading = false;
                    this.detailId = res.id;
                    this.pageData = res;
                    this.pageDataTwo = res;
                    this.setGetDetail(res);
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
            this.posterConfig.images[1].url = res.video_img_url;
            this.posterConfig.texts[0].text[0].text = res.resource_name;
            this.initShare(res);
            uni.setNavigationBarTitle({
                title: res.resource_name || '',
            });
            // if (res.resource_type === 2) {
            // 说明是图片，计算播放量
            api.post('/api/works/playcount', {
                id: res.id,
            }).then(() => {
                this.pageData.play_count = res.play_count + 1;
            });
            // }
        },
        toggleLike() {
            api.isLogin().then(
                () => {
                    const isLiked = this.likeStatus === 1;
                    return api
                        .get('/api/common/like', {
                            object_id: this.id,
                            object_type: 1,
                            // 1-点赞 0 取消点赞
                            type: isLiked ? 0 : 1,
                        })
                        .then(
                            (res) => {
                                console.log(res);
                                this.likeStatus = isLiked ? 0 : 1;
                                this.getData();
                            },
                            (err) => {
                                uni.showToast({
                                    icon: 'none',
                                    title: err.message,
                                });
                            },
                        );
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
        getLikeStatus() {
            api.get('/api/common/getlikestatus', {
                object_type: 1,

                object_id: this.id,
            }).then((res) => {
                this.likeStatus = res.status;
            });
        },
        // onPlay() {
        //     if (!this.isPlayed) {
        //         this.pageData.play_count = this.pageData.play_count + 1;
        //         api.get('/api/works/playcount', {
        //             id: this.detailId,
        //         });
        //     }
        //     this.isVideoWaiting = false;
        //     this.isPlayed = true;
        // },
        // onWaiting() {
        //     this.isVideoWaiting = true;
        //     this.timeupdateCounter = 0;
        // },
        // onTimeupdate() {
        //     if (this.timeupdateCounter > 1) {
        //         this.isVideoWaiting = false;
        //     } else {
        //         this.timeupdateCounter += 1;
        //     }
        // },
        // onFullScreenChange(e) {
        //     const isFullScreenMode = e.detail.fullScreen;
        //     this.isFullScreen = isFullScreenMode;
        // },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        initShare(res) {
            let title = `我的作品《${res.resource_name}》，【我正在参加青少年爱挑战活动】,快来给我点赞吧！`;

            if (this.pageData.resource_scope === 3) {
                title = `我的作品《${res.resource_name}》，【我正在参加才艺秀活动】,快来给我点赞吧！`;
            }
            const desc = `${res.resource_name}-${res.create_name}`;
            this.pageData.video_img_url = res.video_img_url;
            this.shareDesc = title;
            share({
                title,
                desc,
                thumbnail: res.video_img_url,
            });
        },
        joinGame() {
            if (this.isH5) {
                uni.showToast({
                    icon: 'none',
                    title: '请在UP青少年爱挑战小程序或爱挑战PC官网上传作品',
                });
                return;
            }
            api.isLogin().then(
                () => {
                    uni.switchTab({
                        url: '/pages/tabBar/upload/upload',
                    });
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
        // togglePlayStatus() {
        //     this.$refs.video.play();
        //     this.isPaused = false;
        // },
        getPageMoreDate(paramData) {
            // 设置接口，根据条件增加参数
            if (this.pageFrom === 'mywork') {
                // 我的作品的详情，暂时屏蔽了。
                return this.postFromAPI('/api/user/worklist', paramData);
            }
            return this.postFromAPI('/api/works/list', {
                ...paramData,
                cat_id: { one_level_id: this.levelid },
                sort: this.sort,
                keyword: this.keyword,
            });
        },
        postFromAPI(url, paramData) {
            return api.post(url, paramData);
        },
        changeOutSwiper(event) {
            //  已经滑动到下一个作品，获取下下个，或者上上个作品。
            // 判断移动方向,向上，向下。
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
            console.log(
                this.prePageParam.slideCurPosition,
                '---变化前显示的位置',
            );
            // 预获取数据。最后一页的数据可以划到第一页来。
            let objPosition = {};
            let targetPosition = this.prePageParam.slideCurPosition;
            if (this.outSwiperIncrease) {
                targetPosition = this.prePageParam.slideCurPosition + 2;
                if (
                    this.prePageParam.slideCurPosition
                    === this.prePageParam.MaxPosition - 1
                ) {
                    this.prePageParam.slideCurPosition += 1;
                    targetPosition = 1;
                } else if (
                    this.prePageParam.slideCurPosition
                    === this.prePageParam.MaxPosition
                ) {
                    this.prePageParam.slideCurPosition = 1;
                    targetPosition = 2;
                } else {
                    this.prePageParam.slideCurPosition += 1;
                }

                objPosition = this.getPageSizeInfo(targetPosition);
            } else {
                targetPosition = this.prePageParam.slideCurPosition - 2;

                if (this.prePageParam.slideCurPosition === 2) {
                    targetPosition = this.prePageParam.MaxPosition;
                    this.prePageParam.slideCurPosition -= 1;
                } else if (this.prePageParam.slideCurPosition === 1) {
                    this.prePageParam.slideCurPosition = this.prePageParam.MaxPosition;
                    targetPosition = this.prePageParam.MaxPosition - 1;
                } else {
                    this.prePageParam.slideCurPosition -= 1;
                }

                objPosition = this.getPageSizeInfo(targetPosition);
            }
            console.log(
                this.prePageParam.slideCurPosition,
                '---变化后显示的位置-----目标--',
                targetPosition,
            );
            this.setSwiperPageData(event, objPosition);
        },
        setSwiperPageData(event, objPosition) {
            this.getPageMoreDate(objPosition).then((res) => {
                //  滚动的时候去获取得到第三页的详情，详情有值再修改轮播Item匹配的数据，详情没有值，就是获取到了最后一个数据
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

            // 不需要等待接口数据，直接修改下pageData，以便进行页面的转发，与二维码功能
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
            this.id = curPageData.id;
            this.pageData = curPageData;
            this.isChangeSlide = !this.isChangeSlide;
            this.setGetDetail(curPageData);
            this.getLikeStatus();
        },
        getPageSizeInfo(position) {
            // 设置参数
            const pageSize = 10;
            const pageNum = Math.ceil(position / pageSize);
            const currentPosition = position - pageSize * (pageNum - 1) - 1;
            return {
                page_size: pageSize,
                page_num: pageNum,
                current_position: currentPosition,
                type: 2,
            };
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
        },
        stopTouchMove() {
            //  禁止滑动。
        },
    },
    onLoad(query) {
        this.pageFrom = utils.getParam(query, 'from') || '';
        this.levelid = Number(utils.getParam(query, 'levelid')) || -1;
        this.sort = Number(utils.getParam(query, 'sort')) || 1;
        this.id = utils.getParam(query, 'id');

        this.keyword = utils.getParam(query, 'keyword') || '';

        this.disableslide = utils.getParam(query, 'disableslide') || false;

        this.fr = utils.getParam(query, 'fr') || '';

        const curPosition = Number(utils.getParam(query, 'curPosition')) || 0;
        const total = Number(utils.getParam(query, 'total')) || 1;

        // 获取detail页面的内容
        this.getData();
        // 获取前后两页面的内容。
        if (!this.disableslideCurrent) {
            this.prePageParam.initPosition = curPosition;
            this.prePageParam.slideCurPosition = curPosition; // 第一次进来的位置
            this.prePageParam.MaxPosition = total;

            let toPreTarget = curPosition;
            let toNewTarget = curPosition;
            if (curPosition === 1) {
                toPreTarget = total;
                toNewTarget += 1;
            } else if (curPosition === total) {
                toNewTarget = 1;
                toPreTarget -= 1;
            } else {
                toPreTarget -= 1;
                toNewTarget += 1;
            }
            const paramPre = this.getPageSizeInfo(toPreTarget);
            const paramNext = this.getPageSizeInfo(toNewTarget);
            this.getPageMoreDate(paramPre).then((res) => {
                this.pageDataOne = res;
            });
            this.getPageMoreDate(paramNext).then((res) => {
                this.pageDataThree = res;
            });
            uni.getStorage({
                key: 'hasPromtSlide',
                complete(res) {
                    if (!res.data) {
                        uni.setStorage({
                            key: 'hasPromtSlide',
                            data: 'lll',
                        });
                        uni.showToast({
                            title: '上下滑动可以切换喔～',
                            duration: 3000,
                            position: 'top',
                            mask: true,
                            icon: 'none',
                        });
                    }
                },
            });
        }
        const myQuery = query;
        delete myQuery.id;
        delete myQuery.curPosition;
        const myQuery2 = JSON.stringify(myQuery);
        const queryStra = myQuery2.replace(/:/g, '=');
        const queryStrb = queryStra.replace(/"/g, '');

        const queryStrc = queryStrb.replace(/,/g, '&');
        const queryStrd = queryStrc.match(/\{([^)]*)\}/)[1];
        this.queryUrl = queryStrd;

        // hack for html5 video size notwoking
        // #ifdef H5
        window.removeEventListener(
            'orientationchange',
            this.html5VideoAutoAdjust,
        );
        window.addEventListener('orientationchange', this.html5VideoAutoAdjust);
        // #endif
    },
    onHide() {
        // this.isPaused = true;
    },
    onShow() {},
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            imageUrl: `${this.pageData.video_img_url}?x-oss-process=image/resize,m_fill,w_250,h_150`,
            path: `/pages/work/detail/detail?id=${this.id}`,
        };
    },
};
</script>

<style lang="less">
.page-work-detail {
    background: #000;
    height: 100vh;
    #poster {
        // position: absolute;
        // left:-999upx;
    }
    .h5-full-screen-title {
        position: fixed;
        width: 100%;
        z-index: 10000;
        color: #fff;
        padding-top: 20upx;
        padding-left: 20upx;
        box-sizing: border-box;
        top: 0;
    }
    .out-swiper {
        width: 100%;
        height: 100vh;
        .cur-swiper {
            // background: red;
        }
        .pre-swiper {
            // background: yellow;
        }
        .next-swiper {
            // background: green;
        }
    }
    .activerulebox {
        position: fixed;
        background-color: rgba(0, 0, 0, 0.8);
        width: 100%;
        height: 100%;
        z-index: 999;
        .saveImg {
            position: absolute;
            width: 520upx;
            height: 730upx;
            left: 115upx;
            top: 168upx;
        }
        .saveBtn {
            position: absolute;
            width: 520upx;
            height: 96upx;
            left: 115upx;
            top: 938upx;

            // width:570px;
            // height:110px;
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
        }
        .close {
            position: absolute;
            width: 54upx;
            height: 54upx;
            left: 348upx;
            top: 1074upx;
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
            height: 324upx;
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
            width: 56upx;
            height: 56upx;
            left: 347upx;
            top: 260upx;
            color: #333;
            font-size: 28upx;
        }
    }

    /deep/ .uni-video-container {
        .uni-video-cover-duration {
            display: none;
        }
    }
}
</style>
