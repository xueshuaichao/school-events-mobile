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
        <indexPage
            v-if="loading"
            text-bg-color="#DB4E0E"
            btn-color="#04a875"
            search-color="#FF9F73"
            :index-config="indexConfig"
            :public-config="publicConfig"
            :is-stop-scroll="showHistoryRankList"
            class-name="labor-page"
            :fr="fr"
            @showMask="showMask"
        >
            <template v-slot:rank>
                <view class="week-rank">
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
                        v-if="showRank"
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
                        v-else
                        class="no-data-text"
                    >
                        本周暂无榜单生成，可查看历史榜单纪录哦
                    </view>
                </view>
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
                                    class="rank-img"
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_mini_rank_${k}.png`
                                    "
                                />
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
            </view>
        </view>
    </div>
</template>

<script>
import indexPage from '../common/index.vue';
import maskBox from '../common/mask.vue';
import share from '../../../common/share';
import logger from '../../../common/logger';
import api from '../../../common/api';

export default {
    components: {
        indexPage,
        maskBox,
    },
    filters: {
        changeNum(value) {
            const dayArr = ['一', '二', '三', '四', '五'];
            return dayArr[value];
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
            activityId: '',
            maskPrompt: false,
            maskTitle: '',
            type: 0,
        };
    },
    onLoad(params) {
        this.activityId = 8;
        this.publicConfig = this.$store.getters.getPublicConfig(
            this.activityId,
        );
        this.indexConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'indexConfig',
        });
        this.fr = logger.getFr(this.publicConfig.log, params);
        this.loading = true;
    },
    onShow() {},
    created() {
        this.getRank();
        this.historyRank();
    },
    methods: {
        showMask({ title, type }) {
            console.log(111);
            this.maskTitle = title;
            this.type = type;
            this.maskPrompt = true;
        },
        handleClose() {
            this.maskPrompt = false;
        },
        getRank() {
            api.get('/api/activity/laborrank').then((data) => {
                if (data.length === 3) {
                    this.showRank = true;
                }
                this.rank = [data[1], data[0], data[2]];
                this.initShare();
            });
        },
        historyRank() {
            api.get('/api/activity/laborranklist').then((data) => {
                this.historyRankList = data;
            });
        },
        toggleHistoryRank(status) {
            this.showHistoryRankList = status;
        },
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[random];
            console.log(this.title);
            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
            });
        },
        jumpSearch(item) {
            uni.navigateTo({
                url: `/pages/activity-pages/mywork/mywork?type=search&activity_id=${this.activityId}&user_id=${item.user_id}`,
            });
        },
        onReachBottom() {
            uni.$emit('onReachBottom');
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: '/pages/activity-pages/labor/index',
        };
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
        .user-name {
            color: #db4e0e;
            width: 60%;
            text-align: left;
        }
        .work-num {
            color: #ab3500;
            width: 38%;
            text-align: right;
        }
    }
}
@import "../theme/index.less";
</style>
