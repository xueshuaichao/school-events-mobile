<template>
    <view
        v-if="!isLoading"
        class="widget-uc-index"
    >
        <login
            v-if="isfromUc && !userInfo.user_id"
            @login="onLogin"
        />
        <view v-else>
            <view class="page-top">
                <template v-if="userInfo.myself_page">
                    <view class="icons-top">
                        <navigator
                            class="icons setting"
                            url="/pages/uc/setting/setting"
                        >
                            <image src="/static/images/uc/settings.png" />
                        </navigator>
                        <!-- <navigator
                            open-type="switchTab"
                            class="icons mess"
                            url="/pages/uc/message/message"
                        >
                            <image src="/static/images/uc/messages.png" />
                        </navigator> -->
                        <view
                            v-if="userInfo.msg_count"
                            class="mess-pop"
                        >
                            {{
                                userInfo.msg_count > 99
                                    ? "..."
                                    : userInfo.msg_count
                            }}
                        </view>
                    </view>
                </template>
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
                        <template
                            v-if="
                                userInfo.identity === 2 &&
                                    userInfo.teacher_info &&
                                    userInfo.teacher_info.department_name
                            "
                        >
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

                        <template
                            v-if="
                                userInfo.identity === 4 &&
                                    userInfo.student_info &&
                                    userInfo.student_info.number
                            "
                        >
                            <!-- 学生 -->
                            <view class="info user-from">
                                {{ userInfo.student_info.school_name || ""
                                }}{{ userInfo.student_info.grade_name || ""
                                }}{{ userInfo.student_info.class_name || "" }}
                            </view>
                            <view class="info user-id">
                                用户名：{{ userInfo.student_info.number || "" }}
                            </view>
                        </template>
                    </view>
                </view>
                <view class="user-statistics">
                    <view
                        class="user-data"
                        @click="jumpMywork"
                    >
                        <view class="num">
                            {{ userInfo.resource_count || 0 }}
                        </view>
                        <view class="txt">
                            作品
                        </view>
                    </view>
                    <view class="user-data">
                        <view class="num">
                            {{ userInfo.praise_count || 0 }}
                        </view>
                        <view class="txt">
                            获赞
                        </view>
                    </view>
                    <view class="user-data">
                        <view class="num">
                            {{ userInfo.play_count || 0 }}
                        </view>
                        <view class="txt">
                            播放
                        </view>
                    </view>
                </view>
            </view>
            <view class="page-context">
                <template v-if="honorList.length">
                    <view class="honor-block">
                        <view class="honor-top clearfix">
                            <view class="fl-l txt">
                                <image src="/static/images/uc/honor-cup.png" />
                                {{ userInfo.myself_page ? "我" : "TA" }}的荣誉
                            </view>
                            <view
                                class="fl-r more"
                                @click="jumpHonor"
                            >
                                更多
                            </view>
                        </view>
                        <view class="honor-ctx">
                            <honor-card
                                v-for="(item, index) in honorList"
                                :key="index"
                                :info="item"
                            />
                        </view>
                    </view>
                </template>
                <view class="my-work-block">
                    <view class="myork-title">
                        <view
                            class="work-nav"
                            :class="{ active: selTab === 0 }"
                            @click="clickTab(0)"
                        >
                            作品 {{ passNum }}
                        </view>
                        <view
                            class="work-nav"
                            :class="{ active: selTab === 1 }"
                            @click="clickTab(1)"
                        >
                            喜欢 {{ praise_num }}
                        </view>
                    </view>
                    <template v-if="tableData.length">
                        <view class="works-list">
                            <view
                                v-for="(item, index) in tableData"
                                :key="index"
                                class="work-item"
                            >
                                <work
                                    :info="item"
                                    :able-slide="false"
                                    :from="'/api/user/worklist'"
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
                    <template v-else>
                        <view class="temp-data-list">
                            暂无数据
                        </view>
                    </template>
                </view>
            </view>
            <template v-if="userInfo.identity === 3 && userInfo.myself_page">
                <navigator
                    class="reported-btn"
                    :class="{ 'from-detail': !isfromUc }"
                    url="/pages/uc/reported/reported"
                >
                    上报成绩
                </navigator>
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import config from '../../common/config';
import utils from '../../common/utils';
import honorCard from '../../components/uc/honor.vue';
import work from '../../components/work/work.vue';
import login from '../login/login.vue';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        honorCard,
        work,
        uniLoadMore,
        login,
    },
    props: {
        refresh: {
            type: Boolean,
            default: false,
        },
        isfromUc: {
            type: Boolean,
            default: true,
        },
        uid: {
            type: Number,
            default: 1,
        },
        reachBottom: {
            type: Boolean,
            default: false,
        },
        pageShow: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            title: 'Hello',
            isLoading: true,
            userInfo: {},

            // #ifdef H5
            isH5: true,
            // #endif

            tabActiveIndex: 0,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
            selTab: 0,
            filter: {
                status: 1,
                page_size: 10,
                page_num: 1,
                uid: 1,
                parent_scope: 2,
            },
            total: 0,
            loadMoreStatus: 'none',
            honorList: [],
            praise_num: 0,
            passNum: 0,
        };
    },
    watch: {
        refresh() {
            this.filter.page_num = 1;
            this.getData('refreshMess');
        },
        pageShow() {
            try {
                const value = uni.getStorageSync('doLogout');
                if (value || !this.userInfo.user_id) {
                    this.filter.page_num = 1;
                    this.getData();
                }
            } catch (e) {
                // error
            }
        },
        reachBottom() {
            this.onReachBottoms();
        },
    },
    mounted() {
        if (!this.isfromUc) {
            this.userInfo.uid = this.uid;
            this.filter.uid = this.uid;
        }
        this.getData();
    },
    methods: {
        onLogin() {
            this.getData();
        },
        jumpHonor() {
            uni.navigateTo({
                url: `/pages/uc/honor/honor?uid=${this.filter.uid}`,
            });
        },
        jumpMywork() {
            if (this.userInfo.myself_page) {
                uni.navigateTo({
                    url: '/pages/uc/myWork/myWork',
                });
            }
        },
        clickTab(val) {
            if (this.selTab !== val) {
                this.filter.page_num = 1;
                this.selTab = val;
                this.getWorkData();
            }
        },
        getComeInUserInfo(uid) {
            return api.get(`/api/user/showinfo?uid=${uid}`).then(
                (data) => {
                    this.isLoading = false;
                    this.userInfo = { ...this.userInfo, ...data };
                    this.getHonor(uid);
                    this.getPraise(uid);
                    this.getWorkPassNum(uid);
                    this.getWorkData();
                    uni.setNavigationBarTitle({
                        title: this.userInfo.myself_page
                            ? '我的空间'
                            : `${this.userInfo.name}的空间`,
                    });
                },
                () => {},
            );
        },
        settingImg() {
            if (this.userInfo.myself_page) {
                this.isSetImg = true;
                this.chooseImage();
            }
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
        getData(refreshMess) {
            if (this.isLoading) {
                uni.showToast({
                    icon: 'none',
                    title: '加载中',
                });
            }
            uni.removeStorage({
                key: 'doLogout',
            });
            return api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = { ...this.userInfo, ...res.user_info };
                    this.isLoading = false;
                    uni.hideToast();
                    if (this.isfromUc) {
                        this.userInfo.uid = this.userInfo.user_id;
                        this.filter.uid = this.userInfo.user_id;
                    }
                    if (refreshMess) {
                        uni.stopPullDownRefresh();
                    }
                    this.getComeInUserInfo(this.filter.uid);
                },
                () => {
                    uni.hideToast();
                    this.isLoading = false;
                    this.userInfo = {};
                },
            );
        },
        getHonor(uid) {
            api.get(`/api/user/honordemo?uid=${uid}`).then(
                (data) => {
                    this.honorList = data;
                },
                () => {
                    this.honorList = [];
                },
            );
        },
        getWorkPassNum(uid) {
            api.get(`/api/user/workstatics?parent_scope=2&uid=${uid}`).then(
                (data) => {
                    this.passNum = data.pass_num;
                },
            );
        },
        getPraise(uid) {
            api.get(`/api/works/praisecount?uid=${uid}`).then(
                ({ total }) => {
                    this.praise_num = total;
                },
                () => {},
            );
        },
        getWorkData(title) {
            let url = '/api/user/worklist';
            if (this.selTab === 1) {
                url = '/api/works/praiselist';
            }
            return api.get(url, this.filter).then(
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
        onReachBottoms() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
    },
    onLoad() {},
};
</script>

<style lang="less">
.widget-uc-index {
    position: relative;
    .page-top {
        width: 750rpx;
        height: 510rpx;
        background: url(../../static/images/uc/my-bg.png);
        background-size: 100% 100%;
        position: relative;

        .user-info {
            padding: 54rpx 60rpx;
            display: flex;

            .avatar {
                margin-right: 34upx;
                width: 116upx;
                height: 116upx;
                border-radius: 50%;
                border: 2upx solid rgba(255, 255, 255, 0.28);
            }

            .main-info {
                // flex: 1;
                width: 340rpx;
                overflow: hidden;
                color: #fff;

                .user-name {
                    font-size: 30upx;
                    margin-bottom: 10upx;
                    font-weight: 600;
                    word-break: break-all;
                }

                .info {
                    font-size: 24upx;
                    margin-bottom: 10upx;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }
        .user-statistics {
            display: flex;
            color: #fff;
            justify-content: space-evenly;
            padding: 50rpx;
            position: absolute;
            width: 100%;
            box-sizing: border-box;
            left: 0;
            bottom: 86rpx;
            .user-data {
                font-size: 28rpx;
                line-height: 40rpx;
                text-align: center;
                &:nth-child(2) {
                    border-right: 2rpx solid #82bfff;
                    border-left: 2rpx solid #82bfff;
                    padding: 0 70rpx;
                }
                .num {
                    font-size: 36rpx;
                    line-height: 36rpx;
                    font-weight: 600;
                    margin-bottom: 14rpx;
                }
                .txt {
                    color: rgba(255, 255, 255, 0.7);
                }
            }
        }
        .icons-top {
            position: absolute;
            right: 30rpx;
            top: 32rpx;
            display: flex;
            color: #fff;
            image {
                width: 38rpx;
                height: 38rpx;
            }
            .icons {
                padding: 20upx;
            }
            .setting {
                image {
                    height: 37rpx;
                    width: 39rpx;
                }
            }
            .mess-pop {
                position: absolute;
                right: 2rpx;
                width: 36rpx;
                height: 28rpx;
                line-height: 28rpx;
                text-align: center;
                color: #fff;
                background: #ff6555;
                font-size: 18rpx;
                top: 6rpx;
                border-radius: 14rpx;
            }
        }
    }
    .page-context {
        margin-top: -90rpx;
        background: #f8f8f8;
        border-radius: 50rpx 50rpx 0 0;
        position: relative;
        .honor-block {
            padding: 60rpx 30rpx 20rpx;
            background: #fff;
            border-radius: 50rpx 50rpx 0 0;
            margin-bottom: 20rpx;
            .honor-top {
                margin-bottom: 40rpx;
                .txt {
                    line-height: 38rpx;
                    font-weight: 600;
                    font-size: 32rpx;
                    color: #333;
                    position: relative;
                    padding-left: 52rpx;
                    height: 36rpx;
                    image {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 36rpx;
                        height: 36rpx;
                    }
                }
                .more {
                    font-size: 28rpx;
                    color: #999;
                    padding-right: 20rpx;
                    position: relative;
                    height: 36rpx;
                    line-height: 36rpx;
                    &::before {
                        width: 14rpx;
                        height: 14rpx;
                        border-top: 4rpx solid #999;
                        border-right: 4rpx solid #999;
                        content: "";
                        display: block;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-56%) rotate(45deg);
                        border-radius: 2rpx 0 2rpx 0;
                    }
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
            margin-bottom: 80rpx;
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
                    font-weight: 600;
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
                    margin-bottom: 30rpx;
                }
            }
        }
    }
    .reported-btn {
        position: fixed;
        // bottom: var(--window-bottom);
        bottom: 0;
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
        bottom: 60px;
        // #endif
        &.from-detail {
            // #ifdef H5
            bottom: 0;
            // #endif
        }
    }
    .temp-data-list {
        line-height: 120rpx;
        font-weight: 28rpx;
        color: #666;
        text-align: center;
    }
}
</style>
