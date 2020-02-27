<template>
    <div>
        <Checkbox :checked.sync="single">
            全部
        </Checkbox>
        <view
            v-for="(item, k) in dataList"
            :key="k"
        >
            <Checkbox :checked.sync="single">
                {{ item.name }}
            </Checkbox>
            <text>查看原因</text>
        </view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            single: false,
            dataList: [
                {
                    name: '您的作品已通过审核',
                },
                {
                    name: '您的作品已通过审核',
                },
                {
                    name: '您的作品已通过审核',
                },
                {
                    name: '您的作品已通过审核',
                },
            ],
        };
    },
};
</script>

<style></style>
