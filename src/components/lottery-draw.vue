<template>
    <view class="container">
        <view class="frame-view">
            <view
                v-for="item in 4"
                :key="item"
                :class="['bot-box', `row-${item}`]"
            >
                <template v-if="item === 1 || item === 3">
                    <view
                        v-for="bot in 12"
                        :key="bot"
                        :class="[`bot bot-${bot}`]"
                    />
                </template>
                <template v-else>
                    <view
                        v-for="bot in 9"
                        :key="bot"
                        :class="[`bot bot-${bot}`]"
                    />
                </template>
            </view>
            <view class="frame-view-box">
                <view
                    v-for="(item, index) in lotteryPostion"
                    :key="index"
                    class="frame-item"
                    :class="{
                        btn: item === -1,
                        disabled: item === -1 && status !== 2
                    }"
                >
                    <view class="box">
                        <view
                            v-if="lineHeight === item"
                            class="active"
                        />
                        <view>
                            <template v-if="item !== -1">
                                <image
                                    class="image"
                                    :src="lotteryData[item].image"
                                />
                                <view class="title">
                                    {{ lotteryData[item].name }}
                                </view>
                            </template>
                            <template v-else>
                                <template v-if="status === 1">
                                    <view>活动未开始</view>
                                </template>
                                <template v-else-if="status === 2">
                                    <view
                                        v-if="num > 0"
                                        @click="clickLucks()"
                                    >
                                        抽奖X{{ num }}
                                    </view>
                                    <view v-else>
                                        暂无机会
                                    </view>
                                </template>
                                <template v-else-if="status === 3">
                                    <view>活动已结束</view>
                                </template>
                            </template>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../common/api';
// 计数器
let interval = null;
// 值越大旋转时间越长  即旋转速度
const intime = 60;
export default {
    props: {
        lotteryData: {
            type: Array,
            default() {
                return [];
            },
        },
        num: {
            type: Number,
            default: 0,
        },
        status: {
            type: Number,
            default: 1, // 1未开始 2进行中 3已结束
        },
    },
    data() {
        return {
            lotteryPostion: [0, 1, 2, 7, -1, 3, 6, 5, 4],
            clickLuck: true,
            start: false,
            lineHeight: '',
        };
    },
    methods: {
        // 点击抽奖按钮
        clickLucks() {
            if (this.clickLuck) {
                // 设置按钮不可点击
                this.clickLuck = false;
                this.$emit('initLottery');
                api.isLogin().then(
                    (res) => {
                        this.userInfo = res;
                        // 清空计时器
                        clearInterval(interval);
                        this.$emit('start');
                    },
                    () => {
                        this.clickLuck = true;
                    },
                );
            }
        },
        startLottery(id = '') {
            this.start = true;
            let index = 0;
            // 循环设置每个奖项的选中、未选中状态
            interval = setInterval(() => {
                if (index > 7) {
                    index = 0;
                }
                this.lineHeight = index;
                index += 1;
            }, intime);
            // 如果未中奖 luckIndex 为7
            const luckIndex = id === '' || !id
                ? 7
                : this.lotteryData.findIndex(v => v.id === id);
            this.stop(luckIndex);
        },
        stop(which) {
            // 清空计数器
            clearInterval(interval);
            // 初始化当前位置
            let current = -1;
            for (let i = 0; i < this.lotteryData.length; i += 1) {
                if (i === this.lineHeight) {
                    current = i;
                }
            }
            // 下标从1开始
            const index = current + 1;
            this.stopLuck(which, index, intime, 10);
        },
        stopLuck(which, index, time, splittime) {
            let i = index;
            // 值越大出现中奖结果后减速时间越长
            setTimeout(() => {
                if (i > 7) {
                    i = 0;
                }
                // 当前位置为选中状态
                this.lineHeight = i;
                // 如果旋转时间过短或者当前位置不等于中奖位置则递归执行
                // 直到旋转至中奖位置
                if (time < 400 || i !== which) {
                    // 越来越慢
                    // eslint-disable-next-line no-param-reassign
                    splittime += 1;
                    // eslint-disable-next-line no-param-reassign
                    time += splittime;
                    // 当前位置+1
                    i += 1;
                    this.stopLuck(which, i, time, splittime);
                } else {
                    if (which === 7) {
                        this.$emit('notwinning', this.lotteryData[which]);
                    } else {
                        this.$emit('winning', this.lotteryData[which]);
                    }
                    this.reset();
                }
            }, time);
        },
        reset() {
            this.clickLuck = true;
        },
    },
};
</script>

<style lang="less" scoped>
.container {
    width: 670upx;
    margin: 0 auto;
    padding-bottom: 10upx;
    background-color: #ff867d;
    border-radius: 30upx;
}
.frame-view {
    width: 670upx;
    height: 598upx;
    border-radius: 30upx;
    box-sizing: border-box;
    margin: 0 auto;
    background-color: #ffa19a;
    padding: 30upx;
    border-radius: 30upx;
    box-sizing: border-box;
    position: relative;
    .bot-box {
        height: 30upx;
        display: flex;
        position: absolute;
        top: 0;
        left: -7upx;
        right: -7upx;
        align-items: center;
        flex-direction: row;
        .bot {
            width: 19upx;
            height: 19upx;
            margin: 0 20upx;
            border-radius: 50%;
        }
        &.row-1,
        &.row-3,
        &.row-4 {
            .bot {
                background: rgba(255, 198, 194, 1);
                box-shadow: 0px 2upx 4upx 0px rgba(255, 105, 77, 1),
                    0px 2upx 2upx 0px rgba(255, 255, 255, 0.5);
                &:nth-child(even) {
                    background: rgba(255, 228, 99, 1);
                    box-shadow: 0px 2upx 4upx 0px rgba(255, 105, 77, 1),
                        0upx 2upx 2upx 0px rgba(255, 255, 255, 0.5);
                }
            }
        }
        &.row-1,
        &.row-3 {
            .bot {
                &:first-of-type {
                    margin-left: 20upx;
                }
                &:last-of-type {
                    margin-right: 20upx;
                }
            }
        }
        &.row-1 {
            .bot {
                &:first-of-type,
                &:last-of-type {
                    margin-top: 10upx;
                }
            }
        }
        &.row-3 {
            .bot {
                &:first-of-type,
                &:last-of-type {
                    margin-bottom: 10upx;
                }
            }
        }

        &.row-2 {
            .bot {
                background: rgba(255, 228, 99, 1);
                box-shadow: 0px 2upx 4upx 0px rgba(255, 105, 77, 1),
                    0upx 2upx 2upx 0px rgba(255, 255, 255, 0.5);
                &:nth-child(even) {
                    background: rgba(255, 198, 194, 1);
                    box-shadow: 0px 2upx 4upx 0px rgba(255, 105, 77, 1),
                        0px 2upx 2upx 0px rgba(255, 255, 255, 0.5);
                }
            }
        }
        &.row-2,
        &.row-4 {
            width: 30upx;
            padding: 39upx 0;
            left: 0;
            right: auto;
            flex-direction: column;
            height: 100%;
            box-sizing: border-box;
            .bot {
                margin: 20upx 0;
            }
        }
        &.row-3 {
            top: auto;
            bottom: 0;
        }
        &.row-4 {
            left: auto;
            right: 0;
        }
    }
    .frame-view-box {
        background-color: #ff5a4c;
        border-radius: 30upx;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        height: 100%;
        width: 100%;
        justify-content: space-between;
        padding: 10upx;
        box-sizing: border-box;
    }
}
.frame-item {
    width: 190upx;
    height: 166upx;
    background-color: #ffa19a;
    box-shadow: 0px 2upx 6upx 0px rgba(245, 19, 0, 1);
    border-radius: 20upx;
    color: #c50e00;
    .image {
        width: 120upx;
        height: 90upx;
        display: block;
        margin: 0 auto 10upx;
    }
    .title {
        width: 100%;
        text-align: center;
        font-size: 26upx;
    }
    .box {
        width: 190upx;
        height: 156upx;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        border-radius: 20upx;
        position: relative;
        color: #c50e00;
    }
    .active {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(255, 228, 100, 0.5);
        border-radius: 20upx;
        z-index: 10;
    }
    &.btn {
        background-color: #ffd300;
        &.disabled {
            background-color: #ddd;
            .box {
                background-color: #ccc;
                color: #fff;
            }
        }
        .box {
            background-color: #ffe464;
            color: #ff5547;
            font-size: 36upx;
            font-weight: 600;
        }
    }
}
</style>
