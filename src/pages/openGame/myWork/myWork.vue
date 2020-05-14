<template>
    <view class="page-my-work">
        <template v-if="type === 'myWork'">
            <image
                class="one"
                src="../../../static/images/zhibo/star.png"
            />
            <image
                class="two"
                src="../../../static/images/zhibo/star.png"
            />
            <image
                class="three"
                src="../../../static/images/zhibo/star.png"
            />
            <image
                class="four"
                src="../../../static/images/zhibo/star.png"
            />
        </template>
        <!-- identity 用户身份 1=>C端普通用户 ,2=> 教育局员工，3=>学校员工 4 学生 -->
        <!-- my works -->
        <view
            v-if="type === 'myWork'"
            class="panel"
        >
            <view class="panel-hd">
                <view class="panel-title">
                    <view
                        class="jingji-btn"
                        :class="{ active: tabActiveIndex === 1 }"
                        @click="setTabActive(1)"
                    >
                        已通过({{ allNum.pass || 0 }})
                    </view>
                </view>
                <view class="panel-title">
                    <view
                        class="jingji-btn"
                        :class="{ active: tabActiveIndex === 0 }"
                        @click="setTabActive(0)"
                    >
                        待审核({{ allNum.wait || 0 }})
                    </view>
                </view>
                <view class="panel-title">
                    <view
                        class="jingji-btn"
                        :class="{ active: tabActiveIndex === 2 }"
                        @click="setTabActive(2)"
                    >
                        未通过({{ allNum.no_pass || 0 }})
                    </view>
                </view>
            </view>
            <view class="content-box">
                <view
                    v-if="total > 0"
                    class="media-box"
                >
                    <view
                        v-for="item in dataList"
                        :key="item.id"
                        class="media-content"
                    >
                        <event-craft-cover
                            :info="item"
                            :bg-color="'006EDE'"
                            @click.native="viewDetail(item)"
                        />
                        <view
                            v-if="type === 'myWork'"
                            class="work-info work-info-mywork"
                        >
                            <view class="media-name text-one-line">
                                {{
                                    item.resource_scope === 3
                                        ? item.resource_name
                                        : item.cat_name
                                }}
                                {{
                                    item.achievement
                                        ? `|${item.achievement}${item.achievement_unit}`
                                        : ""
                                }}
                            </view>
                            <view class="media-time media-time-l">
                                {{ item.created_at }}
                            </view>
                            <view
                                v-if="tabActiveIndex === 2"
                                class="reject-reason text-three-line"
                            >
                                {{ item.reason || "" }}
                            </view>
                            <view class="btn">
                                <text
                                    v-if="Number(tabActiveIndex) === 1"
                                    class="btn-item"
                                    @click="viewDetail(item)"
                                >
                                    查看
                                </text>
                                <text
                                    v-if="Number(tabActiveIndex) === 2"
                                    class="btn-item big"
                                    @click="reason(item)"
                                >
                                    驳回原因
                                </text>
                                <text
                                    v-if="Number(tabActiveIndex) !== 1"
                                    class="btn-item"
                                    @click="modifyItem(item)"
                                >
                                    编辑
                                </text>
                                <text
                                    class="btn-item del"
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
                            <view class="media-name">
                                {{ item.cat_name }}
                                {{
                                    item.achievement
                                        ? `|${item.achievement}${item.achievement_unit}`
                                        : ""
                                }}
                            </view>
                            <view class="nameAndSchool">
                                <view class="name">
                                    {{ `${item.created_at}` }}
                                </view>
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
                        color="#333"
                    />
                </view>
                <view
                    v-if="type === 'search'"
                    v-show="searchEmpty"
                    class="empty"
                >
                    <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/empty.png"
                    />
                    <view>搜索不到您要的结果，换个关键词试试吧～</view>
                </view>
                <view
                    v-show="myWorkEmpty"
                    class="work-empty"
                >
                    <!-- <image
                        src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/work-empty.png"
                    /> -->
                    <view>
                        {{ allTotal === 0 ? "您还没有上传作品" : "暂无作品" }}
                    </view>
                    <navigator
                        v-if="allTotal === 0"
                        url="/pages/openGame/zhibo-list"
                    >
                        <view class="goUpload">
                            去上传
                        </view>
                    </navigator>
                </view>
                <button
                    class="btn goHome"
                    @click="goHome"
                >
                    {{ text }}
                </button>
                <view class="bottom-bg-box">
                    <view class="bottom-bg" />
                </view>
            </view>
        </view>
        <view
            v-else
            class="panel-before"
        >
            <view class="panel-scroll">
                <view>
                    <view class="search-box">
                        <view class="search">
                            <image
                                src="../../../static/images/zhibo/search.png"
                                @click="bindconfirm"
                            />
                            <form action="javascript:return true">
                                <input
                                    v-model="changeValue"
                                    type="text"
                                    confirm-type="search"
                                    confirm-hold="true"
                                    placeholder-style="color:#999"
                                    placeholder="搜索作者或者作品"
                                    @confirm="bindconfirm"
                                >
                            </form>
                        </view>
                    </view>
                </view>
                <view class="content-box-search">
                    <view
                        v-if="total > 0"
                        class="media-box"
                    >
                        <view
                            v-for="item in dataList"
                            :key="item.id"
                            class="media-content"
                        >
                            <event-craft-cover
                                :info="item"
                                :bg-color="'006EDE'"
                                @click.native="viewDetail(item)"
                            />
                            <view
                                v-if="type === 'myWork'"
                                class="work-info"
                            >
                                <view class="media-name text-one-line">
                                    {{ ` ${item.resource_name}` }}
                                </view>
                                <view class="media-time">
                                    {{ item.created_at }}
                                </view>
                                <view
                                    v-if="tabActiveIndex === 2"
                                    class="reject-reason text-three-line"
                                >
                                    {{ item.reason }}
                                </view>
                            </view>
                            <view
                                v-else
                                class="work-info"
                            >
                                <view class="media-name text-one-line">
                                    {{
                                        item.resource_scope === 3
                                            ? item.resource_name
                                            : item.cat_name
                                    }}
                                    {{
                                        item.achievement
                                            ? `|${item.achievement}${item.achievement_unit}`
                                            : ""
                                    }}
                                </view>
                                <view class="nameAndSchool">
                                    <view class="name text-one-line">
                                        <image
                                            src="../../../static/images/zhibo/name-icon.png"
                                        />
                                        {{ `${item.create_name}` }}
                                    </view>
                                    <view class="school text-one-line">
                                        {{ `${item.create_user_class}` }}
                                    </view>
                                </view>
                                <text class="vote-num">
                                    {{ item.praise_count }}票
                                </text>
                                <view
                                    class="vote"
                                    :class="
                                        item.is_like === 1 ? 'voted' : 'unvote'
                                    "
                                    @click="handleVote(item)"
                                >
                                    <image
                                        src="../../../static/images/zhibo/vote.png"
                                    />
                                    {{ item.is_like === 1 ? "已赞" : "点赞" }}
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
                            color="#333"
                        />
                    </view>
                    <view
                        v-if="type === 'search'"
                        v-show="searchEmpty"
                        class="empty"
                    >
                        <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/empty.png"
                        />
                        <view>搜索不到您要的结果，换个关键词试试吧～</view>
                    </view>
                    <view
                        v-show="myWorkEmpty"
                        class="work-empty"
                    >
                        <!-- <image
                            src="https://aitiaozhan.oss-cn-beijing.aliyuncs.com/yiqing/work-empty.png"
                        /> -->
                        <view>
                            {{
                                allTotal === 0 ? "您还没有上传作品" : "暂无作品"
                            }}
                        </view>
                        <navigator
                            v-if="allTotal === 0"
                            url="/pages/openGame/zhibo-list"
                        >
                            <view class="goUpload">
                                去上传
                            </view>
                        </navigator>
                    </view>
                    <button
                        class="btn goHome"
                        @click="goHome"
                    >
                        {{ text }}
                    </button>
                </view>
            </view>
            <view class="bottom-bg-box">
                <view class="bottom-bg" />
            </view>
        </view>
    </view>
</template>

<script>
// work.vue
import api from '../../../common/api';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import EventCraftCover from '../../../components/event-craft-cover/index.vue';
import utils from '../../../common/utils';

export default {
    components: {
        uniLoadMore,
        EventCraftCover,
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
                newUrl = `${val}&x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            } else {
                newUrl = `${val}?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_${height
                    * 2},w_${width * 2}`;
            }
            return newUrl;
        },
    },
    data() {
        return {
            text: '返回首页',
            dataList: [],
            changeValue: '',
            loadMoreStatus: 'none',
            mediaIcon: {
                1: '../../../static/images/chunjie/video-icon.png',
                2: '../../../static/images/chunjie/img-icon.png',
            },
            tabActiveIndex: 1,
            filter: {
                page_num: 1,
                page_size: 10,
            },
            total: 1,
            type: '',
            allNum: {},
            allTotal: 0,
        };
    },
    computed: {
        searchEmpty() {
            return this.total === 0 && this.type === 'search';
        },
        myWorkEmpty() {
            return this.total === 0 && this.type === 'myWork';
        },
    },
    methods: {
        handleVote(item) {
            if (utils.isOverDate()) {
                api.isLogin({
                    fr: this.fr,
                }).then(() => {
                    api.post('/api/common/like', {
                        object_id: item.id,
                        object_type: 1,
                        type: 1,
                    }).then(
                        () => {
                            // eslint-disable-next-line no-param-reassign
                            item.praise_count += 1;
                            // eslint-disable-next-line no-param-reassign
                            item.is_like = 1;
                            uni.showToast({
                                title: '已点赞',
                                icon: 'none',
                            });
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
                    title: '活动已结束',
                    icon: 'none',
                });
            }
        },
        goHome() {
            uni.reLaunch({
                url: '/pages/openGame/index',
            });
        },
        bindconfirm() {
            const value = this.changeValue.trim();
            if (!value) {
                uni.showToast({
                    title: '请输入搜索内容',
                    icon: 'none',
                });
                return;
            }
            this.filter.keyword = value.trim();
            this.filter.page_num = 1;
            this.searchWorkData();
        },
        getWorkData(title) {
            return api
                .post('/api/user/competitionlist', {
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
                        console.log(allNum, 'allNum');
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
        searchWorkData(title) {
            api.post('/api/works/competitionlist', this.filter).then(
                ({ list, total }) => {
                    if (title === 'reachBottom') {
                        this.dataList = this.dataList.concat(list);
                    } else {
                        this.dataList = list;
                    }

                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        // this.loadMoreStatus = 'noMore';
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                    uni.hideLoading();
                },
            );
        },
        onReachBottom() {
            console.log(this.loadMoreStatus, '到底部');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                if (this.type === 'myWork') {
                    this.getWorkData('reachBottom');
                } else {
                    this.searchWorkData('reachBottom');
                }
            }
        },
        setTabActive(i) {
            this.filter.page_num = 1;
            this.tabActiveIndex = i;
            this.getWorkData();
        },
        viewDetail(item) {
            if (this.type === 'myWork') {
                if (this.tabActiveIndex === 1) {
                    uni.navigateTo({
                        // url: `/pages/work/detail/detail?id=${item.id}&fr=${this.fr}&activity_id=5&from=yiqing`,
                        url: `/pages/work/detail/detail?id=${item.id}&from=openGame`,
                    });
                }
            } else {
                uni.navigateTo({
                    url: `/pages/work/detail/detail?id=${item.id}&from=openGame`,
                });
            }
        },
        reason({ memo }) {
            uni.showModal({
                title: '驳回原因',
                content: memo || '暂无内容',
                showCancel: false,
            });
        },
        modifyItem({ id, resource_scope: resourceScope }) {
            if (resourceScope === 3) {
                return uni.navigateTo({
                    url: `/pages/upload/modify/modify?id=${id}&from=openGame`,
                });
            }
            return uni.navigateTo({
                url: `/pages/openGame/jingjiupload?id=${id}`,
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
            api.post('/api/works/deleteraceresult', {
                resource_id: item.id,
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
                if (this.tabActiveIndex === 0) {
                    // 待审核
                    this.allNum.wait -= 1;
                } else if (this.tabActiveIndex === 1) {
                    // 已通过
                    this.allNum.pass -= 1;
                } else {
                    // 未通过
                    this.allNum.no_pass -= 1;
                }
            });
        },
    },
    onLoad(query) {
        const {
            type, name, status, column,
        } = query;
        console.log(type, 'tye');
        this.type = type;
        if (type === 'myWork') {
            if (status) {
                this.tabActiveIndex = Number(status);
            }
            this.getWorkData();
        } else if (type === 'search') {
            uni.setNavigationBarTitle({ title: '搜索' });
            this.filter.column = column;
            this.filter.keyword = name;
            this.changeValue = name;
            this.searchWorkData();
        }
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        const title = '世界吉尼斯青少年“爱挑战”网络预选赛';
        return {
            title,
            // imageUrl: 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao/yiqing-poster01.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            path: '/pages/openGame/index',
        };
    },
};
</script>

<style lang="less" scoped>
.nameAndSchool {
    display: flex;
    justify-content: space-between;
    font-size: 22upx;
    color: #999999;
    margin-top: 24rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    .name {
        width: 50%;
        float: left;
        image {
            width: 28upx;
            height: 22upx;
            margin-right: 9rpx;
        }
        .school {
            width: 50%;
            float: right;
            text-align: right;
        }
    }
}
.vote {
    float: right;
    width: 120upx;
    color: #9f1ff3;
    font-size: 22upx;
    padding: 14upx 0 14upx 24upx;
    position: relative;
    box-sizing: border-box;
    line-height: 1;
    text-align: center;
    &.unvote {
        background: #fff;
        border: 1px solid rgba(159, 31, 243, 1);
    }
    &.voted {
        background: #f5e7ff;
        border: 1px solid transparent;
    }
    image {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 25upx;
        width: 18rpx;
        height: 18rpx;
    }
}
.goHome {
    position: fixed;
    bottom: 76upx;
    right: 79upx;
    color: #333333;
    font-size: 28upx;
    width: 223upx;
    height: 84upx;
    background: url("../../../static/images/zhibo/openGame-btn.png") no-repeat;
    background-size: 100% 100%;
    line-height: 65upx;
    text-align: center;
    padding: 0;
    &::after {
        border: none;
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
        color: #333;
        font-size: 28upx;
        // margin-top: 30upx;
    }
}
.work-empty {
    text-align: center;
    position: absolute;
    top: 330rpx;
    // left: 227rpx;
    width: 100%;
    image {
        width: 300upx;
        height: 236upx;
        margin-top: 174upx;
    }
    .goUpload {
        width: 223upx;
        height: 84upx;
        background: url("../../../static/images/zhibo/openGame-btn.png")
            no-repeat;
        font-size: 28upx;
        color: #333;
        line-height: 65upx;
        text-align: center;
        background-size: 100% 100%;
        margin: 37upx auto 0;
    }
    view {
        color: #333;
        font-size: 28upx;
        // margin-top: 30upx;
    }
}
.media-box {
    background: #fff;
    .media-content {
        width: 690upx;
        padding: 21upx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        position: relative;
        margin-bottom: 20upx;
        border-radius: 20upx;
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
        .work-info {
            width: 308upx;
            position: relative;
            &.work-info-mywork {
                margin-right: 0;
                margin-left: 10upx;
                width: 316upx;
            }
            .media-name {
                width: 100%;
                font-size: 28upx;
                margin-bottom: 10upx;
                color: #333333;
                font-weight: 500;
            }
            .media-time {
                color: #999999;
                font-size: 24upx;
                &.media-time-l {
                    line-height: 60upx;
                }
            }
            .vote-num {
                color: #9f1ff3;
                font-size: 22upx;
                float: left;
                height: 50rpx;
                line-height: 50rpx;
            }
            .btn {
                display: flex;
                justify-content: space-between;
                margin-top: 20upx;
            }
            .btn-item {
                flex: 1;
                margin: 0 5upx;
                height: 50upx;
                background: #9f1ff3;
                font-size: 24upx;
                color: rgba(255, 255, 255, 1);
                line-height: 50upx;
                text-align: center;
                display: inline-block;
                border: 2upx solid #9f1ff3;
                width: 88upx;
                &.del {
                    background: #fff;
                    color: #9f1ff3;
                }
                &.big {
                    flex: none;
                    width: 100upx;
                }
            }
        }
    }
}
.page-my-work {
    padding: 30upx;
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    background: #34349c;
    .one {
        position: fixed;
        top: 51upx;
        left: 9upx;
        width: 21upx;
        height: 22upx;
    }
    .two {
        position: fixed;
        top: 527upx;
        left: 7upx;
        width: 21upx;
        height: 22upx;
    }
    .three {
        position: fixed;
        top: 445upx;
        right: 14upx;
        width: 21upx;
        height: 22upx;
    }
    .four {
        position: fixed;
        bottom: 10upx;
        right: 62upx;
        width: 21upx;
        height: 22upx;
    }
    .search-box {
        overflow: hidden;
        margin-bottom: 30rpx;
        button {
            width: 144upx;
            height: 68upx;
            float: left;
            line-height: 68upx;
            color: #ffffff;
            background: transparent;
            font-size: 30upx;
            font-weight: 700;
            border-radius: 34upx;
            padding: 0;
            &.active {
                background: #0084ff;
                color: #fff;
            }
            &::after {
                border: none;
            }
        }
        .search {
            // background: #003dd7;
            width: 624upx;
            height: 70upx;
            position: relative;
            // float: right;
            border: 1upx solid rgba(84, 8, 68, 1);
            margin-left: 30upx;
            margin-top: 40rpx;

            image {
                width: 40upx;
                height: 40upx;
                position: absolute;
                top: 50%;
                margin-top: -20upx;
                right: 22upx;
            }
            input {
                width: 534upx;
                position: absolute;
                top: 20upx;
                // #ifndef H5
                top: 15upx;
                // #endif
                left: 22upx;
                font-size: 28upx;
                color: #000;
            }
            // .search-button {
            //     font-size: 24upx;
            //     color: #fff;
            //     position: absolute;
            //     top: 20upx;
            //     right: 14upx;
            // }
        }
    }
    .panel-before {
        position: relative;
        background: #fff;
        display: flex;
        flex-flow: column;
        min-height: 95vh;
        width: 684upx;
        // border-bottom: 19upx solid #5151c6;
        // .panel-scroll {
        //     height: 100%;
        //     overflow-y: scroll;
        // }
    }
    .panel {
        min-height: 95vh;
        display: flex;
        flex-flow: column;
        // border-bottom: 19upx solid #5151c6;
    }
    .panel .panel-hd {
        border-bottom: none;
        margin: 0;
        display: flex;
        justify-content: space-around;
        height: 116upx;
        width: 716upx;

        .panel-title {
            padding: 0;
            background: url("../../../static/images/zhibo/toggleBtn-bg.png")
                no-repeat;
            width: 223upx;
            height: 116upx;
            background-size: 100% 100%;
            margin-right: 12upx;
            float: left;
            position: relative;
            .jingji-btn {
                height: 64upx;
                font-size: 32upx;
                text-align: center;
                line-height: 64upx;
                font-weight: 700;
                color: #000;
                position: absolute;
                top: 3upx;
                left: 3upx;
                right: 22upx;
                &.active {
                    background: #9f1ff3;
                    color: #fff;
                }
            }
        }
    }

    .content-box {
        // width: 670upx;
        width: 684upx;
        background: #fff;
        position: relative;
        flex: 1;
        padding-bottom: 20upx;
    }
    .content-box-search {
    }
    // .content-box::before {
    //     box-sizing: border-box;
    //     position: absolute;
    //     bottom: -19upx;
    //     content: '';
    //     left: 0;
    //     width: 100%;
    //     height: 19upx;
    //     background: #5151C6;
    //     border: 1upx solid #540844;
    //     transform: skew(45deg);
    //     transform-origin: right top;
    // }
    .content-box::after,
    .panel-before::after {
        box-sizing: border-box;
        position: absolute;
        top: 0;
        right: -19upx;
        content: "";
        width: 19upx;
        height: 100%;
        background: #7c7cde;
        border: 1upx solid rgba(84, 8, 68, 1);
        transform: skewY(45deg);
        transform-origin: left;
    }
    .bottom-bg-box {
        position: absolute;
        bottom: -16upx;
        left: 0;
        height: 16upx;
        width: 100%;
        .bottom-bg {
            width: 100%;
            height: 100%;
            background: #5151c6;
            border: 1upx solid #540844;
            border-right: 0 none;
            transform: skew(45deg);
            transform-origin: right top;
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

    .reject-reason {
        color: #999999;
        font-size: 24rpx;
        margin-top: 10rpx;
    }
}
</style>
