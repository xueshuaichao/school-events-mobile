<template>
    <view class="page-my-work">
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view class="panel">
            <view class="panel-hd">
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 2 }"
                    @click="setTabActive(2)"
                >
                    已通过({{ workStatics.pass_num || 0 }})
                </text>
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 1 }"
                    @click="setTabActive(1)"
                >
                    待审核1({{ workStatics.no_verify_num || 0 }})
                </text>
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 3 }"
                    @click="setTabActive(3)"
                >
                    未通过({{ workStatics.refuse_num || 0 }})
                </text>
            </view>
            <view class="media-box">
                <view
                    v-for="item in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <image
                        v-if="item.resource_type === 1"
                        src="https://via.placeholder.com/150/771796"
                        class="work"
                    />
                    <image
                        v-else-if="item.resource_type === 2"
                        src="https://via.placeholder.com/150/771796"
                        class="work"
                    />
                    <image
                        class="media-icon"
                        :src="mediaIcon[item.resource_type]"
                    />
                    <view class="work-info">
                        <view class="media-name">
                            快来听听我的新年第一首作品
                        </view>
                        <view class="media-time">
                            2020-01-10 11:40
                        </view>
                        <text class="vote-num">
                            1200票
                        </text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    components: {},
    data() {
        return {
            dataList: [
                {
                    id: 1,
                    resource_type: 1,
                },
                {
                    id: 2,
                    resource_type: 2,
                },
            ],
            mediaIcon: {
                1: '../../../static/images/chunjie/video-icon.png',
                2: '../../../static/images/chunjie/img-icon.png',
            },
            tabActiveIndex: 1,
            workStatics: {},
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 3,
            },
        };
    },
    methods: {
        getWorkData(i) {
            return api
                .get('/api/activity/userresource', {
                    ...this.filter,
                    status: i,
                })
                .then(
                    (res) => {
                        console.log(res);
                    },
                    () => {},
                );
        },
        setTabActive(i) {
            this.tabActiveIndex = i;
            this.getWorkData(i);
        },
    },
    onLoad() {
        this.getWorkData();
    },
};
</script>

<style lang="less">
.media-box {
    // display: flex;
    // justify-content: space-between;
    // flex-flow: row wrap;
    overflow: hidden;
    padding-left: 30upx;
    .media-content {
        width: 690upx;
        padding: 21upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        background: #fff6e1;
        color: #ff3849;
        margin-bottom: 20upx;
        border-radius: 20upx;
        .work {
            width: 335upx;
            height: 225upx;
            border-radius: 20upx;
        }
        .media-icon {
            width: 40upx;
            height: 40upx;
            position: absolute;
            top: 175upx;
            left: 143upx;
        }
        .work-info {
            width: 270upx;
            position: relative;
            .media-name {
                width: 100%;
                font-size: 28upx;
                margin-bottom: 10upx;
            }
            .media-time {
                color: #c9ac67;
                font-size: 24upx;
            }
            .vote-num {
                font-size: 30upx;
                left: 0;
                position: absolute;
                bottom: 14upx;
            }
        }
    }
}
.page-my-work {
    width: 100%;
    height: 100%;
    background: url("../../../static/images/chunjie/main_bg.png") repeat-y;

    .panel .panel-hd {
        border-bottom: none;
        margin: 0 30rpx 20rpx;
        display: flex;
        justify-content: space-around;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding-left: 0;
        padding-right: 0;
        color: #ffe57b;

        &.active::after {
            background: #ffe57b;
        }
    }

    .work-list {
        .work-item {
            // border-bottom: 1upx solid #ddd;
            padding: 20upx 0 20upx;

            position: relative;
            background: #fff6e1;
            margin-bottom: 20rpx;
        }

        .btns {
            position: absolute;
            right: 0;
            bottom: 10upx;

            .btn {
                display: inline-block;
                width: 120upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 40upx;
                background: #1166ff;
            }

            .btn-share {
                border-radius: 0;
            }
        }
    }

    .blank-wrap {
        margin-top: 180upx;
    }
}
</style>
