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
                    <button
                        :class="{
                            active: activeMenuIndex === '1'
                        }"
                        @click="toggle('1')"
                    >
                        青少年组
                    </button>
                    <button
                        :class="{
                            active: activeMenuIndex === '2'
                        }"
                        @click="toggle('2')"
                    >
                        成年组
                    </button>
                    <view class="search">
                        <image src="../../../static/images/yiqing/search.png" />
                        <form action="javascript:return true">
                            <input
                                v-model="changeValue"
                                type="text"
                                confirm-type="search"
                                confirm-hold="true"
                                placeholder-style="color:#6691FF"
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
            </view>
            <view v-if="total > 0">
                <view
                    v-for="(item, index) in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <event-craft-cover
                        :info="item"
                        :bg-color="'006EDE'"
                        @click.native="viewDetail(item, index)"
                    />
                    <view
                        v-if="type === 'myWork'"
                        class="work-info"
                    >
                        <view class="media-name text-one-line">
                            {{ ` ${item.resource_name}` }}
                        </view>
                        <view class="media-time">
                            {{ item.created_at }}
                        </view>
                        <!-- 未通过的显示未通过审核的原因 -->
                        <text
                            v-if="tabActiveIndex !== 3"
                            class="vote-num"
                        >
                            {{ item.ticket }}赞
                        </text>
                        <view
                            v-if="tabActiveIndex === 2"
                            class="getprize"
                            @click="getPrize(item)"
                        >
                            领取证书
                        </view>
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
                            {{ item.user_name }}
                        </view>
                        <view class="text-two-line">
                            {{ item.resource_name }}
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
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/empty.png"
                />
                <view>搜索不到您要的结果，换个关键词试试吧～</view>
            </view>
            <view
                v-show="myWorkEmpty"
                class="work-empty"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/work-empty.png"
                />
                <view>
                    {{ allTotal === 0 ? "您还没有上传作品" : "暂无作品" }}
                </view>
                <navigator
                    v-if="allTotal === 0"
                    url="/pages/yiqing/upload/upload"
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
                {{ text }}
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
            text: '< 返回首页',
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
                activity_id: 5,
                activity_cat: 1,
            },
            total: 1,
            type: 'myWork',
            allNum: {},
            allTotal: 0,
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
        getPrize(item) {
            // #ifdef H5
            // eslint-disable-next-line no-undef
            wx.showToast({
                title: '请到UP爱挑战小程序去领取奖状',
                icon: 'none',
            });
            // #endif
            // #ifndef H5
            uni.navigateTo({
                url: `/pages/yiqing/prize/index?id=${item.id}&activity_cat=${item.activity_cat}`,
            });
            // #endif
        },
        goHome() {
            uni.reLaunch({
                url: '/pages/yiqing/index',
            });
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
                    url: `/pages/work/detail/detail?id=${id}&activity_id=5`,
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
            uni.setNavigationBarTitle({ title: '抗击疫情“艺”起来' });
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
        const titleList = [
            '抗击疫情“艺”起来，参与活动为武汉加油！向英雄致敬！',
        ];
        const title = titleList[Math.floor(Math.random() * titleList.length)];
        return {
            title,
            imageUrl:
                'http: //aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png',
            path: '/pages/yiqing/index',
        };
    },
};
</script>

<style lang="less">
.goHome {
    position: fixed;
    bottom: 40upx;
    right: 0upx;
    color: #1154ff;
    font-size: 24upx;
    width: 166upx;
    height: 54upx;
    background: #fff;
    border-radius: 27upx 0 0 27upx;
    line-height: 54upx;
    text-align: center;
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
        width: 450upx;
        height: 110upx;
        background: rgba(0, 132, 255, 1);
        border-radius: 55px;
        font-size: 36upx;
        font-weight: 600;
        color: #fff;
        line-height: 110upx;
        text-align: center;
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
    background: #0096ff;
    color: #ffde6d;
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
            color: #fff;
            font-size: 24upx;
        }
        .vote-num {
            font-size: 30upx;
            left: 0;
            position: absolute;
            bottom: 14upx;
        }
        .getprize {
            width: 150upx;
            height: 56upx;
            background: #fff;
            border-radius: 28upx;
            color: #0096ff;
            position: absolute;
            bottom: 6upx;
            right: 20upx;
            font-size: 28upx;
            text-align: center;
            line-height: 56upx;
        }
    }
}

.page-my-work {
    padding: 0 30upx;
    padding-top: 30upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background: #1154ff;
    // background-size: contain;
    .search-box {
        overflow: hidden;
        margin-bottom: 30rpx;
        button {
            width: 144upx;
            height: 68upx;
            float: left;
            line-height: 68upx;
            color: #ffffff;
            background: transparent;
            font-size: 30upx;
            font-weight: 700;
            border-radius: 34upx;
            padding: 0;
            &.active {
                background: #0084ff;
                color: #fff;
            }
            &::after {
                border: none;
            }
        }
        .search {
            background: #003dd7;
            width: 395upx;
            height: 72upx;
            position: relative;
            float: right;
            border-radius: 60upx;

            image {
                width: 28upx;
                height: 28upx;
                position: absolute;
                top: 23upx;
                left: 17upx;
            }
            input {
                width: 270upx;
                position: absolute;
                top: 20upx;
                // #ifndef H5
                top: 15upx;
                // #endif
                left: 53upx;
                font-size: 22upx;
                color: #ffbec4;
            }
            .search-button {
                font-size: 24upx;
                color: #fff;
                position: absolute;
                top: 20upx;
                right: 14upx;
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
        color: #fff;
        font-size: 24rpx;
        margin-top: 10rpx;
    }
}
</style>
