<template>
    <view>
        <canvas
            class="canvas pro"
            :style="{ width: `${width}px`, height: `${height}px` }"
            canvas-id="firstCanvas"
        />
    </view>
</template>
<script>
export default {
    props: {
        width: {
            type: Number,
            default: 570,
        },
        height: {
            type: Number,
            default: 818,
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            imgAuthBtn: false,
            showPosterMask: false,
            ratio: 1,
        };
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                that.ratio = res.pixelRatio;
            },
        });
    },
    mounted() {
        if (this.isH5) {
            this.ctx = uni.createCanvasContext('firstCanvas');
        } else {
            // eslint-disable-next-line no-undef
            this.ctx = wx.createCanvasContext('firstCanvas', this);
        }
    },
    methods: {
        createPoster(config) {
            this.posterCommonConfig = config;
            this.h5DrawImage(config);
        },
        h5DrawImage(config) {
            // h5 我的海报
            const wxGetImageInfo = this.promisify(uni.downloadFile);
            const imageInfoArr = [];
            config.images.forEach((item) => {
                imageInfoArr.push(
                    wxGetImageInfo({
                        url: item.url, // 背景图片
                    }),
                );
            });
            Promise.all(imageInfoArr).then((res) => {
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
                            item.tempFilePath,
                            config.images[index].x,
                            config.images[index].y,
                            config.images[index].width,
                            config.images[index].height,
                        );
                    } else {
                        this.ctx.drawImage(
                            item.tempFilePath,
                            config.images[index].x,
                            config.images[index].y,
                            config.images[index].width,
                            config.images[index].height,
                        );
                    }
                    this.ctx.restore();
                });
                const { texts, radiusRects } = config;
                if (radiusRects && radiusRects.length > 0) {
                    radiusRects.forEach((item) => {
                        this.ctx.save();
                        this.drawRadiusRect(
                            item.x,
                            item.y,
                            item.w,
                            item.h,
                            item.br,
                        );
                        this.ctx.fillStyle = item.color;
                        this.ctx.strokeStyle = item.color2;
                        this.ctx.fill();
                        this.ctx.stroke();
                        this.ctx.restore();
                    });
                }
                if (texts && texts.length > 0) {
                    texts.forEach((item) => {
                        this.drawText(item);
                    });
                }
                this.ctx.draw(false, () => {
                    setTimeout(() => {
                        this.saveCanvas(config);
                    }, 500);
                });
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
        saveCanvas({ width, height }) {
            const that = this;
            uni.canvasToTempFilePath(
                {
                    // 把画布转化成临时文件
                    x: 0,
                    y: 0,
                    width, // 截取的画布的宽
                    height, // 截取的画布的高
                    destWidth: width, // 保存图片的宽
                    destHeight: height, // 保存图片的height
                    fileType: 'png', // 保存成的文件类型
                    quality: 1, // 图片质量
                    canvasId: 'firstCanvas', // 画布ID
                    success(res) {
                        uni.hideLoading();
                        that.$emit('success', res.tempFilePath);
                    },
                    fail(err) {
                        uni.hideLoading();
                        console.log(JSON.stringify(err));
                        that.$emit('fail', err);
                    },
                },
                this,
            );
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
</style>
