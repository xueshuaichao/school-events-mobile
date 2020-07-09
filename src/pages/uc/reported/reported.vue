<template>
    <view class="page-reported">
        <view class="form-info">
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    活动名称
                </text>
                <view class="title form-item-cont">
                    青少年爱挑战
                </view>
            </view>
            <view class="uni-list-cell-db range-cont">
                <text class="form-item-text">
                    项目范围
                </text>
                <radio-group @change="radioChange">
                    <label
                        class="radio"
                    ><radio
                        value="1"
                        :checked="formData.resource_scope === '1'"
                        style="transform: scale(0.6);"
                        color="#1166FF"
                    />爱挑战竞技项目</label>
                    <label
                        class="radio"
                    ><radio
                        value="2"
                        :checked="formData.resource_scope === '2'"
                        style="transform: scale(0.6);"
                        color="#1166FF"
                    />爱挑战吉尼斯项目</label>
                </radio-group>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    参赛项目
                </text>
                <template v-if="catData.length === 0">
                    <view
                        class="form-item-cont"
                        @click="
                            disableSelect(catData.length === 0 ? false : true)
                        "
                    >
                        <view class="uni-input placeholder fake-input">
                            参赛项目
                        </view>
                    </view>
                </template>
                <template v-else>
                    <my-picker
                        class="form-item-cont"
                        :picker-list="catData"
                        :picker-key="{
                            value: 'cat_id',
                            label: 'name',
                            children: 'child'
                        }"
                        @confirm="confirm($event)"
                    >
                        <view>
                            <view
                                v-if="!formData.cat_id"
                                class="uni-input placeholder fake-input"
                            >
                                参赛项目
                            </view>
                            <view
                                v-else
                                class="uni-input fake-input"
                            >
                                {{ catText }}
                            </view>
                        </view>
                    </my-picker>
                </template>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;段
                </text>
                <view class="form-item-cont uni-input fake-input">
                    {{ stageData }}
                </view>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级
                </text>
                <template v-if="gradeData.length === 0">
                    <view
                        class="form-item-cont"
                        @click="
                            disableSelect(gradeData.length === 0 ? false : true)
                        "
                    >
                        <view class="uni-input placeholder fake-input">
                            请选择年级
                        </view>
                    </view>
                </template>
                <template v-else>
                    <picker
                        :value="index"
                        :range="gradeData"
                        range-key="grade_name"
                        class="form-item-cont"
                        @change="selectGrade"
                    >
                        <view
                            v-if="!formData.grade_id"
                            class="uni-input placeholder fake-input"
                        >
                            请选择年级
                        </view>
                        <view
                            v-else
                            class="uni-input fake-input"
                        >
                            {{ gradeData[gradeDataIndex].grade_name }}
                        </view>
                    </picker>
                </template>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    班&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;级
                </text>
                <template v-if="!formData.grade_id || classData.length === 0">
                    <view
                        class="form-item-cont"
                        @click="
                            disableSelect(
                                classData.length === 0 && formData.grade_id
                                    ? false
                                    : true,
                                0
                            )
                        "
                    >
                        <view class="uni-input placeholder fake-input">
                            请选择班级
                        </view>
                    </view>
                </template>
                <template v-else>
                    <picker
                        :value="classDataIndex"
                        :range="classData"
                        range-key="class_name"
                        class="form-item-cont"
                        @change="selectClass"
                    >
                        <view
                            v-if="!formData.class_id"
                            class="uni-input placeholder fake-input"
                        >
                            请选择班级
                        </view>
                        <view
                            v-else
                            class="uni-input fake-input"
                        >
                            {{ classData[classDataIndex].class_name }}
                        </view>
                    </picker>
                </template>
            </view>
            <view
                v-if="gradeType === 1"
                class="uni-list-cell-db"
            >
                <text class="form-item-text">
                    参赛姓名
                </text>
                <template
                    v-if="
                        !formData.class_id ||
                            !formData.grade_id ||
                            studentData.length === 0
                    "
                >
                    <view
                        class="form-item-cont"
                        @click="
                            disableSelect(
                                studentData.length === 0 &&
                                    formData.class_id &&
                                    formData.grade_id
                                    ? false
                                    : true,
                                1
                            )
                        "
                    >
                        <view class="uni-input placeholder fake-input">
                            请选择参赛者姓名
                        </view>
                    </view>
                </template>
                <template v-else>
                    <picker
                        :value="studentDataIndex"
                        :range="studentData"
                        range-key="student_name"
                        class="form-item-cont"
                        @change="selectStudents"
                    >
                        <view
                            v-if="!statudent.length"
                            class="uni-input placeholder fake-input"
                        >
                            请选择参赛者姓名
                        </view>
                        <view
                            v-else
                            class="uni-input fake-input"
                        >
                            {{ studentData[studentDataIndex].student_name }}
                        </view>
                    </picker>
                </template>
            </view>

            <view
                v-else
                class="uni-list-cell-db"
            >
                <text class="form-item-text">
                    参赛姓名
                </text>
                <template
                    v-if="
                        !formData.class_id ||
                            !formData.grade_id ||
                            studentData.length === 0
                    "
                >
                    <view
                        class="form-item-cont"
                        @click="
                            disableSelect(
                                studentData.length === 0 &&
                                    formData.class_id &&
                                    formData.grade_id
                                    ? false
                                    : true,
                                1
                            )
                        "
                    >
                        <view class="uni-input placeholder fake-input">
                            请选择参赛者姓名
                        </view>
                    </view>
                </template>
                <template v-else>
                    <my-picker
                        :picker-list="studentData"
                        :multiple="true"
                        :picker-key="{
                            value: 'user_id',
                            label: 'student_name'
                        }"
                        class="form-item-cont"
                        :checked-array="checkedStudents"
                        @confirm="selectAllStudent($event)"
                    >
                        <view>
                            <view
                                v-if="!statudentCheckbox.length"
                                class="uni-input placeholder fake-input "
                            >
                                请选择参赛者姓名
                            </view>
                            <view
                                v-else
                                class="uni-input fake-input student-list"
                            >
                                <view
                                    v-for="item in statudentCheckbox"
                                    :key="item.user_id"
                                    class="student-item"
                                >
                                    {{ item.student_name }}

                                    <image
                                        class="delete-btn"
                                        src="/static/images/uc/close.png"
                                        @click.stop="
                                            deleteStudent(item.user_id)
                                        "
                                    />

                                    <!-- <image @click="deleteStudent" src="" /> -->
                                </view>
                            </view>
                        </view>
                    </my-picker>
                </template>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    成&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;绩
                </text>
                <view
                    v-if="date"
                    class="achievement-dete form-item-cont"
                >
                    <input
                        v-model="achievementDateInfo.minutes"
                        class="uni-input"
                        type="number"
                        placeholder="分"
                        maxlength="2"
                        @input="achievementInputTime($event, 1)"
                    >
                    <text class="date-text">
                        分
                    </text>
                    <input
                        v-model="achievementDateInfo.seconds"
                        maxlength="2"
                        type="number"
                        class="uni-input"
                        placeholder="秒"
                        @input="achievementInputTime($event, 2)"
                    >
                    <text class="date-text">
                        秒
                    </text>
                    <input
                        v-model="achievementDateInfo.millisecond"
                        maxlength="2"
                        type="number"
                        class="uni-input"
                        @input="achievementInputTime($event, 3)"
                    >
                </view>
                <view
                    v-else
                    class="form-item-cont achievement-nor"
                >
                    <input
                        v-model="formData.achievement"
                        class="uni-input"
                        type="number"
                        placeholder="请输入成绩"
                    >
                    <text>{{ formData.achievement_unit }}</text>
                </view>
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    指导老师
                </text>
                <input
                    v-model="formData.teacher"
                    class="uni-input form-item-cont"
                    type="text"
                    placeholder="指导老师"
                >
            </view>
            <view class="uni-list-cell-db">
                <text class="form-item-text">
                    认&nbsp;&nbsp;证&nbsp;&nbsp;人
                </text>
                <input
                    v-model="formData.attestation_name"
                    class="uni-input form-item-cont"
                    type="text"
                    placeholder="认证官姓名"
                >
            </view>
            <upload
                :type="'video'"
                :source="formData.video_id"
                @change="updateVideo"
            />
            <upload
                :type="'image'"
                :source="formData.video_img_url"
                @change="updateImage"
            />
            <view class="button-cont">
                <view
                    class="btn"
                    @click="submitReporte"
                >
                    提交审核
                </view>
                <navigator
                    url="/pages/tabBar/uc/uc"
                    open-type="switchTab"
                    class="btn btn-nor"
                >
                    <view>取消</view>
                </navigator>
            </view>
            <view />
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import upload from '../../../components/upload/upload.vue';
import MyPicker from '../../../components/picker/picker.vue';

export default {
    components: {
        upload,
        MyPicker,
    },
    data() {
        return {
            formData: {
                resource_name: '青少年爱挑战',
                resource_scope: '1',
                cat_id: '',
                cat_name: '',
                education_level: '', // 学段
                create_info_array: [],
                grade_id: '',
                class_id: '',
                teacher: '', // 指导教师
                attestation_name: '', // 认证官姓名
                achievement_unit: '', // 单位
                achievement: '',
                type: 2,
                video_id: '',
                file_name: '',
                file_size: '',
                file_suffix: '',
                video_img_url: '',
                school_id: '',
            },
            gradeType: 1, // 参赛学生类型 1-个人 2团队
            statudentCheckbox: [],
            statudent: [],
            achievementDateInfo: {
                minutes: '',
                seconds: '',
                millisecond: '',
            },
            checkedStudents: [],
            catText: '',
            rangeIndex: 0, // 0-竞技 1-吉尼斯
            stageData: '',
            catDataArray: [],
            catData: [],
            gradeDataIndex: 0,
            gradeData: [],
            classDataIndex: 0,
            classData: [],
            studentData: [],
            studentDataIndex: 0,
            date: false,
            lock: true,
        };
    },
    methods: {
        achievementInputTime(e, type) {
            console.log(e.target.value);
            let val = e.target.value.match(/^\d*(\.?\d{0,3})/g)[0] || '';
            switch (type) {
                case 1:
                    if (val > 59) {
                        val = 59;
                    }
                    this.achievementDateInfo.minutes = val;
                    break;
                case 2:
                    if (val > 59) {
                        val = 59;
                    }
                    this.achievementDateInfo.seconds = val;
                    break;
                case 3:
                    if (val > 99) {
                        val = 59;
                    }
                    this.achievementDateInfo.millisecond = val;
                    break;
                default:
                    break;
            }
        },
        resetData() {
            this.formData = {
                ...this.formData,
                resource_scope: '1',
                cat_id: '',
                cat_name: '',
                education_level: '', // 学段
                create_info_array: [],
                grade_id: '',
                class_id: '',
                teacher: '', // 指导教师
                attestation_name: '', // 认证官姓名
                achievement_unit: '', // 单位
                achievement: '',
                type: 2,
                video_id: '',
                file_name: '',
                file_size: '',
                file_suffix: '',
                video_img_url: '',
            };
            this.rangeIndex = 0;
            this.catData = this.catDataArray[this.rangeIndex].child;
            this.checkedStudents = [];
            this.statudent = [];
            this.statudentCheckbox = [];
        },
        disableSelect(type, index = 0) {
            console.log(type);
            const textArr = ['年级', '年级和班级'];
            if (type) {
                return uni.showToast({
                    icon: 'none',
                    title: `请选择${textArr[index]}`,
                });
            }
            return uni.showToast({
                icon: 'none',
                title: '暂无数据',
            });
        },
        radioChange(e) {
            this.formData.cat_id = '';
            this.rangeIndex = e.detail.value - 1;
            this.catData = this.catDataArray[this.rangeIndex].child;
            this.formData.resource_scope = e.detail.value;
            this.statudent = [];
            this.statudentCheckbox = [];
        },
        getCatData() {
            api.get('/api/works/gradecategory').then((res) => {
                this.catDataArray = res;
                this.catData = this.catDataArray[this.rangeIndex].child;
            });
        },
        getUserInfo() {
            const stageList = [
                '幼儿园',
                '小学',
                '初中',
                '小学+初中',
                '高中',
                '初中+高中',
                '小学+初中+高中',
            ];
            api.get('/api/user/info').then(({ user_info: userInfo }) => {
                const { stage, school_id: schoolId } = userInfo;
                this.formData.school_id = schoolId;
                this.stageData = stageList[stage - 1];
                this.formData.education_level = stage;
                this.getGrade();
            });
        },
        getGrade() {
            // 获取年级  传 school_id 学校id
            api.get('/api/school/grade', {
                school_id: this.formData.school_id,
            }).then((res) => {
                this.gradeData = res;
            });
        },
        selectGrade(e) {
            const id = this.formData.grade_id;
            this.gradeDataIndex = e.detail.value;
            this.formData.grade_id = this.gradeData[
                this.gradeDataIndex
            ].grade_id;
            if (id !== this.formData.grade_id) {
                this.formData.class_id = '';
                this.formData.statudentCheckbox = [];
            }
            this.getClass();
        },
        getClass() {
            // 获取班级 传 school_id 学校id  grade_id 年级id
            api.get('/api/school/class', {
                school_id: this.formData.school_id,
                grade_id: this.formData.grade_id,
            }).then((res) => {
                console.log(res);
                this.classData = res;
            });
        },
        selectClass(e) {
            const id = this.formData.class_id;
            this.classDataIndex = e.detail.value;
            this.formData.class_id = this.classData[this.classDataIndex].id;
            if (id !== this.formData.class_id) {
                if (this.gradeType === 1) {
                    this.statudent = [];
                } else {
                    this.statudentCheckbox = [];
                }
                // this.formData.create_info_array = [];
            }
            this.getStudents();
        },
        getStudents() {
            if (this.gradeType === 1) {
                this.statudent = [];
            } else {
                this.statudentCheckbox = [];
            }
            // this.formData.create_info_array = [];
            // 获取学生 传 school_id 学校id  grade_id 年级id class_id 班级 id
            api.get('/api/school/listgrade', {
                school_id: this.formData.school_id,
                grade_id: this.formData.grade_id,
                class_id: this.formData.class_id,
            }).then((res) => {
                console.log(res);
                this.studentData = res;
            });
        },
        selectStudents(e) {
            console.log(e);
            this.studentDataIndex = e.detail.value;
            this.statudent.push({
                user_id: this.studentData[this.studentDataIndex].user_id,
                student_name: this.studentData[this.studentDataIndex]
                    .student_name,
            });
        },
        selectAllStudent(picked) {
            this.checkedStudents = picked.values;
            this.statudentCheckbox = [];
            this.studentData.forEach((item) => {
                picked.values.forEach((id) => {
                    if (item.user_id === Number(id)) {
                        this.statudentCheckbox.push({
                            user_id: id,
                            student_name: item.student_name,
                        });
                    }
                });
            });
        },
        deleteStudent(id) {
            const index = this.checkedStudents.findIndex(item => item === id);
            const studentIndex = this.statudentCheckbox.findIndex(
                item => item.user_id === id,
            );
            this.statudentCheckbox.splice(studentIndex, 1);
            this.checkedStudents.splice(index, 1);
        },
        confirm(picked) {
            console.log(picked);
            this.formData.cat_id = picked.value;
            this.formData.cat_name = picked.label;
            this.catText = picked.label;
            this.result = this.catData;

            // 取出最后一级数据 用于获取当前选中数据
            picked.values.forEach((item, index) => {
                if (index < picked.values.length - 1) {
                    this.getLastCat(this.result, item);
                }
            });
            this.handleAchievement(
                this.result.find(v => v.cat_id === picked.value),
            );
        },
        getLastCat(arr, id) {
            this.result = arr.find(v => v.cat_id === id).child;
            console.log(this.result);
        },
        handleAchievement({ unit, more_people: morePeople }) {
            this.date = !unit || unit === '秒';
            this.formData.achievement_unit = this.date ? '秒' : unit;
            this.gradeType = morePeople;
        },
        updateVideo(data) {
            this.formData = {
                ...this.formData,
                video_id: data.video_id,
                file_name: data.tempFilePath.substring(
                    data.tempFilePath.lastIndexOf('/') + 1,
                ),
                file_size: data.size,
                file_suffix: data.tempFilePath.split('.').pop() || '',
            };
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

        getTimeSeconds({ minutes, seconds, millisecond }) {
            return (minutes / 1) * 60 + seconds / 1 + millisecond / 100;
        },
        onValidate() {
            let status = true;
            this.formData.create_info_array = [];
            if (this.gradeType === 1) {
                this.formData.create_info_array = this.statudent;
            } else {
                this.formData.create_info_array = this.statudentCheckbox;
            }
            const validateObj = {
                teacher: '请输入指导教师', // 指导教师
                attestation_name: '请输入认证关姓名', // 认证官姓名
                cat_id: '请选择参赛项目',
                grade_id: '请选择年级',
                class_id: '请选择班级',
                video_id: '请上传视频',
                create_info_array: '请选择参赛学生',
                achievement: '请输入成绩',
            };
            try {
                Object.keys(validateObj).forEach((item) => {
                    if (item === 'create_info_array') {
                        if (this.formData[item].length === 0) {
                            throw Error(item);
                        }
                    } else if (!this.formData[item]) {
                        throw Error(item);
                    }
                });
            } catch (e) {
                status = false;
                uni.showToast({
                    title: validateObj[e.message],
                    icon: 'none',
                });
                this.lock = true;
            }
            return status;
        },
        submitReporte() {
            if (this.lock) {
                this.lock = false;
                // return this.resetData();
                if (this.date) {
                    this.formData.achievement = this.getTimeSeconds(
                        this.achievementDateInfo,
                    );
                }
                if (this.onValidate()) {
                    uni.showLoading();
                    if (this.rangeIndex === 0) {
                        if (this.gradeType === 1) {
                            this.formData.resource_scope = 1;
                        } else {
                            this.formData.resource_scope = 2;
                        }
                        this.formData.parent_scope = 1;
                    } else {
                        this.formData.resource_scope = 6;
                        this.formData.parent_scope = 4;
                    }
                    api.post('/api/works/uploadgrade', this.formData).then(
                        (res) => {
                            console.log(res);
                            this.resetData();
                            uni.hideLoading();
                            uni.navigateTo({
                                url: '/pages/uc/reported/result',
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
                }
            }
        },
    },
    onload() {
        this.getUserInfo();
    },
    onShow() {
        this.getCatData();
        this.getUserInfo();
    },
};
</script>

<style lang="less">
.page-reported {
    padding: 40upx 30upx 0;
    .title {
        height: 88upx;
        line-height: 88upx;
        padding: 0 24upx;
        font-size: 28upx;
        background-color: #f2f2f2;
    }
    .range-cont {
        display: flex;
        justify-content: space-between;
        font-size: 28upx;
        align-items: center;
        .rage-text {
            color: #333;
        }
        .radio {
            margin-right: 20upx;
            font-size: 28upx;
            color: #999;
        }
    }
    .uni-list-cell-db {
        display: flex;
        align-items: center;
        margin-bottom: 40upx;
        .form-item-text {
            width: 120upx;
            margin-right: 16upx;
            font-size: 28upx;
            color: #333;
        }
        .form-item-cont {
            flex: 1;
        }
    }
    .achievement-dete {
        display: flex;
        align-items: center;
        font-size: 28upx;
        input {
            width: 125upx;
        }
        .date-text {
            display: inline-block;
            margin: 0 10upx;
        }
    }
    .achievement-nor {
        display: flex;
        align-items: center;
        font-size: 28upx;
        color: #333;
        input {
            flex: 1;
            margin-right: 5upx;
            color: #000;
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
    .comp-upload {
        margin-bottom: 40upx;
    }

    /deep/ .placeholder {
        color: #999;
        font-size: 28upx;
    }
    .placeholder {
        color: #999;
    }
    .fake-input {
        padding-top: 26upx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        font-size: 28upx;
    }
    .student-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        height: auto;
        padding: 14upx 8upx 9upx 24upx;
        .student-item {
            padding: 14upx 42upx;
            background-color: #ecf3ff;
            color: #1166ff;
            margin-right: 16upx;
            margin-bottom: 16upx;
            position: relative;
            .delete-btn {
                position: absolute;
                bottom: 0;
                right: 0;
                width: 35upx;
                height: 27upx;
            }
        }
    }
    .button-cont {
        display: flex;
        justify-content: space-between;
        margin-bottom: 35upx;
        .btn {
            width: 333upx;
            height: 98upx;
            line-height: 98upx;
            text-align: center;
            color: #fff;
            background-color: #1166ff;
            box-sizing: border-box;
            border: 1upx solid #1166ff;
            font-size: 32rpx;
            .nor {
                background-color: #fff;
                color: #1166ff;
            }
        }
    }
}
</style>
