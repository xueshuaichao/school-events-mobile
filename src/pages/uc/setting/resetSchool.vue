<template>
    <view class="reset-school-page">
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
            :class="{ hide: !showSchool || !schoolList.length }"
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
        <view
            class="btn"
            @click="next"
        >
            下一步
        </view>
    </view>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            schoolVal: '',
            schoolList: [],
            lock: false,
            formData: {
                school_id: 0,
            },
            showSchool: false,
        };
    },
    methods: {
        bindconfirm(e) {
            if (!this.lock && e.target.value.length) {
                this.showSchool = true;
                this.lock = true;
                api.post('/api/school/list', {
                    page_num: 1,
                    page_size: 10,
                    keyword: e.target.value.trim(),
                }).then(
                    ({ list }) => {
                        this.lock = false;
                        this.schoolList = list;
                        this.formData.school_id = 0;
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
            this.showSchool = false;
        },
        next() {
            if (this.formData.school_id) {
                uni.navigateTo({
                    url: `/pages/uc/setting/resetClass?id=${this.formData.school_id}`,
                });
            } else {
                uni.showToast({
                    icon: 'none',
                    title: '请输入学校',
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
    }
    .search-s-wrap {
        width: 690upx;
        height: 88upx;
        border: 1upx solid #ccc;
        box-sizing: border-box;

        .school-input {
            width: 100%;
            height: 100%;
            padding: 0 50upx 0 20upx;
            box-sizing: border-box;
            border: none;
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
