<template>
    <view
        v-if="show"
        class="clocked-modal"
    >
        <view class="modal-main">
            <view class="modal-top">
                {{ maskTitle }}
            </view>
            <view class="modal-body">
                <template v-if="maskType === 1">
                    <view class="txt">
                        1、用户每天上传1个本周期自选主题的作品，即为打卡成功，并可获取5积分；
                    </view>
                    <view class="txt">
                        2、用户每天完成打卡后，可解锁当天的任务模块，包括上传作品和点赞。用户每上传一个作品可获得5分，
                        每天最高可得10分；用户的作品每增加1个点赞，可获得1积分，每天每个账号最高可得10分；
                    </view>
                    <view class="txt">
                        3、用户连续打卡14天可额外获得100积分奖励；连续打卡21天可额外获得300积分奖励。
                    </view>
                    <view class="txt">
                        4、用户获得一定数量的积分后，可到积分商城进行消分兑换相应礼品。
                    </view>
                    <view class="txt">
                        5、兑换完礼品扣除相应积分后，如果积分还有剩余，用户可继续兑换积分范围内的礼品，每人最多可兑换3次。
                    </view>
                    <view class="txt">
                        6、礼品兑换截至日期为9月3日18:00，如果到截至日还有积分未兑换，则积分自动清零，视为自愿放弃兑换。
                    </view>
                </template>
                <template v-if="maskType === 0">
                    <view class="txt-bold">
                        一、活动时间
                    </view>
                    <view class="txt">
                        8月1日--8月31日
                    </view>
                    <view class="txt-bold">
                        二、参与对象
                    </view>
                    <view class="txt">
                        大中小学生均可参加
                    </view>
                    <view class="txt-bold">
                        三、作品类型
                    </view>
                    <view class="txt">
                        四大主题：劳动实践、读书学习、才艺展示、体育锻炼，作品上传需为图片、视频格式。
                    </view>
                    <view class="txt-bold">
                        四、活动规则
                    </view>
                    <view class="arror">
                        每日打卡
                    </view>
                    <view class="txt">
                        1、活动期间，用户每天可参与打卡（上传1个作品即为打卡），打卡作品有4个主题：体育、读书、才艺、劳动。用户需选择1个主题，并坚持这个主题连续打卡7天，
                        打卡表每7天为1个周期，用户完成1个周期打卡后，即可重新选择主题进行下1个周期的打卡（如果1个周期内打卡中断，则需重新选主题开启新1个周期的打卡）。
                    </view>
                    <view class="txt">
                        2、用户每天上传1个本周期自选主题的作品，即为打卡成功，作品发布成功后，可获取5积分（积分可到商场兑换礼品）。
                    </view>
                    <view class="txt">
                        3、用户每天完成打卡后，可解锁当天的任务模块，包括上传作品和点赞。用户每上传一个作品可获得5分，每天最高可得10分；
                        用户的作品每增加1个点赞，可获得1积分，每天每个账号最高可得10分。
                    </view>
                    <view class="txt">
                        4、连续打卡7天可获得1次抽奖机会；连续打卡14天可获得2次抽奖机会，另外额外获得100积分奖励；
                        连续打卡21天可获得3次抽奖机会，另外额外获得300积分奖励；累计打卡28天可获得4次抽奖机会。
                    </view>
                    <view class="txt">
                        5、如果用户上传的作品不属于规定的主题，如本周主题是劳动，但用户上传才艺类作品，则该作品会被审核下架，该作品所得积分被扣除。
                    </view>
                    <image
                        class="img"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-all.png"
                    />
                    <view class="arror yellow">
                        积分兑换
                    </view>
                    <view class="txt">
                        1、用户获得一定数量的积分后，可到积分商城进行消分兑换相应礼品。
                    </view>
                    <view class="txt">
                        2、兑换完礼品扣除相应积分后，如果积分还有剩余，用户可继续兑换积分范围内的礼品，每人最多可兑换3次。
                    </view>
                    <view class="txt">
                        3、提交兑换申请后，会在3个工作日内审核，审核通过则所兑礼品于活动结束寄出。
                    </view>
                    <view class="txt">
                        4、礼品兑换截至日期为9月3日18:00，如果到截至日还有积分未兑换，则积分自动清零，视为自愿放弃兑换。
                    </view>
                    <view class="txt-bold">
                        五、作品要求
                    </view>
                    <view class="txt">
                        1、视频格式：支持MP4、MOV、3GP、MP4V，视频时大小不超过200M，视频完整清晰；
                    </view>
                    <view class="txt">
                        2、图片格式：支持JPG、PNG，单张图片小于10MB；
                    </view>
                    <view class="txt">
                        3、参选资格取消：视频内容需健康、积极向上，如发现上传不合规内容，该账号将取消参与资格，不合规图片/视频将被删除。
                    </view>
                </template>
            </view>
            <image
                class="close"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_close.png"
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
        maskType: {
            type: Number,
            default: 0,
        },
        maskTitle: {
            type: String,
            default: '',
        },
    },
    data() {
        return {};
    },
    methods: {
        toggelModel() {
            this.$emit('toggelModel');
        },
    },
};
</script>
<style scoped lang="less">
.clocked-modal {
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    .modal-main {
        width: 690upx;
        margin: 100upx auto 0;
    }
    .modal-top {
        color: #fff;
        font-size: 32upx;
        line-height: 72upx;
        text-align: center;
        background: linear-gradient(
            180deg,
            rgba(255, 162, 132, 1) 0%,
            rgba(255, 104, 76, 1) 100%
        );
        box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5);
        border-radius: 20upx 20upx 0 0;
    }
    .modal-body {
        background: #ffdada;
        border-radius: 0 0 20upx 20upx;
        height: 896upx;
        padding: 30upx;
        box-sizing: border-box;
        overflow: auto;
        .txt {
            font-size: 26upx;
            line-height: 40upx;
            color: #ff5547;
            margin-bottom: 20upx;
        }
        .txt-bold {
            font-weight: 600;
            font-size: 28upx;
            color: #ff5547;
            line-height: 48upx;
        }
        .arror {
            width: 172upx;
            height: 42upx;
            text-align: center;
            line-height: 42upx;
            color: #fff;
            background: #ff5547;
            margin: 26upx 0 26upx -30upx;
            position: relative;
            border-radius: 0 4upx 4upx 0;
            box-sizing: border-box;
            padding-right: 20upx;
            &.yellow {
                background: #ffb100;
            }
            &::before {
                position: absolute;
                right: -4upx;
                top: -8upx;
                content: "";
                border-top: 28upx solid transparent;
                border-bottom: 28upx solid transparent;
                border-right: 15upx solid #ffdada;
            }
        }
        .img {
            width: 630upx;
            height: 253upx;
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
