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
                        {{ userInfo.name }}
                    </view>

                    <template v-if="userInfo.identity === 3">
                        <view class="info user-from">
                            {{ userInfo.teacher_info.school_name
                            }}{{ userInfo.teacher_info.department_name }}
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

            <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
            <!-- my works -->
            <view
                v-if="
                    !isH5 &&
                        (userInfo.identity === 3 || userInfo.identity === 4)
                "
                class="panel"
            >
                <view class="panel-hd">
                    <text
                        class="panel-title"
                        :class="{ active: tabActiveIndex === 0 }"
                        @click="setTabActive(0)"
                    >
                        已通过({{ workStatics.pass_num || 0 }})
                    </text>
                    <text
                        class="panel-title"
                        :class="{ active: tabActiveIndex === 1 }"
                        @click="setTabActive(1)"
                    >
                        待审核({{ workStatics.no_verify_num || 0 }})
                    </text>
                    <text
                        class="panel-title"
                        :class="{ active: tabActiveIndex === 2 }"
                        @click="setTabActive(2)"
                    >
                        未通过({{ workStatics.refuse_num || 0 }})
                    </text>
                </view>
                <view
                    v-if="!isLoadingTableData"
                    class="panel-bd work-list"
                >
                    <template v-if="tableData.length">
                        <view
                            v-for="item in tableData"
                            :key="item.id"
                            class="work-item"
                        >
                            <work
                                :info="item"
                                :mode="'single'"
                            />
                            <view class="btns">
                                <view
                                    v-if="item.status === 1"
                                    class="btn"
                                >
                                    分享
                                </view>
                                <view
                                    v-if="item.status !== 1"
                                    class="btn"
                                    @click="editWork(item)"
                                >
                                    编辑
                                </view>
                                <view
                                    class="btn"
                                    @click="onConfirmDelete(item)"
                                >
                                    删除
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-else>
                        <blank />
                    </template>
                </view>
            </view>

            <view v-else>
                <view class="sep" />
                <blank :type="'uc'" />
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';
import login from '../../../widgets/login/login.vue';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        login,
        work,
        blank,
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
    onLoad() {},
    created() {
        this.getData();
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

            this.getWorkStatic();
            this.getWorkData();
        },
        getWorkStatic() {
            api.get('/api/user/workstatics').then(
                (res) => {
                    // this.workStatics = res[0];
                    [this.workStatics] = res;
                },
                () => {},
            );
        },
        editWork(item) {
            uni.navigateTo({
                url: `/pages/upload/modify/modify?id=${item.id}`,
            });
        },
        deleteWork(item) {
            const index = this.tableData.indexOf(item);

            api.post('/api/user/delwork', {
                id: item.id,
            }).then((res) => {
                uni.showToast({
                    title: '删除成功',
                });
                console.log(res);
                if (index !== -1) {
                    this.tableData.splice(index, 1);
                }
                this.getWorkStatic();
            });
        },
        getWorkData() {
            // 作品状态 status 0—待审核 1—已通过 2—未通过 -1 全部
            let status = 1;
            if (this.tabActiveIndex === 1) {
                status = 0;
            } else if (this.tabActiveIndex === 2) {
                status = 2;
            }
            api.get('/api/user/worklist', {
                status,
            }).then(
                (res) => {
                    this.isLoadingTableData = false;
                    this.tableData = res.list;
                },
                () => {
                    this.tableData = [];
                },
            );
        },
        setTabActive(i) {
            this.tabActiveIndex = i;
            this.getWorkData();
        },
        doLogout() {
            try {
                uni.removeStorageSync('medusa_key');
            } catch (e) {
                // error
                console.log(e);
            }
            this.getData();
        },

        onConfirmDelete(item) {
            uni.showModal({
                title: '删除提示',
                content: '作品删除后将无法恢复 \n 确定删除吗？',
                confirmText: '确定删除',
                cancelText: '暂不删除',
                cancelColor: '#1166FF',
                confirmColor: '#999999',
                success: (res) => {
                    if (res.confirm) {
                        this.deleteWork(item);
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        uni.showToast({
                            title: '删除失败',
                            icon: 'none',
                        });
                        console.log('用户点击取消');
                    }
                },
            });
        },

        // fetch user info
        onLogin() {
            this.getData();
        },
    },
};
</script>

<style lang="less">
.page-uc-index {
    padding-bottom: 20upx;

    .sep {
        border-bottom: 1upx solid #ddd;
        margin-top: 30upx;
    }

    .user-info {
        padding: 30upx 30upx 0upx 30upx;
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

    .blank-wrap {
        margin-top: 180upx;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding-left: 0;
        padding-right: 0;
    }

    .work-list {
        .work-item {
            border-bottom: 1upx solid #ddd;
            padding: 30upx 0 50upx;

            position: relative;
        }

        .btns {
            position: absolute;
            right: 0;
            bottom: 20upx;

            .btn {
                display: inline-block;
                width: 120upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 40upx;
                background: #1166ff;
            }
        }
    }
}
</style>
