<template>
    <view>
        <brand
            v-if="activityId === 10"
            ref="myChildren"
            :activity-id="activityId"
            :canvas-image="canvasImg"
        />
        <clocked
            v-if="activityId === 12"
            ref="myClocked"
            :activity-id="activityId"
        />
        <poetry
            v-if="activityId === 14"
            ref="myPoetry"
            :activity-id="activityId"
        />
        <spring
            v-if="activityId === 13 || activityId === 8"
            ref="mySpring"
            :activity-id="activityId"
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
import brand from './brand/index.vue';
import clocked from './clocked/index.vue';
import spring from './spring/index.vue';
import poetry from './poetry/index.vue';
import share from '../../common/share';

export default {
    components: {
        brand,
        clocked,
        spring,
        poetry,
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            activityId: '',
            activityName: [
                {
                    id: 8,
                    title: '青少年动起来',
                },
                {
                    id: 9,
                    title: '七彩童年，快乐成长秀风采',
                },
                {
                    id: 10,
                    title: '青少年”爱挑战“寻找代言人',
                },
                {
                    id: 12,
                    title: '打卡一下，记录暑假',
                },
                {
                    id: 13,
                    title: '青少年动起来 第二季',
                },
                {
                    id: 14,
                    title: '趣味诗词大闯关',
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
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);

            this.title = titleList[random];
            console.log(random, this.title);
            const desc = descList[0];
            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
            });
        },
        onReachBottom() {
            uni.$emit('onReachBottom');
        },
    },
    onUnload() {
        if (this.$refs.myChildren && this.$refs.myChildren.unload) {
            this.$refs.myChildren.unload();
        }
    },
    onShow() {
        if (this.$refs.myChildren && this.$refs.myChildren.onshow) {
            this.$refs.myChildren.onshow();
        }
    },
    onLoad(params) {
        this.activityId = Number(params.activity_id);
        console.log(this.activityId);
        const titleItem = this.activityName.filter(
            v => v.id === this.activityId,
        );
        const title = titleItem.length ? titleItem[0].title : '活动';
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
