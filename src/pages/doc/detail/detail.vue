<template>
    <view>
        <view
            v-if="id === 'earn-coin'"
            class="page-earn-coin"
        >
            <view class="hd">
                <text class="em">
                    1
                </text>什么是挑战币?
            </view>
            <view class="content">
                用户应遵守国家法律、行政法规、部门规章等规范性文件。
                对任何涉嫌违反国家法律、行政法规、部门规章等规范性文件的行为，本规则已有规定的，适用本规则；
                本规则尚无规定的，工博士有权酌情处理。但工博士对用户的处理不免除其应尽的法律责任。
            </view>
            <view class="sep" />

            <view class="hd">
                <text class="em">
                    2
                </text>什么是挑战币?
            </view>
            <view class="content">
                用户应遵守国家法律、行政法规、部门规章等规范性文件。
                对任何涉嫌违反国家法律、行政法规、部门规章等规范性文件的行为，本规则已有规定的，适用本规则；
                本规则尚无规定的，工博士有权酌情处理。但工博士对用户的处理不免除其应尽的法律责任。
            </view>
            <view class="sep" />

            <view class="hd">
                <text class="em">
                    3
                </text>什么是挑战币?
            </view>
            <view class="content">
                用户应遵守国家法律、行政法规、部门规章等规范性文件。
                对任何涉嫌违反国家法律、行政法规、部门规章等规范性文件的行为，本规则已有规定的，适用本规则；
                本规则尚无规定的，工博士有权酌情处理。但工博士对用户的处理不免除其应尽的法律责任。
            </view>
            <view class="sep" />
        </view>

        <view
            v-if="id === 'rule'"
            class="rule-doc"
        >
            <view class="title">
                <text>如何参加爱挑战比赛</text>
            </view>
            <view class="sub-title">
                <text>准备阶段</text>
            </view>
            <view>
                <view class="text">
                    <text>1、选择参赛项目</text>
                </view>
                <view class="text">
                    <text>2、上报学校认证官</text>
                </view>
                <view class="text">
                    <text>
                        3、自行练习
                    </text>
                </view>
            </view>

            <view class="sub-title">
                <text>视频拍摄阶段</text>
            </view>
            <view>
                <view class="text">
                    <text>
                        1、认证官赛前说明
                    </text>
                </view>
                <view class="text">
                    <text>
                        2、认证官视频录制
                    </text>
                </view>
                <view class="text">
                    <text>
                        3、上传视频
                    </text>
                </view>
                <view class="text">
                    <text>
                        4、视频审核
                    </text>
                </view>
            </view>

            <view class="sub-title">
                <text>比赛阶段</text>
            </view>
            <view>
                <view class="text">
                    <text>根据比赛成绩进行省级、市级、校级记录统计</text>
                </view>
            </view>

            <view class="sep" />

            <view class="title">
                <text>如何参加才艺秀展示</text>
            </view>
            <view class="sub-title">
                <text>准备阶段</text>
            </view>
            <view>
                <view class="text">
                    1、选择参赛项目
                </view>
                <view class="text">
                    2、自行练习
                </view>
            </view>

            <view class="sub-title">
                视频拍摄阶段
            </view>
            <view>
                <view class="text">
                    1、视频拍摄
                </view>
                <view class="text">
                    2、上传视频
                </view>
                <view class="text">
                    3、视频审核
                </view>
            </view>

            <view class="sub-title">
                比赛阶段
            </view>
            <view>
                <view class="text">
                    根据视频点赞量、浏览量进行统计
                </view>
            </view>

            <view class="sep" />

            <view class="title">
                如何参加吉尼斯挑战赛
            </view>
            <view class="sub-title">
                爱挑战
            </view>
            <view>
                <view class="text">
                    参加爱挑战比赛---根据比赛成绩进行选拔--- 参加吉尼斯挑战赛
                </view>
            </view>

            <view class="sub-title">
                才艺秀
            </view>
            <view>
                <view class="text">
                    参加才艺秀---根据才艺表演进行选拔---参加吉尼斯挑战赛现场表演
                </view>
            </view>

            <view class="sub-title">
                比赛阶段
            </view>
            <view>
                <view class="text">
                    根据视频点赞量、浏览量进行统计
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            id: '',
        };
    },
    onLoad(query) {
        const { id } = query;
        this.id = id;
    },
};
</script>

<style lang="less">
.rule-doc {
    padding: 30rpx;
    color: #333;

    .title {
        font-size: 32rpx;
        margin-bottom: 40rpx;
        font-weight: bold;
    }

    .sub-title {
        font-size: 28rpx;
        margin-bottom: 24rpx;
    }

    .text {
        font-size: 28rpx;
        line-height: 44rpx;
    }

    .sep {
        border-bottom: 1px solid rgba(240, 240, 240, 1);
        margin: 32rpx 0 56rpx;
    }
}

.page-earn-coin {
    padding: 30rpx;

    .hd {
        margin-bottom: 18rpx;

        .em {
            display: inline-block;
            width: 40rpx;
            height: 40rpx;
            background: #333;
            color: #fff;
            border-radius: 40rpx;
            text-align: center;
            line-height: 40rpx;
            margin-right: 10rpx;
        }

        color: #333;
        font-size: 32rpx;
    }

    .content {
        color: #666;
        font-size: 28rpx;
        line-height: 40rpx;
        margin-bottom: 30rpx;
    }

    .sep {
        border-top: 1rpx solid #e6e6e6;
        margin: 0 -30rpx 30rpx;
    }
}
</style>
