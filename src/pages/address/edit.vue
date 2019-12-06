<template>
    <view
        v-if="!isLoading"
        class="address-edit"
    >
        <form @submit="formSubmit">
            <view class="uni-form-item">
                <view class="title">
                    收件人姓名
                </view>
                <input
                    v-model="addressDetail.name"
                    maxlength="10"
                    class="uni-input"
                    name="name"
                    placeholder="请输入收件人姓名"
                >
            </view>
            <view class="uni-form-item">
                <view class="title">
                    联系电话
                </view>
                <input
                    v-model="addressDetail.phone"
                    maxlength="11"
                    class="uni-input"
                    name="phone"
                    type="number"
                    placeholder="请输入联系电话"
                >
            </view>
            <view class="uni-form-item">
                <view class="title">
                    收获地址
                </view>
                <textarea
                    ref="description"
                    v-model="addressDetail.address"
                    class="uni-textarea"
                    name="address"
                    maxlength="50"
                    placeholder="请输入详细的收货地址"
                    @input="wordlimit"
                />
                <text class="word-cound">
                    <text>{{ wordCound }}</text>/50
                </text>
            </view>
            <view class="uni-btn-v">
                <button form-type="submit">
                    确定
                </button>
            </view>
        </form>
    </view>
</template>

<script>
import api from '../../common/api';

export default {
    data() {
        return {
            id: '',
            addressDetail: {},
            info: {},
            contentNodes: [],
            isLoading: true,
            recommendData: [],
            wordCound: 0,
        };
    },
    methods: {
        wordlimit() {
            setTimeout(() => {
                this.wordCound = this.addressDetail.address.length;
            }, 1);
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
        formSubmit(e) {
            uni.showToast({
                icon: 'loading',
                mask: true,
            });
            const formData = e.detail.value;
            if (!formData.name) {
                return this.errTip('请输入收货人姓名');
            }
            if (!formData.phone || formData.phone.length !== 11) {
                return this.errTip('请输入正确格式的手机号码');
            }
            if (!formData.address || formData.address.length < 5) {
                return this.errTip('请输入正确格式的收货地址');
            }
            if (this.id) {
                // 编辑
                formData.id = this.id;
                return api
                    .post(`/api/market/addressup/${this.id}`, formData)
                    .then(
                        () => {
                            uni.showToast({
                                icon: 'none',
                                title: '收货地址编辑成功',
                                mask: true,
                            });
                            setTimeout(() => {
                                this.navigate(formData, this.id);
                            }, 1500);
                        },
                        err => uni.showToast({
                            icon: 'none',
                            title: err.message,
                        }),
                    );
            }
            return api.post('/api/market/addressadd', formData).then(
                (res) => {
                    uni.showToast({
                        icon: 'none',
                        title: '收货地址添加成功',
                        mask: true,
                    });
                    setTimeout(() => {
                        this.navigate(formData, res);
                    }, 1500);
                },
                err => uni.showToast({
                    icon: 'none',
                    title: err.message,
                }),
            );
        },
        navigate(formData, res) {
            const pages = getCurrentPages(); // eslint-disable-line
            let index;
            if (pages[pages.length - 2].route === 'pages/address/index') {
                index = 2;
            } else if (
                pages[pages.length - 3].route === 'pages/address/index'
            ) {
                index = 3;
            } else {
                index = 0;
            }

            if (index === 0) {
                uni.navigateBack();
            } else {
                const prevPage = pages[pages.length - index];
                let exchangeDetail;
                // #ifdef H5
                exchangeDetail = prevPage._data.exchangeDetail; // eslint-disable-line
                // #endif
                // #ifndef H5
                exchangeDetail = prevPage.data.exchangeDetail; // eslint-disable-line
                // #endif
                exchangeDetail.addr_id = res;
                exchangeDetail.address.name = formData.name;
                exchangeDetail.address.phone = formData.phone;
                exchangeDetail.address.address = formData.address;

                // #ifdef H5
                prevPage._data.exchangeDetail = exchangeDetail;
                // #endif
                // #ifndef H5
                prevPage.setData({
                    exchangeDetail,
                });
                // #endif

                uni.navigateBack({
                    delta: index - 1,
                });
            }
        },
        getData(id) {
            this.id = id;

            api.get(`/api/market/address/${id}`).then((data) => {
                this.isLoading = false;
                this.addressDetail = data;
                this.wordCound = data.address.length;
            });
        },
    },
    onLoad(query) {
        const { id, title } = query;
        if (title) {
            uni.setNavigationBarTitle({ title });
        }

        if (id) {
            this.getData(id);
        } else {
            this.isLoading = false;
        }
    },
};
</script>

<style lang="less" scoped>
.uni-textarea {
    width: 690upx;
    height: 220upx;
    border: 1px solid #e6e6e6;
}
.uni-form-item {
    // margin-bottom: 10px;
    // display: flex;
    border-bottom: 2upx solid #e6e6e6;
    height: 155upx;
    .word-cound {
        transform: translate(-20upx, -20upx);
        text {
            color: #ff740b;
        }
    }
    view {
        margin-top: 40upx;
        margin-bottom: 40upx;
        font-weight: 700;
        font-size: 32upx;
    }
}
.uni-form-item:nth-child(3) {
    border-bottom: 0upx;
    height: 352upx;
}

input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #ccc;
    font-size: 28upx;
}
.address-edit {
    color: #333;
    font-size: 28upx;
    line-height: 42upx;
    padding: 30upx;
}
.uni-btn-v button {
    width: 690upx;
    height: 110upx;
    background: #1166ff;
    color: #fff;
    border-radius: 0;
    margin-top: 50upx;
    line-height: 110upx;
}
</style>
