<template>
    <view
        v-if="show"
        class="poetry-modal"
        @touchmove.stop.prevent="moveHandle"
    >
        <view class="modal-main">
            <view class="modal-body">
                <scroll-view
                    class="modal-body-scroll"
                    :scroll-y="true"
                >
                    <view class="modal-box">
                        <view class="title">
                            <text>
                                奖项设置
                            </text>
                        </view>
                        <view
                            v-for="(item, index) in prizeList"
                            :key="index"
                            class="prize"
                        >
                            <view class="title">
                                <text v-if="item.title">
                                    {{ item.title }}
                                </text>
                                <template v-if="!Array.isArray(item.desc)">
                                    <view class="desc">
                                        {{ item.desc }}
                                    </view>
                                </template>
                                <template v-else>
                                    <view
                                        v-for="(text, t) in item.desc"
                                        :key="t"
                                        class="desc"
                                    >
                                        {{ text }}
                                    </view>
                                    <view v-if="index === 5">
                                        <image
                                            class="qr-code"
                                            src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/qrcode.jpg"
                                            mode=""
                                        />
                                    </view>
                                </template>
                            </view>

                            <view class="box clearfix">
                                <view
                                    v-for="(list, k) in item.list"
                                    :key="k"
                                    class="item"
                                >
                                    <view
                                        class="item-img"
                                        :class="{ big: index === 4 }"
                                    >
                                        <image
                                            :src="
                                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/images/poetry_prize_${index}_${k}.jpg`
                                            "
                                        />
                                    </view>

                                    <view class="text">
                                        {{ list }}
                                    </view>
                                    <view class="num">
                                        <template v-if="item.num">
                                            {{ item.num[k] }}
                                        </template>
                                    </view>
                                </view>
                            </view>
                            <view
                                v-if="item.prize_desc"
                                class="prize-desc"
                            >
                                <view
                                    v-for="(desc, d) in item.prize_desc"
                                    :key="d"
                                    class="list"
                                >
                                    <view class="t">
                                        {{ desc.tit }}
                                    </view>
                                    <view class="text">
                                        {{ desc.text }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <image
                class="close"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry_close.png"
                @click="toggelModel"
            />
        </view>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            prizeList: [
                {
                    title: '闯关幸运奖',
                    desc: '参与诗词闯关抽奖活动，即有机会获得如下奖品：',
                    list: [
                        '小度音响',
                        '学生旅行箱',
                        '家用计时器',
                        '唐诗宋词楷书字帖',
                        '无人机',
                        '袁文魁记忆力课',
                    ],
                },
                {
                    title: '闯关达人奖',
                    desc: '参与诗词闯关关卡数量排名前20的作者可获得如下奖品：',
                    list: ['小爱触屏音箱8', '九阳养生壶', '便携式榨汁机'],
                    num: ['一等奖*2名', '二等奖*6名', '三等奖*12名'],
                    prize_desc: [
                        {
                            tit: '一等奖',
                            text:
                                '完成诗词闯关关卡数量第1、2名，每人可获得小爱触屏音箱8；',
                        },
                        {
                            tit: '二等奖',
                            text:
                                '完成诗词闯关关卡数量第3-8名，每人可获得九阳养生壶；',
                        },
                        {
                            tit: '三等奖',
                            text:
                                '完成诗词闯关关卡数量第9-20名，每人可获得便携式榨汁机；',
                        },
                    ],
                },
                {
                    title: '闯关人气将',
                    desc:
                        '参与诗词作品点赞量排名前45作品的作者可获得如下奖品：',
                    list: ['苏泊尔豆浆机', '小米电水壶', '中国古风手账本套装'],
                    num: ['一等奖*2名', '二等奖*15名', '三等奖*28名'],
                    prize_desc: [
                        {
                            tit: '一等奖',
                            text: '获得点赞数第1、2名，每人可获得苏泊尔豆浆机；',
                        },
                        {
                            tit: '二等奖',
                            text: '获得点赞数第3-17名，每人可获得小米电水壶；',
                        },
                        {
                            tit: '三等奖',
                            text:
                                '获得点赞数第18-45名，每人可获得中国古风手账套装；',
                        },
                    ],
                },
                {
                    title: '优秀组织奖',
                    desc:
                        '根据各组织单位参与活动的积极性，评选出5个“优秀组织奖”颁发如下奖杯：',
                    list: ['优秀组织奖杯'],
                    num: ['共5个'],
                },
                {
                    title: '优秀管理员奖',
                    desc:
                        '荣获“优秀组织奖”的组织单位，其管理员可获得如下奖品、奖杯：',
                    list: ['奖杯+马克杯保温杯礼盒套装'],
                    num: ['共5个'],
                },
                {
                    title: '奖品领取说明',
                    desc: [
                        '1.虚拟物品：获得有书袁文魁记忆力课，请按照领取流程进行领取，如不会操作可加青少年爱挑战管理员微信进行咨询',
                        '2.实物发货：获得实物奖励需填写收货信息，待活动结束后10个工作日内通过快递从北京发出。如有问题可联系微信：aitiaozhan001（青少年爱挑战-管理员）。',
                    ],
                },
                {
                    title: '',
                    desc: [
                        '3.查询快递：工作人员将于2020年11月02日-11月13日期间，通过微信小助手或电话联系，告知快递单号，如微信和电话无法联系的将视为该用户自动放弃领奖资格。',
                        '4.本次活动所有奖品不提供发票、收据，不支持退换，收货时请确认无质量问题后签收。',
                        '5.本次活动一旦发现有作弊行为的用户，将取消参与资格，所得奖励一并取消。作弊行为包括但不限于：恶意上传无效作品；恶意牟利等扰乱活动秩序及本平台认为的其他不正当手段。',
                        '6.图片仅供参考，奖品以实物为准。',
                    ],
                },
            ],
        };
    },
    methods: {
        toggelModel() {
            this.$emit('toggelModel');
        },
        moveHandle() {
            return false;
        },
    },
};
</script>
<style scoped lang="less">
@import "./model.less";
.poetry-modal {
    .prize {
        margin-bottom: 16upx;
        &:nth-of-type(7) {
            margin-bottom: 0;
            & > .title {
                margin-bottom: 0;
            }
        }
        & > .title {
            text-align: center;
            color: #5d2708;
            font-size: 28upx;
            font-weight: 500;
            line-height: 40upx;
            text {
                position: relative;
                display: inline-block;
                line-height: 40upx;
                font-size: 28upx;
                font-weight: 500;
                color: #5d2708;
                &:before,
                &:after {
                    content: "";
                    position: absolute;
                    top: 50%;
                    margin-top: -6upx;
                    width: 18upx;
                    height: 12upx;
                    background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry_model_title.png")
                        no-repeat center center / 100% 100%;
                }
                &:before {
                    left: -22upx;
                }
                &:after {
                    right: -22upx;
                    transform: rotate(180deg);
                }
            }
            .desc {
                margin-top: 8upx;
                font-size: 24upx;
                color: #000;
                text-align: left;
                line-height: 34upx;
                &:last-of-type {
                    margin-bottom: 22upx;
                }
            }
            .qr-code {
                width: 214upx;
                height: 196upx;
                display: block;
                margin: 0 auto 10upx;
            }
        }
        .box {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            box-sizing: border-box;
        }
        .item {
            min-width: 144upx;
            text-align: center;
            flex: 1;
            margin-bottom: 24upx;
        }
        .item-img {
            width: 144upx;
            height: 142upx;
            border-radius: 4upx;
            margin: 0 auto 16upx;
            border: 2upx solid #f5cc9a;
            box-sizing: border-box;
            background-color: #fff;
            &.big {
                width: 324upx;
                height: 135upx;
                & > image {
                    width: 214upx;
                    height: 101upx;
                    margin-top: 20upx;
                }
            }
            & > image {
                width: 100%;
                height: 100%;
                margin-bottom: 14upx;
            }
        }
        .text,
        .num {
            line-height: 34upx;
            font-size: 12px;
            color: #000;
        }
        .prize-desc {
            color: #000;
            .t {
                font-size: 24upx;
                font-weight: 500;
            }
            .text {
                font-size: 24upx;
            }
        }
    }
}
</style>
