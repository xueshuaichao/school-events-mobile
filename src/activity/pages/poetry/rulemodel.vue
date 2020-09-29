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
                    <view class="modal-box rule">
                        <view class="title">
                            <text>
                                活动规则
                            </text>
                        </view>
                        <view class="box clearfix">
                            <view
                                v-for="(item, index) in ruleList"
                                :key="index"
                                class="item"
                            >
                                <view class="titlist">
                                    {{
                                        item.titleListTop
                                    }}
                                </view>
                                <view class="tit">
                                    {{ item.title }}
                                    <text
                                        v-if="index === 0"
                                        class="time"
                                    >
                                        2020年9月30日-2020年10月31日
                                    </text>
                                </view>
                                <view class="titlist">
                                    {{
                                        item.titleList
                                    }}
                                </view>
                                <view
                                    v-for="(textItem, k) in item.texts"
                                    :key="k"
                                    class="text"
                                >
                                    {{ textItem }}
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
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
    },
    data() {
        return {
            ruleList: [
                {
                    title: '活动时间：',
                    titleList: '闯关规则说明：',
                    texts: [
                        '“青少年爱挑战”平台注册用户通过活动页面参加诗词闯关活动，进行诗词朗读，上传录制练习作品并通过相应测试习题，即可进入下一关。',
                        '诗词关卡一共500关卡，每个关卡1首诗词，完成带有抽奖图标的关卡，即可触发抽奖活动，完成诗词闯关越多，抽奖机会越多。',
                        '每个用户每天只能为同一个作品点赞1次。',
                    ],
                },
                {
                    titleListTop: '奖项说明：',
                    title: '闯关达人奖',
                    texts: [
                        '完成诗词闯关关卡数量排名（闯关关卡数量截止时间为2020年10月31日23:59:59，如完成关卡数相同则按完成时间进行排名），前20的作者将获得“诗词闯关达人奖”及获得相应奖品。',
                    ],
                },
                {
                    title: '最佳人气奖 ',
                    texts: [
                        '诗词作品点赞量排名（作品点赞截止时间为2020年10月31日23:59:59），前45作品的作者将获得“诗词最佳人气奖”及获得相应奖品。',
                    ],
                },
                {
                    title: '闯关抽奖',
                    texts: [
                        '活动期间，完成带有抽奖图标的关卡，即可触发抽奖活动，完成诗词闯关越多，抽奖机会越多。用户可在抽奖后即时查看获奖情况。',
                    ],
                },
                {
                    title: '优秀组织奖',
                    texts: [
                        '对于参与积极的学校、机构或单位，组委会也将根据其成员参与活跃度，评选出5个“优秀组织奖”颁发奖杯，并对优秀组织单位进行报道宣传。',
                    ],
                },
                {
                    title: '优秀管理员奖',
                    texts: [
                        '荣获“优秀组织奖”的组织单位，其对应管理员（限1名）可评选为“优秀管理员奖”\n'
                            + '颁发奖杯及奖品礼包',
                    ],
                },
                {
                    titleListTop: '特别说明',
                    title: '',
                    texts: [
                        '参赛者不得侵犯他人合法权益，不得盗窃他人或平台内容；不得发布任何违规、违法或敏感话题的内容；不得恶意重复上传同一作品、恶意刷赞扰乱活动秩序。违规行为一经发现，取消该账号活动参与资格，违规作品内容做删除处理。',
                        '获奖名单将于活动结束后10个工作日内，在爱挑战官网（http://atz.qsnatz.com/）及官方服务号（UP青少年爱挑战）进行公布。',
                        '本次活动最终解释权在法律允许的范围内归活动举办方所有。',
                    ],
                },
            ],
        };
    },
    methods: {
        toggelModel() {
            this.$emit('toggelModel');
        },
    },
};
</script>
<style scoped lang="less">
@import "./model.less";
.poetry-modal {
    .rule {
        .item {
            margin-bottom: 20upx;
            .tit {
                font-size: 28upx;
                font-weight: bold;
                color: #5d2708;
                .time {
                    color: #5d2708;
                    font-size: 24upx;
                    display: inline-block;
                    font-weight: normal;
                    margin-bottom: 20px;
                }
            }
            .titlist {
                font-size: 28upx;
                font-weight: bold;
                color: #5d2708;
                text-align: center;
                margin-bottom: 7px;
                .time {
                    color: #5d2708;
                    font-size: 24upx;
                    display: inline-block;
                    font-weight: normal;
                    margin-bottom: 20px;
                }
            }
            .text {
                font-size: 24upx;
                color: #000;
                line-height: 40upx;
                word-break: break-all;
            }
            &:last-of-type {
                margin-bottom: 0;
            }
        }
    }
}
</style>
