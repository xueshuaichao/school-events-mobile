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
                        <image
                            class="arrow-r"
                            src="/static/images/uc/r-arrow.png"
                        />
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
            <template v-if="userInfo.identity === 4">
                <!-- 学生 -->
                <view class="item">
                    <text class="text">
                        学校
                    </text>
                    <text>{{ userInfo.student_info.school_name }}</text>
                </view>
                <view class="item">
                    <text class="text">
                        年级
                    </text>
                    <text>{{ userInfo.student_info.grade_name }}</text>
                </view>
                <view class="item">
                    <text class="text">
                        班级
                    </text>
                    <text>{{ userInfo.student_info.class_name }}</text>
                </view>
                <view class="item">
                    <text class="text">
                        用户名
                    </text>
                    <text>{{ userInfo.user_account }}</text>
                </view>
            </template>
            <navigator
                class="item"
                url="/pages/uc/setting/resetPassword"
            >
                <text class="text">
                    重置密码
                </text>
                <view class="arrow">
                    <image
                        class="arrow-r"
                        src="/static/images/uc/r-arrow.png"
                    />
                </view>
            </navigator>
            <view class="item">
                <text>绑定手机号</text>
                <text>
                    {{ userInfo.mobile }}
                </text>
            </view>
            <view
                class="btn"
                @click="doLogout"
            >
                退出登录
            </view>
        </template>
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
                    // uni.showToast({
                    //     title: err.message,
                    //     icon: 'none',
                    // });
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
            api.post('/api/user/updateuser', {
                avatar_url: data.path,
            }).then(
                () => {
                    this.userInfo.avatar_url = data.path;
                },
                (err) => {
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
            api.logout().then(() => {
                this.getData();
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
    .item {
        height: 110rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid #ddd;
        font-size: 30rpx;
    }
    .img {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
    }
    .arrow {
        color: #333;
    }
    .arrow-r {
        width: 12upx;
        height: 22upx;
        margin-left: 10upx;
    }
    .btn {
        background-color: #1166ff;
        height: 98upx;
        line-height: 98upx;
        width: 690upx;
        color: #fff;
        margin-top: 80upx;
        text-align: center;
    }
}
</style>
