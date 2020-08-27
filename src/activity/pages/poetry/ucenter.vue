<template>
    <view v-if="!isLoading">
        <template v-if="isH5">
            <img
                class="pre-img"
                crossorigin="anonymous"
                src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/clocked/clocked_honor_poster.png"
                alt=""
            >
        </template>
        <view
            class="page-read-work poetry-page"
            :class="{ login: userInfo === null }"
        >
            <login
                v-if="userInfo === null"
                @login="onLogin"
            />
            <!-- my works -->
            <template v-else>
                <view
                    class="to-open-honor"
                    @click="getMyPoster"
                >
                    炫耀下吧～
                </view>
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
                        class="clocked"
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
                            :color="publicConfig.primaryColor"
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

export default {
    components: {
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
                radiusRects: [],
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
            const uCenterUrl = `${window.location.origin}/activity/pages/clocked/ucenter?activity_id=12&user_id=${this.userInfo.user_id}&w=244`;
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
            // this.posterCommonConfig.images[1].url = this.posterCommonConfig.images[1].url
            //     || 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
            // this.posterCommonConfig.images[1].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
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
        handleIndex() {
            uni.navigateTo({
                url: `/activity/pages/index?activity_id=${this.filter.activity_id}`,
            });
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
            path: `/activity/pages/clocked/ucenter?user_id=${this.filter.user_id}&activity_id=12`,
        };
    },
};
</script>

<style lang="less">
.pre-img {
    width: 0;
    height: 0;
}
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
        padding: 30upx 30upx 0 30upx;
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
}
</style>
