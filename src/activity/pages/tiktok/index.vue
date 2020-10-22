<template>
    <!-- 代言人活动 -->
    <view
        :class="[
            'activity-init-page',
            {
                'stop-scroll':
                    (maskPrompt || userInfo === null) && maskType === 0
            }
        ]"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <view>
                <indexPage
                    :index-config="indexConfig"
                    :public-config="publicConfig"
                    :is-stop-scroll="false"
                    list-url="/api/works/douyinlist"
                    class-name="tiktok-page"
                    :main-image="
                        `${
                            rosterData.status === 2
                                ? 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_result.jpg'
                                : ''
                        }`
                    "
                    :fr="fr"
                    :hide-button="true"
                    @showMask="showMask"
                />
                <view
                    class="upload"
                    @click="handleUpload"
                >
                    立即参与
                </view>
            </view>
            <!-- 规则 中奖说明 中奖榜单 -->
            <modal
                v-if="maskPrompt"
                class="mask"
                :title="maskTitle"
                :type="maskType"
                :data="modalData"
                @close="handleClose"
            />
        </template>
    </view>
</template>

<script>
import indexPage from '../common/index.vue';
import logger from '../../../common/logger';
import modal from './modal.vue';
import api from '../../../common/api';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        indexPage,
        modal,
        login,
    },
    filters: {
        setAvatarSize: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 80;
            const height = 80;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_fill,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_fill,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    props: {
        activityId: {
            type: [Number, String],
            default: 10,
        },
    },
    data() {
        return {
            userInfo: {},
            canJoin: true,
            // #ifdef H5
            isH5: true,
            // #endif
            status: 2,
            lock: false,
            publicConfig: {},
            indexConfig: {},
            fr: 'dyrhd',
            modalData: {},
            maskPrompt: false,
            posterImage: '',
            rosterData: {},
            type: 0,
            maskTitle: '',
            maskType: 0,
            prizeList: [
                {
                    desc: ['为爱挑战代言', '登世界吉尼斯舞台'],
                },
                {
                    desc: ['“形象代言人”奖杯', '荣誉证书'],
                },
                {
                    desc: ['世界吉尼斯嘉年华', '特邀入场券*3'],
                },
                {
                    desc: ['官方包装宣传', '官方定制礼盒1套'],
                },
            ],
            expertList: [],
            myWorkPath: '',
            resultList: {},
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
        console.log('publicConfig', this.publicConfig);
        this.indexConfig = this.$store.getters.getActivityConfig({
            activityId: this.activityId,
            page: 'indexConfig',
        });
        this.fr = logger.getFr(this.publicConfig.log, {});
        this.getStatus();
        this.activityStatus();

        this.isLogin().then(
            (res) => {
                this.userInfo = res.user_info;
                this.getenrollinfo();
            },
            () => {
                this.canJoin = true;
            },
        );
        this.getProficients();
    },
    methods: {
        unload() {},
        onshow() {
            this.isLogin().then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.getenrollinfo();
                },
                () => {
                    this.canJoin = true;
                },
            );
        },
        isLogin() {
            return api.get('/api/user/info');
        },
        onLogin({ user_info: userInfo }) {
            this.userInfo = userInfo;
            this.getenrollinfo();
        },
        getProficients() {
            // 专家列表
            api.get('/api/activity/proficients').then((data) => {
                this.expertList = data;
            });
        },
        showExpertDetail({
            name, desc, avatar, technical,
        }) {
            this.showMask({
                title: '',
                type: 2,
            });
            this.modalData = {
                avatar,
                name,
                desc,
                technical,
            };
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: this.activityId,
            }).then((res) => {
                this.status = res.status;
            });
        },
        getenrollinfo() {
            uni.showLoading();
            api.get('/api/activity/getenrollinfo', {
                activity_id: this.activityId,
                user_id: this.userInfo.user_id,
            }).then(
                (data) => {
                    uni.hideLoading();
                    if (Array.isArray(data) && data.length === 0) {
                        // 参赛
                        this.canJoin = true;
                    } else {
                        // 上传作品
                        this.canJoin = false;
                        const isFirstJoin = uni.getStorageSync('brand_first');
                        if (isFirstJoin) {
                            // 首次参赛 要生成海报
                            uni.removeStorageSync('brand_first');
                            this.showPosterMask = true;
                            this.posterImage = data.detail[
                                this.isH5 ? 'poster_h5' : 'poster_mp'
                            ];
                        }
                    }
                },
                () => {
                    uni.hideLoading();
                    this.canJoin = true;
                },
            );
        },
        showMask({ title, type }) {
            this.maskTitle = title;
            this.maskType = type;
            this.maskPrompt = true;
        },
        handleClose() {
            // 关闭弹窗
            this.maskPrompt = false;
        },
        getStatus() {
            // 获取按钮状态
            api.get('/api/activity/buttonstatus').then((data) => {
                this.rosterData = data;
                if (this.rosterData.status) {
                    this.getResult();
                }
            });
        },
        getResult() {
            // 获取名单
            api.get('/api/activity/spokesresult').then((data) => {
                this.resultList = data;
            });
        },
        jumpRosterList(status) {
            if (status) {
                uni.navigateTo({
                    url: '/activity/pages/brand/rematch',
                });
            }
        },
        handleUpload() {
            api.isLogin({}).then(
                (res) => {
                    this.userInfo = res;
                    // this.myWorkPath = `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.userid}`;
                    if (![2, 3].includes(this.userInfo.identity)) {
                        uni.showToast({
                            title:
                                '本次活动仅支持老师参加，敬请期待更多精彩活动！',
                            duration: 3000,
                            icon: 'none',
                        });
                    } else {
                        uni.navigateTo({
                            url: `/activity/pages/upload/modify?activity_id=${this.activityId}`,
                        });
                    }
                },
                () => {
                    this.userInfo = {};
                },
            );
        },
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
.stop-scroll {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.activity-init-page {
    .upload {
        position: fixed;
        bottom: 0upx;
        background: #f73a44;
        text-align: center;
        width: 100%;
        color: #fff;
        height: 116upx;
        font-size: 36upx;
        line-height: 116upx;
        text-align: center;
        z-index: 10;
    }
}
</style>
