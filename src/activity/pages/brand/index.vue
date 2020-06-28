<template>
    <!-- 代言人活动 -->
    <div
        :class="[
            'activity-init-page',
            { 'stop-scroll': maskPrompt || userInfo === null }
        ]"
    >
        <login
            v-if="userInfo === null"
            @login="onLogin"
        />
        <template v-else>
            <!-- 我的海报 -->
            <savePoster
                v-if="showPosterMask"
                :image="posterImage"
                @togglePoster="togglePoster"
            />
            <view>
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
                        <!-- 复赛名单 -->
                        <view
                            v-if="rosterData.text"
                            class="roster-list"
                        >
                            <view
                                class="btn"
                                @click="jumpRosterList(rosterData.click)"
                            >
                                <image
                                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_list_icon.png"
                                />
                                <text>
                                    {{ rosterData.text }}
                                </text>
                            </view>
                        </view>
                        <!-- 代言人权益 -->
                        <view class="prize-box">
                            <view class="title">
                                代言人权益
                            </view>
                            <text
                                class="prize-tips"
                                @click="
                                    showMask({
                                        title: '权益说明',
                                        type: 1
                                    })
                                "
                            >
                                更多权益
                            </text>
                            <div class="item-box">
                                <view
                                    v-for="(item, index) in prizeList"
                                    :key="index"
                                    class="item"
                                >
                                    <image
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_prize_${index}.png`
                                        "
                                    />
                                    <view
                                        v-for="(desc, k) in item.desc"
                                        :key="k"
                                    >
                                        {{ desc }}
                                    </view>
                                </view>
                            </div>
                        </view>
                        <!-- 专家评审团 -->
                        <view class="expert-box">
                            <view class="title">
                                专家评审团
                            </view>
                            <view class="item-box">
                                <view
                                    v-for="(item, index) in expertList"
                                    :key="index"
                                    class="item"
                                    :class="{ 'margin-0': index > 2 }"
                                    @click="showExpertDetail(item)"
                                >
                                    <image :src="item.avatar | setAvatarSize" />
                                    <view class="expert-name text-one-line">
                                        {{ item.name }}
                                    </view>
                                    <view class="expert-title">
                                        {{ item.title }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                </indexPage>
                <view
                    :class="
                        status === 2 || status === 1 || isH5
                            ? 'upload'
                            : 'upload-disable'
                    "
                    @click="handleUpload"
                >
                    <!-- // 1未开始，2进行中，3已结束 -->
                    <template v-if="status === 1">
                        活动未开始
                    </template>
                    <template v-else-if="status === 2">
                        <template v-if="canJoin">
                            我要参赛
                        </template>
                        <template v-else>
                            上传作品
                        </template>
                    </template>
                    <template v-else>
                        活动已结束
                    </template>
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
            <view
                v-if="showGuideMask"
                class="guide-mask"
            >
                <view class="box">
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_guide.png"
                    />
                    <view class="text">
                        快来上传作品展示优秀的你吧～
                    </view>
                </view>
            </view>
        </template>
    </div>
</template>

<script>
import indexPage from '../common/index.vue';
import logger from '../../../common/logger';
import modal from './modal.vue';
import api from '../../../common/api';
import savePoster from './savePoster.vue';
import login from '../../../widgets/login/login.vue';

export default {
    components: {
        indexPage,
        modal,
        savePoster,
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
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_fixed,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_fixed,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    props: {
        activityId: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return {
            userInfo: {},
            canJoin: true,
            showPoster: false, // 由于中奖和位中奖config有差异 需要等配置文件修改后初始化海报组件
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
            showPosterMask: false,
            showGuideMask: false,
            posterImage: '',
            rosterData: {},
            type: 0,
            maskTitle: '',
            maskType: 0,
            prizeList: [
                {
                    desc: ['为爱挑战代言！', '登世界吉尼斯舞台'],
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
        this.getStatus();
        this.activityStatus();
        this.isLogin().then(
            (res) => {
                this.userInfo = res.user_info;
                this.myWorkPath = `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.user_id}`;
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
                    this.myWorkPath = `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.user_id}`;
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
            this.myWorkPath = `/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.user_id}`;
            this.getenrollinfo();
        },
        togglePoster(status) {
            this.showPosterMask = status;
            this.toggleGuideMask(true);
        },
        toggleGuideMask(status) {
            this.showGuideMask = status;
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
            api.get('/api/activity/getenrollinfo', {
                activity_id: this.activityId,
                user_id: this.userInfo.user_id,
            }).then(
                (data) => {
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
                console.log(data);
            });
        },
        jumpRosterList(status) {
            if (status) {
                uni.navigateTo({
                    url: '/pages/rematch/list',
                });
            }
        },
        handleUpload() {
            if (this.showGuideMask) {
                this.toggleGuideMask(false);
            }
            // if (this.isH5 && this.canJoin === false) {
            //     return uni.showToast({
            //         title: '请在UP爱挑战小程序上传作品',
            //         icon: 'none',
            //     });
            // }
            if (this.status === 2) {
                api.isLogin().then(
                    () => {
                        if (this.canJoin) {
                            uni.navigateTo({
                                url: '/activity/pages/brand/join',
                            });
                        } else {
                            uni.navigateTo({
                                url: `/activity/pages/upload/modify?activity_id=${this.activityId}`,
                            });
                        }
                    },
                    () => {
                        this.userInfo = null;
                    },
                );
            } else {
                uni.showToast({
                    title:
                        this.status === 1
                            ? '活动未开始，敬请期待'
                            : '活动已结束',
                    icon: 'none',
                });
            }
            return true;
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
        background: #ff685c;
        text-align: center;
        width: 100%;
        color: #fff;
        height: 116upx;
        font-size: 36upx;
        line-height: 116upx;
        text-align: center;
        z-index: 10;
    }
    .upload-disable {
        position: fixed;
        bottom: 0upx;
        background: linear-gradient(
            0deg,
            rgba(133, 115, 102, 1),
            rgba(179, 170, 152, 1)
        );
        // background-size: 100% 100%;
        text-align: center;
        width: 100%;
        height: 116upx;
        color: #e4ded4;
        font-size: 36upx;
        line-height: 116upx;
        z-index: 10;
    }
    .roster-list {
        text-align: center;
        margin-bottom: 64upx;
        .btn {
            display: flex;
            background: linear-gradient(
                rgba(255, 142, 133, 1),
                rgba(255, 87, 74, 1)
            );
            border: 3upx solid rgba(255, 202, 83, 1);
            box-shadow: 0 4upx 6upx 0 rgba(0, 0, 0, 0.4);
            border-radius: 33upx;
            color: #fff;
            font-size: 30upx;
            font-weight: bold;
            height: 66upx;
            line-height: 66upx;
            justify-content: center;
            align-items: center;
            min-width: 370upx;
            max-width: 390upx;
            margin: 0 auto;
        }
        image {
            width: 48upx;
            height: 48upx;
            vertical-align: middle;
        }
    }
    .prize-box,
    .expert-box {
        position: relative;
        border: 3upx solid #ff8e85;
        border-radius: 20upx;
        margin-bottom: 64upx;
        background-color: #9070ff;
        .title {
            position: absolute;
            left: 50%;
            top: -26upx;
            transform: translateX(-50%);
            color: #fff;
            font-size: 34upx;
            font-weight: bold;
            height: 60upx;
            line-height: 60upx;
            text-align: center;
            padding: 0 35upx;
            background-image: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_title_index.png);
            background-size: 100% 100%;
            background-position: center center;

            border-radius: 0 0 20upx 20upx;
        }
        .item-box {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            color: #fff;
            text-align: center;
            padding: 74upx 11upx 33upx;
        }
    }
    .prize-box {
        .item-box {
            font-size: 20upx;
            line-height: 30upx;
        }
        .prize-tips {
            position: absolute;
            top: 21upx;
            right: 21upx;
            color: #ffc466;
            font-size: 26upx;
        }
        .item > image {
            width: 80upx;
            height: 80upx;
        }
    }
    .expert-box {
        .item {
            width: 33.3333%;
            margin-bottom: 40upx;
            font-size: 22upx;
            &.margin-0 {
                margin-bottom: 0;
            }
        }
        .item > image {
            width: 160upx;
            height: 160upx;
            border-radius: 50%;
        }
        .expert-title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
        }
    }
    .guide-mask {
        position: fixed;
        top: 0;
        bottom: 116upx;
        left: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 10;
        .box {
            position: absolute;
            bottom: 0;
            text-align: center;
            width: 100%;
        }
        image {
            width: 50upx;
            height: 60upx;
            display: block;
            margin: 0 auto 30upx;
        }
        .text {
            color: #fff;
            line-height: 42upx;
            font-size: 30upx;
            margin-bottom: 30upx;
        }
    }
}
</style>
