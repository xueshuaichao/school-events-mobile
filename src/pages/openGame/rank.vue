<template>
    <view class="rank-page">
        <!--筛选条件-->
        <view class="filter-wrap">
            <view class="filter-btn-block">
                <view
                    :class="
                        activeMenuIndex === 1
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(1)"
                >
                    竞技项目
                </view>
            </view>
            <view class="filter-btn-block">
                <view
                    :class="
                        activeMenuIndex === 2
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(2)"
                >
                    吉尼斯项目
                </view>
            </view>
            <view class="filter-btn-block">
                <view
                    :class="
                        activeMenuIndex === 3
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(3)"
                >
                    才艺秀项目
                </view>
            </view>
        </view>
        <!--下拉选择-->
        <!--排行榜-->
        <view class="content-list">
            <view class="top">
                一分钟跳绳
            </view>
            <view class="rank-item-title rank-item clearfix">
                <view class="rank-num fl-l">
                    排名
                </view>
                <view class="fl-l">
                    姓名
                </view>
                <view class="fl-l">
                    学校名称
                </view>
                <view class="fl-r">
                    成绩
                </view>
            </view>
            <view
                v-for="(item, index) in rankList"
                :key="index"
                class="rank-item rank-item-bar clearfix"
            >
                <view class="rank-num fl-l">
                    <template v-if="index < 3">
                        <image
                            :src="`/static/images/zhibo/rank-${index + 1}.png`"
                        />
                    </template>
                    <template v-else>
                        {{ index + 1 }}
                    </template>
                </view>
                <view class="fl-l">
                    hahhahaa
                </view>
                <view class="class-info fl-l">
                    渭南县第八小学三年级一班
                </view>
                <view class="fl-r">
                    212121个
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            activeMenuIndex: 1,
            rankList: [1, 2, 3, 4],
        };
    },
    methods: {
        clickMenu(val) {
            this.activeMenuIndex = val;
        },
    },
};
</script>
<style scoped lang="less">
.rank-page {
    background: #34349c;
    padding: 30upx;
    height: 100vh;
    box-sizing: border-box;
    overflow-x: hidden;
    .filter-wrap {
        text-align: center;
        overflow: hidden;
        .filter-btn-block {
            background: url("../../static/images/zhibo/toggleBtn-bg.png");
            width: 223upx;
            height: 116upx;
            background-size: 100% 100%;
            margin-right: 12upx;
            float: left;
            position: relative;
            &:nth-child(3) {
                margin-right: 0;
            }
            .txt-marker {
                height: 64upx;
                font-size: 32upx;
                text-align: center;
                line-height: 64upx;
                font-weight: 700;
                color: #000;
                background: #fff;
                position: absolute;
                top: 3upx;
                left: 3upx;
                right: 22upx;
            }
            .active {
                background: #9f1ff3;
                color: #fff;
            }
        }
    }
    .content-list {
        position: relative;
        background: #fff;
        width: 672upx;
        padding: 30upx;
        box-sizing: border-box;
        &::before {
            position: absolute;
            right: -18upx;
            top: 0;
            content: "";
            width: 18upx;
            height: 100%;
            background: #7c7cde;
            transform: skewY(45deg);
            margin-top: 9upx;
        }
        &::after {
            position: absolute;
            bottom: -18upx;
            left: 0;
            content: "";
            width: 100%;
            height: 18upx;
            background: #5151c6;
            transform: skewX(45deg);
            margin-left: 9upx;
        }
        .top {
            color: #333;
            font-weight: 500;
            font-size: 28upx;
            line-height: 80upx;
        }
        .rank-item-title {
            height: 54upx;
            line-height: 54upx;
            background: #faf4ff;
            color: #666;
            padding: 0 6upx;
        }
        .rank-item-bar {
            height: 80upx;
            color: #999;
            line-height: 80upx;
            padding: 0 10upx;
            border-bottom: 1px solid #cdcdcd;
        }
        .rank-item {
            .rank {
                width: 60upx;
            }
            .rank-num {
                height: 100%;
                width: 60upx;
                text-align: center;
                position: relative;
                image {
                    width: 34upx;
                    height: 42upx;
                    position: absolute;
                    left: 0;
                    top: 50%;
                    margin-top: -22upx;
                }
            }
        }
    }
}
</style>
