<template>
    <view class="page-work-list">
        <div class="tab-bar-wrap">
            <view class="tab-bar">
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'address'
                    }"
                    @click="toggleMenu('address')"
                >
                    <text>学校</text>
                </view>
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'grade'
                    }"
                    @click="toggleMenu('grade')"
                >
                    <text>组别</text>
                </view>
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'category'
                    }"
                    @click="toggleMenu('category')"
                >
                    <text>分类</text>
                </view>
                <view
                    class="tab-item"
                    :class="{
                        active: showMenu === true && showMenuType === 'sort'
                    }"
                    @click="toggleMenu('sort')"
                >
                    <text>排序</text>
                </view>
            </view>
        </div>
        <div
            v-if="showMenu"
            class="dropdown-wrap"
        >
            <view
                class="dropdown animated slideInDown faster"
                :class="hiddingMenu ? 'slideOutUp' : ''"
            >
                <view
                    v-if="showMenuType === 'address'"
                    class="row"
                >
                    <view class="col">
                        <scroll-view
                            class="scroll-view"
                            scroll-y="true"
                        >
                            <view class="menu-list">
                                <view
                                    class="menu-item"
                                    :class="{
                                        active: filter.address.city_id === 0
                                    }"
                                    @click="onSelect('city', 0)"
                                >
                                    不限
                                </view>
                                <view
                                    v-for="item in categoryData[0].list"
                                    :key="item.cityid"
                                    class="menu-item"
                                    :class="{
                                        active:
                                            filter.address.city_id ===
                                            item.cityid
                                    }"
                                    @click="onSelect('city', item.cityid)"
                                >
                                    {{ item.name }}
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                    <view class="col sep">
                        <scroll-view
                            v-if="countyData.length > 0"
                            class="scroll-view"
                            scroll-y="true"
                        >
                            <view class="menu-list">
                                <view
                                    class="menu-item"
                                    :class="{
                                        active: filter.address.county_id === 0
                                    }"
                                    @click="onSelect('county', 0)"
                                >
                                    不限
                                </view>
                                <view
                                    v-for="item in countyData"
                                    :key="item.cityid"
                                    class="menu-item"
                                    :class="{
                                        active:
                                            filter.address.county_id ===
                                            item.cityid
                                    }"
                                    @click="onSelect('county', item.cityid)"
                                >
                                    {{ item.name }}
                                </view>
                            </view>
                        </scroll-view>
                    </view>
                </view>

                <view
                    v-if="showMenuType === 'grade'"
                    class="row"
                >
                    <scroll-view
                        class="scroll-view"
                        scroll-y="true"
                    >
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{ active: filter.team_id === 0 }"
                                @click="onSelect('grade', 0)"
                            >
                                不限
                            </view>
                            <view
                                v-for="item in categoryData[1].list"
                                :key="item.id"
                                class="menu-item"
                                :class="{
                                    active: filter.team_id === item.id
                                }"
                                @click="onSelect('grade', item.id)"
                            >
                                {{ item.name }}
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <view
                    v-if="showMenuType === 'category'"
                    class="row"
                >
                    <view class="col">
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{
                                    active: filter.cat_id.one_level_id === 0
                                }"
                                @click="onSelect('cat_one', 0)"
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
                    <view
                        v-if="catTwoMenu.length > 0"
                        class="col sep"
                    >
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{
                                    active: filter.cat_id.two_level_id === 0
                                }"
                                @click="onSelect('cat_two', 0)"
                            >
                                全部
                            </view>
                            <view
                                v-for="item in catTwoMenu"
                                :key="item.cat_id"
                                class="menu-item"
                                :class="{
                                    active:
                                        filter.cat_id.two_level_id ===
                                        item.cat_id
                                }"
                                @click="onSelect('cat_two', item)"
                            >
                                {{ item.name }}
                            </view>
                        </view>
                    </view>
                    <view
                        v-if="catThreeMenu.length > 0"
                        class="col sep"
                    >
                        <view class="menu-list">
                            <view
                                class="menu-item"
                                :class="{
                                    active: filter.cat_id.three_level_id === 0
                                }"
                                @click="onSelect('cat_three', 0)"
                            >
                                全部
                            </view>
                            <view
                                v-for="item in catThreeMenu"
                                :key="item.cat_id"
                                class="menu-item"
                                :class="{
                                    active:
                                        filter.cat_id.three_level_id ===
                                        item.cat_id
                                }"
                                @click="onSelect('cat_three', item)"
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
                                综合排序
                            </view>
                            <view
                                class="menu-item"
                                :class="{ active: filter.sort === 2 }"
                                @click="onSelect('sort', 2)"
                            >
                                播放量
                            </view>
                            <view
                                class="menu-item"
                                :class="{ active: filter.sort === 3 }"
                                @click="onSelect('sort', 3)"
                            >
                                发布时间
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
                <work
                    v-for="item in tableData"
                    :key="item.id"
                    :info="item"
                />
            </template>
            <blank v-else />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        work,
        blank,
    },

    data() {
        return {
            filter: {
                address: {
                    province_id: '610000',
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
            },

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
            total: 0,
        };
    },
    created() {
        this.getData();
        this.getTableData();
    },
    methods: {
        onSelect(type, value) {
            switch (type) {
                // 选择市
                case 'city':
                    this.filter.address.city_id = value;
                    this.filter.address.county_id = 0;
                    this.getCityData(value);
                    break;
                // 选择区
                case 'county':
                    this.filter.address.county_id = value;
                    break;
                case 'grade':
                    this.filter.team_id = value;
                    break;
                case 'sort':
                    this.filter.sort = value;
                    break;
                case 'cat_one':
                    if (value === 0) {
                        this.filter.cat_id.one_level_id = 0;
                        this.catTwoMenu = [];
                    } else {
                        this.filter.cat_id.one_level_id = value.cat_id;
                        this.catTwoMenu = value.children;
                    }
                    this.filter.cat_id.two_level_id = 0;
                    this.filter.cat_id.three_level_id = 0;
                    this.catThreeMenu = [];
                    break;
                case 'cat_two':
                    if (value === 0) {
                        this.filter.cat_id.two_level_id = 0;
                        this.catThreeMenu = [];
                    } else {
                        this.filter.cat_id.two_level_id = value.cat_id;
                        this.catThreeMenu = value.children;
                    }
                    this.filter.cat_id.three_level_id = 0;
                    break;
                case 'cat_three':
                    if (value === 0) {
                        this.filter.cat_id.three_level_id = 0;
                    } else {
                        this.filter.cat_id.three_level_id = value.cat_id;
                    }
                    break;
                default:
                    break;
            }
            this.getTableData();
        },

        getData() {
            api.get('/api/works/cats').then((res) => {
                this.categoryData = res;
            });
        },
        getTableData() {
            api.post('/api/works/list', this.filter).then((res) => {
                this.tableData = res.list;
                this.isLoading = false;
                console.log(res);
            });
        },
        getCityData(cityid) {
            api.get('/api/common/citylist', {
                cityid,
            }).then((res) => {
                console.log(res);
                this.countyData = res;
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
    },
    onLoad(params) {
        const id = params.cat_id;
        this.filter.cat_id.one_level_id = id;

        let title = '作品列表';
        if (id === '1') {
            title = '优秀个人作品展';
        } else if (id === '2') {
            title = '优秀团体作品展';
        } else if (id === '3') {
            title = '优秀才艺达人作品展';
        }
        console.log(title);

        uni.setNavigationBarTitle({
            title,
        });
    },
};
</script>

<style lang="less">
.page-work-list {
    overflow: hidden;
}

.main {
    white-space: pre-wrap;
    margin-top: 100upx;
    padding: 40upx 30upx;
    margin-right: -35upx;

    .comp-work {
        margin-right: 30upx;
        margin-bottom: 40upx;
    }

    .blank-wrap {
        margin-top: 300upx;
    }
}

.dropdown-wrap {
    position: fixed;
    width: 100%;
    top: calc(100upx + var(--window-top));
    height: calc(100% - 100upx - var(--window-top) - var(--window-bottom));
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

            &.sep {
                border-left: 1px solid #ddd;
            }
        }
    }

    .scroll-view {
        height: 100%;
    }

    .menu-list {
        text-align: center;
        padding-bottom: 20upx;
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
    top: calc(var(--window-top));
    width: 100%;
    z-index: 1000;
    box-shadow: 0 0 8upx 0 rgba(0, 0, 0, 0.05);

    .tab-bar {
        display: flex;
        background: #fff;
    }

    .tab-item {
        flex: 1;
        line-height: 100upx;
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
