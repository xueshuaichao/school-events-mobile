<template>
    <view>
        <login @login="onLogin" />
    </view>
</template>

<script>
import login from '../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {};
    },
    methods: {
        onLogin() {
            uni.navigateBack();
        },
    },
};
</script>
