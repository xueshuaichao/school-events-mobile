<template>
    <view
        v-show="!isLoading"
        class="page-read-work"
        :class="{ login: userInfo === null }"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <!-- my works -->
        <view
            v-else
            class="panel"
        >
            <view
                v-if="type === 'myWork'"
                class="panel-hd"
            >
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 2 }"
                    @click="setTabActive(2)"
                >
                    已通过({{ allNum.pass || 0 }})
                </text>
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 1 }"
                    @click="setTabActive(1)"
                >
                    待审核({{ allNum.wait || 0 }})
                </text>
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 3 }"
                    @click="setTabActive(3)"
                >
                    未通过({{ allNum.no_pass || 0 }})
                </text>
            </view>
            <view
                v-else
                class="search-box"
            >
                <button
                    :class="{
                        active: activeMenuIndex === '1'
                    }"
                    @click="toggle('1')"
                >
                    中文组
                </button>
                <button
                    :class="{
                        active: activeMenuIndex === '2'
                    }"
                    @click="toggle('2')"
                >
                    英文组
                </button>
                <view class="search">
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_search.png"
                    />
                    <form action="javascript:return true">
                        <input
                            v-model="changeValue"
                            type="text"
                            confirm-type="search"
                            confirm-hold="true"
                            placeholder-style="color:#E5FFF7"
                            placeholder="请输入作者姓名或作品名称"
                            @confirm="bindconfirm"
                        >
                    </form>
                    <text
                        class="search-button"
                        @click="bindconfirm"
                    >
                        搜索
                    </text>
                </view>
            </view>
            <view
                v-if="total > 0"
                class="media-list"
            >
                <view
                    v-for="(item, index) in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <event-craft-cover
                        :info="item"
                        :media-icon="type !== 'myWork'"
                        :like-icon="type === 'myWork'"
                        :best-icon="false"
                        :bg-color="'19B583'"
                        @click.native="viewDetail(item, index)"
                    />

                    <view
                        v-if="type === 'myWork'"
                        class="work-info"
                    >
                        <view class="media-name text-two-line">
                            {{ ` ${item.resource_name}` }}
                        </view>

                        <view class="media-time">
                            {{ item.created_at }}
                        </view>
                        <view class="btn">
                            <text
                                v-if="Number(tabActiveIndex) === 2"
                                class="btn-item"
                                @click="viewDetail(item)"
                            >
                                查看
                            </text>
                            <text
                                v-if="Number(tabActiveIndex) === 3"
                                class="btn-item big"
                                @click="reason(item)"
                            >
                                驳回原因
                            </text>
                            <text
                                v-if="Number(tabActiveIndex) !== 2"
                                class="btn-item"
                                @click="modifyItem(item)"
                            >
                                编辑
                            </text>
                            <text
                                class="btn-item"
                                @click="onConfirmDelete(item)"
                            >
                                删除
                            </text>
                        </view>
                    </view>
                    <view
                        v-else
                        class="work-info"
                    >
                        <view class="text-two-line">
                            {{ item.resource_name }}
                        </view>
                        <view class="media-name">
                            {{ item.user_name }}
                        </view>
                        <view class="media-time">
                            {{ item.created_at }}
                        </view>
                        <view class="vote-num">
                            {{ item.ticket }}赞
                        </view>
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
                    color="#fff"
                />
            </view>
            <view
                v-if="type === 'search'"
                v-show="searchEmpty"
                class="empty"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/empty_green.png"
                />
                <view>搜索不到您要的结果，换个关键词试试吧～</view>
            </view>
            <view
                v-show="myWorkEmpty"
                class="work-empty"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/work_empty_green.png"
                />
                <view>
                    {{ allTotal === 0 ? "您还没有上传作品" : "暂无作品" }}
                </view>
                <navigator
                    v-if="allTotal === 0"
                    url="/pages/read/upload/modify"
                >
                    <view class="goUpload">
                        去上传
                    </view>
                </navigator>
            </view>
            <goHome home-path="/pages/read/index" />
        </view>
    </view>
</template>

<script>
// work.vue
import api from '../../../common/api';
import share from '../../../common/share';
import goHome from '../common/goHome.vue';
import login from '../../../widgets/login/login.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';

export default {
    components: {
        goHome,
        uniLoadMore,
        EventCraftCover,
        login,
    },
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 335;
            const height = 225;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    data() {
        return {
            isLoading: true,
            userInfo: null,
            dataList: [],
            activeMenuIndex: '1',
            changeValue: '',
            loadMoreStatus: 'none',
            mediaIcon: {
                1: '../../../static/images/chunjie/video-icon.png',
                2: '../../../static/images/chunjie/img-icon.png',
            },
            tabActiveIndex: 2,
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 6,
                activity_cat: 1,
                status: 2,
            },
            total: 1,
            type: 'myWork',
            allNum: {},
            allTotal: 0,
            shareDesc: '',
        };
    },
    computed: {
        searchEmpty() {
            return this.total === 0 && this.type === 'search';
        },
        myWorkEmpty() {
            return this.total === 0 && this.type === 'myWork';
        },
    },
    created() {
        this.initShare();
    },
    methods: {
        onLogin() {
            this.getData();
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
        toggle(k) {
            uni.showLoading();
            this.activeMenuIndex = k;
            this.filter.activity_cat = k;
            this.filter.page_num = 1;
            this.searchWorkData();
        },
        handleClick() {
            if (!this.changeValue) {
                uni.showToast({
                    title: '请输入搜索内容',
                    icon: 'none',
                });
                return;
            }
            this.filter.search = this.changeValue.trim();
            this.filter.page_num = 1;
            this.searchWorkData();
        },
        bindconfirm() {
            const value = this.changeValue.trim();
            if (!value) {
                uni.showToast({
                    title: '请输入搜索内容',
                    icon: 'none',
                });
                return;
            }
            this.filter.search = value.trim();
            this.filter.page_num = 1;
            this.searchWorkData();
        },
        getWorkData(title) {
            return api
                .post('/api/activity/userresource', {
                    ...this.filter,
                    status: this.tabActiveIndex,
                })
                .then(
                    ({ list, total, all_num: allNum }) => {
                        if (title === 'reachBottom') {
                            this.dataList = this.dataList.concat(list);
                        } else {
                            this.dataList = list;
                        }
                        this.total = total;
                        this.allNum = allNum;
                        this.allTotal = allNum.pass + allNum.wait + allNum.no_pass;
                        if (
                            this.total
                            <= this.filter.page_num * this.filter.page_size
                        ) {
                            this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                        } else {
                            this.loadMoreStatus = 'more';
                        }
                    },
                    () => {},
                );
        },
        searchWorkData(title) {
            api.post('/api/activity/resourcelist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
                    }

                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        // this.loadMoreStatus = 'noMore';
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                    uni.hideLoading();
                },
            );
        },
        onReachBottom() {
            console.log('到底部');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                if (this.type === 'myWork') {
                    this.getWorkData('reachBottom');
                } else {
                    this.searchWorkData('reachBottom');
                }
            }
        },
        setTabActive(i) {
            this.tabActiveIndex = i;
            this.getWorkData();
        },
        viewDetail(item) {
            if (this.tabActiveIndex === 2) {
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${item.id}&activity_id=6`,
                });
            }
        },
        reason({ reason }) {
            uni.showModal({
                title: '驳回原因',
                content: reason || '暂无内容',
                showCancel: false,
            });
        },
        modifyItem({ id, activity_status: activityStatus }) {
            // activityStatus 1未开始 2进行中  3已过期
            if (activityStatus === 3) {
                return uni.showToast({
                    title: '活动已结束！',
                    icon: 'none',
                });
            }
            return uni.navigateTo({
                url: `/pages/read/upload/modify?id=${id}`,
            });
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
                        this.deleteItem(item);
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                },
            });
        },
        deleteItem(item) {
            const index = this.dataList.indexOf(item);
            api.post('/api/activity/del', {
                id: item.id,
            }).then(() => {
                uni.showToast({
                    title: '删除成功',
                });
                if (index !== -1) {
                    this.dataList.splice(index, 1);
                }
                if (this.tabActiveIndex === 1) {
                    // 待审核
                    this.allNum.wait -= 1;
                } else if (this.tabActiveIndex === 2) {
                    // 已通过
                    this.allNum.pass -= 1;
                } else {
                    // 未通过
                    this.allNum.no_pass -= 1;
                }
            });
        },
        initShare() {
            const title = this.isH5
                ? '我是朗读者，读给你听'
                : '4.23世界读书日，读书赢好礼，一起来读书吧！';
            const desc = this.isH5
                ? '4.23世界读书日，读书赢好礼，一起来读书吧！'
                : '';
            this.shareDesc = title;

            share({
                title,
                desc,
                thumbnail:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_share.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            });
        },
    },
    onLoad(query) {
        this.getData();
        const { type, name, status } = query;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
        }
        if (type === 'myWork') {
            this.getWorkData();
        } else if (type === 'search') {
            uni.setNavigationBarTitle({ title: '世界读书日' });
            this.filter.search = name;
            this.changeValue = name;
            this.searchWorkData();
        }
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            imageUrl:
                'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_share.png',
            path: '/pages/read/index',
        };
    },
};
</script>

<style lang="less">
.empty {
    text-align: center;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 174upx;
    }
    view {
        color: #0f8c64;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.work-empty {
    text-align: center;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 174upx;
    }
    .goUpload {
        margin-top: 37upx;
        width: 450upx;
        height: 110upx;
        background: #0f8c64;
        border-radius: 55px;
        font-size: 36upx;
        font-weight: 600;
        color: #fff;
        line-height: 110upx;
        text-align: center;
        display: inline-block;
    }
    view {
        color: #0f8c64;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.media-list {
    overflow-y: auto;
}
.media-content {
    width: 690upx;
    padding: 21upx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    background: #0f8c64;
    color: #fff;
    margin-bottom: 20upx;
    border-radius: 20upx;
    .work {
        width: 335upx;
        height: 225upx;
        border-radius: 20upx;
    }
    .media-icon {
        width: 40upx;
        height: 40upx;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20upx;
        text-align: center;
        line-height: 39upx;
        // #ifdef H5
        line-height: 42upx;
        // #endif
        position: absolute;
        top: 175upx;
        left: 290upx;
        image {
            width: 22upx;
            height: 22upx;
        }
    }
    .work-info {
        width: 300upx;
        position: relative;
        .media-name {
            width: 100%;
            font-size: 28upx;
            line-height: 32upx;
            margin-bottom: 15upx;
            &.text-two-line {
                height: 63upx;
            }
        }
        .media-time {
            color: #fff;
            font-size: 24upx;
            opacity: 0.7;
            margin-bottom: 66upx;
        }
        .vote-num {
            font-size: 30upx;
            left: 0;
            position: absolute;
            bottom: 14upx;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
        .btn-item {
            flex: 1;
            margin: 0 5upx;
            height: 50upx;
            background: rgba(25, 181, 131, 1);
            border-radius: 25upx;
            font-size: 24upx;
            color: rgba(255, 255, 255, 1);
            line-height: 50upx;
            text-align: center;
            display: inline-block;
            min-width: 80upx;
            &.big {
                flex: none;
                width: 127upx;
            }
        }
    }
}

.page-read-work {
    padding-top: 30upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background: #a1debe;
    &.login {
        background-color: #fff;
    }
    // background-size: contain;
    .search-box {
        overflow: hidden;
        margin-bottom: 30rpx;
        margin: 0 0rpx 20rpx;
        top: 0upx;
        height: 84rpx;
        left: 0;
        right: 0;
        position: fixed;
        z-index: 10;
        background-color: #a1debe;
        padding: 20upx 30upx;
        button {
            width: 144upx;
            height: 68upx;
            float: left;
            line-height: 68upx;
            color: #0f8c64;
            background: transparent;
            font-size: 30upx;
            font-weight: 700;
            border-radius: 34upx;
            padding: 0;
            &.active {
                background: #0f8c64;
                color: #fff;
            }
            &::after {
                border: none;
            }
        }
        .search {
            background: #0f8c64;
            width: 400upx;
            height: 72upx;
            position: relative;
            float: right;
            border-radius: 60upx;

            image {
                width: 28upx;
                height: 28upx;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 12upx;
            }
            input {
                width: 293upx;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 50upx;
                font-size: 22upx;
                color: #e5fff7;
            }
            .search-button {
                font-size: 24upx;
                color: #fff;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 22upx;
            }
        }
    }
    .panel {
        padding: 96upx 30upx 0;
    }
    .panel .panel-hd {
        border-bottom: none;
        margin: 0 0 20rpx;
        display: flex;
        justify-content: space-around;
        top: 0upx;
        height: 84rpx;
        left: 0;
        right: 0;
        position: fixed;
        z-index: 10;
        background-color: #a1debe;
        padding: 20upx 0;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        color: #0f8c64;
        padding: 0 25upx;
        height: 68upx;
        line-height: 68upx;
        font-size: 30upx;

        &.active {
            background: #0f8c64;
            border-radius: 34px;
            color: #fff;
        }
        &.active::after {
            display: none;
        }
    }

    .work-list {
        .work-item {
            // border-bottom: 1upx solid #ddd;
            padding: 20upx 0 20upx;

            position: relative;
            background: #fff6e1;
            margin-bottom: 20rpx;
        }

        .btns {
            position: absolute;
            right: 0;
            bottom: 10upx;

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

            .btn-share {
                border-radius: 0;
            }
        }
    }

    .blank-wrap {
        margin-top: 180upx;
    }
}
</style>
