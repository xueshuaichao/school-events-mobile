<template>
    <view class="page-work-list">
        <view class="tab-bar-wrap">
            <view class="search">
                <input
                    v-model="filter.keyword"
                    placeholder-class="placeholderStyle"
                    maxlength="13"
                    :placeholder="searchWord"
                    @confirm="bindconfirm"
                    @focus="showSearchDrop = true"
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
                @click.prevent="toggleMenu"
            >
                <view
                    v-if="showMenuType === 'category'"
                    class="row"
                >
                    <view class="col">
                        <view class="menu-list">
                            <!-- <view
                                class="menu-item"
                                :class="{
                                    active: filter.cat_id.one_level_id === -1
                                }"
                                @click.stop="onSelect('cat_one', -1)"
                            >
                                全部
                            </view> -->
                            <view
                                v-for="item in categoryData"
                                :key="item.cat_id"
                                class="menu-item"
                                :class="{
                                    active:
                                        filter.cat_id.one_level_id ===
                                        item.cat_id
                                }"
                                @click.stop="onSelect('cat_one', item)"
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
                                @click.stop="onSelect('sort', 1)"
                            >
                                最热
                            </view>
                            <view
                                class="menu-item"
                                :class="{ active: filter.sort === 3 }"
                                @click.stop="onSelect('sort', 3)"
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
                            :filter="filter"
                            :curposition="index"
                            :total="total"
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
        <my-dropdown
            :search-drop-status="showSearchDrop"
            :drop-list="dropList"
            @searchStatus="searchStatus"
            @setHotWord="setHotWord"
        />
    </view>
</template>

<script>
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';
import api from '../../common/api';
import work from '../../components/work/work.vue';
import myDropdown from '../../components/search/my-dropdown.vue';
import blank from '../blank/blank.vue';

export default {
    components: {
        work,
        blank,
        uniLoadMore,
        myDropdown,
    },
    props: {
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
        canRefresh: {
            type: Boolean,
            default: false,
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
                page_size: 10,
                keyword: '',
            },
            total: 0,

            isLoading: true,
            title: '作品展示',
            showMenu: false,
            hiddingMenu: false,

            categoryData: [
                { cat_id: -1, name: '全部' },
                { cat_id: 0, name: '爱挑战竞技作品' },
                { cat_id: 6, name: '爱挑战吉尼斯作品' },
                { cat_id: 3, name: '才艺秀作品' },
            ],
            // countyData: [],
            showMenuType: '',

            catTwoMenu: [],
            // catThreeMenu: [],

            tableData: [],
            changeValue: '',
            curCategory: '全部',
            curSort: '最热',
            isSearchWord: false, // 是否设置了关键词
            searchWord: '',
            showSearchDrop: false,
            dropList: [],
        };
    },
    watch: {
        isReachBtm(val) {
            if (val) {
                this.onReachBottoms();
            }
        },
        isShow() {
            // 处理点赞以后，页面数据刷新的问题。
            this.showMenu = false;
            this.showSearchDrop = false;
            try {
                const value = uni.getStorageSync('onShowFrom');
                if (value === 'detail') {
                    // this.getData();
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
        canRefresh() {
            uni.stopPullDownRefresh();
            // this.getData();
            this.getTableData();
            this.getSearchWord();
        },
    },
    mounted() {
        uni.showLoading({
            title: '加载中',
        });
        this.initFilter(this.paramsFilter);
        this.getTableData();
        this.getSearchWord();
    },
    methods: {
        initFilter(val) {
            this.filter.cat_id.one_level_id = Number(val.cat_id.one_level_id);
            this.filter.keyword = val.keyword;
            this.filter.sort = Number(val.sort) || 1;
            this.filter.show_type = val.show_type || '';
            this.curCategory = this.categoryData.filter(
                d => d.cat_id === this.filter.cat_id.one_level_id,
            )[0].name;
        },
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
                    this.filter.cat_id.one_level_id = value.cat_id;
                    this.curCategory = value.name;
                    this.toggleMenu('category');
                    break;
                default:
                    break;
            }
            this.getTableData();
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
        searchStatus(val) {
            this.showSearchDrop = val;
        },
        setHotWord(word) {
            this.filter.keyword = word;
            this.bindconfirm();
            this.showSearchDrop = false;
        },
        bindconfirm() {
            if (this.isSearchWord) {
                this.showSearchDrop = false;
                if (this.dropList.includes(this.filter.keyword)) {
                    this.filter.show_type = 1;
                } else {
                    this.filter.show_type = '';
                }
            }
            return this.getTableData();
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
        getSearchWord() {
            api.get('/api/works/searchword', {
                type: 1,
            }).then(
                (data) => {
                    if (data && data.length) {
                        this.isSearchWord = true;
                        if (this.isFromTabbar) {
                            this.searchWord = data[0].rec_word;
                        }
                        data.forEach((d) => {
                            this.dropList.push(d.rec_word);
                        });
                    } else {
                        this.isSearchWord = false;
                        this.searchWord = '请输入学校名称/作品名称/作者名称';
                    }
                },
                () => {
                    this.isSearchWord = false;
                    this.searchWord = '请输入学校名称/作品名称/作者名称';
                },
            );
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
    margin-top: 200upx;
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
.dropdown-wrap {
    position: fixed;
    width: 100%;
    top: calc(170upx);
    height: calc(100% - 170upx - var(--window-bottom));
    z-index: 100;

    .dropdown {
        height: 100%;
    }

    .row {
        display: flex;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);

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
        padding: 20upx 0;
        // padding-top: 10upx;
        background: #fff;
        border-radius: 0 0 8upx 8upx;
    }
    .menu-item {
        font-size: 28upx;
        color: #666;
        line-height: 70upx;

        &.active {
            color: #1166ff;
        }
    }
}

.tab-bar-wrap {
    // position: fixed;
    // top: 0;
    // z-index: 1000;
    box-shadow: 0 0 8upx 0 rgba(0, 0, 0, 0.05);
    .search {
        font-size: 24upx;
        overflow: hidden;
        padding: 20upx 30upx 20rpx;
        background: #fff;
        box-shadow: 0 0upx 5upx 0 rgba(0, 0, 0, 0.05);
        position: fixed;
        top: 0;
        z-index: 103;

        input {
            background: #f3f3f3;
            border: none;
            border-radius: 30upx;
            width: 598upx;
            height: 60upx;
            float: left;
            display: block;
            padding-left: 40upx;
            box-sizing: border-box;
            margin-bottom: 10upx;
            font-size: 26upx;
        }
        .placeholderStyle {
            color: #999999;
            text-align: left;
            font-size: 26upx;
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
        padding: 0 12%;
        font-size: 32upx;
        position: fixed;
        top: 100upx;
        width: 100%;
        box-sizing: border-box;
        z-index: 101;
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
