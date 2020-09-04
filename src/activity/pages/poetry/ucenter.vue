<template>
    <view v-if="!isLoading">
        <template v-if="isH5">
            <!-- <img
                class="pre-img"
                crossorigin="anonymous"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/my-title-0.png"
                alt=""
            > -->
        </template>
        <view
            class="page-my-work poetry-page"
            :class="{ login: userInfo === null }"
        >
            <login
                v-if="userInfo === null"
                @login="onLogin"
            />
            <!-- my works -->
            <template v-else>
                <view class="page-top">
                    <image
                        class="my-title"
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/my-title-1.png"
                    />
                    <view
                        class="showing"
                        @click="getMyPoster"
                    >
                        来炫耀下吧～
                    </view>
                </view>
                <view :class="['panels', isSelf ? 'is-self' : '']">
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
                        class="clocked"
                        @togglePoster="togglePoster"
                    />
                    <view
                        v-if="!isSelf"
                        class="top-bar"
                    >
                        TA的作品
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
                            已通过{{ allNum.pass || 0 }}
                        </text>
                        <text
                            class="panel-title"
                            :class="{ active: tabActiveIndex === 1 }"
                            @click="setTabActive(1)"
                        >
                            待审核{{ allNum.wait || 0 }}
                        </text>
                        <text
                            class="panel-title"
                            :class="{ active: tabActiveIndex === 3 }"
                            @click="setTabActive(3)"
                        >
                            未通过{{ allNum.no_pass || 0 }}
                        </text>
                    </view>
                    <view
                        v-if="dataList.length > 0"
                        :class="['media-list', isSelf ? '' : 'media-box']"
                    >
                        <template v-for="(item, index) in dataList">
                            <view
                                :key="item.id + index"
                                :class="['media-content', isSelf ? 'self' : '']"
                            >
                                <view class="work-main">
                                    <view class="tag">
                                        排名：1
                                    </view>
                                </view>
                                <view
                                    v-if="isSelf === true"
                                    class="work-info"
                                >
                                    <view class="media-names text-two-line">
                                        {{ item.resource_name }}
                                    </view>
                                    <view class="media-times">
                                        {{ item.created_at }}
                                    </view>
                                    <view class="btn">
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
                                    <view class="media-names text-one-line">
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
                                                `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_like_icon.png`
                                            "
                                        />
                                        赞
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
                            :color="publicConfig.primaryColor"
                        />
                    </view>
                    <view
                        v-show="myWorkEmpty"
                        class="work-empty"
                    >
                        <view v-if="isSelf">
                            <view v-if="allTotal === 0">
                                <template v-if="status === 2">
                                    <view>
                                        还没有作品哦~快来闯关吧~
                                    </view>
                                </template>
                                <template v-else>
                                    <view>
                                        ~暂无作品，快去看看精彩活动吧~
                                    </view>
                                </template>
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
                        @click="handleUpload"
                    >
                        {{
                            isSelf
                                ? status === 2
                                    ? "继续闯关"
                                    : "查看活动"
                                : "查看活动"
                        }}
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
// import EventCraftCover from '../../../components/event-craft-cover/index.vue';
import utils from '../../../common/utils';
import posterh5 from '../brand/posterh5.vue';
import savePoster from '../brand/savePoster.vue';

export default {
    components: {
        uniLoadMore,
        // EventCraftCover,
        login,
        posterh5,
        savePoster,
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
            dataList: [
                {
                    resource_name: '222',
                    ticket: 1,
                    created_at: '121',
                    id: 1,
                },
                {
                    resource_name: '222',
                    ticket: 1,
                    created_at: '121',
                    id: 2,
                },
                {
                    resource_name: '222',
                    ticket: 1,
                    created_at: '121',
                    id: 3,
                },
            ],
            changeValue: '',
            loadMoreStatus: 'none',
            tabActiveIndex: 2,
            filter: {
                page_num: 1,
                page_size: 10,
                activity_id: 14,
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
        onPosterSuccess(detail) {
            uni.hideLoading();
            this.myPoster = detail;
            this.togglePoster(true);
        },
        onPosterFail() {
            // 如果生成失败提示失败
            uni.showToast({
                title: '海报获取失败，请稍后再试',
                icon: 'none',
            });
            uni.hideLoading();
        },
        getQrCode() {
            if (this.isH5) {
                this.getH5QrCode();
            } else {
                this.getMpQrCode();
            }
        },
        getH5QrCode() {
            const uCenterUrl = `${window.location.origin}/activity/pages/poetry/ucenter?activity_id=14&user_id=${this.userInfo.user_id}&w=244`;
            this.posterCommonConfig.images[1].url = `${
                window.location.origin
            }/api/common/qrcode?url=${encodeURIComponent(uCenterUrl)}`;
            this.posterCommonConfig.images[1].borderRadius = 0;
        },
        getMpQrCode() {
            // 小程序二维码
            const url = 'activity/pages/poetry/ucenter';
            const scene = `activity_id=14&user_id=${this.userInfo.user_id}`;
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
                        this.posterCommonConfig.images[1].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    }
                },
                () => {
                    this.posterCommonConfig.images[1].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
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
            console.log(this.posterCommonConfig.images[1], 'sasasa');
            this.posterCommonConfig.images[0].url = 'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/clocked_honor_poster.png';
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
            api.get(`/api/user/showinfo?uid=${this.userId}`).then(
                (data) => {
                    this.isLoading = false;
                    this.isSelf = data.myself_page === 1;
                    this.userInfo = data;
                    this.getWorkData();
                    this.getQrCode();
                    this.initShare();
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
                            // this.dataList = list;
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
            uni.pageScrollTo({ scrollTop: 260, duration: 300 });
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
                            // this.$emit('voteCallBack');
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
        handleUpload() {
            if (this.status !== 2 || !this.isSelf) {
                uni.navigateTo({
                    url: `/activity/pages/index?activity_id=${this.filter.activity_id}`,
                });
            } else {
                uni.navigateTo({
                    url: '/activity/pages/clearance',
                });
            }
        },
    },
    onLoad(query) {
        const { type, status } = query;
        const userId = utils.getParam(query, 'user_id');
        this.userId = userId;
        this.type = type;
        if (status) {
            this.tabActiveIndex = Number(status);
        }
        this.publicConfig = this.$store.getters.getPublicConfig(14);
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
            path: `/activity/pages/poetry/ucenter?user_id=${this.filter.user_id}&activity_id=14`,
        };
    },
};
</script>

<style lang="less" scoped>
.pre-img {
    width: 0;
    height: 0;
}
.work-empty {
    text-align: center;
    position: relative;
    padding-bottom: 80upx;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 60upx;
    }

    view {
        color: #004137;
        font-size: 36upx;
        margin-top: 30upx;
    }
}
.goIndex {
    position: fixed;
    left: 100upx;
    bottom: 6upx;
    height: 90upx;
    width: 552upx;
    background: #ffe464;
    font-size: 30upx;
    font-weight: 600;
    color: #fff;
    line-height: 90upx;
    text-align: center;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/upload-btn.png);
    background-size: 100% 100%;
}
.media-list {
    margin-top: 110upx;
}
.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
}
.media-content {
    width: 342upx;
    height: 370upx;
    justify-items: space-betwen;
    position: relative;
    margin-bottom: 30upx;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/work-card.png);
    background-size: 100% 100%;
    padding: 24upx 16upx;
    box-sizing: border-box;
    .work-main {
        width: 310upx;
        height: 210upx;
        position: relative;
        background: #fff;
        .tag {
            position: absolute;
            left: 0;
            top: 20upx;
            background: #5f8b83;
            color: #fff;
            height: 38upx;
            padding: 0 18upx 0 6upx;
            box-sizing: border-box;
            font-size: 22upx;
            border-radius: 0 20upx 20upx 0;
        }
    }
    &.self {
        width: 692upx;
        height: 272upx;
        background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-card.png);
        background-size: 100% 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        color: #fff;
        margin-bottom: 20upx;
        .work-main {
            width: 330upx;
            height: 224upx;
        }
        .work-info {
            color: #333;
            width: 300upx;
            .media-times {
                color: #666;
            }
        }
    }
    .work {
        width: 335upx;
        height: 225upx;
        border-radius: 20upx;
    }

    .work-info {
        position: relative;
        color: #fff;
        .media-names {
            width: 100%;
            font-size: 28upx;
            line-height: 32upx;
            margin-bottom: 15upx;
            color: #004137;
            &.text-two-line {
                height: 63upx;
                word-break: break-all;
                color: #333;
                font-weight: 500;
            }
        }

        .media-times {
            color: #3a9184;
            font-size: 24upx;
            margin-bottom: 16upx;
        }
        .vote {
            float: right;
            width: 171upx;
            height: 66upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-btn-l.png);
            background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 66upx;
            color: #fff;
            font-size: 26upx;
            .like-icon {
                width: 38upx;
                height: 40upx;
                margin-right: 20upx;
            }
        }
        .vote-num {
            font-size: 30upx;
            color: #004137;
        }
        .btn {
            display: flex;
            justify-content: space-between;
        }
        .btn-item {
            flex: 1;
            font-size: 24upx;
            color: rgba(255, 255, 255, 1);
            line-height: 120upx;
            text-align: center;
            display: inline-block;
            width: 116upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-btn-s.png);
            background-size: 100% 100%;
            &.big {
                flex: none;
                width: 182upx;
                background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-btn-l.png);
                background-size: 100% 100%;
            }
        }
    }
}

.page-my-work {
    width: 100%;
    min-height: 100vh;
    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-bg.png);
    background-size: 750upx 1446upx;
    background-color: #93d7cd;
    background-repeat: no-repeat;
    padding-top: 20upx;
    &.login {
        background: #fff !important;
    }
    .page-top {
        position: relative;
        .my-title {
            width: 536upx;
            height: 450upx;
            margin-left: 108upx;
        }
        .showing {
            position: absolute;
            right: 16upx;
            top: 0;
            width: 228upx;
            height: 84upx;
            line-height: 84upx;
            text-align: center;
            color: #fff4f4;
            font-weight: 500;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/show-bg.png);
            background-size: 100% 100%;
        }
    }
    .panels {
        padding: 0 30upx 0;
        position: relative;
        .top-bar {
            width: 640upx;
            height: 86upx;
            font-size: 38upx;
            font-weight: 500;
            color: #fff;
            text-align: center;
            line-height: 86upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/ta-bg.png);
            background-size: 100% 100%;
            margin-top: 28upx;
            margin-top: -48upx;
        }
        .panel-hd {
            display: flex;
            justify-content: space-around;
            align-items: center;
            text-align: center;
            margin-top: -60upx;
            .panel-title {
                display: inline-block;
                height: 92upx;
                line-height: 92upx;
                font-size: 32upx;
                color: #004137;
                font-weight: 600;
                &.active {
                    background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/mywork-active.png);
                    background-size: 100% 100%;
                    color: #f7fffe;
                    width: 236upx;
                }
                &.active::after {
                    display: none;
                }
            }
        }
    }
}
</style>
