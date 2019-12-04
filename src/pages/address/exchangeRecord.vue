<template>
    <view
        v-if="!isLoading"
        class="address-edit"
    >
        <template v-if="total !== 0">
            <navigator
                v-for="item in addressList"
                :key="item.name"
                :url="`/pages/address/index?id=${item.id}&title=详情`"
            >
                <view class="address-list">
                    <text
                        v-if="item.record_status === 1"
                        class="address-send"
                    >
                        待发货
                    </text>
                    <text
                        v-else
                        class="address-sent"
                    >
                        已发货
                    </text>
                    <view class="address-name">
                        <text>记录编号：</text><text>{{ item.shop_id }}</text>
                    </view>
                    <view class="address-tel">
                        <text>礼品名称：</text><text>{{ item.gift_name }}</text>
                    </view>
                    <view class="address-address">
                        <text>礼品数量：</text><text>{{ item.gift_num }}</text>
                    </view>
                    <view class="address-address">
                        <text>礼品价值：</text><text>
                            <text style="color:#FF740B">
                                {{ item.price }}
                            </text>挑战币
                        </text>
                    </view>
                    <view class="address-address">
                        <text>礼品总价：</text><text>
                            <text style="color:#FF740B">
                                {{ item.total_price }}
                            </text>挑战币
                        </text>
                    </view>
                    <view class="address-address">
                        <text>兑换时间：</text><text>{{ item.created_at }}</text>
                    </view>
                </view>
            </navigator>
            <uni-load-more :status="loadMoreStatus" />
        </template>
        <template v-else>
            <view class="empty">
                <image src="/static/images/address/empty.png" />
                <text>您还没有兑换任何礼品，快去兑换吧~</text>
                <view
                    class="uni-btn-v"
                    @click="handleExchange"
                >
                    <button form-type="submit">
                        去兑换
                    </button>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../common/api';
import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            id: '',
            loadMoreStatus: 'more',
            filter: {
                page_num: 1,
                page_size: 10,
            },
            noticeMode: false,
            info: {},
            contentNodes: [],
            isLoading: true,
            recommendData: [],
            addressList: [],
        };
    },
    methods: {
        getData() {
            api.get('/api/market/giftrecord', this.filter).then(
                ({ list, total }) => {
                    this.isLoading = false;
                    this.addressList = this.addressList.concat(list);
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = 'noMore';
                    }
                },
            );
        },
        handleExchange() {
            uni.switchTab({
                url: '/pages/tabBar/mall/mall',
            });
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData();
            }
        },
    },
    onLoad(query) {
        const { title } = query;
        this.getData();
        if (title) {
            this.noticeMode = true;
        }

        if (title) {
            uni.setNavigationBarTitle({
                title,
            });
        }
    },
};
</script>

<style lang="less" scoped>
.address-edit {
    color: #333;
    font-size: 28upx;
    line-height: 42upx;
    padding: 30upx;
}
.address-list {
    position: relative;
    border-bottom: 1upx solid #e6e6e6;
    height: 375upx;
    line-height: 54upx;
    box-sizing: border-box;
    padding-top: 30upx;
    .address-send {
        position: absolute;
        top: 32upx;
        right: 10upx;
        background: #fff1e6;
        color: #ff740b;
        width: 108upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;
    }
    .address-sent {
        position: absolute;
        top: 32upx;
        right: 10upx;
        background: #e2f2ed;
        color: #40c69b;
        width: 108upx;
        height: 40upx;
        line-height: 40upx;
        text-align: center;
    }
    & > view {
        & > text:first-child {
            width: 154upx;
            text-align: right;
            display: inline-block;
            color: #999999;
        }
        text:nth-child(2) {
            width: 400upx;
            text-align: left;
            display: inline-block;
        }
    }
}

.empty {
    position: absolute;
    top: 284upx;
    width: 100%;
    text-align: center;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    color: #999999;
    .uni-btn-v button {
        width: 360upx;
        height: 110upx;
        background: #1166ff;
        color: #fff;
        border-radius: 0;
        margin-top: 50upx;
        line-height: 110upx;
    }
    image {
        width: 192upx;
        height: 184upx;
        margin-bottom: 32upx;
    }
}
</style>
