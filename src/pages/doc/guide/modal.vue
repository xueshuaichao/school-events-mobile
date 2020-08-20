<template>
    <view
        v-if="show"
        class="guide-modal"
    >
        <view class="modal-content">
            <view class="modal-title">
                {{ modalContent.title || modalContent.name }}
                <image
                    class="close-icon"
                    src="/static/images/guide/close.png"
                    @click="closeModal"
                />
            </view>
            <scroll-view
                class="modal-inner"
                :scroll-y="true"
                style="height: 310px"
            >
                <view class="inner-type">
                    项目规则：
                </view>
                <template v-if="modalType === 'challenge'">
                    <view
                        v-for="(item, i) in modalContent.describe"
                        :key="i"
                        class="inner-item"
                    >
                        {{ item }}
                    </view>
                </template>
                <template v-else>
                    <view class="inner-item">
                        {{ modalContent.content }}
                    </view>
                </template>

                <view
                    v-if="modalType !== 'guinness'"
                    class="inner-type  m-t-item"
                >
                    参赛视频拍摄说明：
                </view>
                <template v-if="modalType === 'challenge'">
                    <view class="inner-item">
                        1、比赛过程视频不可剪辑，拍摄过程强调真实性，保证整个镜头的完整性，参赛选手始终出现在画面里；项目结束后需由认证官（老师或家长）宣告比赛结束与挑战成绩；
                    </view>
                    <view class="inner-item">
                        2、竞技类项目拍摄时，画面中需出现秒表、量尺等计量工具；
                    </view>
                    <view class="inner-item">
                        3、学校老师录制的视频，画面中需出现认证官（可制作特色的视频片头与片尾）；
                    </view>
                    <view class="inner-item">
                        4、视频画质清晰可见；
                    </view>
                    <view class="inner-item">
                        5、内容健康，符合爱挑战各项目规则。
                    </view>
                </template>
                <template v-if="modalType === 'talent'">
                    <view class="inner-item">
                        <view>1、视频要求3-10分钟；</view>
                        <view>2、要求视频画质清晰可见（不低于720P)。</view>
                    </view>
                </template>
                <template
                    v-if="
                        modalType === 'talent' && modalContent.hasPic !== false
                    "
                >
                    <view class="inner-type m-t-item">
                        图片作品要求如下：
                    </view>
                    <view class="inner-item">
                        1、建议尺寸比例为16:9 <br>
                        2、格式为JPG、PNG小于10M，用于在首页、列表和作品详情页展示
                    </view>
                </template>
            </scroll-view>
            <template v-if="!isH5">
                <navigator
                    v-if="modalType === 'challenge'"
                    :url="
                        userInfo === null
                            ? '/pages/login/login'
                            : '/pages/openGame/jingjiupload?type=jingji'
                    "
                >
                    <view class="join-btn">
                        我要来挑战
                    </view>
                </navigator>
                <navigator
                    v-if="modalType === 'talent'"
                    :url="
                        userInfo === null
                            ? '/pages/login/login'
                            : '/pages/upload/default/upload'
                    "
                    hover-class="other-navigator-hover"
                >
                    <view class="join-btn">
                        我要秀才艺
                    </view>
                </navigator>
                <navigator
                    v-if="modalType === 'guinness'"
                    :url="
                        userInfo === null
                            ? '/pages/login/login'
                            : '/pages/openGame/jingjiupload?type=jinisi'
                    "
                    hover-class="other-navigator-hover"
                >
                    <view class="join-btn">
                        我要来挑战
                    </view>
                </navigator>
            </template>
        </view>
    </view>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: true,
        },
        modalType: {
            type: String,
            default: '',
        },
        modalTitle: {
            type: String,
            default: '',
        },
        modalContent: {
            type: Object,
            default() {
                return {
                    title: '',
                };
            },
        },
        userInfo: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: false,
            // #endif
        };
    },
    methods: {
        closeModal() {
            this.$emit('closeModal');
        },
    },
};
</script>
<style scoped lang="less">
.guide-modal {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    .modal-content {
        position: absolute;
        top: 198upx;
        left: 50upx;
        right: 50upx;
        min-height: 870upx;
        background: #fff;
        border-radius: 24rpx;
    }
    .modal-title {
        text-align: center;
        font-size: 30upx;
        position: relative;
        padding-top: 30upx;
        font-weight: bold;
        .close-icon {
            position: absolute;
            right: 0;
            top: 0;
            width: 72upx;
            height: 72upx;
            z-index: 11;
        }
    }
    .modal-inner {
        box-sizing: border-box;
        padding: 24upx 40upx 0upx;
        font-size: 28upx;
        .inner-type {
            margin-bottom: 16upx;
            line-height: 28upx;
            color: #303133;
            font-weight: bold;
        }
        .m-t-item {
            margin-top: 20upx;
        }
        .inner-item {
            margin-bottom: 16upx;
            color: #5e6166;
            line-height: 40upx;
            text-align: justify;
        }
    }
    .join-btn {
        display: block;
        margin: 32upx auto;
        border-radius: 47upx;
        width: 400upx;
        height: 94upx;
        background: #1166ff;
        text-align: center;
        color: #fff;
        font-size: 36upx;
        line-height: 94upx;
    }
}
</style>
