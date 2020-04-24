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
                    <image src="/static/images/yiqing/horn.png" />
                    <view class="swiper-info">
                        <text :style="{ color: tipsColor.mainColor }">
                            用户{{ item.user_name | plusXing }}
                        </text>
                        <text>发布了</text>
                        <text :style="{ color: tipsColor.mainColor }">
                            #{{ item.cat_name }}#
                        </text>
                        <text>{{ item.resource_name }}</text>
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
        crouselList: {
            type: Array,
            default() {
                return [];
            },
        },
        textColor: {
            type: String,
            default: '#ffde6d',
        },
    },
    computed: {
        tipsColor() {
            return this.$store.state.activity.tipsColor;
        },
    },
};
</script>

<style lang="less" scoped>
// 跑马灯
.page-section-spacing {
    width: 710upx;
    height: 46upx;
    background: #05af7c;
    border-radius: 23upx;
    padding: 0 20upx;
    font-size: 24rpx;
    box-sizing: border-box;
    margin-left: 20rpx;
    line-height: 46rpx;
    margin-top: 20rpx;
    .swiper {
        width: 100%;
        height: 100%;
        .swiper-item {
            image {
                float: left;
                width: 37upx;
                height: 26upx;
                margin-right: 9upx;
                // vertical-align: middle;
                margin-top: 11rpx;
            }
            .swiper-info {
                float: left;
                width: 560upx;
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
