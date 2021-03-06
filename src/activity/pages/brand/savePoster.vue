/* eslint-disable no-undef */
<template>
    <view :class="upperClassName">
        <view class="poster-img-mask">
            <view class="poster-img-mask-box">
                <view
                    v-if="image"
                    id="canvas-img"
                    class="canvas-img"
                >
                    <image
                        class="image"
                        :src="image"
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
                            @click="handleSave"
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
                    class="close"
                    @click="togglePoster(false)"
                />
            </view>
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';
import utils from '../../../common/utils';

export default {
    props: {
        image: {
            type: String,
            default: '',
        },
        upperClassName: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            isWechat: false,
            // #endif
            imgAuthBtn: false,
            showPosterMask: false,
            canvasImg: '',
        };
    },
    created() {
        if (!this.isH5) {
            this.getAuthStatus();
        }
    },
    mounted() {
        if (this.isH5) {
            const ua = window.navigator.userAgent.toLowerCase();
            this.isWechat = ua.indexOf('micromessenger') !== -1;
        }
    },
    methods: {
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
                        that.handleSave();
                    },
                });
            }
        },
        handleSave() {
            uni.showLoading({ mask: true, title: '保存中' });
            const that = this;
            // eslint-disable-next-line no-undef
            wx.getImageInfo({
                src: this.isH5 ? that.image : utils.mapHttpToHttps(that.image),
                success(res) {
                    // eslint-disable-next-line no-undef
                    wx.saveImageToPhotosAlbum({
                        filePath: res.path,
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
            });
        },
        saveImage() {
            uni.showLoading();
            api.saveImage('canvas-img', this.image).then(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '保存成功',
                });
            });
        },
        togglePoster(status) {
            this.$emit('togglePoster', status);
        },
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
.poster-img-mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 93upx 0;
    box-sizing: border-box;
    background-color: rgba(0, 0, 0, 0.79);
    text-align: center;
    z-index: 50;
    .poster-img-mask-box {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .canvas-img {
        width: 570upx;
        height: 820upx;
        margin: 0 auto 30upx;
        .image {
            width: 100%;
            height: 100%;
            -webkit-touch-callout: default;
        }
    }
    .btn {
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
    .close {
        display: block;
        margin: 37upx auto 0;
        width: 52upx;
        height: 52upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_close.png);
        background-size: 100%;
    }
}
.clocked-page {
    .poster-img-mask {
        .canvas-img {
            width: 630upx;
            height: 886upx;
        }
    }
    .btn {
        background: linear-gradient(
            180deg,
            rgba(255, 162, 132, 1) 0%,
            rgba(255, 104, 76, 1) 100%
        );
    }
    // .close {
    //     background: linear-gradient(180deg,rgba(255,162,132,1) 0%,rgba(255,104,76,1) 100%);
    //     box-shadow:0 4upx 6upx 0 rgba(0,0,0,0.4);
    // }
}
.poetry {
    .poster-img-mask {
        .canvas-img {
            width: 750upx;
            height: 1020upx;
        }
    }
    .btn {
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/show-bg.png);
        width: 216upx;
        height: 84upx;
        background-size: 100%;
        line-height: 84upx;
        font-size: 28upx;
    }
    .close {
        position: absolute;
        top: 0;
        right: 40upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-close.png);
        background-size: 100%;
        margin-top: 0;
    }
}
</style>
