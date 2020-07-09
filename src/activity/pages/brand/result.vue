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
                    @click="jumpUcenter(item.user_id)"
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
                    :class="{ 'm-t-0': index < 3 }"
                    @click="jumpUcenter(item.user_id)"
                >
                    <view class="item-index">
                        {{ (index + 1) | setNum }}
                        <view class="image">
                            <image :src="item.image" />
                        </view>
                    </view>
                    <view class="item-info">
                        <view class="name text-one-line">
                            {{ item.name }}
                        </view>
                        <view class="school text-two-line">
                            {{ item.school_name }}
                        </view>
                    </view>
                    <view class="item-value text-one-line">
                        <text>{{ item.mood }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="result-item mood-man find-man">
            <view class="title">
                8位伯乐奖
            </view>
            <view class="box">
                <view class="item box-hd">
                    <text>老师姓名</text>
                    <text>学校名称</text>
                    <text>推荐学生</text>
                </view>
                <view
                    v-for="(item, index) in dataList.bole"
                    :key="index"
                    class="item"
                >
                    <view class="item-index">
                        {{ item.teacher }}
                    </view>
                    <view class="item-info">
                        <view class="school text-two-line">
                            {{ item.school_name }}
                        </view>
                    </view>
                    <view class="item-value">
                        <text>{{ item.student }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="result-item organization">
            <view class="title">
                优秀组织
            </view>
            <view class="box">
                <view
                    v-for="(item, index) in dataList.organization"
                    :key="index"
                    class="item"
                >
                    <view class="item-name-school text-one-line">
                        {{ item }}
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
        list: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            dataList: {},
        };
    },
    watch: {
        list: {
            handler(val) {
                this.dataList = val;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        jumpUcenter(id) {
            uni.navigateTo({
                url: `/activity/pages/brand/ucenter?activity_id=10&user_id=${id}`,
            });
        },
    },
};
</script>
<style lang="less" scoped>
.result-content {
    .result-item {
        position: relative;
        border: 3upx solid #ff8e85;
        border-radius: 20upx;
        margin-bottom: 64upx;
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
            font-weight: 600;
            background: linear-gradient(
                rgba(255, 142, 133, 1),
                rgba(255, 87, 74, 1)
            );
            background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_result_title.png");
            background-size: 100% 100%;
        }
        &.spokes-man {
            padding: 61upx 16upx 39upx;
            box-sizing: border-box;
        }
        &.mood-man {
            padding-top: 28upx;
            box-sizing: border-box;
        }
        &.organization {
            padding: 70upx 0 40upx;
            box-sizing: border-box;
        }
    }
    .spokes-man {
        background-color: #906fff;
        .box {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
        .item {
            width: 190upx;
            margin: 39upx 14upx 0;
            &.m-t-0 {
                margin-top: 0;
            }
        }
        .item-img {
            width: 190upx;
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
            word-break: break-all;
        }
        .name {
            line-height: 1;
            margin-bottom: 14upx;
        }
        .school {
            line-height: 26upx;
        }
    }
    .mood-man {
        background-color: #906fff;
        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 150upx;
            color: #fff;
            &:last-of-type {
                border-radius: 0 0 20upx 20upx;
            }
            &:first-of-type {
                height: 94upx;
                justify-content: space-between;
                font-size: 30upx;
                padding: 0 41upx;
                & > text:nth-of-type(2) {
                    margin-right: 80upx;
                }
            }
            &:nth-child(odd) {
                background-color: #906fff;
            }
            &:nth-child(even) {
                background-color: #a592ff;
            }
            &:nth-of-type(2) {
                .item-index,
                .item-value {
                    color: #ffc214;
                }
                .image {
                    border: 4upx solid #ffd125;
                    &::before {
                        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_star_1.png");
                    }
                }
            }
            &:nth-of-type(3) {
                .item-index,
                .item-value {
                    color: #b1c8ec;
                }
                .image {
                    border: 4upx solid #b1c8ec;
                    &::before {
                        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_star_2.png");
                    }
                }
            }
            &:nth-of-type(4) {
                .item-index,
                .item-value {
                    color: #ffa158;
                }
                .image {
                    border: 4upx solid #ffa158;
                    &::before {
                        background-image: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_star_3.png");
                    }
                }
            }
            &:nth-of-type(2),
            &:nth-of-type(3),
            &:nth-of-type(4) {
                .image {
                    position: relative;
                    box-sizing: border-box;
                    &::before {
                        content: "";
                        position: absolute;
                        top: -26upx;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 44upx;
                        height: 24upx;
                        background-size: 100% 100%;
                    }
                }
            }
            .item-index {
                font-weight: 500;
                .image {
                    margin-left: 37upx;
                    border-radius: 50%;
                    width: 70upx;
                    height: 70upx;
                }
            }
            .item-index,
            & > text:nth-of-type(1) {
                width: 214upx;
            }
            text:nth-of-type(1) {
                box-sizing: border-box;
            }
            .item-index {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30upx;
                width: 255upx;
            }
            .item-info,
            & > text:nth-of-type(2) {
                width: 223upx;
            }
            .item-info {
                margin-right: 44upx;
                .name {
                    font-size: 26upx;
                    font-weight: 500;
                }
                .school {
                    font-size: 22upx;
                }
            }
            .item-value {
                width: 172upx;
                text-align: center;
                font-size: 30upx;
                font-weight: 500;
            }
            image {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            .name,
            .school,
            .item-value {
                word-break: break-all;
            }
        }
    }
    .find-man {
        .item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 111upx;
            color: #fff;
            padding: 0 41upx;
            &:first-of-type {
                & > text:nth-of-type(2) {
                    margin-right: 45upx;
                }
            }
            &:nth-of-type(1),
            &:nth-of-type(2),
            &:nth-of-type(3) {
                .item-index,
                .item-value {
                    color: #fff;
                }
            }
            .item-index {
                display: block;
                color: #fff;
            }
            .item-index,
            & > text:nth-of-type(1) {
                width: 157upx;
                margin-right: 46upx;
            }
            .item-info,
            & > text:nth-of-type(2) {
                width: 220upx;
                margin-right: 45upx;
            }
            .item-value,
            & > text:nth-of-type(3) {
                width: 157upx;
            }
            .item-index,
            .item-value {
                font-size: 26upx;
                text-align: left;
            }
        }
    }
    .organization {
        background-color: #906fff;
        .item {
            color: #fff;
            padding: 0 41upx;
            margin-bottom: 24upx;
            &:last-of-type {
                margin-bottom: 0;
            }
        }
        .item-name-school {
            text-align: center;
            font-size: 30upx;
            line-height: 1;
            word-break: break-all;
        }
    }
}
</style>
