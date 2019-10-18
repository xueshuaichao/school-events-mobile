<template>
    <view class="page-doc-list">
        <template v-if="type">
            <view class="menu-list">
                <view
                    v-for="(item, k) in conf.menu"
                    :key="item"
                    class="menu-item"
                    :class="{
                        active: activeMenuIndex === k
                    }"
                    @click="toggle(k)"
                >
                    {{ item }}
                </view>
            </view>
            <view class="content">
                <view
                    v-for="content in conf.content[activeMenuIndex]"
                    :key="content.title"
                >
                    <view class="title">
                        {{ content.title }}
                    </view>
                    <view class="text">
                        {{ content.content }}
                    </view>
                </view>
                <view v-if="type !== 'guinness'">
                    <view class="title">
                        参赛视频拍摄说明：
                    </view>
                    <view class="text">
                        1、视频要求3-10分钟 <br>
                        2、要求视频画质清晰可见（不低于720P) <br>
                        3、内容健康，符合爱挑战规则
                    </view>

                    <template v-if="!isH5">
                        <navigator
                            v-if="type === 'challenge'"
                            url="/pages/doc/detail/detail?id=rule"
                            open-type="redirect"
                        >
                            <view class="btn">
                                我要来挑战 !
                            </view>
                        </navigator>
                        <navigator
                            v-if="type === 'talent'"
                            :url="
                                userInfo === null
                                    ? '/pages/tabBar/uc/uc'
                                    : '/pages/tabBar/upload/upload'
                            "
                            open-type="switchTab"
                            hover-class="other-navigator-hover"
                        >
                            <view class="btn">
                                我要来挑战
                            </view>
                        </navigator>
                    </template>
                </view>
            </view>
        </template>
    </view>
</template>

<script>
import api from '../../../common/api';

const conf = {
    challenge: {
        menu: [
            '绳圈系列',
            '体能测试',
            '足球系列',
            '篮球系列',
            '数字系列',
            '灵巧反应',
            '体操系列',
            '绕口令系列',
            '心灵手巧',
        ],
        content: [
            [
                {
                    title: '1分钟单人跳绳',
                    content:
                        '参赛者可用任意长短的绳子，在1分钟内计算绳子有效越过脚下的次数。计时员发出开始计时指令时（并启动秒表），参赛者方可开始跳绳。计数员应在每次参赛者跳起、并且绳子到达脚底时开始大声报数。',
                },
                {
                    title: '一带一单摇跳绳（团体）',
                    content:
                        '由一名队员双手摇绳，另一名队员跟跳，两人可采用双脚同步跳或双脚交替跳的方法（比赛过程中只能采用一种跳绳方法），计算跳过绳的次数，比赛中途绳子停止摇动时，可继续比赛，然后接着计数。1分钟内数量最多者获胜。',
                },
            ],
            [
                {
                    title: '1分钟仰卧起坐',
                    content:
                        '身体平躺，双腿屈膝约成90度，臀部贴地，脚掌贴地，双手十指交错置于头后，手背贴地，辅助同伴双手按住测试者双脚。起坐时，双肘触及两膝为完成一次。仰卧时贴于头后的两手背必须触垫。如在过程中，紧贴头后的手背未触垫、臀部离垫或双肘未触及两膝属犯规动作，不计次数。',
                },
            ],
            [
                {
                    title: '3分钟连续颠足球',
                    content:
                        '认证官鸣哨发出开始指令，比赛计时开始，参赛者需用脚将地上的足球挑起。参赛者左右脚自由颠球，球落地或比赛时间到则比赛结束。',
                },
            ],
            [
                {
                    title: '手指转球',
                    content:
                        '球保持旋转姿态，支撑体只能是一根手指，不得用其它支撑物，时间越长为胜。篮球在手指上始终保持旋转而不掉下，从开始旋转那一刻开始计时。',
                },
            ],
            [
                {
                    title: '1分钟单手拍篮球',
                    content:
                        '单手徒手拍篮球，篮球离开手即为一次。篮球落地可以捡起来接着拍，中途可以换手，并接着计数，累计一分钟内拍球个数最多者为获胜者。',
                },
            ],
            [
                {
                    title: '写数字（1-200）',
                    content:
                        '准备一张白纸，计时开始时从1顺序写数字直至200，计时结束。比赛结束后，计时员应口头报出比赛所用时间。书写期间不能出现书写错误、涂改，否则成绩无效。视频必须完整、清晰地显示出参赛者的全部书写过程，不得中断、剪辑。书写结束后，视频应对书写结果给出5秒以上的特写镜头。',
                },
            ],
            [
                {
                    title: '三阶魔方六面复原',
                    content:
                        '认证官将魔方随意或按公式打乱20次以上，以秒表、电脑或手机计时，复原时间最短者获胜。',
                },
            ],
            [
                {
                    title: '1分钟侧手翻',
                    content:
                        '在一分钟的时间内,挑战者所完成侧手翻的个数多者为胜。（侧手翻必须有手倒立的过程,并且倒立过程时, 身体与地面的角度不得小于80度。）',
                },
            ],
            [
                {
                    title: '绕口令快速说',
                    content:
                        '学生背诵指定绕口令（小学《刘老六住在六号楼》；初中《天上七颗星》；高中《司小四和史小世》），在每个字音都吐字清晰的情况下，时间最短者获胜。',
                },
            ],
            [
                {
                    title: '1分钟立硬币',
                    content:
                        '在光滑坚硬的平面上逐个立1角钱的硬币（人民币）。不允许同时多个硬币叠在一起。1分钟内数量多者获胜。',
                },
            ],
        ],
    },
    talent: {
        menu: [
            '歌唱表演',
            '舞蹈表演',
            '口才表演',
            '乐器演奏',
            '手工制作',
            '书法与绘画',
            '记忆大比拼',
            '杂技',
            '魔术',
            '其他表演',
        ],
        content: [
            [
                {
                    title: '歌唱表演',
                    content:
                        '唱法不限、选唱歌曲须积极、健康、向上，反映当代青少年的理想追求和审美情趣，弘扬真善美，传播正能量。需吐字清晰、声音洪亮、气息稳定、精神饱满、台风端庄。',
                },
            ],
            [
                {
                    title: '舞蹈表演',
                    content:
                        '舞种不限：民族、古典、拉丁、现代、芭蕾、街舞等均可。表演过程中动作流畅协调，表现力和技巧性强，服装造型符合舞蹈表演形式。舞蹈表演具有时代感、抒发健康情怀，能够展示少年儿童风采。',
                },
            ],
            [
                {
                    title: '口才表演',
                    content:
                        '参赛作品需积极向上，吐字清晰，普通话标准，思路清晰，举止大方，自然协调。录制视频过程中，不得中断、剪辑。',
                },
            ],
            [
                {
                    title: '乐器演奏',
                    content:
                        '各种乐器的演奏姿势、手形（口形）、指法等正规，方法正确，基本功扎实，无不良的演奏方法。音准好，节拍、节奏感强；演奏的乐曲音符、乐句、乐段等准确无误，速度正确，乐段音符清晰。',
                },
            ],
            [
                {
                    title: '手工制作',
                    content:
                        '作品要构思新颖，有创意，作品颜色搭配和谐，造型独特，外观美观精致。作品源于生活，充分利用废旧物品，最好原创。',
                },
            ],
            [
                {
                    title: '书法与绘画',
                    content:
                        '思想健康向上，创意新颖独特。绘画作品要求构图完整，色彩和谐；书法作品要求章法合理，线条生动。风格规格不限，作品需拍摄完整、画面清晰。通过视频点播量和点赞量等排名进行PK。',
                },
            ],
            [
                {
                    title: '记忆大比拼',
                    content:
                        '将10个中国朝代（历史时期）的卡片，按照时间序列排列，用时最少者获胜。',
                },
            ],
            [
                {
                    title: '杂技',
                    content:
                        '具备扎实的功底和精湛的技巧，包括但不限于平衡、柔韧、腾翻、攀援、操持等杂技类项目。通过视频点播量和点赞量等排名进行PK。',
                },
            ],
            [
                {
                    title: '魔术',
                    content:
                        '近景，舞台魔术不限，手法，道具类不限，互动类避免用托。不要求魔术完全原创，但鼓励有创新，改进的魔术表演流程。不可带水印与特效镜头，不可通过剪辑来达到或修缮魔术效果。通过视频点播量和点赞量等排名进行PK。',
                },
            ],
            [
                {
                    title: '其他表演',
                    content:
                        '除以上表演内容以外的其他表演内容，要求表演内容完整、立意积极向上、弘扬真善美、传播正能量，拍摄中应避免过于晃动与太大燥音。通过视频点播量和点赞量等排名进行PK。',
                },
            ],
        ],
    },
    guinness: {
        menu: ['团队协作', '科技创新', '运动技巧', '手工艺术', '历史文化'],
        content: [
            [
                {
                    title: '1分钟毽子互踢',
                    content: '一分钟内两人毽子互踢传递次数最多',
                },
            ],
            [{ title: '悬浮纸飞机100米', content: '悬浮纸飞机100米接力最快' }],
            [
                {
                    title: '乒乓球弹杯',
                    content: '一分钟内将乒乓球弹入玻璃杯中 数目最多',
                },
            ],
            [{ title: '1分钟剪纸', content: '一分钟内剪出最多的“囍”字剪纸' }],
            [
                {
                    title: '朝代排序',
                    content: '最快速度将10个朝代按照时间顺序排序',
                },
            ],
        ],
    },
};

export default {
    data() {
        return {
            conf: {},
            type: '',
            activeMenuIndex: 0,

            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif
        };
    },
    methods: {
        toggle(index) {
            console.log(index);
            this.activeMenuIndex = index;
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                },
                () => {
                    this.userInfo = null;
                },
            );
        },
    },
    onLoad(query) {
        const { type } = query;
        this.type = type;
        this.conf = conf[type];
        this.activeMenuIndex = 0;

        this.getData();
    },
};
</script>

<style lang="less">
.page-doc-list {
    display: flex;

    .menu-list {
        width: 212rpx;
        background: rgba(245, 245, 245, 1);
        min-height: 100vh;
    }

    .menu-item {
        line-height: 108rpx;
        text-align: center;
        font-size: 28rpx;
        color: #3c3c3c;

        &.active {
            background: #268fff;
            color: #fff;
        }
    }

    .content {
        flex: 1;

        padding: 40rpx;
        font-size: 28rpx;
        color: #333333;

        .title {
            font-size: 32rpx;
            color: #333;
            font-weight: bold;
            margin-bottom: 24rpx;
        }

        .text {
            margin-bottom: 40rpx;
        }
    }

    .btn {
        background: #1166ff;
        color: #fff;
        line-height: 94rpx;
        text-align: center;
        width: 400rpx;
        height: 94rpx;
        background: rgba(17, 102, 255, 1);
        border-radius: 2rpx;
        margin: 0 auto;
    }
}
</style>
