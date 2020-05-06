<template>
    <view class="packet-rain">
        <view
            v-for="(item, index) in packetList"
            :key="index"
        >
            <image
                src=""
                mode=""
            />
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            packetList: [],
        };
    },
};
</script>
