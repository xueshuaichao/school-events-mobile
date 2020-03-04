<template>
    <view class="page-reported">
        <view class="title">
            青少年爱挑战
        </view>
        <view class="form-info">
            <view class="uni-list-cell-db">
                <my-picker
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
                            v-if="!catText"
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
            </view>
            <view class="uni-list-cell-db">
                <view class="uni-input fake-input">
                    {{ stageData }}
                </view>
            </view>
            <view class="uni-list-cell-db">
                <picker
                    :value="index"
                    :range="gradeData"
                    range-key="grade_name"
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
            </view>
            <view class="uni-list-cell-db">
                <picker
                    :value="classDataIndex"
                    :range="classData"
                    range-key="class_name"
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
            </view>
            <view class="uni-list-cell-db">
                <picker
                    :value="studentDataIndex"
                    :range="studentData"
                    range-key="name"
                    @change="onSelect"
                >
                    <view
                        v-if="!formData.student_id"
                        class="uni-input placeholder fake-input"
                    >
                        请选择参赛者姓名
                    </view>
                    <view
                        v-else
                        class="uni-input fake-input"
                    >
                        {{ studentData[studentDataIndex].name }}
                    </view>
                </picker>
            </view>
            <view class="uni-form-item uni-column">
                <input
                    v-model="formData.teacher"
                    class="uni-input"
                    type="text"
                    placeholder="成绩"
                >
                <input
                    v-model="formData.teacher"
                    class="uni-input"
                    type="text"
                    placeholder="指导老师"
                >
                <input
                    v-model="formData.name"
                    class="uni-input"
                    type="text"
                    placeholder="认证官姓名"
                >
            </view>
            <upload
                :type="'video'"
                @change="updateVideo"
            />
            <upload
                :type="'image'"
                @change="updateImage"
            />

            <!-- <view
                class="btn"
                @click="upload"
            >
                上传
            </view> -->
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
            navActiveIndex: 0,
            formData: {
                cat_id: [],
                grade_id: '',
                class_id: '',
                student_id: '',
                resource_name: '',
                introduce: '',
                type: 2,
                video_id: '',
                video_img_url: '',
            },
            catText: '',
            rangeIndex: 0,
            schoolId: '',
            stageData: '',
            catData: [],
            gradeDataIndex: 0,
            gradeData: [],
            classDataIndex: 0,
            classData: [],
            studentData: [],
            studentDataIndex: 0,
            range: [
                {
                    name: '爱挑战-个人',
                    id: 1,
                },
                {
                    name: '爱挑战-团队',
                    id: 2,
                },
            ],
        };
    },
    methods: {
        getCatData() {
            api.get('/api/works/gradecategory').then((res) => {
                this.catData = res[this.rangeIndex].child;
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
                this.schoolId = schoolId;
                this.stageData = stageList[stage - 1];
                this.getGrade();
            });
        },
        getGrade() {
            // 获取年级  传 school_id 学校id
            api.get('/api/school/grade', {
                school_id: this.schoolId,
            }).then((res) => {
                this.gradeData = res;
            });
        },
        selectGrade() {
            this.formData.grade_id = this.gradeData[
                this.gradeDataIndex
            ].grade_id;
            this.getClass();
        },
        getClass() {
            // 获取班级 传 school_id 学校id  grade_id 年级id
            api.get('/api/school/class', {
                school_id: this.schoolId,
                grade_id: this.formData.grade_id,
            }).then((res) => {
                console.log(res);
                this.classData = res;
            });
        },
        selectClass() {
            this.formData.class_id = this.classData[this.classDataIndex].id;
            this.getStudents();
        },
        getStudents() {
            // 获取学生 传 school_id 学校id  grade_id 年级id class_id 班级 id
            api.get('/api/school/listgrade', {
                school_id: this.schoolId,
                grade_id: this.formData.grade_id,
                class_id: this.formData.class_id,
            }).then((res) => {
                this.studentData = res;
            });
        },
        confirm(picked) {
            this.formData.cat_id = picked.values;
            this.catText = picked.labels.join(',');
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
        onSelectCat(e) {
            this.catIndex = e.detail.cat_id;
            this.formData.range_id = this.range[this.catIndex].id;
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
        margin-bottom: 21upx;
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
        margin-bottom: 40upx;
        font-size: 28upx;
    }
}
</style>
