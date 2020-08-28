<template>
    <view>
        <login
            v-if="userInfo === null && toLogin"
            @login="onLogin"
        />
        <template v-else>
            <!-- <view  class="btn-wrap">
                <button
                    class="btn"
                    @click="jumpRecord"
                >
                    录制页面
                </button>
                <button
                    class="btn"
                    @click="jumpVip"
                >
                    vip
                </button>
                <button
                    class="btn"
                    @click="jumpBgList"
                >
                    音乐列表
                </button>
            </view> -->
            <view class="page-top">
                <view class="user-info">
                    <view class="avator">
                        h
                    </view>
                    <view class="info">
                        我的等级： 小诗仙
                    </view>
                </view>
                <view
                    class="ucenter"
                    @click="confirmUcenter"
                >
                    我的作品
                </view>
            </view>
            <view class="main-data">
                <view
                    v-for="(item, index) in level"
                    :key="index"
                    class="level-row"
                    :class="{
                        one: index % 4 === 0,
                        two: index % 4 === 1,
                        three: index % 4 === 2,
                        four: index % 4 === 3
                    }"
                >
                    <view
                        v-for="key in item"
                        :key="key.k"
                        class="level-item"
                        @click="jumpAnster(key.k + 1)"
                    >
                        <image
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-${
                                    key.canPrize ? 1 : 2
                                }-${key.k + 1 < successLevel ? 0 : 1}.png`
                            "
                            class="card"
                        />
                        <view class="num">
                            {{ key.k + 1 }}
                        </view>
                    </view>
                </view>
            </view>
            <view class="fixed">
                <view class="prize">
                    抽奖啦
                </view>
                <view class="ucenter">
                    我的奖品
                </view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {
            maskPrompt: false,
            userInfo: null,
            toLogin: false,
            hasLogin: false,
            level: [],
            filter: {
                page_size: 32,
                page_num: 0,
            },
            loadMoreStatus: 'none',
            init: true,
            successLevel: 100,
        };
    },
    onShow() {
        this.getUserinfo();
        this.getlevel();
        this.getlevel();
    },
    onReachBottom() {
        if (this.loadMoreStatus === 'more') {
            this.filter.page_num = this.filter.page_num + 1;
            this.loadMoreStatus = 'loading';
            this.getlevel('reachBottom');
        }
    },
    methods: {
        getlevel(type) {
            const newResult = this.sliceData(
                this.filter.page_size,
                this.filter.page_num,
                4,
                500,
            );
            if (type === 'reachBottom') {
                this.level = this.level.concat(newResult);
            } else {
                this.level = newResult;
            }
        },
        sliceData(pageSize, pageNum, num, max) {
            // 每个小数组的个数  max 最大长度
            const rowNum = num;
            let size = pageSize;
            this.loadMoreStatus = 'more';
            if (max - pageSize * pageNum <= 0) {
                this.loadMoreStatus = 'noMore';
                return false;
            }
            if (max - pageSize * pageNum < pageSize) {
                // 判断为最后一页并确定最后一页生成的数量
                size = max - pageSize * pageNum;
            }

            let list = [];
            list = Array.from({ length: size }, (v, k) => {
                const K = k + pageSize * pageNum;
                let canPrize = k === 0 || k === 2 || k === 5;
                if (K > 5) {
                    canPrize = K % 5;
                }
                return {
                    canPrize,
                    k: K,
                };
            });
            console.log(list, 'list----');
            // 将数据拆成num个一组
            const result = [];
            for (let i = 0; i < list.length; i += rowNum) {
                result.push(list.slice(i, i + rowNum));
            }
            // 将偶数行数据颠倒
            return result.map((item, index) => (index % 2 !== 0 ? item.reverse() : item));
        },
        jumpAnster(index) {
            console.log(index);
        },
        getUserinfo() {
            api.get('/api/user/info').then((res) => {
                this.hasLogin = true;
                this.userInfo = res.user_info;
            });
        },
        onLogin({ user_info: userInfo }) {
            this.hasLogin = true;
            this.toLogin = false;
            this.userInfo = userInfo;
        },
        jumpRecord() {
            uni.navigateTo({
                url: '/activity/pages/poetry/record',
            });
        },
        jumpVip() {
            uni.navigateTo({
                url: '/activity/pages/poetry/vip',
            });
        },
        jumpBgList() {
            uni.navigateTo({
                url: '/activity/pages/poetry/bgmusic',
            });
        },
        confirmUcenter() {
            if (!this.hasLogin) {
                this.toLogin = true;
            } else {
                this.jumpUcenter();
            }
        },
        jumpUcenter() {
            uni.navigateTo({
                url: `/activity/pages/poetry/ucenter?activity_id=14&user_id=${this.userInfo.user_id}`,
            });
        },
    },
};
</script>
<style scoped lang="less">
.btn-wrap {
    display: flex;
    flex-wrap: wrap;
    .btn {
        width: 200upx;
        margin: 20upx 0;
    }
}
.page-top {
    height: 468upx;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-top.png);
    background-size: 100% 472upx;
    position: relative;
    padding-top: 30upx;
    box-sizing: border-box;
    .user-info {
        width: 506upx;
        height: 214upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-user.png);
        display: flex;
        background-size: 100% 100%;
        .avator {
            width: 206upx;
        }
        .info {
            color: #ffdf8a;
            margin-top: 100upx;
            line-height: 100upx;
        }
    }
    .ucenter {
        position: absolute;
        right: 0;
        top: 30upx;
        width: 182upx;
        height: 54upx;
        background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/prize-top-bg.png);
        text-align: right;
        padding-right: 12upx;
        background-position-x: 28upx;
        color: #75a531;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        line-height: 54upx;
    }
}
.main-data {
    padding-bottom: 80upx;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-bg.png);
    background-repeat: repeat-y;
    min-height: 1306upx;
    .level-row {
        display: flex;
        justify-content: space-between;
        padding: 0 80upx;
        height: 136upx;
        &.one {
            margin-bottom: 112upx;
            transform: rotate(10deg);
            .card {
                transform: rotate(-10deg);
            }
            .level-item {
                margin-top: -100upx;
            }

            // :nth-child(2) {
            //     margin-top: -50upx;
            // }
            // :nth-child(3) {
            //     margin-top: -30upx;
            // }
            // :nth-child(4) {
            //     margin-top: -10upx;
            // }
        }
        &.two {
            transform: rotate(-10deg);
            margin-bottom: 160upx;
            .card {
                transform: rotate(10deg);
            }
        }
        &.three {
            margin-bottom: 200upx;
            transform: rotate(10deg);
            .card {
                transform: rotate(-10deg);
            }
        }
        &.four {
            margin-bottom: 290upx;
            transform: rotate(-10deg);
            .card {
                transform: rotate(10deg);
            }
        }

        .level-item {
            width: 88upx;
            height: 136upx;
            color: #fff;
            line-height: 100upx;
            text-align: center;
            font-size: 28upx;
            color: #ffef98;
            .card {
                width: 88upx;
                height: 136upx;
            }
        }
    }
}
.fixed {
    position: fixed;
    left: 30upx;
    bottom: 86upx;
    text-align: right;
    font-size: 38upx;
    font-weight: 500;
    color: #fff;
    line-height: 76upx;
    display: flex;
    width: 460upx;
    justify-content: space-between;
    .prize {
        width: 196upx;
        height: 74upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-prize.png);
        background-size: 100% 100%;
        padding-right: 16upx;
        box-sizing: border-box;
    }
    .ucenter {
        width: 236upx;
        height: 76upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/level-ucenter.png);
        background-size: 100% 100%;
        padding-right: 16upx;
        box-sizing: border-box;
    }
}
</style>
