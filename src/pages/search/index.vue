<template>
    <view class="page-my-work">
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view class="panel">
            <view class="search">
                <input
                    v-model="changeValue"
                    placeholder-class="placeholderStyle"
                    placeholder="请输入作品名称/作者姓名"
                    @confirm="bindconfirm"
                >
                <text
                    class="button"
                    @click="bindconfirm"
                >
                    搜索
                </text>
            </view>
            <view
                v-if="total > 0"
                class="media-box"
            >
                <view
                    v-for="item in dataList"
                    :key="item.id"
                    class="media-content"
                >
                    <event-craft-cover
                        :info="item"
                        :bg-color="'006EDE'"
                        @click.native="viewDetail(item)"
                    />
                    <view class="work-info">
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
                v-show="searchEmpty"
                class="empty"
            >
                <image src="../../../static/images/yiqing/empty.png" />
                <view>搜索不到您要的结果，换个关键词试试吧～</view>
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
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../components/event-craft-cover/index.vue';

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
            changeValue: '',
            loadMoreStatus: 'none',
            mediaIcon: {
                1: '../../../static/images/chunjie/video-icon.png',
                2: '../../../static/images/chunjie/img-icon.png',
            },
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 5,
                activity_cat: 1,
            },
            total: 1,
        };
    },
    computed: {
        searchEmpty() {
            return this.total === 0;
        },
    },
    methods: {
        goHome() {
            uni.reLaunch({
                url: '/pages/yiqing/index',
            });
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
                this.searchWorkData('reachBottom');
            }
        },
        viewDetail(item) {
            uni.navigateTo({
                url: `/pages/yiqing/detail/detail?id=${item.id}`,
            });
        },
    },
    onLoad(query) {
        const { name } = query;

        // uni.setNavigationBarTitle({ title: '抗击疫情“艺”起来' });
        this.filter.search = name;
        this.changeValue = name;
        this.searchWorkData();
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
.media-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .media-content {
        width: 330upx;
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
        }
    }
}
.page-my-work {
    padding: 0 20upx;
    padding-top: 30upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    // background: #1154ff;
    // background-size: contain;
    .search {
        width: 100%;
        font-size: 24upx;
        overflow: hidden;
        input {
            background: #f3f3f3;
            border: none;
            border-radius: 30upx;
            width: 606upx;
            height: 60upx;
            float: left;
            display: block;
            padding-left: 40upx;
            box-sizing: border-box;
        }
        .placeholderStyle {
            color: #999999;
            text-align: center;
        }
        .button {
            float: left;
            height: 60upx;
            line-height: 60upx;
            color: #666666;
            font-size: 32upx;
            margin-left: 28upx;
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
