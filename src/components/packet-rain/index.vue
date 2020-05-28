<template>
    <view class="packet-rain">
        <template v-if="!isEnd">
            <view class="get-packet-num-sum">
                <view class="num-box">
                    已抢糖果
                    <text class="num">
                        {{ packetNumSum }}
                    </text>个
                </view>
            </view>
            <template v-if="countDownTime">
                <view class="count-down">
                    <view class="count-down-num">
                        {{ countDownTime / 1000 }}
                    </view>
                    <view class="count-down-tips">
                        在糖果雨中收集越多糖果，<br>越容易赢得大奖哦
                    </view>
                </view>
            </template>
            <template v-else>
                <view class="game-time">
                    游戏时间<text>{{ gameTime / 1000 }}</text>
                </view>
                <view
                    v-for="(item, index) in packetList"
                    v-show="item.isShow"
                    :key="index"
                    class="pakcet-item"
                    :style="{
                        left: `${item.postion}px`,
                        width: `${imgSize.width}px`,
                        height: `${imgSize.height}px`,
                        top: `-${imgSize.height + 20}px`
                    }"
                    :animation="animationData[index]"
                >
                    <image
                        class="pakcet-item-img"
                        :src="item.src"
                        @touchstart="handelPacket(item, index)"
                    />
                    <view
                        v-if="item.isShowNum"
                        class="packet-num"
                    >
                        +{{ item.num }}
                    </view>
                </view>
            </template>
        </template>
    </view>
</template>

<script>
export default {
    props: {
        num: {
            // 每次掉落最多
            type: Number,
            default: 4,
        },
        countDown: {
            // 倒计时
            type: Number,
            default: 0,
        },
        hideIndex: {
            type: Number,
            default: -1,
        },
        imgSize: {
            // 红包大小
            type: Object,
            default() {
                return {
                    width: 80,
                    height: 80,
                };
            },
        },
        images: {
            // 红包样式
            type: Array,
            default() {
                return [
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy1.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy2.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy3.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy4.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy5.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy6.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy7.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy8.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy9.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy10.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy11.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy12.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy13.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy14.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy15.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy16.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy17.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy18.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/candy19.png',
                ];
            },
        },
        time: {
            // 持续时间 ms
            type: Number,
            default: 20000,
        },
        speed: {
            // 掉落速度
            type: Object,
            default() {
                return {
                    max: 3000,
                    min: 2000,
                };
            },
        },
    },
    data() {
        return {
            countDownTime: this.countDown,
            gameTime: this.time,
            packetList: [],
            animationData: [],
            postion: {
                // 初始化位置
                max: 350, // 最右边
                min: 10, // 最左
            },
            windowHeight: 1200,
            packetNumSum: 0,
            isEnd: false,
            countT: null,
            T: null,
            Time: null,
        };
    },
    watch: {
        hideIndex() {
            this.$set(this.packetList[this.hideIndex], 'isShowNum', true);
            setTimeout(() => {
                this.$set(this.packetList[this.hideIndex], 'isShow', false);
            }, 400);
        },
        packetList(val) {
            this.$nextTick(() => {
                setTimeout(() => {
                    if (val.length) {
                        for (let i = 0; i < this.maxNum; i += 1) {
                            this.animation.translateY(this.windowHeight).step({
                                duration: this.randomNumBoth(
                                    this.speed.max,
                                    this.speed.min,
                                ),
                            });
                            this.animationData.push(this.animation.export());
                        }
                    }
                }, 200);
            });
        },
    },
    beforeDestroy() {
        console.log(11111434343);
        clearInterval(this.countT);
        clearInterval(this.T);
        clearInterval(this.Time);
    },
    created() {
        if (this.countDownTime) {
            this.countDownFn();
        } else {
            this.createAnimation();
        }
    },
    methods: {
        countDownFn() {
            this.countT = setInterval(() => {
                this.countDownTime -= 1000;
                if (this.countDownTime === 0) {
                    clearInterval(this.countT);
                    this.createAnimation();
                }
            }, 1000);
        },
        createAnimation() {
            this.animation = uni.createAnimation();
            const that = this;
            uni.getSystemInfo({
                success(res) {
                    const { windowWidth, windowHeight } = res;
                    that.postion.max = windowWidth - (that.imgSize.width + 10);
                    that.windowHeight = windowHeight + that.imgSize.height + 20;
                    that.init();
                },
            });
        },
        init() {
            this.maxNum = this.randomNumBoth(1, this.num);
            this.setPacketList();
            this.T = setInterval(() => {
                this.maxNum = this.randomNumBoth(this.num, 1);
                this.setPacketList();
            }, 400);
            this.Time = setInterval(() => {
                this.gameTime -= 1000;
                if (this.gameTime === 0) {
                    clearInterval(this.T);
                    clearInterval(this.Time);
                    setTimeout(() => {
                        this.isEnd = true;
                        this.result();
                    }, this.speed.max);
                }
            }, 1000);
        },
        setPacketList() {
            let postionMax = this.postion.max;
            const postionMin = this.postion.min;
            for (let i = 0; i < this.maxNum; i += 1) {
                const postion = this.randomNumBoth(postionMax, postionMin);
                this.packetList.push({
                    src: this.images[
                        Math.floor(Math.random() * this.images.length)
                    ],
                    num: this.randomNumBoth(10, 1),
                    isShowNum: false,
                    isShow: true,
                    postion,
                });
                if (postion > this.postion.max / 2) {
                    postionMax = this.postion.max / 2;
                } else {
                    postionMax = this.postion.max;
                }
            }
        },
        randomNumBoth(max, min = 0) {
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        },
        handelPacket(item, index) {
            this.packetNumSum += item.num;
            this.$emit('handelClick', index);
        },
        result() {
            this.$emit('result', this.packetNumSum);
        },
    },
};
</script>

<style lang="less" scoped>
.count-down {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 990;
    color: #fff;
    text-align: center;
    .count-down-num {
        margin-top: 175upx;
        font-size: 120upx;
        color: #bb77ff;
    }
    .count-down-tips {
        font-size: 32upx;
        line-height: 60upx;
    }
}
.packet-rain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1002;
    background-color: rgba(0, 0, 0, 0.79);
}
.get-packet-num-sum {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 179upx;
    z-index: 1003;
    text-align: center;
    color: #fff;
    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_packet_footer.png");
    background-size: 100% 100%;
    .num-box {
        font-size: 35upx;
        line-height: 220upx;
        padding-left: 10upx;
    }
    .num {
        font-size: 60upx;
        min-width: 155upx;
        text-align: center;
        display: inline-block;
        text-shadow: 0px 2upx 4upx rgba(150, 47, 255, 1);
    }
}
.game-time {
    color: #fff;
    text-align: center;
    font-size: 40upx;
}
.pakcet-item {
    position: absolute;
    top: -50upx;
    transform: translateY(-100px);
}
.pakcet-item-img {
    width: 100%;
    height: 100%;
}
.packet-num {
    color: #fff;
    font-size: 80upx;
    position: absolute;
    top: 50%;
    color: #ff559f;
    left: 50%;
    width: 239upx;
    height: 246upx;
    line-height: 246upx;
    transform: translate(-50%, -50%);
    text-align: center;
    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/packet_num_bg.png);
    background-position: center center;
    background-size: 100% 100%;
    z-index: 10;
}
</style>
