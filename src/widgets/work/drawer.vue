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
                {{ total }} 条评论
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
                        v-for="(item, index) in list"
                        :key="index"
                        class="item clearfix"
                    >
                        <view class="img-box fl-l">
                            <image
                                :src="
                                    item.user_info.avatar_url ||
                                        '/static/images/uc/avatar.png'
                                "
                            />
                        </view>
                        <view class="center fl-l">
                            <view class="name">
                                {{ item.user_info.name }}
                            </view>
                            <view class="content">
                                {{ item.content }}
                            </view>
                        </view>
                        <view class="right fl-r">
                            {{ item.created_at }}
                        </view>
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
                        placeholder="写评论"
                        maxlength="40"
                        :adjust-position="false"
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
            if (!this.isH5) {
                this.showKeybord = true;
                e.detail.height = e.detail.height || 180;
                this.inputTop = this.screenHeight * 0.74 - e.detail.height - this.pix * 130;
                this.markerheight = this.screenHeight - e.detail.height - this.pix * 130;
            }
        },
        blur() {
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
            this.showKeybord = false;
            if (this.changeVal.trim()) {
                const content = this.changeVal.trim();
                api.isLogin({
                    fr: this.fr,
                }).then(
                    () => {
                        api.post('/api/comment/add', {
                            content,
                            topic_type: 3,
                            topic_id: this.pageData.resource_id,
                            comment_type: 1,
                        }).then(() => {
                            uni.showToast({
                                title: '已提交',
                                icon: 'none',
                            });
                            this.loading = false;
                            // this.changeVal = '';
                            this.filter.page_num = 1;
                            this.getList();
                        });
                    },
                    () => uni.showToast({
                        icon: 'none',
                        title: '请先登录',
                    }),
                );
                this.changeVal = '';
            }
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
            .item {
                margin: 20rpx 0;
                padding-right: 20rpx;
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
                }

                .right {
                    font-size: 24rpx;
                    color: #8d9199;
                    line-height: 36rpx;
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
