<template>
    <div class="activity-rule-page">
        <!-- 规则 -->
        <view class="activerulebox">
            <view
                class="active-content"
                :style="{ 'background-color': theme.bgColor }"
            >
                <view
                    v-if="name"
                    class="close"
                    :style="{
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_close.png)`
                    }"
                    @click="handleClose"
                />
                <view
                    v-if="name"
                    class="title-icon"
                    :style="{
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_title.png)`
                    }"
                >
                    活动规则
                </view>
                <view class="active-rule-box">
                    <view
                        v-for="(ruleItem, index) in rules"
                        :key="index"
                    >
                        <view
                            class="title"
                            :style="{ color: theme.titleColor }"
                        >
                            {{ ruleItem.title }}
                        </view>
                        <view class="text">
                            <view
                                v-for="(textItem, k) in ruleItem.texts"
                                :key="k"
                            >
                                <template v-if="textItem.title">
                                    <view class="tit">
                                        {{ textItem.title }}
                                    </view>
                                    <view
                                        v-for="(list, i) in textItem.list"
                                        :key="i"
                                        class="rule-list"
                                    >
                                        {{ list }}
                                    </view>
                                </template>
                                <template v-else>
                                    {{ textItem }}
                                </template>
                            </view>
                        </view>
                    </view>
                    <view class="qr-wrap">
                        <image
                            class="qr-code"
                            src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/qrcode.jpg"
                        />
                        <view class="text">
                            关注“UP青少年爱挑战”公众号，了解更多活动信息
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </div>
</template>

<script>
export default {
    props: {
        rules: {
            type: Array,
            default() {
                return [];
            },
        },
        theme: {
            type: Object,
            default() {
                return {};
            },
        },
        name: {
            type: String,
            default: '',
        },
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
    },
};
</script>

<style lang="less" scoped>
.activerulebox {
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    color: #fff;
    z-index: 999;
    font-size: 24upx;
    &:first-child {
        font-size: 28upx;
    }
    .title {
        font-size: 28upx;
        color: #ffde6d;
        font-weight: bold;
        margin-bottom: 17upx;
    }

    .text {
        margin-bottom: 40upx;
        font-weight: 300;
        font-size: 28upx;
        color: #fff;
    }
    .title-icon {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 0upx;
        width: 303upx;
        height: 90upx;
        position: absolute;
        top: -43upx;
        left: 190upx;
        text-align: center;
        line-height: 69upx;
        z-index: 222;
    }
    .close {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background-color: #04a875;
        position: absolute;
        top: 62upx;
        left: 35upx;
        height: 92%;
        width: 678upx;
        padding: 76upx 30upx 38upx;
        box-sizing: border-box;
        padding-right: 20upx;
        border-radius: 46rpx;
        .active-rule-box {
            width: 100%;
            overflow-y: scroll;
            max-height: 100%;
            overflow-x: hidden;
        }
        .size {
            font-size: 28upx;
        }
    }
    .qr-wrap {
        .qr-code {
            width: 190rpx;
            height: 190rpx;
            display: block;
            margin: 35rpx auto 15rpx;
            border-radius: 15rpx;
        }

        .text {
            font-size: 24rpx;
            text-align: center;
        }
    }
}
</style>
