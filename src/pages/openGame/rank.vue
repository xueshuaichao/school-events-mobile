<template>
    <view
        class="rank-page"
        :class="{ 'stop-scroll': showMenu }"
    >
        <!--筛选条件-->
        <view class="filter-wrap">
            <view class="filter-btn-block">
                <view
                    :class="
                        showMenuType === 1 && showMenu
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(1)"
                >
                    <view class="arror" />
                    {{ filterLabel.cat_label }}
                </view>
            </view>
            <view class="filter-btn-block">
                <view
                    :class="
                        showMenuType === 2 && showMenu
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(2)"
                >
                    <view class="arror" />
                    {{ filterLabel.education_label }}
                </view>
            </view>
            <view class="filter-btn-block">
                <view
                    :class="
                        showMenuType === 3 && showMenu
                            ? 'txt-marker active'
                            : 'txt-marker'
                    "
                    @click="clickMenu(3)"
                >
                    <view class="arror" />
                    {{
                        filterLabel.county_label
                            ? filterLabel.county_label
                            : filterLabel.city_label
                    }}
                </view>
            </view>
        </view>
        <!--下拉选择-->
        <view
            v-if="showMenu"
            class="dropdown-wrap clearfix"
            @click.prevent="cancel"
            @touchmove.stop.prevent="moveHandle"
        >
            <view
                class="dropdown"
                :class="[
                    { dropdown1: showMenuType === 1 },
                    { dropdown2: showMenuType === 2 },
                    { dropdown3: showMenuType === 3 }
                ]"
            >
                <view
                    v-if="showMenuType === 1"
                    class="rows"
                >
                    <view class="cols-box">
                        <view
                            v-for="item in projectList"
                            :key="item.cat_id"
                            class="cols"
                            :class="{ active: item.cat_id === filter.cat_id }"
                            @click.stop="selProject(item)"
                        >
                            {{ item.cat_name }}
                        </view>
                    </view>
                </view>
                <view
                    v-if="showMenuType === 2"
                    class="rows"
                >
                    <view
                        v-for="item in educationData"
                        :key="item.id"
                        class="cols"
                        :class="{ active: item.id === filter.education_level }"
                        @click.stop="selEducate(item)"
                    >
                        {{ item.label }}
                    </view>
                </view>
                <view
                    v-if="showMenuType === 3"
                    class="rows clearfix"
                >
                    <view class="cols-box cols-box1 fl-l">
                        <view
                            class="cols"
                            :class="{ active: filter.city_id === 0 }"
                            @click.stop="selCity"
                        >
                            全部
                        </view>
                        <view
                            v-for="(item, index) in cityData[0]"
                            :key="item.value"
                            class="cols"
                            :class="{
                                active: item.value + '00' === filter.city_id
                            }"
                            @click.stop="selCity(item, index)"
                        >
                            {{ item.label }}
                        </view>
                    </view>
                    <scroll-view
                        scroll-y
                        :style="{ height: '780rpx' }"
                        class="fl-l"
                    >
                        <view
                            v-if="curCityIndex !== -1"
                            class="cols"
                            :class="{ active: filter.county_id === 0 }"
                            @click.stop="selArea"
                        >
                            全部
                        </view>
                        <view
                            v-for="item in areaData[0][curCityIndex]"
                            :key="item.value"
                            class="cols"
                            :class="{
                                active: item.value === filter.county_id
                            }"
                            @click.stop="selArea(item)"
                        >
                            {{ item.label }}
                        </view>
                    </scroll-view>
                </view>
                <view
                    v-if="showMenuType === 3"
                    class="clearfix"
                >
                    <view
                        class="fl-r btn btn-primy"
                        @click="confirm"
                    >
                        确定
                    </view>
                    <view
                        class="fl-r btn"
                        @click="cancel"
                    >
                        取消
                    </view>
                </view>
            </view>
        </view>
        <!--排行榜-->
        <view class="content-list">
            <view class="top">
                {{ filterLabel.cat_label }}
            </view>
            <view class="rank-item-title rank-item clearfix">
                <view class="rank-num fl-l">
                    排名
                </view>
                <view class="fl-l rank-name">
                    姓名
                </view>
                <view class="fl-l school-info">
                    学校名称
                </view>
                <view class="fl-r rank-achieve">
                    成绩
                </view>
            </view>
            <template v-for="(item, index) in rankList">
                <view
                    :key="index"
                    class="rank-item rank-item-bar clearfix"
                >
                    <view class="rank-num rank-num-img fl-l">
                        <template v-if="index < 3">
                            <image
                                :src="
                                    `/static/images/zhibo/rank-${index + 1}.png`
                                "
                            />
                        </template>
                        <template v-else>
                            {{ index + 1 }}
                        </template>
                    </view>
                    <view class="fl-l rank-name text-one-line">
                        {{ item.name }}
                    </view>
                    <view class="class-info fl-l text-one-line">
                        {{ item.school }}
                    </view>
                    <view class="fl-r rank-achieve text-one-line">
                        {{ item.achievement }}{{ item.achievement_unit }}
                    </view>
                </view>
            </template>
            <view
                v-if="loading && !rankList.length"
                class="no-data"
            >
                暂无数据
            </view>
        </view>
    </view>
</template>
<script>
/* eslint-disable */
// import provinceData from "./simple-address/city-data/province";
import cityData from "./simple-address/city-data/city";
import areaData from "./simple-address/city-data/area";
import api from "../../common/api";
export default {
    data() {
        return {
            rankList: [],
            showMenu: false,
            showMenuType: 0,
            projectList: [],
            educationData: [
                { label: "小学", id: 2 },
                { label: "初中", id: 3 }
            ],
            curCityIndex: -1,
            areaData,
            cityData,
            filter: {
                city_id: 0,
                education_level: 2,
                county_id: 0,
                cat_id: 0
            },
            filterLabel: {
                cat_label: "",
                education_label: "小学",
                city_label: "",
                county_label: "全部",
                old_city_id: 0,
                old_city_label: "",
                old_county_id: 0,
                old_county_label: "全部"
            },
            loading: false
        };
    },
    methods: {
        selEducate(item) {
            this.filterLabel.education_label = item.label;
            this.filter.education_level = item.id;
            this.showMenu = false;
            this.getData();
        },
        selProject(item) {
            this.filterLabel.cat_label = item.cat_name;
            this.filter.cat_id = item.cat_id;
            this.getData();
        },
        selCity(item, index) {
            if (!item.label) {
                this.filter.city_id = 0;
                this.filter.county_id = 0;
                this.curCityIndex = -1;
                this.filterLabel.city_label = "全部";
                this.filterLabel.county_label = "";
            } else {
                if (this.filter.city_id !== item.value) {
                    this.filter.county_id = 0;
                }
                this.filter.city_id = item.value + "00";
                this.curCityIndex = index;
                this.filterLabel.city_label = item.label;
                this.filterLabel.county_label = "";
            }
        },
        selArea(item) {
            if (!item.label) {
                this.filter.county_id = 0;
                this.filterLabel.county_label = "";
            } else {
                this.filterLabel.county_label = item.label;
                this.filter.county_id = item.value;
            }
        },
        clickMenu(type) {
            if (this.showMenu & (this.showMenuType === type)) {
                this.showMenu = false;
            } else {
                this.showMenu = true;
                this.showMenuType = type;
            }
        },
        getData() {
            this.showMenu = false;
            this.loading = false;
            api.post("/api/works/resourcerank", this.filter).then(data => {
                this.rankList = data;
                uni.hideLoading();
                this.loading = true;
            });
        },
        clickWrap() {
            console.log("wqqw");
        },
        confirm() {
            this.filterLabel.old_county_id = this.filter.county_id;
            this.filterLabel.old_county_label = this.filterLabel.county_label;
            this.filterLabel.old_city_id = this.filter.city_id;
            this.filterLabel.old_city_label = this.filterLabel.city_label;
            this.getData();
        },
        cancel() {
            this.filter.county_id = this.filterLabel.old_county_id;
            this.filterLabel.county_label = this.filterLabel.old_county_label;
            this.filter.city_id = this.filterLabel.old_city_id;
            this.filterLabel.city_label = this.filterLabel.old_city_label;
            console.log(this.filterLabel, "cancel-----");
            this.showMenu = false;
        },
        moveHandle() {}
    },
    onLoad(query) {
        const { type } = query;
        api.post("/api/works/getnewcategory", { cid: Number(type) }).then(
            data => {
                this.projectList = data;
                this.filter.cat_id = data[0].cat_id;
                this.filterLabel.cat_label = data[0].cat_name;
                this.getData();
            }
        );
    },
    onShareAppMessage(res) {
        if (res.from === "button") {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: "世界吉尼斯青少年“爱挑战”网络预选赛",
            path: "/pages/openGame/index"
        };
    }
};
</script>
<style scoped lang="less">
.text-one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.rank-page {
    background: #34349c;
    padding: 30upx;
    height: 100vh;
    box-sizing: border-box;
    overflow-x: hidden;
    .filter-wrap {
        text-align: center;
        overflow: hidden;
        .filter-btn-block {
            background: url("../../static/images/zhibo/toggleBtn-bg.png");
            width: 223upx;
            height: 116upx;
            background-size: 100% 100%;
            margin-right: 12upx;
            float: left;
            position: relative;
            &:nth-child(3) {
                margin-right: 0;
            }
            .txt-marker {
                height: 64upx;
                font-size: 32upx;
                text-align: center;
                line-height: 64upx;
                color: #000;
                background: #fff;
                position: absolute;
                top: 3upx;
                left: 3upx;
                right: 22upx;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                position: relative;
                padding-right: 20upx;
                box-sizing: border-box;
                width: 200upx;
                color: #9f1ff3;
                .arror {
                    position: absolute;
                    width: 20upx;
                    height: 20upx;
                    right: 10upx;
                    top: 50%;
                    margin-top: -10upx;
                    &::before,
                    &::after {
                        content: "";
                        position: absolute;
                        display: block;
                        width: 15upx;
                        height: 4upx;
                        background: #777;
                        border-radius: 2upx;
                    }
                    &::before {
                        bottom: 8upx;
                        left: 0;
                        transform: rotate(-40deg);
                    }
                    &::after {
                        bottom: 8upx;
                        right: -2upx;
                        transform: rotate(40deg);
                    }
                }
            }
            .active {
                background: #9f1ff3;
                color: #fff;
                .arror {
                    transform: rotate(180deg);
                    &::before,
                    &::after {
                        background: #fff;
                    }
                }
            }
        }
    }
    .no-data {
        line-height: 160upx;
        text-align: center;
        font-size: 28upx;
    }
    .dropdown-wrap {
        position: fixed;
        top: 102upx;
        z-index: 100;
        width: 100%;
        left: 0;
        height: calc(100% - 102upx - var(--window-bottom));
        background: rgba(0, 0, 0, 0.3);
        .dropdown {
            border: 2upx solid rgba(84, 8, 68, 1);
            // padding: 20upx 0;
            width: 452upx;
            background: #fff;
        }
        .dropdown1 {
            margin-left: 30upx;
        }
        .dropdown2 {
            width: 200upx;
            margin-left: 264upx;
        }
        .dropdown3 {
            margin-left: 292upx;
            width: 404upx;
            .rows {
                padding: 0;
            }
        }
        .rows {
            padding: 20upx 0;
            .cols-box {
                max-height: 780upx;
                overflow-y: auto;
                margin-bottom: 20upx;
            }
            .fl-l {
                width: 200upx;
                padding: 20upx 0;
                .cols {
                    padding: 0 58upx;
                }
            }
            .cols-box1 {
                background: #faf4ff;
                border-right: 2upx solid #faf4ff;
            }
            .cols {
                line-height: 70upx;
                font-size: 28upx;
                padding: 0 30upx;
                box-sizing: border-box;
                &.active {
                    background: #9f1ff3;
                    color: #fff;
                }
            }
        }

        .btn {
            width: 160upx;
            height: 70upx;
            border: 2upx solid #9f1ff3;
            color: #9f1ff3;
            font-size: 28upx;
            text-align: center;
            line-height: 70upx;
            margin-top: 20upx;
        }
        .btn-primy {
            background: #9f1ff3;
            color: #fff;
            margin: 20upx;
        }
    }
    .content-list {
        position: relative;
        background: #fff;
        width: 672upx;
        padding: 30upx 24upx;
        box-sizing: border-box;
        min-height: 400upx;
        &::before {
            position: absolute;
            right: -18upx;
            top: 0;
            content: "";
            width: 18upx;
            height: 100%;
            background: #7c7cde;
            transform: skewY(45deg);
            margin-top: 9upx;
        }
        &::after {
            position: absolute;
            bottom: -18upx;
            left: 0;
            content: "";
            width: 100%;
            height: 18upx;
            background: #5151c6;
            transform: skewX(45deg);
            margin-left: 9upx;
        }
        .top {
            color: #333;
            font-weight: 600;
            font-size: 28upx;
            line-height: 60upx;
            margin-bottom: 20upx;
        }
        .rank-item-title {
            height: 54upx;
            line-height: 54upx;
            background: #faf4ff;
            color: #666;
        }
        .rank-item-bar {
            height: 80upx;
            color: #999;
            line-height: 80upx;
            padding: 0 10upx;
            border-bottom: 1px solid #cdcdcd;
        }
        .rank-item {
            font-size: 24upx;
            .rank-num {
                height: 100%;
                width: 80upx;
                text-align: center;
                position: relative;
                margin-right: 10upx;
                &.rank-num-img {
                    width: 50upx;
                    margin-right: 30upx;
                }
                image {
                    width: 34upx;
                    height: 42upx;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    margin-top: -22upx;
                    margin-left: -17upx;
                }
            }
            .rank-name {
                width: 100upx;
                margin-right: 10upx;
            }
            .class-info {
                width: 300upx;
            }
            .rank-achieve {
                width: 100upx;
            }
        }
    }
}
.stop-scroll {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
