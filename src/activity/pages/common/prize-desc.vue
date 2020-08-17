<template>
    <div class="activity-prize-desc-page">
        <!-- 奖品说明 -->
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
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize_title.png)`
                    }"
                />
                <view class="active-rule-box">
                    <view
                        v-for="(item, k) in prizesDetail.list"
                        :key="k"
                        class="prize-list"
                    >
                        <view class="title">
                            {{ item.title }}
                        </view>
                        <view class="list-box">
                            <view
                                v-for="(list, key) in item.prizeList"
                                :key="key"
                                class="prize-item"
                            >
                                <image
                                    class="bg-icon bg-left"
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize_bg_left.png`
                                    "
                                    mode=""
                                />
                                <view class="content">
                                    <image
                                        class="prize-item-img"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${
                                                activityId === 13
                                                    ? 'spring'
                                                    : 'labor'
                                            }_prize_${k}_${key}.${
                                                activityId === 13
                                                    ? 'jpg'
                                                    : 'png'
                                            }`
                                        "
                                        mode=""
                                    />
                                    <view class="prize-item-name">
                                        {{ list.name }}
                                    </view>
                                    <view class="prize-item-text">
                                        {{ list.text }}
                                    </view>
                                </view>
                                <image
                                    class="bg-icon bg-right"
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize_bg_right.png`
                                    "
                                    mode=""
                                />
                            </view>
                        </view>
                    </view>
                    <view
                        v-for="(ruleItem, index) in prizesDetail.text"
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
                                {{ textItem }}
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
        name: {
            type: String,
            default: '',
        },
        theme: {
            type: Object,
            default() {
                return {};
            },
        },
        prizesDetail: {
            type: Object,
            default() {
                return {};
            },
        },
        activityId: {
            type: Number,
            default: 8,
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
.prize-list {
    text-align: center;
    .title {
        font-size: 34upx;
        font-weight: bold;
        display: inline-block;
        padding: 14upx 52upx;
        margin: 0 auto;
        background-color: #ff7131;
        border: 2upx solid rgba(255, 231, 174, 1);
        border-radius: 30upx;
        line-height: 1;
    }
    .list-box {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 100%;
    }
    .bg-icon {
        width: 68upx;
        height: 270upx;
        position: absolute;
        top: -23upx;
        &.bg-left {
            left: -10upx;
        }
        &.bg-right {
            right: -10upx;
        }
    }

    .prize-item {
        width: 292upx;
        margin: 0 6upx 29upx;
        position: relative;
        padding-top: 28upx;
        background-color: #fff;
        height: 222upx;
        box-sizing: border-box;
        text-align: center;
        .prize-item-img {
            width: 226upx;
            height: 110upx;
            margin-bottom: 13upx;
        }
        .prize-item-name {
            font-size: 22upx;
            line-height: 1;
            color: #ff3442;
            margin-bottom: 9upx;
        }
        .prize-item-text {
            font-size: 20upx;
            line-height: 1;
            color: #db4e0e;
        }
    }
}
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
