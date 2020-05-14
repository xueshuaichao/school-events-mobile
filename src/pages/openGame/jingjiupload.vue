<template>
    <view :class="['page-upload', { 'stop-scroll': prompt }]">
        <view
            class="content-box"
            style="padding-top:114upx"
        >
            <view class="title">
                参赛项目信息
            </view>
            <view
                v-if="!id"
                class="show-type-input"
            >
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    项目范围:
                </view>
                <view class="uni-list-cell-db">
                    <picker
                        :value="resourceIndex"
                        :range="scopeData[type]"
                        :range-key="'name'"
                        @change="onScopeSelect"
                    >
                        <input
                            v-model="formData.resource_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            disabled
                            placeholder="请选择项目范围"
                        >
                    </picker>
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    项目名称:
                </view>
                <view class="uni-list-cell-db">
                    <picker
                        :value="catIndex"
                        :range="catData"
                        :range-key="'cat_name'"
                        :disabled="id"
                        @change="onSelect"
                    >
                        <input
                            v-model="formData.cat_name"
                            class="uni-input"
                            placeholder-class="placeholder"
                            maxlength="30"
                            disabled
                            placeholder="请选择项目名称"
                        >
                    </picker>
                </view>
            </view>
            <!-- <view class="show-type-input">
                <view class="show-type-text">
                    项目规则：
                </view>
                <view class="uni-list-cell-db">
                    <view class="rule-btn" @click="prompt = !prompt">
                        点击查看项目规则
                    </view>
                </view>
            </view> -->
            <view
                class="show-type-input"
                style="height:100upx"
            >
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    上传视频:
                </view>
                <view class="uni-list-cell-db">
                    <upload
                        :type="'video'"
                        :name="false"
                        :source="formData.video_id"
                        @change="updateVideo"
                    />
                </view>
            </view>
            <view
                class="show-type-input"
                style="height:100upx"
            >
                <view class="show-type-text">
                    视频封面:
                </view>
                <view class="uni-list-cell-db">
                    <template>
                        <upload
                            :type="'image'"
                            :name="false"
                            :source="formData.video_img_url"
                            @change="updateImage"
                        />
                    </template>
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    成绩:
                </view>
                <view
                    class="uni-list-cell-db"
                    style="width: 437rpx;"
                >
                    <input
                        v-model="achivementInput"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="8"
                        placeholder="成绩"
                    >
                    <text class="unit-class">
                        {{ formData.achievement_unit }}
                    </text>
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    指导老师:
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="teacherInput"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="18"
                        placeholder="指导老师"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    认证官姓名:
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="attestationInput"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="18"
                        placeholder="认证官姓名"
                    >
                </view>
            </view>
        </view>
        <view
            v-if="identity !== 4"
            class="content-box"
            style="margin-top:20upx;padding-top:114upx;"
        >
            <view class="title">
                参赛人信息
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    地市:
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
                    <text style="color:red">
                        *
                    </text>
                    参赛者姓名:
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="createInput"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="18"
                        placeholder="参赛者姓名"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    学校名称:
                </view>
                <view class="uni-list-cell-db">
                    <input
                        v-model="formData.school_name"
                        class="uni-input"
                        placeholder-class="placeholder"
                        maxlength="30"
                        placeholder="学校名称"
                    >
                </view>
            </view>
            <view class="show-type-input">
                <view class="show-type-text">
                    <text style="color:red">
                        *
                    </text>
                    学 段:
                </view>
                <view class="uni-list-cell-db">
                    <picker
                        :value="formData.education_level - 2"
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
                    <text style="color:red">
                        *
                    </text>
                    年 级:
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
        </view>
        <simple-address
            ref="simpleAddress"
            :picker-value-default="formData.districtCode"
            :city-code="formData.city"
            :county-code="formData.county"
            theme-color="#007AFF"
            @onConfirm="onConfirm"
            @initDistrictLabel="initDistrictLabel"
        />
        <view
            class="btn"
            @click="upload"
        >
            {{ id ? "编辑作品" : "上传作品" }}
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import upload from '../../components/upload/upload.vue';
import simpleAddress from './simple-address/simple-address.vue';

export default {
    components: {
        upload,
        simpleAddress,
    },
    data() {
        return {
            disabled: false,
            // #ifdef H5
            isH5: true,
            // #endif
            images: [],
            prompt: false,
            newsTabActiveIndex: 0,
            needTab: false,
            formData: {
                resource_scope: '',
                resource_name: '',
                cat_id: 16,
                education_level: 2,
                education_name: '',
                cat_name: '',
                achievement: '',
                achievement_unit: '个',
                attestation_name: '',
                districtCode: [0, 0, 0],
                video_id: '',
                video_img_url: '',
                file_name: '',
                file_size: '',
                file_suffix: '',
                teacher: '',
                school_name: '',
                grade_id: 1,
                grade_name: '',
                create_info: '',
                city: '',
                county: '',
            },
            gradeData: [
                '一年级',
                '二年级',
                '三年级',
                '四年级',
                '五年级',
                '六年级',
                '七年级',
                '八年级',
                '九年级',
                '高一',
                '高二',
                '高三',
            ],
            educationData: [
                '小学',
                '初中',
                '小学+初中',
                '高中',
                '初中+高中',
                '小学+初中+高中',
            ],
            scopeData: {
                jingji: [
                    {
                        name: '爱挑战个人',
                        id: 1,
                        cat_id: 1,
                    },
                    {
                        name: '爱挑战团队',
                        id: 2,
                        cat_id: 2,
                    },
                ],
                jinisi: [
                    {
                        name: '吉尼斯个人',
                        id: 1,
                        cat_id: 113,
                    },
                    {
                        name: '吉尼斯团队',
                        id: 2,
                        cat_id: 125,
                    },
                ],
            },
            catData: [],
            title: 'picker',
            resourceIndex: 0,
            catIndex: 0,
            identity: '',
            type: 'jingji',
            achivementInput: '',
            teacherInput: '',
            attestationInput: '',
            createInput: '',
            id: 0,
        };
    },
    onLoad({ type, id }) {
        this.type = type;
        this.id = id;
        if (id) {
            api.get('/api/works/detail', { id: this.id }).then((data) => {
                this.formData = { ...this.formData, ...data };
                this.formData.video_id = data.video.video_id;
                this.formData.resource_id = id;
                this.achivementInput = data.achievement;
                this.teacherInput = data.teacher || '';
                this.createInput = data.create_name;
                this.attestationInput = data.attestation_name || '';

                this.formData.education_name = this.educationData[
                    data.education_level - 2
                ];
                this.formData.grade_name = this.gradeData[data.grade_id];
                this.formData.file_size = data.video.file_size;
                this.formData.file_name = data.video.file_name;
                this.formData.file_suffix = data.video.file_suffix;
                console.log(data);
            });
        }
        let txt = '吉尼斯项目作品上传';
        if (id) {
            txt = '作品编辑';
        } else if (type === 'jingji') {
            txt = '竞技项目作品上传';
        }
        uni.setNavigationBarTitle({
            title: txt,
        });
    },
    watch: {
        achivementInput(v) {
            this.$nextTick(() => {
                // 这里
                const foo = String(v).replace(/[^0-9.]/g, '');
                if (foo.includes('.') && foo.split('.')[1].length > 4) {
                    // return false;
                    this.achivementInput = `${foo.split('.')[0]}.${foo
                        .split('.')[1]
                        .substr(0, 3)}`;
                } else {
                    this.achivementInput = foo;
                    this.formData.achievement = this.achivementInput;
                }
            });
        },
        teacherInput(v) {
            this.$nextTick(() => {
                // 这里
                this.teacherInput = String(v).replace(/\d/g, '');
                this.formData.teacher = this.teacherInput;
            });
        },
        attestationInput(v) {
            this.$nextTick(() => {
                // 这里
                this.attestationInput = String(v).replace(/\d/g, '');
                this.formData.attestation_name = this.attestationInput;
            });
        },
        createInput(v) {
            this.$nextTick(() => {
                // 这里
                this.createInput = String(v).replace(/\d/g, '');
                this.formData.create_info = this.createInput;
            });
        },
    },
    created() {
        this.getUserInfo();
    },
    onShow() {},
    methods: {
        initDistrictLabel(arr) {
            if (!this.formData.district) {
                this.formData.district = `陕西省${arr[0]}${arr[1]}`;
                this.formData.districtCode = [0, arr[2], arr[3]];
            }
        },
        getUserInfo() {
            api.get('/api/user/info').then(
                (res) => {
                    // this.userInfo = res.user_info;
                    this.identity = res.user_info.identity;
                    console.log(res);
                    this.isLoading = false;
                },
                () => {
                    this.userInfo = {};
                    this.isLoading = false;
                },
            );
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
            this.formData.city = `${e.cityCode}00`;
            this.formData.county = e.areaCode;
        },
        resetForm() {
            this.formData = {
                cat_id: 16,
                resource_name: '',
                type: 2,
                video_id: '',
                video_img_url: '',
                teacher: '',
                resource_scope: '',
                education_level: 2,
                education_name: '',
                cat_name: '',
                achievement: '',
                achievement_unit: '个',
                attestation_name: '',
                districtCode: [0, 0, 0],
                file_name: '',
                file_size: '',
                file_suffix: '',
                school_name: '',
                grade_id: 1,
                grade_name: '',
                create_info: '',
                city: '',
                county: '',
            };
            this.achivementInput = '';
            this.teacherInput = '';
            this.attestationInput = '';
            this.createInput = '';
        },
        updateVideo(data) {
            console.log(data, 'data121');
            this.formData.file_size = data.size;
            this.formData.video_id = data.video_id;
            this.formData.file_name = data.tempFilePath;
            const foo = data.tempFilePath.split('.');
            this.formData.file_suffix = foo[foo.length - 1];
        },

        updateImage(data) {
            console.log(data, 'data33');
            this.formData.video_img_url = data[0] && data[0].path;
        },
        // 项目范围
        onScopeSelect(e) {
            this.resourceIndex = e.detail.value;
            this.formData.resource_name = this.scopeData[this.type][
                e.detail.value
            ].name;
            this.formData.resource_scope = this.scopeData[this.type][
                e.detail.value
            ].id;
            this.catIndex = 0;
            this.formData.cat_name = '';
            this.getallcategory(
                this.scopeData[this.type][e.detail.value].cat_id,
            );
        },
        onSelect(e) {
            this.catIndex = e.detail.value;
            if (this.catData.length > 0) {
                this.formData.cat_id = this.catData[e.detail.value].cat_id;
                this.formData.cat_name = this.catData[e.detail.value].cat_name;
                this.formData.achievement_unit = this.catData[
                    e.detail.value
                ].unit;
            }
        },
        getallcategory(id) {
            return api.get(`/api/works/getallcategory?cid=${id}`).then(
                (data) => {
                    this.catData = data;
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
        onGradeSelect(e) {
            this.formData.grade_id = Number(e.detail.value) + 1;
            this.formData.grade_name = this.gradeData[e.detail.value];
        },
        onEducationSelect(e) {
            this.formData.education_level = Number(e.detail.value) + 2;
            this.formData.education_name = this.educationData[e.detail.value];
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
            if (!formData.resource_name) {
                return this.errTip('请选择项目范围');
            }
            if (!formData.cat_name) {
                return this.errTip('请选择项目名称');
            }
            if (!formData.video_id) {
                return this.errTip('请上传视频');
            }
            if (!formData.achievement.trim()) {
                return this.errTip('请填写成绩');
            }
            if (!formData.county && this.identity !== 4) {
                return this.errTip('请选择地市');
            }
            if (!formData.create_info.trim() && this.identity !== 4) {
                return this.errTip('请填写参赛者姓名');
            }
            if (!formData.school_name.trim() && this.identity !== 4) {
                return this.errTip('请选择学校名称');
            }
            if (!formData.education_name && this.identity !== 4) {
                return this.errTip('请选择学段');
            }
            if (!formData.grade_name && this.identity !== 4) {
                return this.errTip('请选择年级');
            }

            uni.showLoading();
            this.disabled = true;
            // check input
            console.log(this.formData);
            return api.post('/api/works/uploadraceresult', formData).then(
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
                'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/logo-h5.png',

            path: '/pages/tabBar/index/index',
        };
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    overflow: hidden;
    .prompt {
        background: rgba(0, 0, 0, 0.8);
        // opacity:0.49;
        width: 100%;
        height: 100vh;
        z-index: 999;
        position: absolute;

        .prompt-box {
            width: 670upx;
            height: 1056upx;
            padding: 30upx;
            position: absolute;
            left: 40upx;
            top: 128upx;
            box-sizing: border-box;
            background: #fff;

            .prompt-title {
                position: relative;
                height: 98upx;
                line-height: 98upx;
                text-align: center;
                border-bottom: 1upx solid #d8d8d8;
                color: #000;
                .icon-del {
                    position: absolute;
                    width: 34upx;
                    height: 34upx;
                    top: 33upx;
                    right: 0upx;
                }
            }
            .prompt-content {
                max-length: 760upx;
                overflow-y: scroll;
                color: #666666;
                margin-top: 30upx;
            }
            .prompt-btn {
                height: 98upx;
                line-height: 98upx;
                text-align: center;
                background: #1166ff;
                position: absolute;
                width: 610rpx;
                bottom: 30rpx;
                color: #fff;
            }
        }
    }
    background: #f8f8f8;
    // padding: 30rpx;
    // background: #ffd583;
    // color: #c9ac67;
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
                top: 7rpx;
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

    .bt-sep {
        margin-top: 40rpx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        margin-bottom: 40upx;
        font-size: 28upx;
    }

    /deep/ .comp-upload {
        margin-bottom: 40upx;
        // color: #c9ac67;

        // .cover-wrap {
        //     // background: #1166FF;

        //     .icon-desc {
        //         color: #c9ac67;
        //     }
        // }
        // .desc {
        //     color: #999999;
        //     line-height: 32upx;
        //     &.image {
        //         line-height: 32upx;
        //     }
        // }
        // .normal-text {
        //     display: inline-flex;
        //     background-color: #1166FF;
        //     border-radius: 25upx;
        //     padding: 0 29upx;
        //     height: 40upx;
        //     line-height: 40upx;
        //     font-size: 24upx;
        //     margin-top: 4upx;
        // }
        // .comp-title {
        //     color: #1166FF;
        // }
        .text-success {
            // color: #fff;
            line-height: 16upx;
        }
        // .tips {
        //     color: #1166FF;
        // }
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

        .label {
            color: #ff3849;
            margin-bottom: 15rpx;
        }

        .items {
            margin-right: -20rpx;
        }

        .item {
            // width: 110rpx;
            padding: 0 24rpx;
            height: 56rpx;
            line-height: 56rpx;
            border: 1px solid #ff3849;
            border-radius: 28rpx;
            display: inline-block;
            margin-right: 20rpx;
            text-align: center;
            color: #ff3849;
            margin-bottom: 20rpx;

            &.active {
                background: #ff3849;
                color: #fff;
            }
        }
    }
}
.stop-scroll {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
