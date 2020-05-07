<template>
    <view class="packet-rain">
        <view
            v-for="(item, index) in packetList"
            :key="index"
            class="pakcet-item"
            :style="{
                left: `${item.postion}px`
            }"
            :animation="animationData[index]"
        >
            <image
                class="pakcet-item-img"
                :src="item.src"
                @click="handelPacket(item.id)"
            />
        </view>
    </view>
</template>

<script>
export default {
    props: {
        isShow: {
            type: Boolean,
            default: false,
        },
        listNum: {
            // 总红包数
            type: Number,
            default: 100,
        },
        images: {
            // 红包样式
            type: Array,
            default() {
                return [];
            },
        },
        num: {
            // 每次掉落个数
            type: Number,
            default: 5,
        },
        postion: {
            // 掉落位置
            type: Object,
            default() {
                return {
                    max: 5000,
                    min: 10,
                };
            },
        },
        speed: {
            // 掉落速度
            type: Object,
            default() {
                return {
                    max: 1000000,
                    min: 3000,
                };
            },
        },
    },
    data() {
        return {
            packetList: [],
            animationData: [],
        };
    },
    created() {
        this.animation = uni.createAnimation({
            timingFunction: 'ease',
        });
        this.init();
        // this.rotateAndScaleThenTranslate();
    },
    methods: {
        init() {
            const packetList = [];
            for (let i = 0; i < this.listNum; i += 1) {
                packetList.push({
                    id: i,
                    src: this.images.length,
                    rotate: 10,
                    postion: this.randomNumBoth(500, 10),
                });
                this.rotateAndScaleThenTranslate(i);
            }
            this.packetList = packetList;
            // this.$set(this.packetList,packetList)
        },
        randomNumBoth(max, min = 0) {
            let num = 0;
            const Range = max - min;
            const Rand = Math.random();
            num = min + Math.round(Rand * Range);
            return num;
        },
        handelPacket(id) {
            console.log(id);
        },
        rotateAndScaleThenTranslate(index) {
            this.animation.translateY(600).step({ duration: 1000 });
            this.animationData[index] = this.animation.export();
            // console.log(111,this.animation)
        },
    },
};
</script>

<style lang="less" scoped>
.packet-rain {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background-color: #000;
}
.pakcet-item {
    position: absolute;
    // top: -50upx;
    width: 20upx;
    height: 40upx;
    background-color: #f00;
}
</style>
