<template>
    <view
        v-if="show"
        class="clocked-theme"
    >
        <view class="modal-main">
            <view class="modal-top">
                选择你的打卡主题
                <image
                    class="jiazi"
                    src="/activity/static/clocked/jiazi.png"
                />
                <image
                    class="jiazi jiazi2"
                    src="/activity/static/clocked/jiazi.png"
                />
            </view>
            <view class="modal-body">
                <view class="tip">
                    任选一主题连续打卡七天，可获得勋章荣誉哦～
                </view>
                <view class="flex">
                    <view
                        v-for="item in list"
                        :key="item.id"
                        class="item"
                        @click="selItem(item)"
                    >
                        <image
                            class="img-bg"
                            :src="item.url"
                        />
                        <view class="txt">
                            {{ item.txt }}
                        </view>
                        <view class="daka">
                            打卡
                        </view>
                    </view>
                </view>
                <view class="extra-tip">
                    <view class="title-wrap">
                        <view class="title">
                            更有额外奖励哦～
                        </view>
                    </view>
                    <view class="extra-txt">
                        连续打卡7天可获得1次抽奖机会
                    </view>
                    <view class="extra-txt">
                        连续打卡14天可获得2次抽奖机会，且可额外获得100积分奖励
                    </view>
                    <view class="extra-txt">
                        连续打卡21天可获得3次抽奖机会，且可额外获得300积分奖励
                    </view>
                    <view class="extra-txt">
                        连续打卡28天可获得4次抽奖机会
                    </view>
                </view>
            </view>
        </view>
        <image
            class="close"
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
            @click="toggelModel"
        />
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            list: [
                {
                    txt: '劳动实践',
                    url: '/activity/static/clocked/1-theme.png',
                    id: 1,
                },
                {
                    txt: '读书学习',
                    url: '/activity/static/clocked/2-theme.png',
                    id: 2,
                },
                {
                    txt: '才艺展示',
                    url: '/activity/static/clocked/3-theme.png',
                    id: 3,
                },
                {
                    txt: '体育竞技',
                    url: '/activity/static/clocked/4-theme.png',
                    id: 4,
                },
            ],
        };
    },
    methods: {
        selItem(item) {
            this.$emit('toggelModel', item.id);
        },
        toggelModel() {
            this.$emit('toggelModel');
        },
    },
};
</script>
<style scoped lang="less">
.clocked-theme {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    left: 0;
    top: 0;
    z-index: 100;
    .modal-main {
        width: 690upx;
        margin: 100upx auto 0;
        position: relative;
        &::before {
            position: absolute;
            content: "";
            width: 100%;
            left: 0;
            bottom: -10upx;
            background: #ffa19a;
            height: 28upx;
            border-radius: 0 0 20upx 20upx;
        }
    }
    .modal-top {
        color: #fff;
        font-size: 32upx;
        line-height: 120upx;
        text-align: center;
        background: linear-gradient(
            180deg,
            rgba(255, 162, 132, 1) 0%,
            rgba(255, 104, 76, 1) 100%
        );
        box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5);
        border-radius: 20upx 20upx 0 0;
        position: relative;
        .jiazi {
            position: absolute;
            width: 32upx;
            height: 80upx;
            left: 60upx;
            top: -10upx;
        }
        .jiazi2 {
            right: 60upx;
            left: auto;
        }
    }
    .modal-body {
        background: #ffdada;
        border-radius: 0 0 20upx 20upx;
        padding: 0 30upx 30upx;
        box-sizing: border-box;
        overflow: auto;
        position: relative;
        .tip {
            color: #ff685c;
            font-size: 28upx;
            line-height: 88upx;
            text-align: center;
        }
        .flex {
            display: flex;
            justify-content: space-between;
            .item {
                width: 142upx;
                height: 192upx;
                position: relative;
                border-radius: 10upx;
                &::before {
                    content: "";
                    width: 100%;
                    height: 6upx;
                    background: #ffa19a;
                    border-radius: 0 0 10upx 10upx;
                    bottom: -4upx;
                    left: 0;
                    position: absolute;
                }
                .img-bg {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    border-radius: 10upx;
                }
                .txt {
                    position: absolute;
                    width: 100%;
                    bottom: 20upx;
                    left: 0;
                    font-size: 28upx;
                    text-align: center;
                    color: #666;
                    font-weight: 500;
                }
                .daka {
                    width: 70upx;
                    height: 34upx;
                    background: #ff685c;
                    position: absolute;
                    left: 0;
                    top: 10upx;
                    color: #fff;
                    font-size: 22upx;
                    text-align: center;
                    box-sizing: border-box;
                    padding-right: 10upx;
                    &::after {
                        content: "";
                        right: 0;
                        top: -4upx;
                        border-top: 20upx solid transparent;
                        border-bottom: 20upx solid transparent;
                        border-right: 10upx solid #fff;
                        position: absolute;
                    }
                }
            }
        }
        .extra-tip {
            height: 368upx;
            background: #fff;
            border-radius: 10upx;
            margin-top: 40upx;
            padding: 0 40upx 30upx 40upx;
            .title-wrap {
                position: relative;
                height: 56upx;
                .title {
                    width: 312upx;
                    margin-left: 128upx;
                    margin-top: -10upx;
                    height: 56upx;
                    color: #ff5547;
                    font-size: 28upx;
                    text-align: center;
                    line-height: 56upx;
                    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/tixing.png);
                    background-size: cover;
                    position: absolute;
                }
            }

            .extra-txt {
                line-height: 40upx;
                font-size: 26upx;
                margin-bottom: 20upx;
                color: #666;
            }
        }
    }
    .close {
        width: 60upx;
        height: 60upx;
        margin-top: 40upx;
        margin-left: 315upx;
    }
}
</style>
