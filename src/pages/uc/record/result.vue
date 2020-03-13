<template>
    <div class="page-record-result">
        <template v-if="!isH5">
            <view class="canvas-img">
                <image
                    :src="canvasImg"
                    mode=""
                />
            </view>
            <view
                class="btn"
                @click="handleSave"
            >
                保存图片
            </view>
        </template>
        <template v-else>
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
                        :src="itemData.video_img_url"
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
    </div>
</template>

<script>
// #ifdef H5
import html2canvas from 'html2canvas';
// #endif
import utils from '../../../common/utils';

export default {
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            canvasImg: '',
            itemData: {},
            record: ['校级记录', '市级记录', '省级记录'],
        };
    },
    methods: {
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
    onLoad(query) {
        this.canvasImg = utils.getParam(query, 'img');
        this.itemData = JSON.parse(localStorage.getItem('recordData')) || {};
    },
};
</script>
<style lang="less">
.page-record-result {
    padding-top: 14upx;
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
            width: 480upx;
            height: 324upx;
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
            padding-top: 15upx;
        }
        .qrcode-img {
            width: 100upx;
            height: 100upx;
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
