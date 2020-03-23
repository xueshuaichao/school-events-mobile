<template>
    <div class="page-record-result">
        <template v-if="!isH5">
            <template v-if="startCreateCanvas">
                <poster
                    id="poster"
                    :config="posterConfig"
                    @success="onPosterSuccess"
                    @fail="onPosterFail"
                />
            </template>
            <view
                v-else
                class="canvas-img"
            >
                <image
                    :src="canvasImg"
                    mode=""
                />
            </view>
            <view
                v-if="!startCreateCanvas"
                class="btn"
                @click="handleSave"
            >
                保存图片
            </view>
        </template>
        <template v-else>
            <template v-if="Object.keys(itemData).length">
                <view
                    id="canvas-img"
                    class="h5-canvas-img"
                >
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/recordbg.png"
                        class="bg-img"
                        mode=""
                    />
                    <div class="item-cont">
                        <image
                            class="resource-img"
                            :src="`${itemData.video_img_url}${ossImg}`"
                            mode=""
                        />
                        <view class="text">
                            <text class="text-tit">
                                作品名称：
                            </text>
                            <text>{{ itemData.resource_name }}</text>
                        </view>
                        <view class="text">
                            <text class="text-tit">
                                成绩：
                            </text>
                            <text>
                                {{ itemData.achievement
                                }}{{ itemData.achievement_unit }}
                            </text>
                        </view>
                        <view class="text">
                            <text class="text-tit">
                                记录等级：
                            </text>
                            <text>{{ record[itemData.record - 1] }}</text>
                        </view>
                        <view class="text">
                            <text class="text-tit">
                                参赛者名称
                            </text>
                            <text>{{ itemData.create_name }}</text>
                        </view>
                        <view class="text">
                            <text class="text-tit">
                                学校年级：
                            </text>
                            <text>{{ itemData.create_user_class }}</text>
                        </view>
                        <view class="text">
                            <text class="text-tit">
                                创造记录时间：
                            </text>
                            <text>{{ itemData.created_at }}</text>
                        </view>
                        <view class="image-view">
                            <image
                                class="record-img"
                                :src="itemData.recordImage"
                                mode=""
                            />
                            <image
                                class="qrcode-img"
                                :src="itemData.qrcode"
                                mode=""
                            />
                        </view>
                    </div>
                </view>
                <view
                    class="btn"
                    @click="h5HandleSave"
                >
                    保存图片
                </view>
            </template>
        </template>
    </div>
</template>

<script>
// #ifdef H5
import html2canvas from 'html2canvas';
// #endif

export default {
    data() {
        return {
            poster: null,
            // #ifdef H5
            isH5: true,
            // #endif
            startCreateCanvas: true,
            canvasImg: '',
            itemData: {},
            record: ['校级记录', '市级记录', '省级记录'],
            ossImg:
                '?x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,w_388,h_261',
            posterConfig: {
                pixelRatio: 3,
                width: 689,
                height: 1103,
                debug: false,
                texts: [
                    {
                        x: 50,
                        y: 101,
                        text: [
                            {
                                text: '作品名称',
                                fontSize: 29,
                                color: '#ACAFBF',
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
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/recordbg.png',
                        width: 689,
                        height: 1103,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 388,
                        height: 261,
                        y: 276,
                        x: 150,
                    },
                    {
                        url: '',
                        width: 313,
                        height: 68,
                        y: 939,
                        x: 103,
                    },
                    {
                        url: '',
                        width: 160,
                        height: 160,
                        y: 890,
                        x: 470,
                    },
                ],
            },
        };
    },
    watch: {
        itemData(val) {
            console.log(val);
            const _this = this;
            if (!_this.isH5) {
                _this.posterConfig.images[3].url = val.qrcode;
                _this.setCanvasImg().then(() => {
                    _this.poster.onCreate(_this.posterConfig);
                });
            }
        },
    },
    methods: {
        onPosterSuccess({ detail }) {
            this.startCreateCanvas = false;
            this.canvasImg = detail;
        },
        onPosterFail(err) {
            console.log(err);
        },
        initCanvasText() {
            const texts = [
                '作品名称：',
                '成绩：',
                '记录等级：',
                '参赛者姓名：',
                '学校年级：',
                '创建记录时间：',
            ];
            const textStyle = {
                fontSize: 24,
                lineHeight: 72,
                color: '#ACAFBF',
                width: 450,
            };
            const position = {
                x: 101,
                y: 540,
                ySpace: 53,
                xSpace: 0,
            };
            this.posterConfig.texts = this.posterText(
                texts,
                textStyle,
                position,
            );
        },
        setCanvasImg() {
            return new Promise((resolve) => {
                this.posterConfig.images[1].url = `${this.itemData.video_img_url}${this.ossImg}`;
                const record = ['校级记录', '市级记录', '省级记录'];
                this.posterConfig.images[2].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/record${this.itemData.record}.png`;
                const texts = [
                    this.itemData.resource_name,
                    `${this.itemData.achievement}${this.itemData.achievement_unit}`,
                    record[this.itemData.record - 1],
                    this.itemData.create_name,
                    this.itemData.create_user_class,
                    this.itemData.created_at,
                ];
                const textStyle = {
                    fontSize: '28',
                    lineHeight: '72',
                    color: '#4D4E56',
                    width: 980,
                };
                const position = {
                    x: 283,
                    y: 540,
                    ySpace: 53,
                    xSpace: 0,
                };
                // console.log(this.posterText(texts, textStyle, position))
                console.log(this.posterConfig.texts);
                this.posterConfig.texts = this.posterConfig.texts.concat(
                    this.posterText(texts, textStyle, position),
                );
                resolve(true);
            });
        },
        posterText(texts, textStyle = {}, position = {}) {
            let defaultStyle = {
                ...textStyle,
                opacity: 1,
                lineNum: 1,
                textOverflow: 'ellipsis',
            };
            console.log(defaultStyle);
            let defaultPositon = {
                x: position.x,
                y: position.y,
            };
            return texts.map((item) => {
                defaultStyle = {
                    ...defaultStyle,
                    text: item,
                };
                defaultPositon = {
                    x: defaultPositon.x + position.xSpace,
                    y: defaultPositon.y + position.ySpace,
                };
                return {
                    ...defaultPositon,
                    text: [defaultStyle],
                    baseLine: 'middle',
                };
            });
        },
        handleSave() {
            console.log(this.canvasImg, '触发图片保存');
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
        h5HandleSave() {
            html2canvas(document.querySelector('.h5-canvas-img'), {
                backgroundColor: null,
                allowTaint: false, // 允许污染
                taintTest: true, // 在渲染前测试图片(没整明白有啥用)
                useCORS: true, // 使用跨域(当allowTaint为true时这段代码没什么用,下面解释)
            }).then((canvas) => {
                console.log(canvas);
                const link = document.createElement('a');
                link.href = canvas.toDataURL(); // 下载链接
                link.setAttribute('download', '证书.png');
                link.style.display = 'none'; // a标签隐藏
                document.body.appendChild(link);
                link.click();
            });
        },
    },
    onLoad() {
        const _this = this;
        uni.getStorage({
            key: 'recordData',
            success({ data }) {
                _this.itemData = JSON.parse(data);
                _this.poster = _this.selectComponent('#poster');
                _this.initCanvasText();
            },
        });
    },
};
</script>
<style lang="less">
.page-record-result {
    padding-top: 14upx;
    position: relative;
    // #poster {
    //     position: absolute;
    //     transform: translate3d(-9999rpx, 0, 0);
    // }
    .canvas-img {
        width: 689upx;
        height: 1103upx;
        margin: 0 auto 120upx;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .h5-canvas-img {
        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/recordbg.png);
        width: 690upx;
        height: 1103upx;
        position: relative;
        margin: 0 auto 120upx;
        .bg-img {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
        }
        .item-cont {
            position: absolute;
            top: 276upx;
            left: 0;
            bottom: 0;
            right: 0;
        }
        .resource-img {
            width: 388upx;
            height: 261upx;
            margin: 0 auto 25upx;
            display: block;
        }
        .text-tit {
            color: #acafbf;
            font-size: 24upx;
            width: 152upx;
            display: inline-block;
            margin-right: 29upx;
        }
        .text {
            width: 485upx;
            margin: 0 auto;
            font-size: 28upx;
            color: #4d4e56;
            line-height: 1.5;
            margin-bottom: 13upx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .image-view {
            padding: 0upx 60upx 0 100upx;
            display: flex;
            justify-content: space-between;
        }
        .record-img {
            width: 313upx;
            height: 68upx;
            padding-top: 40upx;
        }
        .qrcode-img {
            width: 160upx;
            height: 160upx;
        }
    }
    .btn {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #1166ff;
        height: 98upx;
        line-height: 98upx;
        width: 100%;
        color: #fff;
        margin-top: 80upx;
        text-align: center;
        margin: 0 auto;
    }
}
</style>
