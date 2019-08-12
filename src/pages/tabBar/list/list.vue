<template>
    <view class="content">
        <view>
            <div
                class="tab-bar-wrap"
                @click="toggleMenu"
            >
                <view class="tab-bar">
                    <view class="tab-item">
                        <text>学校</text>
                    </view>
                    <view class="tab-item">
                        <text>组别</text>
                    </view>
                    <view class="tab-item">
                        <text>分类</text>
                    </view>
                    <view class="tab-item">
                        <text>排序</text>
                    </view>
                </view>
            </div>
            <div class="dropdown-wrap">
                <view
                    v-if="showMenu"
                    class="dropdown animated slideInDown faster"
                    :class="hiddingMenu ? 'slideOutUp' : ''"
                >
                    hello
                </view>
            </div>

            <view class="main">
                1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            title: '作品展示',
            showMenu: false,
            hiddingMenu: false,
        };
    },
    onLoad() {},
    methods: {
        toggleMenu() {
            if (this.showMenu) {
                this.hiddingMenu = true;
                setTimeout(() => {
                    this.hiddingMenu = false;
                    this.showMenu = false;
                }, 300);
                console.log('hide menu');
            } else {
                this.showMenu = true;
                console.log('show menu');
            }
        },
    },
};
</script>

<style lang="less">
.main {
    height: 2000upx;
    background: red;
    white-space: pre-wrap;
    margin-top: 100upx;
}

.dropdown-wrap {
    position: fixed;
    width: 100%;
    top: calc(100upx + var(--window-top));

    .dropdown {
        height: 400upx;
        background: blue;
    }
}

.tab-bar-wrap {
    position: fixed;
    top: calc(var(--window-top));
    width: 100%;
    z-index: 1000;

    .tab-bar {
        display: flex;
        background: #fff;
    }

    .tab-item {
        flex: 1;
        line-height: 100upx;
        text-align: center;
    }
}
</style>
