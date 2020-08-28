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
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/banner.png"
                />
                <view
                    class="active-rule"
                    @click="handleActiverule"
                >
                    活动规则
                </view>
                <view
                    class="prize-rule"
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
            <view class="prizes-box">
                <image
                    class="block-title"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-prize-title.png"
                />
                <image
                    class="flower"
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/flower.png"
                />
                <view
                    v-for="(item, index) in giftList"
                    :key="index"
                >
                    <view class="prize-types">
                        {{ item.title }}
                    </view>
                    <view class="block-prizes">
                        <view class="block-prizes-ctx">
                            <view class="rule">
                                {{ item.text }}
                            </view>
                            <view class="flex">
                                <view
                                    v-for="(subItem, key) in item.prizes"
                                    :key="key"
                                >
                                    <image
                                        class="img-gift"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-${index}-${key}.png`
                                        "
                                    />
                                    <view class="txt">
                                        {{ subItem }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="prize-more">
                    更多奖品
                </view>
                <!-- 跑马灯 -->
                <tipsList
                    :text="'抽中了'"
                    :crousel-list="crouselList"
                />
            </view>
            <image
                class="block-title-act"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-act-title.png"
            />
            <view class="menu-list">
                <view class="search-box">
                    <view class="btn">
                        人气榜
                    </view>
                    <view class="btn active">
                        闯关榜
                    </view>
                    <view class="search">
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_search.png"
                        />
                        <input
                            v-model="changeValue"
                            placeholder-style="color: #A4E6DC"
                            type="text"
                            confirm-type="search"
                            confirm-hold="true"
                            maxlength="13"
                            placeholder="请输入作者姓名或作品名称"
                            @confirm="bindconfirm"
                        >
                    </view>
                </view>
                <template>
                    <view class="media-box" />
                </template>
                <template>
                    <view class="ranks-box" />
                </template>
                <uni-load-more
                    class="loadMore"
                    :status="loadMoreStatus"
                    :content-text="{
                        contentdown: '上拉显示更多',
                        contentrefresh: '正在加载...',
                        contentnomore: '———— 已经到底了~ ————'
                    }"
                    color="#254834"
                />
            </view>
            <view
                class="start"
                @click="start"
            >
                <template v-if="activityStatus == 1">
                    活动未开始
                </template>
                <template v-if="activityStatus == 2 && !hasJoin">
                    开始闯关
                </template>
                <template v-if="activityStatus == 2 && hasJoin">
                    继续闯关
                </template>
                <template v-if="activityStatus == 3">
                    查看活动
                </template>
            </view>
        </view>
    </view>
</template>
<script>
import rulemodel from './rulemodel.vue';
import prizemodel from './prizemodel.vue';
import tipsList from './tips-list.vue';
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        rulemodel,
        prizemodel,
        tipsList,
        uniLoadMore,
    },
    data() {
        return {
            rulePrompt: false,
            prizePromt: false,
            changeValue: '',
            activityStatus: 1,
            hasJoin: false,
            isLogin: false,
            loadMoreStatus: 'more',
            dataList: [],
            total: 0,
            filter: {
                activity_id: 14,
                page_num: 1,
                page_size: 10,
                sort: 'new',
                activity_cat: 1,
            },
            giftList: [
                {
                    title: '闯关达人奖',
                    text: '参与诗词闯关关卡数量排名前20可获得如下奖品',
                    prizes: ['小爱触屏音箱', '九阳养生壶', '便携式榨汁机'],
                },
                {
                    title: '闯关人气奖',
                    text: '参与诗词作品点赞量排名前45的作品可获得如下奖品',
                    prizes: ['苏泊尔豆浆机', '小米电水壶', '古风手账本套装'],
                },
                {
                    title: '闯关幸运奖',
                    text: '参与诗词闯关抽奖活动，即有机会获得如下奖品',
                    prizes: ['小度音箱', '旅行箱', '无人机'],
                },
            ],
            crouselList: [
                {
                    user_name: '111',
                    cat_name: '222',
                    resource_name: '333',
                    draw: '44',
                    prize_name: '44',
                },
                {
                    user_name: '5511',
                    cat_name: '522',
                    resource_name: '333',
                    draw: '56',
                    prize_name: '78',
                },
            ],
        };
    },
    created() {
        this.getActivityStatus();
        this.getData();
        uni.$on('onReachBottom', () => {
            console.log(this.loadMoreStatus, 'onReachBottom');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        });
    },
    methods: {
        getData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
                    }

                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                    uni.hideLoading();
                },
            );
        },
        toggelModel() {
            this.rulePrompt = false;
            this.prizePromt = false;
        },
        handleActiverule() {
            this.rulePrompt = true;
        },
        getActivityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: 14,
            }).then((res) => {
                this.activityStatus = res.status;
                if (this.activityStatus > 1) {
                    this.userHasJoin();
                }
            });
        },
        bindconfirm() {
            uni.navigateTo({
                url: `/activity/pages/mywork/mywork?type=search&name=${this.changeValue.trim()}&activity_id=14`,
            });
        },
        start() {
            if (this.activityStatus > 1) {
                api.isLogin({ fr: this.fr }).then(() => {
                    uni.navigateTo({
                        url: '/activity/pages/poetry/clearance',
                    });
                });
            }
        },
        userHasJoin() {
            api.get('/api/user/info').then((res) => {
                this.userInfo = res.user_info;
                if (this.userInfo) {
                    this.hasJoin = true;
                    // todo
                }
            });
        },
    },
};
</script>
<style scoped lang="less">
.start {
    position: fixed;
    bottom: 16upx;
    left: 100upx;
    width: 522upx;
    height: 90upx;
    text-align: center;
    line-height: 90upx;
    font-size: 32upx;
    color: #fff;
    font-weight: 600;
    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/upload-btn.png);
    background-size: 100% 100%;
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
    background: #93d7cd;
    .banner {
        position: relative;
        height: 626upx;
        .banner-image {
            width: 100%;
            height: 626upx;
        }
        .active-rule,
        .prize-rule {
            position: absolute;
            top: 16upx;
            width: 185upx;
            height: 56upx;
            line-height: 56upx;
            font-size: 28upx;
            background-repeat: no-repeat;
            background-size: 100% 100%;
        }
        .active-rule {
            left: 0;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/act-top-bg.png);
            text-indent: 12upx;
            background-position-x: -4upx;
            color: #266a89;
        }
        .prize-rule {
            right: 0;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-top-bg.png);
            text-align: right;
            padding-right: 12upx;
            background-position-x: 4upx;
            color: #75a531;
        }
        .active-time {
            position: absolute;
            top: 520upx;
            left: 218upx;
            color: #64937c;
            font-size: 22upx;
            font-style: normal;
        }
    }
    .prizes-box {
        height: 1375upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-bg.png);
        background-size: 750upx 1375upx;
        padding: 0 50upx 0;
        position: relative;
        .block-title {
            width: 750upx;
            height: 86upx;
            top: -86upx;
            position: absolute;
            left: 0;
        }
        .flower {
            position: absolute;
            right: 0;
            top: 300upx;
            width: 135upx;
            height: 133upx;
        }
        .prize-types {
            width: 360upx;
            height: 28upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/index-prize-bg.png);
            background-size: 100% 15upx;
            background-repeat: no-repeat;
            background-position-y: 6px;
            text-align: center;
            color: #739c68;
            font-size: 28upx;
            font-weight: 600;
            margin: 0 auto 20upx;
        }
        .block-prizes {
            border: 2upx solid #c2deb4;
            padding: 8upx;
            margin-bottom: 24upx;
            .block-prizes-ctx {
                background: #c2deb4;
                padding: 10upx 0;
            }
            .rule {
                color: #83ab7e;
                font-size: 20upx;
                text-align: center;
                line-height: 50upx;
            }

            .flex {
                display: flex;
                justify-content: space-evenly;
                text-align: center;
                .img-gift {
                    width: 173upx;
                    height: 173upx;
                }
                .txt {
                    color: #254834;
                    font-size: 24upx;
                    line-height: 40upx;
                }
            }
        }
        .prize-more {
            text-align: center;
            color: #64937c;
        }
    }
    .block-title-act {
        width: 750upx;
        height: 63upx;
        margin-top: -40upx;
    }
    .menu-list {
        padding-bottom: 106upx;
        .search-box {
            margin-bottom: 30rpx;
            display: flex;
            padding: 0 30upx;
            justify-content: space-between;
            .btn {
                width: 148upx;
                height: 64upx;
                line-height: 64upx;
                color: #254834;
                font-size: 28upx;
                font-weight: 600;
                text-align: center;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-btn.png);
                background-size: 100% 100%;
                &.active {
                    color: #f9e19f;
                    text-shadow: 0px 2px 4px rgba(44, NaN, 28, 0.35);
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-btn-active.png);
                    background-size: 100% 100%;
                }
            }
            .search {
                width: 382upx;
                height: 64upx;
                position: relative;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/search-box.png);
                background-size: 100% 100%;
                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 34upx;
                }
                input {
                    width: 268upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 50upx;
                    font-size: 22upx;
                    color: #fff;
                }
            }
        }
    }
}
</style>
