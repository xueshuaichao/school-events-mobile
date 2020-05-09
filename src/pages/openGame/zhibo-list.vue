<template>
    <view class="main">
        <view
            v-for="(item, index) in list"
            :key="index"
            class="main-box"
            :style="{ backgroundImage: 'url(' + item.bg + ')' }"
        >
            <text class="zhibo-name">
                {{ item.name }}
            </text>
            <text class="zhibo-intro">
                {{ item.intro }}
            </text>
            <div
                class="zhibo-btn"
                @click="jumpRoute(item.url)"
            >
                立即参加
            </div>
        </view>
    </view>
</template>

<script>
import api from '../../common/api';
import logger from '../../common/logger';

export default {
    components: {},
    data() {
        return {
            list: [
                {
                    name: '竞技类',
                    intro: '展示个人和团队的技能与成就',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/jingji-bg.png?t=1',
                    url: '/pages/openGame/jingjiupload?type=jingji',
                },
                {
                    name: '才艺类',
                    intro: '展示才艺和特长的平台',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/caiyi-bg.png?t=1',
                    url: '/pages/upload/default/upload?type=openGame',
                },
                {
                    name: '吉尼斯项目',
                    intro: '提供创造世界纪录的机会和平台',
                    bg:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/jinisi-bg.png?t=1',
                    url: '/pages/openGame/jingjiupload?type=jinisi',
                },
            ],
        };
    },
    created() {
        api.post('/api/activity/commitactivityfollow', {
            activity_id: 7,
        }).then(() => {
            // this.activity_num1 = data.activity_num;
        });
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const title = '青少年网络活动大赛';
        return {
            title,
            imageUrl:
                'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/openEvent-banner.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',

            path: '/pages/openGame/zhibo-list',
        };
    },
    methods: {
        jumpRoute(url) {
            uni.showLoading({
                mask: true,
            });
            this.fr = logger.getFr('dshd', {});
            api.isLogin({
                fr: this.fr,
            }).then(
                () => {
                    uni.hideLoading();
                    uni.navigateTo({
                        url,
                    });
                },
                () => uni.showToast({
                    icon: 'none',
                    title: '请先登录',
                }),
            );
        },
    },
};
</script>

<style lang="less" scoped>
.main {
    width: 100%;
    height: 100vh;
    background: #f8f8f8;
    padding: 30upx;
    box-sizing: border-box;
    .loadMore {
        width: 100%;
    }
    .main-box {
        width: 690upx;
        height: 260upx;
        background-size: 100% 100%;
        position: relative;
        margin-top: 22upx;
        .zhibo-name {
            position: absolute;
            top: 40upx;
            left: 324upx;
            font-size: 32upx;
            font-weight: 500;
            color: #333333;
        }
        .zhibo-intro {
            position: absolute;
            top: 96upx;
            left: 324upx;
            font-size: 24upx;
            color: #666666;
        }
        .zhibo-btn {
            position: absolute;
            top: 160upx;
            left: 324upx;
            font-size: 30upx;
            color: #ff6555;
            width: 148upx;
            height: 60upx;
            // background: rgba(255, 101, 85, 1);
            border: 2upx solid rgba(255, 101, 85, 1);
            // border-radius: 30upx;
            text-align: center;
            line-height: 60upx;
        }
        .event-space {
            position: absolute;
            top: 98upx;
            left: 30upx;
            width: 20upx;
            height: 20upx;
        }
    }
}
</style>
