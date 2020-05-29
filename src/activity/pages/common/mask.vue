<template>
    <div class="activity-rule-page">
        <!-- 规则 -->
        <view :class="['activerulebox', `mask-${name}`]">
            <view
                :class="[
                    'active-content',
                    `active-content-${type}`,
                    type === 2 && luckyAllTotal === 0
                        ? 'active-content-lucky'
                        : ''
                ]"
                :style="{ 'background-color': theme.bgColor }"
            >
                <view
                    v-if="type === 0 && name === 'children'"
                    class="rule-tips"
                >
                    本次活动最终解释权在法律允许的范围内归活动举办方所有。
                </view>
                <view
                    v-if="name"
                    class="close"
                    :style="{
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_close.png)`
                    }"
                    @click="handleClose"
                />
                <view
                    v-if="name"
                    class="title-icon"
                    :style="{
                        'background-image': `url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${name}_title.png)`
                    }"
                >
                    {{ title }}
                </view>
                <view class="active-rule-box">
                    <template v-if="type === 0">
                        <view class="rule-list-box">
                            <view
                                v-for="(ruleItem, index) in rules"
                                :key="index"
                            >
                                <view
                                    class="title"
                                    :style="{ color: theme.titleColor }"
                                >
                                    {{ ruleItem.title }}
                                </view>
                                <view class="text">
                                    <view
                                        v-for="(textItem, k) in ruleItem.texts"
                                        :key="k"
                                    >
                                        <template v-if="textItem.title">
                                            <view class="tit">
                                                {{ textItem.title }}
                                            </view>
                                            <view
                                                v-for="(list,
                                                        i) in textItem.list"
                                                :key="i"
                                                class="rule-list"
                                            >
                                                {{ list }}
                                            </view>
                                        </template>
                                        <template v-else>
                                            {{ textItem }}
                                        </template>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-else-if="type === 1">
                        <view class="prize-box">
                            <view
                                v-for="(prize, list) in prizeList"
                                :key="list"
                                class="prize-list"
                            >
                                <view class="prize-list-title">
                                    <view class="title-text children-btn">
                                        {{ prize.title }}
                                    </view>
                                </view>
                                <view class="desc">
                                    {{ prize.text }}
                                </view>
                                <view
                                    :class="[
                                        'prize-list-item',
                                        `prize-list-item-${list}`
                                    ]"
                                >
                                    <view
                                        v-for="(item, k) in prize.item"
                                        :key="k"
                                        class="prize-item"
                                    >
                                        <view class="prize-img">
                                            <image
                                                :src="
                                                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_${list}_${k}.png`
                                                "
                                            />
                                        </view>
                                        <view class="pirze-text">
                                            <text
                                                v-if="item.text[0]"
                                                class="pirze-rank"
                                            >
                                                {{ item.text[0] }}
                                            </text>
                                            <view>{{ item.text[1] }}</view>
                                        </view>
                                    </view>
                                </view>
                                <view
                                    v-if="list === 0"
                                    class="tips"
                                >
                                    <view class="tips-content">
                                        <view class="title">
                                            一等奖
                                        </view>
                                        <view>
                                            获得点赞数第1、2名，每人可获得小度音箱1个；
                                        </view>
                                        <view class="title">
                                            二等奖
                                        </view>
                                        <view>
                                            获得点赞数第3-8名，每人可获得儿童旅行箱1个；
                                        </view>
                                        <view class="title">
                                            三等奖
                                        </view>
                                        <view>
                                            获得点赞数第9-20名，每人可获得AR地球仪1个。
                                        </view>
                                    </view>
                                </view>
                                <view
                                    v-else
                                    class="tips"
                                >
                                    <view class="tips-content">
                                        航拍无人机、多功能棋盘、水彩笔套装36色、小米书包，奖品总数量共100份。
                                    </view>
                                </view>
                            </view>
                            <view class="prize-text-box">
                                <view class="title">
                                    奖品领取说明
                                </view>
                                <view class="text-item">
                                    1.每名参赛选手只有1次人气作品奖领取机会，如出现同一参赛选手获得不同奖项的情况，则以最高奖项为准。
                                </view>
                                <view class="text-item">
                                    2.工作人员将于2020年6月24日-6月30日期间电话联系获奖用户所绑定的手机号码，电话无法联系的将视为该用户自动放弃领奖资格。
                                </view>
                                <view class="text-item">
                                    3.奖品将于2020年6月30日开始通过普通快递陆续寄出。
                                </view>
                                <view class="text-item">
                                    4.本次活动所有奖品不提供发票、收据，不支持退换，收货时请确认无质量问题后签收。
                                </view>
                                <view class="text-item">
                                    5.若因用户提供的收货信息有误而未收到奖品，概不补发。
                                </view>
                                <view class="text-item">
                                    6.图片仅供参考，奖品以实物为准。
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-else-if="type === 2">
                        <view
                            v-if="luckyAllTotal === 0"
                            class="lucky-none"
                        >
                            <view>幸运奖就等你了，</view>
                            快来抽奖吧！
                        </view>
                        <scroll-view
                            v-else
                            class="lucky-list"
                            :scroll-y="true"
                            style="height: 400px"
                            :refresher-threshold="20"
                            @scrolltolower="getLuckyList"
                        >
                            <view
                                v-for="lucky in luckyListArr"
                                :key="lucky.id"
                                class="item text-one-line"
                            >
                                <text class="index-text" />
                                <text class="text">
                                    {{ lucky.user_name }}
                                </text>
                                <text>抽中了</text>
                                <text class="text">
                                    {{ lucky.draw }}
                                </text>
                            </view>
                        </scroll-view>
                    </template>
                    <template v-else-if="type === 3">
                        <view class="lottery-num">
                            <view class="lottery-title">
                                完成<text>每日任务</text>，获取更多<text>
                                    抽奖机会
                                </text>
                            </view>
                            <view class="lottery-item-box">
                                <view
                                    v-for="(lottery, index) in lotteryNum.type"
                                    :key="index"
                                    class="item"
                                >
                                    <text class="item-type">
                                        {{ lottery }}
                                    </text>
                                    <text class="item-text">
                                        获取一次抽奖机会
                                    </text>
                                    <view class="item-btn-box">
                                        <template v-if="index === 0">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur: lotteryNum.login > 0
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.login > 0
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.login > 0
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                        <template v-else-if="index === 1">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur:
                                                        lotteryNum.vote_num >= 5
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.vote_num >= 5
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.vote_num >= 5
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                        <template v-else-if="index === 2">
                                            <text
                                                class="chidren-btn item-btn"
                                                :class="{
                                                    cur:
                                                        lotteryNum.add_activity >
                                                        0
                                                }"
                                                @click="
                                                    getLotteryNum(
                                                        index,
                                                        lotteryNum.add_activity >
                                                            0
                                                    )
                                                "
                                            >
                                                {{
                                                    lotteryNum.add_activity > 0
                                                        ? "已完成"
                                                        : "去完成"
                                                }}
                                            </text>
                                        </template>
                                    </view>
                                </view>
                            </view>
                            <view class="tips">
                                快去赢得抽奖机会吧！
                            </view>
                        </view>
                    </template>
                    <template v-else-if="type === 4">
                        <view class="my-draw">
                            <template v-if="myDraw.status">
                                <veiw class="my-draw-list">
                                    <view class="my-draw-item">
                                        <image :src="myDraw.img" />
                                        <view class="name">
                                            <view>
                                                {{ myDraw.name
                                                }}<text
                                                    class="num"
                                                >
                                                    x1
                                                </text>
                                            </view>
                                            <view class="time">
                                                {{ myDraw.time }}
                                            </view>
                                        </view>
                                    </view>
                                </veiw>
                            </template>
                            <template v-else>
                                <div class="my-draw-list none">
                                    <image
                                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/my_draw_none.png"
                                    />
                                    <view>很遗憾！暂未中奖</view>
                                </div>
                            </template>

                            <view
                                class="get-draw-num"
                                @click="getPrizeNum"
                            >
                                <image
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/get_draw_num.png"
                                />
                            </view>
                        </view>
                    </template>
                    <view
                        v-if="showQrCode"
                        class="qr-wrap"
                    >
                        <image
                            class="qr-code"
                            src="http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/qrcode.jpg"
                        />
                        <view class="text">
                            关注“UP青少年爱挑战”公众号，了解更多信息。
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </div>
</template>

<script>
export default {
    props: {
        rules: {
            type: Array,
            default() {
                return [];
            },
        },
        luckyList: {
            type: Object,
            default() {
                return {};
            },
        },
        lotteryNum: {
            type: Object,
            default() {
                return {};
            },
        },
        prizeList: {
            type: Array,
            default() {
                return [];
            },
        },
        drawData: {
            type: Object,
            default() {
                return {};
            },
        },
        theme: {
            type: Object,
            default() {
                return {};
            },
        },
        name: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '标题',
        },
        type: {
            type: Number,
            default: 0,
        },
        showQrCode: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            luckyListArr: this.luckyList.list || [],
            luckyTotal: this.luckyList.list.lenght || 0,
            luckyAllTotal: -1,
            luckyNum: 1,
            lotteryType: this.lotteryNum.type || [],
            myDraw: {},
        };
    },
    watch: {
        luckyList: {
            handler(val) {
                const list = [];
                for (let i = 1; i < val.list.length + 1; i += 1) {
                    list.push(i);
                }
                this.luckyTotal = list.reverse();
                this.luckyListArr = val.list;
                this.luckyAllTotal = val.total;
            },
            deep: true,
            immediate: true,
        },
        drawData: {
            handler(val) {
                const drawDetail = [
                    '航拍无人机',
                    '多功能棋盘',
                    '水彩笔套装36色',
                    '小米书包',
                ];
                let index = val.draw;
                if (val.draw === 3) {
                    index = 4;
                } else if (val.draw === 4) {
                    index = 3;
                }
                const obj = {
                    name: drawDetail[index - 1],
                    img: `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_poster_${index}.png`,
                    time: val.created_at,
                    status: val.status,
                };
                this.myDraw = obj;
            },
            deep: true,
            immediate: true,
        },
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        getLuckyList() {
            console.log(111);
            this.$emit('getLuckyList', (this.luckyNum += 1));
        },
        getLotteryNum(index, type) {
            this.$emit('getNewLotteryNum', {
                index,
                type,
            });
        },
        getPrizeNum() {
            this.$emit('getPrizeNum');
        },
    },
};
</script>

<style lang="less" scoped>
.activity-rule-page {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    z-index: 999;
}
.activerulebox {
    background-color: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    color: #fff;
    z-index: 999;
    font-size: 24upx;
    &:first-child {
        font-size: 28upx;
    }
    .title {
        font-size: 28upx;
        color: #ffde6d;
        font-weight: bold;
        margin-bottom: 17upx;
    }

    .text {
        margin-bottom: 40upx;
        font-weight: 300;
        font-size: 28upx;
        color: #fff;
    }
    .title-icon {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 0upx;
        width: 303upx;
        height: 90upx;
        position: absolute;
        top: -43upx;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        line-height: 69upx;
        z-index: 222;
    }
    .close {
        background-repeat: no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background-color: #04a875;
        position: absolute;
        top: 62upx;
        left: 35upx;
        height: 92%;
        width: 678upx;
        padding: 76upx 30upx 38upx;
        box-sizing: border-box;
        padding-right: 20upx;
        border-radius: 46rpx;
        .active-rule-box {
            width: 100%;
            overflow-y: scroll;
            max-height: 100%;
            overflow-x: hidden;
        }
        .size {
            font-size: 28upx;
        }
    }
    .qr-wrap {
        .qr-code {
            width: 190rpx;
            height: 190rpx;
            display: block;
            margin: 35rpx auto 15rpx;
            border-radius: 15rpx;
        }

        .text {
            font-size: 24rpx;
            text-align: center;
        }
    }
    &.mask-children {
        z-index: 1002;
        .active-content {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -55%);
            .rule-tips {
                position: absolute;
                text-align: center;
                bottom: 21upx;
                left: 0;
                right: 0;
                font-size: 20upx;
            }
            &.active-content-0 {
            }
            &.active-content-1 {
            }
            &.active-content-4 {
                width: 640upx;
                height: 700upx;
                padding-left: 38upx;
                padding-right: 38upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_mask_footer_mini1.png);
            }
            &.active-content-lucky {
                width: 540upx;
                height: 526upx;
                padding-bottom: 312upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_mask_footer_mini.png);
            }

            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                width: 78px;
                height: 41px;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_flag1.png);
                background-size: 100% 100%;
            }
        }
        .chidren-btn {
            color: #fff;
            border-radius: 48upx;
            background-color: #ff78a5;
            box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
            position: relative;
            font-size: 28upx;
            display: inline-block;
            &::before {
                content: "";
                position: absolute;
                left: 10upx;
                top: 10upx;
                width: 21upx;
                height: 22upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
                background-size: 21upx 21upx;
                background-repeat: no-repeat;
            }
        }
        .active-content {
            box-shadow: inset 0px 0px 24upx 0px rgba(182, 146, 255, 0.57);
            border-radius: 56upx;
            padding-bottom: 250upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_mask_footer.png);
            background-repeat: no-repeat;
            background-size: 100% 248upx;
            background-position: bottom center;
        }

        .tit,
        .title-icon {
            padding: 0upx 40upx;
            line-height: 54upx;
            color: #fff;
            border-radius: 48upx;
            background-color: #ff78a5;
            box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
            position: relative;
            font-size: 28upx;
            display: inline-block;
            margin-bottom: 14upx;
            &::before {
                content: "";
                position: absolute;
                left: 10upx;
                top: 10upx;
                width: 21upx;
                height: 22upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
                background-size: 21upx 21upx;
                background-repeat: no-repeat;
            }
        }
        .rule-list {
            font-weight: normal;
            color: #666;
            line-height: 42upx;
            font-size: 26upx;
            margin-bottom: 20upx;
            text-indent: 12upx;
            position: relative;
            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 16upx;
                border-radius: 50%;
                width: 8upx;
                height: 8upx;
                background-color: #666;
            }
        }
        .title-icon {
            position: absolute;
            line-height: 74upx;
            height: 74upx;
            padding: 0 51upx;
            font-size: 32upx;
            box-sizing: border-box;
            top: -32upx;
        }
        .active-content {
            bottom: 96upx;
            max-height: 1000upx;
        }
        .close {
            bottom: -85upx;
            right: 50%;
            transform: translateX(50%);
            top: auto;
        }
        .rule-list-box {
            .title {
                color: #333;
            }
            .title,
            .text {
                display: inline-block;
                font-size: 28upx;
            }
            .title {
                font-weight: normal;
            }
            .text {
                color: #333;
                font-weight: bold;
                margin-bottom: 2upx;
            }
        }
        .prize-box {
            box-shadow: inset 0 0px 24upx 0px rgba(182, 146, 255, 1);
            background-color: #fff;
            margin: -120upx 0upx 40upx;
            border-radius: 50upx;
            padding: 0 20upx 48upx;
            .prize-list {
                border-bottom: 2upx #c790ff dashed;
                &:nth-of-type(2) {
                    border-bottom: 0 none;
                }
            }
            .prize-list-title {
                display: flex;
                justify-content: space-between;
                padding: 40upx 10upx 39upx 30upx;

                .title-text {
                    padding: 11upx 38upx;
                    color: #fff;
                    border-radius: 48upx;
                    background-color: #ff78a5;
                    box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
                    position: relative;
                    font-size: 32upx;
                    &::after {
                        content: "";
                        position: absolute;
                        right: -30rpx;
                        top: 5rpx;
                        width: 70rpx;
                        height: 60rpx;
                        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_a.png);
                        background-size: 100% 100%;
                    }
                }
                .handel-text {
                    color: #bb77ff;
                    font-size: 24upx;
                    font-weight: 500;
                    position: relative;
                    top: 10upx;
                    min-width: 166upx;
                    text-align: center;
                    &::after {
                        content: "";
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: 0upx;
                        width: 166upx;
                        height: 42upx;
                        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_flag.png);
                        background-size: 100% 100%;
                    }
                }
            }
            .prize-list-item {
                display: flex;
                justify-content: space-between;

                .prize-item {
                    border: 4upx solid #c790ff;
                    border-bottom: 0 none;
                    border-radius: 7upx;
                    box-sizing: border-box;
                    position: relative;
                    image {
                        width: 132upx;
                        height: 120upx;
                    }
                }
                .pirze-text {
                    position: absolute;
                    left: -8upx;
                    right: -8upx;
                    bottom: 0upx;
                    background-color: #c790ff;
                    border-radius: 0 0 10upx 10upx;
                    font-size: 20upx;
                    text-align: center;
                    color: #fff;
                    padding-top: 4upx;
                    padding-bottom: 2upx;
                    min-height: 36upx;
                    &::before {
                        content: "";
                        position: absolute;
                        top: -14upx;
                        left: 0;
                        right: 0;
                        height: 17upx;
                        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_bg.png);
                        background-position: top center;
                        background-size: 100% 100%;
                    }
                    .pirze-rank {
                        line-height: 26upx;
                        padding: 0 11upx;
                        background-color: #ffe79c;
                        color: #bb77ff;
                        display: inline-block;
                        border-radius: 16upx;
                    }
                }
                &.prize-list-item-0 {
                    padding: 0 56upx 50upx;
                    .prize-item {
                        width: 153upx;
                        height: 188upx;
                        padding: 3upx 6upx 0;
                    }
                }
                &.prize-list-item-1 {
                    .pirze-text {
                        line-height: 36upx;
                    }
                    .prize-item {
                        width: 144upx;
                        height: 164upx;
                        padding: 3upx 2upx;
                    }
                }
            }
            .prize-handel-item {
                display: flex;
                justify-content: space-between;
                margin: 48upx 31upx 0;
                .btn {
                    height: 158upx;
                    font-size: 28upx;
                    font-weight: 500;
                    color: #333;
                    line-height: 173upx;
                    background-position: center center;
                    background-size: 100% 100%;
                    text-align: center;
                    &:nth-of-type(1) {
                        width: 274upx;
                        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_0.png);
                    }
                    &:nth-of-type(2) {
                        width: 234upx;
                        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_1.png);
                    }
                }
            }
        }
        .prize-box {
            padding: 0;
            box-shadow: none;
            margin: 0;
            border-radius: 0;
            .prize-list {
                margin-bottom: 39upx;
                &:nth-of-type(2) {
                    border-bottom: 2upx #c790ff dashed;
                }
            }
            .prize-list-title {
                padding: 0 20upx 20upx;
            }
            .desc {
                color: #666;
                font-size: 28upx;
                margin-bottom: 34upx;
                padding: 0 20upx;
            }
            .prize-list-item {
                &.prize-list-item-0 {
                    padding: 0 20upx 0upx;
                }
            }
            .tips {
                color: #999;
                font-size: 24upx;
                text-align: center;
                margin: 30upx 20upx 40upx;
            }
            .tips-content {
                font-size: 26upx;
                color: #666;
                text-align: left;
                line-height: 40upx;
                & > view {
                    margin-bottom: 8upx;
                }
                .title {
                    font-weight: bold;
                    color: #666;
                    text-align: left;
                    margin-bottom: 0;
                }
            }
            .prize-text-box {
                padding: 0 20upx;
                .title {
                    color: #333;
                    font-size: 32upx;
                    line-height: 37upx;
                    margin-bottom: 20upx;
                }
                .text-item {
                    color: #666;
                    font-size: 26upx;
                    line-height: 42upx;
                }
            }
        }
        .lucky-none {
            font-size: 32upx;
            text-align: center;
            color: #bb77ff;
            font-weight: bold;
            line-height: 62upx;
            & > view {
                font-size: 30upx;
            }
        }
        .lucky-list {
            color: #999;
            .item {
                padding: 16upx 0 16upx 30upx;
                font-size: 30upx;
                position: relative;
            }
            .text {
                color: #bb77ff;
                margin: 0;
                font-weight: normal;
            }
            .index-text {
                width: 10upx;
                height: 10upx;
                border-radius: 50%;
                display: inline-block;
                background-color: #aaaaaa;
                position: absolute;
                left: 0;
                top: 50%;
                margin-top: -5upx;
            }
        }
        .lottery-num {
            .tips {
                text-align: center;
                color: #bb77ff;
                font-size: 32upx;
                font-weight: bold;
            }
            .lottery-title {
                font-size: 28upx;
                color: #333;
                text-align: center;
                line-height: 39upx;
                margin-bottom: 30upx;
                & > text {
                    color: #b692ff;
                    font-size: 32upx;
                    font-weight: bold;
                }
            }
            .lottery-item-box {
                .item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: inset 0px 0px 17upx 0px rgba(182, 146, 255, 1);
                    border-radius: 20upx;
                    height: 120upx;
                    margin-bottom: 30upx;
                    padding: 0 30upx;
                }
            }
            .item-type {
                font-weight: bold;
                color: #333;
                font-size: 28upx;
            }
            .item-text {
                color: #666;
                font-size: 26upx;
            }
            .item-btn {
                background-color: #c790ff;
                padding: 0 42upx;
                line-height: 74upx;
                margin-bottom: 0;
                font-size: 32upx;
                &.cur {
                    background: rgba(199, 144, 255, 0.35);
                    box-shadow: inset 0px 0px 0px 0px rgba(255, 255, 255, 0.35);
                    color: #d5abff;
                }
            }
        }
        .my-draw {
            .my-draw-list {
                .my-draw-item {
                    border-bottom: 1px #c790ff dashed;
                    display: flex;
                    align-items: center;
                    height: 158upx;
                    & > image {
                        width: 100upx;
                        height: 93upx;
                        border: 1px solid #bb77ff;
                        border-radius: 6upx;
                        box-sizing: border-box;
                        margin-right: 22upx;
                    }
                    .name {
                        color: #bb77ff;
                        font-size: 32upx;
                        font-weight: bold;
                        line-height: 1;
                        margin-right: 10upx;
                        .num {
                            font-size: 32upx;
                            color: #bb77ff;
                            margin-left: 8upx;
                        }
                        .time {
                            color: #999;
                            font-size: 22upx;
                            line-height: 1;
                            font-weight: normal;
                            margin-top: 16upx;
                        }
                    }
                }
                &.none {
                    text-align: center;
                    & > image {
                        width: 146upx;
                        height: 140upx;
                        margin: 34upx auto;
                    }
                    & > view {
                        color: #bb77ff;
                        font-size: 36upx;
                    }
                }
            }
            .get-draw-num {
                & > image {
                    width: 472upx;
                    height: 178upx;
                    position: absolute;
                    bottom: 127upx;
                }
            }
        }
        .qr-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 26upx;
            .qr-code {
                width: 220rpx;
                height: 220rpx;
                border-radius: 15rpx;
                margin: 0 20upx 0 0;
                border: 1px solid rgba(182, 146, 255, 1);
            }
            .text {
                color: #666;
                line-height: 40upx;
                width: 283upx;
                font-size: 24rpx;
                font-weight: normal;
                margin-bottom: 0;
            }
        }
    }
}
</style>
