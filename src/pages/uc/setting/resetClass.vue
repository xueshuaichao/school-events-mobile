<template>
    <view class="reset-school-page">
        <view
            class="search-g-wrap arror-wrap arror-wrap-r"
            :class="{ on: showGrade, on2: showClass }"
        >
            <input
                v-model="gradeVal"
                type="text"
                class="grade-input"
                placeholder="请选择年级"
                @focus="showGrade = true"
            >
            <input
                v-model="classVal"
                type="text"
                class="class-input"
                placeholder="请选择修改的班级"
                @focus="showClass = true"
            >
        </view>
        <view class="flex">
            <scroll-view
                scroll-y
                :style="{
                    height:
                        gradeList.length < 10
                            ? 84 * gradeList.length + 'rpx'
                            : '840rpx'
                }"
                class="drop-wrap l"
                :class="{ hide: !showGrade || !gradeList.length }"
            >
                <view
                    v-for="(item, index) in gradeList"
                    :key="index"
                    class="api-item"
                    @click="selGrade(item)"
                >
                    {{ item.grade_name }}
                </view>
            </scroll-view>
            <scroll-view
                scroll-y
                :style="{
                    height:
                        classList.length < 10
                            ? 84 * classList.length + 'rpx'
                            : '840rpx'
                }"
                class="drop-wrap r"
                :class="{ hide: !showClass || !classList.length }"
            >
                <view
                    v-for="(item, index) in classList"
                    :key="index"
                    class="api-item"
                    @click="selClass(item)"
                >
                    {{ item.class_name }}
                </view>
            </scroll-view>
        </view>
        <view
            class="btn"
            @click="next"
        >
            确认修改
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            gradeVal: '',
            classVal: '',
            gradeList: [],
            classList: [],
            showGrade: false,
            showClass: false,
            formData: {
                school_id: 0,
                grade_id: 0,
                class_id: 0,
            },
        };
    },
    onLoad({ id }) {
        this.formData.school_id = id;
        this.getGradeList();
    },
    methods: {
        selGrade(item) {
            this.gradeVal = item.grade_name;
            this.formData.grade_id = item.grade_id;
            this.classVal = '';
            this.formData.class_id = 0;
            this.classList = [];
            this.showGrade = false;
            this.getClassList();
        },
        selClass(item) {
            this.classVal = item.name;
            this.showClass = false;
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
            if (!this.formData.grade_id || !this.formData.class_id) {
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
                    cancelColor: '#999999',
                    confirmColor: '#1166FF',
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
        &.hide {
            opacity: 0;
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
