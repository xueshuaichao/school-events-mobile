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

        <view
            v-if="isFullScreen && isH5"
            class="h5-full-screen-title text-one-line"
        >
            {{ pageData.resource_name }}
        </view>
        <swiper
            class="out-swiper"
            vertical="true"
            current="1"
            :indicator-dots="false"
            circular="true"
            @change="changeOutSwiper"
        >
            <swiper-item class="pre-swiper">
                <detail
                    :page-data="pageDataOne"
                    @doAction="doAction"
                />
            </swiper-item>
            <swiper-item
                v-if="isFrom"
                class="cur-swiper"
                @touchmove.stop="stopTouchMove"
            >
                <detail
                    :page-data="pageDataTwo"
                    @doAction="doAction"
                />
            </swiper-item>
            <swiper-item
                v-else
                class="cur-swiper"
            >
                <detail
                    :page-data="pageDataTwo"
                    @doAction="doAction"
                />
            </swiper-item>
            <swiper-item class="next-swiper">
                <detail
                    :page-data="pageDataThree"
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
            // startY: 0,
            isFrom: '',
            pagaDataCenter: {},
            pageDataTwo: {},
            pageDataThree: {},
            pageDataOne: {},
            pageParam: {
                page_size: 10,
                type: 2,
                page_num: 1,
                current_position: 0,
                // cat_id: {one_level_id: 1}
            },
            prePageParam: {},
            currentSwiper: 1,
            outSwiperIncrease: true,
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
        },
        // 生成二维码，并弹出mask
        handleTicketMask() {
            uni.showLoading({
                mask: true,
            });
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages(); // 获取加载的页面
            const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
            const url = currentPage.route || 'pages/yiqing/detail/detail';
            const scene = `id=${this.id}` || 'id=325';
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
                    that.showTicketMask = true;
                    uni.showToast({
                        title: '保存成功',
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
                title: res.resource_name,
            });
            if (res.resource_type === 2) {
                // 说明是图片，计算播放量
                this.pageData.play_count = res.play_count + 1;
                api.get('/api/works/playcount', {
                    id: res.id,
                });
            }
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
            const titleList = [
                `我的作品《${res.resource_name}》，快来帮我助力吧！`,
                `我的作品《${res.resource_name}》，大家“艺”起来，为梦想加油！'`,
            ];
            const title = titleList[Math.floor(Math.random() * titleList.length)];
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
            api.isLogin().then(() => {
                // 1未开始，2进行中，3已结束
                api.post('/api/activity/getactivitystatus', {
                    activity_id: 5,
                }).then((res) => {
                    const { status } = res;
                    if (status === 2) {
                        uni.navigateTo({
                            url: '/pages/yiqing/upload/upload',
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
        togglePlayStatus() {
            // this.$refs.video.play();
            this.isPaused = false;
        },
        getPageMoreDate(paramData, cb) {
            if (this.isFrom === 'mywork') {
                this.getFromAPI('/api/user/worklist', paramData, cb);
            } else {
                this.getFromAPI('/api/works/list', paramData, cb);
            }
        },
        getFromAPI(url, paramData, cb) {
            api.get(url, paramData).then((res) => {
                if (res.id) {
                    if (cb) {
                        cb(res);
                    }
                } else if (cb) {
                    cb(false);
                }
            });
        },
        changeOutSwiper(event) {
            // 判断移动方向
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
            // 预获取数据
            let objPosition = {};
            if (this.outSwiperIncrease) {
                objPosition = this.getPageSizeInfo(
                    this.prePageParam.initCurPosition + 2,
                    10,
                );
                this.prePageParam.initCurPosition += 1;
            } else {
                objPosition = this.getPageSizeInfo(
                    this.prePageParam.initCurPosition - 2,
                    10,
                );
                this.prePageParam.initCurPosition -= 1;
            }
            this.getPageMoreDate(objPosition, (res) => {
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

            // 修改下pageData，进行页面的转发，与二维码功能
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
            this.setGetDetail(curPageData);
        },
        getPageSizeInfo(position, pageSize) {
            // 设置参数
            const pageNum = Math.ceil(position / pageSize);
            const currentPosition = position - pageSize * (pageNum - 1) - 1;
            this.pageParam.page_size = pageSize;
            this.pageParam.page_num = pageNum;
            this.pageParam.current_position = currentPosition;
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
        this.isFrom = utils.getParam(query, 'from') || '';

        this.id = utils.getParam(query, 'id');
        const curPosition = Number(utils.getParam(query, 'curPosition')) || 0;
        const pageSize = Number(utils.getParam(query, 'pageSize')) || 10;
        const pageNum = Math.ceil(curPosition / pageSize);
        const currentPosition = curPosition - pageSize * (pageNum - 1) - 1;

        this.pageParam.page_size = pageSize;
        this.pageParam.page_num = pageNum;
        this.pageParam.current_position = currentPosition;
        this.getData();
        if (!this.isFrom) {
            this.prePageParam = JSON.parse(JSON.stringify(this.pageParam));
            this.prePageParam.initCurPosition = curPosition; // 第一次进来的位置

            const a = this.getPageSizeInfo(
                this.prePageParam.initCurPosition - 1,
                10,
            );
            const b = this.getPageSizeInfo(
                this.prePageParam.initCurPosition + 1,
                10,
            );
            this.getPageMoreDate(a, (res) => {
                if (res) {
                    this.pageDataOne = res;
                }
            });
            this.getPageMoreDate(b, (res) => {
                if (res) {
                    this.pageDataThree = res;
                }
            });
        }

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
    .yellow {
        color: #ffd339;
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
