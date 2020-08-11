<template>
    <view class="reset-school-page">
        <template v-if="type === 'school'">
            <view
                class="search-s-wrap arror-wrap"
                :class="{ on: schoolList.length }"
            >
                <input
                    v-model="schoolVal"
                    type="text"
                    class="school-input"
                    placeholder="请输入您要修改后的学校"
                    @input="bindconfirm"
                >
            </view>
            <view
                v-if="schoolList.length"
                class="drop-wrap school"
            >
                <view
                    v-for="(item, index) in schoolList"
                    :key="index"
                    class="api-item"
                    @click="selSchool(item)"
                >
                    {{ item.name }}
                </view>
            </view>
        </template>
        <template v-else>
            <view
                class="search-g-wrap arror-wrap arror-wrap-r"
                :class="{ on: gradeList.length, on2: classList.length }"
            >
                <input
                    v-model="gradeVal"
                    type="text"
                    class="grade-input"
                    placeholder="请选择年级"
                >
                <input
                    v-model="classVal"
                    type="text"
                    class="class-input"
                    placeholder="请选择修改的班级"
                >
            </view>
            <view class="flex">
                <view
                    v-if="gradeList.length"
                    class="drop-wrap l"
                >
                    <view
                        v-for="(item, index) in gradeList"
                        :key="index"
                        class="api-item"
                        @click="selGrade(item)"
                    >
                        {{ item.grade_name }}
                    </view>
                </view>
                <view
                    v-if="classList.length"
                    class="drop-wrap r"
                >
                    <view
                        v-for="(item, index) in classList"
                        :key="index"
                        class="api-item"
                        @click="selClass(item)"
                    >
                        {{ item.class_name }}
                    </view>
                </view>
            </view>
        </template>
        <view
            class="btn"
            @click="next"
        >
            {{ type === "school" ? "下一步" : "确认修改" }}
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            type: 'school',
            schoolVal: '',
            gradeVal: '',
            classVal: '',
            schoolList: [],
            gradeList: [],
            classList: [],
            lock: false,
            formData: {
                school_id: 0,
                grade_id: 0,
                class_id: 0,
            },
        };
    },
    methods: {
        bindconfirm(e) {
            if (!this.lock && e.target.value.length) {
                this.lock = true;
                api.post('/api/school/list', {
                    page_num: 1,
                    page_size: 10,
                    keyword: e.target.value.trim(),
                }).then(
                    ({ list }) => {
                        this.lock = false;
                        if (
                            list.length === 1
                            && e.target.value.trim() === list[0].name
                        ) {
                            this.schoolList = [];
                            this.formData.school_id = list[0].id;
                        } else {
                            this.schoolList = list;
                            this.formData.school_id = 0;
                        }
                    },
                    () => {
                        this.lock = false;
                        this.formData.school_id = 0;
                    },
                );
            } else if (!e.target.value.length) {
                this.schoolList = [];
                this.formData.school_id = 0;
                this.lock = false;
            }
        },
        selSchool(item) {
            this.schoolVal = item.name;
            this.formData.school_id = item.id;
            this.schoolList = [];
        },
        selGrade(item) {
            this.gradeVal = item.grade_name;
            this.formData.grade_id = item.grade_id;
            this.classVal = '';
            this.formData.class_id = 0;
            this.classList = [];
            this.getClassList();
        },
        selClass(item) {
            this.classVal = item.name;
            this.formData.class_id = item.id;
            this.classVal = item.class_name;
        },
        getClassList() {
            api.post('/api/school/class', {
                school_id: this.formData.school_id,
                grade_id: this.formData.grade_id,
            }).then(
                (list) => {
                    this.classList = list;
                },
                () => {},
            );
        },
        getGradeList() {
            api.post('/api/school/grade', {
                school_id: this.formData.school_id,
            }).then(
                (list) => {
                    this.gradeList = list;
                },
                () => {},
            );
        },
        next() {
            if (this.type === 'school') {
                if (this.formData.school_id) {
                    this.type = 'grade';
                    this.getGradeList();
                } else {
                    uni.showToast({
                        icon: 'none',
                        title: '请输入学校',
                    });
                }
            } else if (!this.formData.grade_id || !this.formData.class_id) {
                uni.showToast({
                    icon: 'none',
                    title: '请选择年级和班级',
                });
            } else {
                uni.showModal({
                    title: '提示',
                    content: '是否确认修改为当前学校和班级？',
                    confirmText: '确定',
                    cancelText: '取消',
                    cancelColor: '#1166FF',
                    confirmColor: '#999999',
                    success: (res) => {
                        if (res.confirm) {
                            api.post(
                                '/api/school/upschoolstu',
                                this.formData,
                            ).then(() => {
                                uni.showToast({
                                    iocn: 'success',
                                    title: '修改成功',
                                });
                                setTimeout(() => {
                                    uni.navigateTo({
                                        url: '/pages/uc/setting/setting',
                                    });
                                }, 1600);
                            });
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    },
                });
            }
        },
    },
};
</script>
<style scoped lang="less">
.reset-school-page {
    padding: 30upx;
    .arror-wrap {
        position: relative;
        &::before {
            content: "";
            display: block;
            position: absolute;
            right: 24upx;
            top: 34upx;
            border-top: 16upx solid #d8d8d8;
            border-left: 12upx solid transparent;
            border-right: 10upx solid transparent;
        }
        &.on::before {
            transform: rotate(180deg);
        }
    }
    .arror-wrap-r {
        position: relative;
        &::after {
            content: "";
            display: block;
            position: absolute;
            left: 216upx;
            top: 36upx;
            border-top: 16upx solid #d8d8d8;
            border-left: 12upx solid transparent;
            border-right: 12upx solid transparent;
        }
        &.on2::before {
            transform: rotate(180deg);
        }
    }
    .search-s-wrap {
        width: 690upx;
        height: 88upx;
        border: 1upx solid #ccc;

        .school-input {
            width: 100%;
            height: 100%;
            padding: 0 50upx 0 20upx;
            box-sizing: border-box;
            border: none;
        }
    }
    .search-g-wrap {
        display: flex;
        height: 88upx;
        justify-content: space-between;
        .grade-input {
            width: 260upx;
            height: 100%;
            border: 1upx solid #ccc;
            padding: 0 50upx 0 20upx;
            box-sizing: border-box;
        }
        .class-input {
            width: 399upx;
            height: 100%;
            border: 1upx solid #ccc;
            text-indent: 20upx;
            padding: 0 50upx 0 20upx;
            box-sizing: border-box;
        }
    }
    .flex {
        display: flex;
        justify-content: space-between;
        .l {
            width: 260upx;
        }
        .r {
            width: 399upx;
        }
    }
    .drop-wrap {
        border: 1upx solid #ccc;
        border-top: none;
        height: auto;
        box-sizing: border-box;
        &.school {
            width: 690upx;
        }
        .api-item {
            line-height: 80upx;
            font-size: 28upx;
            text-indent: 20upx;
            color: #333;
        }
    }

    .btn {
        position: fixed;
        left: 30upx;
        bottom: 80upx;
        width: 690upx;
        height: 98upx;
        background: #1166ff;
        font-size: 32upx;
        line-height: 98upx;
        text-align: center;
        color: #fff;
    }
}
</style>
