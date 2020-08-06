<template>
    <view class="level-page">
        <view class="level-list">
            <view
                v-for="(item, index) in level"
                :key="index"
                class="level-row"
            >
                <view
                    v-for="key in item"
                    :key="key"
                    class="level-item"
                    :class="{
                        gift:
                            key === 0 ||
                            key === 2 ||
                            key === 5 ||
                            (key > 6 && (key + 1) % 5 === 0),
                        success: key + 1 < successLevel
                    }"
                    @click="jumpAnster(k + 1)"
                >
                    {{ key + 1 }}
                </view>
            </view>
            <uni-load-more
                class="loadMore"
                :status="loadMoreStatus"
                :content-text="{
                    contentdown: '上拉显示更多',
                    contentrefresh: '正在加载...',
                    contentnomore: '———— 已经到底了~ ————'
                }"
                color="#666"
            />
        </view>
    </view>
</template>

<script>
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';

export default {
    components: {
        uniLoadMore,
    },
    data() {
        return {
            filter: {
                page_size: 28,
                page_num: 0,
            },
            loadMoreStatus: 'none',
            init: true,
            level: [],
        };
    },
    created() {
        this.getSuccessLevel();
    },
    methods: {
        getSuccessLevel() {
            this.successLevel = 100;
            this.getlevel();
        },
        getlevel(type) {
            const newResult = this.sliceData(
                this.filter.page_size,
                this.filter.page_num,
                4,
                300,
            );
            if (type === 'reachBottom') {
                this.level = this.level.concat(newResult);
            } else {
                this.level = newResult;
            }
        },
        sliceData(pageSize, pageNum, num, max) {
            // 每个小数组的个数  max 最大长度
            const rowNum = num;
            let size = pageSize;
            this.loadMoreStatus = 'more';
            if (max - pageSize * pageNum <= 0) {
                this.loadMoreStatus = 'noMore';
                return false;
            }
            if (max - pageSize * pageNum < pageSize) {
                // 判断为最后一页并确定最后一页生成的数量
                size = max - pageSize * pageNum;
            }

            let list = [];
            list = Array.from(
                { length: size },
                (v, k) => k + pageSize * pageNum,
            );
            // 将数据拆成num个一组
            const result = [];
            for (let i = 0; i < list.length; i += rowNum) {
                result.push(list.slice(i, i + rowNum));
            }
            // 将偶数行数据颠倒
            return result.map((item, index) => (index % 2 !== 0 ? item.reverse() : item));
        },
        jumpAnster(index) {
            console.log(index);
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getlevel('reachBottom');
            }
        },
    },
};
</script>

<style lang="less" scoped>
.level-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 80upx;
    padding: 80upx;
    .level-item {
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
        background-color: royalblue;
        color: #fff;
        line-height: 100upx;
        text-align: center;
        font-size: 28upx;
        &.gift {
            background-color: #f00;
            &.success {
                background-color: #aaa;
            }
        }
        &.success {
            background-color: #ddd;
        }
    }
}
</style>
