<template>
    <view class="page-upload">
        <view class="main">
            <view class="uni-form-item uni-column">
                <input
                    class="uni-input"
                    placeholder-class="placeholder"
                    maxlength="30"
                    placeholder="视频名称*（不超过30字）"
                >
            </view>

            <view class="uni-list-cell-db">
                <picker
                    :value="index"
                    :range="catData"
                    :range-key="'name'"
                    @change="onSelect"
                >
                    <view
                        v-if="!this.formData.cat_id"
                        class="uni-input placeholder"
                    >
                        选择分类
                    </view>
                    <view
                        v-if="this.formData.cat_id"
                        class="uni-input"
                    >
                        {{ catData[this.index].name }}
                    </view>
                </picker>
            </view>

            <view class="uni-textarea">
                <textarea
                    auto-height
                    placeholder-class="placeholder"
                    placeholder="视频介绍（不超过500字）"
                />
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            formData: {
                cat_id: '',
            },
            catData: [],
            title: 'picker',
            array: ['中国', '美国', '巴西', '日本'],
            index: 0,
            time: '12:01',
        };
    },
    onLoad() {},
    created() {
        this.getData();
    },
    methods: {
        getData() {
            api.get('/api/works/childcat', {
                cat_id: 3,
            }).then((res) => {
                this.catData = res;
            });
        },
        onSelect(e) {
            this.index = e.detail.value;
            const catId = this.catData[this.index].cat_id;
            this.formData.cat_id = catId;
            console.log(this.formData);
        },
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    .main {
        padding: 40upx 30upx;
    }

    .uni-input {
        height: 88upx;
        line-height: 88upx;
        padding-left: 24upx;
    }

    .uni-textarea {
        height: 190upx;
        padding: 30upx 24upx;
    }

    .uni-input,
    .uni-textarea {
        border: 1upx solid #ccc;
        margin-bottom: 40upx;
    }

    /deep/ .placeholder {
        color: #999;
        font-size: 28upx;
    }
}
</style>
