<template>
    <view class="reset-school-page">
        <template v-if="type === 'school'">
            <view class="search-s-wrap">
                <input
                    v-model="schoolVal"
                    type="text"
                    class="school-input"
                    placeholder="请输入学校名"
                    @input="bindconfirm"
                >
            </view>
            <view>
                <view
                    v-for="(item, index) in schoolList"
                    :key="index"
                >
                    {{ item.name }}
                </view>
            </view>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            type: 'school',
            schoolVal: '',
            schoolList: [],
            lock: false,
            total: 0,
        };
    },
    methods: {
        bindconfirm() {
            console.log(this.schoolVal);
            if (!this.lock && this.schoolVal.length > 3) {
                this.lock = true;
                api.post('/api/school/list', {
                    page_num: 1,
                    page_size: 10,
                    keyword: this.schoolVal,
                }).then(
                    ({ list, total }) => {
                        this.lock = false;
                        this.schoolList = list;
                        this.total = total;
                    },
                    () => {
                        this.lock = false;
                    },
                );
            }
        },
    },
};
</script>
<style scoped lang="less">
.reset-school-page {
    padding: 30upx;
    .search-s-wrap {
        .school-input {
            width: 690upx;
            height: 80upx;
            border: 1upx solid #999;
            text-indent: 20upx;
        }
    }
}
</style>
