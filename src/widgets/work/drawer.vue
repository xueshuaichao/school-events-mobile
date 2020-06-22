<template>
    <view
        v-if="showDraw"
        class="topic-drawer-box"
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
            @click.stop.prevent="clickNull"
        >
            <view
                class="close"
                @click="clickWrap"
            />
            <view class="all-num">
                {{ total > 99 ? "99+" : total }} 条评论
            </view>
            <scroll-view
                scroll-y
                :style="{ height: drawerHeight + 'px' }"
                class="scroll-context"
                @scrolltoupper="toUpper"
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
                        v-for="item in list"
                        :key="item.comment_id"
                        class="item-wrap"
                        @click.prevent="clickItem(item)"
                    >
                        <view class="item">
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
                        <template v-if="item.sub_count">
                            <view
                                class="to-open show-or-hide"
                                @click.stop="getMoreSubList(item)"
                            >
                                — 展开{{ item.sub_count }}条回复 —
                            </view>
                        </template>
                        <template v-if="item.show">
                            <view
                                v-for="subItem in subList"
                                :key="subItem.comment_id"
                                class="sub-item item"
                                @click.stop="clickItem(subItem)"
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
                                            <template
                                                v-if="subItem.to_user_name"
                                            >
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
                        </template>
                    </view>
                </template>
            </scroll-view>
            <view
                class="message-add clearfix"
                :class="{ absolute: showKeybord }"
                :style="{ top: (showKeybord ? inputTop : 0) + 'px' }"
            >
                <view class="add-ctx fl-l">
                    <image
                        src="/static/images/work/write.png"
                        class="write-icon"
                        @click="bindconfirm"
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
                    v-if="showKeybord"
                    class="fabu fl-r"
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
            },
            subFilter: {
                page_num: 1,
                page_size: 10,
                topic_type: 3,
                topic_id: this.pageData.resource_id,
                to_comment_id: 0,
            },
            total: 0,
            list: [],
            loading: false,
            isH5: false,
            showKeybord: false,
            inputTop: 100,
            pix: 1,
            isFocus: false,
            markerheight: 100,
            screenHeight: 0,
            hasLogin: false,
            hasKeybordEnterUp: false,
            placeholder: '写评论',
            addObj: {},
            subList: [],
        };
    },
    watch: {
        show(val) {
            const that = this;
            if (val) {
                that.showDraw = true;
                this.showing();
            } else {
                this.hide();
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
                that.drawerHeight = res.windowHeight * 0.74 - that.pix * 220;
            },
            fail() {
                that.drawerHeight = 320;
            },
        });

        this.getList();
    },
    methods: {
        onFoucs(e) {
            this.isFocus = true;
            if (!this.isH5) {
                this.showKeybord = true;
                if (!this.hasKeybordEnterUp) {
                    e.detail.height = e.detail.height || 180;
                    this.inputTop = this.screenHeight * 0.74
                        - e.detail.height
                        - this.pix * 130;
                    this.markerheight = this.screenHeight - e.detail.height - this.pix * 130;
                    this.hasKeybordEnterUp = true;
                }
            }
        },
        blur() {
            this.changeVal = '';
            this.showKeybord = false;
            this.isFocus = false;
        },
        showing() {
            this.animation.bottom('0').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        hide() {
            this.animation.bottom('-74%').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        clickWrap() {
            this.$emit('doAction', 'showMessage');
        },
        clickNull() {},
        clickItem(item) {
            console.log('clickItem-----');
            this.placeholder = `回复@${item.user_info.name}`;
            this.isFocus = true;
            this.addObj = {
                to_user_id: item.from_user_id,
                to_comment_id: item.comment_id,
            };
        },
        getMoreSubList(item) {
            this.subFilter.to_comment_id = item.comment_id;
            // 展开评论
            this.list = this.list.map((D) => {
                const d = D;
                d.show = false;
                if (d.comment_id === item.comment_id) d.show = true;
                return d;
            });
            // 获取分页下的列表
            api.post('/api/comment/list', this.subFilter).then(({ list }) => {
                const List = list.map((d) => {
                    const D = d;
                    D.created_at = D.created_at.slice(5, 16);
                    return D;
                });
                this.subList = List;
            });
        },
        getList() {
            api.post('/api/comment/list', this.filter).then(
                ({ list, total }) => {
                    this.loading = true;
                    this.total = total;
                    this.$emit('getcommentTotal', total);
                    let List = list;
                    List = List.map((d) => {
                        const D = d;
                        D.created_at = D.created_at.slice(5, 16);
                        return D;
                    });
                    if (this.filter.page_num === 1) {
                        this.list = List;
                    } else {
                        this.list = this.list.concat(List);
                    }
                },
            );
        },
        bindconfirm() {
            console.log('bindconfirm-----');
            this.showKeybord = false;
            this.isFocus = false;
            if (this.changeVal.trim()) {
                const content = this.changeVal.trim();
                if (this.isLogin) {
                    this.addComment(content);
                } else {
                    api.isLogin({
                        fr: this.fr,
                    }).then(
                        () => {
                            this.addComment(content);
                        },
                        () => uni.showToast({
                            icon: 'none',
                            title: '请先登录',
                        }),
                    );
                    this.changeVal = '';
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
                ...this.addObj,
            };
            console.log(params, 'add,,,,comment-----');
            api.post('/api/comment/add', params).then(() => {
                uni.showToast({
                    title: '已提交',
                    icon: 'none',
                });
                // this.loading = false;
                // this.changeVal = '';
                this.filter.page_num = 1;
                this.placeholder = '写评论';
                this.addObj = {};
                this.getList();
            });
        },
        toUpper() {
            this.filter.page_num = 1;
            this.getList();
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
    position: absolute;
    left: 0;
    top: 0;
    .marker {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        left: 0;
        width: 100%;
        z-index: 101;
    }
    .topic-drawer {
        padding: 30rpx 0;
        height: 74vh;
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
        }

        .scroll-context {
            margin-top: 20rpx;
            padding: 20rpx 30rpx;
            box-sizing: border-box;
            .no-data {
                font-size: 28rpx;
                line-height: 300rpx;
                color: #5e6166;
                text-align: center;
            }
            .item-wrap {
                margin-bottom: 40rpx;
                padding-right: 20rpx;
                .sub-item {
                    padding-left: 40rpx;
                    margin-bottom: 20rpx;
                }
                .item,
                .left {
                    display: flex;
                    justify-content: space-between;
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
                }
                .content {
                    font-size: 28rpx;
                    word-break: break-all;
                    color: #5e6166;
                    line-height: 40rpx;
                    width: 368rpx;
                    .bold {
                        color: #303133;
                        margin: 0 4rpx;
                    }
                }

                .right {
                    font-size: 24rpx;
                    color: #8d9199;
                    line-height: 36rpx;
                }
                .show-or-hide {
                    color: #b0b5bf;
                    font-size: 28rpx;
                }
                .to-open {
                    text-align: center;
                }
            }
        }

        .message-add {
            padding: 0 30rpx;
            position: relative;
            top: 0;
            background: #fff;
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
            }

            .fabu {
                color: #2f3033;
                font-size: 28rpx;
                line-height: 80rpx;
                margin-left: 14rpx;
            }

            input {
                height: 100%;
                border: none;
                width: 100%;
                padding-left: 70rpx;
                box-sizing: border-box;
            }
            &.absolute {
                position: absolute;
                left: 30rpx;
                padding: 30rpx;
                .add-ctx {
                    width: 560rpx;
                }
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
