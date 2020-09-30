<template>
    <view
        v-if="showDraw"
        class="topic-drawer-box"
        :class="{ 'h5-main': isH5 }"
        @click="clickWrap"
    >
        <view
            v-if="showKeybord"
            class="marker"
            :style="{ height: markerheight + 'px' }"
        />
        <view
            class="topic-drawer"
            :animation="animationData"
            :style="{ height: pannelHeight + 'px' }"
            @click.stop.prevent="clickNull"
        >
            <view
                class="close"
                @click="clickWrap"
            />
            <view class="all-num">
                {{ allNum > 99 ? "99+" : allNum }} 条评论
            </view>
            <scroll-view
                scroll-y
                :style="{
                    height: drawerHeight + 'px',
                    overflow: isAuto ? 'hidden auto' : ''
                }"
                class="scroll-context"
                @scrolltolower="toLower"
            >
                <view
                    v-if="loading && !list.length"
                    class="no-data"
                >
                    暂无评论，快来留下你的精彩评论吧～
                </view>
                <template v-if="loading && list.length">
                    <view
                        v-for="(item, idx) in list"
                        :key="item.comment_id"
                        class="item-wrap"
                        :class="{ 'no-margin': item.sub_count }"
                        @click.prevent="clickItem(item)"
                    >
                        <view class="item father-item">
                            <view class="left">
                                <view class="img-box">
                                    <image
                                        :src="
                                            item.user_info.avatar_url ||
                                                '/static/images/uc/avatar.png'
                                        "
                                    />
                                </view>
                                <view>
                                    <view class="name">
                                        {{ item.user_info.name }}
                                    </view>
                                    <view class="content">
                                        {{ item.content }}
                                    </view>
                                </view>
                            </view>
                            <view class="right">
                                {{ item.created_at }}
                            </view>
                        </view>
                        <view
                            v-for="(subItem, index) in item.subListCache"
                            :key="subItem.comment_id"
                            :style="item.show ? '' : 'display:none;'"
                            :data-index="index"
                            class="sub-item item"
                            @click.stop="clickItem(item, subItem)"
                        >
                            <view class="left">
                                <view class="img-box">
                                    <image
                                        :src="
                                            subItem.user_info.avatar_url ||
                                                '/static/images/uc/avatar.png'
                                        "
                                    />
                                </view>
                                <view>
                                    <view class="name">
                                        {{ subItem.user_info.name }}
                                    </view>
                                    <view class="content">
                                        <template v-if="subItem.to_user_name">
                                            回复
                                            <text class="bold">
                                                {{ subItem.to_user_name }}
                                            </text>
                                        </template>
                                        {{ subItem.content }}
                                    </view>
                                </view>
                            </view>
                            <view class="right">
                                {{ subItem.created_at }}
                            </view>
                        </view>

                        <template v-if="item.sub_count && !item.show">
                            <view
                                :id="'more' + idx"
                                class="show-or-hide"
                                @click.stop="getMoreSubList(item)"
                            >
                                — 展开{{ item.sub_count }}条回复 —
                            </view>
                        </template>
                        <template v-if="item.show && showCloseItem(item)">
                            <view
                                class="show-or-hide"
                                @click.stop="closeSubList(item, idx)"
                            >
                                — 收起 —
                            </view>
                        </template>
                        <template v-if="openSubItem(item) && item.show">
                            <view
                                class="show-or-hide"
                                @click.stop="getMoreSubList(item, 'more')"
                            >
                                — 展开更多回复 —
                            </view>
                        </template>
                    </view>
                    <template
                        v-if="
                            total === list.length && loading && list.length > 10
                        "
                    >
                        <view class="show-or-hide">
                            ～我是有底线的～
                        </view>
                    </template>
                </template>
            </scroll-view>
            <view
                class="message-add"
                :class="{ absolute: showKeybord }"
                :style="{ top: (showKeybord ? inputTop : 0) + 'px' }"
            >
                <view
                    class="add-ctx"
                    :class="{ short: isFocus }"
                >
                    <image
                        src="/static/images/work/write.png"
                        class="write-icon"
                    />
                    <input
                        v-model="changeVal"
                        type="text"
                        :placeholder="placeholder"
                        maxlength="40"
                        :adjust-position="false"
                        :focus="isFocus"
                        @blur="blur"
                        @focus="onFoucs"
                        @confirm="bindconfirm"
                    >
                </view>
                <view
                    v-if="isFocus"
                    class="fabu"
                    :class="{ disable: !changeVal }"
                    @click="bindconfirm"
                >
                    发布
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import api from '../../common/api';

export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        pageData: {
            type: Object,
            default: () => {},
        },
        fr: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            animationData: {},
            animation: {},
            showDraw: false,
            drawerHeight: 0,
            changeVal: '',
            filter: {
                page_num: 1,
                page_size: 10,
                topic_type: 3,
                // comment_type: 1,
                topic_id: this.pageData.resource_id,
                last_id: 0,
            },
            subFilter: {
                page_num: 1,
                page_size: 10,
                topic_type: 3,
                topic_id: this.pageData.resource_id,
                to_comment_id: 0,
                last_id: 0,
            },
            total: 0,
            list: [],
            loading: false,
            isH5: false,
            showKeybord: false,
            inputTop: 100,
            pix: 1,
            isFocus: false,
            markerheight: 0,
            screenHeight: 0,
            hasLogin: false,
            hasKeybordEnterUp: false,
            placeholder: '写评论',
            addSubItemObj: {},
            allNum: 0,
            curItem: {
                comment_id: 0,
                content: '',
                from_user_id: 0,
                to_user_id: 0,
                to_user_name: '',
                user_info: {
                    create_user_class: '',
                    name: '',
                },
            },
            isAuto: true,
            pannelHeight: 0,
            isConfirm: false,
        };
    },
    watch: {
        show(val) {
            const that = this;
            if (val) {
                that.showDraw = true;
                this.showing();
                try {
                    const value = uni.getStorageSync('hasComment');
                    if (!value) {
                        uni.setStorageSync('hasComment', 'true');
                        uni.showToast({
                            title: '点击他人留言，可直接回复对方的评论哦！',
                            duration: 2000,
                            position: 'top',
                            mask: true,
                            icon: 'none',
                        });
                    }
                } catch (e) {
                    // error
                }
            } else {
                this.hide();
                this.resetInitVal();
                setTimeout(() => {
                    that.showDraw = false;
                }, 300);
            }
        },
        pageData() {
            // 作品切换。
            this.filter.topic_id = this.pageData.resource_id;
            this.filter.page_num = 1;
            this.loading = false;
            this.filter.last_id = 0;
            this.subFilter.last_id = 0;
            this.subFilter.to_comment_id = 0;
            this.subFilter.topic_id = this.pageData.resource_id;
            this.resetInitVal();
            this.list = [];
            this.getList();
        },
    },
    created() {
        // #ifdef H5
        this.isH5 = true;
        // #endif
        const animation = uni.createAnimation({
            duration: 1000,
            timingFunction: 'linear',
            delay: 0,
        });
        this.animation = animation;
        this.animationData = this.animation.export();

        const that = this;
        uni.getSystemInfo({
            success(res) {
                that.pix = res.screenWidth / 750;
                that.screenHeight = res.windowHeight;
                that.drawerHeight = res.windowHeight * 0.7 - that.pix * 250;
                that.pannelHeight = res.windowHeight * 0.7;
            },
            fail() {
                that.drawerHeight = 320;
            },
        });
        this.getUserDate();
        this.getList();
    },
    methods: {
        onFoucs(e) {
            this.isFocus = true;
            if (!this.isH5) {
                this.showKeybord = true;
                if (!this.hasKeybordEnterUp) {
                    e.detail.height = e.detail.height || 180;
                    this.inputTop = this.screenHeight * 0.7
                        - e.detail.height
                        - this.pix * 130;
                    this.markerheight = this.screenHeight - e.detail.height - this.pix * 130;
                    this.hasKeybordEnterUp = true;
                }
            }
        },
        showing() {
            this.animation.bottom('0').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        hide() {
            this.animation.bottom('-70%').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        clickWrap() {
            this.$emit('doAction', 'showMessage');
        },
        clickNull() {},
        clickItem(item, subItem) {
            this.changeVal = '';
            if (!this.isFocus) {
                this.placeholder = `回复@${
                    subItem ? subItem.user_info.name : item.user_info.name
                }`;
                this.isFocus = true;
                this.addSubItemObj = {
                    to_user_id: subItem ? subItem.from_user_id : 0,
                    to_comment_id: item.comment_id,
                };
                this.curItem.to_user_id = this.addSubItemObj.to_user_id;
                this.curItem.to_user_name = subItem
                    ? subItem.user_info.name
                    : '';
            }
        },
        getUserDate() {
            // 获取用户信息
            return api.get('/api/user/info').then((data) => {
                this.curItem.user_info.avatar_url = data.user_info.avatar_url;
                this.curItem.user_info.name = data.user_info.name;
                this.curItem.create_user_class = data.user_info.class_name;
                this.curItem.from_user_id = data.user_info.user_id;
            });
        },
        showCloseItem(item) {
            let show = false;
            if (
                item.subListCache.length
                && item.sub_count === item.subListCache.length
            ) {
                show = true;
            }
            return show;
        },
        openSubItem(item) {
            let show = false;
            if (
                item.subListCache.length
                && item.subListCache.length !== item.sub_count
            ) {
                show = true;
            }
            return show;
        },
        getMoreSubList(item, more) {
            // 展开更多，数据已经加载，不重复获取数据
            let List = [];

            // 获取更多的条件
            let getNew = false;
            if (
                item.subList.length === item.sub_add_count
                || !item.subList.length
            ) {
                getNew = true;
            } else if (
                item.sub_count > item.subList.length
                && item.sub_count - item.sub_add_count > 10
                && item.showCount >= 2
            ) {
                getNew = true;
            }

            if (getNew) {
                if (item.subList && item.subList.length) {
                    this.subFilter.last_id = item.subList[item.subList.length - 1].comment_id;
                } else {
                    this.subFilter.last_id = 0;
                }

                this.subFilter.to_comment_id = item.comment_id;
                this.subFilter.page_num = Math.floor(item.subList.length / 10) + 1;
                // 获取分页下的列表
                api.post('/api/comment/list', this.subFilter).then(
                    ({ list }) => {
                        List = list.map((d) => {
                            const D = d;
                            D.created_at = D.created_at.slice(5, 16);
                            return D;
                        });
                        this.openSublist(item, List, more);
                    },
                );
            } else {
                this.openSublist(item, List, more);
            }
        },
        openSublist(item, List, more) {
            // 展开评论
            this.list = this.list.map((D) => {
                const d = D;
                if (d.comment_id === item.comment_id) {
                    d.showCount += 1;
                    d.show = true;
                    if (more || d.subList.length) {
                        d.subList = d.subList.concat(List);
                    } else {
                        d.subList = List;
                    }
                    this.setCacheSublist(d);
                }
                return d;
            });
        },
        setCacheSublist(D) {
            const d = D;
            // 显示3条评论，显示10条评论,
            if (d.sub_count !== d.subListCache.length) {
                if (d.showCount === 0) {
                    if (d.subList.length) {
                        d.subListCache = d.subList.slice(0, D.sub_add_count);
                    } else {
                        d.subListCache = [];
                    }
                } else if (d.showCount === 1) {
                    d.subListCache = d.subList.slice(0, 3 + D.sub_add_count);
                } else if (d.showCount === 2) {
                    d.subListCache = d.subList.slice(0, 10 + D.sub_add_count);
                } else {
                    d.subListCache = d.subList.slice(
                        0,
                        (d.showCount - 1) * 10 + D.sub_add_count,
                    );
                }
            }
        },
        closeSubList(item) {
            this.list = this.list.map((D) => {
                const d = D;
                if (d.comment_id === item.comment_id) {
                    d.show = false;
                }
                return d;
            });
            this.isAuto = false;
            this.$nextTick(() => {
                this.isAuto = true;
            });
        },
        getList() {
            if (this.list.length) {
                this.filter.last_id = this.list[
                    this.list.length - 1
                ].comment_id;
            }
            api.post('/api/comment/list', this.filter).then((data) => {
                this.loading = true;
                this.total = data.total;
                this.allNum = data.all_num;
                this.$emit('getcommentTotal', this.allNum);
                let List = data.list;
                List = List.map((d) => {
                    const D = d;
                    D.created_at = D.created_at.slice(5, 16);
                    D.subList = [];
                    D.subListCache = [];
                    D.sub_add_count = 0;
                    D.show = false;
                    D.showCount = 0;
                    return D;
                });
                if (this.filter.page_num === 1) {
                    this.list = List;
                } else {
                    this.list = this.list.concat(List);
                }
            });
        },
        blur() {
            if (!this.isH5 && !this.isConfirm) {
                this.resetInitVal();
            }
        },
        bindconfirm() {
            this.showKeybord = false;
            this.isFocus = false;
            if (this.changeVal.trim()) {
                this.isConfirm = true;
                const content = this.changeVal.trim();
                if (this.hasLogin) {
                    this.addComment(content);
                } else {
                    api.isLogin({
                        fr: this.fr,
                    }).then(
                        () => {
                            this.hasLogin = true;
                            this.getUserDate().then(() => {
                                this.addComment(content);
                            });
                        },
                        () => uni.showToast({
                            icon: 'none',
                            title: '请先登录',
                        }),
                    );
                }
            } else {
                this.changeVal = '';
            }
        },
        addComment(content) {
            this.hasLogin = true;
            const params = {
                content,
                topic_type: 3,
                topic_id: this.pageData.resource_id,
                comment_type: 1,
                ...this.addSubItemObj,
            };
            api.post('/api/comment/add', params).then((id) => {
                uni.showToast({
                    title: '已提交',
                    icon: 'none',
                });

                this.setListData(id, content, params);
            });
        },
        setListData(id, content) {
            // 无刷新数据，更新列表。
            const date = new Date();
            let time = `${this.joinDate(date.getMonth() + 1)}-`;
            time += `${this.joinDate(date.getDate())} `;
            time += `${this.joinDate(date.getHours())}:`;
            time += `${this.joinDate(date.getMinutes())}`;
            const obj = {
                ...this.curItem,
                comment_id: id,
                sub_count: 0,
                created_at: time,
                content,
            };

            if (
                !Object.prototype.hasOwnProperty.call(
                    this.addSubItemObj,
                    'to_comment_id',
                )
            ) {
                obj.subList = [];
                obj.subListCache = [];
                obj.show = false;
                obj.showCount = 0;
                obj.sub_add_count = 0;
                this.list.unshift(obj);
                this.total += 1;
            } else {
                this.list = this.list.map((D) => {
                    const d = D;
                    if (this.addSubItemObj.to_comment_id === d.comment_id) {
                        if (d.sub_count) {
                            d.sub_count += 1;
                            d.subList.unshift(obj);
                        } else {
                            d.subList = [obj];
                            d.sub_count = 1;
                        }
                        d.sub_add_count += 1;
                        d.show = true;
                        this.setCacheSublist(d);
                    }
                    return d;
                });
            }
            this.allNum += 1;
            this.$emit('getcommentTotal', this.allNum);
            this.resetInitVal();
        },
        joinDate(time) {
            const Time = time < 10 ? `0${time}` : time;
            return Time;
        },
        resetInitVal() {
            console.log('reseting--------');
            // reset for init value;
            this.curItem.to_user_id = 0;
            this.curItem.to_user_name = '';
            this.addSubItemObj = {};
            this.filter.page_num = 1;
            this.placeholder = '写评论';
            this.showKeybord = false;
            this.isFocus = false;
            this.changeVal = '';
            this.isConfirm = false;
        },
        toLower() {
            if (this.filter.page_num * this.filter.page_size < this.total) {
                this.filter.page_num += 1;
                this.getList();
            }
        },
    },
};
</script>
<style scoped lang="less">
.topic-drawer-box {
    width: 100%;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    box-sizing: border-box;
    overflow: hidden;
    z-index: 21;
    &.h5-main {
        height: 100%;
    }
    .marker {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        left: 0;
        width: 100%;
        z-index: 101;
    }
    .topic-drawer {
        padding: 30rpx 0 0;
        width: 100%;
        box-sizing: border-box;
        position: absolute;
        bottom: -74vh;
        background: #fff;
        border-radius: 16rpx 16rpx 0 0;
        z-index: 100;
        .close {
            position: absolute;
            right: 52rpx;
            top: 20rpx;
            width: 40rpx;
            height: 40rpx;
        }
        .close::before,
        .close::after {
            content: "";
            display: block;
            position: absolute;
            width: 40rpx;
            height: 5rpx;
            background: #b0b5bf;
            border-radius: 3rpx;
        }
        .close::before {
            transform: rotate(45deg);
            right: 0;
            top: 20rpx;
        }
        .close::after {
            transform: rotate(-45deg);
            right: 0;
            top: 20rpx;
        }
        .all-num {
            text-align: center;
            color: #b0b5bf;
            font-size: 28rpx;
            line-height: 40rpx;
            padding-bottom: 40upx;
        }
        .scroll-context {
            padding: 20rpx 30rpx 30rpx;
            box-sizing: border-box;
            background: #fff;
            position: relative;
            // z-index: 200;
            .no-data {
                font-size: 28rpx;
                line-height: 100rpx;
                color: #5e6166;
                text-align: center;
            }
            .item-wrap {
                margin-bottom: 40rpx;
                padding-right: 20rpx;
                .sub-item {
                    padding-left: 40rpx;
                    margin-bottom: 20rpx;
                    margin-top: 20rpx;
                }
                // .father-item {
                //     background: pink;
                // }
                .item,
                .left {
                    display: flex;
                    justify-content: space-between;
                }
                &.no-margin {
                    margin-bottom: 0;
                }
                .img-box {
                    width: 72rpx;
                    height: 72rpx;
                    margin-right: 30rpx;
                    image {
                        width: 72rpx;
                        height: 72rpx;
                        border-radius: 50%;
                    }
                }
                .name {
                    color: #303133;
                    font-size: 30rpx;
                    line-height: 38rpx;
                    font-weight: 500;
                    word-break: break-all;
                    width: 350rpx;
                }
                .content {
                    font-size: 28rpx;
                    word-break: break-all;
                    color: #5e6166;
                    line-height: 40rpx;
                    width: 368rpx;
                    .bold {
                        color: #333;
                        margin: 0 4rpx;
                        font-weight: 600;
                    }
                }

                .right {
                    font-size: 24rpx;
                    color: #8d9199;
                    line-height: 36rpx;
                }
            }
        }
        .show-or-hide {
            color: #b0b5bf;
            font-size: 28rpx;
            text-align: center;
            padding: 20rpx 0;
            line-height: 40rpx;
        }
        .message-add {
            padding: 30rpx;
            position: relative;
            top: 0;
            background: #fff;
            display: flex;
            justify-content: space-between;
            .add-ctx {
                background: #f0f0f2;
                border-radius: 40rpx;
                height: 80rpx;
                position: relative;
                width: 690rpx;
                .transparent {
                    background: transparent;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                }
                &.short {
                    width: 590rpx;
                }
            }

            .fabu {
                color: #2f3033;
                font-size: 28rpx;
                line-height: 80rpx;
                margin-left: 14rpx;
                &.disable {
                    color: #b0b5bf;
                }
            }

            input {
                height: 100%;
                border: none;
                width: 100%;
                padding-left: 70rpx;
                padding-right: 30rpx;
                box-sizing: border-box;
            }
            &.absolute {
                position: absolute;
                left: 30rpx;
                // z-index: 201;
            }
            .write-icon {
                width: 48rpx;
                height: 48rpx;
                position: absolute;
                left: 20rpx;
                top: 50%;
                margin-top: -24rpx;
            }
        }
    }
}
</style>
