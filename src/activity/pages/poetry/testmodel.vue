<template>
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
                    v-if="testStatus === 3"
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/poster-title-${level -
                            1}.png`
                    "
                    class="img img-level"
                />
                <image
                    v-else
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-draw-${
                            testStatus === 4 ? 0 : 1
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
                    {{ curNum }} {{ modelTxt3 }}
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
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        testStatus: {
            type: Number,
            default: 0,
        },
        btn1: {
            type: String,
            default: '',
        },
        btn2: {
            type: String,
            default: '',
        },
        isSuccess: {
            type: Boolean,
            default: true,
        },
        modelTxt1: {
            type: String,
            default: '',
        },
        modelTxt2: {
            type: String,
            default: '',
        },
        curNum: {
            type: Number,
            default: 3,
        },
        modelTxt3: {
            type: String,
            default: '下一关',
        },
        level: {
            type: Number,
            default: 1,
        },
    },
    methods: {
        jumpOne() {
            this.$emit('jumpOne');
        },
        jumpTwo() {
            this.$emit('jumpTwo');
        },
    },
};
</script>
<style scoped lang="less">
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
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-success.png)
            no-repeat;
        background-size: 100%;
        margin: 40upx auto 32upx;
        &.fail {
            width: 624upx;
            height: 686upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/test-fail.png)
                no-repeat;
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
</style>
