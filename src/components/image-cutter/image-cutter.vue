<template>
    <view
        v-show="url"
        class="ksp-image-cutter"
    >
        <canvas
            :style="{
                width: target.width + 'px',
                height: target.height + 'px'
            }"
            class="privew-canvas"
            canvas-id="target"
        />
        <view class="body">
            <image
                v-if="url"
                class="image"
                :style="{
                    left: image.left + 'px',
                    top: image.top + 'px',
                    width: image.width + 'px',
                    height: image.height + 'px',
                    opacity: showDom ? 1 : 0
                }"
                :src="url"
                @load="imageLoad"
            />
            <view
                v-if="mask.show"
                class="mask"
            />
            <view
                class="plank"
                @touchstart="touchStart($event, 'plank')"
                @touchmove="touchMove"
                @touchend="touchEnd"
                @touchcancel="touchCancel"
            >
                <view
                    class="frame"
                    :style="{
                        left: frame.left + 'px',
                        top: frame.top + 'px',
                        width: frame.width + 'px',
                        height: frame.height + 'px',
                        opacity: showDom ? 1 : 0
                    }"
                    @touchstart="touchStart($event, 'frame')"
                    @touchstart.stop.prevent="touchHandle"
                >
                    <canvas
                        v-if="mask.show"
                        class="canvas"
                        :style="{
                            width: frame.width + 'px',
                            height: frame.height + 'px'
                        }"
                        canvas-id="canvas"
                    />
                    <view class="rect" />
                    <view class="line-one" />
                    <view class="line-two" />
                    <view class="line-three" />
                    <view class="line-four" />
                    <view
                        class="frame-left"
                        @touchstart="touchStart($event, 'left')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-right"
                        @touchstart="touchStart($event, 'right')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-top"
                        @touchstart="touchStart($event, 'top')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-bottom"
                        @touchstart="touchStart($event, 'bottom')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-left-top"
                        @touchstart="touchStart($event, 'left-top')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-left-bottom"
                        @touchstart="touchStart($event, 'left-bottom')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-right-top"
                        @touchstart="touchStart($event, 'right-top')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                    <view
                        class="frame-right-bottom"
                        @touchstart="touchStart($event, 'right-bottom')"
                        @touchstart.stop.prevent="touchHandle"
                    />
                </view>
            </view>
        </view>
        <view class="toolbar">
            <button
                class="btn-cancel"
                @tap="oncancle"
            >
                取消
            </button>
            <button
                class="btn-ok"
                @tap="onok"
            >
                确定
            </button>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            default: '',
        },
        fixed: {
            type: Boolean,
            default: false,
        },
        width: {
            type: Number,
            default: 200,
        },
        height: {
            type: Number,
            default: 200,
        },
        maxWidth: {
            type: Number,
            default: 1024,
        },
        maxHeight: {
            type: Number,
            default: 1024,
        },
        blob: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            mask: {
                show: false,
            },
            showDom: false,
            frame: {
                left: 50,
                top: 50,
                width: this.width,
                height: this.height,
            },
            image: {
                left: 20,
                top: 20,
                width: 300,
                height: 400,
            },
            real: {
                width: 100,
                height: 100,
            },
            target: {
                width: this.width,
                height: this.height,
            },
            touches: [],
            type: '',
            start: {
                frame: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                },
                image: {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                },
            },
            timeoutId: -1,
            context: null,
        };
    },
    mounted() {
        // #ifdef H5
        this.$el.addEventListener('touchmove', (ev) => {
            ev.preventDefault();
        });
        // #endif
        this.context = uni.createCanvasContext('canvas', this);
        this.targetContext = uni.createCanvasContext('target', this);
    },
    methods: {
        imageLoad(ev) {
            this.real.width = ev.detail.width;
            this.real.height = ev.detail.height;
            this.image.width = ev.detail.width;
            this.image.height = ev.detail.height;
            this.frame.width = this.width;
            this.frame.height = this.height;
            if (!this.fixed) {
                this.frame.width = this.image.width;
                this.frame.height = this.image.height;
            }
            const query = uni.createSelectorQuery().in(this);
            query
                .select('.body')
                .boundingClientRect((data) => {
                    const bw = data.width;
                    const bh = data.height;
                    const fw = this.frame.width;
                    const fh = this.frame.height;
                    let tw = bw * 0.8;
                    let th = bh * 0.8;
                    let sx = tw / fw;
                    let sy = th / fh;
                    let scale = sx;
                    if (sx < sy) {
                        scale = sy;
                    }
                    tw = fw * scale;
                    th = fh * scale;
                    const tx = (bw - tw) / 2;
                    const ty = (bh - th) / 2;
                    this.frame.width = tw;
                    this.frame.height = th;
                    this.frame.left = tx;
                    this.frame.top = ty;

                    const iw = this.image.width;
                    const ih = this.image.height;
                    sx = tw / iw;
                    sy = th / ih;
                    scale = sx;
                    if (sx < sy) {
                        scale = sy;
                    }
                    this.image.width = iw * scale;
                    this.image.height = ih * scale;
                    this.image.left = (bw - this.image.width) / 2;
                    this.image.top = (bh - this.image.height) / 2;
                    setTimeout(() => {
                        this.trimImage();
                    }, 100);
                })
                .exec();
            this.mask.show = true;
            this.showDom = true;
        },
        touchHandle() {},
        touchStart(ev, type) {
            this.stopTime();
            this.mask.show = false;
            if (this.touches.length === 0) {
                this.type = type;
                this.start.frame.left = this.frame.left;
                this.start.frame.top = this.frame.top;
                this.start.frame.width = this.frame.width;
                this.start.frame.height = this.frame.height;
                this.start.image.left = this.image.left;
                this.start.image.top = this.image.top;
                this.start.image.width = this.image.width;
                this.start.image.height = this.image.height;
            }
            const touches = ev.changedTouches;
            for (let i = 0; i < touches.length; i += 1) {
                const touch = touches[i];
                // this.touches[touch.identifier] = touch;
                this.touches.push(touch);
            }
        },
        touchMove(ev) {
            this.stopTime();
            ev.preventDefault();
            const { touches } = ev;
            if (this.touches.length === 1) {
                if (
                    this.type === 'plank'
                    || this.type === 'frame'
                    || this.fixed
                ) {
                    this.moveImage(this.touches[0], touches[0]);
                } else {
                    this.scaleFrame(this.touches[0], touches[0], this.type);
                }
            } else if (this.touches.length === 2 && touches.length === 2) {
                const ta = this.touches[0];
                const tb = this.touches[1];
                let tc = touches[0];
                let td = touches[1];
                if (ta.identifier !== tc.identifier) {
                    const temp = tc;
                    tc = td;
                    td = temp;
                }
                this.scaleImage(ta, tb, tc, td);
            }
        },
        touchEnd() {
            this.type = '';
            this.touches = [];
            this.startTime();
        },
        touchCancel() {
            this.type = '';
            this.touches = [];
            this.startTime();
        },
        startTime() {
            this.stopTime();
            this.timeoutId = setTimeout(() => {
                this.trimImage();
            }, 800);
        },
        stopTime() {
            if (this.timeoutId >= 0) {
                clearTimeout(this.timeoutId);
                this.timeoutId = -1;
            }
        },
        trimImage() {
            this.mask.show = true;
            const query = uni.createSelectorQuery().in(this);
            query
                .select('.body')
                .boundingClientRect((data) => {
                    const bw = data.width;
                    const bh = data.height;
                    const fw = this.frame.width;
                    const fh = this.frame.height;
                    let tw = bw * 0.8;
                    let th = bh * 0.8;
                    const sx = tw / fw;
                    const sy = th / fh;
                    let scale = sx;
                    if (sx > sy) {
                        scale = sy;
                    }
                    tw = fw * scale;
                    th = fh * scale;
                    const tx = (bw - tw) / 2;
                    const ty = (bh - th) / 2;
                    const ax = tx
                        - this.frame.left
                        + (this.frame.left - this.image.left) * (1 - scale);
                    const ay = ty
                        - this.frame.top
                        + (this.frame.top - this.image.top) * (1 - scale);
                    this.frame.width = tw;
                    this.frame.height = th;
                    this.frame.left = tx;
                    this.frame.top = ty;
                    this.image.width *= scale;
                    this.image.height *= scale;
                    this.image.left += ax;
                    this.image.top += ay;
                })
                .exec();
            setTimeout(() => {
                const scale = this.image.width / this.real.width;
                const x = (this.frame.left - this.image.left) / scale;
                const y = (this.frame.top - this.image.top) / scale;
                const width = this.frame.width / scale;
                const height = this.frame.height / scale;
                this.context.drawImage(
                    this.url,
                    x,
                    y,
                    width,
                    height,
                    0,
                    0,
                    this.frame.width,
                    this.frame.height,
                );
                this.context.draw(false);
            }, 100);
        },
        moveImage(ta, tb) {
            const ax = tb.clientX - ta.clientX;
            const ay = tb.clientY - ta.clientY;
            this.image.left = this.start.image.left + ax;
            this.image.top = this.start.image.top + ay;
            if (this.image.left > this.frame.left) {
                this.image.left = this.frame.left;
            }
            if (this.image.top > this.frame.top) {
                this.image.top = this.frame.top;
            }
            if (
                this.image.left + this.image.width
                < this.frame.left + this.frame.width
            ) {
                this.image.left = this.frame.left + this.frame.width - this.image.width;
            }
            if (
                this.image.top + this.image.height
                < this.frame.top + this.frame.height
            ) {
                this.image.top = this.frame.top + this.frame.height - this.image.height;
            }
        },
        scaleImage(ta, tb, tc, td) {
            const x1 = ta.clientX;
            const y1 = ta.clientY;
            const x2 = tb.clientX;
            const y2 = tb.clientY;
            const x3 = tc.clientX;
            const y3 = tc.clientY;
            const x4 = td.clientX;
            const y4 = td.clientY;
            const ol = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            const el = Math.sqrt((x3 - x4) * (x3 - x4) + (y3 - y4) * (y3 - y4));
            const ocx = (x1 + x2) / 2;
            const ocy = (y1 + y2) / 2;
            const ecx = (x3 + x4) / 2;
            const ecy = (y3 + y4) / 2;
            const ax = ecx - ocx;
            const ay = ecy - ocy;
            let scale = el / ol;
            if (this.start.image.width * scale < this.frame.width) {
                scale = this.frame.width / this.start.image.width;
            }
            if (this.start.image.height * scale < this.frame.height) {
                scale = this.frame.height / this.start.image.height;
            }
            if (this.start.image.width * scale < this.frame.width) {
                scale = this.frame.width / this.start.image.width;
            }
            this.image.left = this.start.image.left
                + ax
                - (ocx - this.start.image.left) * (scale - 1);
            this.image.top = this.start.image.top
                + ay
                - (ocy - this.start.image.top) * (scale - 1);
            this.image.width = this.start.image.width * scale;
            this.image.height = this.start.image.height * scale;
            if (this.image.left > this.frame.left) {
                this.image.left = this.frame.left;
            }
            if (this.image.top > this.frame.top) {
                this.image.top = this.frame.top;
            }
            if (
                this.image.left + this.image.width
                < this.frame.left + this.frame.width
            ) {
                this.image.left = this.frame.left + this.frame.width - this.image.width;
            }
            if (
                this.image.top + this.image.height
                < this.frame.top + this.frame.height
            ) {
                this.image.top = this.frame.top + this.frame.height - this.image.height;
            }
        },
        scaleFrame(ta, tb, type) {
            const ax = tb.clientX - ta.clientX;
            const ay = tb.clientY - ta.clientY;
            let x1 = this.start.frame.left;
            let y1 = this.start.frame.top;
            let x2 = this.start.frame.left + this.start.frame.width;
            let y2 = this.start.frame.top + this.start.frame.height;
            if (type === 'left') {
                x1 += ax;
            } else if (type === 'right') {
                x2 += ax;
            } else if (type === 'top') {
                y1 += ay;
            } else if (type === 'bottom') {
                y2 += ay;
            } else if (type === 'left-top') {
                x1 += ax;
                y1 += ay;
            } else if (type === 'left-bottom') {
                x1 += ax;
                y2 += ay;
            } else if (type === 'right-top') {
                x2 += ax;
                y1 += ay;
            } else if (type === 'right-bottom') {
                x2 += ax;
                y2 += ay;
            }
            if (x1 < this.image.left) {
                x1 = this.image.left;
            }
            if (y1 < this.image.top) {
                y1 = this.image.top;
            }
            if (x2 > this.image.left + this.image.width) {
                x2 = this.image.left + this.image.width;
            }
            if (y2 > this.image.top + this.image.height) {
                y2 = this.image.top + this.image.height;
            }
            this.frame.left = x1;
            this.frame.top = y1;
            this.frame.width = x2 - x1;
            this.frame.height = y2 - y1;
        },
        parseBlob(base64) {
            const arr = base64.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            const n = bstr.length;
            const u8arr = new Uint8Array(n);
            for (let i = 0; i < n; i += 1) {
                u8arr[i] = bstr.charCodeAt(i);
            }
            // eslint-disable-next-line no-undef
            const url = URL || webkitURL;
            return url.createObjectURL(new Blob([u8arr], { type: mime }));
        },
        onok() {
            const scale = this.image.width / this.real.width;
            const x = (this.frame.left - this.image.left) / scale;
            const y = (this.frame.top - this.image.top) / scale;
            const width = this.frame.width / scale;
            const height = this.frame.height / scale;
            let tw = width;
            let th = height;
            if (this.fixed) {
                tw = this.width / 2;
                th = this.height / 2;
            } else {
                if (tw > this.maxWidth / 2) {
                    const sc = this.maxWidth / 2 / tw;
                    tw *= sc;
                    th *= sc;
                }
                if (th > this.maxHeight / 2) {
                    const sc = this.maxHeight / 2 / th;
                    th *= sc;
                    tw *= sc;
                }
            }
            this.target.width = tw;
            this.target.height = th;
            uni.showLoading({
                title: '正在裁剪',
            });
            setTimeout(() => {
                this.targetContext.drawImage(
                    this.url,
                    x,
                    y,
                    width,
                    height,
                    0,
                    0,
                    tw,
                    th,
                );
                this.targetContext.draw(false, () => {
                    uni.canvasToTempFilePath(
                        {
                            canvasId: 'target',
                            success: (res) => {
                                let path = res.tempFilePath;
                                // #ifdef H5
                                if (this.blob) {
                                    path = this.parseBlob(path);
                                }
                                // #endif
                                this.$emit('ok', {
                                    path,
                                });
                            },
                            fail: (ev) => {
                                console.log(ev);
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                        },
                        this,
                    );
                });
            }, 100);
        },
        oncancle() {
            this.$emit('cancel');
        },
    },
};
</script>

<style scoped>
.privew-canvas {
    position: absolute;
    left: 0px;
    top: 0px;
    transform: translate3d(-9999px, 0, 0);
}
.ksp-image-cutter {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1000;
}
.toolbar {
    position: absolute;
    width: 100%;
    height: 100upx;
    left: 0upx;
    bottom: 0upx;
    box-sizing: border-box;
    border-bottom: 1px solid #c0c0c0;
    background: #f8f8f8;
}
.btn-cancel {
    position: absolute;
    left: 100upx;
    top: 12upx;
    font-size: 30upx;
    line-height: 30upx;
    padding: 20upx;
    color: #333333;
}
.btn-ok {
    position: absolute;
    right: 100upx;
    top: 12upx;
    font-size: 30upx;
    line-height: 30upx;
    padding: 20upx;
    color: #333333;
}
.body {
    position: absolute;
    left: 0upx;
    right: 0upx;
    top: 0upx;
    bottom: 100upx;
    background: black;
    overflow: hidden;
}
.mask {
    position: absolute;
    left: 0upx;
    right: 0upx;
    top: 0upx;
    bottom: 0upx;
    background: black;
    opacity: 0.4;
}
.plank {
    position: absolute;
    left: 0upx;
    right: 0upx;
    top: 0upx;
    bottom: 0upx;
}
.image {
    position: absolute;
}
.frame {
    position: absolute;
}
.canvas {
    position: absolute;
    display: block;
    left: 0px;
    top: 0px;
    transform: translate3d(-9999px, 0, 0);
}
.rect {
    position: absolute;
    left: -2px;
    top: -2px;
    width: 100%;
    height: 100%;
    border: 2px solid white;
}
.line-one {
    position: absolute;
    width: 100%;
    height: 1px;
    background: white;
    left: 0;
    top: 33.3%;
}
.line-two {
    position: absolute;
    width: 100%;
    height: 1px;
    background: white;
    left: 0;
    top: 66.7%;
}
.line-three {
    position: absolute;
    width: 1px;
    height: 100%;
    background: white;
    top: 0;
    left: 33.3%;
}
.line-four {
    position: absolute;
    width: 1px;
    height: 100%;
    background: white;
    top: 0;
    left: 66.7%;
}
.frame-left {
    position: absolute;
    height: 100%;
    width: 8px;
    left: -4px;
    top: 0;
}
.frame-right {
    position: absolute;
    height: 100%;
    width: 8px;
    right: -4px;
    top: 0;
}
.frame-top {
    position: absolute;
    width: 100%;
    height: 8px;
    top: -4px;
    left: 0;
}
.frame-bottom {
    position: absolute;
    width: 100%;
    height: 8px;
    bottom: -4px;
    left: 0;
}
.frame-left-top {
    position: absolute;
    width: 20px;
    height: 20px;
    left: -6px;
    top: -6px;
    border-left: 4px solid red;
    border-top: 4px solid red;
}
.frame-left-bottom {
    position: absolute;
    width: 20px;
    height: 20px;
    left: -6px;
    bottom: -6px;
    border-left: 4px solid red;
    border-bottom: 4px solid red;
}
.frame-right-top {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -6px;
    top: -6px;
    border-right: 4px solid red;
    border-top: 4px solid red;
}
.frame-right-bottom {
    position: absolute;
    width: 20px;
    height: 20px;
    right: -6px;
    bottom: -6px;
    border-right: 4px solid red;
    border-bottom: 4px solid red;
}
</style>
