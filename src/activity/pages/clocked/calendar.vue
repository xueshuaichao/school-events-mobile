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
                src="/activity/static/clocked/jiazi.png"
            />
            <image
                class="jiazi jiazi2"
                src="/activity/static/clocked/jiazi.png"
            />
            <image
                class="jiazi jiazi3"
                src="/activity/static/clocked/jiazi.png"
            />
            <image
                class="jiazi jiazi4"
                src="/activity/static/clocked/jiazi.png"
            />
        </view>
        <view class="calendar-main">
            <view class="integral-txt">
                <view>累计积分</view>
                <view class="all-integral">
                    {{ signinfo.points }}
                </view>
                <view>
                    积分
                </view>
                <view class="margin">
                    |
                </view>
                <view>
                    连续打卡
                </view>
                <view class="max-day">
                    {{ signinfo.serial_day }}
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
                            v-for="(item, name, index) in list"
                            :key="name"
                            class="item"
                            :data-name="name"
                            :data-key="item.type + item.status + index"
                            :class="{
                                grey: item.grey,
                                passed: item.type && !item.isToday && ismyself
                            }"
                            @click="jumpUpload(item.isToday)"
                        >
                            <template
                                v-if="
                                    (ismyself &&
                                        ((!item.isToday && item.status) ||
                                        (item.isToday && item.type))) ||
                                        (!ismyself && item.status === 1)
                                "
                            >
                                <image
                                    :src="getPath(item)"
                                    class="icon"
                                />
                            </template>
                            <template v-else>
                                <view class="item-txt">
                                    {{ item.txt }}
                                </view>
                            </template>
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
                        {{
                            status
                                ? status === 1
                                    ? "立即打卡"
                                    : "今日已打卡"
                                : "选择主题打卡"
                        }}
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
        calendarData: {
            type: Object,
            default: () => {},
        },
        status: {
            type: Number,
            default: 0, // 0选择主题打卡，立即打卡，今日已打卡
        },
        signinfo: {
            type: Object,
            default: () => {},
        },
        ismyself: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            list2: ['日', '一', '二', '三', '四', '五', '六'],
            list: {},
        };
    },
    watch: {
        calendarData(list) {
            if (list) {
                this.setList();
            }
        },
    },
    created() {
        this.setInitArgust();
    },
    methods: {
        jumpUpload(status) {
            if (status === 1) {
                this.$emit('toggleCalendar');
            }
        },
        setList() {
            const keys = Object.keys(this.calendarData);
            keys.forEach((d) => {
                if (this.list[d]) {
                    this.list[d] = Object.assign(
                        {},
                        this.calendarData[d],
                        this.list[d],
                    );
                }
            });
        },
        getPath(item) {
            const path = `/activity/static/clocked/ka/ka-${item.status}-${
                item.draw
            }-${item.type - 1}.png`;
            return path;
        },
        isPassedDay(d) {
            //  利用隐式转换，判断日期过去了没有。
            const date = new Date();
            const month = date.getMonth() + 1 > 10
                ? date.getMonth() + 1
                : `0${date.getMonth() + 1}`;
            const time = `${date.getFullYear()}${month}${date.getDate()}`;
            let passed = 0;
            // 0 过去了 1，当天，2 未来。
            if (d < time) {
                passed = 0;
            } else if (d === time) {
                passed = 1;
            } else if (d > time) {
                passed = 2;
            }
            return passed;
        },
        setInitArgust() {
            const july = {};
            const august = {};
            const september = {};
            let key = '';
            for (let i = 0; i < 42; i += 1) {
                if (i > 36) {
                    key = `202009${i > 45 ? i - 36 : `0${i - 36}`}`;
                    september[key] = {
                        grey: 1,
                        txt: i - 36,
                        isToday: this.isPassedDay(key),
                    };
                } else if (i > 5) {
                    key = `202008${i > 14 ? i - 5 : `0${i - 5}`}`;
                    august[key] = {
                        grey: 0,
                        txt: i - 5,
                        isToday: this.isPassedDay(key),
                    };
                } else {
                    key = `202007${i + 26}`;
                    july[key] = {
                        grey: 1,
                        txt: i + 26,
                        isToday: this.isPassedDay(key),
                    };
                }
            }
            this.list = Object.assign({}, august, july, september);
            // 1 当月的第一天，
        },
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
                margin: 16upx 8upx 0;
                border-radius: 4upx;
            }
            .margin {
                margin: 0 14upx;
                color: #ffb4a6;
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
                    .item-txt {
                        margin: 0 auto;
                        width: 50upx;
                        height: 50upx;
                        line-height: 50upx;
                        box-sizing: border-box;
                    }
                    &.grey {
                        color: #999;
                    }
                    &.passed {
                        .item-txt {
                            border-radius: 50%;
                            border: 2upx solid #eee;
                            color: #eee;
                        }
                    }
                    .icon {
                        width: 50upx;
                        height: 50upx;
                    }
                }
            }
        }
        .calendar-tip {
            text-align: center;
            font-size: 22upx;
            line-height: 60upx;
            color: #ff685c;
            font-weight: 500;
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
                font-size: 32upx;
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
