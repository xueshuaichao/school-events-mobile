<template>
    <view>
        <text>资讯详情 {{ id }}</text>
    </view>
</template>

<script>
export default {
    data() {
        return {
            id: '',
        };
    },
    methods: {
        getData(id) {
            this.id = id;
        },
    },
    onLoad(query) {
        const { id } = query;
        this.getData(id);
    },
};
</script>
