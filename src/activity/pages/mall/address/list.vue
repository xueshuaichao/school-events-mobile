<template>
    <view
        v-if="loading"
        class="address-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <view
            v-else
            class="address-content"
        >
            <view
                v-if="list.length"
                class="address-list"
            >
                <view
                    v-for="item in list"
                    :key="item.id"
                    class="item"
                    @click="selectAddress(item.id)"
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
                        <view @click.stop="setDefaulAddress">
                            <radio-group @change="setDefaulAddress">
                                <label
                                    class="radio"
                                ><radio
                                    style="transform:scale(0.7)"
                                    :value="String(item.id)"
                                    :checked="item.default === 1"
                                />默认地址</label>
                            </radio-group>
                        </view>
                        <view class="handel-item">
                            <text @click.stop="editAddress(item.id)">
                                修改
                            </text>
                            <text @click.stop="onConfirmDelete(item.id)">
                                删除
                            </text>
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
                    color="#333"
                />
            </view>
            <view
                v-else
                class="address-none"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_no_address.png"
                    mode=""
                />
                <view>暂时没有收货地址哦～</view>
            </view>
        </view>
        <view
            class="add-btn"
            @click="addAddress"
        >
            添加地址
        </view>
    </view>
</template>
<script>
import api from '../../../../common/api';
import login from '../../../../widgets/login/login.vue';
import uniLoadMore from '../../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
        login,
    },
    data() {
        return {
            loading: false,
            userInfo: '',
            loadMoreStatus: 'none',
            filter: {
                page_size: 10,
                page_num: 1,
            },
            list: [],
        };
    },
    onShow() {
        this.getAddress();
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getAddress();
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getAddress('reachBottom');
            }
        },
        getAddress(type) {
            // 地址列表
            api.get('/api/market/addresslist', this.filter).then(
                ({ list, total }) => {
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
                () => {},
            );
        },
        selectAddress(addressid) {
            if (this.detailId) {
                uni.redirectTo({
                    url: `/activity/pages/mall/detail?id=${this.detailId}&address_id=${addressid}`,
                });
            }
        },
        onConfirmDelete(id) {
            if (!this.lock) {
                this.lock = true;
                uni.showModal({
                    title: '删除提示',
                    content: '确认要删除地址么',
                    confirmText: '取消',
                    cancelText: '确定',
                    cancelColor: '#1166FF',
                    confirmColor: '#999999',
                    success: (res) => {
                        if (res.cancel) {
                            this.deleteAddress(id);
                            // console.log('用户点击确定');
                        } else if (res.cancel) {
                            this.lock = false;
                            // console.log('用户点击取消');
                        }
                    },
                });
            }
        },
        deleteAddress(id) {
            api.get('/api/market/deleteaddress', {
                id,
            }).then(
                () => {
                    const index = this.list.findIndex(v => v.id === id);
                    const isDefault = this.list[index].default === 1;
                    this.list.splice(index, 1);
                    if (isDefault) {
                        this.setDefaulAddress(this.list[0].id);
                    }
                    this.lock = false;
                },
                () => {
                    this.lock = false;
                },
            );
        },
        editAddress(id) {
            uni.navigateTo({
                url: `edit?id=${id}`,
            });
        },
        setDefaulAddress(e) {
            if (e.type === 'click') {
                // 用来阻止事件冒泡
                return false;
            }
            // 设置默认地址
            const id = typeof e === 'number' ? e : Number(e.detail.value);
            const index = this.list.findIndex(v => v.id === id);
            this.list.forEach((item, i) => {
                if (i !== index) {
                    this.list[i].default = 0;
                }
            });
            api.post('/api/market/setdefaultaddress', {
                id,
            }).then(
                () => {
                    this.list[index].default = 1;
                },
                () => {
                    uni.showToast({
                        title: '设置默认地址失败，请重新选择',
                        icon: 'none',
                    });
                },
            );
            return true;
        },
        addAddress() {
            uni.navigateTo({
                url: 'edit',
            });
        },
    },
    onLoad(parms) {
        this.detailId = parms.detail_id;
    },
};
</script>
<style lang="less" scoped>
page {
    background-color: #f0f0f3;
}
.address-page {
    position: relative;
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
            word-break: break-all;
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
    .address-none {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -65%);
        width: 100%;
        & > image {
            width: 268upx;
            height: 288upx;
            margin-bottom: 8upx;
        }
        text-align: center;
        color: #666;
        line-height: 42upx;
        font-size: 30upx;
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
