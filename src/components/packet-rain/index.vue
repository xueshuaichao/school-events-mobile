<template>
    <view class="packet-rain">
        <template v-if="countDownTime">
            <view class="count-down">
                <view>倒计时：{{ countDownTime }}s</view>
            </view>
        </template>
        <template v-else>
            <!-- <view class="game-time">
                游戏时间<text>{{ gameTime/1000 }}</text>
            </view> -->
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
                    @click="handelPacket(item, index)"
                />
                <view
                    v-if="item.isShowNum"
                    class="packet-num"
                >
                    +{{ item.num }}
                </view>
            </view>
        </template>
    </view>
</template>

<script>
export default {
    props: {
        num: {
            // 每次掉落最多
            type: Number,
            default: 6,
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
                    width: 40,
                    height: 60,
                };
            },
        },
        images: {
            // 红包样式
            type: Array,
            default() {
                return [
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_prize1.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_prize2.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_prize3.png',
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize3.png',
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
                    max: 3500,
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
            packetNum: 0,
            packetNumSum: 0,
        };
    },
    watch: {
        hideIndex() {
            this.$set(this.packetList[this.hideIndex], 'isShowNum', true);
            setTimeout(() => {
                this.$set(this.packetList[this.hideIndex], 'isShow', false);
            }, 300);
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
                    this.gameTime -= 100;
                }, 200);
            });
        },
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
            const T = setInterval(() => {
                this.countDownTime -= 1000;
                if (this.countDownTime === 0) {
                    clearInterval(T);
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
            const T = setInterval(() => {
                if (this.gameTime === 0) {
                    clearInterval(T);
                    this.result();
                } else {
                    this.maxNum = this.randomNumBoth(this.num, 1);
                    this.setPacketList();
                }
            }, 400);
        },
        setPacketList() {
            for (let i = 0; i < this.maxNum; i += 1) {
                this.packetList.push({
                    src: this.images[
                        Math.floor(Math.random() * this.images.length)
                    ],
                    num: this.randomNumBoth(10, 1),
                    isShowNum: false,
                    isShow: true,
                    postion: this.randomNumBoth(
                        this.postion.max,
                        this.postion.min,
                    ),
                });
            }
        },
        randomNumBoth(max, min = 0) {
            return parseInt(Math.random() * (max - min + 1) + min, 10);
        },
        handelPacket(item, index) {
            this.$emit('handelClick', index);
        },
        result() {
            this.$emit('result');
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
    background-color: #f00;
    color: #fff;
}
.packet-rain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 990;
    background-color: rgba(0, 0, 0, 0.79);
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
    color: #f00;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
