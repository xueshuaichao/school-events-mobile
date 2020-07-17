<template>
    <view
        v-if="loading"
        class="score-list-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="main-content">
                <view class="banner-content">
                    <view class="integral-content">
                        <view class="text-content">
                            可用积分
                            <view class="num text-one-line">
                                {{ integral.useful_score }}
                            </view>
                        </view>
                    </view>
                    <view class="handel-content">
                        <view
                            class="item"
                            @click="jumpOrderList"
                        >
                            总积分<text>{{ integral.score }}</text>
                        </view>
                        <view class="line" />
                        <view class="item">
                            总消耗<text>{{ integral.last_score }}</text>
                        </view>
                    </view>
                </view>
                <view class="score-list-cont">
                    <view class="tab">
                        <view
                            class="item"
                            :class="{ active: tabIndex === 1 }"
                            @click="changeTab(1)"
                        >
                            我的积分
                        </view>
                        <view
                            class="item"
                            :class="{ active: tabIndex === 2 }"
                            @click="changeTab(2)"
                        >
                            积分扣除
                        </view>
                    </view>
                    <scroll-view
                        v-if="list.length"
                        class="list-scroll-view"
                        scroll-y="true"
                        :refresher-threshold="20"
                        @scrolltolower="lower"
                    >
                        <view
                            v-for="item in list"
                            :key="item.id"
                            class="list-item"
                        >
                            <view class="item-image">
                                <view
                                    :class="[
                                        'icon',
                                        `icon-score-${item.channel}`
                                    ]"
                                />
                            </view>
                            <view class="item-info">
                                <view class="title">
                                    {{ item.reason }}
                                </view>
                                <view class="time">
                                    {{ item.created_at }}
                                </view>
                            </view>
                            <view class="item-num">
                                {{ tabIndex === 1 ? "+" : "-" }}{{ item.score }}
                            </view>
                        </view>
                    </scroll-view>
                    <view
                        v-else
                        class="no-data"
                    >
                        <view class="image">
                            <image
                                src=""
                                mode=""
                            />
                        </view>
                        <view>暂无积分记录</view>
                    </view>
                </view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../../common/api';
import login from '../../../../widgets/login/login.vue';
import share from '../shareMinxin';

export default {
    components: {
        login,
    },
    mixins: [share.initShare],
    data() {
        return {
            loading: false,
            tabIndex: 1,
            activityId: '',
            integral: {},
            list: [],
            filter: {
                page_size: 10,
                page_num: 1,
            },
            userInfo: '',
        };
    },
    onLoad(parms) {
        this.activityId = parms.activity_id;
        this.getShareConfig();
        this.isLogin();
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getIntegral();
            this.getScoreList();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getIntegral();
                    this.getScoreList();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        getIntegral() {
            // 获取积分兑换详情
            api.get('/api/market/userscoreinfo', {
                activity_id: this.activityId,
            }).then((res) => {
                this.integral = res;
            });
        },
        changeTab(index) {
            this.tabIndex = index;
            this.filter.page_num = 1;
            uni.showLoading();
            this.getScoreList();
        },
        getScoreList(type) {
            api.get('/api/market/getscoredetail', {
                ...this.filter,
                activity_id: this.activityId,
                type: this.tabIndex,
            }).then(
                ({ list, total }) => {
                    uni.hideLoading();
                    if (type === 'reachBottom') {
                        this.list = this.list.concat(list);
                    } else {
                        this.list = list;
                    }
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = type === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
                () => {
                    uni.hideLoading();
                },
            );
        },
        lower(e) {
            console.log(e);
            this.filter.page_num += 1;
            this.getScoreList('reachBottom');
        },
    },
};
</script>
<style lang="less">
page {
    background-color: #f0f0f3;
}
</style>
<style lang="less" scoped>
.score-list-page {
    position: relative;
    min-height: 100vh;

    .main-content {
        height: 100vh;
        position: relative;
    }
    .banner-content {
        background-position: top center;
        background-size: 100% auto;
        background-repeat: no-repeat;
        background-color: #fff;
        background-image: radial-gradient(#48aafc, #4672ff);
        height: 440upx;
        padding-top: 20upx;
        box-sizing: border-box;
        .integral-content {
            margin: 0 auto;
            width: 466upx;
            height: 266upx;
            background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_circle.png")
                no-repeat center / 100% 100%;
            font-size: 28upx;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            .text-content {
                text-align: center;
                margin-top: 56upx;
            }
            .num {
                font-size: 40upx;
                font-weight: 600;
                margin-top: 8upx;
                line-height: 44upx;
                max-width: 250upx;
                text-shadow: 0px 4upx 12upx rgba(0, 0, 0, 0.2);
            }
        }
        .handel-content {
            width: 670upx;
            height: 84upx;
            margin: -18upx auto 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 16upx;
            background-color: #fff;
            box-sizing: border-box;
            box-shadow: 0px 8upx 20upx 0px rgba(0, 0, 0, 0.15);
            padding: 0 20upx;
            .item {
                text-align: center;
                font-size: 24upx;
                color: #666;
                text-align: center;
                line-height: 34upx;
                display: flex;
                align-items: center;
                line-height: 44upx;
                flex: 1;
                justify-content: center;
                overflow: hidden;
                & > text {
                    display: inline-block;
                    margin-left: 24upx;
                    font-size: 32upx;
                    color: #333;
                }
            }
            .line {
                width: 1px;
                height: 40upx;
                background-color: #d8d8d8;
            }
        }
    }
    .score-list-cont {
        position: absolute;
        top: 362upx;
        left: 40upx;
        right: 40upx;
        bottom: 44upx;
        background-color: #fff;
        box-shadow: 0 4upx 28upx 0 rgba(0, 0, 0, 0.06);
        border-radius: 16upx;
        .tab {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 98upx;
            border-bottom: 1px solid #d8d8d8;
            .item {
                flex: 1;
                text-align: center;
                position: relative;
                color: #666;
                &.active {
                    color: #000;
                    &:after {
                        content: "";
                        width: 40upx;
                        height: 2upx;
                        background-color: #1166ff;
                        position: absolute;
                        bottom: -8upx;
                        left: 50%;
                        transform: translateX(-50%);
                    }
                }
            }
        }
        .list-scroll-view {
            min-height: 700upx;
        }
        .list-scroll-view {
            overflow: auto;
            position: absolute;
            top: 100upx;
            bottom: 0;
            left: 0;
            right: 0;
        }
        .list-item {
            height: 142upx;
            padding: 32upx 40upx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            border-bottom: 1upx solid #d8d8d8;
            &:last-of-type {
                border: 0;
            }
            .item-image {
                width: 48upx;
                height: 48upx;
                margin-right: 32upx;
                .icon {
                    width: 100%;
                    height: 100%;
                    background-size: 100% 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-score3.png);
                }
                .icon-score-2 {
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-score1.png);
                }
                .icon-score-3 {
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-score2.png);
                }
                .icon-score-4,
                .icon-score-5 {
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-score3.png);
                }
                .icon-score-6,
                .icon-score-7,
                .icon-score-8 {
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-icon-score4.png);
                }
            }
            .item-info {
                width: 364upx;
                margin-right: 32upx;
                .title {
                    color: #333;
                    font-size: 26upx;
                    line-height: 36upx;
                    margin-bottom: 8upx;
                    word-break: break-all;
                }
                .time {
                    color: #999;
                    font-size: 24upx;
                    line-height: 34upx;
                }
            }
            .item-num {
                font-size: 32upx;
                color: #333;
                text-align: right;
                line-height: 44upx;
                flex: 1;
            }
        }
    }
    .no-data {
        margin-top: 60upx;
        line-height: 34upx;
        text-align: center;
        .image {
            width: 200upx;
            height: 200upx;
            margin: 0 auto 20upx;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
