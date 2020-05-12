<template>
    <view class="packet-rain">
        <template v-if="countDownTime">
            <view class="count-down">
                <view>倒计时：{{ countDownTime }}</view>
            </view>
        </template>
        <template v-else>
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
                    @click="handelPacket(index)"
                />
            </view>
        </template>
    </view>
</template>

<script>
export default {
    props: {
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
                    max: 5500,
                    min: 3000,
                };
            },
        },
    },
    data() {
        return {
            countDownTime: this.countDown,
            packetList: [],
            isShow: true,
            animationData: [],
            postion: {
                // 初始化位置
                max: 350, // 最右边
                min: 10, // 最左
            },
            windowHeight: 1200,
        };
    },
    watch: {
        hideIndex() {
            this.$set(this.packetList[this.hideIndex], 'isShow', false);
        },
        packetList(val) {
            this.$nextTick(() => {
                if (val.length) {
                    this.animation.translateY(this.windowHeight).step({
                        duration: this.randomNumBoth(
                            this.speed.max,
                            this.speed.min,
                        ),
                    });
                    this.animationData.push(this.animation.export());
                }
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
            this.setPacketList();
            let time = 1000;
            const T = setInterval(() => {
                if (time >= this.time) {
                    clearInterval(T);
                    this.result();
                } else {
                    this.setPacketList();
                    time += 1000;
                }
            }, 1000);
        },
        setPacketList() {
            this.packetList.push({
                src: this.images[
                    Math.floor(Math.random() * this.images.length)
                ],
                isShow: true,
                postion: this.randomNumBoth(this.postion.max, this.postion.min),
            });
        },
        randomNumBoth(max, min = 0) {
            let num = 0;
            const Range = max - min;
            const Rand = Math.random();
            num = min + Math.round(Rand * Range);
            return num;
        },
        handelPacket(index) {
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
    background-color: #000;
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
</style>
