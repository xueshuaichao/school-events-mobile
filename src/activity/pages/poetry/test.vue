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
        };
    },
    created() {
        this.detail = this.$store.getters.getRecordDetail;
        this.options = this.detail.question.extra;
        console.log(this.detail);
    },
    onUnload() {
        uni.navigateBack();
    },
    methods: {
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
                            // 去抽奖
                        } else if (res.level_title) {
                            // 进入下一关
                        } else if (res.has_draw) {
                            // 去抽奖
                        }
                    } else if (!res.retry) {
                        uni.showToast({
                            icon: 'none',
                            title: '这首诗太难了，换首诗来学习吧！',
                        });
                        // 换诗跳转闯关页面
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: '试试继续答题',
                        });
                    }
                });
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
}
</style>
