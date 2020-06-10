<template>
    <view
        class="my-drop-box"
        :class="{ show: showSearchDrop }"
    >
        <view
            class="drop-ctx dropdown animated slideInDown faster"
            :class="hiddingDrop ? 'slideOutUp' : ''"
            @click.prevent="hiddenSearchDrop"
        >
            <view
                v-for="(item, index) in list"
                :key="index"
                class="item"
            >
                #hhhhhasdasda
            </view>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        searchDropStatus: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            list: [1, 2, 3, 4, 5],
            hiddingDrop: true,
            showSearchDrop: false,
        };
    },
    watch: {
        searchDropStatus() {
            this.toggleSearch();
        },
    },
    methods: {
        hiddenSearchDrop() {},
        toggleSearch() {
            if (this.showSearchDrop) {
                this.hiddingDrop = true;
                setTimeout(() => {
                    this.hiddingDrop = false;
                    this.showSearchDrop = false;
                    console.log('hide meanu--');
                }, 300);
            } else {
                console.log('show menu---');
                this.showSearchDrop = true;
            }
        },
    },
};
</script>
<style scoped lang="less">
.my-drop-box {
    background: rgba(0, 0, 0, 0.6);
    width: 750rpx;
    position: fixed;
    top: calc(100upx);
    height: calc(100% - 100upx - var(--window-bottom));
    z-index: 102;
    display: none;
    box-sizing: border-box;
    border-top: 12upx solid #ddd;
    &.show {
        display: block;
    }
    .drop-ctx {
        width: 100%;
        background: #fff;
        padding-bottom: 60rpx;
        .item {
            padding: 20rpx 0;
            text-indent: 34upx;
            color: #2f3033;
            font-size: 30rpx;
            line-height: 42rpx;
            border-bottom: 2upx solid #ddd;
        }
    }
}
</style>
