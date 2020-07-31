<template>
    <view class="page-my-work">
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view class="panel">
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
            <view v-else>
                <view class="search-box">
                    <view class="search">
                        <image
                            src="/history/static/images/chunjie/search-icon.png"
                        />
                        <form action="javascript:return true">
                            <input
                                v-model="changeValue"
                                type="text"
                                confirm-type="search"
                                confirm-hold="true"
                                placeholder-style="color:#C9AC67"
                                placeholder="请输入作者姓名或作品名称"
                                @confirm="bindconfirm"
                            >
                        </form>
                        <button
                            class="search-button"
                            @click="bindconfirm"
                        >
                            搜索
                        </button>
                    </view>

                    <button
                        :class="{
                            active: activeMenuIndex === 'hot'
                        }"
                        @click="toggle('hot')"
                    >
                        最热
                    </button>
                    <button
                        :class="{
                            active: activeMenuIndex === 'new'
                        }"
                        @click="toggle('new')"
                    >
                        最新
                    </button>
                </view>
            </view>
            <view v-if="total > 0">
                <view
                    v-for="(item, index) in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <event-craft-cover
                        :info="item"
                        :bg-color="'f5dca3'"
                        @click.native="viewDetail(item, index)"
                    />
                    <view
                        v-if="type === 'myWork'"
                        class="work-info"
                    >
                        <view class="media-name text-one-line">
                            {{ `#${item.cat_name}# ${item.resource_name}` }}
                        </view>
                        <view class="media-time">
                            {{ item.created_at }}
                        </view>
                        <!-- 未通过的显示未通过审核的原因 -->
                        <text
                            v-if="tabActiveIndex !== 3"
                            class="vote-num"
                        >
                            {{ item.ticket }}票
                        </text>
                        <view
                            v-if="tabActiveIndex === 3"
                            class="reject-reason text-three-line"
                        >
                            {{ item.reason }}
                        </view>
                    </view>
                    <view
                        v-else
                        class="work-info"
                    >
                        <view class="media-name">
                            {{ `#${item.cat_name}# ${item.user_name}` }}
                        </view>
                        <view>
                            {{ item.resource_name }}
                        </view>
                        <view class="media-time">
                            作品介绍
                        </view>
                        <text class="vote-num">
                            {{ item.ticket }}票
                        </text>
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
                <image src="/history/static/images/chunjie/empty.png" />
                <view>搜索不到您要的结果，换个关键词试试吧～</view>
            </view>
            <view
                v-show="myWorkEmpty"
                class="work-empty"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjie/work-empty.png"
                />
                <view>
                    {{ allTotal === 0 ? "您还没有上传作品" : "暂无作品" }}
                </view>
                <navigator
                    v-if="allTotal === 0"
                    url="/history/chunjie/upload/upload"
                >
                    <view class="goUpload">
                        去上传
                    </view>
                </navigator>
            </view>
            <button
                class="btn goHome"
                @click="goHome"
            >
                返回首页
            </button>
        </view>
    </view>
</template>

<script>
// work.vue
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';

export default {
    components: {
        uniLoadMore,
        EventCraftCover,
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
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    data() {
        return {
            dataList: [],
            activeMenuIndex: 'hot',
            changeValue: '',
            loadMoreStatus: 'none',
            mediaIcon: {
                1: '/history/static/images/chunjie/video-icon.png',
                2: '/history/static/images/chunjie/img-icon.png',
            },
            tabActiveIndex: 2,
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 3,
            },
            total: 1,
            type: 'myWork',
            allNum: {},
            allTotal: 0,
            fr: '',
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
        goHome() {
            uni.reLaunch({
                url: '/history/chunjie/index',
            });
        },
        toggle(k) {
            this.activeMenuIndex = k;
            this.filter.sort = k;
            this.filter.page_num = 1;
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
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
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
        },
        viewDetail({ id }, index) {
            if (this.tabActiveIndex === 2) {
                let from = '/api/activity/resourcelist';
                if (this.type === 'myWork') {
                    from = '/api/activity/userresource';
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
                    url: `/pages/work/detail/detail?id=${id}&activity_id=3`,
                });
            }
        },
    },
    onLoad(query) {
        const { type, name } = query;
        console.log(type, 'tye');
        this.type = type;

        if (type === 'myWork') {
            this.getWorkData();
        } else if (type === 'search') {
            uni.setNavigationBarTitle({ title: '秀才艺，赢好礼' });
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
        const titleList = ['我来给你拜新年，表演才艺送祝福'];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner.png',
            path: '/history/chunjie/index',
        };
    },
};
</script>

<style lang="less">
.goHome {
    position: fixed;
    bottom: 18upx;
    right: 30upx;
    color: #fff0cc;
    font-size: 12px;
    width: 67px;
    height: 28px;
    background: -webkit-linear-gradient(bottom, #ff1610, #ffbd67);
    background: linear-gradient(0deg, #ff1610, #ffbd67);
    -webkit-border-image: -webkit-linear-gradient(147deg, #ffe7ae, #ffe19a) 2 2;
    border-image: linear-gradient(-57deg, #ffe7ae, #ffe19a) 2 2;
    border-radius: 14px;
    border: 1px solid;
    line-height: 28px;
    text-align: center;
    margin-bottom: 15px;
    padding: 0;
}

.empty {
    text-align: center;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 174upx;
    }
    view {
        color: #ffedc3;
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
        width: 420upx;
        height: 110upx;
        background: linear-gradient(
            0deg,
            rgba(255, 22, 16, 1),
            rgba(255, 189, 103, 1)
        );
        border: 2rpx solid #ffe19a;
        // border-image:linear-gradient(-57deg, rgba(255,231,174,1), rgba(255,225,154,1)) 2 2;
        box-shadow: 0upx 16upx 30upx 0upx rgba(203, 20, 34, 0.36);
        border-radius: 55px;
        font-size: 36upx;
        font-weight: 600;
        color: #ffe57b;
        line-height: 110upx;
        text-align: center;
        text-shadow: 0upx 4upx 6upx rgba(241, 0, 0, 0.65);
        display: inline-block;
    }
    view {
        color: #ffedc3;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.media-content {
    width: 690upx;
    padding: 21upx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    position: relative;
    background: #fff6e1;
    color: #ff3849;
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
        width: 290upx;
        position: relative;
        .media-name {
            width: 100%;
            font-size: 28upx;
            margin-bottom: 10upx;
        }
        .media-time {
            color: #c9ac67;
            font-size: 24upx;
        }
        .vote-num {
            font-size: 30upx;
            left: 0;
            position: absolute;
            bottom: 14upx;
        }
    }
}

.page-my-work {
    padding: 0 30upx;
    padding-top: 30upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background: url("http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/main_bg.png")
        repeat-y;
    background-size: contain;
    .search-box {
        overflow: hidden;
        button {
            width: 140upx;
            height: 94upx;
            float: left;
            line-height: 72upx;
            color: #ffffff;
            background: transparent;
            font-size: 30upx;
            font-weight: 700;
            margin-top: 40upx;
            &:nth-child(2) {
                margin-left: 200upx;
            }
            &.active {
                background: url("../../static/images/chunjie/neworhot.png")
                    no-repeat;
                background-size: 100% 100%;
                color: #ff3849;
            }
            &::after {
                border: none;
            }
        }
        .search {
            background: #ffedc3;
            width: 528upx;
            height: 80upx;
            line-height: 80upx;
            position: relative;
            border-radius: 76upx;
            float: left;
            flex: 1;

            image {
                width: 28upx;
                height: 28upx;
                position: absolute;
                top: 24upx;
                left: 29upx;
            }
            input {
                width: 425upx;
                position: absolute;
                top: 20upx;
                left: 69upx;
                font-size: 28upx;
                color: #ff3849;
            }
            .search-button {
                width: 142upx;
                height: 80upx;
                position: absolute;
                margin: 0;
                right: -160upx;
                font-size: 32upx;
                background: linear-gradient(
                    0deg,
                    rgba(255, 22, 16, 1),
                    rgba(255, 189, 103, 1)
                );
                border: 2upx solid #ffe19a;
                border-radius: 40upx;
                line-height: 80upx;
                text-align: center;
            }
        }
    }
    .panel .panel-hd {
        border-bottom: none;
        margin: 0 30rpx 20rpx;
        display: flex;
        justify-content: space-around;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding-left: 0;
        padding-right: 0;
        color: #ffe57b;

        &.active::after {
            background: #ffe57b;
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

    .reject-reason {
        color: #b69755;
        font-size: 24rpx;
        margin-top: 10rpx;
    }
}
</style>
