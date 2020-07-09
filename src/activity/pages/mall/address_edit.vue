<template>
    <view class="address-page">
        <view class="address-content">
            <view
                v-if="addressList.length"
                class="address-list"
            >
                <view
                    v-for="item in addressList"
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
                    <view class="handel">
                        <label
                            class="radio"
                        ><radio
                            value="r1"
                            checked="true"
                        />默认地址</label>
                    </view>
                </view>
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
export default {
    data() {
        return {
            addressList: [],
        };
    },
    created() {
        this.getAddress();
    },
    methods: {
        getAddress() {
            this.addressList = [
                {
                    name: '谋谟',
                    mobile: '13370123965',
                    address: '北京市 海北京市 海北京市 海北京市 海',
                    id: 3111,
                },
                {
                    name: '谋谟',
                    mobile: '13370123965',
                    address: '北京市 海北京市 海北京市 海北京市 海',
                    id: 311,
                },
            ];
        },
    },
};
</script>
<style lang="less" scoped>
.address-page {
    .add-btn {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        line-height: 108upx;
        height: 108upx;
        text-align: center;
        color: 36upx;
        background-color: #1166ff;
    }
}
</style>
