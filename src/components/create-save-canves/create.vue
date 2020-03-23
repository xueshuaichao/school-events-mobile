<template>
    <view class="creat-canvas">
        <slot name="creat">
            生成图片
        </slot>
    </view>
</template>

<script>
export default {
    props: {
        config: {},
        itemData: {
            type: Object,
        },
        resultPage: {
            type: String,
            default: '',
        },
    },
};
</script>
