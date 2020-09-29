<template>
    <div class="activity-init-page">
        <maskBox
            v-if="maskPrompt"
            class="mask"
            :type="type"
            :title="maskTitle"
            :theme="{
                bgColor:
                    publicConfig.maskBgColor || publicConfig.primaryBgColor,
                titleColor: publicConfig.titleColor
            }"
            :name="publicConfig.activityName"
            :show-qr-code="type === 0"
            :rules="indexConfig.rules"
            @close="handleClose"
        />
        <!-- 奖品说明 -->
        <prize-desc
            v-if="prizePrompt"
            :activity-id="activityId"
            :prizes-detail="indexConfig.prizesDetail"
            :theme="{
                bgColor: publicConfig.primaryBgColor,
                titleColor: publicConfig.titleColor
            }"
            :name="publicConfig.activityName"
            @close="handleCloses"
        />
        <indexPage
            text-bg-color="#DB4E0E"
            btn-color="#04a875"
            search-color="#FF9F73"
            :index-config="indexConfig"
            :public-config="publicConfig"
            :is-stop-scroll="showHistoryRankList"
            :class-name="`labor-page ${activityId === 13 ? 'spring' : ''}`"
            :fr="fr"
            @showMask="showMask"
        >
            <template v-slot:main-data>
                <!-- 奖品 -->
                <prize
                    :activity-id="activityId"
                    :name="publicConfig.activityName"
                    :text-color="publicConfig.primaryColor"
                    :border-color="publicConfig.primaryBgColor"
                    :prize-list="indexConfig.prizes"
                    @handleActiveprize="handleActiveprize"
                />

                <view
                    v-if="historyRankList.length || showRank"
                    class="week-rank"
                >
                    <view class="title">
                        —— 本周劳动能手 ——
                    </view>
                    <view
                        v-if="historyRankList.length"
                        class="history-rank"
                        @click="toggleHistoryRank(true)"
                    >
                        历史榜单
                    </view>
                    <view
                        v-if="showRank && activityId === 13"
                        class="week-rank-list-2"
                    >
                        <view
                            v-for="(item, index) in rank"
                            :key="index"
                            class="rank-item-2"
                            @click="jumpSearch(item)"
                        >
                            <view class="item-left">
                                <view class="crown">
                                    <image
                                        v-if="index < 3"
                                        class="crown-icon"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor-crown-${index +
                                                1}.png`
                                        "
                                    />
                                    <view
                                        v-else
                                        class="crown-num"
                                    >
                                        {{ index + 1 }}
                                    </view>
                                </view>
                                <image
                                    class="avatar"
                                    :src="
                                        item.avatar_url ||
                                            '/static/images/uc/avatar.png'
                                    "
                                />
                                <view class="rank-name text-one-line">
                                    {{ item.user_name }}
                                </view>
                            </view>
                            <view class="item-right">
                                <image
                                    class="fire"
                                    src="/static/images/upload/fire.png"
                                />
                                <view class="work-num text-one-line">
                                    作品{{ item.num }}个
                                </view>
                            </view>
                        </view>
                    </view>
                    <view
                        v-if="showRank && activityId === 8"
                        class="week-rank-list"
                    >
                        <view
                            v-for="(item, index) in rank"
                            :key="index"
                            class="rank-item"
                            @click="jumpSearch(item)"
                        >
                            <image
                                :src="
                                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_rank-${index +
                                        1}.png`
                                "
                            />
                            <view class="rank-name text-one-line">
                                {{ item.user_name }}
                            </view>
                            <view class="work-num text-one-line">
                                作品{{ item.num }}个
                            </view>
                        </view>
                    </view>
                    <view
                        v-if="!showRank"
                        class="no-data-text"
                    >
                        本周暂无榜单生成，可查看历史榜单纪录哦
                    </view>
                </view>
                <!-- 跑马灯 -->
                <tipsList
                    :text="'发布了'"
                    :crousel-list="crouselList"
                />
            </template>
        </indexPage>
        <view
            v-show="showHistoryRankList"
            class="history-rank-list"
        >
            <view class="history-content">
                <image
                    v-if="publicConfig.activityName"
                    class="close"
                    :src="
                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_close.png`
                    "
                    @click="toggleHistoryRank(false)"
                />
                <view class="title">
                    历史榜单
                </view>
                <view class="history-content-box">
                    <view
                        v-for="(item, index) in historyRankList"
                        :key="index"
                        class="history-item"
                    >
                        <view class="tit">
                            第{{ index | changeNum }}周小能手{{
                                item.start_time
                            }}-{{ item.end_time }}
                        </view>
                        <view class="history-box">
                            <view
                                v-for="(list, k) in item.rank_list"
                                :key="k"
                                class="text-item"
                            >
                                <image
                                    v-if="activityId === 8"
                                    class="rank-img"
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_mini_rank_${k}.png`
                                    "
                                />
                                <view v-else>
                                    <image
                                        v-if="k < 3"
                                        class="rank-img-2"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor-crown-${k +
                                                1}.png`
                                        "
                                    />
                                    <view
                                        v-else
                                        class="rank-num"
                                    >
                                        {{ k + 1 }}
                                    </view>
                                </view>
                                <view class="text-content">
                                    <text class="user-name text-one-line">
                                        {{ list.user_name }}
                                    </text>
                                    <text class="work-num text-one-line">
                                        作品{{ list.works_num }}个
                                    </text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="tips">
                    立即参与活动吧！下一个劳动小能手就是你！
                </view>
                <view class="tips2">
                    ~活动结束前被删除的、内容不符合要求的作品将不被计数哦~
                </view>
            </view>
        </view>
    </div>
</template>

<script>
import indexPage from '../common/index.vue';
import maskBox from '../common/mask.vue';
import logger from '../../../common/logger';
import api from '../../../common/api';
import prizeDesc from '../common/prize-desc.vue';
import tipsList from '../common/tips-list.vue';
import prize from '../common/prize.vue';

export default {
    components: {
        indexPage,
        maskBox,
        prizeDesc,
        tipsList,
        prize,
    },
    filters: {
        changeNum(value) {
            const dayArr = ['一', '二', '三', '四', '五'];
            return dayArr[value];
        },
    },
    props: {
        activityId: {
            type: Number,
            default: 13,
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            loading: false,
            publicConfig: {},
            indexConfig: {},
            showRank: false,
            rank: [],
            historyRankList: [],
            showHistoryRankList: false,
            fr: '',
            maskPrompt: false,
            maskTitle: '',
            type: 0,
            crouselList: [],
            prizePrompt: false,
            setId: null,
        };
    },
    created() {
        this.publicConfig = {
            ...this.$store.getters.getPublicConfig(this.activityId),
            ...this.$store.getters.getColorConfig({
                activityId: this.activityId,
                page: 'indexColorConfig',
            }),
        };
        this.indexConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'indexConfig',
        });
        this.fr = logger.getFr(this.publicConfig.log, {});
        this.getRank();
        this.historyRank();
        this.getCrouselList();
    },
    onUnload() {
        clearInterval(this.setId);
        this.setId = null;
    },
    methods: {
        getCrouselList() {
            this.postCrouselList();
            this.setId = setInterval(() => {
                this.postCrouselList();
            }, 1000 * 60 * 5);
        },
        postCrouselList() {
            api.post('/api/activity/resourcelist', {
                activity_id: this.activityId,
                page_num: 1,
                page_size: 10,
            }).then(({ list }) => {
                this.crouselList = list;
            });
        },

        handleActiveprize() {
            this.prizePrompt = true;
        },
        showMask({ title, type }) {
            this.maskTitle = title;
            this.type = type;
            this.maskPrompt = true;
        },
        handleClose() {
            this.maskPrompt = false;
        },
        handleCloses() {
            this.prizePrompt = false;
        },
        getRank() {
            api.get('/api/activity/laborrank', {
                activity_id: this.activityId,
            }).then((data) => {
                if (data.length >= 3) {
                    this.showRank = true;
                }
                if (this.activityId === 8) {
                    this.rank = [data[1], data[0], data[2]];
                } else {
                    this.rank = data;
                }
            });
        },
        historyRank() {
            api.get('/api/activity/laborranklist', {
                activity_id: this.activityId,
            }).then((data) => {
                this.historyRankList = data;
            });
        },
        toggleHistoryRank(status) {
            this.showHistoryRankList = status;
        },
        jumpSearch(item) {
            uni.navigateTo({
                url: `/activity/pages/mywork/mywork?type=search&activity_id=${this.activityId}&user_id=${item.user_id}`,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.week-rank {
    margin: 30upx 0 40upx;
    text-align: center;
    .title {
        color: #db4e0e;
        margin-bottom: 20upx;
        font-size: 34upx;
    }
    .no-data-text {
        color: #451600;
        font-size: 24upx;
        line-height: 1;
    }
    .history-rank {
        display: inline-block;
        padding: 12upx 20upx;
        color: #fff;
        background-color: #db4e0e;
        border-radius: 28upx;
        margin-bottom: 20upx;
        font-size: 24upx;
    }
    .week-rank-list-2 {
        width: 630upx;
        margin: 8upx auto 40upx;
        background: rgba(255, 251, 246, 1);
        box-shadow: 0 0 8upx 0 #ffce99 inset;
        border-radius: 10upx 10upx 0 0;
        .rank-item-2 {
            display: flex;
            justify-content: space-between;
            border-bottom: 2upx solid #ffce99;
            padding: 24upx;
            .item-left,
            .item-right {
                display: flex;
            }
            .crown-num {
                width: 24upx;
                height: 24upx;
                background: #f5c189;
                border-radius: 4px;
                font-size: 20upx;
                color: #fff;
                line-height: 24upx;
                margin-top: 20upx;
                font-weight: 500;
            }
            .crown-icon {
                width: 34upx;
                height: 24upx;
                margin-top: 20upx;
                font-weight: 500;
                text-align: center;
            }
            .avatar {
                width: 64upx;
                height: 64upx;
                border-radius: 50%;
                margin: 0 16upx;
            }
            .fire {
                width: 21upx;
                height: 24upx;
                margin-right: 12upx;
                margin-top: 20upx;
            }
            .rank-name {
                color: #db4e0e;
                font-size: 24upx;
                line-height: 64upx;
                font-weight: 500;
                width: 240upx;
                text-align: left;
            }
            .work-num {
                color: #ab3500;
                font-size: 22upx;
                line-height: 64upx;
            }
        }
    }
    .week-rank-list {
        margin: 0 85upx;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        .rank-item {
            background-color: #fffbf6;
            border-radius: 10upx 10upx 0px 0px;
            box-shadow: inset -16upx 47upx 0 #ffce99;
            box-shadow: inset 0px 0upx 50upx 0px rgba(255, 206, 153, 0.46);
            padding: 20upx 10upx 0;
            box-sizing: border-box;
            & > image {
                margin: 0 auto;
            }
            &:nth-of-type(1) {
                height: 200upx;
                width: 180upx;
                & > image {
                    width: 70upx;
                    height: 86upx;
                    margin-bottom: 18upx;
                }
            }
            &:nth-of-type(2) {
                height: 220upx;
                width: 220upx;
                & > image {
                    width: 80upx;
                    height: 99upx;
                    margin-bottom: 25upx;
                }
            }
            &:nth-of-type(3) {
                height: 180upx;
                width: 180upx;
                & > image {
                    width: 60upx;
                    height: 74upx;
                    margin-bottom: 10upx;
                }
            }
        }
        .rank-name {
            color: #db4e0e;
            font-size: 24upx;
            line-height: 1;
        }
        .work-num {
            color: #ab3500;
            font-size: 22upx;
        }
    }
}
.history-rank-list {
    background-color: rgba(0, 0, 0, 0.8);
    box-sizing: border-box;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #fff;
    z-index: 9999;

    .history-content {
        background-color: #fffbf6;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600rpx;
        padding: 39rpx 20rpx 23rpx;
        box-sizing: border-box;
        padding-right: 20rpx;
        border-radius: 10upx;
        .close {
            width: 62upx;
            height: 62upx;
            top: -13upx;
            right: -12upx;
            position: absolute;
        }
    }
    .tips {
        height: 70upx;
        line-height: 70upx;
        background-color: #fffbf6;
        color: #db4e0e;
        font-size: 26upx;
        text-align: center;
    }
    .tips2 {
        font-size: 20upx;
        color: #db4e0e;
        text-align: center;
        line-height: 30upx;
    }
    .history-content-box {
        overflow-y: auto;
        max-height: 616upx;
        min-height: 402upx;
        &::-webkit-scrollbar {
            width: 2upx;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 2upx;
            background-color: #db4e0e;
        }
    }
    .title {
        color: #db4e0e;
        font-size: 34upx;
        line-height: 1;
        margin-bottom: 30upx;
        text-align: center;
    }
    .history-item {
        .history-box {
            border: 2upx solid rgba(255, 206, 153, 1);
            border-radius: 10upx;
            margin-bottom: 36upx;
        }
        .tit {
            color: #db4e0e;
            font-size: 26upx;
            line-height: 1;
            margin-bottom: 29upx;
            text-align: center;
        }
        .text-item {
            display: flex;
            justify-content: space-between;
            padding: 14upx 66upx 8upx 34upx;
            box-sizing: border-box;
            &:last-of-type {
                .text-content {
                    border: 0 none;
                }
            }
        }
        .text-content {
            border-bottom: 1upx solid rgba(255, 206, 153, 0.45);
            display: flex;
            justify-content: space-between;
            line-height: 64upx;
            width: 399upx;
            flex: 1;
            border-bottom: 1upx solid #ffce99;
            font-size: 24upx;
        }
        .rank-img {
            width: 40upx;
            height: 50upx;
            margin-right: 20upx;
            margin-top: 7upx;
        }
        .rank-img-2 {
            width: 35upx;
            height: 24upx;
            margin-top: 20upx;
            margin-right: 18upx;
        }
        .rank-num {
            width: 24upx;
            height: 24upx;
            background: #ffce99;
            text-align: center;
            line-height: 24upx;
            color: #fff;
            font-weight: 500;
            font-size: 20upx;
            margin-top: 20upx;
            margin-right: 18upx;
        }
        .user-name {
            color: #db4e0e;
            width: 60%;
            text-align: left;
        }
        .work-num {
            color: #ab3500;
            width: 38%;
            text-align: right;
            font-weight: 500;
        }
    }
}
@import "../theme/index.less";
</style>
