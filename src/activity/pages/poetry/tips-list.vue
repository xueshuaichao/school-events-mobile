<template>
    <view
        v-if="crouselList.length > 0"
        class="page-section-spacing"
    >
        <swiper
            class="swiper"
            :indicator-dots="false"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            vertical="true"
            circular="true"
            :disable-touch="true"
            easing-function="easeInOutCubic"
        >
            <swiper-item
                v-for="item in crouselList"
                :key="item.id"
            >
                <view class="swiper-item">
                    <view class="swiper-info">
                        <text> 用户{{ item.user_name | plusXing }} </text>
                        <text> {{ text }} </text>
                        <text v-if="item.cat_name">
                            #{{ item.cat_name }}#
                        </text>
                        <text>
                            {{
                                item.resource_name ||
                                    item.draw ||
                                    item.prize_name
                            }}
                        </text>
                    </view>
                </view>
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    filters: {
        plusXing: (val) => {
            if (val.length === 11) {
                return `${val.substr(0, 3)}****${val.substr(7)}`;
            }
            return val;
        },
    },
    props: {
        text: {
            type: String,
            default: '发布了',
        },
        crouselList: {
            type: Array,
            default() {
                return [];
            },
        },
    },
};
</script>

<style lang="less" scoped>
// 跑马灯
.page-section-spacing {
    width: 750upx;
    height: 118upx;
    box-sizing: border-box;
    margin: 10upx 0 20upx -50upx;
    line-height: 46upx;
    font-size: 24upx;
    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-juzhou.png);
    background-size: 100% 100%;
    .swiper {
        width: 444upx;
        height: 46upx;
        padding: 36upx 0 0 144upx;
        .swiper-item {
            position: relative;
            height: 100%;
            padding-left: 2upx;
            text-align: center;
            .swiper-info {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                color: #254834;
            }
        }
    }
}
</style>
