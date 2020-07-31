<template>
    <!--打卡活动-->
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll': maskPrompt || themePrompt
            }
        ]"
    >
        <login
            v-if="userInfo === null && toLogin"
            @login="onLogin"
        />
        <template v-else>
            <image
                class="fixed-mall"
                src="/activity/static/clocked/fixed-right.png"
                @click="toMall"
            />
            <indexPage
                :index-config="indexConfig"
                :public-config="publicConfig"
                :is-stop-scroll="false"
                class-name="clocked-page"
                :fr="fr"
                :hide-button="true"
                :my-work-path="myWorkPath"
                @showMask="showMask"
                @toUcenter="toUcenter"
            >
                <template v-slot:main-data>
                    <calendar
                        :calendar-data="calendarData"
                        :signinfo="signinfo"
                        :status="btnStatus"
                        @toggleCalendar="toggleCalendar"
                    />
                    <view class="rule task">
                        <image
                            class="zhuzi zhuzi-1"
                            src="/activity/static/clocked/zhuzi.png"
                        />
                        <image
                            class="zhuzi zhuzi-2"
                            src="/activity/static/clocked/zhuzi.png"
                        />
                        <view class="rule-title">
                            <view class="txt">
                                更多积分任务
                            </view>
                            <view
                                class="more"
                                @click="openModel"
                            >
                                积分攻略
                            </view>
                        </view>
                        <view class="ctx-wrap">
                            <view
                                class="task-card video-bg"
                                @click="toUpload"
                            >
                                <view
                                    class="task-status"
                                    :class="{ done: !taskStatus.upload }"
                                >
                                    {{
                                        taskStatus.upload ? "待完成" : "已完成"
                                    }}
                                </view>
                                <view class="center">
                                    <view class="img-top video">
                                        <image
                                            src="/activity/static/clocked/video-s.png"
                                        />
                                    </view>
                                    <view class="txt">
                                        上传作品
                                    </view>
                                    <view v-if="taskStatus.upload">
                                        {{ taskStatus.upload }}积分
                                    </view>
                                </view>
                                <image
                                    class="next"
                                    src="/activity/static/clocked/next.png"
                                />
                            </view>
                            <view
                                class="task-card praise-bg"
                                @click="toUcenter('task')"
                            >
                                <view
                                    class="task-status"
                                    :class="{ done: !taskStatus.vote }"
                                >
                                    {{ taskStatus.vote ? "待完成" : "已完成" }}
                                </view>
                                <view class="center">
                                    <view class="img-top praise">
                                        <image
                                            src="/activity/static/clocked/praise-s.png"
                                        />
                                    </view>
                                    <view class="txt">
                                        作品获赞
                                    </view>
                                    <view v-if="taskStatus.vote">
                                        {{ taskStatus.vote }}积分
                                    </view>
                                </view>
                                <image
                                    class="next"
                                    src="/activity/static/clocked/next.png"
                                />
                            </view>
                        </view>
                    </view>
                    <view class="rule lottery">
                        <image
                            class="zhuzi zhuzi-1"
                            src="/activity/static/clocked/zhuzi.png"
                        />
                        <image
                            class="zhuzi zhuzi-2"
                            src="/activity/static/clocked/zhuzi.png"
                        />
                        <view class="circle-bg">
                            <view class="lottery-ctx">
                                <view class="txt">
                                    <view>
                                        打卡抽好礼
                                    </view>
                                    <view>
                                        连续打卡可获取抽奖机会~
                                    </view>
                                </view>
                                <view
                                    class="lottery-btn"
                                    @click="toLottery"
                                >
                                    {{
                                        signinfo.draw
                                            ? "抽奖X" + signinfo.draw
                                            : "去抽奖"
                                    }}
                                </view>
                            </view>
                        </view>
                    </view>
                    <view class="rule gifted">
                        <image
                            class="zhuzi zhuzi-1"
                            src="/activity/static/clocked/zhuzi2.png"
                        />
                        <image
                            class="zhuzi zhuzi-2"
                            src="/activity/static/clocked/zhuzi2.png"
                        />
                        <view class="rule-title">
                            <view class="txt">
                                精美礼品
                            </view>
                            <view
                                class="more"
                                @click="toMall"
                            >
                                更多
                            </view>
                        </view>
                        <view class="ctx-wrap">
                            <view
                                v-for="(item, index) in giftList"
                                :key="index"
                                class="card"
                            >
                                <image
                                    :src="item.url"
                                    class="img-wrap"
                                />
                                <view class="gift-name">
                                    {{ item.txt }}
                                </view>
                            </view>
                        </view>
                    </view>
                </template>
            </indexPage>
        </template>
        <model
            :show="maskPrompt"
            :mask-title="maskTitle"
            :mask-type="maskType"
            @toggelModel="handleClose"
        />
        <theme
            :show="themePrompt"
            @toggelModel="handleClose"
        />
    </view>
</template>
<script>
import indexPage from '../common/index.vue';
import logger from '../../../common/logger';
import calendar from './calendar.vue';
import model from './model.vue';
import theme from './theme.vue';
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

// 荣誉勋章的位置
// https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-1-1.png

export default {
    components: {
        indexPage,
        calendar,
        model,
        theme,
        login,
    },
    props: {
        activityId: {
            type: Number,
            default: 12,
        },
    },
    data() {
        return {
            publicConfig: {},
            indexConfig: {},
            fr: '',
            maskPrompt: false,
            themePrompt: false,
            maskTitle: '',
            maskType: 0,
            myWorkPath: '',
            giftList: [
                {
                    txt: '华为儿童手表',
                    url:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked-gift-1.png',
                },
                {
                    txt: '小度智能音响',
                    url:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked-gift-2.png',
                },
                {
                    txt: '无人机',
                    url:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked-gift-3.png',
                },
            ],
            showModal: false,
            userInfo: null,
            calendarData: {},
            signinfo: {
                draw: 0,
                points: 0,
                serial_day: 0,
                skill: 0,
                sports: 0,
                study: 0,
                work: 0,
            },
            btnStatus: 0,
            hasLogin: false,
            toLogin: false,
            taskStatus: {
                upload: 15,
                vote: 10,
            },
            curThemeInfo: {
                type: '',
                status: 0,
            },
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
        this.loginMyWork();
    },
    methods: {
        unload() {},
        onshow() {},
        loginMyWork() {
            this.isLogin().then(
                (res) => {
                    this.hasLogin = true;
                    this.userInfo = res.user_info;
                    this.myWorkPath = `/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}`;
                    this.getsigninfo();
                    this.getClockin();
                    this.getTheme();
                    this.getTaskStatus();
                },
                () => {},
            );
        },
        getTaskStatus() {
            api.get('/api/activity/taskstatus', {
                activity_id: 12,
            }).then((tasks) => {
                this.taskStatus = tasks;
            });
        },
        getTheme() {
            api.get('/api/activity/curtheme', {
                activity_id: 12,
            }).then(({ type, status }) => {
                if (!type) {
                    this.btnStatus = 0;
                }
                if (type && status === 1) {
                    this.btnStatus = 2;
                }
                if (type && !status) {
                    this.btnStatus = 1;
                }
                this.curThemeInfo.type = type;
                this.curThemeInfo.status = status;
            });
        },
        getsigninfo() {
            api.get('/api/activity/signinfo', {
                user_id: this.userInfo.user_id,
                activity_id: 12,
            }).then((signinfo) => {
                this.signinfo = signinfo;
            });
        },
        getClockin() {
            api.get('/api/activity/clockin', {
                user_id: this.userInfo.user_id,
                activity_id: 12,
            }).then((data) => {
                if (Object.keys(data).length) {
                    this.calendarData = data;
                }
            });
        },
        onLogin({ user_info: userInfo }) {
            console.log('asasass', userInfo);
            this.hasLogin = true;
            this.userInfo = userInfo;
            console.log(this.userInfo, 'hhhhhhh');
            this.myWorkPath = `/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}`;
            this.getsigninfo();
            this.getClockin();
            this.getTheme();
            this.getTaskStatus();
        },
        toggleCalendar() {
            if (this.btnStatus === 0) {
                if (this.hasLogin) {
                    this.themePrompt = true;
                } else {
                    this.toLogin = true;
                }
            } else if (this.btnStatus === 1) {
                uni.navigateTo({
                    url: `/activity/pages/upload/modify?activity_id=12&ac_type=${this.curThemeInfo.type}&status=${this.curThemeInfo.status}&days=${this.signinfo.serial_day}`,
                });
            } else {
                uni.showToast({
                    icon: 'none',
                    title:
                        '今日已完成打卡，可通过更多作品及作品获赞获取更多积分',
                });
            }
        },
        showMask({ title, type }) {
            this.maskTitle = title;
            this.maskType = type;
            this.maskPrompt = true;
        },
        openModel() {
            this.maskTitle = '积分攻略';
            this.maskType = 1;
            this.maskPrompt = true;
        },
        handleClose(id) {
            // 关闭弹窗
            this.maskPrompt = false;
            this.themePrompt = false;
            if (id) {
                // 选择主题后进行打卡。
                uni.navigateTo({
                    url: `/activity/pages/upload/modify?activity_id=12&ac_type=${id}&status=0`,
                });
            }
        },
        isLogin() {
            return api.get('/api/user/info');
        },
        toUpload() {
            // 先查询今天的主题。
            if (this.hasLogin) {
                if (this.curThemeInfo.type || !this.curThemeInfo.status) {
                    uni.navigateTo({
                        url: `/activity/pages/upload/modify?activity_id=12&ac_type=${this.curThemeInfo.type}&status=${this.curThemeInfo.status}&days=${this.signinfo.serial_day}`,
                    });
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '请先完成打卡任务哦！',
                    });
                }
            } else {
                this.toLogin = true;
            }
        },
        toUcenter(task) {
            if (this.hasLogin) {
                if (task) {
                    if (this.curThemeInfo.type && this.curThemeInfo.status) {
                        uni.navigateTo({
                            url: `/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}`,
                        });
                    } else {
                        uni.showToast({
                            icon: 'none',
                            title: '请先完成打卡任务哦！',
                        });
                    }
                } else {
                    uni.navigateTo({
                        url: `/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}`,
                    });
                }
            } else {
                this.toLogin = true;
            }
        },
        toMall() {
            if (this.hasLogin) {
                uni.navigateTo({
                    url: '/activity/pages/mall/index?activity_id=12',
                });
            } else {
                this.toLogin = true;
            }
        },
        toLottery() {
            if (this.hasLogin) {
                uni.navigateTo({
                    url: '/activity/pages/clocked/lottery?activity_id=12',
                });
            } else {
                this.toLogin = true;
            }
        },
    },
};
</script>
<style scoped lang="less">
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.activity-init-page {
    .fixed-mall {
        position: fixed;
        right: -10upx;
        width: 150upx;
        height: 136upx;
        top: 50%;
        margin-top: -48upx;
        z-index: 100;
    }
    .rule {
        position: relative;
        padding: 0 30upx;
        min-height: 50upx;
        margin-top: 72upx;
        &::before {
            content: "";
            width: 690upx;
            height: 24upx;
            background: #ffa19a;
            position: absolute;
            border-radius: 0 0 20upx 20upx;
            bottom: -10upx;
        }
        &.lottery::before {
            background: #ff867d;
        }
        .zhuzi {
            position: absolute;
            width: 22upx;
            height: 68upx;
            top: -68upx;
            &.zhuzi-2 {
                right: 130upx;
            }
            &.zhuzi-1 {
                left: 130upx;
            }
        }
        .rule-title {
            display: flex;
            height: 72upx;
            background: linear-gradient(
                180deg,
                rgba(255, 162, 132, 1) 0%,
                rgba(255, 104, 76, 1) 100%
            );
            box-shadow: 0px 2upx 4upx 0 rgba(255, 255, 255, 0.5);
            border-radius: 20upx 20upx 0 0;
            color: #fff;
            line-height: 72upx;
            padding: 0 30upx;
            justify-content: space-between;
            .txt {
                font-size: 32upx;
            }
            .more {
                font-size: 24upx;
            }
        }
        .circle-bg {
            padding: 20upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/circle-bg.png);
            background-color: rgba(255, 161, 154, 1);
            background-size: 100% 100%;
            background-position: 0 4upx;
            box-shadow: 0 2upx 4upx 0 rgba(255, 255, 255, 0.5);
            border-radius: 20upx;
            position: relative;
            .lottery-ctx {
                background: #ff5a4c;
                border-radius: 10upx;
                display: flex;
                justify-content: space-between;
                padding: 12upx 30upx 10upx;
                .txt {
                    font-size: 32upx;
                    color: rgba(255, 228, 100, 1);
                    line-height: 56upx;
                    text-shadow: 0 4upx 4upx rgba(255, 20, 0, 1);
                    text-align: center;
                    width: 70%;
                    letter-spacing: 2upx;
                }
                .lottery-btn {
                    color: #ff5547;
                    font-size: 32upx;
                    padding: 40upx 0;
                    width: 144upx;
                    text-align: center;
                    background: #ffe464;
                    border-radius: 20upx;
                    font-weight: 500;
                }
            }
        }

        .ctx-wrap {
            padding: 30upx;
            background: #ffdada;
            border-radius: 0 0 20upx 20upx;
            position: relative;
            display: flex;
            justify-content: space-between;
            .card {
                width: 190upx;
                height: 208upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/card-bg.png);
                background-size: 100% 100%;
                .img-wrap {
                    height: 116upx;
                    width: 136upx;
                    margin-top: 6upx;
                    margin-left: 26upx;
                }
                .gift-name {
                    margin-top: 28upx;
                    width: 170upx;
                    height: 40upx;
                    background: #ffe967;
                    color: #ff685c;
                    font-size: 18upx;
                    text-align: center;
                    line-height: 40upx;
                    border-radius: 20upx;
                    font-weight: 500;
                    margin-left: 10upx;
                }
            }
            .task-card {
                width: 300upx;
                height: 180upx;
                display: flex;
                border-radius: 10px;
                background: #fff;
                justify-content: flex-end;
                color: #ff685c;
                font-size: 24upx;
                line-height: 48upx;
                position: relative;
                &.video-bg {
                    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/video-l.png)
                        right top no-repeat;
                    background-color: #fff;
                    background-size: 156upx 180upx;
                }
                &.praise-bg {
                    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/praise-l.png)
                        right top no-repeat;
                    background-color: #fff;
                    background-size: 156upx 180upx;
                }
                &::before,
                &::after {
                    content: "";
                    position: absolute;
                }
                &::before {
                    background: rgba(255, 255, 255, 0.6);
                    box-shadow: 0 4upx 10upx 0 rgba(255, 218, 218, 0.5);
                    border-radius: 0 0 10upx 10upx;
                    width: 280upx;
                    left: 10upx;
                    bottom: -6upx;
                    height: 12upx;
                }
                &::after {
                    width: 260upx;
                    background: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 4upx 10upx 0 rgba(255, 175, 175, 1);
                    border-radius: 0 0 10upx 10upx;
                    bottom: -12upx;
                    left: 20upx;
                    height: 6upx;
                }
                .task-status {
                    position: absolute;
                    left: 0;
                    top: 0;
                    background: #ff685c;
                    width: 100upx;
                    height: 40upx;
                    font-size: 22upx;
                    color: #fff;
                    font-weight: 500;
                    border-radius: 10upx 0 20upx 0;
                    text-align: center;
                    line-height: 40upx;
                    &.done {
                        background: #bababa;
                    }
                }
                .txt {
                    font-size: 26upx;
                    font-weight: 500;
                    line-height: 26upx;
                    color: #666;
                }
                .next {
                    width: 40upx;
                    height: 40upx;
                    margin: 70upx 20upx 0 28upx;
                }
                .center {
                    text-align: center;
                }
                .img-top {
                    width: 60upx;
                    height: 60upx;
                    margin: 20upx auto 18upx;
                    &.video {
                        background: linear-gradient(
                            180deg,
                            rgba(255, 228, 73, 1) 0%,
                            rgba(255, 186, 0, 1) 100%
                        );
                        border-radius: 10upx;
                    }
                    &.praise {
                        background: linear-gradient(
                            180deg,
                            rgba(120, 193, 255, 1) 0%,
                            rgba(82, 127, 255, 1) 100%
                        );
                        border-radius: 10upx;
                    }
                    image {
                        width: 44upx;
                        height: 38upx;
                        margin: 8upx 0 0 8upx;
                    }
                }
            }
        }
    }
}
</style>
