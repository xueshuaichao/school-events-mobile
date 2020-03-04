<template>
    <view class="page-record">
        <view class="panel">
            <view class="panel-hd">
                <text
                    v-for="(item, index) in navList"
                    :key="index"
                    class="panel-title"
                    :class="{ active: tabActiveIndex === index + 1 }"
                    @click="setTabActive(index + 1)"
                >
                    {{ item }}
                </text>
            </view>
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
                    >
                        <view
                            slot="tag"
                            class="tag-result"
                        >
                            {{ item.achievement }}
                        </view>
                    </work>
                    <view class="btns">
                        <button
                            class="btn"
                            @click="saveRecord(item)"
                        >
                            生成奖状
                        </button>
                    </view>
                </view>
            </template>
            <template v-else>
                <blank />
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';

export default {
    components: {
        work,
    },
    data() {
        return {
            navList: ['校级记录', '市级记录', '省级记录'],
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
    created() {
        this.getWorkData();
    },
    methods: {
        getWorkData(record = 1) {
            return api
                .get('/api/user/worklist', {
                    record,
                    resource_scope: [1, 2],
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
        setTabActive(index) {
            this.tabActiveIndex = index;
            this.getWorkData(index);
        },
        saveRecord() {},
    },
};
</script>

<style lang="less">
.page-record {
    padding: 0 30rpx;
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
        &.active::after {
            background: #1166ff;
        }
    }
    .work-list {
        .work-item {
            border-bottom: 1upx solid #ddd;
            padding: 30upx 0 100upx;

            position: relative;
        }
        .tag-result {
            position: absolute;
            left: 0;
            top: 8upx;
            height: 30upx;
            background: rgba(17, 102, 255, 1);
            border-radius: 0px 15px 15px 0px;
            border: 1px solid rgba(255, 255, 255, 1);
            padding: 0 8upx 0 5upx;
            color: #fff;
            font-size: 20upx;
            line-height: 30upx;
            text-align: center;
        }
        .work-name {
            line-height: 1;
        }
        .text-info {
            margin-bottom: 24upx;
            margin-top: 0;
            font-size: 22upx;
        }

        .btns {
            position: absolute;
            right: 0;
            bottom: 20upx;
            height: 66upx;

            .btn {
                display: inline-block;
                padding: 0 28upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 40upx;
                background: #1166ff;
                border-radius: 0;
            }
        }
    }

    .blank-wrap {
        margin-top: 180upx;
    }
}
</style>
