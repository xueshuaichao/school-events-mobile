<template>
    <div class="activity-rule-page">
        <!-- 规则 -->
        <view :class="['activerulebox', `mask-${name}`]">
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
                    {{ title }}
                </view>
                <view class="active-rule-box">
                    <template v-if="type === 'rule'">
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
                    </template>
                    <template v-else-if="type === 'prize'">
                        <view>奖品说明</view>
                    </template>
                    <template v-else-if="type === 'list'">
                        <view>
                            幸运榜单
                        </view>
                    </template>
                    <template v-else-if="type === 'draw'">
                        <view>抽奖次数</view>
                    </template>
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
        luckList: {
            type: Array,
            default() {
                return [];
            },
        },
        prizeList: {
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
        title: {
            type: String,
            default: '标题',
        },
        type: {
            type: String,
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
    &.mask-children {
        .active-content {
            box-shadow: inset 0px 0px 24upx 0px rgba(182, 146, 255, 0.57);
            border-radius: 50upx;
            padding-bottom: 250upx;
            // background-image: url() ;
        }
        .title,
        .text {
            display: inline-block;
            font-size: 28upx;
        }
        .title {
            font-weight: normal;
        }
        .text {
            color: #333;
            font-weight: bold;
            margin-bottom: 2upx;
        }
        .tit,
        .title-icon {
            padding: 0upx 40upx;
            line-height: 54upx;
            color: #fff;
            border-radius: 48upx;
            background-color: #ff78a5;
            box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
            position: relative;
            font-size: 28upx;
            display: inline-block;
            margin-bottom: 14upx;
            &::before {
                content: "";
                position: absolute;
                left: 10upx;
                top: 10upx;
                width: 21upx;
                height: 22upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
                background-size: 21upx 21upx;
                background-repeat: no-repeat;
            }
        }
        .rule-list {
            font-weight: normal;
            color: #666;
            line-height: 42upx;
            font-size: 26upx;
            margin-bottom: 20upx;
        }
        .title-icon {
            position: absolute;
            line-height: 74upx;
            height: 74upx;
            padding: 0 51upx;
            font-size: 32upx;
            box-sizing: border-box;
            top: -32upx;
        }
        .active-content {
            bottom: 96upx;
            height: auto;
        }
        .close {
            bottom: -75upx;
            right: 50%;
            transform: translateX(50%);
            top: auto;
        }
    }
}
</style>
