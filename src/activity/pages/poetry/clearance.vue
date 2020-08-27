<template>
    <view>
        <login
            v-if="userInfo === null && toLogin"
            @login="onLogin"
        />
        <template v-else>
            通关页面 关卡页面 ，合计500关
            <button @click="jumpRecord">
                录制页面
            </button>
            <button @click="jumpVip">
                vip
            </button>
            <button @click="jumpBgList">
                音乐列表
            </button>
            <button @click="confirmUcenter">
                个人中心
            </button>
        </template>
    </view>
</template>
<script>
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        login,
    },
    data() {
        return {
            maskPrompt: false,
            userInfo: null,
            toLogin: false,
            hasLogin: false,
        };
    },
    onShow() {
        this.getUserinfo();
    },
    methods: {
        getUserinfo() {
            api.get('/api/user/info').then((res) => {
                this.hasLogin = true;
                this.userInfo = res.user_info;
            });
        },
        onLogin({ user_info: userInfo }) {
            this.hasLogin = true;
            this.toLogin = false;
            this.userInfo = userInfo;
        },
        jumpRecord() {
            uni.navigateTo({
                url: '/activity/pages/poetry/record',
            });
        },
        jumpVip() {
            uni.navigateTo({
                url: '/activity/pages/poetry/vip',
            });
        },
        jumpBgList() {
            uni.navigateTo({
                url: '/activity/pages/poetry/bgmusic',
            });
        },
        confirmUcenter() {
            if (!this.hasLogin) {
                this.toLogin = true;
            } else {
                this.jumpUcenter();
            }
        },
        jumpUcenter() {
            uni.navigateTo({
                url: `/activity/pages/poetry/ucenter?activity_id=14&user_id=${this.userInfo.user_id}`,
            });
        },
    },
};
</script>
<style scoped></style>
