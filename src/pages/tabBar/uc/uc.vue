<template>
    <view
        v-show="!isLoading"
        class="page-uc-index"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="page-top">
                <view class="icons-top">
                    <navigator
                        class="icons setting"
                        url="/pages/uc/setting/setting"
                    >
                        <image src="/static/images/uc/settings.png" />
                    </navigator>
                    <navigator
                        class="icons mess"
                        url="/pages/uc/message/message"
                    >
                        <image src="/static/images/uc/messages.png" />
                    </navigator>
                </view>
                <view class="user-info">
                    <image
                        class="avatar"
                        :src="
                            userInfo.avatar_url ||
                                '/static/images/uc/avatar.png'
                        "
                        @click="settingImg"
                    />
                    <view class="main-info">
                        <view class="user-name">
                            {{ userInfo.name || "" }}
                        </view>
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
                <view class="user-statistics">
                    <view class="user-data">
                        <navigator url="/pages/uc/myWork/myWork">
                            <view class="num">
                                9999
                            </view>
                            <view>
                                作品
                            </view>
                        </navigator>
                    </view>
                    <view class="user-data">
                        <view class="num">
                            9999
                        </view>
                        <view>
                            获赞作品
                        </view>
                    </view>
                    <view class="user-data">
                        <view class="num">
                            9999
                        </view>
                        <view>
                            播放
                        </view>
                    </view>
                </view>
            </view>
            <view class="page-context">
                <view class="honor-block">
                    <view class="honor-top clearfix">
                        <view class="fl-l txt">
                            <image src="/static/images/uc/honor-cup.png" />
                            我的荣誉
                        </view>
                        <navigator url="/pages/uc/honor/honor">
                            <view class="fl-r more">
                                更多
                            </view>
                        </navigator>
                    </view>
                    <view class="honor-ctx">
                        <honor-card
                            v-for="(item, index) in honorList"
                            :key="index"
                        />
                    </view>
                </view>
                <view class="my-work-block">
                    <view class="myork-title">
                        <view
                            class="work-nav"
                            :class="{ active: selTab === 0 }"
                            @click="clickTab(0)"
                        >
                            作品
                            <text>
                                23
                            </text>
                        </view>
                        <view
                            class="work-nav"
                            :class="{ active: selTab === 1 }"
                            @click="clickTab(1)"
                        >
                            喜欢
                            <text>
                                23
                            </text>
                        </view>
                    </view>
                    <template v-if="tableData.length">
                        <view class="works-list">
                            <view
                                v-for="(item, index) in tableData"
                                :key="item.id"
                                class="work-item"
                            >
                                <work
                                    :info="item"
                                    :from="'/api/user/worklist'"
                                    @click.native="toDetail(item, index)"
                                />
                            </view>
                        </view>
                        <uni-load-more
                            class="loadMore"
                            :status="loadMoreStatus"
                            :content-text="{
                                contentdown: '上拉显示更多',
                                contentrefresh: '正在加载...',
                                contentnomore: '———— 已经到底了~ ————'
                            }"
                            color="#999"
                        />
                    </template>
                </view>
            </view>
            <template v-if="userInfo.identity === 3">
                <navigator
                    class="reported-btn"
                    url="/pages/uc/reported/reported"
                >
                    上报成绩
                </navigator>
            </template>
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';
import config from '../../../common/config';
import utils from '../../../common/utils';
import login from '../../../widgets/login/login.vue';
import honorCard from '../../../components/uc/honor.vue';
import work from '../../../components/work/work.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        login,
        honorCard,
        work,
        uniLoadMore,
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
            selTab: 0,
            honorList: [1, 2, 3, 4],
            filter: {
                status: 1,
                page_size: 10,
                page_num: 1,
            },
            total: 0,
            loadMoreStatus: 'none',
        };
    },
    created() {
        this.getWorkData();
    },
    methods: {
        clickTab(val) {
            this.selTab = val;
        },
        settingImg() {
            this.isSetImg = true;
            this.chooseImage();
        },
        chooseImage(type = 1) {
            uni.chooseImage({
                count: 1, // 默认9
                success: (res) => {
                    Promise.all(
                        res.tempFilePaths.map(filePath => this.uploadFile(filePath, type)),
                    ).then((data) => {
                        this.updataUser(data[0]);
                    });
                },
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
                    url: `${config.host}/api/file/uploadfile`,
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                        file_type: 'image',
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
        getData() {
            return api.get('/api/user/info').then(
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
        toDetail(item, index) {
            this.$store.commit('setFilterData', {
                position: {
                    total: this.total,
                    curposition: index,
                    from: '/api/user/worklist',
                },
                filter: this.filter,
            });
            uni.navigateTo({
                url: `/pages/work/detail/detail?id=${item.id}&activity_id=${item.activity_id}`,
            });
        },
        getWorkData(title) {
            // 作品状态 status 0—待审核 1—已通过 2—未通过 -1 全部
            return api.get('/api/user/worklist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.tableData = this.tableData.concat(list);
                    } else {
                        this.tableData = list;
                    }
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
                () => {
                    this.tableData = [];
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
    },
    onLoad() {
        this.getData();
    },
    onShow() {
        this.getData();
    },
    onHide() {
        // this.isSetImg--是否修为改图片 为true时页面不隐藏
        if (!this.isSetImg) {
            this.isLoading = true;
        }
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
    .page-top {
        width: 750rpx;
        height: 510rpx;
        background: url(/static/images/uc/my-bg.png);
        background-size: 100% 100%;

        .user-info {
            padding: 54rpx 60rpx;
            display: flex;

            .avatar {
                margin-right: 24upx;
                width: 116upx;
                height: 116upx;
                border-radius: 50%;
            }

            .main-info {
                // flex: 1;
                width: 340rpx;
                overflow: hidden;
                color: #fff;

                .user-name {
                    font-size: 32upx;
                    margin-bottom: 16upx;
                    font-weight: 600;
                    word-break: break-all;
                }

                .info {
                    font-size: 26upx;
                    margin-bottom: 16upx;
                }
            }
        }
        .user-statistics {
            display: flex;
            color: #fff;
            justify-content: space-around;
            padding: 50rpx;
            .user-data {
                font-size: 28rpx;
                line-height: 40rpx;
                text-align: center;
                &:nth-child(2) {
                    border-right: 2rpx solid #82bfff;
                    border-left: 2rpx solid #82bfff;
                    padding: 0 60rpx;
                }
                .num {
                    font-size: 36rpx;
                    line-height: 36rpx;
                    font-weight: 600;
                    margin-bottom: 14rpx;
                }
            }
        }
        .icons-top {
            position: absolute;
            right: 50rpx;
            top: 32rpx;
            display: flex;
            color: #fff;
            .setting {
                margin-right: 40rpx;
            }
            image {
                width: 38rpx;
                height: 38rpx;
            }
        }
    }
    .page-context {
        margin-top: -90rpx;
        background: #f8f8f8;
        border-radius: 50rpx 50rpx 0 0;
        .honor-block {
            padding: 60rpx 30rpx 20rpx;
            background: #fff;
            border-radius: 50rpx 50rpx 0 0;
            margin-bottom: 40rpx;
            .honor-top {
                margin-bottom: 40rpx;
                .txt {
                    line-height: 32rpx;
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #333;
                    position: relative;
                    padding-left: 40rpx;
                    image {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 36rpx;
                        height: 36rpx;
                    }
                }
                .more {
                    font-size: 26rpx;
                    color: #999;
                }
            }
            .honor-ctx {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
            }
        }
        .my-work-block {
            background: #fff;
            padding: 30rpx;
            .myork-title {
                line-height: 26rpx;
                font-size: 32rpx;
                display: flex;
                justify-content: space-around;
                padding: 20rpx 50rpx;
                margin-bottom: 20rpx;
                .work-nav {
                    padding: 0 21rpx 20rpx;
                    color: #999;
                    &.active {
                        color: #333;
                        border-bottom: 4rpx solid #1166ff;
                    }
                }
            }
            .works-list {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                .work-item {
                    margin-bottom: 20rpx;
                }
            }
        }
    }
    .reported-btn {
        position: fixed;
        bottom: var(--window-bottom);
        width: 100%;
        background: #1166ff;
        color: #fff;
        text-align: center;
        font-size: 36rpx;
        left: 0;
        height: 98rpx;
        font-weight: 500;
        line-height: 98rpx;
        // #ifdef H5
        bottom: 120rpx;
        // #endif
    }
}
</style>
