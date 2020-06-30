<template>
    <view class="modal-content">
        <view
            :class="[
                'modal-content-box',
                type === 1 || type === 2 ? 'rule' : ''
            ]"
        >
            <view
                v-if="type === 0"
                class="rule-content"
            >
                <view class="box-bg">
                    <view class="box-scroll">
                        <view
                            v-if="title"
                            class="title"
                        >
                            {{ title }}
                        </view>
                        <view class="text-box">
                            <view
                                v-for="(item, index) in dataList"
                                :key="index"
                                class="item"
                            >
                                <view class="tit-btn">
                                    {{ item.title }}
                                </view>
                                <view
                                    v-for="(list, k) in item.list"
                                    :key="k"
                                    class="text"
                                >
                                    <view
                                        class="text-title"
                                        :style="list.textConfig"
                                    >
                                        {{ list.text }}
                                    </view>
                                    <view
                                        v-for="(children, i) in list.children"
                                        :key="i"
                                        class="text-children"
                                    >
                                        <view>
                                            <text class="dot" />{{ children }}
                                        </view>
                                    </view>
                                </view>
                            </view>
                            <view class="rule-box">
                                <view
                                    v-for="(item, index) in ruleList"
                                    :key="index"
                                >
                                    <view class="tit">
                                        {{ item.title }}
                                    </view>
                                    <view
                                        v-for="(list, k) in item.text"
                                        :key="k"
                                        class="text"
                                    >
                                        {{ list }}
                                    </view>
                                    <view class="tips">
                                        {{ item.tips || "" }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="qr-code">
                    <view class="text">
                        本次活动最终解释权在法律允许的范围内归活动举办方所有
                    </view>
                </view>
            </view>
            <view
                v-else-if="type === 1"
                class="prize-content"
            >
                <view class="box-bg">
                    <view class="box-scroll">
                        <view class="title">
                            {{ title }}
                        </view>
                        <view class="text-box">
                            <view
                                v-for="(item, index) in prizeList"
                                :key="index"
                            >
                                <view class="tit-btn">
                                    {{ item.title }}
                                </view>
                                <view
                                    v-for="(list, k) in item.list"
                                    :key="k"
                                    class="text"
                                >
                                    <image
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_prize_icon_${list.icon}.png`
                                        "
                                        mode=""
                                    />
                                    <view class="t">
                                        {{ list.text }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view
                v-else-if="type === 2"
                class="expert-content"
            >
                <view class="box-bg">
                    <view class="box-scroll">
                        <view class="img-box">
                            <image :src="data.avatar | optimizeImage" />
                        </view>
                        <view class="text-box">
                            <view class="name">
                                {{ data.name }}
                                <text
                                    v-if="data.technical"
                                    class="tag"
                                >
                                    {{ data.technical }}
                                </text>
                            </view>
                            <view
                                v-for="(item, i) in data.desc.text"
                                :key="i"
                                class="text-item"
                            >
                                {{ item }}
                            </view>
                            <view
                                v-if="data.desc.result"
                                class="result"
                            >
                                <view class="result-tit">
                                    研究成果
                                </view>
                                <view
                                    v-for="(item, k) in data.desc.result"
                                    :key="k"
                                    class="result-item"
                                >
                                    {{ item }}
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view
                class="close"
                @click="close()"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
                    mode=""
                />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 325;
            const height = 155;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        type: {
            type: Number,
            default: 0,
        },
        data: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            dataList: [
                {
                    title: '活动时间',
                    list: [
                        {
                            text: '海选：7月1日—24日',
                        },
                        {
                            text: '复选：7月25日-28日，28日公布结果',
                        },
                        {
                            text: '专家评选：7月28日-31日，31日公布结果',
                        },
                    ],
                },
                {
                    title: '参赛对象',
                    list: [
                        {
                            text: '3-18岁儿童、青少年均可报名参与',
                        },
                    ],
                },
                {
                    title: '奖项设置',
                    list: [
                        {
                            text: '1、所有参赛选手都将获得1张专属电子海报',
                        },
                        {
                            text:
                                '2、复选前20名选手将获得组委会颁发的荣誉奖杯，同时获得代言人的选手仅发代言人奖杯',
                        },
                        {
                            text: '3、形象代言人（8位）',
                            children: [
                                '登上世界吉尼斯嘉年华的舞台，为青少年“爱挑战”代言',
                                '“形象代言人”奖杯',
                                '3张世界吉尼斯嘉年华特邀入场券',
                                '官方包装宣传&精美定制礼盒1套',
                            ],
                        },
                        {
                            text: '4、人气之星（20位）',
                            children: [
                                '人气之星奖杯',
                                '2张世界吉尼斯嘉年华特邀入场券',
                            ],
                        },
                        {
                            text: '5、组织单位奖（5个）',
                            children: ['优秀组织单位奖奖杯'],
                        },
                        {
                            text: '6、伯乐奖（8位）',
                            children: [
                                '8位代言人的推荐老师将获得“伯乐奖”奖杯及“精美官方定制礼盒1套”',
                            ],
                        },
                    ],
                },
                {
                    title: '评选规则',
                    list: [],
                },
            ],
            ruleList: [
                {
                    title: '代言人评选规则',
                    text: [
                        '1、海选：作品点赞量超过100的选手获得进入复选资格',
                        '2、复选：大赛组委根据选手的表现力、作品质量等综合评选20位优秀选手进入专家评选',
                        '3、专家评选：评审团综合评分排名前8名者当选“形象代言人”',
                    ],
                    tips:
                        '（温馨提示）：尽量上传多个不同作品，向评委展示多才多艺的一面，更容易脱颖而出哦～',
                },
                {
                    title: '人气之星评选规则：',
                    text: ['作品点赞量排名前20名者当选“人气之星”'],
                },
                {
                    title: '组织单位评选规则：',

                    text: ['上传作品数量排名前5名的学校将获得优秀组织单位奖'],
                },
                {
                    title: '伯乐奖评选规则：',

                    text: ['8位“形象代言人”参赛时所报的推荐老师，将获得“伯乐奖'],
                },
            ],
            prizeList: [
                {
                    title: '8位形象代言人',
                    list: [
                        {
                            text: '为爱挑战代言登世界吉尼斯舞台',
                            icon: 0,
                        },
                        {
                            text: '“形象代言人”奖荣誉奖杯、证书',
                            icon: 1,
                        },
                        {
                            text: '世界吉尼斯嘉年华特邀入场券*3',
                            icon: 2,
                        },
                        {
                            text: '官方包装宣传及官方定制礼盒1套',
                            icon: 3,
                        },
                    ],
                },
                {
                    title: '20位人气之星',
                    list: [
                        {
                            text: '人气之星奖杯',
                            icon: 4,
                        },
                        {
                            text: '世界吉尼斯嘉年华特邀入场券*2',
                            icon: 2,
                        },
                    ],
                },
                {
                    title: '5个优秀组织单位',
                    list: [
                        {
                            text: '优秀组织单位奖奖杯',
                            icon: 5,
                        },
                    ],
                },
                {
                    title: '8个伯乐奖',
                    list: [
                        {
                            text: '伯乐奖奖杯及精美定制礼盒1套',
                            icon: 3,
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>
<style lang="less" scoped>
.modal-content {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    .modal-content-box {
        position: absolute;
        background-color: #8f6fff;
        width: 690upx;
        max-height: 968upx;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -54%);
        padding: 20upx;
        box-sizing: border-box;
        border-radius: 40upx;
        &.rule {
            background: #8f6fff;
        }
        .box-scroll {
            height: 100%;
            overflow: auto;
        }
        .box-bg {
            background: rgba(255, 255, 255, 1);
            box-shadow: inset 0px 0px 24upx 0px rgba(151, 129, 255, 1);
            border-radius: 40upx;
            padding: 45upx 20upx 20upx;
            height: 848upx;
            box-sizing: border-box;
            .item {
                &:first-of-type {
                    .tit-btn {
                        margin-top: 0;
                    }
                }
            }
            .tit-btn {
                background: linear-gradient(
                    rgba(255, 141, 133, 1),
                    rgba(255, 87, 73, 1)
                );
                border-radius: 28upx;
                font-size: 28upx;
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 56upx;
                padding: 0 26upx;
                display: inline-block;
                margin-top: 30upx;
                margin-bottom: 16upx;
            }
            .text {
                color: #656565;
                font-size: 28upx;
                line-height: 40upx;
            }
            .text-children {
                color: #656565;
                font-size: 28upx;
                line-height: 40upx;
            }
            .dot {
                width: 10upx;
                height: 10upx;
                border-radius: 50%;
                display: inline-block;
                margin-right: 10upx;
                background-color: #999;
                position: relative;
                top: -6upx;
            }
        }
        .title {
            height: 70upx;
            line-height: 70upx;
            padding: 0 73upx;
            color: #fff;
            font-size: 34upx;
            font-weight: 600;
            text-align: center;
            background: linear-gradient(
                rgba(255, 141, 133, 1),
                rgba(255, 87, 73, 1)
            );
            border-radius: 34upx;
            position: absolute;
            left: 50%;
            top: -35upx;
            transform: translateX(-50%);
        }
        .rule-box {
            .tit {
                color: #333;
                font-size: 28upx;
                line-height: 40upx;
            }
            .tips {
                color: #ff675b;
                font-size: 28upx;
                margin-bottom: 38upx;
            }
        }
        .qr-code {
            display: flex;
            justify-content: center;
            color: #fff;
            font-size: 22upx;
            margin-top: 39upx;
            & > image {
                width: 180upx;
                height: 180upx;
                margin-right: 30upx;
            }
            .text {
                margin-bottom: 39upx;
            }
        }
        .rule-content {
            .text-box {
                .item {
                    &:nth-of-type(3) {
                        .text {
                            &:nth-of-type(4),
                            &:nth-of-type(5),
                            &:nth-of-type(6),
                            &:nth-of-type(7) {
                                .text-title {
                                    color: #6b4cff;
                                    font-size: 28upx;
                                }
                            }
                        }
                    }
                }
            }
        }

        .prize-content {
            text-align: center;
            border-radius: 40upx;
            box-sizing: border-box;
            .box-bg {
                height: 928upx;
            }
            .tit {
                border-radius: 25upx;
                height: 50upx;
                line-height: 50upx;
                font-size: 26upx;
                padding: 0 53upx;
                display: inline-block;
                color: #fff;
                margin: 0 auto;
            }
            .text {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80upx;
                color: #fff;
                font-size: 26upx;
                line-height: 1;
                & > image {
                    width: 40upx;
                    height: 40upx;
                    margin-right: 24upx;
                }
                .t {
                    width: 380upx;
                    text-align: left;
                    color: #666;
                }
            }
        }
        .expert-content {
            .box-bg {
                max-height: 928upx;
                height: auto;
                padding: 0;
            }
            .box-scroll {
                padding-top: 310upx;
                position: relative;
            }
            .img-box {
                height: 310upx;
                margin-top: -2upx;
                position: absolute;
                top: -2upx;
                left: -2upx;
                right: -2upx;
                & > image {
                    width: 100%;
                    height: 100%;
                    border-radius: 30upx 30upx 0 0;
                }
            }
            .text-box {
                padding: 38upx 40upx 40upx;
                .name {
                    font-size: 40upx;
                    line-height: 1;
                    font-weight: 600;
                    text-align: center;
                    margin-bottom: 35upx;
                    .tag {
                        color: #6a4ee3;
                        font-size: 30upx;
                        display: inline-block;
                        margin-left: 30upx;
                    }
                }
                .text-item,
                .result-tit {
                    position: relative;
                    padding-left: 38upx;
                    line-height: 40upx;
                    font-size: 26upx;
                    color: #333;
                    &::before {
                        content: "";
                        width: 0;
                        height: 0;
                        border-top: 10upx solid transparent;
                        border-bottom: 10upx solid transparent;
                        border-left: 18upx solid #906fff;
                        position: absolute;
                        left: 0;
                        top: 10upx;
                    }
                }
                .result {
                    margin-top: 30upx;
                }
                .result-tit {
                    font-weight: bold;
                }
                .result-item {
                    padding-left: 38upx;
                    line-height: 40upx;
                    font-size: 26upx;
                    color: #333;
                }
            }
        }
    }
    .close {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 63upx;
        height: 63upx;
        bottom: -103upx;
        & > image {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
