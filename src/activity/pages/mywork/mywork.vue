<template>
    <view
        v-if="!isLoading"
        :class="[`${publicConfig.activityName}-page`]"
    >
        <view
            class="page-read-work"
            :class="{ login: userInfo === null && type === 'myWork' }"
        >
            <login
                v-if="type === 'myWork' && userInfo === null"
                @login="onLogin"
            />
            <!-- main -context-- -->
            <view
                v-else
                :class="[
                    'panel',
                    filter.activity_id === 'tiktok' && type === 'search'
                        ? 'tiktok'
                        : ''
                ]"
            >
                <!--pannel-->
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
                <!--search-box-->
                <view
                    v-else
                    :class="[
                        'search-box',
                        filter.activity_id === 'tiktok' ? 'tiktok' : ''
                    ]"
                >
                    <button
                        v-for="(item, index) in publicConfig.catMenu"
                        :key="index"
                        :class="{
                            active: filter.activity_cat === index + 1
                        }"
                        @click="toggle(index + 1)"
                    >
                        {{ item }}
                    </button>
                    <button
                        v-for="(item, index) in publicConfig.sort"
                        :key="index"
                        :class="{
                            active:
                                filter.sort === (index === 0 ? 'new' : 'hot')
                        }"
                        @click="toggle(index === 0 ? 'new' : 'hot')"
                    >
                        {{ item }}
                    </button>
                    <view class="search">
                        <image
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_search.png`
                            "
                        />
                        <form action="javascript:return true">
                            <input
                                v-model="changeValue"
                                type="text"
                                confirm-type="search"
                                confirm-hold="true"
                                :maxlength="13"
                                :placeholder-style="
                                    `color:${publicConfig.placeholderColor}`
                                "
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
                    <view
                        v-if="filter.activity_id === 'tiktok'"
                        class="tiktok-btn"
                    >
                        <button
                            v-for="item in tiktokCats"
                            :key="item.cat_id"
                            :class="{
                                active: catId === item.cat_id
                            }"
                            @click="tiktokToggle(item.cat_id)"
                        >
                            {{ item.name }}
                        </button>
                    </view>
                </view>
                <!--列表-->
                <view
                    v-if="total > 0"
                    class="media-list"
                >
                    <view
                        v-for="(item, index) in dataList"
                        :key="item.id"
                        class="media-content"
                        @click="viewDetail(item, index)"
                    >
                        <event-craft-cover
                            :info="item"
                            :media-icon="type !== 'myWork'"
                            :like-icon="type === 'myWork'"
                            :best-icon="false"
                            :bg-color="publicConfig.primaryBgColor"
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
                                    v-if="Number(tabActiveIndex) === 3"
                                    class="btn-item big"
                                    @click.stop="reason(item)"
                                >
                                    驳回原因
                                </text>
                                <text
                                    v-if="Number(tabActiveIndex) === 3"
                                    class="btn-item"
                                    @click.stop="onConfirmDelete(item)"
                                >
                                    删除
                                </text>
                            </view>
                        </view>
                        <view
                            v-else
                            class="work-info"
                        >
                            <view class="text-two-line resource-name">
                                {{ item.resource_name }}
                            </view>
                            <template v-if="filter.activity_id === 'tiktok'">
                                <!-- 教育抖音 -->
                                <view class="media-name text-one-line">
                                    <template v-if="!item.is_team_resource">
                                        {{ item.create_name }}
                                    </template>
                                </view>
                                <view
                                    v-if="type === 'myWork'"
                                    class="media-time"
                                >
                                    {{ item.created_at }}
                                </view>
                                <view class="create-school text-one-line">
                                    {{ item.create_user_class }}
                                </view>
                            </template>
                            <template v-else>
                                <!-- 活动 -->
                                <view class="media-name text-one-line">
                                    {{ item.user_name }}
                                </view>
                                <view class="media-time">
                                    {{ item.created_at }}
                                </view>
                            </template>
                            <view class="vote-num">
                                {{ item.ticket || item.praise_count || 0 }}赞
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
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_empty_search.png`
                        "
                    />
                    <view>
                        搜索不到您要的结果，换个关键词试试吧～
                    </view>
                </view>
                <view
                    v-show="myWorkEmpty && filter.activity_id !== 'tiktok'"
                    class="work-empty"
                >
                    <image
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_empty_work.png`
                        "
                    />
                    <view>
                        {{ allTotal === 0 ? "您还没有上传作品" : "暂无作品" }}
                    </view>
                    <navigator
                        v-if="allTotal === 0"
                        :url="
                            `/activity/pages/upload/modify?activity_id=${filter.activity_id}`
                        "
                    >
                        <view class="goUpload">
                            去上传
                        </view>
                    </navigator>
                </view>
                <goHome :path="publicConfig.homePath" />
            </view>
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
            // #ifdef H5
            isH5: true,
            // #endif
            isLoading: true,
            userInfo: null,
            publicConfig: {},
            myWorkConfig: {},
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
            type: 'myWork',
            allNum: {},
            allTotal: 0,
            shareDesc: '',
            title: '',
            userId: '',
            catId: '',
            tiktokCats: [
                {
                    cat_id: '',
                    name: '全部',
                },
                {
                    cat_id: 133,
                    name: '教育抖音微视频',
                },
                {
                    cat_id: 134,
                    name: '校园宣传短视频',
                },
                {
                    cat_id: 135,
                    name: '校园微电影',
                },
            ],
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
    methods: {
        onLogin() {
            this.getData().then(
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
        getData() {
            return api.get('/api/user/info');
        },
        toggle(k) {
            uni.showLoading();
            if (this.publicConfig.catMenu.length) {
                this.filter.activity_cat = Number(k);
            }
            if (this.publicConfig.sort.length) {
                this.filter.sort = k;
            }
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.filter.page_num = 1;
            this.searchWorkData();
        },
        tiktokToggle(k) {
            this.catId = k;
            this.filter.cat_id = k;
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
            this.filter.activity_cat = 0;
            const url = this.isTiktok
                ? '/api/user/worklist'
                : '/api/activity/userresource';
            const tiktokParams = {
                page_size: this.filter.page_size,
                page_num: this.filter.page_num,
                status: this.filter.status,
                parent_scope: 3,
            };
            return api
                .post(
                    url,
                    this.isTiktok
                        ? tiktokParams
                        : {
                            ...this.filter,
                            status: this.tabActiveIndex,
                        },
                )
                .then(
                    ({ list, total, all_num: allNum }) => {
                        if (title === 'reachBottom') {
                            this.dataList = this.dataList.concat(list);
                        } else {
                            this.dataList = list;
                        }
                        this.total = total;
                        if (this.isTiktok) {
                            api.post('/api/user/workstatics', {
                                parent_scope: 3,
                                is_douyin: 1,
                            }).then((res) => {
                                this.allNum = {
                                    wait: res.no_verify_num,
                                    pass: res.pass_num,
                                    no_pass: res.refuse_num,
                                };
                                this.allTotal = this.allNum.pass
                                    + this.allNum.wait
                                    + this.allNum.no_pass;
                            });
                        } else {
                            this.allNum = allNum;
                            this.allTotal = allNum.pass + allNum.wait + allNum.no_pass;
                        }
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
            const url = this.isTiktok
                ? '/api/works/douyinlist'
                : '/api/activity/resourcelist';
            const tiktokParams = {
                page_size: this.filter.page_size,
                page_num: this.filter.page_num,
                keyword: this.filter.search,
                cat_id: this.catId,
            };
            api.post(url, this.isTiktok ? tiktokParams : this.filter).then(
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
            this.filter.page_num = 1;
            this.tabActiveIndex = i;
            this.filter.status = i - 1;
            console.log(111);
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
        },
        viewDetail(item, index) {
            if (this.tabActiveIndex === 2) {
                let from = '/api/activity/resourcelist';
                if (this.type === 'myWork') {
                    from = '/api/activity/userresource';
                }
                if (this.isTiktok) {
                    this.filter.parent_scope = 3;
                    this.filter.sort = 'hot';
                    if (this.type === 'myWork') {
                        from = '/api/user/worklist';
                    } else {
                        from = '/api/works/list';
                    }
                }
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
        reason(item) {
            uni.showModal({
                title: '驳回原因',
                content: item.reason || item.memo || '暂无内容',
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
            const url = this.isTiktok
                ? '/api/user/delwork'
                : '/api/activity/del';
            api.post(url, {
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
            console.log(this.publicConfig);
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;

            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            console.log(this.publicConfig.shareConfig.title, this.title);
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
    onLoad(params) {
        const {
            type, name, status, user_id: userId,
        } = params;
        const activityId = Number.isNaN(Number(params.activity_id))
            ? params.activity_id
            : Number(params.activity_id);
        this.isTiktok = activityId === 'tiktok';

        this.userId = userId;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
            if (this.isTiktok) {
                this.filter.status = status - 1;
            }
        } else if (this.isTiktok) {
            // 0—待审核  1—已通过   2—未通过
            this.filter.status = 1;
        }

        this.publicConfig = this.$store.getters.getPublicConfig(activityId);
        this.myWorkConfig = this.$store.getters.getActivityConfig({
            activityId,
            page: 'myWorkConfig',
        });
        this.filter.activity_id = activityId;

        this.getData().then(
            (res) => {
                this.userInfo = res.user_info;
                this.isLoading = false;
                if (type === 'myWork' && activityId === 10) {
                    this.userId = this.userInfo.user_id;
                }
            },
            () => {
                this.isLoading = false;
                this.userInfo = null;
            },
        );
        if (type === 'myWork') {
            if (userId) {
                this.filter.user_id = String(userId);
            }
            this.getWorkData();
        } else if (type === 'search') {
            uni.setNavigationBarTitle({ title: this.publicConfig.title });
            this.filter.search = name;
            if (userId) {
                this.filter.user_id = userId;
                this.filter.week = 1;
            }
            this.changeValue = name;
            this.searchWorkData();
        }
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
    margin-bottom: 40upx;
    position: relative;
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
            margin-right: 40upx;
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
            height: 186upx;
            overflow-y: auto;
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
                word-break: break-all;
            }
        }
        .media-time,
        .create-school {
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
            justify-content: flex-end;
        }
        .btn-item {
            height: 50upx;
            background: rgba(25, 181, 131, 1);
            border-radius: 25upx;
            font-size: 24upx;
            color: rgba(255, 255, 255, 1);
            line-height: 50upx;
            text-align: center;
            display: inline-block;
            padding: 0 31upx;
            &.big {
                padding: 0 16upx;
                margin-right: 32upx;
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
        background-color: #fff !important;
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
        &.tiktok {
            height: 200upx;
            .tiktok-btn {
                width: 100%;
                padding-top: 32upx;
                display: flex;
                justify-content: space-between;
                button {
                    // flex: 1;
                    width: auto;
                    color: #fff;
                    border: 0 none;
                    font-size: 26upx;
                    min-width: 98upx;
                    padding: 0 10upx;
                    box-sizing: content-box;
                    &.active {
                        background: #f73944;
                    }
                }
            }
        }
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
                width: 276upx;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 50upx;
                font-size: 22upx;
                color: #fff;
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
        &.no-padding {
            padding-top: 10upx;
        }
        &.tiktok {
            padding-top: 200upx;
        }
    }
    .panel .panel-hd {
        border-bottom: none;
        margin: 0 0 20rpx;
        display: flex;
        justify-content: space-around;
        align-items: center;
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
@import "../theme/myWork.less";
</style>
