<template>
    <view
        v-if="!isLoading"
        class="page-setting"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="p-title infos">
                个人信息
            </view>
            <view
                class="item"
                @click="settingImg"
            >
                <text class="text">
                    头像
                </text>
                <image
                    class="img"
                    :src="userInfo.avatar_url || '/static/images/uc/avatar.png'"
                />
            </view>
            <view
                class="item"
                @click="setName"
            >
                <text class="text">
                    姓名
                </text>
                <view class="arrow">
                    <!--游客可以修改姓名信息-->
                    <template
                        v-if="userInfo.identity === 1"
                        @click="settingName"
                    >
                        <text v-if="userInfo.name">
                            {{ userInfo.name }}
                        </text>
                        <text
                            v-else
                            class="placeholder"
                        >
                            未设置
                        </text>
                        <text class="arrow-r" />
                    </template>
                    <template v-else>
                        {{ userInfo.name }}
                    </template>
                </view>
            </view>
            <template v-if="userInfo.identity === 1">
                <!-- 普通用户 -->
                <view class="item">
                    <text class="text">
                        用户名
                    </text>
                    <text>{{ userInfo.user_account }}</text>
                </view>
            </template>
            <template v-if="userInfo.identity === 2">
                <!-- 教育局员工 -->
                <view class="item">
                    <text class="text">
                        部门
                    </text>
                    <text>{{ userInfo.teacher_info.department_name }}</text>
                </view>
            </template>
            <template v-if="userInfo.identity === 3">
                <!-- 老师 -->
                <view class="item">
                    <text class="text">
                        权限
                    </text>
                    <text>老师</text>
                </view>
            </template>
            <navigator
                class="item"
                url="/pages/uc/setting/resetPassword"
            >
                <text class="text">
                    重置密码
                </text>
                <text class="arrow-r" />
            </navigator>
            <view class="item">
                <text>绑定手机号</text>
                <text>
                    {{ userInfo.mobile }}
                </text>
            </view>
            <template v-if="userInfo.identity === 4">
                <!-- 学生 -->
                <view class="p-title item">
                    <view>
                        学校信息
                    </view>
                    <view
                        class="blue"
                        @click="show = true"
                    >
                        <text class="br">
                            ?
                        </text>
                        <text class="txt">
                            调班/升学
                        </text>
                    </view>
                </view>
                <view class="item">
                    <text class="text">
                        学校
                    </text>
                    <template v-if="userInfo.student_info.school_name">
                        <text>{{ userInfo.student_info.school_name }}</text>
                    </template>
                    <template v-else>
                        <navigator url="/pages/uc/setting/resetSchool">
                            <text class="none">
                                暂无学校
                            </text>
                            <text class="arrow-r" />
                        </navigator>
                    </template>
                </view>
                <view class="item">
                    <text class="text">
                        班级
                    </text>
                    <template v-if="userInfo.student_info.grade_name">
                        <text>
                            {{ userInfo.student_info.grade_name || ""
                            }}{{ userInfo.student_info.class_name || "" }}
                        </text>
                    </template>
                    <template v-else>
                        <navigator url="/pages/uc/setting/resetSchool">
                            <text class="none">
                                暂无班级
                            </text>
                            <text class="arrow-r" />
                        </navigator>
                    </template>
                </view>
                <view class="item">
                    <text class="text">
                        学生码
                    </text>
                    <view>
                        <text>
                            {{ userInfo.ID_number }}
                        </text>
                        <text
                            class="copy"
                            @click="copyDeliveryCode(userInfo.ID_number)"
                        >
                            复制
                        </text>
                    </view>
                </view>
            </template>
            <view
                class="btn"
                @click="doLogout"
            >
                退出登录
            </view>
        </template>
        <view
            v-if="show"
            class="tip-modal"
        >
            <view class="modal-ctx">
                <view class="top">
                    提示
                </view>
                <view class="body">
                    <view class="tip">
                        转校和升学的方法和注意事项：
                    </view>
                    <view class="txt more-txt">
                        点击所在学校或所在班级，依次选择需要转入的学校和班级即可（切记选择准确，否则会影响后续活动成绩）
                    </view>
                    <view class="txt">
                        注意事项：
                    </view>
                    <view class="txt">
                        1.转校或转班后，您之前的成绩不会被带到新的学校或班级。
                    </view>
                    <view class="txt">
                        2.在转校和升学前，请联系原学校管理员将您的账号做离校/升学操作。
                    </view>
                    <view
                        class="btns"
                        @click="show = false"
                    >
                        知道了
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import config from '../../../common/config';
import utils from '../../../common/utils';
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            isLoading: true,
            userInfo: {
                avatar_url: '',
                name: '',
                school: '',
                class: '',
                user_account: '',
                mobile: '',
                identity: '',
            },
            show: false,
        };
    },
    methods: {
        copyDeliveryCode(data) {
            if (this.isH5) {
                utils.handleClipboard(
                    data,
                    // eslint-disable-next-line no-restricted-globals
                    event,
                    () => {
                        this.copyToast(true);
                    },
                    () => {
                        this.copyToast(false);
                    },
                );
            } else {
                uni.setClipboardData({
                    data,
                    success: () => {
                        this.copyToast(true);
                    },
                    fail: () => {
                        this.copyToast(false);
                    },
                });
            }
        },
        copyToast(status) {
            uni.showToast({
                icon: 'none',
                title: status ? '复制成功' : '复制失败，可长按复制',
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
                },
            );
        },
        settingImg() {
            uni.chooseImage({
                count: this.count,
                success: (res) => {
                    Promise.all(
                        res.tempFilePaths.map(filePath => this.uploadFile(filePath)),
                    ).then((data) => {
                        this.updataUser(data[0]);
                    });
                },
            });
        },
        settingName() {
            uni.navigateTo({
                url: '/pages/uc/setting/userName',
            });
        },
        updataUser(data) {
            uni.showLoading();
            api.post('/api/user/updateuser', {
                avatar_url: data.path,
            }).then(
                () => {
                    this.userInfo.avatar_url = data.path;
                    uni.hideLoading();
                },
                (err) => {
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                },
            );
        },
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                        file_type: 1, // 1-image 2-video
                    },
                    header: {
                        userKey: utils.getToken(),
                    },
                    success: (uploadFileRes) => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: '服务器开小差了~',
                                icon: 'none',
                            });
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            // success
                            this.url = resp.data.path;
                            uni.hideToast();
                            resolve(resp.data);
                            // this.$emit('change', resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: 'none',
                            });
                            return reject(resp.msg);
                        }
                        return false;
                    },
                });
            });
        },
        setName() {
            const { identity } = this.userInfo;
            if (identity === 1) {
                uni.navigateTo({
                    url: '/pages/uc/setting/resetName',
                });
            }
        },
        doLogout() {
            try {
                uni.setStorageSync('doLogout', 'logout');
            } catch (e) {
                // error
            }
            api.logout().then(() => {
                uni.reLaunch({
                    url: '/pages/login/login',
                });
            });
        },
        // fetch user info
        onLogin() {
            uni.switchTab({
                url: '/pages/tabBar/uc/uc',
            });
        },
    },
    onLoad() {
        this.getData();
    },
    onShow() {
        this.getData();
    },
};
</script>
<style lang="less">
.page-setting {
    padding: 4rpx 32rpx 0;
    color: #000;
    .item {
        height: 110rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid #ddd;
        font-size: 30rpx;
        padding: 0 2upx;
    }
    .img {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
    }
    .arrow-r {
        width: 16upx;
        height: 16upx;
        border-top: 2upx solid #333;
        border-right: 2upx solid #333;
        transform: rotate(45deg);
        display: inline-block;
        position: relative;
        bottom: 2upx;
        margin-left: 14upx;
    }
    .none {
        color: #999;
    }
    .btn {
        background-color: #1166ff;
        height: 98upx;
        line-height: 98upx;
        width: 690upx;
        color: #fff;
        margin-top: 80upx;
        text-align: center;
        font-size: 32upx;
    }
    .copy {
        color: #1166ff;
        margin-left: 16upx;
        font-size: 28upx;
    }
    .p-title {
        font-size: 32upx;
        font-weight: 500;
        padding: 8upx 2upx;
        display: flex;
        justify-content: space-between;
        box-sizing: content-box;
        &.infos {
            line-height: 60upx;
            margin-top: 20upx;
        }
        .blue {
            color: #1166ff;
            .br {
                width: 30upx;
                height: 30upx;
                border-radius: 50%;
                border: 2upx solid #1166ff;
                text-align: center;
                line-height: 30upx;
                margin-right: 6upx;
                display: inline-block;
                font-size: 24upx;
            }
            .txt {
                position: relative;
                bottom: -2upx;
            }
        }
    }
    .tip-modal {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        .modal-ctx {
            width: 640upx;
            margin: 120upx auto 0;
            background: #fff;

            .top {
                height: 84upx;
                text-align: center;
                background: #1166ff;
                font-size: 32upx;
                color: #fff;
                line-height: 84upx;
                border-radius: 2upx;
            }
            .body {
                padding: 0 40upx 40upx;
            }
            .tip {
                font-size: 30upx;
                color: #000;
                line-height: 120upx;
            }
            .txt {
                font-size: 26upx;
                line-height: 42upx;
                color: #333;
                margin-bottom: 20upx;
                &.more-txt {
                    margin-bottom: 40upx;
                }
            }
            .btns {
                width: 360upx;
                margin: 40upx auto 0;
                height: 98upx;
                line-height: 98upx;
                font-size: 32upx;
                background: #1166ff;
                color: #fff;
                text-align: center;
                border-radius: 2upx;
            }
        }
    }
}
</style>
