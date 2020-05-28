<template>
    <view>
        <children
            v-if="activityId === 9"
            ref="myChildren"
            :activity-id="activityId"
            :canvas-image="canvasImg"
            @createPoster="createPoster"
        />
        <poster
            v-if="!isH5 && showPoster"
            id="poster"
            :config="posterCommonConfig"
            :hide-loading="true"
            @success="onPosterSuccess"
            @fail="onPosterFail"
        />
    </view>
</template>
<script>
import children from './children/demo.vue';
import share from '../../common/share';

export default {
    components: {
        children,
    },
    data() {
        return {
            activityId: '',
            activityName: [
                {
                    id: 9,
                    title: '七彩童年，快乐成长秀风采',
                },
            ],
            canvasImg: '',
            showPoster: false,
            posterCommonConfig: {
                pixelRatio: 2,
                width: 538,
                height: 760,
                debug: false,
                images: [],
            },
            posterWin: true,
        };
    },
    methods: {
        createPoster(config) {
            this.posterCommonConfig = config;
            this.showPoster = true;
            this.$nextTick(() => {
                this.poster = this.selectComponent('#poster');
                this.poster.onCreate(this.posterCommonConfig);
            });
        },
        onPosterSuccess({ detail }) {
            this.$refs.myChildren.onPosterSuccess(detail);
        },
        onPosterFail(err) {
            this.$refs.myChildren.onPosterFail(err);
        },
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[0];
            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
            });
        },
    },
    onUnload() {
        console.log(this.$refs.myChildren);
        this.$refs.myChildren.unload();
    },
    onLoad(params) {
        this.activityId = Number(params.activity_id);
        const title = this.activityName.filter(v => v.id === this.activityId)[0].title
            || '活动';
        uni.setNavigationBarTitle({ title });
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
        this.initShare();
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: this.publicConfig.shareConfig.path,
        };
    },
};
</script>
<style lang="less" scoped>
@import "./theme/index.less";
</style>
