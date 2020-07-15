<template>
    <view
        v-if="loading"
        class="address-edit-page"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view class="address-form">
                <form>
                    <view class="uni-form-item uni-column">
                        <view class="title">
                            收件人
                        </view>
                        <input
                            v-model="formData.name"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="6"
                            placeholder="收件人姓名"
                        >
                    </view>
                    <view class="uni-form-item uni-column">
                        <view class="title">
                            联系电话
                        </view>
                        <input
                            v-model="formData.mobile"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="11"
                            placeholder="收件人电话号码"
                        >
                    </view>
                    <view class="uni-form-item uni-column">
                        <view class="title">
                            所在地区
                        </view>
                        <selectAddress
                            class="uni-input"
                            :default="[
                                String(formData.province_id),
                                String(formData.city_id),
                                String(formData.county_id)
                            ]"
                            @change="getAddress"
                        >
                            <slot class="">
                                <view
                                    v-if="!formData.district"
                                    class="address-placeholder"
                                >
                                    请选择
                                </view>
                                <view
                                    v-else
                                    class="address-value"
                                >
                                    {{ formData.district }}
                                </view>
                            </slot>
                        </selectAddress>
                    </view>
                    <view class="uni-form-item uni-column">
                        <view class="title">
                            详细地址
                        </view>
                        <input
                            v-model="formData.address"
                            class="uni-input"
                            placeholder-class="uni-placeholder"
                            maxlength="100"
                            placeholder="如街道、门牌号、小区、乡镇、村等"
                        >
                    </view>
                </form>
            </view>
            <view class="uni-btn-v">
                <button @click="formSubmit">
                    保存
                </button>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../../common/api';
import login from '../../../../widgets/login/login.vue';
import selectAddress from '../../../../components/area/index.vue';

export default {
    components: {
        selectAddress,
        login,
    },
    data() {
        return {
            loading: false,
            userInfo: '',
            formData: {
                name: '',
                mobile: '',
                address: '',
                district: '',
                province_id: '',
                city_id: '',
                county_id: '',
            },
            address: '',
            isMobile: /^1[0-9]{10}$/,
            validateRule: [
                {
                    type: 'name',
                    errorMsg: '请填写收件人姓名',
                },
                {
                    type: 'mobile',
                    errorMsg: '请填写收件人电话号码',
                },
                {
                    type: 'district',
                    errorMsg: '请选择所在地区',
                },
                {
                    type: 'address',
                    errorMsg: '请填写详细地址',
                },
            ],
        };
    },
    methods: {
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            if (this.id) {
                this.getAddressInfo();
            }
        },
        isLogin() {
            return api.get('/api/user/info');
        },
        getAddress(detail) {
            this.$set(this.formData, 'district', detail.labels.join(''));
            [this.formData.province_id] = [detail.values[0]];
            [this.formData.city_id] = [detail.values[1]];
            [this.formData.county_id] = [detail.values[2]];
        },
        formSubmit() {
            if (!this.lock) {
                this.lock = true;
                if (this.validate()) {
                    const url = this.id
                        ? '/api/market/editaddress'
                        : '/api/market/addaddress';
                    if (this.id) {
                        this.formData.id = this.id;
                    }
                    const address = `${this.formData.district} ${this.formData.address}`;
                    this.$delete(this.formData, 'district');
                    api.post(url, { ...this.formData, address }).then(
                        (res) => {
                            this.lock = false;
                            uni.showToast({
                                title: '提交成功',
                                icon: 'success',
                            });
                            if (this.detailId) {
                                uni.redirectTo({
                                    url: `/activity/pages/mall/detail?id=${this.detailId}&address_id=${res}`,
                                });
                            } else {
                                uni.navigateBack();
                            }
                        },
                        (err) => {
                            this.lock = false;
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                        },
                    );
                }
            }
        },
        validate() {
            let status = true;
            try {
                this.validateRule.forEach((item) => {
                    if (item.type === 'mobile') {
                        if (this.formData[item.type].trim() === '') {
                            throw Error(item.type);
                        } else if (!this.isMobile.test(this.formData.mobile)) {
                            throw Error('phoneReg');
                        }
                    } else if (this.formData[item.type].trim() === '') {
                        throw Error(item.type);
                    }
                });
            } catch (e) {
                this.lock = false;
                status = false;
                uni.showToast({
                    title:
                        e.message === 'phoneReg'
                            ? '手机号码格式不正确，请重新填写'
                            : this.validateRule.filter(
                                v => v.type === e.message,
                            )[0].errorMsg,
                    icon: 'none',
                });
            }
            return status;
        },
        getAddressInfo() {
            api.get('/api/market/getaddressinfo', {
                id: this.id,
            }).then((res) => {
                this.formData = res;
                const address = this.formData.address.split(' ');
                [this.formData.district, this.formData.address] = address;
            });
        },
    },
    onLoad(parms) {
        this.id = parms.id;
        this.detailId = parms.detail_id;
        this.isLogin().then(
            (res) => {
                this.userInfo = res.user_info;
                this.loading = true;
                if (this.id) {
                    this.getAddressInfo();
                }
            },
            () => {
                this.loading = true;
                this.userInfo = null;
            },
        );
    },
};
</script>
<style lang="less" scoped>
page {
    background-color: #f0f0f3;
}
.address-edit-page {
    .address-form {
        background-color: #fff;
        padding: 0 0upx 2upx 48upx;
        margin: 8upx auto 48upx;
    }
    .uni-form-item {
        margin-bottom: 2upx;
        display: flex;
        align-items: center;
        &:last-of-type {
            .uni-input {
                border: 0;
            }
        }
        .title {
            color: #333;
            font-size: 28upx;
            line-height: 80upx;
            margin-right: 64upx;
            width: 112upx;
        }
        .uni-input {
            border-bottom: 1px solid #ccc;
            border-radius: 4upx;
            font-size: 28upx;
            height: 80upx;
            padding: 0 24upx;
            box-sizing: border-box;
            flex: 1;
        }
        .uni-placeholder,
        .address-placeholder {
            color: #999;
            font-size: 28upx;
            line-height: 80upx;
        }
        .address-value {
            color: #333;
            font-size: 28upx;
            line-height: 80upx;
        }
    }
    .uni-btn-v {
        width: 620upx;
        margin: 0 auto;
        button {
            background-color: #1166ff;
            color: #fff;
            height: 108upx;
            line-height: 108upx;
            border-radius: 0;
        }
    }
}
</style>
