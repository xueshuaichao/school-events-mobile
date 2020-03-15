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
                src="/static/images/chunjie/poster-close.png"
                @click="handleClose"
            />
        </view>

        <!-- 小程序分享 -->
        <template v-if="!isH5">
            <view
                v-if="showTicketMask"
                class="ticket-mask"
            >
                <poster
                    id="poster"
                    :config="posterConfig"
                    @success="onPosterSuccess"
                    @fail="onPosterFail"
                >
                    <image
                        class="ticket-poster"
                        src="/static/images/work/poster.png"
                    />
                </poster>
                <button
                    open-type="share"
                    class="ticket-friend"
                />
                <image
                    class="ticket-close"
                    src="/static/images/work/icon-del.png"
                    @click="showTicketMask = false"
                />
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

        <view
            v-if="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view>
        <!--换成组件啦-->
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
                    :page-data="pageDataOne"
                    :like-status="likeStatus"
                    :page-from="pageFrom"
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
                        :page-from="pageFrom"
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
                        :page-data="pageDataTwo"
                        :like-status="likeStatus"
                        :page-from="pageFrom"
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
                    :page-data="pageDataThree"
                    :like-status="likeStatus"
                    :page-from="pageFrom"
                    @doAction="doAction"
                />
            </swiper-item>
        </swiper>
        <view
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
        </view>

        <!-- v-if="!isH5" -->
        <!-- <image
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/join.png"
            class="join-game"
            @click="joinGame"
        /> -->
    </view>
</template>

<script>
import api from '../../../common/api';
import utils from '../../../common/utils';
import share from '../../../common/share';
import detail from '../../../widgets/work/chunjiehaodetail.vue';

export default {
    components: {
        detail,
    },
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
    data() {
        return {
            detailId: '',
            id: '',
            // video: 'https://node.imgio.in/demo/birds.m3u8',
            video:
                'https://dcloud-img.oss-cn-hangzhou.aliyuncs.com/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20181126.mp4',
            isLoading: true,
            pageData: {
                video_img_url: '',
            },
            likeStatus: 0,
            isPlayed: false,
            isPaused: false,
            isVideoWaiting: false,
            showShareMask: false,

            // #ifdef H5
            isH5: true,
            // #endif

            isFullScreen: false,

            shareDesc: '',
            fr: '',
            posterConfig: {
                pixelRatio: 3,
                width: 570,
                height: 820,
                debug: false,
                texts: [
                    {
                        x: 60,
                        y: 583,
                        text: [
                            {
                                text: '',
                                fontSize: 29,
                                color: '#FF2E3F',
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
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/poster01.png',
                        width: 570,
                        height: 820,
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
                        y: 645,
                        x: 348,
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
            sort: 1,
            actCat: 0,
            actSort: '',
            search: '',
            disableslide: false,
            filterUrl: {},
            queryUrl: '',
        };
    },
    methods: {
        handleCanvass() {
            // #ifdef H5
            this.showShareMask = true;
            // #endif

            // #ifndef H5
            this.handleTicketMask();
            // #endif
        },
        // 生成二维码，并弹出mask
        handleTicketMask() {
            uni.showLoading({
                mask: true,
            });
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages(); // 获取加载的页面
            const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
            const url = currentPage.route || 'pages/chunjiehao/detail/detail';
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
            const FILE_BASE_NAME = 'tmp_base64src'; // 自定义文件名
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
            console.log(detail);
            this.canvasImg = detail;
            this.showTicketMask = false;
            this.prompt = true;
        },
        handleSave() {
            console.log(this.canvasImg, '触发图片保存');
            const that = this;
            // 图片保存到本地
            // eslint-disable-next-line no-undef
            wx.saveImageToPhotosAlbum({
                filePath: this.canvasImg,
                success() {
                    console.log('保存成功');
                    that.prompt = false;
                    that.showTicketMask = true;
                    uni.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000,
                    });
                },
                fail(err) {
                    console.log('保存图片失败');
                    console.log(err.errMsg);
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
            console.log(e, 'fail');
        },
        getData() {
            api.get('/api/activity/detail', {
                id: this.id,
            }).then(
                (res) => {
                    this.isLoading = false;
                    console.log(res);
                    this.pageData = res;
                    this.pageDataTwo = res;
                    this.posterConfig.images[1].url = res.video_img_url;
                    this.posterConfig.texts[0].text[0].text = `${res.resource_name}`;
                    this.initShare();
                    uni.setNavigationBarTitle({
                        title: res.resource_name,
                    });
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
        toggleLike() {
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    // const isLiked = this.likeStatus === 1;
                    api.get('/api/activity/vote', {
                        id: this.id,
                        // object_type: 1,
                        // 1-点赞 0 取消点赞
                        // type: isLiked ? 0 : 1,
                    }).then(
                        () => {
                            // console.log(res);
                            this.likeStatus = 1;
                            this.pageData.ticket += 1;
                            // this.likeStatus = isLiked ? 0 : 1;
                            // this.getData();
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
            api.get('/api/activity/getuserthumb', {
                id: this.id,
            }).then((res) => {
                this.likeStatus = res.status === true ? 1 : 0;
            });
        },
        onPlay() {
            if (!this.isPlayed) {
                this.pageData.play_count = this.pageData.play_count + 1;
                api.get('/api/works/playcount', {
                    id: this.id,
                });
            }
            this.isVideoWaiting = false;
            this.isPlayed = true;
        },
        onWaiting() {
            this.isVideoWaiting = true;
            this.timeupdateCounter = 0;
        },
        onTimeupdate() {
            if (this.timeupdateCounter > 1) {
                this.isVideoWaiting = false;
            } else {
                this.timeupdateCounter += 1;
            }
        },
        onFullScreenChange(e) {
            const isFullScreenMode = e.detail.fullScreen;
            this.isFullScreen = isFullScreenMode;
        },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
        initShare() {
            // const titleList = [
            //     '鼠年大吉，快来看我的拜年才艺秀！',
            //     '才艺拜年乐趣多，我来表演你来赞！',
            //     '我来给你拜新年，表演才艺送祝福！',
            //     '鼠年春节我精彩，才艺拜年望喜爱！',
            // ];
            const titleList = [
                '一幅幅春节影像作品，是最想留下的幸福瞬间！我的春节作品，正在等你来投票哦！',
                '记录新年，赢大奖！小伙伴们快来帮我投票吧～～',
                '快来看我记录的春节快乐瞬间！请为我投票，晒年味，赢好礼！',
                '快来看我家的新年有什么不一样！快来为我投票吧！晒年俗，赢大奖！',
                '家家“年味”各不同，快来围观我家的欢乐新年吧～别忘了投票哦！',
                '嗨～我在参加“记录新年赢大奖”活动，动动手指为我投票吧！',
            ];
            const title = titleList[Math.floor(Math.random() * titleList.length)];
            const desc = `${this.pageData.resource_name}-${this.pageData.create_name}`;

            this.shareDesc = title;

            share({
                title,
                desc,
                thumbnail: this.pageData.video_img_url,
            });
        },
        joinGame() {
            api.isLogin({
                fr: this.fr,
            }).then(() => {
                // 1未开始，2进行中，3已结束
                api.post('/api/activity/getactivitystatus', {
                    activity_id: 4,
                }).then((res) => {
                    const { status } = res;
                    if (status === 2) {
                        uni.navigateTo({
                            url: '/pages/chunjiehao/upload/upload',
                        });
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
            });
        },
        goHome() {
            uni.reLaunch({
                url: '/pages/chunjiehao/index',
            });
        },
        togglePlayStatus() {
            this.$refs.video.play();
            this.isPaused = false;
        },
        setGetDetail(res) {
            this.posterConfig.images[1].url = res.video_img_url;
            this.posterConfig.texts[0].text[0].text = res.resource_name;
            this.initShare();
            uni.setNavigationBarTitle({
                title: res.resource_name,
            });
            if (res.resource_type === 2) {
                // 说明是图片，计算播放量
                this.pageData.play_count = this.pageData.play_count + 1;
                api.get('/api/works/playcount', {
                    id: this.id,
                });
            }
        },
        getPageMoreDate(paramData) {
            const params = {
                ...paramData,
                ...this.filterUrl,
                activity_id: 4,
                list_type: 2,
            };
            return api.post('/api/activity/resourcelist', params);
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
            this.detailId = curPageData.id;
            this.id = curPageData.resource_id;
            this.pageData = curPageData;
            this.setGetDetail(curPageData);
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
            if (action === 'goHome') {
                this.goHome();
            }
        },
        stopTouchMove() {
            //  禁止滑动。
        },
    },
    onLoad(query) {
        this.pageFrom = utils.getParam(query, 'from') || '';
        this.sort = Number(utils.getParam(query, 'sort')) || 1;
        this.id = utils.getParam(query, 'id');
        this.actCat = utils.getParam(query, 'actCat') || 0;
        this.disableslide = utils.getParam(query, 'disableslide') || false;

        this.actSort = utils.getParam(query, 'actSort') || '';
        this.fr = utils.getParam(query, 'fr') || '';
        this.search = utils.getParam(query, 'kw') || '';
        if (this.search) {
            this.filterUrl.search = this.search;
        }
        if (this.actSort) {
            this.filterUrl.sort = this.actSort;
        }
        if (this.actCat) {
            this.filterUrl.activity_cat = this.actCat;
        }

        const curPosition = Number(utils.getParam(query, 'curPosition')) || 0;
        const total = Number(utils.getParam(query, 'total')) || 1;

        // 获取detail页面的内容
        this.getData();
        // 获取前后两页面的内容。
        if (!this.disableslide) {
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
            imageUrl: this.pageData.video_img_url,
            path: `/pages/chunjiehao/detail/detail?id=${this.id}`,
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
                0deg,
                rgba(255, 149, 71, 1),
                rgba(255, 222, 152, 1)
            );
            border-radius: 55upx;
            color: #ff2e3f;
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

    .mp-weixin-full-screen-title {
        position: absolute;
        top: 46upx;
        width: 100%;
        z-index: 10000;
        color: #fff;
        display: flex;
        box-sizing: border-box;
        padding: 0 30upx 0 100upx;

        .video-title {
            flex: 1;
        }
    }

    .cover-title {
        flex: 1;
    }

    .mini-btn {
        background: transparent;
        padding: 0px;
        width: 37rpx;
        height: 37rpx;
        line-height: 37rpx;
        border-radius: 0;
        display: inline-block;
        margin-right: 48upx;
    }

    .mini-icon {
        width: 37rpx;
        height: 37rpx;
        display: inline-block;
    }

    .cover-like {
        width: 37upx;
        height: 37upx;
        display: inline-block;
    }

    .video-wrap {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .video {
        max-width: 100%;
        max-height: 100%;
        width: 100%;
        height: 100%;
    }

    .content {
        position: absolute;
        bottom: 0;
        width: 480rpx;
        padding: 30upx;
        color: #fff;
        pointer-events: none;
        .avatar {
            display: inline-block;
            width: 24rpx;
            height: 26rpx;
            margin-right: 16upx;
        }

        .author-info {
            .author-name {
                color: #fff;
                font-size: 28upx;
                position: relative;
                top: -2rpx;
            }
            margin-bottom: 10rpx;
        }

        .author-from {
            font-size: 24rpx;
            margin-bottom: 10rpx;
        }

        .work-name {
            font-size: 28rpx;
            color: #fff;
            margin-bottom: 13rpx;
            font-weight: 600;
            position: relative;
            top: -2rpx;
        }

        .extra {
            font-size: 22upx;
            margin-bottom: 32upx;
        }

        .intro {
            font-size: 28upx;
            line-height: 44upx;
            margin-bottom: 30rpx;
        }

        .icon-grail {
            display: inline-block;
            width: 32upx;
            height: 32upx;
            margin-left: 32upx;
        }
    }

    swiper {
        width: 750rpx;
        // height: 1334rpx;
        height: 100vh;
    }

    .main-swiper {
        position: absolute;
        width: 100%;
        top: 0;

        uni-swiper {
            // height: 422upx;
            // height: 1334rpx;
            height: 100vh;

            .swiper-item {
                img {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .banner-image {
            width: 750rpx;
            // height: 1334rpx;
            height: 100vh;
        }
    }

    .join-game {
        width: 134rpx;
        height: 140rpx;
        position: fixed;
        right: 30rpx;
        bottom: 20rpx;
        z-index: 100;
    }

    .from {
        font-size: 24rpx;

        .recommend {
            width: 260rpx;
            display: inline-block;
        }

        .teacher {
            display: inline-block;
            width: 220rpx;
        }
    }

    .fixed-panel {
        position: fixed;
        width: 146rpx;
        right: 27rpx;
        bottom: 160rpx;
        color: #ffde98;
        font-size: 24rpx;
        text-align: center;
        z-index: 100;
    }

    .btn {
        color: #ffde98;
        font-size: 24rpx;
        width: 134rpx;
        height: 56rpx;
        background: linear-gradient(
            90deg,
            rgba(255, 124, 53, 1),
            rgba(255, 31, 73, 1)
        );
        border-radius: 28rpx;
        line-height: 56rpx;
        text-align: center;
        margin-bottom: 30rpx;
        padding: 0;
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

        .ticket-friend {
            width: 192rpx;
            height: 215rpx;
            position: absolute;
            left: 160rpx;
            top: 784rpx;
            background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/sendToFriend.png");
            background-size: 100% 100%;
        }

        .ticket-poster {
            width: 192rpx;
            height: 215rpx;
            position: absolute;
            left: 400rpx;
            top: 784rpx;
        }
        .ticket-close {
            position: absolute;
            width: 56upx;
            height: 56upx;
            left: 347upx;
            top: 1037upx;
        }
    }

    /deep/ .uni-video-container {
        .uni-video-cover-duration {
            display: none;
        }
    }
}
</style>
