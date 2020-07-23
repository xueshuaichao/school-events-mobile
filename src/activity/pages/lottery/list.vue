<template>
    <view
        v-if="loading"
        class="lottery-list-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view
                v-if="list.length"
                class="list-content"
            >
                <view
                    v-for="item in list"
                    :key="item.id"
                    class="item"
                    @click="jumpDetail(item.id)"
                >
                    <view class="item-detail">
                        <view class="image">
                            <image
                                :src="item.image"
                                mode=""
                            />
                        </view>
                        <view class="title">
                            {{ item.prize_name }}
                        </view>
                    </view>
                    <view class="item-info">
                        <view class="time">
                            <view class="title">
                                兑换时间：
                            </view>
                            <view class="text">
                                {{ item.created_at }}
                            </view>
                        </view>
                    </view>
                    <view
                        class="address-detail"
                        @click.stop="setAddress(item)"
                    >
                        <template v-if="item.address">
                            <view>{{ item.address.name }}</view>
                            <view>{{ item.address.mobile }}</view>
                            <view class="address text-one-line">
                                {{ item.address.address }}
                            </view>
                        </template>
                        <view
                            v-else
                            class="set-address"
                        >
                            还没有邮件地址，快去设置吧～
                        </view>
                    </view>
                </view>
                <uni-load-more
                    class="loadMore"
                    :status="loadMoreStatus"
                    :content-text="{
                        contentdown: '上拉显示更多',
                        contentrefresh: '正在加载...',
                        contentnomore: '———— 已经到底了~ ————'
                    }"
                    color="#666"
                />
            </view>
            <view
                v-else
                class="no-data"
            >
                <view class="image">
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/lottery_icon_fail.png"
                        mode=""
                    />
                </view>
                <view class="title">
                    很遗憾！暂未中奖
                </view>
                <view>每天坚持打卡可赢取抽奖机会哦~</view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import share from '../common/shareMinxin';

export default {
    components: {
        uniLoadMore,
        login,
    },
    mixins: [share.initShare],
    data() {
        return {
            loading: false,
            activityId: '',
            loadMoreStatus: 'none',
            list: [],
            filter: {
                page_size: 10,
                page_num: 1,
            },
            addressDetail: {},
            userInfo: '',
        };
    },
    onShow() {
        uni.$once('addressDetail', (data) => {
            const index = this.list.findIndex(v => v.id === Number(data.id));
            const address = ['address', 'mobile', 'name'];
            address.forEach((item) => {
                this.$set(this.list[index].address, item, data.detail[item]);
            });
        });
    },
    onUnload() {
        uni.$off('addressDetail');
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getPrizeList();
        },
        isLogin() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getPrizeList();
                },
                () => {
                    this.loading = true;
                    this.userInfo = null;
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getPrizeList('reachBottom');
            }
        },
        getPrizeList(type) {
            api.get('/api/draw/getmyprize', {
                ...this.filter,
                activity_id: this.activityId,
            }).then(
                ({ list, total }) => {
                    uni.hideLoading();
                    if (type === 'reachBottom') {
                        this.list = this.list.concat(list);
                    } else {
                        this.list = list;
                        this.loading = true;
                    }
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = type === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
                () => {
                    uni.hideLoading();
                    this.loading = true;
                },
            );
        },
        setAddress(item) {
            // 如果没有地址 跳至添加页面 否则跳到地址列表页
            const url = item.address
                ? `list?lottery_id=${item.id}`
                : `edit?lottery_id=${item.id}`;
            uni.navigateTo({
                url: `/activity/pages/mall/address/${url}&activity_id=${this.activityId}`,
            });
        },
        jumpDetail(id) {
            uni.navigateTo({
                url: `detail?id=${id}&activity_id=${this.activityId}`,
            });
        },
    },
    onLoad(parms) {
        this.activityId = parms.activity_id;
        this.getShareConfig();
        this.isLogin();
    },
};
</script>
<style lang="less">
page {
    background-color: #f0f0f3;
}
</style>
<style lang="less" scoped>
.lottery-list-page {
    padding-top: 10upx;
    .list-content {
        padding: 32upx 40upx;
        .item {
            border-radius: 16upx;
            background-color: #fff;
            padding: 20upx 0 0;
            margin-bottom: 32upx;
        }
        .item-detail,
        .item-info,
        .item-reason,
        .address-detail {
            padding: 0 32upx;
        }
        .set-address {
            color: #666;
            font-size: 26upx;
            line-height: 80upx;
            position: relative;
            width: 100%;
            text-align: center;
            &:after {
                content: "";
                position: absolute;
                top: 50%;
                margin-top: -9upx;
                right: 10upx;
                width: 18upx;
                height: 18upx;
                border-top: 1px solid #9d9d9d;
                border-right: 1px solid #9d9d9d;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                box-sizing: border-box;
            }
        }
        .item-detail {
            display: flex;
            justify-content: flex-start;
            margin-bottom: 32upx;
            .image {
                width: 228upx;
                height: 128upx;
                margin-right: 20upx;
                & > image {
                    width: 100%;
                    height: 100%;
                }
            }
            .title {
                font-size: 28upx;
                color: #333;
                line-height: 40upx;
                word-break: break-all;
                flex: 1;
            }
        }
        .item-info {
            color: #999;
            font-size: 24upx;
            margin-bottom: 32upx;
            .text {
                color: #333;
                display: inline-block;
                margin-right: 8upx;
                font-size: 26upx;
            }
            .time {
                line-height: 34upx;
                display: flex;
                margin-bottom: 20upx;
                .title {
                    width: 120upx;
                }
                .text {
                    word-break: break-all;
                    flex: 1;
                }
            }
        }
        .address-detail {
            border-top: 1px solid #d8d8d8;
            color: #333;
            font-size: 28upx;
            line-height: 80upx;
            display: flex;
            & > view {
                display: inline-block;
                margin-right: 16upx;
            }
            .address {
                color: #999999;
                display: inline-block;
                word-break: break-all;
                flex: 1;
            }
        }
    }
    .no-data {
        margin-top: 200upx;
        line-height: 34upx;
        text-align: center;
        view {
            color: #999;
            font-size: 30upx;
        }
        .title {
            color: #000;
            font-size: 36upx;
            line-height: 1;
            font-weight: bold;
            margin-bottom: 43upx;
        }
        .image {
            width: 208upx;
            height: 200upx;
            margin: 0 auto 70upx;
            & > image {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>
