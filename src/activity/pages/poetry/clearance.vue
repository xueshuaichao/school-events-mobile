<template>
    <view>
        <login
            v-if="userInfo === null && toLogin"
            @login="onLogin"
        />
        <template v-else>
            <view class="page-top">
                <view class="user-info">
                    <view class="avator">
                        <image
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/clearance-title-${barrierInfo.level -
                                    1}.png`
                            "
                        />
                    </view>
                    <view class="info">
                        我的等级：
                        <text class="title">
                            {{ barrierInfo.level_title }}
                        </text>
                    </view>
                </view>
                <view
                    class="ucenter"
                    @click="confirmUcenter"
                >
                    我的作品
                </view>
            </view>
            <view class="main-data">
                <view
                    v-for="(item, index) in level"
                    :id="`row-${index}`"
                    :key="index"
                    class="level-row"
                    :class="{
                        one: index % 4 === 0,
                        two: index % 4 === 1,
                        three: index % 4 === 2,
                        four: index % 4 === 3
                    }"
                >
                    <view
                        v-for="key in item"
                        :key="key.k"
                        class="level-item"
                        @click="jumpRecord(key.k + 1)"
                    >
                        <view :class="{ cur: key.k === barrierInfo.barrier }">
                            <image
                                :src="
                                    `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-${
                                        key.canPrize ? 1 : 2
                                    }-${
                                        key.k >= barrierInfo.barrier ? 0 : 1
                                    }.png`
                                "
                                class="card"
                            />
                            <view
                                v-if="key.canPrize"
                                class="num"
                                :class="{
                                    unlocked: key.k < barrierInfo.barrier
                                }"
                            >
                                {{ key.k + 1 }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view class="fixed">
                <view
                    class="prize"
                    @click="jumpPrize"
                >
                    {{
                        barrierInfo.draw_num > 0
                            ? `抽奖*${barrierInfo.draw_num}`
                            : "抽奖啦"
                    }}
                </view>
                <view class="ucenter">
                    我的奖品
                </view>
                <!-- <view @click="pageScroll">
                    滑动
                </view> -->
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {
            maskPrompt: false,
            userInfo: null,
            toLogin: false,
            hasLogin: false,
            level: [],
            filter: {
                page_size: 32,
                page_num: 0,
            },
            loadMoreStatus: 'none',
            init: true,
            activityStatus: 2,
            barrierInfo: {
                level_title: '小诗童',
                level: 1,
                draw_num: null,
                barrier: 0,
            },
        };
    },
    onShow() {
        this.getUserinfo();
        this.getBarrierInfo();
    },
    onReachBottom() {
        if (this.loadMoreStatus === 'more') {
            this.filter.page_num = this.filter.page_num + 1;
            this.loadMoreStatus = 'loading';
            this.getlevel('reachBottom');
        }
    },
    mounted() {
        // this.getNodes();
        this.getlevel();
        this.getlevel();
        this.getActivityStatus();
    },
    methods: {
        jumpPrize() {
            uni.navigateTo({
                url: '/activity/pages/poetry/lottery?activity_id=12',
            });
        },
        getBarrierInfo() {
            api.get('/api/poem/userinfo').then((res) => {
                this.barrierInfo = { ...this.barrierInfo, ...res };
                console.log(this.barrierInfo, 'barrierInfo');
            });
        },
        getActivityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: 14,
            }).then((res) => {
                this.activityStatus = res.status;
            });
        },
        getNodes() {
            // 当前页面使用一次。
            // const that = this;
            const nodesRef = uni
                .createSelectorQuery()
                .in(this)
                .select(`#row-${this.level.length - 1}`);
            // console.log(nodesRef);
            nodesRef
                .boundingClientRect((rek) => {
                    console.log(rek);
                    uni.pageScrollTo({
                        scrollTop: rek.top,
                        duration: 300,
                    });
                })
                .exec();
        },
        pageScroll() {
            this.getNodes();
        },
        getlevel(type) {
            const newResult = this.sliceData(
                this.filter.page_size,
                this.filter.page_num,
                4,
                500,
            );
            if (type === 'reachBottom') {
                this.level = this.level.concat(newResult);
            } else {
                this.level = newResult;
            }
        },
        sliceData(pageSize, pageNum, num, max) {
            // 每个小数组的个数  max 最大长度
            const rowNum = num;
            let size = pageSize;
            this.loadMoreStatus = 'more';
            if (max - pageSize * pageNum <= 0) {
                this.loadMoreStatus = 'noMore';
                return false;
            }
            if (max - pageSize * pageNum < pageSize) {
                // 判断为最后一页并确定最后一页生成的数量
                size = max - pageSize * pageNum;
            }

            let list = [];
            list = Array.from({ length: size }, (v, k) => {
                const K = k + pageSize * pageNum;
                let canPrize = 1;
                if (k) {
                    canPrize = (K + 1) % 5;
                }
                return {
                    canPrize,
                    k: K,
                };
            });
            // 将数据拆成num个一组
            const result = [];
            for (let i = 0; i < list.length; i += rowNum) {
                result.push(list.slice(i, i + rowNum));
            }
            // 将偶数行数据颠倒
            return result.map((item, index) => (index % 2 !== 0 ? item.reverse() : item));
        },
        getUserinfo() {
            api.get('/api/user/info').then((res) => {
                this.hasLogin = true;
                this.userInfo = res.user_info;
            });
        },
        onLogin({ user_info: userInfo }) {
            this.hasLogin = true;
            this.toLogin = false;
            this.userInfo = userInfo;
        },
        jumpRecord(id) {
            if (this.activityStatus === 3) {
                if (id < this.barrierInfo.barrier + 1) {
                    // 活动已结束，继续录制，不答题
                    // id, status, barrier
                    this.$store.commit('setRecordParam', {
                        status: this.activityStatus,
                        id,
                        barrier: this.barrierInfo.barrier,
                    });
                    uni.navigateTo({
                        url: '/activity/pages/poetry/record',
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '活动已结束，不可继续闯关',
                        duration: 2000,
                    });
                }
            } else if (this.activityStatus === 2) {
                if (id < this.barrierInfo.barrier + 2) {
                    this.$store.commit('setRecordParam', {
                        status: this.activityStatus,
                        id,
                        barrier: this.barrierInfo.barrier,
                    });
                    uni.navigateTo({
                        url: '/activity/pages/poetry/record',
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '请先解锁上一关卡',
                        duration: 2000,
                    });
                }
            }
        },
        confirmUcenter() {
            if (!this.hasLogin) {
                this.toLogin = true;
            } else {
                this.jumpUcenter();
            }
        },
        jumpUcenter() {
            uni.navigateTo({
                url: `/activity/pages/poetry/ucenter?activity_id=14&user_id=${this.userInfo.user_id}`,
            });
        },
    },
};
</script>
<style scoped lang="less">
.page-top {
    height: 468upx;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-top.png);
    background-size: 100% 472upx;
    position: relative;
    padding-top: 26upx;
    box-sizing: border-box;
    .user-info {
        width: 506upx;
        height: 214upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-user.png);
        display: flex;
        background-size: 100% 100%;
        margin-left: 22upx;
        .avator {
            width: 206upx;
            margin-right: 20upx;
            image {
                width: 100%;
                height: 206upx;
            }
        }
        .info {
            color: #ffdf8a;
            margin-top: 100upx;
            line-height: 100upx;
            font-size: 28upx;
            text-shadow: 0 2upx 4upx rgba(0, 0, 0, 0.5);
            .title {
                font-size: 36upx;
            }
        }
    }
    .ucenter {
        position: absolute;
        right: 0;
        top: 30upx;
        width: 182upx;
        height: 54upx;
        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-top-bg.png);
        text-align: right;
        padding-right: 12upx;
        background-position-x: 28upx;
        color: #75a531;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        line-height: 54upx;
    }
}
.main-data {
    padding-bottom: 80upx;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-bg.png);
    background-repeat: repeat-y;
    min-height: 1306upx;
    background-size: 750upx 1306upx;
    .level-row {
        display: flex;
        justify-content: space-between;
        padding: 0 80upx;
        height: 136upx;
        margin-bottom: 140upx;
        box-sizing: border-box;
        .level-item {
            width: 88upx;
            height: 136upx;
            color: #fff;
            line-height: 100upx;
            text-align: center;
            font-size: 28upx;
            color: #ffef98;
            position: relative;
            .card {
                width: 88upx;
                height: 136upx;
            }
            .num {
                position: absolute;
                font-size: 40upx;
                color: #ffef98;
                top: 0;
                text-align: center;
                width: 88upx;
                &.unlocked {
                    color: #8b572a;
                }
            }
            .cur {
                animation: mymove 2s infinite;
            }
            @keyframes mymove {
                0% {
                    transform: scale(1);
                }
                25% {
                    transform: scale(1.05);
                }
                50% {
                    transform: scale(1);
                }
                75% {
                    transform: scale(1.05);
                }
            }
        }
        &.one {
            .level-item {
                &:nth-child(1) {
                    transform: translate(20upx, -176upx);
                }
                &:nth-child(2) {
                    transform: translate(84upx, -124upx);
                }
                &:nth-child(3) {
                    transform: translate(124upx, -88upx);
                }
                &:nth-child(4) {
                    transform: translate(38upx, 20upx);
                }
            }
        }
        &:nth-child(1) {
            .level-item {
                &:nth-child(1) {
                    transform: translate(52upx, -168upx);
                }
            }
        }
        &.two {
            .level-item {
                &:nth-child(1) {
                    transform: translate(-16upx, 40upx);
                }
                &:nth-child(2) {
                    transform: translate(-16upx, -36upx);
                }
                &:nth-child(3) {
                    transform: translate(28upx, -76upx);
                }
                &:nth-child(4) {
                    transform: translate(28upx, -132upx);
                }
            }
        }
        &.three {
            margin-bottom: 200upx;
            .level-item {
                &:nth-child(1) {
                    transform: translate(20upx, -72upx);
                }
                &:nth-child(2) {
                    transform: translate(80upx, -20upx);
                }
                &:nth-child(3) {
                    transform: translate(122upx, 10upx);
                }
                &:nth-child(4) {
                    transform: translate(40upx, 116upx);
                }
            }
        }
        &.four {
            margin-bottom: 282upx;
            .level-item {
                &:nth-child(1) {
                    transform: translate(-20upx, 76upx);
                }
                &:nth-child(2) {
                    transform: translate(-20upx, 8upx);
                }
                &:nth-child(3) {
                    transform: translate(28upx, -32upx);
                }
                &:nth-child(4) {
                    transform: translate(32upx, -100upx);
                }
            }
        }
    }
}
.fixed {
    position: fixed;
    left: 30upx;
    bottom: 86upx;
    text-align: right;
    font-size: 38upx;
    font-weight: 500;
    color: #fff;
    line-height: 76upx;
    display: flex;
    width: 520upx;
    justify-content: space-between;
    text-shadow: 0 4upx 4upx rgba(0, 0, 0, 0.5);

    .prize {
        width: 268upx;
        height: 74upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-prize.png);
        background-size: 100% 100%;
        padding-right: 16upx;
        box-sizing: border-box;
        text-align: left;
        padding-left: 74upx;
    }
    .ucenter {
        width: 236upx;
        height: 76upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-ucenter.png);
        background-size: 100% 100%;
        padding-right: 16upx;
        box-sizing: border-box;
    }
}
</style>
