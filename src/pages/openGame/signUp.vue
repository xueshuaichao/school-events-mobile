<template>
    <view class="page-upload">
        <view class="main">
            <view
                class="content-box"
                style="height:256upx"
            >
                <view class="title">
                    活动信息
                </view>
                <view class="content">
                    世界吉尼斯青少年“爱挑战”网络公开赛
                </view>
                <view class="sign-time">
                    报名时间：4月20日-5月10日
                </view>
                <view class="act-time">
                    活动时间：5月10日-7月20日
                </view>
            </view>
            <view
                class="content-box"
                style="height:326upx;margin-top:20upx"
            >
                <view class="title">
                    参赛项目信息
                </view>
                <view class="show-type-hd">
                    <view class="show-type-text">
                        申报项目：
                    </view>
                    <view class="show-type-list">
                        <text
                            v-for="(item, k) in formData.event"
                            :key="k"
                            class="show-type-title"
                            :class="{ active: item.active }"
                            @click="setNewsTabActive1(item)"
                        >
                            {{ item.column_name }}
                        </text>
                    </view>
                    <view class="show-type-remark">
                        （可多选）
                    </view>
                </view>
                <view
                    class="show-type-hd"
                    style="top:216upx"
                >
                    <view class="show-type-text">
                        组 别：
                    </view>
                    <view class="show-type-list">
                        <text
                            v-for="(item, k) in formData.group"
                            :key="k"
                            class="show-type-title"
                            :class="
                                !formData.event[0].active
                                    ? 'disable'
                                    : item.active
                                        ? 'active'
                                        : ''
                            "
                            @click="setNewsTabActive2(item)"
                        >
                            {{ item.column_name }}
                        </text>
                    </view>
                    <view class="show-type-remark">
                        （可多选）
                    </view>
                </view>
            </view>
            <view
                class="content-box"
                style="height:633upx;margin-top:20upx;padding-top:114upx"
            >
                <view class="title">
                    参赛学校及联系人信息
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        所属地区：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.district"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            disabled
                            placeholder="请选择所属地区"
                            @tap="openAddres"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        学校名称：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.schoolName"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="20"
                            placeholder="请输入学校名称"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        提报人姓名：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="testInput"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="10"
                            placeholder="请输入提报人姓名"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        职 务：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.job"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="10"
                            placeholder="请输入职务"
                        >
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        联系电话：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.phone"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="11"
                            placeholder="请输入联系电话"
                        >
                    </view>
                </view>
            </view>
            <simple-address
                ref="simpleAddress"
                :picker-value-default="formData.districtCode"
                theme-color="#007AFF"
                @onConfirm="onConfirm"
            />
            <view
                class="btn"
                @click="handleSubmit"
            >
                提交报名信息
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import simpleAddress from './simple-address/simple-address.vue';

export default {
    components: {
        simpleAddress,
    },
    data() {
        return {
            formData: {
                event: [
                    { id: '1', column_name: '挑战类', active: true },
                    { id: '2', column_name: '才艺类', active: false },
                ],
                group: [
                    { id: '3', column_name: '小学组', active: false },
                    { id: '4', column_name: '中学组', active: false },
                ],
                eventText: [],
                groupText: [],
                district: '',
                districtCode: [0, 0, 0],
                schoolName: '',
                signName: '',
                job: '',
                phone: '',
            },
            index: 0,
            lock: true,
            testInput: '',
        };
    },
    watch: {
        testInput(v) {
            // if (String(v).indexOf('.') > 0){
            //     this.$nextTick(() => { //这里
            //         this.testInput= '';
            //     });
            // }
            this.$nextTick(() => {
                // 这里
                this.testInput = String(v).replace(/\d/g, '');
                this.formData.signName = this.testInput;
            });
        },
    },
    onLoad() {},
    created() {},
    onShow() {
        if (!this.isFirstGet) {
            this.getenrollinfo();
        }
    },
    onHide() {
        // this.resetData();
    },
    methods: {
        resetData() {
            this.formData = {
                event: [
                    { id: '1', column_name: '挑战类', active: false },
                    { id: '2', column_name: '才艺类', active: false },
                ],
                group: [
                    { id: '3', column_name: '小学组', active: false },
                    { id: '4', column_name: '中学组', active: false },
                ],
                eventText: [],
                groupText: [],
                district: '',
                districtCode: [0, 0, 0],
                schoolName: '',
                signName: '',
                job: '',
                phone: '',
                isFirstGet: false,
            };
            this.testInput = '';
        },
        openAddres() {
            this.$refs.simpleAddress.open();
        },
        onConfirm(e) {
            console.log(this.formData);
            console.log(e);
            console.log(e.label.replace(/-/g, ''));
            this.formData.district = e.label.replace(/-/g, '');
            this.formData.districtCode = e.value;
        },
        getenrollinfo() {
            uni.showLoading({
                mask: true,
            });
            return api.isLogin().then(() => {
                api.get('/api/activity/getenrollinfo?activity_id=7').then(
                    ({ detail, id }) => {
                        // console.log(detail, 'res122');
                        this.isFirstGet = true;
                        uni.hideLoading();
                        if (detail) {
                            this.formData = detail;
                            this.formData = {
                                ...detail,
                                eventText: [],
                                groupText: [],
                            };
                            this.id = id;
                            this.testInput = detail.signName;
                        }
                    },
                    (err) => {
                        uni.hideLoading();
                        uni.showToast({
                            icon: 'none',
                            title: err.message,
                        });
                        this.lock = true;
                    },
                );
            });
        },
        handleSubmit() {
            if (this.lock) {
                this.lock = false;
                // const formData = Object.assign({}, this.formData);
                console.log(this.formData, 'formData.group');
                if (
                    !this.formData.event[0].active
                    && !this.formData.event[1].active
                ) {
                    this.lock = true;
                    return this.errTip('请选择申报项目');
                }
                if (
                    this.formData.event[0].active
                    && !this.formData.group[0].active
                    && !this.formData.group[1].active
                ) {
                    this.lock = true;
                    return this.errTip('请选择组别');
                }
                if (!this.formData.district) {
                    this.lock = true;
                    return this.errTip('请选择所属地区');
                }
                if (!this.formData.schoolName) {
                    this.lock = true;
                    return this.errTip('请输入学校名称');
                }
                if (!this.formData.signName) {
                    this.lock = true;
                    return this.errTip('请输入提报人姓名');
                }
                if (!this.formData.job) {
                    this.lock = true;
                    return this.errTip('请输入职务');
                }
                if (!this.formData.phone) {
                    this.lock = true;
                    return this.errTip('请输入联系电话');
                }
                uni.showLoading();
                this.formData.event.forEach((item) => {
                    if (item.active) {
                        this.formData.eventText.push(item.column_name);
                    }
                });
                this.formData.group.forEach((item) => {
                    if (item.active) {
                        this.formData.groupText.push(item.column_name);
                    }
                });
                return api.isLogin().then(() => {
                    api.post(
                        `/api/activity/enroll?activity_id=7${
                            this.id ? `&id=${this.id}` : ''
                        }`,
                        {
                            detail: this.formData,
                        },
                    ).then(
                        () => {
                            uni.hideLoading();
                            uni.navigateTo({
                                url: '/pages/openGame/success',
                            });

                            this.lock = true;
                        },
                        (err) => {
                            uni.hideLoading();
                            uni.showToast({
                                icon: 'none',
                                title: err.message,
                            });
                            this.lock = true;
                        },
                    );
                });
            }
            return true;
        },

        setNewsTabActive1(item) {
            console.log(item, 'item.column_name');
            // eslint-disable-next-line no-param-reassign
            item.active = !item.active;
            if (item.column_name === '挑战类') {
                if (!item.active) {
                    this.formData.group[0].active = false;
                    this.formData.group[1].active = false;
                }
            }
        },
        setNewsTabActive2(item) {
            if (!this.formData.event[0].active) {
                return;
            }
            // eslint-disable-next-line no-param-reassign
            item.active = !item.active;
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    .main {
        // padding: 40upx 30upx;
        background: #f8f8f8;
        .content-box {
            position: relative;
            height: 256rpx;
            padding: 0 30upx;
            background: #fff;
            .show-type-hd {
                // display: flex;
                // align-items: center;
                position: absolute;
                top: 114upx;
                left: 30upx;
                height: 70upx;
                line-height: 70upx;
                view {
                    float: left;
                }
                .show-type-text {
                    margin-right: 16upx;
                    color: #999;
                    font-size: 28upx;
                    width: 168upx;
                }
                .show-type-remark {
                    font-size: 22upx;
                    color: rgba(153, 153, 153, 1);
                }
                .show-type-title {
                    margin-right: 30rpx;
                    padding: 0 40rpx;
                    height: 70rpx;
                    line-height: 70rpx;
                    color: #1166ff;
                    border: 1rpx solid #1166ff;
                    display: inline-block;
                    &.active {
                        background-color: #1166ff;
                        color: #fff;
                    }
                    &.disable {
                        background: rgba(255, 255, 255, 1);
                        border: 1rpx solid rgba(205, 205, 205, 1);
                        color: #bbbbbb;
                    }
                }
            }
            .show-type-input {
                margin-bottom: 32upx;
                height: 70upx;
                line-height: 70upx;
                view {
                    float: left;
                }
                .show-type-text {
                    margin-right: 16upx;
                    color: #999;
                    font-size: 28upx;
                    line-height: 70upx;
                    width: 168upx;
                }
                .uni-list-cell-db {
                    width: 499upx;
                    height: 70upx;
                }
                .show-type-title {
                    margin-right: 30rpx;
                    padding: 0 40rpx;
                    height: 70rpx;
                    line-height: 70rpx;
                    color: #1166ff;
                    border: 1rpx solid #1166ff;
                    display: inline-block;
                    &.active {
                        background-color: #1166ff;
                        color: #fff;
                    }
                }
            }
            .title {
                font-size: 30upx;
                position: absolute;
                top: 40upx;
                left: 42upx;
                &::after {
                    content: " ";
                    position: absolute;
                    top: 5rpx;
                    left: -9upx;
                    width: 4upx;
                    height: 30upx;
                    background: #1166ff;
                }
            }
            .content {
                font-size: 32upx;
                font-weight: 500;
                position: absolute;
                top: 114upx;
            }
            .sign-time {
                position: absolute;
                font-size: 24rpx;
                color: rgba(102, 102, 102, 1);
                top: 183upx;
            }
            .act-time {
                position: absolute;
                font-size: 24rpx;
                color: rgba(102, 102, 102, 1);
                right: 30upx;
                top: 183upx;
                &::before {
                    content: " ";
                    position: absolute;
                    top: 6upx;
                    left: -28upx;
                    width: 1rpx;
                    height: 24rpx;
                    background: rgba(221, 221, 221, 1);
                }
            }
        }
    }

    .uni-input {
        height: 70upx;
        box-sizing: border-box;
        line-height: 38upx;
        padding-left: 24upx;
    }

    .uni-textarea {
        height: 190upx;
        padding: 30upx 20upx;
        width: 100%;
        box-sizing: border-box;
        line-height: 42upx;
    }

    .fake-input {
        padding-top: 26upx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        margin-bottom: 40upx;
        font-size: 28upx;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
    }

    /deep/ .placeholder {
        color: #999;
        font-size: 28upx;
    }

    .btn {
        width: 100%;
        background: #1166ff;
        color: #fff;
        height: 98upx;
        line-height: 98upx;
        text-align: center;
        // margin-top: 80upx;
    }

    .upload-desc {
        font-size: 24rpx;
        color: #333;
        margin-bottom: 20rpx;
    }
}

.page-bind-mobile {
    .tip {
        font-size: 26rpx;
        color: #333;
        text-align: center;
        padding-top: 80rpx;
    }

    .form-item-wrap {
        padding: 0 65rpx;
        position: relative;

        .form-input {
            color: #333;
            font-size: 30rpx;
            border-bottom: 1rpx solid #d8d8d8;
            height: 90rpx;
            margin-top: 20rpx;
        }

        &.inValid {
            .form-input {
                border-bottom: 1rpx solid #fa6855;
            }
        }

        input::placeholder {
            color: #666;
        }

        .error-tip {
            color: #fa6855;
            font-size: 26rpx;
            height: 30rpx;
            margin-top: 10rpx;
        }

        .send-captcha {
            position: absolute;
            right: 65rpx;
            color: #1166ff;
            font-size: 30rpx;
            bottom: 25rpx;
            z-index: 100;

            &.is-send {
                color: #999;
                height: 50rpx;
                background: #eeeeee;
                padding: 0 10rpx;
                font-size: 28rpx;
                line-height: 50rpx;
            }
        }
    }
}
</style>
