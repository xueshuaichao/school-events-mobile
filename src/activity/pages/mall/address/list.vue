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
                        @click="selectAddress(item)"
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
                                        class="theme"
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
                        color="#666"
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
        uni.$once('addressDetail', (data) => {
            const index = this.list.findIndex(v => v.id === Number(data.id));
            const address = ['address', 'mobile', 'name'];
            address.forEach((item) => {
                this.$set(this.list[index], item, data.detail[item]);
            });
        });
    },
    onUnload() {
        uni.$off('addressDetail');
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
                        detail: item,
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
                url: `edit?id=${id}&activity_id=${this.activityId}`,
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
    /* #ifndef MP-ALIPAY */

    /deep/radio::before {
        margin-top: -8rpx;
        right: 8rpx;
        font-size: 36rpx;
        line-height: 16rpx;
    }

    /deep/radio .wx-radio-input,
    /deep/radio .uni-radio-input {
        margin: 0;
        width: 32rpx;
        height: 32rpx;
        margin-right: 10upx;
        position: relative;
        top: -4upx;
    }
    /* #endif */

    /* 覆盖样式修改颜色 */
    /deep/radio.theme[checked] .wx-radio-input,
    /deep/radio.theme.checked .uni-radio-input {
        background-color: #1166ff !important;
        border-color: #1166ff !important;
        color: #ffffff !important;
    }

    /* 鼠标移到上面的边框颜色 */
    uni-radio:not([disabled]) .uni-radio-input:hover {
        border-color: #d1d1d1 !important;
    }
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
            font-size: 28upx;
            display: flex;
            align-items: center;
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
