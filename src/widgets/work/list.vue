<template>
    <view class="page-work-list">
        <view
            v-if="!isLoading"
            class="main"
        >
            <template v-if="tableData.length > 0">
                <view class="widget-list-box">
                    <view
                        v-for="item in tableData"
                        :key="item.id"
                        class="work-item"
                    >
                        <work :info="item" />
                    </view>
                </view>
                <uni-load-more :status="loadMoreStatus" />
            </template>
            <view
                v-else
                class="blank-box"
            >
                <blank />
            </view>
        </view>
    </view>
</template>

<script>
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import api from '../../common/api';
import work from '../../components/work/work.vue';
import blank from '../blank/blank.vue';

export default {
    components: {
        work,
        blank,
        uniLoadMore,
    },
    props: {
        apiUrl: {
            type: String,
            default: '/api/works/list',
        },
        isReachBtm: {
            type: Boolean,
            default: false,
        },
        isShow: {
            type: Boolean,
            default: false,
        },
        paramsFilter: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            loadMoreStatus: 'more',
            filter: this.paramsFilter,
            total: 0,

            isLoading: true,
            title: '作品展示',
            showMenu: false,
            hiddingMenu: false,

            categoryData: [],
            // countyData: [],
            showMenuType: '',

            catTwoMenu: [],
            // catThreeMenu: [],

            tableData: [],
            changeValue: '',
            curCategory: '全部',
            curSort: '最热',
        };
    },
    watch: {
        isReachBtm(val) {
            if (val) {
                this.onReachBottoms();
            }
        },
        paramsFilter(val) {
            if (val) {
                this.getTableData();
            }
        },
        isShow() {
            // 处理点赞以后，页面数据刷新的问题。
            this.showMenu = false;
            try {
                const value = uni.getStorageSync('onShowFrom');
                if (value === 'detail') {
                    this.getData();
                    this.getTableData();
                    if (!this.paramsFilter.from) {
                        uni.setStorageSync('onShowFrom', '');
                    }
                }
            } catch (e) {
                // error
                uni.setStorageSync('onShowFrom', '');
            }
        },
    },
    created() {
        // tabbar不需要设置参数，直接从接口得到
        uni.showLoading({
            title: '加载中',
        });
        this.getTableData();
    },
    methods: {
        getTableData() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 50,
            });
            this.paramsFilter.page_num = 1;
            this.loadMoreStatus = 'more';

            api.post(this.apiUrl, this.filter).then((res) => {
                uni.hideLoading();
                this.isLoading = false;
                this.tableData = res.list;
                this.total = res.total;
                // console.log(res);
                if (this.total < this.filter.page_size) {
                    this.loadMoreStatus = 'noMore';
                }
            });
        },
        getTableDataMore() {
            api.post(this.apiUrl, this.filter).then((res) => {
                this.tableData = this.tableData.concat(res.list);
                this.total = res.total;
                this.loadMoreStatus = 'more';
                if (this.total <= this.tableData.length) {
                    this.loadMoreStatus = 'noMore';
                }
            });
        },
        onReachBottoms() {
            if (this.total > this.filter.page_num * this.filter.page_size) {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getTableDataMore();
                this.$emit('changeBottom');
            } else {
                this.loadMoreStatus = 'noMore';
            }
        },
    },
};
</script>

<style lang="less">
.page-work-list {
    overflow: hidden;
}

.main {
    white-space: pre-wrap;
    margin-top: 40upx;
    .widget-list-box {
        // padding-top: 40upx;
        margin: 0 30upx 14upx 30upx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .work-item {
        justify-content: space-between;
        width: 337upx;
        height: 294upx;
        margin-bottom: 20upx;
    }
    .blank-box {
        margin-top: 350upx;
    }
}
</style>
