<template>
    <view>
        <login
            :fr="fr"
            @login="onLogin"
            @binding="binding = true"
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
            binding: false,
        };
    },
    onLoad(params) {
        this.binding = false;
        const { fr } = params;
        this.fr = fr;
    },
    mounted() {
        console.log('mounted222');
    },
    methods: {
        onLogin() {
            uni.navigateBack();
        },
    },
    onShow() {
        console.log('loginOnshow触发11');
        const pages = getCurrentPages(); // eslint-disable-line
        console.log(pages, 'pages22211');
        const prevPage = pages[pages.length - 1]; // 上一页面
        // if(prevPage.route === "pages/login/login" && this.binding){
        if (this.binding) {
            this.binding = false;
            uni.showToast({
                title: '登录失败，请绑定手机号激活账号',
                icon: 'none',
            });
        }
        console.log(prevPage.route, 'prevPage11');
    },
};
</script>
