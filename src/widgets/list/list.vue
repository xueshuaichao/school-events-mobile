<template>
    <view class="page-work-list">
        <view class="tab-bar-wrap">
            <view class="search">
                <input
                    v-model="filter.keyword"
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
            <view class="tab-bar">
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'category'
                    }"
                    @click="toggleMenu('category')"
                >
                    <text>{{ curCategory }}</text>
                </view>
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'sort'
                    }"
                    @click="toggleMenu('sort')"
                >
                    <text>{{ curSort }}</text>
                </view>
            </view>
        </view>
        <div
            v-if="showMenu"
            class="dropdown-wrap"
        >
            <view
                class="dropdown animated slideInDown faster"
                :class="hiddingMenu ? 'slideOutUp' : ''"
            >
                <view
                    v-if="showMenuType === 'category'"
                    class="row"
                >
                    <view class="col">
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{
                                    active: filter.cat_id.one_level_id === -1
                                }"
                                @click="onSelect('cat_one', -1)"
                            >
                                全部
                            </view>
                            <view
                                v-for="item in categoryData[2].list"
                                :key="item.cat_id"
                                class="menu-item"
                                :class="{
                                    active:
                                        filter.cat_id.one_level_id ===
                                        item.cat_id
                                }"
                                @click="onSelect('cat_one', item)"
                            >
                                {{ item.name }}
                            </view>
                        </view>
                    </view>
                </view>

                <view
                    v-if="showMenuType === 'sort'"
                    class="row"
                >
                    <scroll-view
                        class="scroll-view"
                        scroll-y="true"
                    >
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{ active: filter.sort === 1 }"
                                @click="onSelect('sort', 1)"
                            >
                                最热
                            </view>
                            <view
                                class="menu-item"
                                :class="{ active: filter.sort === 3 }"
                                @click="onSelect('sort', 3)"
                            >
                                最新
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </div>

        <view
            v-if="!isLoading"
            class="main"
        >
            <template v-if="tableData.length > 0">
                <view class="widget-list-box">
                    <view
                        v-for="(item, index) in tableData"
                        :key="item.id"
                        class="work-item"
                    >
                        <work
                            :info="item"
                            :query="
                                `sort=${filter.sort}&keyword=${
                                    filter.keyword
                                }&total=${total}&levelid=${
                                    filter.cat_id.one_level_id
                                }&curPosition=${index + 1}`
                            "
                        />
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
        hasPageParams: {
            type: Boolean,
            default: false,
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
        isFromTabbar: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            loadMoreStatus: 'more',
            filter: {
                address: {
                    // province_id: '610000',
                    province_id: 0,
                    city_id: 0,
                    county_id: 0,
                },
                team_id: 0,
                sort: 1,

                cat_id: {
                    one_level_id: 0,
                    two_level_id: 0,
                    three_level_id: 0,
                },
                page_num: 1,
                page_size: 20,
                keyword: '',
            },
            total: 0,

            isLoading: true,
            title: '作品展示',
            showMenu: false,
            hiddingMenu: false,

            categoryData: [],
            countyData: [],
            showMenuType: '',

            catTwoMenu: [],
            catThreeMenu: [],

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
                // // h5 与 小程序监听 paramsFilter的值，获取的时间不一样。1.这里为了兼容小程序和h5
                this.filter.cat_id.one_level_id = Number(val.cat_id.one_level_id) || -1;
                this.filter.keyword = val.keyword;
                this.filter.sort = Number(val.sort) || 1;

                this.getData();
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
        if (this.isFromTabbar) {
            this.filter.cat_id.one_level_id = -1;
            this.getData();
            this.getTableData();
        } else if (
            this.paramsFilter.cat_id.one_level_id > 0
            || this.paramsFilter.keyword
        ) {
            // h5 与 小程序监听 paramsFilter的值，获取的时间不一样。1.这里为了兼容小程序和h5
            this.filter.cat_id.one_level_id = Number(this.paramsFilter.cat_id.one_level_id) || -1;
            this.filter.keyword = this.paramsFilter.keyword;
            this.filter.sort = Number(this.paramsFilter.sort) || 1;

            this.getData();
            this.getTableData();
        }
    },
    methods: {
        onSelect(type, value) {
            switch (type) {
                case 'sort':
                    this.filter.sort = value;
                    this.toggleMenu('sort');
                    if (value === 1) {
                        this.curSort = '最热';
                    } else if (value === 3) {
                        this.curSort = '最新';
                    }
                    break;
                case 'cat_one':
                    this.toggleMenu('category');
                    if (value === -1) {
                        this.filter.cat_id.one_level_id = -1;
                        this.catTwoMenu = [];
                        this.curCategory = '全部';
                    } else {
                        this.filter.cat_id.one_level_id = value.cat_id;
                        this.catTwoMenu = value.children;
                        this.curCategory = value.name;
                    }
                    this.toggleMenu('category');
                    this.filter.cat_id.two_level_id = 0;
                    this.filter.cat_id.three_level_id = 0;
                    this.catThreeMenu = [];
                    break;
                default:
                    break;
            }
            this.getTableData();
        },

        getData() {
            api.get('/api/works/cats').then((res) => {
                this.categoryData = res;
                const arr = res[2].list.filter(
                    d => d.cat_id === this.filter.cat_id.one_level_id,
                );
                if (arr.length) {
                    this.curCategory = arr[0].name;
                } else {
                    this.curCategory = '全部';
                }
            });
        },
        getTableData() {
            uni.pageScrollTo({
                scrollTop: 0,
                duration: 50,
            });
            this.filter.page_num = 1;
            this.filter.address.province_id = 0;
            this.loadMoreStatus = 'more';

            api.post('/api/works/list', this.filter).then((res) => {
                this.tableData = res.list;
                this.total = res.total;
                this.isLoading = false;
                console.log(res);
                if (this.total < 20) {
                    this.loadMoreStatus = 'noMore';
                }
            });
        },
        getTableDataMore() {
            api.post('/api/works/list', this.filter).then((res) => {
                this.tableData = this.tableData.concat(res.list);
                this.total = res.total;
                this.loadMoreStatus = 'more';
                if (this.total <= this.tableData.length) {
                    this.loadMoreStatus = 'noMore';
                }
            });
        },
        toggleMenu(type) {
            if (this.showMenu && this.showMenuType === type) {
                this.hiddingMenu = true;
                setTimeout(() => {
                    this.hiddingMenu = false;
                    this.showMenu = false;
                }, 300);
                console.log('hide menu');
            } else {
                this.showMenu = true;
                this.showMenuType = type;
                console.log('show menu');
            }
        },
        bindconfirm() {
            this.getTableData();
        },
        onReachBottoms() {
            console.log(
                this.total === this.filter.page_num * this.filter.page_size,
            );
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
    margin-top: 180upx;
    .widget-list-box {
        padding-top: 40upx;
        margin: 0 0 14upx 28upx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    .work-item {
        justify-content: space-between;
        width: 330upx;
        height: 300upx;
        margin-right: 28upx;
        margin-bottom: 30upx;
    }
    .blank-box {
        margin-top: 350upx;
    }
}
.comp-work {
    margin-right: 30upx;
    margin-bottom: 40upx;
}

.dropdown-wrap {
    position: fixed;
    width: 100%;
    top: calc(180upx);
    height: calc(100% - 180upx - var(--window-bottom));
    z-index: 100;

    .dropdown {
        height: 100%;
    }

    .row {
        display: flex;
        height: 100%;
        background: #fff;

        .col {
            flex: 1;
            text-align: center;
            height: 100%;
        }
    }

    .scroll-view {
        height: 100%;
    }

    .menu-list {
        text-align: center;
        padding-bottom: 20upx;
        padding-top: 10upx;
    }
    .menu-item {
        font-size: 32upx;
        color: #666;
        line-height: 80upx;

        &.active {
            color: #1166ff;
        }
    }
}

.tab-bar-wrap {
    position: fixed;
    top: 0; //calc(var(--window-top));
    width: 100%;
    z-index: 1000;
    box-shadow: 0 0 8upx 0 rgba(0, 0, 0, 0.05);
    .search {
        width: 100%;
        font-size: 24upx;
        overflow: hidden;
        padding: 20upx 0 20upx 30upx;
        background: #fff;
        box-shadow: 0 0upx 5upx 0 rgba(0, 0, 0, 0.05);

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
            margin-bottom: 10upx;
        }
        .placeholderStyle {
            color: #999999;
            text-align: left;
            font-size: 24upx;
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

    .tab-bar {
        display: flex;
        background: #fff;
        padding: 0 20%;
        font-size: 30upx;
    }

    .tab-item {
        flex: 1;
        line-height: 80upx;
        text-align: center;

        &::after {
            content: " ";
            display: inline-block;
            width: 0;
            height: 0;
            border-left: 8upx solid transparent;
            border-right: 8upx solid transparent;
            border-top: 11upx solid #d8d8d8;
            margin-left: 8upx;
        }

        &.active::after {
            border-top: 11upx solid #1166ff;
            transform: rotate(180deg);
        }
    }
}
</style>
