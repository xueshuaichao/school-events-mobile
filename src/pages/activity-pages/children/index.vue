<template>
    <div class="activity-init-page">
        <!-- <packetRain
            :time="20000"
            :speed="{
                max: 3500,
                min: 1500
            }"
            :hide-index="hideIndex"
            @handelClick="handelClick"
        /> -->
        <indexPage
            v-if="loading"
            :index-config="indexConfig"
            :public-config="publicConfig"
            :is-stop-scroll="false"
            class-name="children-index"
            :fr="fr"
        >
            <template v-slot:prize>
                <view class="prize-box">
                    <view
                        v-for="(prize, list) in indexConfig.prizes"
                        :key="list"
                        class="prize-list"
                    >
                        <view class="prize-list-title">
                            <view class="title-text children-btn">
                                {{ prize.title }}
                            </view>
                            <view class="handel-text">
                                <text @click="prizeList(list)">
                                    {{
                                        list === 0 ? "奖项设置说明" : "幸运榜单"
                                    }}
                                </text>
                            </view>
                        </view>
                        <view
                            :class="[
                                'prize-list-item',
                                `prize-list-item-${list}`
                            ]"
                        >
                            <view
                                v-for="(item, k) in prize.item"
                                :key="k"
                                class="prize-item"
                            >
                                <view class="prize-img">
                                    <image
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_${list}_${k}.png`
                                        "
                                    />
                                </view>
                                <view class="pirze-text">
                                    <text
                                        v-if="item.text[0]"
                                        class="pirze-rank"
                                    >
                                        {{ item.text[0] }}
                                    </text>
                                    <view>{{ item.text[1] }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="prize-handel-item">
                        <view
                            class="btn"
                            @click="getPrizeNum"
                        >
                            获取抽奖机会
                        </view>
                        <view
                            class="btn"
                            @click="getPrizeLise"
                        >
                            我的中奖
                        </view>
                    </view>
                </view>
            </template>
            <template v-slot:rank />
        </indexPage>
        <maskBox
            v-if="prompt && publicConfig.activityId === 9"
            :rules="indexConfig.rules"
            type="rule"
            :theme="{
                bgColor: indexConfig.maskBgColor || publicConfig.primaryBgColor,
                titleColor: publicConfig.titleColor
            }"
            :name="publicConfig.activityName"
            @close="handleClose"
        />
    </div>
</template>

<script>
// import packetRain from '../../../components/packet-rain/index.vue';
import indexPage from '../common/index.vue';
import share from '../../../common/share';
import logger from '../../../common/logger';
// import api from '../../../common/api';

export default {
    components: {
        indexPage,
        // packetRain,
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
            fr: '',
            activityId: '',
            hideIndex: -1,
            title: '',
        };
    },
    onLoad(params) {
        this.activityId = 9;
        this.publicConfig = this.$store.getters.getPublicConfig(
            this.activityId,
        );
        this.indexConfig = {
            ...this.$store.getters.getActivityConfig({
                activityId: this.activityId,
                page: 'indexConfig',
            }),
            ...this.$store.getters.getColorConfig({
                activityId: this.activityId,
                page: 'indexColorConfig',
            }),
        };
        console.log(this.indexConfig);
        this.fr = logger.getFr(this.publicConfig.log, params);
        this.loading = true;
    },
    onShow() {},
    created() {
        // this.getRank();
        // this.historyRank();
    },
    methods: {
        handelClick(index) {
            this.hideIndex = index;
        },

        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[0];
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
        prizeList(type) {
            if (type === 1) {
                console.log(1);
                this.title = '奖品设置说明';
                this.type = 'prize';
            } else {
                this.title = '幸运榜单';
                this.type = 'lucky';
            }
        },
        getPrizeNum() {},
        getPrizeLise() {},
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

<style lang="less">
.activity-init-page {
    .children-index {
        background-color: #f00;
        .main-content {
            padding: 0 30upx;
        }
        .page-index .menu-list {
            box-sizing: border-box;
            padding-top: 77upx;
            background-color: #fff;
            border-radius: 50upx;
            margin-bottom: 120upx;
            padding-bottom: 100upx;
            box-shadow: inset 0 0px 24upx 0px rgba(182, 146, 255, 1);
            position: relative;
            &::before {
                content: "";
                position: absolute;
                left: 0;
                top: 0;
                width: 142upx;
                height: 75upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_flag1.png);
                background-size: 100% 100%;
            }
            .cansai-text {
                position: absolute;
                top: -66upx;
                left: 50%;
                transform: translateX(-50%);
                border-radius: 48upx;
                background-color: #ff78a5;
                box-shadow: inset 0px 0px 24px 0px rgba(255, 255, 255, 1);
                display: inline-block;
                text-indent: -9999px;
                width: 230upx;
                height: 74upx;
                &::before {
                    content: "";
                    position: absolute;
                    left: 13upx;
                    top: 12upx;
                    width: 25upx;
                    height: 27upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
                    background-size: 100% 100%;
                }
                &::after {
                    content: "活动作品";
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    text-indent: 0;
                    width: 100%;
                    color: #fff;
                }
            }
        }
        .page-index .menu-list .search-box button {
            width: 96upx;
            height: 70upx;
            border: 1upx solid #bb77ff;
            box-sizing: border-box;
            font-size: 26upx;
            &:first-of-type {
                margin-right: 12upx;
            }
        }
        .page-index .menu-list .search-box .search {
            width: 412upx;
        }
        .media-box .media-content {
            width: 305upx !important;
        }
        .event-craft-cover .video {
            width: 305upx;
            height: 172upx;
        }
        .page-section-spacing {
            height: 60upx !important;
            line-height: 60upx !important;
            box-shadow: 0px 0px 11px 0px rgba(255, 255, 255, 1);
            border-radius: 48upx;
            margin-bottom: 50upx;
        }
    }
    .children-btn {
        padding: 0 40upx;
        line-height: 74upx;
        color: #fff;
        border-radius: 48upx;
        background-color: #ff78a5;
        box-shadow: inset 0px 0px 24upx 0px rgba(255, 255, 255, 1);
        position: relative;
        font-size: 32upx;
        &::before {
            content: "";
            position: absolute;
            left: 13upx;
            top: 12upx;
            width: 25upx;
            height: 27upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_b.png);
            background-size: 100% 100%;
        }
    }
    .prize-box {
        box-shadow: inset 0 0px 24upx 0px rgba(182, 146, 255, 1);
        background-color: #fff;
        margin: -120upx 0upx 40upx;
        border-radius: 50upx;
        padding: 0 20upx 48upx;
        .prize-list {
            border-bottom: 2upx #c790ff dashed;
            &:nth-of-type(2) {
                border-bottom: 0 none;
            }
        }
        .prize-list-title {
            display: flex;
            justify-content: space-between;
            padding: 40upx 10upx 39upx 30upx;
            .title-text {
                &::after {
                    content: "";
                    position: absolute;
                    right: -30upx;
                    top: 5upx;
                    width: 70upx;
                    height: 60upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_bt_a.png);
                    background-size: 100% 100%;
                }
            }
            .handel-text {
                color: #bb77ff;
                font-size: 24upx;
                font-weight: 500;
                position: relative;
                top: 10upx;
                min-width: 166upx;
                text-align: center;
                &::after {
                    content: "";
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: 0upx;
                    width: 166upx;
                    height: 42upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_flag.png);
                    background-size: 100% 100%;
                }
            }
        }
        .prize-list-item {
            display: flex;
            justify-content: space-between;

            .prize-item {
                border: 4upx solid #c790ff;
                border-bottom: 0 none;
                border-radius: 7upx;
                box-sizing: border-box;
                position: relative;
                image {
                    width: 132upx;
                    height: 120upx;
                }
            }
            .pirze-text {
                position: absolute;
                left: -8upx;
                right: -8upx;
                bottom: 0upx;
                background-color: #c790ff;
                border-radius: 0 0 10upx 10upx;
                font-size: 20upx;
                text-align: center;
                color: #fff;
                padding-top: 4upx;
                padding-bottom: 2upx;
                min-height: 36upx;
                &::before {
                    content: "";
                    position: absolute;
                    top: -14upx;
                    left: 0;
                    right: 0;
                    height: 17upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_prize_bg.png);
                    background-position: top center;
                    background-size: 100% 100%;
                }
                .pirze-rank {
                    line-height: 26upx;
                    padding: 0 11upx;
                    background-color: #ffe79c;
                    color: #bb77ff;
                    display: inline-block;
                    border-radius: 16upx;
                }
            }
            &.prize-list-item-0 {
                padding: 0 50upx 50upx;
                .prize-item {
                    width: 153upx;
                    height: 188upx;
                    padding: 3upx 6upx 0;
                }
            }
            &.prize-list-item-1 {
                .pirze-text {
                    line-height: 36upx;
                }
                .prize-item {
                    width: 144upx;
                    height: 164upx;
                    padding: 3upx 2upx;
                }
            }
        }
        .prize-handel-item {
            display: flex;
            justify-content: space-between;
            margin: 48upx 31upx 0;
            .btn {
                height: 158upx;
                font-size: 28upx;
                font-weight: 500;
                color: #333;
                line-height: 173upx;
                background-position: center center;
                background-size: 100% 100%;
                text-align: center;
                &:nth-of-type(1) {
                    width: 274upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_0.png);
                }
                &:nth-of-type(2) {
                    width: 234upx;
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/children_btn-prize_1.png);
                }
            }
        }
    }
}
.week-rank {
    margin: 30upx 0 40upx;
    text-align: center;
    .title {
        color: #db4e0e;
        margin-bottom: 20upx;
        font-size: 34upx;
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
</style>
