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
                    <template v-if="type === 0">
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
                    <template v-else-if="type === 1">
                        <view>奖品说明</view>
                    </template>
                    <template v-else-if="type === 2">
                        <scroll-view
                            class="lucky-list"
                            scroll-y="true"
                            @scrolltolower="getLuckList"
                        >
                            <view
                                v-for="(lucky, index) in luckyListArr"
                                :key="lucky.id"
                                class="item"
                            >
                                <text>{{ luckyTotal[index] }}.</text>
                                <text>用户4343434</text>
                                <text>抽中了</text>
                                <text>小度音响</text>
                            </view>
                        </scroll-view>
                    </template>
                    <template v-else-if="type === 3">
                        <view class="lottery-num">
                            <view class="lottery-title">
                                完成<text>每日任务</text>，获取更多<text>
                                    抽奖机会
                                </text>
                            </view>
                            <view class="lottery-item-box">
                                <view
                                    v-for="(lottery, index) in lotteryNum.type"
                                    :key="index"
                                    class="item"
                                >
                                    <text class="item-type">
                                        {{ lottery }}
                                    </text>
                                    <text class="item-text">
                                        获取一次抽奖机会
                                    </text>
                                    <view class="item-btn-box">
                                        <template v-if="index === 0">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur: lotteryNum.login > 0
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.login > 0
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.login > 0
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                        <template v-else-if="index === 1">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur:
                                                        lotteryNum.vote_num >= 5
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.vote_num >= 5
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.vote_num >= 5
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                        <template v-else-if="index === 2">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur:
                                                        lotteryNum.add_activity >
                                                        0
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.add_activity >
                                                            0
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.add_activity > 0
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                    </view>
                                </view>
                            </view>
                            <view class="tips">
                                快去赢得抽奖机会吧！
                            </view>
                        </view>
                    </template>
                    <view
                        v-if="showQrCode"
                        class="qr-wrap"
                    >
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
        luckyList: {
            type: Object,
            default() {
                return {};
            },
        },
        lotteryNum: {
            type: Object,
            default() {
                return {};
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
            type: Number,
            default: 0,
        },
        showQrCode: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            luckyListArr: this.luckyList.list || [],
            luckyTotal: this.luckyList.total || 0,
            luckyNum: 0,
            lotteryType: this.lotteryNum.type || [],
        };
    },
    watch: {
        luckyList: {
            handler(val) {
                console.log(val);
                const list = [];
                for (let i = 1; i < val.total + 1; i += 1) {
                    list.push(i);
                }
                this.luckyTotal = list.reverse();
                this.luckyListArr = val.list;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        getLuckyList() {
            this.$emit('getLuckyList', (this.luckyNum += 1));
        },
        getLotteryNum(index, type) {
            this.$emit('getNewLotteryNum', {
                index,
                type,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.activity-rule-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
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
    &.mask-children {
        .chidren-btn {
            color: #fff;
            border-radius: 48upx;
            background-color: #ff78a5;
            box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
            position: relative;
            font-size: 28upx;
            display: inline-block;
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
        .active-content {
            box-shadow: inset 0px 0px 24upx 0px rgba(182, 146, 255, 0.57);
            border-radius: 50upx;
            padding-bottom: 250upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_mask_footer.png);
            background-repeat: no-repeat;
            background-size: 100% 248upx;
            background-position: bottom center;
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

        .lucky-list {
            color: #999;
        }
        .lottery-num {
            .tips {
                text-align: center;
                color: #bb77ff;
                font-size: 32upx;
                font-weight: bold;
            }
            .lottery-title {
                font-size: 28upx;
                color: #333;
                text-align: center;
                line-height: 39upx;
                margin-bottom: 30upx;
                & > text {
                    color: #b692ff;
                    font-size: 32upx;
                    font-weight: bold;
                }
            }
            .lottery-item-box {
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: inset 0px 0px 17upx 0px rgba(182, 146, 255, 1);
                    border-radius: 20upx;
                    height: 120upx;
                    margin-bottom: 30upx;
                    padding: 0 30upx;
                }
            }
            .item-type {
                font-weight: bold;
                color: #333;
                font-size: 28upx;
            }
            .item-text {
                color: #666;
                font-size: 26upx;
            }
            .item-btn {
                background-color: #c790ff;
                padding: 0 42upx;
                line-height: 74upx;
                margin-bottom: 0;
                font-size: 32upx;
                &.cur {
                    background: rgba(199, 144, 255, 0.35);
                    box-shadow: inset 0px 0px 0px 0px rgba(255, 255, 255, 0.35);
                    color: #d5abff;
                }
            }
        }
    }
}
</style>
