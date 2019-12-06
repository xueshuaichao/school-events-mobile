<template>
    <view
        v-if="!isLoading"
        class="address-edit"
    >
        <template>
            <view
                v-for="item in addressList"
                :key="item.id"
                class="address-list"
                @click="handleAddressChoose(item)"
            >
                <navigator
                    :url="`/pages/address/edit?id=${item.id}`"
                    @click.stop="handleTap2"
                >
                    <view class="address-item">
                        编辑<image src="/static/images/address/edit.png" />
                    </view>
                </navigator>

                <view
                    v-if="title === '收货地址'"
                    class="address-delete"
                    @click="onConfirmDelete(item.id)"
                >
                    删除<image src="/static/images/address/delete.png" />
                </view>
                <view class="address-name">
                    <text>收件人姓名：</text><text>{{ item.name }}</text>
                </view>
                <view class="address-tel">
                    <text>联系电话：</text><text>{{ item.phone }}</text>
                </view>
                <view class="address-address">
                    <text>收货地址：</text><text>{{ item.address }}</text>
                </view>
            </view>
            <uni-load-more :status="loadMoreStatus" />
        </template>
        <navigator
            :url="'/pages/address/edit?title=增加收货地址'"
            hover-class="other-navigator-hover"
        >
            <view class="uni-btn-v">
                <button form-type="submit">
                    <image src="/static/images/address/location.png" />
                    添加收货地址
                </button>
            </view>
        </navigator>
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
            // #ifdef H5
            isH5: true,
            // #endif
            info: {},
            contentNodes: [],
            isLoading: true,
            recommendData: [],
            addressList: [],
            title: '',
            filter: {
                page_num: 1,
                page_size: 10,
            },
        };
    },
    methods: {
        handleAddressChoose(item) {
            const pages = getCurrentPages(); // eslint-disable-line
            const prevPage = pages[pages.length - 2];
            if (prevPage.route === 'pages/address/index') {
                let exchangeDetail;
                // #ifdef H5
                exchangeDetail = prevPage._data.exchangeDetail; // eslint-disable-line
                // #endif
                // #ifndef H5
                exchangeDetail = prevPage.data.exchangeDetail; // eslint-disable-line
                // #endif
                exchangeDetail.addr_id = item.id;
                exchangeDetail.address.name = item.name;
                exchangeDetail.address.phone = item.phone;
                exchangeDetail.address.address = item.address;
                // #ifdef H5
                prevPage._data.exchangeDetail = exchangeDetail;
                // #endif
                // #ifndef H5
                prevPage.setData({
                    exchangeDetail,
                });
                // #endif
                uni.navigateBack();
            }
        },
        handleTap2() {},
        onConfirmDelete(id) {
            uni.showModal({
                title: '删除提示',
                content: '作品删除后将无法恢复 \n 确定删除吗？',
                confirmText: '确定删除',
                cancelText: '暂不删除',
                cancelColor: '#1166FF',
                confirmColor: '#999999',
                success: (res) => {
                    if (res.confirm) {
                        this.deleteWork(id);
                    } else if (res.cancel) {
                        uni.showToast({
                            title: '删除失败',
                            icon: 'none',
                        });
                    }
                },
            });
        },
        deleteWork(id) {
            api.get(`/api/market/addressdel/${id}`).then(() => {
                this.filter.page_num = 1;
                this.getData();
            });
        },
        getData(title) {
            api.get('/api/market/address', this.filter).then(
                ({ list, total }) => {
                    this.isLoading = false;
                    if (title === 'reachBottom') {
                        this.addressList = this.addressList.concat(list);
                    } else {
                        this.addressList = list;
                    }

                    this.total = total;

                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = 'noMore';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
            );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getData('reachBottom');
            }
        },
        getArticle(columnId) {
            api.get('/api/article/list', {
                column: columnId,
                except_new_id: this.id,
                page_size: 5,
            }).then((res) => {
                this.recommendData = res.list;
            });
        },
    },
    onShow() {
        uni.pageScrollTo({
            scrollTop: 0,
            duration: 0,
        });
        this.filter.page_num = 1;
        this.loadMoreStatus = 'more';
        this.getData();
    },
    onLoad(query) {
        const { title } = query;
        this.getData();
        this.title = title;
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
.btn {
    background: #1166ff;
    color: #fff;
    line-height: 94upx;
    text-align: center;
    width: 400upx;
    height: 94upx;
    background: rgba(17, 102, 255, 1);
    border-radius: 2upx;
    margin: 0 auto;
}
.address-list {
    position: relative;
    bottom: 1upx solid #e6e6e6;
    font-size: 28upx;
    // height:210upx;
    color: #999999;
    line-height: 60upx;
    .address-item {
        position: absolute;
        top: 40upx;
        right: 64upx;
        color: #1166ff;

        &::before {
            content: "";
            display: inline-block;
            height: 40upx;
            width: 1upx;
            position: absolute;
            top: 8upx;
            left: -40upx;
            background: #e6e6e6;
        }
        image {
            position: absolute;
            top: 9upx;
            right: -42upx;
            width: 44upx;
            height: 44upx;
        }
    }
    .address-delete {
        position: absolute;
        top: 80upx;
        right: 64upx;
        color: #666666;
        &::before {
            content: "";
            display: inline-block;
            height: 40upx;
            width: 1upx;
            position: absolute;
            top: 8upx;
            left: -40upx;
            background: #e6e6e6;
        }
        image {
            position: absolute;
            top: 9upx;
            right: -42upx;
            width: 44upx;
            height: 44upx;
        }
    }
    & > view {
        text:first-child {
            width: 183upx;
            text-align: right;
            display: inline-block;
            vertical-align: top;
        }
        text:nth-child(2) {
            width: 340upx;
            color: #333333;
            display: inline-block;
            word-break: break-word;
            line-height: 32upx;
        }
    }
}
.uni-btn-v button {
    width: 690upx;
    height: 110upx;
    background: #1166ff;
    color: #fff;
    border-radius: 0;
    margin-top: 50upx;
    line-height: 110upx;
    image {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        margin-right: 3px;
        width: 44upx;
        height: 44upx;
    }
}
</style>
