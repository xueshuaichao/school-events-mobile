<template>
    <view class="page-my-work">
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view
            v-if="true || userInfo.identity === 3 || userInfo.identity === 4"
            class="work-panel"
        >
            <text
                class="panel-title"
                :class="{ active: tabActiveIndex === 0 }"
                @click="setTabActive(0)"
            >
                <text class="bold">
                    已通过
                </text>({{
                    (workStatics.pass_num > 90
                        ? "99+"
                        : workStatics.pass_num) || 0
                }})
            </text>
            <text
                class="panel-title"
                :class="{ active: tabActiveIndex === 1 }"
                @click="setTabActive(1)"
            >
                <text class="bold">
                    待审核
                </text>
                ({{
                    (workStatics.no_verify_num > 99
                        ? "99+"
                        : workStatics.no_verify_num) || 0
                }})
            </text>
            <text
                class="panel-title"
                :class="{ active: tabActiveIndex === 2 }"
                @click="setTabActive(2)"
            >
                <text class="bold">
                    未通过
                </text>
                ({{
                    (workStatics.refuse_num > 99
                        ? "99+"
                        : workStatics.refuse_num) || 0
                }})
            </text>
        </view>
        <view class="work-list">
            <template v-if="tableData.length">
                <view
                    v-for="(item, index) in tableData"
                    :key="item.id"
                    class="work-item"
                >
                    <work
                        :info="item"
                        :mode="'single'"
                        :show-class="false"
                        :from="'/api/user/worklist'"
                        @click.prevent="toDetail(item, index)"
                    />
                    <view
                        class="btns"
                        :class="{ pass: item.status === 1 || isH5 }"
                    >
                        <button
                            v-if="item.status === 1"
                            class="btn active"
                            @click.stop="toDetail(item, index)"
                        >
                            查看
                        </button>
                        <button
                            v-if="item.status === 2"
                            class="btn active"
                            @click="showCause(item)"
                        >
                            驳回原因
                        </button>
                        <button
                            v-if="!isH5 && item.status === 2"
                            class="btn active"
                            @click="editWork(item)"
                        >
                            编辑
                        </button>
                        <button
                            v-if="item.status"
                            class="btn"
                            @click="onConfirmDelete(item)"
                        >
                            删除
                        </button>
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
                <blank type="uc" />
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        blank,
        work,
        uniLoadMore,
    },
    data() {
        return {
            isLoading: true,
            userInfo: null,
            loadMoreStatus: 'none',
            // #ifdef H5
            isH5: true,
            // #endif
            filter: {
                page_num: 1,
                page_size: 10,
                status: 1,
                parent_scope: 2,
            },
            tabActiveIndex: 0,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
        };
    },
    methods: {
        getWorkStatic() {
            api.get('/api/user/workstatics', { parent_scope: 2 }).then(
                (res) => {
                    this.workStatics = res;
                },
                () => {},
            );
        },
        toDetail(item, index) {
            if (this.filter.status === 1) {
                this.$store.commit('setFilterData', {
                    position: {
                        total: this.total,
                        curposition: index,
                        from: '/api/user/worklist',
                    },
                    filter: this.filter,
                });
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${item.id}&activity_id=${item.activity_id}`,
                });
            }
        },
        showCause({ memo }) {
            uni.showModal({
                title: '驳回原因',
                content: memo || '暂无内容',
                showCancel: false,
            });
        },
        editWork({
            id,
            activity_id: activityId,
            activity_status: activityStatus,
        }) {
            // activityStatus 1未开始 2进行中  3已过期
            if (activityStatus === 3) {
                return uni.showToast({
                    title: '活动已结束！',
                    icon: 'none',
                });
            }
            let urlPath = `/pages/upload/modify/modify?id=${id}`;
            if (activityId === 6) {
                urlPath = `/pages/read/upload/modify?id=${id}`;
            } else if (activityId === 8) {
                urlPath = `/pages/activity-pages/upload/modify?id=${id}&activity_id=${activityId}`;
            } else if (activityId > 8) {
                urlPath = `/activity/pages/upload/modify?id=${id}&activity_id=${activityId}&from=mywork`;
            }
            return uni.navigateTo({
                url: urlPath,
            });
        },
        deleteWork(item) {
            let url = '/api/user/delwork';
            if (item.activity_id) {
                // 活动
                url = '/api/activity/del';
            }
            const index = this.tableData.indexOf(item);
            api.post(url, {
                id: item.id,
            }).then(() => {
                if (index !== -1) {
                    this.tableData.splice(index, 1);
                    this.total -= 1;
                    if (
                        this.tableData.length <= this.filter.page_size
                        && this.total >= this.filter.page_size
                    ) {
                        this.filter.page_num = 1;
                        this.getWorkData();
                    }
                }
                uni.showToast({
                    title: '删除成功',
                });
                this.getWorkStatic();
            });
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
        getWorkData(title) {
            this.getWorkStatic();
            // 作品状态 status 0—待审核 1—已通过 2—未通过 -1 全部
            this.filter.status = 1;
            if (this.tabActiveIndex === 1) {
                this.filter.status = 0;
            } else if (this.tabActiveIndex === 2) {
                this.filter.status = 2;
            }
            return api.get('/api/user/worklist', this.filter).then(
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
        setTabActive(i) {
            this.filter.page_num = 1;
            this.tabActiveIndex = i;
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
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
                        this.deleteWork(item);
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                },
            });
        },
        onShareAppMessage(res) {
            if (res.from === 'button') {
                // 来自页面内分享按钮
                const index = res.target.id;
                const item = this.tableData[index];
                return {
                    title: item.resource_name,
                    imageUrl: item.video_img_url,
                    path: `/pages/work/detail/detail?id=${item.id}&activity_id=${item.activity_id}`,
                };
            }
            return false;
        },
    },
    onLoad(query) {
        // 作品状态 status 0—待审核 1—已通过 2—未通过 -1 全部
        const { type } = query;
        const index = type && Number(type);
        this.tabActiveIndex = index || 0;
        if (index === 1) {
            this.tabActiveIndex = 0;
        } else if (index === 0) {
            this.tabActiveIndex = 1;
        }
        this.getWorkData();
    },
};
</script>

<style lang="less">
.page-my-work {
    padding: 84upx 30upx 0;
    .work-panel {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 1;
        display: flex;
        justify-content: space-around;
        padding: 30rpx 0;
        .panel-title {
            display: block;
            padding: 0 32rpx;
            color: #666;
            font-size: 30rpx;
            border-radius: 36rpx;
            line-height: 70rpx;
            .bold {
                font-weight: 600;
            }
            &.active {
                background: #1166ff;
                color: #fff;
            }
        }
    }
    .work-list {
        margin-top: 16upx;
        .work-item {
            padding: 30upx 0 0upx;
            position: relative;
            // .thumbnail-wrap,
            // .thumbnail {
            //     width: 266upx;
            //     height: 155upx;
            // }
        }
        .work-name {
            white-space: normal;
        }
        .text-info {
            margin-bottom: 24upx;
            margin-top: 0;
            font-size: 22upx;
        }

        .btns {
            position: absolute;
            right: 20upx;
            bottom: 24upx;
            display: flex;
            justify-content: space-around;
            box-sizing: border-box;
            width: 328upx;
            .btn {
                display: inline-block;
                padding: 0 14upx;
                height: 64upx;
                font-size: 28upx;
                line-height: 64upx;
                text-align: center;
                margin: 0;
                color: #666;
                border-radius: 32upx;
                border: 2upx solid #ccc;
                background: #fff;

                &.active {
                    border-color: #1166ff;
                    color: #fff;
                    background: #1166ff;
                }
                &::after {
                    border-radius: 80upx;
                }
            }
            &.pass {
                .btn {
                    padding: 0;
                    width: 152upx;
                    text-align: center;
                }
            }
        }
    }

    .blank-wrap {
        margin-top: 180upx;
    }
}
</style>
