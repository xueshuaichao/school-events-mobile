<template>
    <view
        class="prize"
        :style="{
            'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize.png)`
        }"
    >
        <view
            v-for="(item, index) in prizeList"
            :key="index"
            class="prize-item"
        >
            <text class="prize-text-1">
                {{ item.text[0] }}
            </text>
            <image
                class="prize-img"
                :style="{ border: `1px solid ${borderColor}` }"
                :src="
                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize${index +
                        1}.png`
                "
            />
            <text
                class="prize-text-2"
                :style="{ color: textColor }"
            >
                {{ item.text[1] }}
            </text>
        </view>
        <view class="prize-item">
            <image
                class="prize-img-text"
                :src="
                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_prize5.png`
                "
                @click="handleActiverule"
            />
        </view>
    </view>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: '',
        },
        borderColor: {
            type: String,
            default: '',
        },
        textColor: {
            type: String,
            default: '',
        },
        prizeList: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    methods: {
        handleActiverule() {
            this.$emit('handleActiveprize');
        },
    },
};
</script>

<style lang="less" scoped>
.prize {
    height: 242upx;
    width: 725upz;
    margin: 0 12upx;
    background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    padding: 0 47upx;
    display: flex;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .prize-item {
        font-size: 20upx;
        text-align: center;
        width: 141upx;
        height: 176upx;
        &:last-of-type {
            height: 238upx;
            width: 169upx;
        }
        .prize-text-1 {
            color: #ff3442;
            width: 100%;
            font-size: 24upx;
        }
        .prize-text-2 {
            color: #08986d;
            width: 100%;
        }
        .prize-img {
            width: 110upx;
            height: 110upx;
            border-radius: 10upx;
        }
        .prize-img-text {
            width: 100%;
            height: 100%;
            margin-top: 16upx;
            display: block;
        }
    }
}
</style>
