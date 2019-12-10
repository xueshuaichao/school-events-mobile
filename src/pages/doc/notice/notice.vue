<template>
    <view class="rich-text page-notice">
        <rich-text :nodes="contentNodes" />
        <view class="download">
            附件下载请使用电脑登录 http://atz.qsnatz.com
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

    .download {
        font-size: 28rpx;
        margin: 40rpx 0;
    }
}
</style>
