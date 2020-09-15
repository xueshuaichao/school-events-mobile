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
        <view
            v-if="show"
            class="test-modal"
        >
            <view
                class="center"
                :class="{ fail: !isSuccess }"
            >
                <view
                    v-if="!isSuccess"
                    class="fail-txt"
                    :class="{ lesspadding: testStatus === 0 }"
                >
                    {{ modelTxt1 }}
                </view>
                <template v-else>
                    <view class="bandge">
                        {{ modelTxt1 }}
                    </view>
                    <image
                        v-if="testStatus === 2"
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poster-title-${detail.level -
                                1}.png`
                        "
                        class="img img-level"
                    />
                    <image
                        v-else
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-draw-${
                                testStatus === 3 ? 0 : 1
                            }.png`
                        "
                        class="img"
                    />
                    <view
                        v-if="testStatus === 1"
                        class="txt2"
                    >
                        {{ modelTxt2 }}
                    </view>
                    <view
                        v-if="testStatus > 2"
                        class="txt2 next-num"
                    >
                        {{ curNum }} 下一关
                    </view>
                </template>
            </view>
            <view
                v-if="testStatus < 3"
                class="btn-wraps"
            >
                <view
                    class="btn"
                    @click="jumpOne"
                >
                    {{ btn1 }}
                </view>
                <view
                    class="btn"
                    @click="jumpTwo"
                >
                    {{ btn2 }}
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            detail: null,
            options: [],
            selItem: null,
            answer: 0,
            show: true,
            isSuccess: true,
            modelTxt1: '恭喜你晋升“',
            modelTxt2: '并获得一次抽奖机会哦',
            testStatus: 0, // -1 0 1 2 3 4
            btn1: '下一关',
            btn2: '去抽奖',
            curNum: 3,
            timer: null,
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
            if (this.testStatus === 0) {
                // 重新答题
                this.answer = 0;
                this.selItem = null;
            } else if (this.testStatus === -1) {
                // 换诗
                this.toNext();
            } else {
                // 下一关
                this.toNext('add');
            }
            this.show = false;
        },
        jumpTwo() {
            if (this.testStatus < 1) {
                // 清空state
                this.$store.commit('setRecordParam', null);
                uni.navigateTo({
                    url: `/activity/pages/poetry/clearance?id=${this.detail.barrier}`,
                });
            } else {
                uni.navigateTo({
                    url: '/activity/pages/poetry/lottery?activity_id=14',
                });
            }
            this.show = false;
        },
        toNext(add) {
            this.$store.commit('setRecordParam', {
                status: 2,
                id: this.detail.barrier + (add ? 1 : 0),
                barrier: this.detail.barrier + (add ? 1 : 0),
            });
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
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
                                - this.detail.barrier / 5}关即可抽奖`;
                            this.testStatus = 4;
                        }
                        this.btn1 = '下一关';
                        this.btn2 = '去抽奖';
                        this.setTimer();
                    } else if (!res.retry) {
                        // 换诗跳转闯关页面
                        this.modelTxt1 = '这首诗太难了，换首诗来学习吧';
                        this.testStatus = 0;
                        this.btn1 = '重新答题';
                        this.btn2 = '返回';
                    } else {
                        this.modelTxt1 = '很遗憾，通关失败，答对后方 可通关成功';
                        this.testStatus = -1;
                        this.btn1 = '换诗';
                        this.btn2 = '返回';
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
                        that.toNext('add');
                    }
                }, 1000);
            }
        },
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
    .test-modal {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10;
        .center {
            width: 624upx;
            height: 760upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-success.png);
            background-size: 100%;
            margin: 40upx auto 32upx;
            &.fail {
                width: 624upx;
                height: 686upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-fail.png);
                margin-top: 140upx;
            }
            .fail-txt {
                padding: 264upx 100upx 0;
                text-align: center;
                font-size: 32upx;
                line-height: 44upx;
                color: #fff;
                font-weight: 500;
                &.lesspadding {
                    padding: 264upx 80upx 0;
                }
            }
            .bandge {
                box-sizing: content-box;
                padding-top: 288upx;
                width: 398upx;
                height: 96upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-bar.png);
                background-size: 100% 96upx;
                margin: 0 auto;
                color: #834a21;
                font-size: 32upx;
                text-align: center;
                background-position-y: bottom;
                background-repeat: no-repeat;
                line-height: 96upx;
            }
            .img {
                width: 176upx;
                height: 272upx;
                margin: -60upx auto 28upx;
                display: block;
            }
            .img-level {
                width: 160upx;
                height: 214upx;
                margin-top: 0;
            }
            .txt2 {
                color: #834a21;
                font-weight: 500;
                font-size: 32upx;
                text-align: center;
                line-height: 32upx;
            }
        }
        .btn-wraps {
            display: flex;
            width: 414upx;
            margin: 0 auto;
            justify-content: space-around;
            .btn {
                width: 190upx;
                height: 68upx;
                text-align: center;
                color: #fff;
                font-size: 28upx;
                line-height: 68upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-btn-l.png);
                background-size: 100%;
                background-position-x: -4upx;
            }
        }
    }
}
</style>
