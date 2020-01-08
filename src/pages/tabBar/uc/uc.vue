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
            <view class="user-info">
                <image
                    class="avatar"
                    :src="userInfo.avatar_url || '/static/images/uc/avatar.png'"
                />
                <view class="main-info">
                    <view class="user-name">
                        {{ userInfo.name || "" }}
                    </view>

                    <template v-if="userInfo.identity === 3">
                        <view class="info user-from">
                            {{ userInfo.teacher_info.school_name || ""
                            }}{{ userInfo.teacher_info.department_name || "" }}
                        </view>
                    </template>

                    <template v-if="userInfo.identity === 4">
                        <view class="info user-from">
                            {{ userInfo.student_info.school_name
                            }}{{ userInfo.student_info.grade_name
                            }}{{ userInfo.student_info.class_name }}
                        </view>
                        <view class="info user-id">
                            学号：{{ userInfo.student_info.number }}
                        </view>
                    </template>
                </view>
            </view>
            <view class="sep" />
            <view class="menu-list">
                <navigator
                    class="menu-item"
                    url="/pages/uc/myWork/myWork"
                >
                    <image
                        class="icon"
                        src="/static/images/uc/work.png"
                    />
                    <text class="text">
                        我的作品
                    </text>
                    <text class="arrow">
                        >
                    </text>
                </navigator>
                <view
                    class="menu-item"
                    @click="doLogout"
                >
                    <image
                        class="icon"
                        src="/static/images/uc/record.png"
                    />
                    <text class="text">
                        退出登录
                    </text>
                </view>
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
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                },
                () => {
                    this.isLoading = false;
                    this.userInfo = null;
                },
            );
            // this.getWorkStatic();
            // return this.getWorkData();
        },
        doLogout() {
            try {
                uni.removeStorageSync('medusa_key');
            } catch (e) {
                // error
                console.log(e);
            }
            api.get('/api/account/logout').then(() => {
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

    .sep {
        border-bottom: 20rpx solid rgba(247, 247, 247, 1);
    }

    .user-info {
        padding: 30rpx;
        display: flex;

        .avatar {
            margin-right: 24upx;
            width: 145upx;
            height: 145upx;
        }

        .main-info {
            flex: 1;
            overflow: hidden;

            .user-name {
                font-size: 32upx;
                color: #333;
                margin-bottom: 24upx;
            }

            .info {
                color: #999;
                font-size: 22upx;
                margin-bottom: 24upx;
            }
        }
    }

    .menu-list {
        .menu-item {
            padding: 40rpx 30rpx;
            border-bottom: 1px solid #e6e6e6;
            font-size: 32rpx;
            color: #333;

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
