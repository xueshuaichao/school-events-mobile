<template>
    <div class="page-record-result">
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
    </div>
</template>

<script>
import utils from '../../../common/utils';

export default {
    data() {
        return {
            canvasImg: '',
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
    },
    onLoad(query) {
        this.canvasImg = utils.getParam(query, 'img');
    },
};
</script>
<style lang="less">
.page-record-result {
    .canvas-img {
        width: 689upx;
        height: 1103upx;
        margin: 0 auto 120upx;
        image {
            width: 100%;
            height: 100%;
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
