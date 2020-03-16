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
            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    onLoad(params) {
        const { fr } = params;
        this.fr = fr;
    },
    methods: {
        onLogin() {
            if (this.isH5) {
                window.history.back();
            } else {
                uni.navigateBack();
            }
        },
    },
};
</script>
