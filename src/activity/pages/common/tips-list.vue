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
                    <view class="icon-horn" />
                    <view class="swiper-info">
                        <text> 用户{{ item.user_name | plusXing }} </text>
                        <text>{{ text }}</text>
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
                    <text>刚刚</text>
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
    width: 100%;
    height: 46upx;
    background: #05af7c;
    border-radius: 23upx;
    padding: 0 20upx;
    font-size: 24rpx;
    box-sizing: border-box;
    margin: 0 auto;
    line-height: 46rpx;
    margin-top: 20rpx;
    .swiper {
        width: 100%;
        height: 100%;
        .swiper-item {
            position: relative;
            height: 100%;
            padding-left: 82upx;
            .icon-horn {
                position: absolute;
                left: 30upx;
                width: 31upx;
                height: 26upx;
                top: 50%;
                transform: translateY(-50%);
                background-image: url("../../../static/images/yiqing/horn.png");
                background-size: 100% 100%;
            }
            .swiper-info {
                float: left;
                width: 80%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                display: inline-block;
                color: #fff;
                & > text:nth-child(1) {
                    color: #ffde6d;
                }
                & > text:nth-child(2) {
                    color: #fff;
                    margin: 0 5upx;
                }
                & > text:nth-child(3) {
                    color: #ffde6d;
                }
                & > text:nth-child(4) {
                    color: #ffde6d;
                }
            }

            & > text:last-child {
                color: #fff;
                float: right;
            }
        }
    }
}
</style>
