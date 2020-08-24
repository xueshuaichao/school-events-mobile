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
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages();
            if (pages.length > 1) {
                if (this.isH5) {
                    window.history.back();
                } else {
                    uni.navigateBack();
                }
            } else {
                uni.getStorage({
                    key: 'tabBarPath',
                    success: ({ data }) => {
                        if (data) {
                            uni.switchTab({
                                url: `/${data}`,
                            });
                        }
                        uni.removeStorage({ key: 'tabBarPath' });
                    },
                    fail: () => {
                        uni.switchTab({
                            url: '/pages/tabBar/index/index',
                        });
                    },
                });
            }
        },
    },
};
</script>
<style lang="less" scoped>
.custom-header-title {
    text-align: center;
}
</style>
