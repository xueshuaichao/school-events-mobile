<template>
    <cover-view
        v-if="showDraw"
        class="topic-drawer-box"
        @click="clickWrap"
    >
        <view
            class="topic-drawer"
            :animation="animationData"
            @click.stop.prevent="clickNull"
        >
            <view> {{ total }} 条评论 </view>
            <scroll-view
                scroll-y
                :style="{ height: drawerHeight - 100 + 'px' }"
                class="scroll-context"
                refresher-enabled="true"
                :refresher-triggered="triggered"
                :refresher-threshold="100"
                @refresherpulling="onPulling"
                @refresherrefresh="onRefresh"
                @refresherrestore="onRestore"
                @refresherabort="onAbort"
            >
                <view
                    v-if="loading && !lists.length"
                    class="no-data"
                >
                    暂无评论，快来留下你的精彩评论吧～
                </view>
                <view
                    v-for="(item, index) in lists"
                    :key="index"
                    class="item"
                >
                    {{ item }}
                </view>
            </scroll-view>
            <view class="message-add">
                <input
                    v-model="changeVal"
                    type="text"
                    placeholder="写评论"
                    maxlength="40"
                    @confirm="bindconfirm"
                >
            </view>
        </view>
    </cover-view>
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
    },
    data() {
        return {
            lists: [1, 2, 3, 4, 5, 5, 6, 5, 7, 8, 8, 8, 8, 21, 121, 121],
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
                topic_id: this.pageData.id,
            },
            total: 0,
            list: [],
            loading: false,
            triggered: false,
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
                }, 500);
            }
        },
        pageData() {
            // 作品切换。
            this.filter.topic_id = this.pageData.id;
            this.filter.page_num = 1;
            this.loading = false;
            this.getList();
        },
    },
    created() {
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
                that.drawerHeight = res.screenHeight * 0.6;
            },
            fail() {
                that.drawerHeight = 320;
            },
        });

        this.getList();

        this.freshing2 = false;
        setTimeout(() => {
            this.triggered = true;
        }, 1000);
    },
    methods: {
        showing() {
            this.animation.bottom('0').step({ duration: 300 });
            this.animationData = this.animation.export();
        },
        hide() {
            this.animation.bottom('-60%').step({ duration: 300 });
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
                    if (this.filter.page_num === 1) {
                        this.list = list;
                    } else {
                        this.list = this.list.concat(list);
                    }
                },
            );
        },
        bindconfirm() {
            if (this.changeVal.trim()) {
                api.post('/api/comment/add', {
                    content: this.changeVal.trim(),
                    topic_type: 1,
                    topic_id: this.pageData.id,
                    comment_type: 1,
                }).then(() => {
                    uni.showToast({
                        title: '已提交',
                        icon: 'none',
                    });
                    this.getList();
                });
            }
        },
        onPulling(e) {
            console.log('onpulling', e);
        },
        onRefresh() {
            if (this.freshing2) return;
            this.freshing2 = true;
            setTimeout(() => {
                this.triggered = false;
                this.freshing2 = false;
            }, 3000);
        },
        onRestore() {
            this.triggered = 'restore'; // 需要重置
            console.log('onRestore');
        },
        onAbort() {
            console.log('onAbort');
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
    .topic-drawer {
        width: 100%;
        height: 60vh;
        position: absolute;
        bottom: -60vh;
        background: #fff;
        border-radius: 16rpx 16rpx 0 0;
        z-index: 100;

        .scroll-context {
            .no-data {
                font-size: 28rpx;
                line-height: 300rpx;
                color: #5e6166;
                text-align: center;
            }
            .item {
                height: 100rpx;
            }
        }
    }
}
</style>
