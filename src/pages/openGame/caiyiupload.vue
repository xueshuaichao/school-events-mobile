<template>
    <view
        v-if="!isLoading"
        class="page-upload"
    >
        <view
            class="selection"
            style="padding-top:114upx"
        >
            <view class="label">
                选择类别
            </view>
            <view class="items">
                <div
                    v-for="item in catData"
                    :key="item.cat_id"
                    class="item"
                    :class="{ active: formData.cat_id === item.cat_id }"
                    @click="onSelectCat(item)"
                >
                    {{ item.name }}
                </div>
            </view>
        </view>
        <view
            v-show="needTab"
            class="selection bb-sep"
        >
            <view class="label">
                表现形式
            </view>
            <view class="items">
                <text
                    v-for="(item, k) in tabs"
                    :key="item.id"
                    class="item"
                    :class="{ active: newsTabActiveIndex === k }"
                    @click="setNewsTabActive(k)"
                >
                    {{ item.column_name }}
                </text>
            </view>
        </view>
        <view class="selection">
            <view class="uni-form-item uni-column bt-sep">
                <input
                    v-model="formData.resource_name"
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    :placeholder="
                        (uploadMode === 'video' ? '视频' : '作品') +
                            '名称*（不超过30字）'
                    "
                >
            </view>
            <textarea
                v-model="formData.introduce"
                class="uni-textarea"
                placeholder-class="placeholder"
                :placeholder="
                    (uploadMode === 'video' ? '视频' : '作品') +
                        '介绍（不超过80字）'
                "
            />
            <upload
                v-if="uploadMode === 'video'"
                :type="'video'"
                @change="updateVideo"
            />
            <upload
                v-if="uploadMode === 'video'"
                :type="'image'"
                :count="1"
                @change="updateImage"
            />
        </view>
        <!-- <view
            class="content-box"
            style="margin-top:20upx;padding-top:114upx;"
            v-if="identity!==4"
        >
            <view class="title">
                参赛人信息
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">*</text>
                    地市：
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
                    <text style="color:red">*</text>
                    参赛者姓名
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.create_info"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="参赛者姓名"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">*</text>
                    学校名称：
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.school_name"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="学校名称："
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">*</text>
                    学 段：
                </view>
                <view class="uni-list-cell-db">
                    <picker
                        :value="formData.education_level - 1"
                        :range="educationData"
                        @change="onEducationSelect"
                    >
                        <input
                            v-model="formData.education_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            disabled
                            placeholder="请选择学段"
                        >
                    </picker>
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">*</text>
                    年 级：
                </view>
                <view class="uni-list-cell-db">
                    <picker
                        :value="formData.grade_id - 1"
                        :range="gradeData"
                        @change="onGradeSelect"
                    >
                        <input
                            v-model="formData.grade_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            disabled
                            placeholder="请选择年级"
                        >
                    </picker>
                </view>
            </view>
        </view> -->
        <!-- <view class="uni-form-item uni-column">
            <input
                v-model="formData.recommend"
                class="uni-input"
                placeholder-class="placeholder"
                maxlength="30"
                placeholder="推荐机构名称(选填)"
            >
        </view> -->

        <!-- <view class="uni-form-item uni-column">
            <input
                v-model="formData.teacher"
                class="uni-input"
                placeholder-class="placeholder"
                maxlength="30"
                placeholder="指导老师姓名(选填)"
            >
        </view> -->

        <view
            class="btn"
            @click="upload"
        >
            上传
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import upload from '../../components/upload/upload.vue';
import config from '../../common/config';

export default {
    components: {
        upload,
    },
    data() {
        return {
            disabled: false,
            // #ifdef H5
            isH5: true,
            // #endif

            uploadFileUrl: `${config.host}/api/file/uploadfile`,

            isLoading: false,

            tabs: [
                { id: '1', column_name: '视频' },
                { id: '2', column_name: '图片' },
            ],
            images: [],

            newsTabActiveIndex: 0,
            needTab: false,
            uploadMode: 'video',

            formData: {
                activity_id: 3,
                cat_id: 16,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
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
                    name: '歌唱',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-16',
                    resource_type: 1,
                },
                {
                    cat_id: 17,
                    name: '舞蹈',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-17',
                    resource_type: 1,
                },
                {
                    cat_id: 18,
                    name: '口才',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-18',
                    resource_type: 1,
                },
                {
                    cat_id: 19,
                    name: '乐器',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-19',
                    resource_type: 1,
                },
                {
                    cat_id: 21,
                    name: '书画',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-21',
                    resource_type: 2,
                },
                {
                    cat_id: 20,
                    name: '创意',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-20',
                },
                {
                    cat_id: 23,
                    name: '杂技',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-23',
                    resource_type: 1,
                },
                {
                    cat_id: 24,
                    name: '魔术',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-24',
                    resource_type: 1,
                },
                {
                    cat_id: 101,
                    name: '摄影',
                    parent_id: 3,
                    cat_level: 2,
                    cat_tree: '3-101',
                    resource_type: 2,
                },
            ],
            title: 'picker',
            index: 0,
        };
    },
    onLoad() {},
    created() {},
    onShow() {},
    methods: {
        resetForm() {
            this.formData = {
                activity_id: 3,
                cat_id: 16,
                resource_name: '',
                introduce: '',
                type: 2,

                video_id: '',
                video_img_url: '',
                teacher: '',
                recommend: '',
            };
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
                if (!this.isH5) {
                    data.forEach((item) => {
                        this.$refs.preview.add(item.path);
                    });
                    setTimeout(() => {
                        this.$refs.preview.init();
                    }, 100);
                } else {
                    data.forEach((item) => {
                        if (this.images.length >= 10) {
                            this.errTip('最多选择10张图片');
                        } else {
                            let suffix = '';
                            try {
                                suffix = item.path.split('.').pop();
                                // eslint-disable-next-line no-empty
                            } catch {}
                            if (
                                ['jpg', 'jpeg', 'png', 'gif'].indexOf(
                                    suffix.toLowerCase(),
                                ) !== -1
                            ) {
                                this.images.push({
                                    url: item.path,
                                    type: 'image',
                                    fileName: 'xxx.png',
                                });
                            }
                        }
                    });
                }
            }
        },
        onSelectCat(item) {
            this.needTab = false;
            this.formData.cat_id = item.cat_id;
            const resourceType = item.resource_type;

            if (resourceType === 1) {
                this.uploadMode = 'video';
            } else if (resourceType === 2) {
                this.uploadMode = 'image';
            } else {
                this.needTab = true;
                this.newsTabActiveIndex = 0;
                this.uploadMode = 'video';
            }

            console.log(this.formData);
        },
        errTip(title) {
            uni.showToast({
                icon: 'none',
                title,
                // duration: 200000,
            });
        },

        upload() {
            if (this.disabled) {
                return false;
            }
            const formData = Object.assign({}, this.formData);
            // 移除首尾空格
            formData.resource_name = formData.resource_name.replace(
                /(^\s*)|(\s*$)/g,
                '',
            );

            if (this.uploadMode === 'video') {
                formData.resource_type = 1;
                if (!formData.resource_name) {
                    return this.errTip('请输入视频名称');
                }
                if (!formData.cat_id) {
                    return this.errTip('请选择视频分类');
                }
                if (!formData.video_id) {
                    return this.errTip('请上传视频文件');
                }
                // if (!formData.video_img_url) {
                //     return this.errTip('请上传视频封面');
                // }
            } else {
                formData.resource_type = 2;
                if (!formData.resource_name) {
                    return this.errTip('请输入作品名称');
                }
                if (!formData.cat_id) {
                    return this.errTip('请选择作品分类');
                }
                formData.img = this.isH5
                    ? this.images.map(elem => elem.url)
                    : this.$refs.preview.dump();
                if (!formData.img.length) {
                    return this.errTip('请上传作品图片');
                }
            }

            uni.showLoading();
            this.disabled = true;
            // check input
            console.log(this.formData);
            return api.post('/api/user/editwork', formData).then(
                (res) => {
                    this.resetForm();
                    this.disabled = false;
                    console.log(res);
                    uni.hideLoading();
                    uni.navigateTo({
                        url:
                            '/pages/upload/result/result?type=success&from=openGame',
                    });
                },
                (err) => {
                    this.disabled = false;
                    uni.hideLoading();
                    uni.showToast({
                        icon: 'none',
                        title: err.message,
                    });
                },
            );
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const title = '青少年网络活动大赛';
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/openEvent-banner.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            path: '/pages/openGame/zhibo-list',
        };
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    background: #f8f8f8;
    // padding: 30rpx;

    // .main {
    //     border-radius: 20rpx;
    //     padding: 40upx 30upx;
    //     background: #ffd583;
    //     color: #c9ac67;
    // }

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

    .bt-sep {
        margin-top: 40rpx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        // margin-bottom: 40rpx;
        font-size: 28rpx;
        margin-bottom: 40upx;
        // background: #ffedc3;
        // border-radius: 12rpx;
        // color: #9d7c2f;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        color: #c9ac67;

        .cover-wrap {
            background: #1166ff;

            .icon-desc {
                color: #c9ac67;
            }
        }
        .desc {
            color: #999999;
            line-height: 32upx;
            &.image {
                line-height: 32upx;
            }
        }
        .normal-text {
            display: inline-flex;
            background-color: #1166ff;
            border-radius: 25upx;
            padding: 0 29upx;
            height: 40upx;
            line-height: 40upx;
            font-size: 24upx;
            margin-top: 4upx;
        }
        .comp-title {
            color: #1166ff;
        }
        .text-success {
            color: #fff;
            line-height: 16upx;
        }
        .tips {
            color: #1166ff;
        }
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
    }

    .panel-hd {
        margin: 0 0 40rpx 0;
        text-align: center;
    }

    .upload-desc {
        font-size: 24rpx;
        color: #c9ac67;
        margin-bottom: 20rpx;
    }

    .selection {
        font-size: 28rpx;
        padding: 30upx;
        position: relative;
        margin-bottom: 30upx;
        background: #fff;
        .label {
            font-size: 30upx;
            position: absolute;
            top: 40upx;
            left: 45upx;
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

        .items {
            margin-right: -20rpx;
        }

        .item {
            padding: 0 24rpx;
            height: 88rpx;
            line-height: 88rpx;
            width: 60upx;
            border: 1upx solid #1166ff;
            display: inline-block;
            margin-right: 30rpx;
            text-align: center;
            color: #1166ff;
            margin-bottom: 30rpx;

            &.active {
                background: #1166ff;
                color: #fff;
            }
        }
    }
    .content-box {
        position: relative;
        padding: 30upx;
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
                position: relative;
                width: 499upx;
                height: 70upx;
                .rule-btn {
                    border: 1px solid #1166ff;
                    color: #1166ff;
                    width: 272upx;
                    height: 70upx;
                    text-align: center;
                    line-height: 70upx;
                }
                .unit-class {
                    position: absolute;
                    top: 0upx;
                    left: 454upx;
                }
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
            left: 45upx;
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
</style>
