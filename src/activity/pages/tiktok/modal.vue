<template>
    <view class="modal-content">
        <view
            :class="[
                'modal-content-box',
                type === 1 || type === 2 ? 'rule' : ''
            ]"
        >
            <view
                v-if="type === 0"
                class="rule-content"
            >
                <view class="box-bg">
                    <view class="box-scroll">
                        <view
                            v-if="title"
                            class="title"
                        >
                            {{ title }}
                        </view>
                        <view class="text-box">
                            <view class="text-item">
                                <view class="text-tit">
                                    一、活动主题
                                </view>
                                <view class="text-info">
                                    记录教育生活 创新成就卓越
                                </view>
                            </view>
                            <view class="text-item">
                                <view class="text-tit">
                                    二、活动时间
                                </view>
                                <view class="text-info">
                                    2020年10月20日—12月30
                                </view>
                            </view>
                            <view class="text-item">
                                <view class="text-tit">
                                    三、参加范围
                                </view>
                                <view class="text-info">
                                    全省中小学校、幼儿园、中等职业学校，各级教育行政部门、教育信息化部门、教研部门及教育机构。单位及个人（教师、教育管理、教育信息化及教科研人员等）均可参赛。
                                </view>
                            </view>
                            <view class="text-item">
                                <view class="text-tit">
                                    四、项目类别与要求
                                </view>
                                <view class="text-info">
                                    （一）教育抖音微视频。<br>
                                    围绕“德智体美劳”五大领域，通过短视频形式纪录教育教学创新案例和校园生活风采，
                                    汇聚广大教师和教育工作者的创新成果，包括趣味教学、学习活动、校园生活、校外综合实践等内容，
                                    全方位展示新时代教育教学全领域、全过程、全要素的各类场景。
                                    教育抖音微视频主要为个人创作作品，也可采用创作者已在抖音平台上传的内容作为参赛作品。
                                    拍摄器材与视频格式不限，画质不低于1080p，时长为15秒—2分钟。<br>
                                    （二）教育宣传短视频。<br>
                                    通过短视频形式记录各地、各学校的综合类教育教学活动，展示各地教育及广大学校在艺术、
                                    科创、体育、德育、素质教育等方面各类综合活动的视频剪辑作品，也可报送各地各学校已有的教育宣传片。
                                    教育宣传短视频主要为各地教育部门和学校统一创作的视频作品。拍摄器材与视频格式不限，画质不低于1080p，
                                    时长为1分钟—5分钟。<br>
                                    （三）校园微电影。<br>
                                    校园微电影是以校园生活、教育故事、社会生活为主题，由师生共同参与编剧创作和拍摄制作，
                                    具有完整的故事情节和可观赏性的小型短片。
                                    校园微电影要立足传播和践行社会主义核心价值观，充分反映青少年学习和成长中积极向上的青春力量和时代精神。
                                    拍摄器材与视频格式不限，画质不低于1080p。<br>
                                    （四）作品基本要求<br>
                                    以上各类视频作品要遵守法律法规要求，符合教育规律和政策。内容要积极向上、生动活泼，充分展示教育教学生活“正能量”及广大教师的教育教学风采和创新能力。
                                    要求剪辑流畅，制作精良，符合新媒体及短视频传播要求。<br>
                                </view>
                            </view>
                            <view class="text-item">
                                <view class="text-tit">
                                    五、综合评选
                                </view>
                                <view class="text-info">
                                    2021年1月，省级组织专家进行综合评选。结合网络展播和作品质量，
                                    综合评选出十佳教育抖音微视频、十佳教育宣传短视频、十佳校园微电影，
                                    以及若干名优秀作品奖和优秀组织奖，由陕西省信息化管理中心、陕西教育报刊社、
                                    陕西科技报社等单位共同颁发荣誉证书。
                                    省级综合评选出的优秀作品，同步在相关省级媒体平台进行宣传展示，并择优推荐参加国家和省级的相关公益视频展播活动。
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view
                class="close"
                @click="close()"
            >
                <image
                    src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/tiktok_close.png"
                    mode=""
                />
            </view>
        </view>
    </view>
</template>

<script>
export default {
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 325;
            const height = 155;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    props: {
        title: {
            type: String,
            default: '',
        },
        type: {
            type: Number,
            default: 0,
        },
        data: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit('close');
        },
    },
};
</script>
<style lang="less" scoped>
.modal-content {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
    .modal-content-box {
        position: absolute;
        background-color: #8f6fff;
        width: 690upx;
        max-height: 968upx;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -54%);
        padding: 20upx;
        box-sizing: border-box;
        border-radius: 40upx;
        &.rule {
            background: #8f6fff;
        }
        .box-scroll {
            height: 100%;
            overflow: auto;
        }
        .box-bg {
            padding: 45upx 20upx 20upx;
            height: 848upx;
            box-sizing: border-box;
            color: #fff;
            .text {
                font-size: 28upx;
                line-height: 40upx;
            }
        }
        .title {
            height: 70upx;
            line-height: 70upx;
            padding: 0 73upx;
            color: #fff;
            font-size: 34upx;
            font-weight: 600;
            text-align: center;
            background: linear-gradient(
                RGBA(131, 117, 209, 1),
                RGBA(95, 81, 172, 1)
            );
            border-radius: 34upx;
            position: absolute;
            left: 50%;
            top: -35upx;
            transform: translateX(-50%);
        }
    }
    .text-box {
        .text-tit {
            font-size: 32upx;
            color: #ffe179;
        }
        .text-info {
            padding: 26upx 0;
            font-size: 28upx;
            color: #fff;
            line-height: 40upx;
        }
    }
    .close {
        position: absolute;
        right: -20px;
        transform: translateX(-50%);
        width: 63upx;
        height: 63upx;
        top: -10px;
        border-radius: 50%;
        & > image {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
