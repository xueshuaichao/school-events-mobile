<template>
    <view v-if="!isLoading">
        <view
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
                :class="['panel', isSelf ? 'is-self' : '']"
            >
                <!-- 我的海报 -->
                <savePoster
                    v-if="showPosterMask"
                    :image="posterImage"
                    @togglePoster="togglePoster"
                />
                <view
                    v-if="Object.keys(detail).length"
                    class="user-detail"
                >
                    <view
                        v-if="isSelf"
                        class="poster-btn"
                        @clikc="togglePoster(true)"
                    >
                        我的海报
                    </view>
                    <view class="user-image-info">
                        <view class="user-image">
                            <image :src="detail.image" />
                        </view>
                        <view class="user-info">
                            <view class="name">
                                {{ detail.name }}
                            </view>
                            <view class="school">
                                {{ detail.school_name }}
                            </view>
                            <view class="teacher">
                                推荐老师：{{ detail.teacher }}
                            </view>
                            <view class="slogan">
                                我的代言：{{ detail.slogan }}
                            </view>
                        </view>
                    </view>
                    <view class="user-desc">
                        <view>自我介绍：</view>
                        <view class="user-desc-text">
                            {{ detail.desc }}
                        </view>
                    </view>
                    <view
                        v-if="!isSelf"
                        class="user-tips"
                    >
                        记得为我点赞哦~
                    </view>
                </view>
                <view
                    v-if="isSelf"
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
                    v-if="total > 0"
                    :class="['media-list', isSelf ? '' : 'media-box']"
                >
                    <view
                        v-for="(item, index) in dataList"
                        :key="item.id"
                        :class="['media-content', isSelf ? 'self' : '']"
                    >
                        <event-craft-cover
                            :info="item"
                            :media-icon="true"
                            :like-icon="false"
                            :best-icon="false"
                            :bg-color="publicConfig.primaryBgColor"
                            @click.native="viewDetail(item, index)"
                        />
                        <view
                            v-if="isSelf === true"
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
                                    @click="viewDetail(item, index)"
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
                                    v-if="Number(tabActiveIndex) === 3"
                                    class="btn-item"
                                    @click="modifyItem(item)"
                                >
                                    编辑
                                </text>
                                <text
                                    v-if="Number(tabActiveIndex) > 1"
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
                            <view class="media-name text-one-line">
                                {{ `${item.resource_name}` }}
                            </view>
                            <text class="vote-num">
                                {{ item.ticket }}赞
                            </text>
                            <view
                                class="vote"
                                @click="handleVote(item)"
                            >
                                <image
                                    class="like-icon"
                                    :src="
                                        `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_like_icon.png`
                                    "
                                />
                                点赞
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
                    v-show="myWorkEmpty"
                    class="work-empty"
                >
                    <image
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_empty_work.png`
                        "
                    />
                    <view v-if="isSelf">
                        <view v-if="allTotal === 0">
                            <view>
                                您还没有上传作品<br>上传作品才能赢取代言人权益哦～
                            </view>
                        </view>
                        <view v-else>
                            暂无作品
                        </view>
                    </view>
                    <view v-else>
                        TA还没有上传作品，去看看其他作品吧~
                    </view>
                </view>
                <navigator
                    v-if="isSelf"
                    :url="
                        `/activity/pages/upload/modify?activity_id=${filter.activity_id}`
                    "
                >
                    <view class="goUpload">
                        上传作品
                    </view>
                </navigator>
            </view>
            <goHome :path="publicConfig.homePath" />
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
import savePoster from '../brand/savePoster.vue';

export default {
    components: {
        goHome,
        uniLoadMore,
        EventCraftCover,
        login,
        savePoster,
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
            publicConfig: {},
            dataList: [],
            changeValue: '',
            loadMoreStatus: 'none',
            tabActiveIndex: 2,
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: '',
                activity_cat: 1,
                sort: 'new',
                status: 2,
            },
            total: 1,
            allNum: {},
            allTotal: 0,
            shareDesc: '',
            title: '',
            userId: '',
            isSelf: false,
            detail: {},
            showPosterMask: false,
            posterImage: '',
        };
    },
    computed: {
        myWorkEmpty() {
            return this.total === 0;
        },
    },
    methods: {
        onLogin() {
            this.getData();
        },
        togglePoster(status) {
            this.showPosterMask = status;
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                    this.getWorkData();
                },
                () => {
                    this.isLoading = false;
                    this.userInfo = null;
                },
            );
        },

        getWorkData(title) {
            this.filter.activity_cat = 0;
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
        getEnrollInfo() {
            return api.get('/api/activity/getenrollinfo', {
                activity_id: this.filter.activity_id,
                user_id: this.userId,
            });
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
        setTabActive(i) {
            this.filter.page_num = 1;
            this.tabActiveIndex = i;
            console.log(111);
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
        },
        viewDetail(item, index) {
            if (this.tabActiveIndex === 2) {
                const from = '/api/activity/userresource';
                this.$store.commit('setFilterData', {
                    filter: this.filter,
                    position: {
                        total: this.total,
                        curposition: index,
                        from,
                    },
                });
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${item.id}&activity_id=${this.filter.activity_id}`,
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
                url: `/activity/pages/upload/modify?id=${id}&activity_id=${this.filter.activity_id}`,
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
                if (index !== -1) {
                    this.dataList.splice(index, 1);
                    this.total -= 1;
                    if (
                        this.dataList.length <= this.filter.page_size
                        && this.total >= this.filter.page_size
                    ) {
                        if (this.total > this.filter.page_size) {
                            this.loadMoreStatus = 'noMore';
                        }
                        this.filter.page_num = 1;
                        this.getWorkData();
                    }
                }
                uni.showToast({
                    title: '删除成功',
                });
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
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;

            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[random];

            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
                url: `${
                    this.isH5
                        ? `${window.location.origin}${this.publicConfig.shareConfig.path}`
                        : ''
                }`,
            });
        },
    },
    onLoad(query) {
        const {
            type,
            status,
            activity_id: activityId,
            user_id: userId,
        } = query;
        this.userId = userId;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
        }
        this.publicConfig = this.$store.getters.getPublicConfig(activityId);
        this.filter.activity_id = activityId;
        this.filter.user_id = userId;
        this.getEnrollInfo().then((data) => {
            if (!Array.isArray(data)) {
                this.detail = data.detail;
                this.isSelf = data.is_self;
                this.posterImage = data.poster;
            }
            this.getData();
        });
        this.initShare();
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.homePath,
        };
    },
};
</script>

<style lang="less">
.user-detail {
    box-shadow: inset 0 0 24upx 0 rgba(152, 130, 255, 1);
    background-color: #fff;
    padding: 20upx;
    border-radius: 20upx;
    position: relative;
    margin-bottom: 40upx;
    .poster-btn {
        position: absolute;
        right: -11upx;
        top: 20upx;
        background-color: #ff574a;
        border-radius: 24upx 0 0 24upx;
        padding: 0upx 23upx;
        height: 48upx;
        line-height: 48upx;
        color: #fff;
        font-size: 22upx;
        &::after {
            content: "";
            position: absolute;
            bottom: -9upx;
            right: 6upx;
            width: 0;
            height: 0;
            border-top: 6upx solid transparent;
            border-bottom: 6upx solid transparent;
            border-right: 6upx solid #c40d00;
            transform: rotate(44deg);
        }
    }
    .user-image-info {
        display: flex;
        .user-image {
            width: 220upx;
            height: 292upx;
            image {
                width: 100%;
                height: 100%;
                border-radius: 10upx;
                display: inline-block;
            }
            margin-right: 40upx;
            border-radius: 10upx;
        }
        .user-info {
            color: #333;
            line-height: 28upx;
            .name {
                font-size: 30upx;
                font-weight: 500;
                margin-bottom: 19upx;
                padding-top: 8upx;
            }
            .school {
                margin-bottom: 40upx;
            }
            .teacher {
                margin-bottom: 38upx;
                font-size: 28upx;
            }
            .slogan {
                color: #583ed4;
                font-weight: 500;
                font-size: 26upx;
                line-height: 40upx;
                word-break: break-all;
            }
        }
    }
    .user-desc {
        padding: 20upx;
        color: #333;
        background-color: #ddd6ff;
        border-radius: 10upx;
        word-break: break-all;
        .user-desc-text {
            height: 96upx;
            overflow-y: auto;
            word-break: break-all;
        }
    }
    .user-tips {
        padding-top: 20upx;
        color: #9882ff;
        font-size: 26upx;
        text-align: center;
    }
}
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
        margin-top: 80upx;
    }

    view {
        color: #fff;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.goUpload {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 116upx;
    background: #ff685c;
    font-size: 36upx;
    font-weight: 600;
    color: #fff;
    line-height: 116upx;
    text-align: center;
    display: inline-block;
}
.media-list {
    overflow-y: auto;
}
.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
}
.media-content {
    width: 335upx;
    padding: 0;
    justify-items: space-betwen;
    position: relative;
    margin-bottom: 50upx;
    &.self {
        width: 690upx;
        padding: 21upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        color: #fff;
        margin-bottom: 20upx;
        border-radius: 20upx;
        background-color: #fff;
        box-shadow: inset 0px 0px 24upx 0px rgba(152, 130, 255, 1);
        .work-info {
            color: #333;
            width: 300upx;
            .media-time {
                color: #666;
            }
        }
    }
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
    /deep/ .event-craft-cover {
        .tag {
            background: #ffe79c;
            color: #bb77ff;
        }
    }

    .work-info {
        position: relative;
        color: #fff;
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
        .like-icon {
            width: 27upx;
            height: 27upx;
            position: absolute;
            top: 50%;
            left: 20upx;
            transform: translateY(-50%);

            text {
                color: #fff;
            }
        }
        .vote {
            float: right;
            width: 130upx;
            height: 60upx;
            background-color: #ff685c;
            border-radius: 30upx;
            color: rgba(255, 255, 255, 1);
            font-size: 28upx;
            line-height: 60upx;
            position: relative;
            padding-left: 52upx;
            box-sizing: border-box;
        }
        .vote-num {
            font-size: 30upx;
            color: #fff;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
        .btn-item {
            flex: 1;
            margin: 0 5upx;
            height: 50upx;
            background-color: #ff685c;
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
    padding: 30upx 0 116upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background-color: #583ed4;
    &.login {
        background-color: #fff !important;
    }
    .panel {
        padding: 0upx 30upx 0;
        &.no-padding {
            padding-top: 10upx;
        }
    }
    .panel .panel-hd {
        margin: 0;
        border-bottom: none;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 68upx;
        background-color: #583ed4;
        padding: 0upx 0 30upx;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding: 0 25upx;
        height: 68upx;
        line-height: 68upx;
        font-size: 30upx;
        color: #fff;
        &.active {
            background-color: #ff685c;
            color: #fff;
            border-radius: 34px;
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
    .goHome {
        color: #583ed4;
        &::before {
            border-top: 1rpx solid #583ed4 !important;
            border-right: 1rpx solid #583ed4 !important;
        }
        bottom: 130upx;
    }
}
</style>
