<template>
    <view
        v-if="!isLoading"
        class="page-work-detail"
    >
        <view
            v-if="prompt"
            class="activerulebox"
            :class="[
                { read: activity_id === 6 },
                { chunjie: activity_id === 3 || activity_id === 4 },
                { wuyi: activity_id === 8 },
                { openGame: from === 'openGame' }
            ]"
        >
            <image
                class="saveImg"
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
        <detail
            :page-data="pageData"
            :like-status="likeStatus"
            :activity-id="activity_id"
            :is-from-share="isFromShare"
            :from="from"
            @doAction="doAction"
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
// 上下滑动的功能的拆解
// 使用Swiper组件，把页面的主要内容，当作独立的部分，迁移到../../../widgets/work/detail.vue。
// 页面滑动的时候，确定下当前显示的数据，用来做转发，二维码的数据

// 页面进入时候，分别获取前一页面，后一页面的数据，显示在swiper-item里面。
// 根据页面翻动的方向, 获取相对的第二页面的数据，并修改视图。

export default {
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
            posterConfig: detailConf[0].posterConfig,

            prompt: false,
            canvasImg: '',
            // canvasImg2: '',
            showTicketMask: false,

            // pageFrom: '',
            curDetailConf: detailConf[0],
            isActvitity: true,
            activity_id: 0,
            imgAuthBtn: false,
            isFromShare: '',
            from: '',
        };
    },
    created() {},
    methods: {
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
            // #ifdef H5
            this.showShareMask = true;
            // #endif

            if (
                this.pageData.resource_scope === 3
                && this.from !== 'openGame'
            ) {
                this.posterConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/aitiaozhan-poster2.png';
            }

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
            const url = currentPage.route || 'pages/work/detail/detail';
            const scene = `id=${this.id}&aid=${this.activity_id}&y=1` || 'id=325';
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

                        // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                        // console.log('开始授权');
                        // eslint-disable-next-line no-undef
                        // wx.openSetting({
                        //     success(settingdata) {
                        //         console.log('settingdata', settingdata);
                        //         if (
                        //             settingdata.authSetting[
                        //                 'scope.writePhotosAlbum'
                        //             ]
                        //         ) {
                        //             // eslint-disable-next-line no-undef
                        //             wx.showModal({
                        //                 title: '提示',
                        //                 content:
                        //                     '获取权限成功,再次点击图片即可保存',
                        //                 showCancel: false,
                        //             });
                        //         } else {
                        //             // eslint-disable-next-line no-undef
                        //             wx.showModal({
                        //                 title: '提示',
                        //                 content:
                        //                     '获取权限失败，将无法保存到相册哦~',
                        //                 showCancel: false,
                        //             });
                        //         }
                        //     },
                        //     fail(failData) {
                        //         console.log('failData', failData);
                        //     },
                        //     complete(finishData) {
                        //         console.log('finishData', finishData);
                        //     },
                        // });
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
            if (this.isActvitity) {
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
                this.curDetailConf = detailConf[8];
                this.posterConfig = {
                    ...this.posterConfig,
                    ...detailConf[8].posterConfig,
                };
            }
            console.log(
                this.posterConfig,
                this.curDetailConf.posterConfig,
                '------this.posterConfig',
            );
            this.posterConfig.images[1].url = `${res.video_img_url}?x-oss-process=image/resize,m_pad,w_460,h_300`;
            if (this.from === 'openGame') {
                this.posterConfig.texts[0].text[0].text = `${
                    res.resource_name
                }${
                    res.achievement
                        ? `|${res.achievement}${res.achievement_unit}lallalallallalalalalalalallalallalallalalalalla`
                        : ''
                }`;
            } else {
                this.posterConfig.texts[0].text[0].text = res.resource_name;
            }
            this.pageData.video_img_url = res.video_img_url;

            this.initShare(res);

            if (res.resource_type === 2) {
                // 说明是图片，计算播放量
                api.post('/api/works/playcount', {
                    id: res.id,
                });
            }
        },
        toggleLike() {
            let url = '/api/common/like';
            let param = {
                object_id: this.id,
                object_type: 1,
                type: 1,
            };
            if (this.isActvitity) {
                url = '/api/activity/vote';
                param = {
                    id: this.id,
                };
            }
            api.isLogin({
                fr: this.fr,
            }).then(
                () => api.get(url, param).then(
                    () => {
                        this.likeStatus = 1;
                        this.getData('reget');
                    },
                    (err) => {
                        if (this.isActvitity) {
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
            if (this.isActvitity) {
                url = '/api/activity/getuserthumb';
                param = {
                    id: this.id,
                };
            }

            api.get(url, param).then((res) => {
                this.likeStatus = res.status ? 1 : 0;
            });
        },
        html5VideoAutoAdjust() {
            document.querySelector('.uni-video-type-fullscreen').style = '';
        },
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
            share({
                title,
                desc,
                thumbnail: res.video_img_url,
            });
            uni.setNavigationBarTitle({
                title: res.resource_name || '',
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
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    if (this.isActvitity) {
                        this.joinActivity();
                    } else if (this.from === 'openGame') {
                        uni.navigateTo({
                            url: '/pages/openGame/zhibo-list',
                        });
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
                    if (this.activity_id === 6) {
                        uni.navigateTo({
                            url: '/pages/read/upload/modify',
                        });
                    }
                    if (this.activity_id === 8) {
                        uni.navigateTo({
                            url:
                                '/pages/activity-pages/upload/modify?activity_id=8',
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
                    // uni.navigateTo({
                    //     url: '/pages/upload/default/upload',
                    // });
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
        },
    },
    onLoad(query) {
        // this.pageFrom = utils.getParam(query, 'from') || '';
        // this.levelid = Number(utils.getParam(query, 'levelid')) || -1;
        this.id = utils.getParam(query, 'id');
        this.fr = utils.getParam(query, 'fr') || '';
        this.isFromShare = utils.getParam(query, 'isFromShare') || '';
        if (!this.isFromShare) {
            this.isFromShare = utils.getParam(query, 'y') || '';
        }

        this.activity_id = Number(utils.getParam(query, 'activity_id')) || 0;
        if (!this.activity_id) {
            this.activity_id = Number(utils.getParam(query, 'aid')) || 0;
        }
        this.from = utils.getParam(query, 'from') || '';
        console.log(this.from, 'thsi.from');

        console.log(
            this.activity_id,
            this.isFromShare,
            '-----this.activity_id---',
        );
        // activity_id,  没有7..
        if (!this.activity_id) {
            this.isActvitity = false;
        } else {
            // wyhd 五一活动
            const arr = ['xchd', 'dsxnh', 'dsxnh', 'dshd', '', 'wyhd'];
            const type = arr[this.activity_id - 3];
            this.fr = logger.getFr(type, {});
        }

        // 获取detail页面的内容
        this.getData();

        // #ifndef H5
        this.poster = this.selectComponent('#poster');
        this.getAuthStatus();
        // #endif

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
    onShow() {
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
            path: `/pages/work/detail/detail?id=${this.id}&activity_id=${this.activity_id}&isFromShare=1`,
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
    .out-swiper {
        width: 100%;
        height: 100vh;
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
            background: rgba(0, 132, 255, 1);
            left: 348upx;
            top: 1074upx;
            border-radius: 50%;
            display: inline-block;
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
            .saveBtn {
                background: url("../../../static/images/zhibo/openGame-btn.png");
                background-size: 100% 100%;
                border-radius: 0;
                color: #333;
                line-height: 80rpx;
            }
            .close {
                background: transparent;
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
                border-radius: 55px;
                color: #fff;
            }
            .close {
                background: #e76a31;
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
}
</style>
