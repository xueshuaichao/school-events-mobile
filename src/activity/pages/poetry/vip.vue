<template>
    <view>
        读书vip
        <text
            class="copy"
            @click="copyCode('hhhhhhhh')"
        >
            复制
        </text>
    </view>
</template>
<script>
import utils from '../../../common/utils';

export default {
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    methods: {
        copyCode(data) {
            if (this.isH5) {
                utils.handleClipboard(
                    data,
                    // eslint-disable-next-line no-restricted-globals
                    event,
                    () => {
                        this.copyToast(true);
                    },
                    () => {
                        this.copyToast(false);
                    },
                );
            } else {
                uni.setClipboardData({
                    data,
                    success: () => {
                        this.copyToast(true);
                    },
                    fail: () => {
                        this.copyToast(false);
                    },
                });
            }
        },
        copyToast(status) {
            uni.showToast({
                icon: 'none',
                title: status ? '复制成功' : '复制失败，可长按复制',
            });
        },
    },
};
</script>
<style scoped></style>
