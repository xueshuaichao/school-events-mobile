<template>
    <view class="packet-rain">
        <view
            v-for="(item, index) in packetList"
            :key="index"
        >
            <image :src="item.src" />
        </view>
    </view>
</template>

<script>
export default {
    props: {
        listNum: {
            type: Number,
            default: 100,
        },
        images: {
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
        speed: {
            type: Object,
            default() {
                return {
                    max: 2000,
                    min: 100,
                };
            },
        },
    },
    data() {
        return {
            packetList: [],
        };
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.listNum.foreach((item, index) => {
                this.packetList.push({
                    id: index,
                    src: this.images.length,
                    rotate: 10,
                    postion: 10,
                    speed: 100,
                });
            });
        },
    },
};
</script>
