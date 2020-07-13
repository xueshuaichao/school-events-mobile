<template>
    <div class="address-edit-page">
        <view>
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
                        :default="[
                            formData.province_id,
                            formData.city_id,
                            formData.county_id
                        ]"
                        @change="getAddress"
                    >
                        {{}}
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
                <view class="uni-btn-v">
                    <button @click="formSubmit">
                        提交
                    </button>
                </view>
            </form>
        </view>
    </div>
</template>
<script>
import api from '../../../common/api';
import selectAddress from '../../../components/area/index.vue';

export default {
    components: {
        selectAddress,
    },
    data() {
        return {
            formData: {
                name: '',
                mobile: '',
                address: '',
                district: '',
                province_id: '',
                city_id: '',
                county_id: '',
            },
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
                    type: 'phoneReg',
                    errorMsg: '手机号格式不正确，请重新填写',
                },
                {
                    type: 'address',
                    errorMsg: '请填写详细地址',
                },
            ],
            captcha: {
                create_at: '',
                remain: '',
                isSend: false,
            },
        };
    },
    methods: {
        getAddress(detail) {
            this.address = detail.labels.join('');
            // console.log(detail)
        },
        initDistrictLabel(arr) {
            console.log(arr);
        },
        formSubmit() {
            if (!this.lock) {
                this.lock = true;
                if (this.validate()) {
                    api.post('/api/activity/schoolcommit', this.formData).then(
                        () => {
                            this.lock = false;
                            uni.showToast({
                                title: '提交成功',
                                icon: 'success',
                            });
                            this.resetData();
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
                Object.keys(this.formData).forEach((item) => {
                    if (item === 'phone') {
                        if (this.formData[item].trim() === '') {
                            throw Error(item);
                        } else if (!this.isMobile.test(this.formData.phone)) {
                            throw Error('phoneReg');
                        }
                    } else if (this.formData[item].trim() === '') {
                        throw Error(item);
                    }
                });
            } catch (e) {
                this.lock = false;
                status = false;
                uni.showToast({
                    title: this.validateRule.filter(
                        v => v.type === e.message,
                    )[0].errorMsg,
                    icon: 'none',
                });
            }
            return status;
        },
        resetData() {
            this.captcha.isSend = false;
            Object.keys(this.formData).forEach((item) => {
                this.formData[item] = '';
            });
        },
    },
};
</script>
<style lang="less" scoped>
.activity-apply-page {
    padding: 0 30upx 110upx;
    .uni-form-item {
        margin-bottom: 40upx;
        .title {
            color: #333;
            font-size: 30upx;
            line-height: 34upx;
            margin-bottom: 16upx;
        }
        .uni-input,
        .uni-textarea {
            border: 1px solid #ccc;
            border-radius: 4upx;
            font-size: 28upx;
            height: 88upx;
            padding: 0 24upx;
            box-sizing: border-box;
        }
        .uni-textarea {
            width: 100%;
            height: 277upx;
            padding: 21upx 24upx;
            box-sizing: border-box;
        }
        .uni-placeholder {
            color: #999;
            font-size: 28upx;
        }
        .uni-input-code {
            display: flex;
            .uni-input {
                width: 480upx;
                margin-right: 24upx;
            }
            .send-captcha {
                width: 186upx;
                height: 88upx;
                line-height: 88upx;
                border-radius: 4upx;
                background-color: #1166ff;
                color: #fff;
                text-align: center;
                &.is-send {
                    background-color: #ccc;
                }
            }
        }
    }
    .uni-btn-v {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
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
