<template>
    <view class="result-content">
        <view class="result-item spokes-man">
            <view class="title">
                8位形象代言人
            </view>
            <view class="box">
                <view
                    v-for="(item, index) in dataList.spokesman"
                    :key="index"
                    class="item"
                >
                    <view class="item-img">
                        <image
                            :src="item.image"
                            mode=""
                        />
                    </view>
                    <view class="item-name-school">
                        <view class="name text-one-line">
                            {{ item.name }}
                        </view>
                        <view class="school text-two-line">
                            {{ item.school_name }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="result-item mood-man">
            <view class="title">
                20位人气之星
            </view>
            <view class="box">
                <view class="item box-hd">
                    <text>排名</text>
                    <text>用户名</text>
                    <text>人气值</text>
                </view>
                <view
                    v-for="(item, index) in dataList.moodMan"
                    :key="index"
                    class="item"
                >
                    <view class="item-index">
                        {{ (index + 1) | setNum }}
                        <image
                            :src="item.image"
                            mode=""
                        />
                    </view>
                    <view class="item-info">
                        <view class="name text-one-line">
                            {{ item.name }}
                        </view>
                        <view class="name text-two-line">
                            {{ item.school }}
                        </view>
                    </view>
                    <view class="item-value">
                        <text>{{ item.mood }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    filters: {
        setNum(val) {
            return val < 10 ? `0${val}` : val;
        },
    },
    props: {
        dataList: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {};
    },
};
</script>
<style lang="less" scoped>
.result-content {
    .result-item {
        position: relative;
        border: 3upx solid #ff8e85;
        border-radius: 20upx;
        margin-bottom: 71upx;
        .title {
            position: absolute;
            left: 50%;
            top: -32upx;
            transform: translateX(-50%);
            min-width: 384upx;
            color: #fff;
            font-size: 34upx;
            line-height: 64upx;
            text-align: center;
            background: linear-gradient(
                rgba(255, 142, 133, 1),
                rgba(255, 87, 74, 1)
            );
        }
        &.spokes-man {
            padding: 61upx 25upx;
            box-sizing: border-box;
        }
        &.mood-man {
            padding-top: 28upx;
            box-sizing: border-box;
        }
    }
    .spokes-man {
        .box {
            display: flex;
            justify-content: center;
        }
        .item {
            width: 190upx;
            margin: 0 15upx 39upx;
        }
        .item-img {
            height: 253upx;
            margin-bottom: 19upx;

            & > image {
                width: 100%;
                height: 100%;
                border-radius: 10upx;
            }
        }
        .name,
        .school {
            font-size: 22upx;
            color: #fff;
        }
        .name {
            line-height: 1;
            margin-bottom: 14upx;
        }
        .school {
            line-height: 30upx;
            margin-bottom: 14upx;
        }
    }
    .mood-man {
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .item-index,
            & > text:nth-of-type(1) {
                width: 255upx;
                text-align: center;
            }
            .item-info,
            & > text:nth-of-type(2) {
                width: 280upx;
            }
            .item-value {
                flex: 1;
            }
            image {
                width: 70upx;
                height: 70upx;
                border-radius: 50%;
            }
        }
    }
}
</style>
