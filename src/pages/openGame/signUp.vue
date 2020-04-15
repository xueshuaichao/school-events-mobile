<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            v-if="!needBindMobile"
            class="main"
        >
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
                            v-for="(item, k) in tabs"
                            :key="k"
                            class="show-type-title"
                            :class="{ active: newsTabActiveIndex === k }"
                            @click="setNewsTabActive(k)"
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
                        申报项目：
                    </view>
                    <view class="show-type-list">
                        <text
                            v-for="(item, k) in tabs"
                            :key="k"
                            class="show-type-title"
                            :class="{ active: newsTabActiveIndex === k }"
                            @click="setNewsTabActive(k)"
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
                        <picker
                            :value="index"
                            :range="catData"
                            :range-key="'name'"
                            @change="onSelect"
                        >
                            <view
                                v-if="!formData.cat_id"
                                class="uni-input placeholder fake-input"
                            >
                                选择所属地区
                            </view>
                            <view
                                v-if="formData.cat_id"
                                class="uni-input fake-input"
                            >
                                {{ catData[index].name }}
                            </view>
                        </picker>
                    </view>
                </view>
                <view class="show-type-input">
                    <view class="show-type-text">
                        学校名称：
                    </view>
                    <view class="uni-list-cell-db">
                        <input
                            v-model="formData.resource_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
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
                            v-model="formData.resource_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
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
                            v-model="formData.resource_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
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
                            v-model="formData.resource_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            placeholder="请输入联系电话"
                        >
                    </view>
                </view>
            </view>
            <view
                class="btn"
                @click="upload"
            >
                上传
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
// import simpleAddress from './simple-address/simple-address.vue';

export default {
    components: {
        // simpleAddress,
    },
    data() {
        return {
            isLoading: true,

            tabs: [
                { id: '1', column_name: '挑战类' },
                { id: '2', column_name: '才艺类' },
            ],
            tabs1: [
                { id: '3', column_name: '小学组' },
                { id: '4', column_name: '中学组' },
            ],
            images: [],

            newsTabActiveIndex: 0,
            uploadMode: 'video',

            formData: {
                cat_id: '',
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
            },
            accountData: {
                mobile: '',
                verify_code: '',
                isValid: true,
                msg: '',
            },
            captcha: {
                create_at: '',
                remain: '',
                isSend: false,
            },
            needBindMobile: false,
            catData: [
                {
                    cat_id: 16,
                    name: '歌唱表演',
                    parent_id: 3,
                    unit: null,
                    cat_level: 2,
                    cat_tree: '3-16',
                },
                {
                    cat_id: 17,
                    name: '舞蹈表演',
                    parent_id: 3,
                    unit: null,
                    cat_level: 2,
                    cat_tree: '3-17',
                },
            ],
            index: 0,
            lock: true,
        };
    },
    onLoad() {},
    created() {},
    onShow() {
        // this.getData();
    },
    methods: {
        resetData() {
            this.formData = {
                ...this.formData,
                cat_id: '',
                resource_name: '',
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
                img: [],
            };
            this.newsTabActiveIndex = 0;
            this.uploadMode = 'video';
            this.images = [];
        },
        setNewsTabActive(index) {
            this.newsTabActiveIndex = index;
            if (index === 0) {
                this.uploadMode = 'video';
                this.formData.video_img_url = '';
            } else {
                this.uploadMode = 'image';
                this.formData.video_img_url = '';
            }
        },
        updateVideo(data) {
            this.formData.video_id = data.video_id;
        },

        updateImage(data) {
            this.formData.video_img_url = data[0] && data[0].path;
            if (this.uploadMode === 'image') {
                data.forEach((item) => {
                    this.$refs.preview.add(item.path);
                });
                setTimeout(() => {
                    this.$refs.preview.init();
                }, 100);
            }
        },
        // getData() {
        //     console.log(this.needBindMobile, '我要秀才艺');
        //     // this.isLoading = true;
        //     api.get('/api/works/childcat', {
        //         cat_id: 3,
        //     }).then((res) => {
        //         this.catData = res;
        //     });

        //     api.get('/api/user/info').then(
        //         (res) => {
        //             this.needBindMobile = res.user_info && res.user_info.is_bind_mobile === 0;
        //             this.userInfo = res.user_info;
        //             this.isLoading = false;
        //         },
        //         () => {
        //             this.isLoading = false;
        //             this.needBindMobile = false;
        //             // uni.switchTab({
        //             //     url: '/pages/tabBar/uc/uc',
        //             // });
        //         },
        //     );
        // },

        countDown() {
            const sep = 30 * 1000;
            const now = new Date() - 0;
            const duration = this.captcha.create_at + sep - now;

            if (duration > 0) {
                this.captcha.remain = Math.round(duration / 1000);

                setTimeout(() => {
                    this.countDown();
                }, 300);
            } else {
                this.captcha.isSend = false;
            }
        },

        sendCaptcha() {
            console.log('-000');
            this.captcha.create_at = new Date() - 0;
            this.captcha.remain = 30;
            this.captcha.isSend = true;

            // 切换绑定手机号接口
            api.get('/api/account/sendbindmsg', {
                phone: this.accountData.mobile,
            }).then(
                () => {
                    try {
                        this.countDown();
                    } catch (e) {
                        console.log(e);
                    }
                },
                err => uni.showToast({
                    icon: 'none',
                    title: err.message,
                }),
            );
        },

        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            console.log(this.formData);
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },
        bindMobile() {
            const { mobile } = this.accountData;
            const captcha = this.accountData.verify_code;

            console.log(mobile);
            if (mobile.length !== 11 || mobile[0] !== '1') {
                this.accountData.isValid = false;
                this.accountData.msg = '手机号码不正确';
                return false;
            }
            this.accountData.isValid = true;

            if (!captcha) {
                return uni.showToast({
                    icon: 'none',
                    title: '请输入验证码',
                });
            }

            // api bind mobile
            return api
                .post('/api/account/bindphone', {
                    phone: mobile,
                    captcha,
                })
                .then(
                    () => {
                        this.needBindMobile = false;
                        return uni.showToast({
                            icon: 'none',
                            title: '绑定成功！',
                        });
                    },
                    err => uni.showToast({
                        icon: 'none',
                        title: err.message,
                    }),
                );
        },
        upload() {
            if (this.lock) {
                this.lock = false;
                const formData = Object.assign({}, this.formData);

                if (this.uploadMode === 'video') {
                    formData.resource_type = 1;
                    if (!formData.resource_name) {
                        this.lock = true;
                        return this.errTip('请输入视频名称');
                    }
                    if (!formData.cat_id) {
                        this.lock = true;
                        return this.errTip('请选择视频分类');
                    }
                    if (!formData.video_id) {
                        this.lock = true;
                        return this.errTip('请上传视频文件');
                    }
                    // if (!formData.video_img_url) {
                    //     return this.errTip('请上传视频封面');
                    // }
                } else {
                    formData.resource_type = 2;
                    if (!formData.resource_name) {
                        this.lock = true;
                        return this.errTip('请输入作品名称');
                    }
                    if (!formData.cat_id) {
                        this.lock = true;
                        return this.errTip('请选择作品分类');
                    }
                    formData.img = this.$refs.preview.dump();
                    if (!formData.img.length) {
                        this.lock = true;
                        return this.errTip('请上传作品图片');
                    }
                }

                uni.showLoading();
                return api.isLogin().then(() => {
                    api.post('/api/user/editwork', formData).then(
                        () => {
                            uni.hideLoading();
                            uni.navigateTo({
                                url: '/pages/upload/result/result?type=success',
                            });
                            this.resetData();
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
        height: 88upx;
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
        margin-top: 80upx;
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
