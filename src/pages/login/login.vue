<template>
    <view>
        <login
            :fr="fr"
            @login="onLogin"
        />
    </view>
</template>

<script>
import login from '../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {
            fr: '',
        };
    },
    onLoad(params) {
        const { fr } = params;
        this.fr = fr;
    },
    methods: {
        onLogin() {
            uni.navigateBack();
        },
    },
};
</script>
