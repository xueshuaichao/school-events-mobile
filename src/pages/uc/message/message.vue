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
            <view
                v-for="(item, index) in listTest"
                :key="index"
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
                    >
                        <view
                            class="fl-l left"
                            :class="`message-${selTab}`"
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
                                    恭喜你，你的作品已经通过
                                </view>
                                <view class="time">
                                    2020-05-20
                                </view>
                            </view>
                            <template v-if="!item.left">
                                <view class="fl-r dot" />
                            </template>
                        </view>
                    </view>
                    <view
                        class="fl-l delete-btn"
                        @click="deleteMes(item, index)"
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
            },
            selTab: 0,
            listTest: [],
            loading: false,
            startX: 0,
            delBtnWidth: 80,
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
        this.loading = true;
        this.listTest = [{ left: 0 }, { left: 0 }, { left: 0 }];
        // this.listTest = this.listTest.map(d => {
        //     d.left = 1;
        //     return d;
        // })
    },
    methods: {
        clickTab(val) {
            this.selTab = val;
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
            });
        },
        handleMessage(id, type = '') {
            const idArr = Array.isArray(id) ? id : [id];
            api.post('/api/common/readmsg', {
                msg_id: idArr,
            }).then(() => {
                this.dataList.forEach((item, index) => {
                    idArr.forEach((itemId) => {
                        if (item.msg_id === Number(itemId)) {
                            this.$set(this.dataList[index], 'is_read', 1);
                        }
                    });
                });
                if (type === 'all') {
                    // return this.resetChecbox();
                }
                return uni.navigateTo({
                    url: `/pages/uc/myWork/myWork?type=${type}`,
                });
            });
        },
        deleteMes(item, index) {
            console.log(index, 'deleteMes');
            this.listTest = this.listTest.filter((d, idx) => index !== idx);
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
            const list = this.listTest;
            list[index].left = left;
            // this.listTest[index]['left'] = left;
            // this.$set(this.listTest[index], 'left', left);

            // 更新列表的状态
            this.listTest = list;
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
            this.$set(this.listTest[index], 'left', left);
            // this.listTest[index]['left'] = left;
            // console.log(left, index, this.listTest)

            const list = this.listTest;
            list[index].left = left;
            // console.log(list[index].txtStyle)
            // 更新列表的状态
            this.listTest = list;
            console.log(this.listTest, left);
            // }
        },
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
        border-bottom: 2rpx solid #cdcdcd;
        .mes-panel-title {
            padding: 20rpx 16rpx;
            color: #999;
            font-size: 32rpx;
            line-height: 26rpx;
            margin-bottom: 10rpx;
            &.active {
                border-bottom: 4rpx solid #1166ff;
                color: #333;
            }
        }
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
            margin: 30rpx 24rpx 30rpx 30rpx;
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
            border-bottom: 2rpx solid #cdcdcd;
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
                margin-top: 20rpx;
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
}
</style>
