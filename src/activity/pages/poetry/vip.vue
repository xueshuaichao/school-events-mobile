<template>
    <view class="vip">
        <view class="bass1">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-1.jpg"
            />
        </view>
        <template>
            <view class="card">
                有书VIP 会员卡
            </view>
            <view class="hare">
                兑换码：11123546566767
                <image
                    class="qr-code"
                    src="../../static/icon_copy.png"
                />
                <text
                    class="copy"
                    @click="copyCode('hhhhhhhh')"
                >
                    复制
                </text>
            </view>
        </template>
        <view class="bass2">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-2.png"
            />
        </view>
        <view class="bass3">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-3.jpg"
            />
        </view>
        <view class="bass4">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-4.jpg"
            />
        </view><view class="bass5">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-5.jpg"
            />
        </view>
        <view class="bass6">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-6.jpg"
            />
        </view>
        <view class="bass7">
            <image
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-7.jpg"
            />
        </view>
        <view class="bass8">
            <image
                class="ban8"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/vip-8.jpg"
            />
        </view>
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
<style scoped lang="less">
.vip {
    .bass1 {
        image {
            width: 100%;
            height: 640upx;
        }
    }
    .bass2 {
        image {
            width: 100%;
            height: 360upx;
        }
    }
    .bass3 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 1100upx;
        }
    }
    .bass4 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 1540upx;
        }
    }
    .bass5 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 900upx;
        }
    }
    .bass6 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 1000upx;
        }
    }
    .bass7 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 1256upx;
        }
    }
    .bass8 {
        margin-top: -10upx;
        image {
            width: 100%;
            height: 880upx;
        }
    }

    .card {
        padding-left: 4%;
        font-size: 30upx;
        font-weight: 600;
    }
    .hare {
        padding-left: 4%;
    }
    .qr-code {
        width: 60upx;
        height: 60upx;
        display: inline-block;
        vertical-align: middle;
    }
    .copy {
        font-weight: 600;
        &:hover {
            color: #007aff;
        }
    }
}
</style>
