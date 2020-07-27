<template>
    <view
        v-if="loading"
        class="address-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else-if="dataLoading">
            <view class="address-content">
                <view
                    v-if="list.length"
                    class="address-list"
                >
                    <view
                        v-for="item in list"
                        :key="item.id"
                        class="item"
                    >
                        <view
                            class="address-info"
                            @click="selectAddress(item)"
                        >
                            <view class="name-mobile">
                                <text>{{ item.name }}</text>
                                <text>{{ item.mobile }}</text>
                            </view>
                            <view class="address">
                                {{ item.address }}
                            </view>
                        </view>
                        <view class="address-handel">
                            <view @click.stop="setDefaulAddress(item.id)">
                                <view class="radio">
                                    <view
                                        class="iocn icon-radio"
                                        :class="{ checked: item.default === 1 }"
                                    />默认地址
                                </view>
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
                        color="#666"
                    />
                </view>
                <view
                    v-else
                    class="address-none"
                >
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall_icon_noaddress.png"
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
        </template>
    </view>
</template>
<script>
import api from '../../../../common/api';
import login from '../../../../widgets/login/login.vue';
import uniLoadMore from '../../../../components/uni-load-more/uni-load-more.vue';
import share from '../../common/shareMinxin';

export default {
    components: {
        uniLoadMore,
        login,
    },
    mixins: [share.initShare],
    data() {
        return {
            loading: false,
            dataLoading: false,
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
        uni.$once('addressDetailList', (data) => {
            if (data.id) {
                const index = this.list.findIndex(
                    v => v.id === Number(data.id),
                );
                const address = ['address', 'mobile', 'name'];
                address.forEach((item) => {
                    this.$set(this.list[index], item, data.detail[item]);
                });
            } else {
                this.filter.page_num = 1;
                this.getAddress();
            }
        });
    },
    onUnload() {
        uni.$off('addressDetailList');
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getAddress();
        },
        isLogin() {
            uni.showLoading();
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.loading = true;
                    this.getAddress();
                },
                () => {
                    uni.hideLoading();
                    this.loading = true;
                    this.userInfo = null;
                },
            );
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
                    uni.hideLoading();
                    this.dataLoading = true;
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
                    this.dataLoading = true;
                },
            );
        },
        selectAddress(item) {
            const pames = {
                address_id: item.id,
                activity_id: this.activityId,
                detail: item,
            };
            if (this.detailId) {
                uni.$emit('setAddress', { ...pames, id: this.detailId });
                uni.navigateBack();
            } else if (this.lotteryId) {
                api.post('/api/draw/setaddress', {
                    mobile: item.mobile,
                    name: item.name,
                    address: item.address,
                    id: this.lotteryId,
                    activity_id: this.activityId,
                }).then(() => {
                    uni.$emit('addressDetail', {
                        ...pames,
                        id: this.lotteryId,
                    });
                    uni.navigateBack();
                });
            }
        },
        onConfirmDelete(id) {
            if (!this.lock) {
                this.lock = true;
                uni.showModal({
                    title: '删除提示',
                    content: '确认要删除地址吗？',
                    confirmText: '取消',
                    cancelText: '确定',
                    cancelColor: '#1166FF',
                    confirmColor: '#999999',
                    success: (res) => {
                        if (res.cancel) {
                            this.deleteAddress(id);
                            // console.log('用户点击确定');
                        } else {
                            this.lock = false;
                            console.log(this.lock);
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
                    this.total -= 1;
                    if (this.list.length <= 5) {
                        this.loadMoreStatus = 'none';
                    }
                    if (isDefault) {
                        this.setDefaulAddress(this.list[0].id, false);
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
                url: `edit?id=${id}&activity_id=${this.activityId}`,
            });
        },
        setDefaulAddress(id, handel = true) {
            // 设置默认地址
            if (handel) {
                uni.showModal({
                    title: '提示',
                    content: '确认要更换默认地址吗？',
                    confirmText: '取消',
                    cancelText: '确定',
                    cancelColor: '#1166FF',
                    confirmColor: '#999999',
                    success: (res) => {
                        if (res.cancel) {
                            this.setDefaulAddressFn(id);
                            // console.log('用户点击确定');
                        } else if (res.cancel) {
                            this.lock = false;
                            // console.log('用户点击取消');
                        }
                    },
                });
            } else {
                this.setDefaulAddressFn(id);
            }
        },
        setDefaulAddressFn(id) {
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
        },
        addAddress() {
            uni.navigateTo({
                url: 'edit',
            });
        },
    },

    onLoad(parms) {
        this.detailId = parms.detail_id || '';
        this.lotteryId = parms.lottery_id;
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
.address-page {
    position: relative;
    .address-list {
        padding: 28upx 30upx 136upx;
        background-color: #f0f0f3;
        .item {
            background-color: #ffffff;
            margin-bottom: 32upx;
            box-shadow: 0px 4upx 28upx 0px rgba(0, 0, 0, 0.06);
            border-radius: 4upx;
        }
        .address-info {
            padding: 30upx 32upx 12upx;
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
            padding: 10upx 32upx 20upx;
        }
        .radio {
            line-height: 40upx;
            height: 40upx;
            font-size: 28upx;
            display: flex;
            align-items: center;
            color: #333;
            .icon-radio {
                width: 34upx;
                height: 34upx;
                background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/icon_select_off.png);
                background-size: 100% 100%;
                margin-right: 16upx;
                &.checked {
                    background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/icon_select_on.png);
                }
            }
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
