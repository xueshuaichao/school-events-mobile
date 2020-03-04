<template>
    <view
        v-if="!isLoading"
        class="page-uc-index"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="user-bg">
                <image
                    class="avatar-bg"
                    :src="userInfo.bg_img || '/static/images/uc/avatar-bg.png'"
                />
                <view class="set-bg">
                    <image
                        class="set-bg-icon"
                        src="/static/images/uc/update.png"
                    />更换背景
                </view>
            </view>
            <view class="user-info">
                <image
                    class="avatar"
                    :src="userInfo.avatar_url || '/static/images/uc/avatar.png'"
                />
                <view class="main-info">
                    <view class="user-name">
                        {{ userInfo.name || "" }}
                    </view>
                    <template v-if="userInfo.identity === 1">
                        <!-- 普通用户 -->
                        <view
                            v-if="
                                userInfo.is_set_name === 1 ||
                                    userInfo.avatar_url ||
                                    userInfo.is_set_password
                            "
                            class="info user-from"
                        >
                            <template v-if="userInfo.is_set_name === 1">
                                {{ userInfo.mobile || "" }}
                            </template>
                        </view>
                        <view
                            v-else
                            class="info user-from"
                        >
                            请尽快完善用户信息！<navigator
                                url="/pages/uc/setting/setting"
                            >
                                点击去完善
                            </navigator>
                        </view>
                    </template>
                    <template v-if="userInfo.identity === 2">
                        <!-- 教育局员工 -->
                        <view class="info user-from">
                            部门：{{
                                userInfo.teacher_info.department_name || ""
                            }}
                        </view>
                    </template>
                    <template v-if="userInfo.identity === 3">
                        <!-- 老师 -->
                        <view class="info user-from">
                            老师
                        </view>
                    </template>

                    <template v-if="userInfo.identity === 4">
                        <!-- 学生 -->
                        <view class="info user-from">
                            {{ userInfo.student_info.school_name
                            }}{{ userInfo.student_info.grade_name
                            }}{{ userInfo.student_info.class_name }}
                        </view>
                        <view class="info user-id">
                            用户名：{{ userInfo.student_info.number }}
                        </view>
                    </template>
                </view>
            </view>
            <view class="menu-list">
                <navigator
                    class="menu-item"
                    url="/pages/uc/myWork/myWork"
                >
                    <view class="text">
                        <image
                            class="icon"
                            src="/static/images/uc/work.png"
                        />
                        我的作品
                    </view>
                    <view class="arrow">
                        <text class="text-blue">
                            已上传{{ userInfo.works_count }}个作品
                        </text>
                        <image
                            class="arrow-r"
                            src="/static/images/uc/r-arrow.png"
                        />
                    </view>
                </navigator>
                <navigator
                    class="menu-item"
                    url="/pages/uc/message/message"
                >
                    <view class="text">
                        <image
                            class="icon"
                            src="/static/images/uc/message.png"
                        />
                        消息
                    </view>
                    <view class="arrow">
                        <text class="text-red">
                            {{ userInfo.msg_count }}
                        </text>
                        <image
                            class="arrow-r"
                            src="/static/images/uc/r-arrow.png"
                        />
                    </view>
                </navigator>
                <navigator
                    class="menu-item"
                    url="/pages/uc/setting/setting"
                >
                    <view class="text">
                        <image
                            class="icon"
                            src="/static/images/uc/setting.png"
                        />
                        设置
                    </view>
                    <view class="arrow">
                        <image
                            class="arrow-r"
                            src="/static/images/uc/r-arrow.png"
                        />
                    </view>
                </navigator>
                <navigator
                    v-if="userInfo.identity === 4"
                    class="menu-item"
                    url="/pages/uc/record/record"
                >
                    <view class="text">
                        <image
                            class="icon"
                            src="/static/images/uc/record.png"
                        />
                        我的记录
                    </view>
                    <view class="arrow">
                        <image
                            class="arrow-r"
                            src="/static/images/uc/r-arrow.png"
                        />
                    </view>
                </navigator>
                <!-- <view
                    v-if="userInfo.is_admin === 1"
                    class="button"
                    @click="submitResult"
                >
                    上报成绩
                </view> -->
                <!-- <view class="menu-item">
                    <image
                        class="icon"
                        src="/static/images/uc/coin.png"
                    />
                    <text class="text">
                        我的挑战币
                    </text>
                    <text class="coin">
                        {{ userInfo.challenge_coin }}
                    </text>
                </view>

                <navigator
                    class="menu-item"
                    url="/pages/address/exchangeRecord"
                >
                    <image
                        class="icon"
                        src="/static/images/uc/record.png"
                    />
                    <text class="text">
                        兑换记录
                    </text>
                    <text class="arrow">
                        >
                    </text>
                </navigator>

                <navigator
                    class="menu-item"
                    url="/pages/address/address?title=收货地址"
                >
                    <image
                        class="icon"
                        src="/static/images/uc/address.png"
                    />
                    <text class="text">
                        收货地址
                    </text>
                    <text class="arrow">
                        >
                    </text>
                </navigator> -->
            </view>
            <navigator
                v-if="userInfo.is_admin === 1"
                class="submit-button"
                url="/pages/uc/reported/reported"
            >
                上报成绩
            </navigator>
        </template>
        <!-- <view class="form-item-wrap">
            <view
                class="btn"
                @click="bindMobile"
            >
                退出登录
            </view>
        </view> -->
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
            title: 'Hello',
            isLoading: true,
            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif

            tabActiveIndex: 0,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
        };
    },
    methods: {
        submitResult() {
            uni.navigateTo({
                url: '',
            });
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                    this.userInfo = null;
                    // uni.showToast({
                    //     title: err.message,
                    //     icon: 'none',
                    // });
                },
            );
            // this.getWorkStatic();
            // return this.getWorkData();
        },
        doLogout() {
            api.logout().then(() => {
                this.getData();
            });
        },

        // fetch user info
        onLogin() {
            this.getData();
        },
    },
    onLoad() {
        this.getData();
    },
    onShow() {
        this.getData();
    },
    onHide() {
        this.isLoading = true;
    },
    onPullDownRefresh() {
        this.getData().then(() => {
            uni.stopPullDownRefresh();
        });
    },
};
</script>

<style lang="less">
.page-uc-index {
    padding-bottom: 20upx;
    position: relative;

    .sep {
        border-bottom: 20rpx solid rgba(247, 247, 247, 1);
    }
    .user-bg {
        height: 290rpx;
        margin-bottom: 60rpx;
        position: relative;
        .avatar-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .set-bg {
            float: right;
            margin: 67rpx 24rpx 0 0;
            font-size: 24rpx;
            color: #fff;
            position: relative;
            z-index: 1;
        }
        .set-bg-icon {
            width: 23rpx;
            height: 23rpx;
            margin-right: 5rpx;
        }
    }
    .user-info {
        position: absolute;
        left: 24rpx;
        right: 24rpx;
        top: 115rpx;
        padding: 50rpx 46rpx;
        background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 1) 100%
        );
        box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.09);
        border-radius: 2px;
        display: flex;

        .avatar {
            margin-right: 24upx;
            width: 131upx;
            height: 131upx;
        }

        .main-info {
            flex: 1;
            overflow: hidden;

            .user-name {
                font-size: 32upx;
                color: #333;
                margin-bottom: 16upx;
            }

            .info {
                color: #999;
                font-size: 22upx;
                margin-bottom: 16upx;
            }
        }
    }

    .menu-list {
        padding: 4upx 32upx 48upx;
        .arrow-r {
            width: 12upx;
            height: 22upx;
        }
        .text-blue {
            color: #1166ff;
            padding-right: 16upx;
        }
        .text-red {
            color: #ff6555;
            padding-right: 16upx;
        }
        .menu-item {
            height: 62px;
            font-size: 32rpx;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .icon {
                width: 41rpx;
                height: 41rpx;
                margin-right: 20rpx;
                position: relative;
                top: 10rpx;
            }

            .arrow {
                float: right;
                color: #ccc;
            }

            .coin {
                color: #ff7915;
                font-size: 32rpx;
                float: right;
                position: relative;
                top: 6rpx;
            }
        }
    }
    .submit-button {
        background-color: #1166ff;
        color: #fff;
        line-height: 98rpx;
        width: 690rpx;
        margin: 0 auto;
        font-size: 32rpx;
        text-align: center;
    }

    // .form-item-wrap {
    //     padding: 30rpx;
    // }

    // .btn {
    //     width: 100%;
    //     background: #1166ff;
    //     color: #fff;
    //     height: 98upx;
    //     line-height: 98upx;
    //     text-align: center;
    //     margin-top: 168upx;
    // }
}
</style>
