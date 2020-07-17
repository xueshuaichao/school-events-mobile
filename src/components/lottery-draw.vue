<template>
    <view class="container">
        <view class="frame-view">
            <view class="frame-view-box">
                <view
                    v-for="(item, index) in lotteryPostion"
                    :key="index"
                    class="frame-item"
                    :class="{ btn: item === -1 }"
                >
                    <view class="box">
                        <view
                            v-if="item !== -1 && lotteryData[item].show"
                            class="active"
                        />
                        <template v-if="item !== -1">
                            <!-- <image :src="lotteryData[item].image" /> -->
                            <template v-if="item === 7">
                                <view class="title">
                                    谢谢参与
                                </view>
                            </template>
                            <view
                                v-else
                                class="title"
                            >
                                {{ lotteryData[item].name }}
                            </view>
                        </template>
                        <template v-else>
                            <view @click="clickLucks()">
                                抽奖X10
                            </view>
                        </template>
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
        image: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            lotteryPostion: [0, 1, 2, 7, -1, 3, 6, 5, 4],
            lotteryData: [
                {
                    image: '',
                    name: '111',
                },
                {
                    image: '',
                    name: '222',
                },
                {
                    image: '',
                    name: '333',
                },
                {
                    image: '',
                    name: '444',
                },
                {
                    image: '',
                    name: '555',
                },
                {
                    image: '',
                    name: '666',
                },
                {
                    image: '',
                    name: '777',
                },
                {
                    image: '',
                    name: '谢谢参与',
                },
            ],
            clickLuck: true,
            luckPosition: 1,
        };
    },
    methods: {
        // 点击抽奖按钮
        clickLucks() {
            if (this.clickLuck) {
                // 设置按钮不可点击
                this.clickLuck = false;
                api.isLogin().then(
                    (res) => {
                        this.userInfo = res;
                        // 清空计时器
                        clearInterval(interval);
                        api.get('/api/user/info').then((res) => {
                            // res.id = Math.floor((Math.random() * 7));
                            let index = 0;
                            // 循环设置每个奖项的选中、未选中状态
                            interval = setInterval(() => {
                                if (index > 7) {
                                    index = 0;
                                    this.$set(
                                        this.lotteryData[7],
                                        'show',
                                        false,
                                    );
                                } else if (index !== 0) {
                                    this.$set(
                                        this.lotteryData[index - 1],
                                        'show',
                                        false,
                                    );
                                }
                                this.$set(
                                    this.lotteryData[index],
                                    'show',
                                    true,
                                );
                                index += 1;
                            }, intime);

                            if (Array.isArray(res) && res.length === 0) {
                                // 未中奖
                                this.stop(7);
                            } else {
                                this.luckPosition = this.lotteryData.findIndex(
                                    v => v.id === res.id,
                                );
                                this.stop(res.id);
                            }
                        });
                    },
                    () => {
                        this.clickLuck = true;
                    },
                );
            }
        },
        stop(which) {
            // 清空计数器
            clearInterval(interval);
            // 初始化当前位置
            let current = -1;
            for (let i = 0; i < this.lotteryData.length; i += 1) {
                if (this.lotteryData[i].show) {
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
                    this.$set(this.lotteryData[7], 'show', false);
                } else if (i !== 0) {
                    this.$set(this.lotteryData[i - 1], 'show', false);
                }
                // 当前位置为选中状态
                this.$set(this.lotteryData[i], 'show', true);
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
                        this.$emit('notWinning', this.lotteryData[which]);
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
    }
    &.btn {
        .box {
            background-color: #ffe464;
            color: #ff5547;
        }
    }
}
.frame-item > view {
    display: block;
    width: 100%;
    font-size: 26upx;
    text-align: center;
}
.frame-item > view.img {
    width: 114upx;
    height: 90upx;
    line-height: 30upx;
    margin: 0 auto;
    margin-top: 20upx;
}
.frame-item > view.title {
    line-height: 30upx;
    padding-top: 40upx;
}
</style>
