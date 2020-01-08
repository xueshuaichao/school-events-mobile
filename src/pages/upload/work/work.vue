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
                    :class="{ active: tabActiveIndex === 3 }"
                    @click="setTabActive(3)"
                >
                    未通过({{ workStatics.refuse_num || 0 }})
                </text>
            </view>
            <view v-else>
                <!-- <button
                    class="abc"
                    @click="handleClick"
                >
                    搜索
                </button> -->
                <view class="search-box">
                    <view class="search">
                        <image
                            src="../../../static/images/chunjie/search-icon.png"
                        />

                        <input
                            v-model="changeValue"
                            type="text"
                            placeholder="请输入作者姓名或作品名称"
                            @confirm="bindconfirm"
                        >
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
                    v-for="item in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <navigator
                        :url="`/pages/work/festival/festival?id=${item.id}`"
                    >
                        <image
                            v-if="item.resource_type === 1"
                            :src="item.video_img_url"
                            class="work"
                        />
                        <image
                            v-else-if="item.resource_type === 2"
                            :src="item.img_url"
                            class="work"
                        />
                        <image
                            class="media-icon"
                            :src="mediaIcon[item.resource_type]"
                        />
                    </navigator>
                    <view
                        v-if="type === 'myWork'"
                        class="work-info"
                    >
                        <view class="media-name">
                            {{ `#${item.cat_name}# ${item.resource_name}` }}
                        </view>
                        <view class="media-time">
                            {{ item.created_at }}
                        </view>
                        <text class="vote-num">
                            {{ item.ticket }}票
                        </text>
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
                v-show="total === 0"
                class="empty"
            >
                <image src="../../../static/images/chunjie/empty.png" />
                <view>搜索不到您要的结果，换个关键词试试吧～</view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            dataList: [],
            activeMenuIndex: 'hot',
            changeValue: '',
            loadMoreStatus: 'none',
            mediaIcon: {
                1: '../../../static/images/chunjie/video-icon.png',
                2: '../../../static/images/chunjie/img-icon.png',
            },
            tabActiveIndex: 1,
            workStatics: {},
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 3,
            },
            param: {
                1: 'no_verify_num',
                2: 'pass_num',
                3: 'refuse_num',
            },
            total: 1,
            type: 'myWork',
        };
    },
    methods: {
        toggle(k) {
            this.activeMenuIndex = k;
            this.filter.sort = k;
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
                    ({ list, total }) => {
                        this.workStatics[
                            this.param[this.tabActiveIndex]
                        ] = total;
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
            this.tabActiveIndex = i;
            this.getWorkData();
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
};
</script>

<style lang="less">
.abc {
    position: fixed;
    z-index: 999;
    right: 0;
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
        position: absolute;
        top: 175upx;
        left: 290upx;
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
    background: url("../../../static/images/chunjie/main_bg.png") repeat-y;
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
                background: url("../../../static/images/chunjie/neworhot.png")
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
            width: 100%;
            height: 80upx;
            position: relative;
            border-radius: 76upx;
            float: right;

            image {
                width: 28upx;
                height: 28upx;
                position: absolute;
                top: 24upx;
                left: 29upx;
            }
            input {
                // margin-left:11upx;
                width: 525upx;
                position: absolute;
                top: 14upx;
                left: 69upx;
                font-size: 28upx;
                color: #ff3849;
            }
            input::-webkit-input-placeholder {
                color: #c9ac67;
                font-size: 24upx;
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
}
</style>
