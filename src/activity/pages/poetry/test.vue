<template>
    <view class="test-page">
        <view class="ctx">
            <view class="title">
                “爱挑战”趣味诗词大闯关
            </view>
            <view class="tips">
                诗词巩固练习，请选择正确的答案
            </view>
            <view class="question">
                {{ detail.question.title }}
            </view>
            <view class="option">
                <view
                    v-for="(item, index) in options"
                    :key="index"
                    class="item"
                    :class="{ sel: selItem === item }"
                    @click="clickItem(item, index)"
                >
                    {{ item }}
                </view>
            </view>
            <view
                class="submit"
                @click="submit"
            >
                提交
            </view>
        </view>
        <image
            class="cover"
            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poetry-cover-1.png"
        />
        <!--弹窗-->
        <model
            :show="show"
            :test-status="testStatus"
            :is-success="isSuccess"
            :model-txt1="modelTxt1"
            :model-txt2="modelTxt2"
            :btn2="btn2"
            :btn1="btn1"
            :cur-num="curNum"
            :level="level"
            @jumpTwo="jumpTwo"
            @jumpOne="jumpOne"
        />
    </view>
</template>
<script>
import api from '../../../common/api';
import model from './testmodel.vue';
import share from '../common/shareMinxin';

export default {
    components: {
        model,
    },
    mixins: [share.initShare],
    data() {
        return {
            activityId: 14,
            detail: null,
            options: [],
            selItem: null,
            answer: 0,
            show: false,
            isSuccess: true,
            modelTxt1: '请继续加油喔',
            modelTxt2: '并获得一次抽奖机会哦',
            testStatus: 0, // -1 0 1 2 3 4
            btn1: '下一关',
            btn2: '去抽奖',
            curNum: 3,
            timer: null,
            level: 1,
        };
    },
    created() {
        this.detail = this.$store.getters.getRecordDetail;
        console.log(this.detail);
        if (!this.detail) {
            this.detail = {
                barrier: 1,
                level: 1,
                level_title: '小诗人',
                question: {
                    title: 'ahskahdkahsk',
                    extra: ['1212'],
                },
            };
        }
        this.options = this.detail.question.extra;
        console.log(this.detail);
        // this.setTimer();
    },
    onUnload() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        uni.navigateBack();
    },
    methods: {
        jumpOne() {
            if (this.testStatus === -1) {
                // 重新答题
                console.log(777777777777, this.testStatus === -1);
                this.answer = 0;
                this.selItem = null;
            } else if (this.testStatus === 0) {
                // 换诗 关卡不变。
                this.toRecordPage();
            } else {
                // 下一关
                this.toRecordPage('add');
            }
            this.show = false;
        },
        jumpTwo() {
            if (this.testStatus < 1) {
                // 清空state
                this.$store.commit('setRecordParam', null);
                uni.redirectTo({
                    url: `/activity/pages/poetry/clearance?id=${this.detail.barrier}`,
                });
            } else {
                uni.redirectTo({
                    url: '/activity/pages/poetry/lottery?activity_id=14',
                });
            }
            this.show = false;
        },
        toRecordPage(add) {
            this.show = false;
            // 待闯关的关卡 +2， 已经闯关的关卡 +1；
            this.$store.commit('setRecordParam', {
                status: 2,
                id: this.detail.barrier + (add ? 1 : 0),
                barrier: this.detail.barrier + (add ? 0 : -1),
            });
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.show = false;
            console.log('testStatus', this.testStatus, this.curNum);
            uni.navigateTo({
                url: '/activity/pages/poetry/record',
            });
        },
        clickItem(item, index) {
            this.selItem = item;
            switch (index) {
                case 0:
                    this.answer = 1;
                    break;
                case 1:
                    this.answer = 2;
                    break;
                case 2:
                    this.answer = 4;
                    break;
                default:
                    this.answer = 8;
                    break;
            }
        },
        submit() {
            // /api/poem/submit  poem_id, question_id, answer, barrier, resource_id
            if (!this.answer) {
                uni.showToast({
                    icon: 'none',
                    title: '完成测试才算闯关成功哦！',
                    duration: 3000,
                });
            } else {
                api.post('/api/poem/submit', {
                    poem_id: this.detail.poem_id,
                    question_id: this.detail.question.id,
                    barrier: this.detail.barrier,
                    answer: this.answer, // 1,2,4,8
                }).then((res) => {
                    console.log(res);
                    // 返回操作都是跳转关卡页面
                    if (res.success) {
                        this.isSuccess = true;
                        if (res.has_draw && res.level_title) {
                            this.modelTxt1 = `恭喜你晋升“${res.level_title}”`;
                            this.modelTxt2 = '并获得一次抽奖机会哦';
                            this.testStatus = 1;
                            // 去抽奖
                        } else if (res.has_draw) {
                            // 去抽奖
                            this.modelTxt1 = '恭喜你获得一次抽奖机会';
                            this.testStatus = 2;
                        } else if (res.level_title) {
                            // 进入下一关
                            this.modelTxt1 = `恭喜你晋升“${res.level_title}”`;
                            this.modelTxt2 = '';
                            this.testStatus = 3;
                        } else {
                            this.modelTxt1 = `还有${5
                                - (this.detail.barrier % 5)}关即可抽奖`;
                            this.testStatus = 4;
                        }
                        this.level = res.level;
                        this.btn1 = '下一关';
                        this.btn2 = '去抽奖';
                        this.setTimer();
                    } else if (!res.retry) {
                        // 换诗跳转闯关页面
                        this.modelTxt1 = '这首诗太难了，换首诗来学习吧';
                        this.testStatus = 0;
                        this.btn1 = '换诗';
                        this.btn2 = '返回';
                        this.isSuccess = false;
                    } else {
                        this.modelTxt1 = '很遗憾，通关失败，答对后方可通关成功';
                        this.testStatus = -1;
                        this.btn1 = '重新答题';
                        this.btn2 = '返回';
                        this.isSuccess = false;
                    }
                    this.show = true;
                });
            }
        },
        setTimer() {
            if (this.testStatus > 2) {
                const that = this;
                this.timer = setInterval(() => {
                    that.curNum -= 1;
                    if (that.curNum === 0) {
                        clearInterval(that.timer);
                        that.timer = null;
                        that.toRecordPage('add');
                    }
                }, 1000);
            }
        },
    },
    onLoad() {
        this.getShareConfig();
    },
};
</script>
<style scoped lang="less">
.test-page {
    background: linear-gradient(#fefdf9, #c3efe4);
    height: 100vh;
    .cover {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 750upx;
        height: 598upx;
    }
    .ctx {
        position: relative;
        z-index: 10;
        padding-top: 64upx;
        .title {
            text-align: center;
            font-size: 36upx;
            color: #004137;
            font-weight: 500;
            line-height: 50upx;
        }
        .tips {
            text-align: center;
            color: #43a294;
            font-size: 28upx;
            margin-top: 24upx;
            line-height: 40upx;
            margin-bottom: 34upx;
        }
        .question,
        .option {
            padding: 0 74upx;
            font-size: 32upx;
            color: #444;
            line-height: 44upx;
            word-wrap: break-word;
        }
        .option {
            margin-top: 64upx;
            .item {
                padding-left: 40upx;
                position: relative;
                margin-bottom: 18upx;
                &::before,
                &::after {
                    position: absolute;
                    content: "";
                    box-sizing: border-box;
                }
                &::before {
                    width: 32upx;
                    height: 32upx;
                    left: 0;
                    top: 6upx;
                    background: #fff;
                    border: 4upx solid #43a294;
                    border-radius: 50%;
                }
                &::after {
                    width: 20upx;
                    height: 20upx;
                    background: #43a294;
                    border-radius: 50%;
                    left: 6upx;
                    top: 12upx;
                    display: none;
                }
                &.sel::before {
                    border-color: #fff;
                }
                &.sel::after {
                    display: block;
                }
            }
        }
        .submit {
            width: 190upx;
            height: 68upx;
            line-height: 68upx;
            text-align: center;
            color: #fff;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-btn-l.png);
            background-size: 100%;
            margin-left: 280upx;
            margin-top: 78upx;
        }
    }
}
</style>
