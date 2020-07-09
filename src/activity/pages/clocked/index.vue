<template>
    <!--打卡活动-->
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll': maskPrompt
            }
        ]"
    >
        <indexPage
            :index-config="indexConfig"
            :public-config="publicConfig"
            :is-stop-scroll="false"
            class-name="brand-page"
            :fr="fr"
            :hide-button="true"
            :my-work-path="myWorkPath"
            @showMask="showMask"
        >
            <template v-slot:main-data>
                <view class="roster-list">
                    hhhhhhh
                </view>
            </template>
        </indexPage>
    </view>
</template>
<script>
import indexPage from '../common/index.vue';
import logger from '../../../common/logger';

export default {
    components: {
        indexPage,
    },
    data() {
        return {
            publicConfig: {},
            indexConfig: {},
            fr: '',
            maskPrompt: false,
            activityId: 10,
            myWorkPath: '',
        };
    },
    created() {
        this.publicConfig = {
            ...this.$store.getters.getPublicConfig(this.activityId),
            ...this.$store.getters.getColorConfig({
                activityId: this.activityId,
                page: 'indexColorConfig',
            }),
        };
        this.indexConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'indexConfig',
        });
        this.fr = logger.getFr(this.publicConfig.log, {});
        // this.myWorkPath = `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.userid}`;
    },
    methods: {
        showMask({ title, type }) {
            console.log(title, type);
        },
    },
};
</script>
<style scoped lang="less">
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.activity-init-page {
}
</style>
