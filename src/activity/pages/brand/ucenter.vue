<template>
    <view v-if="!isLoading">
        <view
            class="page-read-work"
            :class="{ login: userInfo === null }"
        >
            <login
                v-if="userInfo === null"
                @login="onLogin"
            />
            <!-- my works -->
            <template v-else>
                <!-- 未参与活动 -->
                <view
                    v-if="!detail || !Object.keys(detail).length"
                    class="no-join"
                >
                    <image
                        :src="
                            `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/${publicConfig.activityName}_empty_work.png`
                        "
                    />
                    <view class="text">
                        您还没有参与活动<br>快来报名参赛，赢取代言人权益吧！
                    </view>
                    <navigator :url="`/activity/pages/brand/join`">
                        <view class="join-btn">
                            报名参赛
                        </view>
                    </navigator>
                </view>
                <!-- 已经参与活动 -->
                <view
                    v-else
                    :class="['panel', isSelf ? 'is-self' : '']"
                >
                    <!-- 生成海报 -->
                    <posterh5
                        ref="posterh5"
                        :config="posterCommonConfig"
                        :hide-loading="true"
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
                    <view class="user-detail">
                        <view
                            v-if="isSelf"
                            class="poster-btn"
                            @click="getMyPoster()"
                        >
                            我的海报
                        </view>
                        <view class="user-image-info">
                            <view class="user-image">
                                <image :src="detail.image" />
                            </view>
                            <view class="user-info">
                                <view class="name">
                                    {{ detail.name }}
                                </view>
                                <view
                                    v-if="detail.school_name"
                                    class="school"
                                >
                                    {{ detail.school_name }}
                                </view>
                                <view
                                    v-if="detail.teacher"
                                    class="teacher"
                                >
                                    推荐老师：{{ detail.teacher }}
                                </view>
                                <view class="slogan">
                                    我的代言：{{ detail.slogan }}
                                </view>
                            </view>
                        </view>
                        <view
                            v-if="detail.desc"
                            class="user-desc"
                        >
                            <view>自我介绍：</view>
                            <view class="user-desc-text">
                                {{ detail.desc }}
                            </view>
                        </view>
                        <view
                            v-if="!isSelf"
                            class="user-tips"
                        >
                            记得为我点赞哦~
                        </view>
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
                        <view
                            v-for="(item, index) in dataList"
                            :key="item.id"
                            :class="['media-content', isSelf ? 'self' : '']"
                        >
                            <event-craft-cover
                                :info="item"
                                :media-icon="true"
                                :like-icon="false"
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
                                <view
                                    class="media-name create-by text-one-line"
                                >
                                    {{ detail.name }}
                                </view>
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
                                    您还没有上传作品<br>上传作品才能参与代言人评比哦！
                                </view>
                            </view>
                            <view v-else>
                                暂无作品
                            </view>
                        </view>
                        <view v-else>
                            TA还没有上传作品，去看看其他作品吧~
                        </view>
                    </view>

                    <view
                        class="goUpload"
                        @click="handleUpload"
                    >
                        {{ isSelf ? "上传作品" : "查看活动" }}
                    </view>
                </view>
            </template>

            <goHome :path="publicConfig.homePath" />
        </view>
    </view>
</template>

<script>
// work.vue
import api from '../../../common/api';
import share from '../../../common/share';
import goHome from '../common/goHome.vue';
import login from '../../../widgets/login/login.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';
import config from '../../../common/config';
import utils from '../../../common/utils';
import posterh5 from './posterh5.vue';
import savePoster from './savePoster.vue';

export default {
    components: {
        goHome,
        uniLoadMore,
        EventCraftCover,
        login,
        posterh5,
        savePoster,
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
            isSelf: false,
            detail: {},
            showPosterMask: false,
            myPoster: '',
            posterCommonConfig: {
                pixelRatio: 2,
                width: 568,
                height: 818,
                debug: false,
                texts: [
                    {
                        text: '',
                        height: 30,
                        textAlign: 'center',
                        y: 568,
                        x: 233,
                        fontSize: '30',
                        color: '#fff',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        fontWeight: 'bold',
                        zIndex: 10,
                    },
                    {
                        text: '',
                        width: 570,
                        height: 25,
                        textAlign: 'center',
                        y: 649,
                        x: 285,
                        fontSize: '24',
                        color: '#FFC953',
                        lineNum: 1,
                        textOverflow: 'ellipsis',
                        zIndex: 100,
                    },
                ],
                images: [
                    {
                        url: '',
                        width: 570,
                        height: 818,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 372,
                        height: 500,
                        y: 168,
                        x: 99,
                        borderRadius: 40,
                    },
                    {
                        url: '',
                        width: 528,
                        height: 145,
                        y: 526,
                        x: 21,
                    },
                    {
                        url: '',
                        width: 122,
                        height: 122,
                        y: 677,
                        x: 428,
                        borderRadius: this.isH5 ? 0 : 122,
                    },
                ],
            },
        };
    },
    computed: {
        myWorkEmpty() {
            return this.total === 0;
        },
    },
    methods: {
        onLogin() {
            this.getData();
        },
        uploadFile(tempFilePath) {
            this.tempFilePath = tempFilePath;
            uni.showToast({
                icon: 'loading',
                title: '上传中',
                duration: 200000,
            });
            return new Promise((resolve, reject) => {
                uni.uploadFile({
                    url: `${config.host}/api/file/uploadfile`, // 仅为示例，非真实的接口地址
                    filePath: tempFilePath,
                    name: 'file',
                    formData: {
                        file_type: 'image',
                    },
                    header: {
                        userKey: utils.getToken(),
                    },
                    success: (uploadFileRes) => {
                        let resp;
                        try {
                            resp = JSON.parse(uploadFileRes.data);
                        } catch (e) {
                            uni.showToast({
                                title: '服务器开小差了~',
                                icon: 'none',
                            });
                            return reject(e);
                        }
                        if (resp.status === 200) {
                            uni.hideToast();
                            resolve(resp.data);
                        } else {
                            // fail
                            uni.showToast({
                                title: resp.msg,
                                icon: 'none',
                            });
                            return reject(resp.msg);
                        }
                        return false;
                    },
                });
            });
        },
        onPosterSuccess(detail) {
            this.myPoster = detail;
            this.submit(detail);
            this.togglePoster(true);
        },
        onPosterFail(err) {
            console.log(err);
            uni.showToast({
                title: '生成失败，稍后再试',
                duration: 2000,
                icon: 'none',
            });
        },
        submit(path) {
            const detail = {};
            this.uploadFile(path).then((data) => {
                detail[this.isH5 ? 'poster_h5' : 'poster_mp'] = data.path;
                api.post('/api/activity/editenroll', {
                    detail,
                    activity_id: 10,
                }).then(() => {
                    this.detail[this.isH5 ? 'poster_h5' : 'poster_mp'] = data.path;
                });
            });
        },
        getQrCode() {
            if (this.isH5) {
                this.getH5QrCode();
            } else {
                this.getMpQrCode();
            }
        },
        getH5QrCode() {
            const uCenterUrl = `${window.location.origin}/activity/pages/brand/ucenter?activity_id=10&user_id=${this.userInfo.user_id}&w=244`;
            this.posterCommonConfig.images[3].url = `${
                window.location.origin
            }/api/common/qrcode?url=${encodeURI(uCenterUrl)}`;
            this.posterCommonConfig.images[3].borderRadius = 0;
        },
        getMpQrCode() {
            // 小程序二维码
            const url = '/activity/pages/brand/ucenter';
            const scene = `activity_id=10&user_id=${this.userInfo.user_id}`;
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                ({ url }) => {
                    if (url) {
                        this.base64src(url, (res) => {
                            this.posterCommonConfig.images[3].url = res;
                        });
                    } else {
                        this.posterCommonConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    }
                },
                () => {
                    this.posterCommonConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
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
            if (
                (this.isH5 && !this.detail.poster_h5)
                || (!this.isH5 && !this.detail.poster_mp)
            ) {
                this.createPoster();
            } else {
                this.togglePoster(true);
            }
        },
        createPoster() {
            const { image, name, slogan } = this.detail;
            this.posterCommonConfig.images[1].url = image;
            if (this.isH5) {
                this.posterCommonConfig.images[0].url = '/activity/static/children_img/brand_poster.jpg';
                this.posterCommonConfig.images[2].url = '/activity/static/children_img/brand_poster_name.png';
            } else {
                this.posterCommonConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster.jpg';
                this.posterCommonConfig.images[2].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/brand_poster_name.png';
            }
            this.posterCommonConfig.texts[0].text = `我是${name}`;
            this.posterCommonConfig.texts[1].text = slogan;
            this.$refs.posterh5.createPoster(this.posterCommonConfig);
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
                    this.getWorkData();
                    this.getQrCode();
                    this.getEnrollInfo().then((data) => {
                        if (!Array.isArray(data)) {
                            if (data.detail) {
                                this.detail = data.detail;
                                this.myPoster = data.detail[
                                    this.isH5 ? 'poster_h5' : 'poster_mp'
                                ];
                            }
                            this.isSelf = data.is_self;
                        }
                        this.isLoading = false;
                    });
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
                        if (title === 'reachBottom') {
                            this.dataList = this.dataList.concat(list);
                        } else {
                            this.dataList = list;
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
        getEnrollInfo() {
            return api.get('/api/activity/getenrollinfo', {
                activity_id: this.filter.activity_id,
                user_id: this.userId,
            });
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
                return uni.showToast({
                    title: '活动已结束！',
                    icon: 'none',
                });
            }
            return uni.navigateTo({
                url: `/activity/pages/upload/modify?id=${id}&activity_id=${this.filter.activity_id}`,
            });
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
                }).then(() => {
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

            share({
                title: this.title,
                desc,
                thumbnail: `${this.publicConfig.shareConfig.image}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100`,
                url: `${this.isH5 ? window.location.href : ''}`,
            });
        },
        handleUpload() {
            if (!this.iself) {
                return uni.navigateTo({
                    url: `/activity/pages/index?activity_id=${this.filter.activity_id}`,
                });
            }
            if (this.isH5) {
                return uni.showToast({
                    title: '请在UP爱挑战小程序上传作品',
                    icon: 'none',
                });
            }
            if (this.status === 2) {
                api.isLogin().then(
                    () => {
                        uni.navigateTo({
                            url: `/activity/pages/upload/modify?activity_id=${this.filter.activity_id}`,
                        });
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
    onLoad(query) {
        const {
            type,
            status,
            activity_id: activityId,
            user_id: userId,
        } = query;
        this.userId = userId;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
        }
        this.publicConfig = this.$store.getters.getPublicConfig(activityId);
        this.filter.activity_id = activityId;
        this.filter.user_id = userId || '';
        this.getData();
        this.activityStatus();
        this.initShare();
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
        // const pages = getCurrentPages(); // eslint-disable-line
        // const { route } = pages[2];
        // const { user_id: userId } = pages[2].options;
        const noJoin = !this.detail || !Object.keys(this.detail).length;
        return {
            title: this.title,
            imageUrl: this.publicConfig.shareConfig.image,
            path: noJoin
                ? this.publicConfig.shareConfig.path
                : `/activity/pages/brand/ucenter?id=${this.filter.user_id}&activity_id=10`,
        };
    },
};
</script>

<style lang="less">
.no-join {
    padding-top: 256upx;
    & > image {
        display: block;
        margin: 0 auto;
        width: 300upx;
        height: 204upx;
        margin-bottom: 10upx;
    }
    .text {
        text-align: center;
        color: #fff;
        font-size: 28upx;
        line-height: 66upx;
    }
    .join-btn {
        height: 110upx;
        width: 420upx;
        text-align: center;
        line-height: 110upx;
        color: #fff;
        font-size: 36upx;
        font-weight: 600;
        border-radius: 55upx;
        margin: 20upx auto;
        background-color: #ff685c;
    }
}
.user-detail {
    box-shadow: inset 0 0 24upx 0 rgba(152, 130, 255, 1);
    background-color: #fff;
    padding: 20upx;
    border-radius: 20upx;
    position: relative;
    margin-bottom: 40upx;
    .poster-btn {
        position: absolute;
        right: -11upx;
        top: 20upx;
        background-color: #ff574a;
        border-radius: 24upx 0 0 24upx;
        padding: 0upx 23upx;
        height: 48upx;
        line-height: 48upx;
        color: #fff;
        font-size: 22upx;
        &::after {
            content: "";
            position: absolute;
            bottom: -9upx;
            right: 6upx;
            width: 0;
            height: 0;
            border-top: 6upx solid transparent;
            border-bottom: 6upx solid transparent;
            border-right: 6upx solid #c40d00;
            transform: rotate(44deg);
        }
    }
    .user-image-info {
        display: flex;
        margin-bottom: 20upx;
        .user-image {
            width: 220upx;
            height: 292upx;
            image {
                width: 100%;
                height: 100%;
                border-radius: 10upx;
                display: inline-block;
            }
            margin-right: 40upx;
            border-radius: 10upx;
        }
        .user-info {
            color: #333;
            line-height: 28upx;
            flex: 1;
            .name {
                font-size: 30upx;
                font-weight: 500;
                margin-bottom: 19upx;
                padding-top: 8upx;
            }
            .school {
                margin-bottom: 40upx;
                line-height: 36upx;
            }
            .teacher {
                margin-bottom: 38upx;
                font-size: 28upx;
            }
            .slogan {
                color: #583ed4;
                font-weight: 500;
                font-size: 26upx;
                line-height: 40upx;
                word-break: break-all;
            }
        }
    }
    .user-desc {
        padding: 20upx;
        color: #333;
        background-color: #ddd6ff;
        border-radius: 10upx;
        word-break: break-all;
        font-size: 26upx;
        .user-desc-text {
            max-height: 96upx;
            overflow-y: auto;
            word-break: break-all;
        }
    }
    .user-tips {
        padding-top: 20upx;
        color: #9882ff;
        font-size: 26upx;
        text-align: center;
    }
}
.empty {
    text-align: center;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 174upx;
    }
    view {
        color: #0f8c64;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.work-empty {
    text-align: center;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 60upx;
    }

    view {
        color: #fff;
        font-size: 28upx;
        margin-top: 30upx;
    }
}
.goUpload {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 116upx;
    background: #ff685c;
    font-size: 36upx;
    font-weight: 600;
    color: #fff;
    line-height: 116upx;
    text-align: center;
    display: inline-block;
}
.media-list {
    overflow-y: auto;
}
.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
}
.media-content {
    width: 335upx;
    padding: 0;
    justify-items: space-betwen;
    position: relative;
    margin-bottom: 50upx;
    &.self {
        width: 690upx;
        padding: 21upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        color: #fff;
        margin-bottom: 20upx;
        border-radius: 20upx;
        background-color: #fff;
        box-shadow: inset 0px 0px 24upx 0px rgba(152, 130, 255, 1);
        .work-info {
            color: #333;
            width: 300upx;
            .media-time {
                color: #666;
            }
        }
    }
    .work {
        width: 335upx;
        height: 225upx;
        border-radius: 20upx;
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
        top: 175upx;
        left: 290upx;
        image {
            width: 22upx;
            height: 22upx;
        }
    }
    /deep/ .event-craft-cover,
    .event-craft-cover {
        .tag {
            max-width: 130upx;
            background: #ffe79c;
            color: #bb77ff;
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
            &.text-two-line {
                height: 63upx;
            }
            &.create-by {
                font-size: 28upx;
                line-height: 28upx;
                margin-bottom: 9upx;
            }
        }

        .media-time {
            color: #fff;
            font-size: 24upx;
            opacity: 0.7;
            margin-bottom: 66upx;
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
            width: 170upx;
            height: 60upx;
            border-radius: 30upx;
            font-size: 28upx;
            line-height: 60upx;
            position: relative;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .vote-num {
            font-size: 30upx;
            color: #fff;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
        .btn-item {
            flex: 1;
            margin: 0 5upx;
            height: 50upx;
            background-color: #ff685c;
            border-radius: 25upx;
            font-size: 24upx;
            color: rgba(255, 255, 255, 1);
            line-height: 50upx;
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
    background-color: #583ed4;
    &.login {
        background-color: #fff !important;
    }
    .panel {
        padding: 0upx 30upx 0;
        &.no-padding {
            padding-top: 10upx;
        }
    }
    .panel .panel-hd {
        margin: 0;
        border-bottom: none;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 68upx;
        background-color: #583ed4;
        padding: 0upx 0 30upx;
    }

    .panel .panel-hd .panel-title {
        display: inline-block;
        padding: 0 25upx;
        height: 68upx;
        line-height: 68upx;
        font-size: 30upx;
        color: #fff;
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

    .blank-wrap {
        margin-top: 180upx;
    }
    .goHome {
        color: #583ed4;
        &::before {
            border-top: 1rpx solid #583ed4 !important;
            border-right: 1rpx solid #583ed4 !important;
        }
        bottom: 130upx;
    }
}
</style>
