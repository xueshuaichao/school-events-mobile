<template>
    <view class="content">
        <button
            class="btns"
            type="primary"
            @tap="openAddres"
        >
            默认打开地址
        </button>

        <button
            class="btns"
            type="default"
            @tap="openAddres2"
        >
            自定义：根据省市区名称打开地址
        </button>

        <button
            class="btns"
            type="warn"
            @tap="openAddres3"
        >
            自定义：根据省市区“code”打开地址
        </button>
        <textarea
            v-model="pickerText"
            cols="30"
            rows="10"
        />
        <!--
            mask-bg-color="rgba(0, 229, 238, 0.4)" // 自定义遮罩层背景颜色
            -->
        <simple-address
            ref="simpleAddress"
            :picker-value-default="cityPickerValueDefault"
            theme-color="#007AFF"
            @onConfirm="onConfirm"
        />
    </view>
</template>

<script>
// import simpleAddress from './simple-address/simple-address.vue';

export default {
    components: {
        // simpleAddress,
    },
    data() {
        return {
            cityPickerValueDefault: [0, 0, 1],
            pickerText: '',
        };
    },
    methods: {
        openAddres() {
            this.cityPickerValueDefault = [0, 0, 1];
            this.$refs.simpleAddress.open();
        },
        openAddres2() {
            // 根据 label 获取
            const index = this.$refs.simpleAddress.queryIndex(
                ['湖北省', '随州市', '曾都区'],
                'label',
            );
            console.log(index);
            this.cityPickerValueDefault = index.index;
            this.$refs.simpleAddress.open();
        },
        openAddres3() {
            // 根据value 获取
            const index = this.$refs.simpleAddress.queryIndex(
                [13, 1302, 130203],
                'value',
            );
            console.log(index);
            this.cityPickerValueDefault = index.index;
            this.$refs.simpleAddress.open();
        },
        onConfirm(e) {
            this.pickerText = JSON.stringify(e);
        },
    },
};
</script>

<style>
.btns {
    margin-left: 20rpx;
    margin-right: 20rpx;
    margin-top: 40rpx;
    margin-bottom: 40rpx;
}
</style>
