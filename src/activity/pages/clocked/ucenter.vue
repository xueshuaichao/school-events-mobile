<template>
    <view v-if="!isLoading">
        <view
            class="page-read-work clocked-page"
            :class="{ login: userInfo === null }"
        >
            <login
                v-if="userInfo === null"
                @login="onLogin"
            />
            <!-- my works -->
            <template v-else>
                <!--荣誉墙-->
                <view class="honor-top">
                    <view class="honor-top-box">
                        <view
                            v-if="
                                signinfo.sports +
                                    signinfo.skill +
                                    signinfo.study +
                                    signinfo.work
                            "
                            class="to-open-honor"
                            @click="getMyPoster"
                        >
                            炫耀下吧～
                        </view>
                        <image
                            class="avator"
                            :src="
                                userInfo.avatar_url ||
                                    '/static/images/uc/avatar.png'
                            "
                        />
                        <view>
                            <view class="name">
                                {{ userInfo.name }}
                            </view>
                            <view class="txt">
                                我的勋章
                            </view>
                            <view class="flex-honor-all">
                                <view
                                    v-for="item in honorList"
                                    :key="item.id"
                                    class="item"
                                >
                                    <view
                                        v-if="item.num"
                                        class="num"
                                    >
                                        {{ item.num }}
                                    </view>
                                    <image
                                        class="img"
                                        :src="
                                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-${
                                                item.id
                                            }-${item.num ? 1 : 0}.png`
                                        "
                                    />
                                    <view class="txt">
                                        {{ item.txt }}
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="bg-top" />
                <calendar
                    :show-btn="false"
                    :signinfo="signinfo"
                    :ismyself="isSelf"
                    :calendar-data="calendarData"
                    class="ucenter-calendar"
                />
                <view :class="['panel', isSelf ? 'is-self' : '']">
                    <!-- 生成海报 -->
                    <posterh5
                        ref="posterh5"
                        :config="posterCommonConfig"
                        :hide-loading="true"
                        :width="630"
                        :height="886"
                        @success="onPosterSuccess"
                        @fail="onPosterFail"
                    />
                    <!-- 我的海报 -->
                    <savePoster
                        v-if="showPosterMask"
                        ref="savePoster"
                        :image="myPoster"
                        @togglePoster="togglePoster"
                    />
                    <view class="top-bar">
                        {{ isSelf ? "我" : "TA" }}的作品
                    </view>
                    <view
                        v-if="isSelf"
                        class="panel-hd"
                    >
                        <text
                            class="panel-title"
                            :class="{ active: tabActiveIndex === 2 }"
                            @click="setTabActive(2)"
                        >
                            已通过({{ allNum.pass || 0 }})
                        </text>
                        <text
                            class="panel-title"
                            :class="{ active: tabActiveIndex === 1 }"
                            @click="setTabActive(1)"
                        >
                            待审核({{ allNum.wait || 0 }})
                        </text>
                        <text
                            class="panel-title"
                            :class="{ active: tabActiveIndex === 3 }"
                            @click="setTabActive(3)"
                        >
                            未通过({{ allNum.no_pass || 0 }})
                        </text>
                    </view>
                    <view
                        v-if="total > 0"
                        :class="['media-list', isSelf ? '' : 'media-box']"
                    >
                        <template v-for="(item, index) in dataList">
                            <view
                                v-if="item.dateCount === 1"
                                :key="index"
                                class="time"
                            >
                                <view class="time-btn">
                                    <image
                                        src="/activity/static/clocked/time.png"
                                    />
                                    <text class="txt">
                                        {{ item.created_at_date }}
                                    </text>
                                </view>
                            </view>
                            <view
                                :key="item.id"
                                :class="['media-content', isSelf ? 'self' : '']"
                            >
                                <event-craft-cover
                                    :info="item"
                                    :media-icon="!isSelf"
                                    :like-icon="isSelf"
                                    :best-icon="false"
                                    :bg-color="publicConfig.primaryBgColor"
                                    @click.native="viewDetail(item, index)"
                                />
                                <view
                                    v-if="isSelf === true"
                                    class="work-info"
                                >
                                    <view class="media-name text-two-line">
                                        {{ item.resource_name }}
                                    </view>
                                    <view class="media-time">
                                        {{ item.created_at }}
                                    </view>
                                    <view class="btn">
                                        <text
                                            v-if="Number(tabActiveIndex) === 2"
                                            class="btn-item"
                                            @click="viewDetail(item, index)"
                                        >
                                            查看
                                        </text>
                                        <text
                                            v-if="Number(tabActiveIndex) === 3"
                                            class="btn-item big"
                                            @click="reason(item)"
                                        >
                                            驳回原因
                                        </text>
                                        <text
                                            v-if="Number(tabActiveIndex) === 3"
                                            class="btn-item"
                                            @click="modifyItem(item)"
                                        >
                                            编辑
                                        </text>
                                        <text
                                            v-if="Number(tabActiveIndex) > 1"
                                            class="btn-item"
                                            @click="onConfirmDelete(item)"
                                        >
                                            删除
                                        </text>
                                    </view>
                                </view>
                                <view
                                    v-else
                                    class="work-info"
                                >
                                    <!-- <view
                                        class="media-name create-by text-one-line"
                                    >
                                        {{ detail.name }}
                                    </view> -->
                                    <view class="media-name text-one-line">
                                        {{ `${item.resource_name}` }}
                                    </view>
                                    <text class="vote-num">
                                        {{ item.ticket }}赞
                                    </text>
                                    <view
                                        class="vote"
                                        @click="handleVote(item)"
                                    >
                                        <image
                                            class="like-icon"
                                            :src="
                                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_like_icon.png`
                                            "
                                        />
                                        点赞
                                    </view>
                                </view>
                            </view>
                        </template>
                        <uni-load-more
                            class="loadMore"
                            :status="loadMoreStatus"
                            :content-text="{
                                contentdown: '上拉显示更多',
                                contentrefresh: '正在加载...',
                                contentnomore: '———— 已经到底了~ ————'
                            }"
                            color="#fff"
                        />
                    </view>
                    <view
                        v-show="myWorkEmpty"
                        class="work-empty"
                    >
                        <image
                            :src="
                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_empty_work.png`
                            "
                        />
                        <view v-if="isSelf">
                            <view v-if="allTotal === 0">
                                <view>
                                    暂无作品，快去参与活动吧~
                                </view>
                            </view>
                            <view v-else>
                                暂无作品
                            </view>
                        </view>
                        <view v-else>
                            ~暂无作品，快去看看精彩活动吧~
                        </view>
                    </view>

                    <view
                        class="goIndex"
                        @click="handleIndex"
                    >
                        我要参与
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
// work.vue
import api from '../../../common/api';
import share from '../../../common/share';
import login from '../../../widgets/login/login.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';
import utils from '../../../common/utils';
import posterh5 from '../brand/posterh5.vue';
import savePoster from '../brand/savePoster.vue';
import calendar from './calendar.vue';

export default {
    components: {
        uniLoadMore,
        EventCraftCover,
        login,
        posterh5,
        savePoster,
        calendar,
    },
    filters: {
        optimizeImage: (val) => {
            if (!val) {
                return '';
            }
            let newUrl = '';
            const width = 335;
            const height = 225;
            if (val.indexOf('?') !== -1) {
                newUrl = `${val}&x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,jpg/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            status: 2,
            isLoading: true,
            userInfo: null,
            publicConfig: {},
            dataList: [],
            changeValue: '',
            loadMoreStatus: 'none',
            tabActiveIndex: 2,
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: '',
                activity_cat: 1,
                sort: 'new',
                status: 2,
            },
            total: 1,
            allNum: {},
            allTotal: 0,
            shareDesc: '',
            title: '',
            userId: '',
            isSelf: true,
            detail: {},
            showPosterMask: false,
            myPoster: '',
            posterCommonConfig: {
                pixelRatio: 2,
                width: 630,
                height: 866,
                debug: false,
                texts: [
                    {
                        text: '',
                        textAlign: 'left',
                        y: 270,
                        x: 90,
                        fontSize: '40',
                        color: '#FF8B82',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '',
                        textAlign: 'center',
                        y: 670,
                        x: 320,
                        fontSize: '32',
                        color: '#FF8300',
                        lineNum: 1,
                        fontWeight: 'bold',
                        textOverflow: 'ellipsis',
                        zIndex: 100,
                    },
                ],
                images: [
                    {
                        url: '',
                        width: 630,
                        height: 866,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 120,
                        height: 120,
                        y: 730,
                        x: 480,
                        borderRadius: this.isH5 ? 0 : 120,
                        zIndex: 100,
                    },
                ],
                radiusRects: [],
            },
            allDate: {},
            signinfo: {
                points: 0,
                serial_day: 0,
                skill: 0,
                sports: 0,
                study: 0,
                work: 0,
            },
            honorList: {
                work: {
                    id: 1,
                    num: 0,
                    txt: '劳动标兵',
                },
                study: {
                    id: 2,
                    num: 0,
                    txt: '阅读之星',
                },
                skill: {
                    id: 3,
                    num: 0,
                    txt: '才艺达人',
                },
                sports: {
                    id: 4,
                    num: 0,
                    txt: '活力少年',
                },
            },
            honorInfo: {},
            honorNums: 0,
            calendarData: {},
        };
    },
    computed: {
        myWorkEmpty() {
            return this.total === 0;
        },
    },
    methods: {
        getClockin() {
            api.get('/api/activity/clockin', {
                user_id: this.userId,
                activity_id: 12,
            }).then(({ data }) => {
                this.calendarData = data;
            });
        },
        getsigninfo() {
            api.get('/api/activity/signinfo', {
                user_id: this.userId,
                activity_id: 12,
            }).then((signinfo) => {
                this.signinfo = signinfo;
                const keys = Object.keys(signinfo);
                keys.forEach((key) => {
                    if (this.honorList[key]) {
                        this.honorList[key].num = signinfo[key];
                        if (signinfo[key]) {
                            this.honorNums += signinfo[key];
                            this.honorInfo[key] = this.honorList[key];
                        }
                    }
                });
            });
        },
        onLogin() {
            this.getData();
        },
        onPosterSuccess(detail) {
            this.submit(detail);
        },
        onPosterFail() {
            // 如果生成失败提示失败
            uni.showToast({
                title: '海报获取失败，请稍后再试',
                icon: 'none',
            });
            uni.hideLoading();
        },
        submit(path) {
            uni.hideLoading();
            this.myPoster = path;
            this.togglePoster(true);
        },
        getQrCode() {
            if (this.isH5) {
                this.getH5QrCode();
            } else {
                this.getMpQrCode();
            }
        },
        getH5QrCode() {
            const uCenterUrl = `${window.location.origin}/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}&w=244`;
            this.posterCommonConfig.images[1].url = `${
                window.location.origin
            }/api/common/qrcode?url=${encodeURIComponent(uCenterUrl)}`;
            this.posterCommonConfig.images[1].borderRadius = 0;
        },
        getMpQrCode() {
            // 小程序二维码
            const url = 'activity/pages/clocked/ucenter';
            const scene = `activity_id=12&user_id=${this.userInfo.user_id}`;
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    if (url) {
                        this.base64src(url, (res) => {
                            this.posterCommonConfig.images[1].url = res;
                        });
                    } else {
                        this.posterCommonConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    }
                },
                () => {
                    this.posterCommonConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                },
            );
        },
        // base64转url
        base64src(base64data, cb) {
            // eslint-disable-next-line no-undef
            const fsm = wx.getFileSystemManager();
            // const FILE_BASE_NAME = 'tmp_base64src'; // 自定义文件名
            const FILE_BASE_NAME = `tmp_base64src_${new Date() - 0}`; // 自定义文件名
            const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
            if (!format) {
                return new Error('ERROR_BASE64SRC_PARSE');
            }
            // eslint-disable-next-line no-undef
            const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
            // eslint-disable-next-line no-undef
            const buffer = wx.base64ToArrayBuffer(bodyData);
            fsm.writeFile({
                filePath,
                data: buffer,
                encoding: 'binary',
                success() {
                    cb(filePath);
                },
                fail() {
                    return new Error('ERROR_BASE64SRC_WRITE');
                },
            });
            return '';
        },
        getMyPoster() {
            // 触发生成海报。
            uni.showLoading();
            this.createPoster();
        },
        createPoster() {
            // 图片的处理。。。。。。。
            // 中间的内容区域是多种排版显示，有多种图片。
            const that = this;
            that.posterCommonConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/clocked_honor_poster.png';

            that.setPosterConfig();
            that.$refs.posterh5.createPoster(that.posterCommonConfig);
        },
        setPosterConfig() {
            let txts = [];
            const txts1 = [
                '生命在于运动,健康在于锻炼！',
                '最是书香能致远，腹有诗书气自华！',
                '了解劳动乐趣！感受父母辛苦！',
                '打卡进步展才艺，快乐成长秀风采',
            ];
            const txts2 = [
                '每天进步一点点，坚持带来大改变！',
                '你每天的小坚持，都会有大意义！',
                '每天打卡一小步！进步提升一大步！',
                '每天进步一点点, 成长足迹看得见！',
            ];
            let index = 0;
            // this.honorInfo.work = {
            //     id: 1,
            //     txt: '劳动标兵',
            //     num: 2,
            // };
            // this.honorInfo.sports = {
            //     id: 4,
            //     txt: '活力少年',
            //     num: 1,
            // };
            // this.honorInfo.study = {
            //     id: 2,
            //     txt: '阅读新型',
            //     num: 1,
            // };
            // this.honorInfo.skill = {
            //     id: 3,
            //     txt: '才艺达人',
            //     num: 2,
            // };

            const keys = Object.keys(this.honorInfo);
            // const keys = ['sports'];
            if (keys.length === 1) {
                index = this.honorInfo[keys[0]].id;
                txts = txts1;
            } else {
                index = Math.floor(Math.random() * 4);
                txts = txts2;
            }
            const txt = txts[index - 1];
            this.posterCommonConfig.texts[1].text = txt;
            this.posterCommonConfig.texts[0].text = `我已经获得${this.honorNums}枚勋章啦！`;
            // 根据勋章的种类，排版设计不同
            if (keys.length === 1) {
                this.posterCommonConfig.images[2] = {
                    width: 226,
                    height: 226,
                    url: `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-l-${
                        this.honorInfo[keys[0]].id
                    }.png`,
                    x: 202,
                    y: 314,
                };
                this.posterCommonConfig.texts[2] = {
                    text: `${this.honorInfo[keys[0]].txt}${
                        this.honorInfo[keys[0]].num === 1
                            ? ''
                            : `*${this.honorInfo[keys[0]].num}`
                    }`,
                    textAlign: 'center',
                    y: 584,
                    x: 314,
                    fontSize: '40',
                    color: '#FF8300',
                    lineNum: 1,
                    textOverflow: 'ellipsis',
                    fontWeight: 'bold',
                    zIndex: 10,
                };
                // 282, 236 长框，短框
                this.posterCommonConfig.radiusRects[0] = {
                    x:
                        this.honorInfo[keys[0]].num === 1
                            ? 315 - 236 / 2
                            : 315 - 282 / 2,
                    y: 540,
                    w: this.honorInfo[keys[0]].num === 1 ? 236 : 282,
                    h: 60,
                    br: 60,
                    color: '#FFF3DD',
                    color2: '#FFB363',
                };
            } else if (keys.length === 2) {
                keys.forEach((key, i) => {
                    this.posterCommonConfig.images[i + 2] = {
                        width: 180,
                        height: 180,
                        url: `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-l-${this.honorInfo[key].id}.png`,
                        x: 90 + i * 270,
                        y: 314,
                    };
                    this.posterCommonConfig.texts[i + 2] = {
                        text: `${this.honorInfo[key].txt}${
                            this.honorInfo[key].num === 1
                                ? ''
                                : `*${this.honorInfo[key].num}`
                        }`,
                        textAlign: 'center',
                        x: 180 + i * 270,
                        y: 536,
                        fontSize: '30',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    };
                    // 198 164
                    this.posterCommonConfig.radiusRects[i] = {
                        x:
                            this.honorInfo[key].num === 1
                                ? 180 + i * 270 - 82
                                : 180 + i * 270 - 99,
                        y: 500,
                        w: this.honorInfo[key].num === 1 ? 164 : 198,
                        h: 50,
                        br: 50,
                        color: '#FFF3DD',
                        color2: '#FFB363',
                    };
                });
            } else if (keys.length === 3) {
                keys.forEach((key, i) => {
                    this.posterCommonConfig.images[i + 2] = {
                        width: 100,
                        height: 100,
                        url: `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-l-${this.honorInfo[key].id}.png`,
                        x: i > 1 ? 265 : 140 + i * 250,
                        y: i > 1 ? 458 : 300,
                    };
                    this.posterCommonConfig.texts[i + 2] = {
                        text: `${this.honorInfo[key].txt}${
                            this.honorInfo[key].num === 1
                                ? ''
                                : `*${this.honorInfo[key].num}`
                        }`,
                        textAlign: 'center',
                        x: i > 1 ? 320 : 190 + i * 250,
                        y: i > 1 ? 594 : 434,
                        fontSize: '26',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    };
                    //  178 148
                    const sx = 190 + i * 250 - 74;
                    const lx = 190 + i * 250 - 89;
                    const sx2 = 315 - 74;
                    const lx2 = 315 - 89;
                    const x1 = i > 1 ? sx2 : sx;
                    const x2 = i > 1 ? lx2 : lx;
                    this.posterCommonConfig.radiusRects[i] = {
                        x: this.honorInfo[key].num === 1 ? x1 : x2,
                        y: i > 1 ? 560 : 402,
                        w: this.honorInfo[key].num === 1 ? 148 : 178,
                        h: 46,
                        br: 46,
                        color: '#FFF3DD',
                        color2: '#FFB363',
                    };
                });
            } else if (keys.length === 4) {
                keys.forEach((key, i) => {
                    this.posterCommonConfig.images[i + 2] = {
                        width: 100,
                        height: 100,
                        url: `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-l-${this.honorInfo[key].id}.png`,
                        x: i > 1 ? 140 + (i - 2) * 250 : 140 + i * 250,
                        y: i > 1 ? 470 : 300,
                    };
                    this.posterCommonConfig.texts[i + 2] = {
                        text: `${this.honorInfo[key].txt}${
                            this.honorInfo[key].num === 1
                                ? ''
                                : `*${this.honorInfo[key].num}`
                        }`,
                        textAlign: 'center',
                        x: i > 1 ? 190 + (i - 2) * 250 : 190 + i * 250,
                        y: i > 1 ? 594 : 434,
                        fontSize: '26',
                        color: '#FF8300',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    };
                    // // 178 148
                    const sx = 190 + i * 250 - 74;
                    const lx = 190 + i * 250 - 89;
                    const sx2 = 190 + (i - 2) * 250 - 74;
                    const lx2 = 190 + (i - 2) * 250 - 89;
                    const x1 = i > 1 ? sx2 : sx;
                    const x2 = i > 1 ? lx2 : lx;
                    this.posterCommonConfig.radiusRects[i] = {
                        x: this.honorInfo[key].num === 1 ? x1 : x2,
                        y: i > 1 ? 560 : 402,
                        w: this.honorInfo[key].num === 1 ? 148 : 178,
                        h: 46,
                        br: 46,
                        color: '#FFF3DD',
                        color2: '#FFB363',
                    };
                });
            }
        },
        togglePoster(status) {
            this.showPosterMask = status;
        },
        activityStatus() {
            // 1未开始，2进行中，3已结束
            api.get('/api/activity/activitystatus', {
                activity_id: this.filter.activity_id,
            }).then((res) => {
                this.status = res.status;
            });
        },
        getData() {
            api.get('/api/user/info').then(
                (res) => {
                    this.userInfo = res.user_info;
                    this.isLoading = false;
                    this.isSelf = res.user_info.user_id === Number(this.userId);
                    this.getWorkData();
                    this.getQrCode();
                    this.initShare();
                    this.getsigninfo();
                    this.getClockin();
                },
                () => {
                    this.isLoading = false;
                    this.userInfo = null;
                },
            );
        },

        getWorkData(title) {
            this.filter.activity_cat = 0;
            return api
                .post('/api/activity/userresource', {
                    ...this.filter,
                    status: this.tabActiveIndex,
                })
                .then(
                    ({ list, total, all_num: allNum }) => {
                        const List = list.map((d) => {
                            const D = d;
                            D.created_at_date = D.created_at.slice(5, 10);
                            if (!this.allDate[D.created_at_date]) {
                                this.allDate[D.created_at_date] = 1;
                                D.dateCount = 1;
                            } else {
                                this.allDate[D.created_at_date] += 1;
                                D.dateCount = this.allDate[D.created_at_date];
                            }
                            return D;
                        });
                        if (title === 'reachBottom') {
                            this.dataList = this.dataList.concat(List);
                        } else {
                            this.dataList = List;
                        }
                        this.total = total;
                        this.allNum = allNum;
                        this.allTotal = allNum.pass + allNum.wait + allNum.no_pass;
                        if (
                            this.total
                            <= this.filter.page_num * this.filter.page_size
                        ) {
                            this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                        } else {
                            this.loadMoreStatus = 'more';
                        }
                    },
                    () => {},
                );
        },
        onReachBottom() {
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
        setTabActive(i) {
            this.filter.page_num = 1;
            this.tabActiveIndex = i;
            this.allDate = {};
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
        },
        viewDetail(item, index) {
            if (this.tabActiveIndex === 2) {
                const from = '/api/activity/userresource';
                this.$store.commit('setFilterData', {
                    filter: this.filter,
                    position: {
                        total: this.total,
                        curposition: index,
                        from,
                    },
                });
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${item.id}&activity_id=${this.filter.activity_id}`,
                });
            }
        },
        reason({ reason }) {
            uni.showModal({
                title: '驳回原因',
                content: reason || '暂无内容',
                showCancel: false,
            });
        },
        modifyItem({ id, activity_status: activityStatus }) {
            // activityStatus 1未开始 2进行中  3已过期
            if (activityStatus === 3) {
                uni.showToast({
                    title: '活动已结束！',
                    icon: 'none',
                });
            } else {
                api.get('/api/activity/curtheme', {
                    activity_id: 12,
                }).then(({ type }) => {
                    let acType = 0;
                    let preStatus = 0;
                    if (type) {
                        acType = type;
                        preStatus = 1;
                    }
                    uni.navigateTo({
                        url: `/activity/pages/upload/modify?id=${id}&activity_id=${this.filter.activity_id}&status=${preStatus}&ac_type=${acType}&days=${this.signinfo.serial_day}`,
                    });
                });
            }
        },
        onConfirmDelete(item) {
            uni.showModal({
                title: '删除提示',
                content: '作品删除后将无法恢复 \n 确定删除吗？',
                confirmText: '确定删除',
                cancelText: '暂不删除',
                cancelColor: '#1166FF',
                confirmColor: '#999999',
                success: (res) => {
                    if (res.confirm) {
                        this.deleteItem(item);
                        console.log('用户点击确定');
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                    }
                },
            });
        },
        deleteItem(item) {
            const index = this.dataList.indexOf(item);
            api.post('/api/activity/del', {
                id: item.id,
            }).then(() => {
                if (index !== -1) {
                    this.dataList.splice(index, 1);
                    this.total -= 1;

                    this.dataList = this.dataList.map((D) => {
                        const d = D;
                        if (
                            d.created_at_date === item.created_at_date
                            && d.dateCount > item.dateCount
                        ) {
                            d.dateCount -= 1;
                        }
                        return d;
                    });
                    this.allDate[item.created_at_date] -= 1;
                    if (
                        this.dataList.length <= this.filter.page_size
                        && this.total >= this.filter.page_size
                    ) {
                        if (this.total > this.filter.page_size) {
                            this.loadMoreStatus = 'noMore';
                        }
                        this.filter.page_num = 1;
                        this.getWorkData();
                    }
                }

                uni.showToast({
                    title: '删除成功',
                });
                if (this.tabActiveIndex === 1) {
                    // 待审核
                    this.allNum.wait -= 1;
                } else if (this.tabActiveIndex === 2) {
                    // 已通过
                    this.allNum.pass -= 1;
                } else {
                    // 未通过
                    this.allNum.no_pass -= 1;
                }
            });
        },
        handleVote(item) {
            if (this.status === 2) {
                api.isLogin({
                    fr: this.fr,
                }).then((res) => {
                    this.userInfo = res;
                    api.post('/api/activity/vote', {
                        id: item.id,
                        activity_id: this.filter.activity_id,
                    }).then(
                        () => {
                            // eslint-disable-next-line no-param-reassign
                            item.ticket += 1;
                            // eslint-disable-next-line no-param-reassign
                            item.vote_status = 1;
                            uni.showToast({
                                title: '已点赞',
                                icon: 'none',
                            });
                            this.$emit('voteCallBack');
                        },
                        (res) => {
                            uni.showToast({
                                title: res.message,
                                icon: 'none',
                            });
                        },
                    );
                });
            } else {
                uni.showToast({
                    title:
                        this.status === 1
                            ? '活动未开始，敬请期待'
                            : '活动已结束',
                    icon: 'none',
                });
            }
        },
        initShare() {
            const titleList = this.isH5
                ? this.publicConfig.shareConfig.h5Title
                : this.publicConfig.shareConfig.title;
            const descList = this.publicConfig.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[random];
            if (this.isH5) {
                share({
                    title: this.title,
                    desc,
                    thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
                    url: window.location.href,
                });
            }
        },
        handleIndex() {
            uni.navigateTo({
                url: `/activity/pages/index?activity_id=${this.filter.activity_id}`,
            });
        },
    },
    onLoad(query) {
        const { type, status } = query;
        const activityId = utils.getParam(query, 'activity_id');
        const userId = utils.getParam(query, 'user_id');
        this.userId = userId;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
        }
        this.publicConfig = this.$store.getters.getPublicConfig(12);
        this.filter.activity_id = activityId;
        this.filter.user_id = userId || '';
        this.getData();
        this.activityStatus();
    },
    onShow() {
        if (!this.isH5 && this.$refs.savePoster) {
            this.$refs.savePoster.getAuthStatus();
        }
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: `/activity/pages/clocked/ucenter?user_id=${this.filter.user_id}&activity_id=12`,
        };
    },
};
</script>

<style lang="less">
.work-empty {
    text-align: center;
    background: #ffdada;
    border-radius: 0 0 20upx 20upx;
    position: relative;
    padding-bottom: 80upx;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 60upx;
    }

    view {
        color: #ff685c;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.goIndex {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 116upx;
    background: #ffe464;
    font-size: 36upx;
    font-weight: 600;
    color: #ff5547;
    line-height: 116upx;
    text-align: center;
    display: inline-block;
}
.ucenter-calendar {
    margin-bottom: 40upx;
}
.media-list {
    // overflow-y: auto;
    background: #ffdada;
    padding: 30upx;
    border-radius: 0 0 20upx 20upx;
    position: relative;
    .time {
        width: 100%;
        height: 50upx;
        margin-bottom: 20upx;
        .time-btn {
            width: 170upx;
            height: 50upx;
            background: #42b6ff;
            color: #fff;
            font-size: 28upx;
            line-height: 56upx;
            border-radius: 0 26upx 26upx 0;
            text-align: center;
            margin-left: -30upx;
            image {
                width: 26upx;
                height: 26upx;
                margin-right: 6upx;
            }
            .txt {
                position: relative;
                bottom: 2upx;
            }
        }
    }
}
.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
}
.media-content {
    width: 306upx;
    padding: 0;
    justify-items: space-betwen;
    position: relative;
    margin-bottom: 50upx;
    &.self {
        width: 630upx;
        padding: 21upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        color: #fff;
        margin-bottom: 20upx;
        border-radius: 20upx;
        background-color: #fff;
        box-shadow: inset 0px 0px 24upx 0px #ffdada;
        .work-info {
            color: #333;
            width: 300upx;
            .media-time {
                color: #666;
            }
        }
        /deep/ .event-craft-cover,
        .event-craft-cover {
            .tag {
                max-width: 130upx;
                background: #ffe967;
                color: #ff685c;
            }
            .video {
                width: 280upx;
                height: 210upx;
            }
            .like-icon {
                top: 164upx;
            }
        }
    }
    .work {
        width: 335upx;
        height: 225upx;
        border-radius: 20upx;
    }

    /deep/ .event-craft-cover,
    .event-craft-cover {
        .tag {
            max-width: 130upx;
            background: #ffe967;
            color: #ff685c;
        }
        .video {
            width: 306upx;
            height: 205upx;
        }
        .media-icon {
            width: 40upx;
            height: 40upx;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 20upx;
            text-align: center;
            line-height: 39upx;
            // #ifdef H5
            line-height: 42upx;
            // #endif
            position: absolute;
            top: 150upx;
            left: 250upx;
            image {
                width: 22upx;
                height: 22upx;
            }
        }
    }

    .work-info {
        position: relative;
        color: #fff;
        .media-name {
            width: 100%;
            font-size: 28upx;
            line-height: 32upx;
            margin-bottom: 15upx;
            color: #666;
            &.text-two-line {
                height: 63upx;
                word-break: break-all;
                color: #333;
                font-weight: 500;
            }
            // &.create-by {
            //     font-size: 28upx;
            //     line-height: 28upx;
            //     margin-bottom: 9upx;
            // }
        }

        .media-time {
            color: #fff;
            font-size: 24upx;
            opacity: 0.7;
            margin-bottom: 40upx;
            // top: 156upx;
        }
        .like-icon {
            width: 27upx;
            height: 27upx;
            margin-right: 5upx;
        }
        .vote {
            float: right;
            background-color: #ff685c;
            color: #fff;
            width: 130upx;
            height: 50upx;
            border-radius: 30upx;
            font-size: 26upx;
            line-height: 50upx;
            position: relative;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .vote-num {
            font-size: 30upx;
            color: #ff685c;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
        .btn-item {
            flex: 1;
            margin: 0 5upx;
            height: 60upx;
            background-color: #ff685c;
            border-radius: 30upx;
            font-size: 24upx;
            color: rgba(255, 255, 255, 1);
            line-height: 60upx;
            text-align: center;
            display: inline-block;
            min-width: 80upx;
            &.big {
                flex: none;
                width: 127upx;
            }
        }
    }
}

.page-read-work {
    padding: 30upx 0 116upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background-color: #ff685c;
    &.login {
        background-color: #fff !important;
    }
    .bg-top {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 210upx;
        background: #ffdada;
        border-radius: 0 0 24% 24%;
    }
    .honor-top {
        border-radius: 20upx;
        margin: 0 30upx 50upx 30upx;
        position: relative;
        &::after {
            position: absolute;
            content: "";
            width: 100%;
            height: 24upx;
            bottom: -10upx;
            left: 0;
            background: #ffa19a;
            border-radius: 0 0 20upx 20upx;
        }
        .honor-top-box {
            position: relative;
            display: flex;
            padding: 20upx 40upx 20upx 30upx;
            width: 100%;
            box-sizing: border-box;
            border-radius: 20upx;
            z-index: 1;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/honor-bg.png)
                no-repeat;
            background-color: #fff;
            background-position: right 0;
            background-size: 286upx 292upx;
            .to-open-honor {
                position: absolute;
                right: 0;
                top: 10upx;
                background: linear-gradient(#ffa284, #ff684c);
                color: #fff;
                font-size: 24upx;
                width: 160upx;
                height: 48upx;
                border-radius: 24upx 0 0 24upx;
                line-height: 48upx;
                text-align: center;
            }
        }
        .avator {
            width: 100upx;
            height: 100upx;
            margin-right: 20upx;
            border-radius: 50%;
        }
        .name {
            font-size: 32upx;
            color: #333;
            line-height: 64upx;
            font-weight: 500;
        }
        .txt {
            font-size: 28upx;
            color: #666;
            line-height: 60upx;
        }
        .flex-honor-all {
            display: flex;
            justify-content: space-between;
            margin-top: 28upx;
            width: 500upx;
            .item {
                position: relative;
                text-align: center;
                .txt {
                    color: #666;
                    font-size: 22upx;
                    line-height: 8upx;
                }
                .img {
                    width: 94upx;
                    height: 105upx;
                }
                .num {
                    position: absolute;
                    width: 24upx;
                    height: 24upx;
                    border-radius: 50%;
                    background: #ff684c;
                    color: #fff;
                    font-size: 20upx;
                    right: 20upx;
                    top: 0;
                    z-index: 1;
                    line-height: 24upx;
                    background: rgba(255, 104, 76, 1);
                    box-shadow: 0 0 6upx 0 rgba(205, 205, 205, 1),
                        0px 2px 4px 0px rgba(255, 255, 255, 0.5);
                    text-shadow: 0 0 6upx rgba(205, 205, 205, 1);
                }
            }
        }
    }
    .panel {
        padding: 0upx 30upx 0;
        position: relative;
        margin-bottom: 20upx;
        &.no-padding {
            padding-top: 10upx;
        }
        &::before {
            position: absolute;
            content: "";
            height: 24upx;
            width: 690upx;
            left: 30upx;
            bottom: -10upx;
            background: #ffa19a;
            border-radius: 0 0 20upx 20upx;
        }
        .top-bar {
            height: 72upx;
            background: linear-gradient(
                180deg,
                rgba(255, 162, 132, 1) 0%,
                rgba(255, 104, 76, 1) 100%
            );
            box-shadow: 0 20upx 40upx 0 rgba(255, 255, 255, 0.5);
            border-radius: 20upx 20upx 0 0;
            font-size: 32upx;
            font-weight: 500;
            color: #fff;
            text-align: center;
            line-height: 72upx;
        }
    }
    .panel .panel-hd {
        margin: 0;
        border-bottom: none;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 68upx;
        padding: 30upx;
        background: #ffdada;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding: 0 25upx;
        height: 68upx;
        line-height: 68upx;
        font-size: 30upx;
        color: #ff685c;
        &.active {
            background-color: #ff685c;
            color: #fff;
            border-radius: 34px;
        }
        &.active::after {
            display: none;
        }
    }

    .work-list {
        .work-item {
            // border-bottom: 1upx solid #ddd;
            padding: 20upx 0 20upx;

            position: relative;
            background: #fff6e1;
            margin-bottom: 20rpx;
        }

        .btns {
            position: absolute;
            right: 0;
            bottom: 10upx;

            .btn {
                display: inline-block;
                width: 120upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 40upx;
                background: #1166ff;
            }

            .btn-share {
                border-radius: 0;
            }
        }
    }
}
</style>
