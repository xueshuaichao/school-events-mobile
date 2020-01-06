<template>
    <view class="page-my-work">
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view
            v-if="true || (userInfo.identity === 3 || userInfo.identity === 4)"
            class="panel"
        >
            <view class="panel-hd">
                <text
                    class="panel-title"
                    :class="{ active: tabActiveIndex === 0 }"
                    @click="setTabActive(0)"
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
                    :class="{ active: tabActiveIndex === 2 }"
                    @click="setTabActive(2)"
                >
                    未通过({{ workStatics.refuse_num || 0 }})
                </text>
            </view>
            <view
                v-if="!isLoadingTableData"
                class="panel-bd work-list"
            >
                <template v-if="tableData.length">
                    <view
                        v-for="item in tableData"
                        :key="item.id"
                        class="work-item"
                    >
                        <work
                            :info="item"
                            :mode="'single'"
                        />
                    </view>
                </template>
                <template v-else>
                    <blank />
                </template>
            </view>
        </view>

        <view v-else>
            <view class="sep" />
            <blank :type="'uc'" />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        blank,
        work,
    },
    data() {
        return {
            isLoading: true,
            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif

            tabActiveIndex: 1,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
        };
    },
    methods: {
        getWorkStatic() {
            api.get('/api/user/workstatics').then(
                (res) => {
                    // this.workStatics = res[0];
                    [this.workStatics] = res;
                },
                () => {},
            );
        },
        editWork(item) {
            uni.navigateTo({
                url: `/pages/upload/modify/modify?id=${item.id}`,
            });
        },
        deleteWork(item) {
            const index = this.tableData.indexOf(item);

            api.post('/api/user/delwork', {
                id: item.id,
            }).then((res) => {
                uni.showToast({
                    title: '删除成功',
                });
                console.log(res);
                if (index !== -1) {
                    this.tableData.splice(index, 1);
                }
                this.getWorkStatic();
            });
        },
        getWorkData() {
            this.getWorkStatic();
            // 作品状态 status 0—待审核 1—已通过 2—未通过 -1 全部
            let status = 1;
            if (this.tabActiveIndex === 1) {
                status = 0;
            } else if (this.tabActiveIndex === 2) {
                status = 2;
            }
            return api
                .get('/api/user/worklist', {
                    status,
                    page_size: 100,
                })
                .then(
                    (res) => {
                        this.isLoadingTableData = false;
                        this.tableData = res.list;
                    },
                    () => {
                        this.tableData = [];
                    },
                );
        },
        setTabActive(i) {
            this.tabActiveIndex = i;
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
                        uni.showToast({
                            title: '删除失败',
                            icon: 'none',
                        });
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
                    path: `/pages/work/detail/detail?id=${item.id}`,
                };
            }
            return false;
        },
    },
    onLoad() {
        this.getWorkData();
    },
};
</script>

<style lang="less">
.page-my-work {
    background: #ff3844;

    .panel .panel-hd {
        border-bottom: none;
        margin: 0 30rpx 20rpx;
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
