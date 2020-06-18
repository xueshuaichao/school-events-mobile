<template>
    <view>
        <canvas
            v-if="isH5"
            class="canvas pro"
            style="width: 570px; height: 820px;"
            canvas-id="firstCanvas"
        />
        <view
            v-if="showPosterMask"
            class="poster-img-mask"
        >
            <view class="poster-img-mask-box">
                <view
                    v-if="canvasImg"
                    class="canvas-img"
                >
                    <image
                        class="image"
                        :src="canvasImg"
                    />
                </view>
                <template v-if="isH5">
                    <view class="brand-btn btn">
                        长按图片保存到本地
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
                <image
                    class="close"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_close.png"
                    @click="togglePoster(false)"
                />
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            imgAuthBtn: false,
            showPosterMask: false,
            canvasImg: '',
            posterCommonConfig: {
                pixelRatio: 2,
                width: 569,
                height: 820,
                debug: false,
                texts: [
                    {
                        text: '',
                        height: 75,
                        textAlign: 'center',
                        y: 565,
                        x: 182,
                        fontSize: '30',
                        color: '#fff',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '',
                        width: 562,
                        height: 60,
                        textAlign: 'center',
                        y: 652,
                        x: 285,
                        fontSize: '24',
                        color: '#FFC953',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        zIndex: 100,
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster.jpg?x-oss-process=image/format,jpg/interlace,1/quality,Q_70/resize,m_pad,w_570,h_820',
                        width: 570,
                        height: 820,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 370,
                        height: 500,
                        y: 169,
                        x: 99,
                        borderRadius: 55,
                    },
                    {
                        url: '',
                        width: 528,
                        height: 145,
                        y: 527,
                        x: 21,
                    },
                    {
                        url: '',
                        width: 122,
                        height: 122,
                        y: 678,
                        x: 428,
                        borderRadius: 122,
                    },
                ],
            },
        };
    },
    created() {
        this.ctx = uni.createCanvasContext('firstCanvas');
        if (!this.isH5) {
            this.getAuthStatus();
        }
    },
    methods: {
        createPoster(data) {
            this.posterCommonConfig.images[1].url = data.detail.image;
            this.posterCommonConfig.images[2].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster_name.png';
            this.posterCommonConfig.images[3].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster_name.png';
            this.posterCommonConfig.texts[0].text = `我是${data.detail.name}`;
            this.posterCommonConfig.texts[1].text = `${data.detail.slogan}`;
            this.$emit('getPosterConfig', this.posterCommonConfig);
        },
        h5DrawImage(config) {
            // h5 我的海报
            const wxGetImageInfo = this.promisify(uni.getImageInfo);
            const imageInfoArr = [];
            config.images.forEach((item) => {
                imageInfoArr.push(
                    wxGetImageInfo({
                        src: item.url, // 背景图片
                    }),
                );
            });
            Promise.all(imageInfoArr).then((res) => {
                this.ctx = uni.createCanvasContext('firstCanvas');
                console.log(res);
                res.forEach((item, index) => {
                    this.ctx.save();
                    if (config.images[index].borderRadius) {
                        this.drawRadiusRect(
                            config.images[index].x,
                            config.images[index].y,
                            config.images[index].width,
                            config.images[index].height,
                            config.images[index].borderRadius,
                        );
                        this.ctx.strokeStyle = 'rgba(255,255,255,0)';
                        this.ctx.stroke();
                        this.ctx.clip();
                        this.ctx.drawImage(
                            item.path,
                            config.images[index].x,
                            config.images[index].y,
                            config.images[index].width,
                            config.images[index].height,
                        );
                    } else {
                        this.ctx.drawImage(
                            item.path,
                            config.images[index].x,
                            config.images[index].y,
                            config.images[index].width,
                            config.images[index].height,
                        );
                        console.log(index, 'xxxxxx', 222);
                    }
                    this.ctx.restore();
                });
                const { texts } = config;
                texts.forEach((item) => {
                    this.drawText(item);
                });
                this.ctx.draw();
                setTimeout(() => {
                    this.saveCanvas();
                }, 200);
            });
        },
        drawText(params) {
            const {
                x, y, baseLine, text,
            } = params;
            if (Object.prototype.toString.call(text) === '[object Array]') {
                const preText = { x, y, baseLine };
                text.forEach((item) => {
                    preText.x += item.marginLeft || 0;
                    const textWidth = this.drawSingleText(
                        Object.assign(item, {
                            ...preText,
                        }),
                    );
                    preText.x += textWidth + (item.marginRight || 0); // 下一段字的x轴为上一段字x + 上一段字宽度
                });
            } else {
                this.drawSingleText(params);
            }
        },
        drawSingleText({
            x,
            y,
            fontSize,
            color,
            baseLine,
            textAlign = 'left',
            text,
            opacity = 1,
            textDecoration = 'none',
            width,
            lineNum = 1,
            lineHeight = 0,
            fontWeight = 'normal',
            fontStyle = 'normal',
            fontFamily = 'sans-serif',
        }) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
            this.ctx.setGlobalAlpha(opacity);
            this.ctx.setFillStyle(color);
            this.ctx.setTextBaseline(baseLine);
            this.ctx.setTextAlign(textAlign);
            let textWidth = this.ctx.measureText(text).width;
            const textArr = [];
            if (textWidth > width) {
                // 文本宽度 大于 渲染宽度
                let fillText = '';
                let line = 1;
                for (let i = 0; i <= text.length - 1; i += 1) {
                    // 将文字转为数组，一行文字一个元素
                    fillText += text[i];
                    if (this.ctx.measureText(fillText).width >= width) {
                        if (line === lineNum) {
                            if (i !== text.length - 1) {
                                fillText = `${fillText.substring(
                                    0,
                                    fillText.length - 1,
                                )}...`;
                            }
                        }
                        if (line <= lineNum) {
                            textArr.push(fillText);
                        }
                        fillText = '';
                        line += 1;
                    } else if (line <= lineNum) {
                        if (i === text.length - 1) {
                            textArr.push(fillText);
                        }
                    }
                }
                textWidth = width;
            } else {
                textArr.push(text);
            }

            textArr.forEach((item, index) => {
                this.ctx.fillText(
                    item,
                    x,
                    y + (lineHeight || fontSize) * index,
                );
            });

            this.ctx.restore();

            // textDecoration
            if (textDecoration !== 'none') {
                let lineY = y;
                if (textDecoration === 'line-through') {
                    // 目前只支持贯穿线
                    lineY = y;

                    // 小程序画布baseLine偏移阈值
                    const threshold = 5;

                    // 根据baseLine的不同对贯穿线的Y坐标做相应调整
                    switch (baseLine) {
                        case 'top':
                            lineY += fontSize / 2 + threshold;
                            break;
                        case 'middle':
                            break;
                        case 'bottom':
                            lineY -= fontSize / 2 + threshold;
                            break;
                        default:
                            lineY -= fontSize / 2 - threshold;
                            break;
                    }
                }
                this.ctx.save();
                this.ctx.moveTo(x, lineY);
                this.ctx.lineTo(x + textWidth, lineY);
                this.ctx.setStrokeStyle(color);
                this.ctx.stroke();
                this.ctx.restore();
            }

            return textWidth;
        },
        getTextWidth(text) {
            let texts = [];
            if (Object.prototype.toString.call(text) === '[object Object]') {
                texts.push(text);
            } else {
                texts = text;
            }
            let width = 0;
            texts.forEach(
                ({
                    fontSize, text, marginLeft = 0, marginRight = 0,
                }) => {
                    this.ctx.setFontSize(fontSize);
                    width
                        += this.ctx.measureText(text).width
                        + marginLeft
                        + marginRight;
                },
            );

            return this.toRpx(width);
        },
        drawRadiusRect(x, y, w, h, r) {
            const br = r / 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x + br, y); // 移动到左上角的点
            this.ctx.lineTo(x + w - br, y);
            this.ctx.arc(
                x + w - br,
                y + br,
                br,
                2 * Math.PI * (3 / 4),
                2 * Math.PI * (4 / 4),
            );
            this.ctx.lineTo(x + w, y + h - br);
            this.ctx.arc(x + w - br, y + h - br, br, 0, 2 * Math.PI * (1 / 4));
            this.ctx.lineTo(x + br, y + h);
            this.ctx.arc(
                x + br,
                y + h - br,
                br,
                2 * Math.PI * (1 / 4),
                2 * Math.PI * (2 / 4),
            );
            this.ctx.lineTo(x, y + br);
            this.ctx.arc(
                x + br,
                y + br,
                br,
                2 * Math.PI * (2 / 4),
                2 * Math.PI * (3 / 4),
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
                width: this.posterCommonConfig.width, // 截取的画布的宽
                height: this.posterCommonConfig.height, // 截取的画布的高
                fileType: 'png', // 保存成的文件类型
                quality: 1, // 图片质量
                canvasId: 'firstCanvas', // 画布ID
                success(res) {
                    // that.onShowPosterMask();
                    that.canvasImg = res.tempFilePath;
                    that.showPosterMask = true;
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
        onPosterSuccess(canvasImg) {
            this.canvasImg = canvasImg;
            this.showPosterMask = true;
            this.lock = false;
            this.togglePoster(true);
            uni.hideLoading();
        },
        onPosterFail() {
            console.log('error');
            uni.hideLoading();
            this.lock = false;
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
    }
    .close {
        display: block;
        margin: 37upx auto 0;
        width: 52upx;
        height: 52upx;
    }
}
</style>
