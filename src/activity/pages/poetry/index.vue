<template>
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll': rulePrompt || prizePromt
            }
        ]"
    >
        <rulemodel
            :show="rulePrompt"
            @toggelModel="toggelModel"
        />
        <prizemodel
            :show="prizePromt"
            @toggelModel="toggelModel"
        />
        <view class="activity-init-page">
            <view class="banner">
                <image
                    class="banner-image"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_main.png"
                />
                <view
                    class="active-rule"
                    @click="handleActiverule"
                >
                    活动规则
                </view>
                <template>
                    <i class="active-time">
                        活动时间： 9月25日-10月31日
                    </i>
                </template>
            </view>
            <view class="menu-list">
                <view class="cansai-text">
                    --活动作品--
                </view>
                <view class="search-box">
                    <view class="btn">
                        人气榜
                    </view>
                    <view class="btn">
                        闯关榜
                    </view>
                    <view class="search">
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_search.png"
                        />
                        <input
                            v-model="changeValue"
                            placeholder-style="color: #f00"
                            type="text"
                            confirm-type="search"
                            confirm-hold="true"
                            maxlength="13"
                            placeholder="请输入作者姓名或作品名称"
                            @confirm="bindconfirm"
                        >
                        <text
                            class="search-button"
                            @click="bindconfirm"
                        >
                            搜索
                        </text>
                    </view>
                </view>
                <template>
                    <view class="media-box" />
                </template>
                <template>
                    <view class="ranks-box" />
                </template>
            </view>
            <view
                class="start"
                @click="start"
            >
                开始闯关
            </view>
        </view>
    </view>
</template>
<script>
import rulemodel from './rulemodel.vue';
import prizemodel from './prizemodel.vue';
// import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        rulemodel,
        prizemodel,
        // uniLoadMore,
    },
    data() {
        return {
            rulePrompt: false,
            prizePromt: false,
            changeValue: '',
        };
    },
    methods: {
        toggelModel() {
            this.rulePrompt = false;
            this.prizePromt = false;
        },
        handleActiverule() {
            this.rulePrompt = true;
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/activity/pages/mywork/mywork?type=search&name=${this.changeValue.trim()}&activity_id=14`,
            });
        },
        start() {
            uni.navigateTo({
                url: '/activity/pages/poetry/clearance',
            });
        },
    },
};
</script>
<style scoped lang="less">
.start {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80upx;
    text-align: center;
    line-height: 80upx;
    font-size: 40upx;
    border: 2upx solid #eee;
}
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.activity-init-page {
    background: red;
    .banner {
        position: relative;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        text-align: center;
        margin-bottom: 12upx;
        .banner-image {
            width: 100%;
            height: 700upx;
        }
        .active-rule {
            position: absolute;
            top: 19upx;
            width: 120upx;
            height: 48upx;
            line-height: 48upx;
            font-size: 22upx;
            color: #fff;
            left: 0;
            border-radius: 0px 24px 24px 0px;
        }
        .active-time {
            position: absolute;
            top: 310upx;
            left: 218upx;
            color: #fff;
            font-size: 22upx;
            font-style: normal;
        }
    }
    .menu-list {
        padding-bottom: 60upx;
        .cansai-text {
            color: #138256;
            text-align: center;
        }
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
            display: flex;
            .btn {
                width: 144upx;
                height: 68upx;
                float: left;
                line-height: 68upx;
                color: #000;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;
                border-radius: 34upx;
                padding: 0;
                &.active {
                    background: #05af7c;
                    color: #fff;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                width: 400upx;
                height: 72upx;
                position: relative;
                float: right;
                border-radius: 60upx;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 12upx;
                }
                input {
                    width: 276upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 50upx;
                    font-size: 22upx;
                    color: #fff;
                }
                .search-button {
                    font-size: 24upx;
                    color: #fff;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 22upx;
                }
            }
        }
    }
}
</style>
