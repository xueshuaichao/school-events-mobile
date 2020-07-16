<template>
    <view class="my-calendar">
        <view class="top-title">
            <view class="top">
                打卡日历
            </view>
            <view class="txt">
                你每天的小坚持，都会有大意义！
            </view>
            <image
                class="jiazi jiazi1"
                src="/activity/static/locked/jiazi.png"
            />
            <image
                class="jiazi jiazi2"
                src="/activity/static/locked/jiazi.png"
            />
            <image
                class="jiazi jiazi3"
                src="/activity/static/locked/jiazi.png"
            />
            <image
                class="jiazi jiazi4"
                src="/activity/static/locked/jiazi.png"
            />
        </view>
        <view class="calendar-main">
            <view class="integral-txt">
                <view>累计积分</view>
                <view class="all-integral">
                    100
                </view>
                <view>积分|连续打卡</view>
                <view class="max-day">
                    28
                </view>
                <view>天</view>
            </view>
            <view class="white-bg">
                <view class="calendar-wrap">
                    <view class="title">
                        2020年08月
                    </view>
                    <view class="flex-wrap">
                        <view
                            v-for="(item, index) in list2"
                            :key="index"
                            class="item top"
                        >
                            {{ item }}
                        </view>
                        <view
                            v-for="(item, index) in list"
                            :key="index + 'index'"
                            class="item"
                        >
                            {{ item }}
                        </view>
                    </view>
                </view>
            </view>
            <template v-if="showBtn">
                <view class="calendar-tip">
                    打卡得积分，积分兑好礼～
                </view>
                <view class="calendar-btn">
                    <view
                        class="btn-txt"
                        @click="toggleCalendar"
                    >
                        选择主题打卡
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        showBtn: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            list2: ['日', '一', '二', '三', '四', '五', '六'],
            list: [
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                12,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
            ],
        };
    },
    methods: {
        toggleCalendar() {
            this.$emit('toggleCalendar');
        },
    },
};
</script>
<style scoped lang="less">
.my-calendar {
    margin-top: 30upx;
    padding: 0 30upx;
    position: relative;
    &::before {
        position: absolute;
        left: 30upx;
        height: 24upx;
        width: 690upx;
        background: #ffa19a;
        bottom: -10upx;
        content: "";
        border-radius: 0 0 20upx 20upx;
    }
    .top-title {
        height: 122upx;
        background: linear-gradient(
            180deg,
            rgba(255, 162, 132, 1) 0%,
            rgba(255, 104, 76, 1) 100%
        );
        box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5) inset;
        border-radius: 20upx 20upx 0 0;
        color: #fff;
        text-align: center;
        position: relative;
        .top {
            font-size: 38upx;
            line-height: 56upx;
            padding-top: 14upx;
        }
        .txt {
            font-size: 24upx;
        }
        .jiazi {
            position: absolute;
            width: 32upx;
            height: 87upx;
            top: -10upx;
        }
        .jiazi1 {
            left: 50upx;
        }
        .jiazi2 {
            left: 122upx;
        }
        .jiazi4 {
            right: 50upx;
        }
        .jiazi3 {
            right: 122upx;
        }
    }
    .calendar-main {
        background: #ffdada;
        border-radius: 0 0 20upx 20upx;
        padding-bottom: 24upx;
        position: relative;
        .integral-txt {
            color: #d60f00;
            font-size: 30upx;
            line-height: 84upx;
            display: flex;
            justify-content: center;
            letter-spacing: 2upx;
            font-weight: 500;
            .all-integral,
            .max-day {
                font-size: 40upx;
                color: #ffb900;
                background: #fff;
                height: 50upx;
                padding: 0 8upx;
                line-height: 54upx;
                margin: 16upx 6upx 0;
                border-radius: 4upx;
            }
        }
        .white-bg {
            padding: 0 30upx 30upx;
        }
        .calendar-wrap {
            position: relative;
            background: #fff;
            box-shadow: 0 4upx 10upx 0 rgba(255, 218, 218, 0.5);
            border-radius: 10upx;
            padding-top: 20upx;
            &::before,
            &::after {
                position: absolute;
                content: "";
            }
            &::before {
                width: 610upx;
                left: 10upx;
                bottom: -12upx;
                height: 12upx;
                background: rgba(255, 255, 255, 0.6);
                box-shadow: 0 4upx 10upx 0 rgba(255, 218, 218, 0.5);
                border-radius: 0 0 12upx 12upx;
            }
            &::after {
                width: 590upx;
                left: 20upx;
                bottom: -22upx;
                height: 10upx;
                background: rgba(255, 255, 255, 0.4);
                box-shadow: 0 4upx 10upx 0 rgba(255, 175, 175, 1);
                border-radius: 0 0 10upx 10upx;
            }
            .title {
                text-align: center;
                color: #333;
                font-size: 28upx;
                font-weight: 600;
                margin-bottom: 16upx;
            }
            .flex-wrap {
                display: flex;
                font-size: 26upx;
                flex-wrap: wrap;
                justify-content: normal;
                .top {
                    color: #ff685c;
                }
                .item {
                    width: 90upx;
                    height: 60upx;
                    text-align: center;
                    line-height: 60upx;
                }
            }
        }
        .calendar-tip {
            text-align: center;
            font-size: 22upx;
            line-height: 60upx;
            color: #ff685c;
        }
        .calendar-btn {
            width: 400upx;
            height: 68upx;
            margin-left: 144upx;
            position: relative;
            .btn-txt {
                position: relative;
                width: 100%;
                height: 100%;
                z-index: 1;
                background: rgba(255, 228, 100, 1);
                border-radius: 34upx;
                line-height: 68upx;
                text-align: center;
                color: #ff5547;
                font-weight: 500;
                box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5) inset;
            }
            &::after {
                position: absolute;
                width: 400upx;
                content: "";
                background: #ffd300;
                left: 0;
                bottom: -4upx;
                height: 34upx;
                border-radius: 0 0 34upx 34upx;
            }
        }
    }
}
</style>
