<template>
    <view class="address-page">
        <view class="address-content">
            <view
                v-if="list.length"
                class="address-list"
            >
                <radio-group @change="setDefaulAddress">
                    <view
                        v-for="item in list"
                        :key="item.id"
                        class="item"
                    >
                        <view class="address-info">
                            <view class="name-mobile">
                                <text>{{ item.name }}</text>
                                <text>{{ item.mobile }}</text>
                            </view>
                            <view class="address">
                                {{ item.address }}
                            </view>
                        </view>
                        <view class="address-handel">
                            <label
                                class="radio"
                            ><radio
                                style="transform:scale(0.7)"
                                :value="String(item.id)"
                                :checked="item.is_default === 1"
                            />默认地址</label>
                            <view class="handel-item">
                                <text @click="editAddress(item.id)">
                                    修改
                                </text>
                                <text @click="onConfirmDelete(item.id)">
                                    删除
                                </text>
                            </view>
                        </view>
                    </view>
                </radio-group>
                <uni-load-more
                    class="loadMore"
                    :status="loadMoreStatus"
                    :content-text="{
                        contentdown: '上拉显示更多',
                        contentrefresh: '正在加载...',
                        contentnomore: '———— 已经到底了~ ————'
                    }"
                    color="#333"
                />
            </view>
            <view
                v-else
                class="address-none"
            >
                <image
                    src=""
                    mode=""
                />
                <view>暂时没有收货地址哦～</view>
            </view>
        </view>
        <view class="add-btn">
            添加地址
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            loadMoreStatus: 'none',
            filter: {
                page_size: 10,
                page_num: 1,
            },
            list: [],
        };
    },
    created() {
        this.getAddress();
    },
    methods: {
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getAddress('reachBottom');
            }
        },
        getAddress(type) {
            // 地址列表
            api.get()
                .then((res) => {
                    this.list = res.list;
                    this.total = res.total;
                })
                .then(
                    ({ list, total }) => {
                        if (type === 'reachBottom') {
                            this.list = this.list.concat(list);
                        } else {
                            this.list = list;
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
                    () => {},
                );
            this.list = [
                {
                    name: '谋谟',
                    mobile: '13370123965',
                    address: '北京市 海北京市 海北京市 海北京市 海',
                    id: 3111,
                    is_default: 1,
                },
                {
                    name: '谋谟',
                    mobile: '13370123965',
                    address: '北京市 海北京市 海北京市 海北京市 海',
                    id: 311,
                    is_default: 0,
                },
            ];
        },
        onConfirmDelete(id) {
            if (!this.lock) {
                uni.showModal({
                    title: '删除提示',
                    content: '确认删除地址吗',
                    confirmText: '取消',
                    cancelText: '确定',
                    cancelColor: '#1166FF',
                    confirmColor: '#999999',
                    success: (res) => {
                        if (res.cancel) {
                            this.deleteAddress(id);
                            // console.log('用户点击确定');
                        } else if (res.cancel) {
                            // console.log('用户点击取消');
                        }
                    },
                });
            }
        },
        deleteAddress() {},
        editAddress(id) {
            uni.redirectTo({
                url: `address_edit?id=${id}`,
            });
        },
        setDefaulAddress(e) {
            // 设置默认地址
            console.log(e);
            api.post('', {
                id: Number(e.detail.value),
            });
        },
    },
};
</script>
<style lang="less" scoped>
page {
    background-color: #f0f0f3;
}
.address-page {
    .address-list {
        padding: 28upx 30upx 136upx;
        background-color: #f0f0f3;
        .item {
            background-color: #ffffff;
            padding: 20upx 32upx;
            margin-bottom: 32upx;
            border-radius: 4upx;
        }
        .address-info {
            margin-bottom: 32upx;
        }
        .name-mobile {
            line-height: 40upx;
            margin-bottom: 12upx;
            & > text {
                margin-right: 16upx;
                color: #333;
            }
        }
        .address {
            line-height: 36upx;
            color: #666;
        }
        .address-handel {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .radio {
            line-height: 40upx;
            height: 40upx;
        }
        .handel-item {
            color: #1166ff;
            font-size: 28upx;
            & > text:nth-of-type(2) {
                margin-left: 64upx;
            }
        }
    }
    .add-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        line-height: 108upx;
        height: 108upx;
        text-align: center;
        color: #fff;
        font-size: 36upx;
        background-color: #1166ff;
    }
}
</style>
