<template>
    <view class="rich-text page-notice">
        <rich-text :nodes="contentNodes" />
        <view class="tips">
            <image
                src="http://open-storage-wdy.oss-cn-beijing.aliyuncs.com/12000/school_events/2020-05-22/image/1/e4e4f9457a4df1ce7b3ceef8ed5ddb6f.png"
            />
            <image
                src="http://open-storage-wdy.oss-cn-beijing.aliyuncs.com/12000/school_events/2020-05-22/image/1/51e3f0d97d8f0a6b6f3134445330dd8d.png"
                mode=""
            />
        </view>
        <view class="download">
            附件下载请使用电脑登录 http://atz.qsnatz.com/notice
        </view>
    </view>
</template>

<script>
import content from './content';
import parseHtml from '../../../common/third-party/html-parser';

export default {
    data() {
        let contentNodes;
        try {
            contentNodes = parseHtml(content.content);
        } catch (e) {
            console.log(e);
        }
        return {
            contentNodes,
        };
    },
};
</script>

<style lang="less">
.page-notice {
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 45rpx;
    .tips {
        color: #363434;
        font-size: 14px;
        & > image {
            width: 640upx;
            margin: 0 auto;
            height: 904upx;
            display: block;
        }
    }
    .download {
        font-size: 28rpx;
        margin: 40rpx 0;
    }
}
/deep/ .MsoNormalTable {
    width: 100% !important;
}
</style>
