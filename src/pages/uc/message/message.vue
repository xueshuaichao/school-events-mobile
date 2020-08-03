<template>
    <view class="page-message">
        <view class="mes-panel-hd">
            <view
                class="mes-panel-title"
                :class="{ active: selTab === 0 }"
                @click="clickTab(0)"
            >
                系统通知
            </view>
            <view
                class="mes-panel-title"
                :class="{ active: selTab === 1 }"
                @click="clickTab(1)"
            >
                喜欢
            </view>
            <view
                class="mes-panel-title"
                :class="{ active: selTab === 2 }"
                @click="clickTab(2)"
            >
                评论
            </view>
        </view>
        <template v-if="loading">
            <view class="content">
                <view
                    v-for="(item, index) in dataList"
                    :key="item.id"
                    class="mess-item"
                >
                    <view
                        class="item clearfix"
                        :style="{ left: item.left + 'px' }"
                        :data-left="item.left"
                    >
                        <view
                            class="fl-l"
                            :data-index="index"
                            @touchstart="touchS"
                            @touchmove="touchM"
                            @touchend="touchE"
                            @click="toDetail(item)"
                        >
                            <view
                                class="fl-l left"
                                :class="'message-' + selTab"
                            >
                                <image
                                    :src="
                                        `/static/images/uc/message-${selTab +
                                            1}.png`
                                    "
                                />
                            </view>
                            <view class="fl-l center clearfix">
                                <view class="fl-l center-main">
                                    <view class="txt">
                                        {{ item.content }}
                                    </view>
                                    <view class="time">
                                        {{ item.created_at }}
                                    </view>
                                </view>
                                <template v-if="!item.is_read">
                                    <view class="fl-r dot" />
                                </template>
                            </view>
                        </view>
                        <view
                            class="fl-r delete-btn"
                            @click="deleteMes(item)"
                        >
                            删除
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
                    color="#999"
                />
            </view>
        </template>
        <template v-if="loading && dataList.length">
            <view
                class="all-show-close"
                @click="allShowChoose"
            >
                全部已读
            </view>
        </template>
        <template v-if="loading && !dataList.length">
            <blank msg="暂无消息通知" />
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';
import blank from '../../../widgets/blank/blank.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        blank,
        uniLoadMore,
    },
    data() {
        return {
            dataList: [],
            loadMoreStatus: 'none',
            filter: {
                page_num: 1,
                page_size: 10,
                category: 1,
            },
            selTab: 0,
            loading: false,
            startX: 0,
            delBtnWidth: 80,
            checkedArr: [],
        };
    },
    created() {
        const that = this;
        uni.getSystemInfo({
            success(res) {
                const pix = res.screenWidth / 750;
                that.delBtnWidth = 136 * pix;
            },
        });
    },
    methods: {
        toDetail(item) {
            if (!this.selTab) {
                if (!item.is_read) {
                    this.handleMessage([item.msg_id]);
                }
                // 兑换商品，中奖信息，与系统消息要区别开。
                if (item.detail) {
                    let url = '';
                    switch (item.detail.trans_type) {
                        case 1:
                            url = '/activity/pages/mall/order/list?activity_id=12';
                            break;
                        case 2:
                            // 奖品详情
                            url = `/activity/pages/lottery/detail?id=${item.detail.goods_id}&activity_id=12`;
                            break;
                        case 3:
                            url = '/activity/pages/mall/score/list?activity_id=12';
                            break;
                        default:
                            // 商品详情
                            url = `/activity/pages/mall/order/detail?id=${item.detail.goods_id}&activity_id=12`;
                            break;
                    }
                    uni.navigateTo({
                        url,
                    });
                } else {
                    uni.navigateTo({
                        url: `/pages/uc/myWork/myWork?type=${item.type}`,
                    });
                }
            } else if (item.detail && item.detail.resource_id) {
                // 查看作品详情。
                this.$store.commit('setFilterData', {
                    position: {
                        total: 1,
                        curposition: 0,
                        from: '',
                    },
                    filter: this.filter,
                });
                if (!item.is_read) {
                    this.handleMessage([item.msg_id]);
                }
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${
                        item.detail.resource_id
                    }&activity_id=${item.detail.activity_id || ''}`,
                });
            }
        },
        clickTab(val) {
            this.selTab = val;
            this.filter.category = val + 1;
            this.filter.page_num = 1;
            this.getDataList();
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getDataList('reachBottom');
            }
        },
        getDataList(title) {
            api.get('/api/common/msg', this.filter).then(({ list, total }) => {
                const List = list.map((d) => {
                    const D = d;
                    D.left = 0;
                    return D;
                });
                if (title === 'reachBottom') {
                    this.dataList = this.dataList.concat(List);
                } else {
                    this.dataList = List;
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
                this.loading = true;
            });
        },
        allShowChoose() {
            this.checkedArr = [];
            this.dataList.forEach((item) => {
                const itemVal = String(item.msg_id);
                if (!this.checkedArr.includes(itemVal) && !item.is_read) {
                    this.checkedArr.push(itemVal);
                }
            });
            if (!this.checkedArr.length) {
                uni.showToast({
                    icon: 'none',
                    title: '暂无未读消息',
                });
            } else {
                this.handleMessage(this.checkedArr);
            }
        },

        handleMessage(id) {
            const idArr = Array.isArray(id) ? id : [id];
            api.post('/api/common/readmsg', {
                msg_id: idArr,
            }).then(() => {
                this.checkedArr = [];
                this.dataList.forEach((item, index) => {
                    idArr.forEach((itemId) => {
                        if (item.msg_id === Number(itemId)) {
                            this.$set(this.dataList[index], 'is_read', 1);
                        }
                    });
                });
            });
        },
        deleteMes(item) {
            const index = this.dataList.indexOf(item);
            api.post('/api/common/deletemsg', { id: item.id }).then(
                () => {
                    if (index !== -1) {
                        this.dataList.splice(index, 1);
                        this.total -= 1;
                        if (
                            this.dataList.length <= this.filter.page_size
                            && this.total >= this.filter.page_size
                        ) {
                            this.filter.page_num = 1;
                            this.getDataList();
                        }
                    }
                    uni.showToast({
                        title: '已删除',
                        icon: 'none',
                    });
                },
                () => {
                    uni.showToast({
                        title: '操作失败，再试一下',
                        icon: 'none',
                    });
                },
            );
        },
        touchS(e) {
            // if (e.touches.length == 1) {
            // 设置触摸起始点水平方向位置
            this.startX = e.touches[0].clientX;
            // }
        },
        touchM(e) {
            // if (e.touches.length == 1) {
            // 手指移动时水平方向位置
            const moveX = e.touches[0].clientX;
            // 手指起始点位置与移动期间的差值
            const disX = this.startX - moveX;
            const { delBtnWidth } = this;
            let left = 0;
            if (disX === 0 || disX < 0) {
                // 如果移动距离小于等于0，说明向右滑动，文本层位置不变
                left = 0;
            } else if (disX > 0) {
                // 移动距离大于0，文本层left值等于手指移动距离
                left = 0 - disX;
                if (disX >= delBtnWidth) {
                    // 控制手指移动距离最大值为删除按钮的宽度
                    left = 0 - this.delBtnWidth;
                }
            }
            // 获取手指触摸的是哪一项
            const { index } = e.currentTarget.dataset;
            const list = this.dataList;
            list[index].left = left;
            // 更新列表的状态
            this.dataList = list;
            // }
        },
        touchE(e) {
            // if (e.changedTouches.length == 1) {
            // 手指移动结束后水平位置
            const endX = e.changedTouches[0].clientX;
            // 触摸开始与结束，手指移动的距离
            const disX = this.startX - endX;
            const { delBtnWidth } = this;
            // 如果距离小于删除按钮的1/2，不显示删除按钮
            const left = disX > delBtnWidth / 2 ? 0 - this.delBtnWidth : 0;
            // 获取手指触摸的是哪一项
            const { index } = e.currentTarget.dataset;
            this.$set(this.dataList[index], 'left', left);
            const list = this.dataList;
            list[index].left = left;
            // 更新列表的状态
            this.dataList = list;
            // }
        },
        stopOutMove() {},
    },
    onLoad() {
        this.getDataList();
    },
};
</script>

<style lang="less">
.page-message {
    .mes-panel-hd {
        display: flex;
        justify-content: space-around;
        border-bottom: 2rpx solid #eee;
        position: fixed;
        top: 0;
        width: 100%;
        background: #fff;
        z-index: 1;
        .mes-panel-title {
            color: #999;
            font-size: 32rpx;
            line-height: 70rpx;
            margin: 30rpx 0;
            width: 192rpx;
            text-align: center;
            font-weight: 600;
            &.active {
                background: rgba(17, 102, 255, 1);
                border-radius: 34rpx;
                color: #fff;
            }
        }
    }
    .content {
        margin-top: 130rpx;
        margin-bottom: 110rpx;
        max-height: calc(100vh - 242rpx);
    }
    .mess-item {
        position: relative;
        height: 186rpx;
        overflow-x: hidden;
        .item {
            position: absolute;
            left: 0;
            top: 0;
            width: 886rpx;
            height: 186rpx;
            box-sizing: border-box;
        }
        .left {
            margin: 48rpx 24rpx 0 30rpx;
            width: 90rpx;
            height: 90rpx;
            border-radius: 50%;
            text-align: center;
            image {
                width: 40rpx;
                height: 40rpx;
                margin-top: 24rpx;
            }
            &.message-0 {
                background: #75a6ff;
            }
            &.message-1 {
                background: #ff9b9b;
            }
            &.message-2 {
                background: #ffd09b;
            }
        }
        .center {
            line-height: 46rpx;
            width: 606rpx;
            padding: 30rpx 0;
            border-bottom: 2rpx solid #eee;
            height: 186rpx;
            box-sizing: border-box;
            .center-main {
                width: 530rpx;
                overflow: hidden;
            }
            .txt {
                height: 92rpx;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                font-size: 30rpx;
                color: #333;
                line-height: 46rpx;
                word-break: break-all;
            }
            .time {
                color: #999;
                font-size: 22rpx;
            }
            .dot {
                width: 14rpx;
                height: 14rpx;
                border-radius: 50%;
                background: #ff6555;
                margin-right: 20rpx;
                margin-top: 62rpx;
            }
        }

        .delete-btn {
            background: #ff6555;
            color: #fff;
            font-size: 30rpx;
            width: 136rpx;
            text-align: center;
            line-height: 186rpx;
        }
    }
    .blank-wrap {
        margin-top: 180upx;
    }
    .all-show-close {
        position: fixed;
        bottom: 0;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 30rpx;
        color: #666;
        width: 100%;
        background: #fff;
    }
}
</style>
