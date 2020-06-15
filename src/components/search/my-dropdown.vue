<template>
    <view
        class="my-drop-box"
        :class="{ show: searchDropStatus && dropList.length }"
        @click.prevent="selItem"
    >
        <view
            class="drop-ctx dropdown animated slideInDown faster"
            :class="hiddingDrop ? 'slideOutUp' : ''"
        >
            <view
                v-for="(item, index) in dropList"
                :key="index"
                class="item"
                @click.stop="selItem(item)"
            >
                #{{ item }}
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
        dropList: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            list: [1, 2, 3, 4, 5],
            hiddingDrop: false,
        };
    },
    watch: {
        searchDropStatus(val) {
            this.searchDropStatus = val;
            this.toggleSearch();
        },
    },
    methods: {
        selItem(item) {
            this.$emit('setHotWord', item.type ? '' : item);
        },
        toggleSearch() {
            if (!this.searchDropStatus) {
                this.hiddingDrop = true;
                setTimeout(() => {
                    this.hiddingDrop = false;
                    this.$emit('searchStatus', false);
                }, 300);
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
            border-bottom: 2upx solid #eee;
        }
    }
}
</style>
