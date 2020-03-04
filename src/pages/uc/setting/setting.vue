<template>
    <view class="page-setting">
        <view
            class="item"
            @click="settingImg"
        >
            <text class="text">
                头像
            </text>
            <img
                class="img"
                :src="imgSrc"
                alt=""
            >
        </view>
        <view class="item">
            <text class="text">
                姓名
            </text>
            <text v-if="userData.identity !== 1">
                {{ userData.name }}
            </text>
            <input
                v-else
                type="text"
                :value="userData.name"
            >
        </view>
        <template v-if="userData.identity === 1">
            <!-- 普通用户 -->
            <view class="item">
                <text class="text">
                    用户名
                </text>
                <text>吴红月</text>
            </view>
        </template>
        <template v-if="userData.identity === 2">
            <!-- 教育局员工 -->
            <view class="item">
                <text class="text">
                    部门
                </text>
                <text>前端研发部</text>
            </view>
        </template>
        <template v-if="userData.identity === 3">
            <!-- 老师 -->
            <view class="item">
                <text class="text">
                    权限
                </text>
                <text>老师</text>
            </view>
        </template>
        <template v-if="userData.identity === 4">
            <view class="item">
                <text class="text">
                    学校
                </text>
                <text>{{ userData.school }}</text>
            </view>
            <view class="item">
                <text class="text">
                    班级
                </text>
                <text>{{ userData.class }}</text>
            </view>
        </template>
        <view class="item">
            <text class="text">
                用户名
            </text>
            <text>{{ userData.nickName }}</text>
            <input
                type="text"
                :value="userData.nickName"
            >
        </view>
        <view class="item">
            <text class="text">
                重置密码
            </text>
            <view class="arrow">
                <image
                    class="arrow-r"
                    src="/static/images/uc/r-arrow.png"
                />
            </view>
        </view>
        <view class="item">
            <text>绑定手机号</text>
            <text>{{ userData.phone }}</text>
        </view>
    </view>
</template>
<script>
import config from '../../../common/config';
import utils from '../../../common/utils';
import api from '../../../common/api';

export default {
    data() {
        return {
            userData: {
                imgSrc: '',
                name: '',
                school: '',
                class: '',
                nickName: '',
                phone: '',
                identity: '',
            },
        };
    },
    methods: {
        getUcData() {
            api.get('/api/weixin/getshareconfig').then((data) => {
                this.userData = data;
            });
        },
        settingImg() {
            uni.chooseImage({
                count: this.count,
                success: (res) => {
                    Promise.all(
                        res.tempFilePaths.map(filePath => this.uploadFile(filePath)),
                    ).then((data) => {
                        console.log(data);
                    });
                    this.imgSrc = res.tempFilePaths;
                },
            });
        },
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                        file_type: 1, // 1-image 2-video
                    },
                    header: {
                        userKey: utils.getToken(),
                    },
                    success: (uploadFileRes) => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: '服务器开小差了~',
                                icon: 'none',
                            });
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            // success
                            this.url = resp.data.path;
                            uni.hideToast();
                            resolve(resp.data);
                            // this.$emit('change', resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: 'none',
                            });
                            return reject(resp.msg);
                        }
                        return false;
                    },
                });
            });
        },
    },
};
</script>
<style lang="less">
.page-setting {
    padding: 4rpx 32rpx 0;
    .item {
        height: 110rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1rpx solid #ddd;
        font-size: 30rpx;
    }
    .img {
        width: 92rpx;
        height: 92rpx;
        border-radius: 50%;
    }
    .arrow {
        color: #333;
    }
    .arrow-r {
        width: 12upx;
        height: 22upx;
    }
}
</style>
