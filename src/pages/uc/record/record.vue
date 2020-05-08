<template>
    <!-- 我的记录 -->
    <view class="page-record">
        <view class="panel">
            <view class="panel-hd">
                <text
                    v-for="(item, index) in navList"
                    :key="index"
                    class="panel-title"
                    :class="{ active: tabActiveIndex === index + 1 }"
                    @click="setTabActive(index + 1)"
                >
                    {{ item }}
                </text>
            </view>
        </view>
        <view
            v-if="!isLoadingTableData"
            class="panel-bd work-list"
        >
            <template v-if="tableData.length">
                <view
                    v-for="item in tableData"
                    :key="item.id"
                    class="work-item"
                >
                    <work
                        :info="item"
                        :show-class="false"
                        :show-achievement="true"
                        :show-time="false"
                        query="&from=record"
                        :mode="'single'"
                    />
                    <view class="btns">
                        <view
                            class="btn"
                            @click="creatPoster(item)"
                        >
                            生成奖状
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
                    color="#999"
                />
            </template>
            <template v-else>
                <blank />
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';
import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        work,
        blank,
        uniLoadMore,
    },
    data() {
        return {
            imgTest: '',
            itemData: {},
            wxItemData: {},
            navList: ['校级记录', '市级记录', '省级记录'],
            isLoading: true,
            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif
            filter: {
                page_num: 1,
                page_size: 10,
                record: 1,
                parent_scope: 1,
            },
            tabActiveIndex: 1,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
            canvasImg: '',
        };
    },
    created() {
        this.getWorkData();
    },
    methods: {
        onReachBottom() {
            console.log('到底部');
            if (this.loadMoreStatus === 'more') {
                this.filter.page_num = this.filter.page_num + 1;
                this.loadMoreStatus = 'loading';
                this.getWorkData('reachBottom');
            }
        },
        getWorkData(title) {
            this.filter.record = this.tabActiveIndex;
            return api.post('/api/user/worklist', this.filter).then(
                ({ list, total }) => {
                    this.isLoadingTableData = false;
                    if (title === 'reachBottom') {
                        this.tableData = this.tableData.concat(list);
                    } else {
                        this.tableData = list;
                    }
                    this.total = total;
                    if (
                        this.total
                        <= this.filter.page_num * this.filter.page_size
                    ) {
                        this.loadMoreStatus = title === 'reachBottom' ? 'noMore' : 'none';
                    } else {
                        this.loadMoreStatus = 'more';
                    }
                },
                () => {
                    this.tableData = [];
                },
            );
        },
        setTabActive(index) {
            this.filter.page_num = 1;
            this.tabActiveIndex = index;
            uni.pageScrollTo({ scrollTop: 0, duration: 300 });
            this.getWorkData();
        },
        setCanvasImg(id) {
            this.itemData = {
                ...this.itemData,
                ...this.tableData.filter(v => v.id === id)[0],
            };
            this.itemData.recordImage = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/record${this.itemData.record}.png`;
        },
        creatPoster({ id }) {
            uni.showLoading();
            this.setCanvasImg(id);
            // eslint-disable-next-line no-undef
            const url = 'pages/detail/detail';
            const scene = `id=${id}`;
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            }).then(
                // eslint-disable-next-line consistent-return
                ({ url }) => {
                    uni.hideLoading();
                    if (url) {
                        if (this.isH5) {
                            this.itemData.qrcode = url;
                            this.onCreate();
                        } else {
                            this.base64src(url, (res) => {
                                this.itemData.qrcode = res;
                            }).then((data) => {
                                if (data) {
                                    this.onCreate();
                                }
                            });
                        }
                    } else {
                        this.itemData.qrcode = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                        this.onCreate();
                    }
                },
                () => {
                    this.itemData.qrcode = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                    uni.hideLoading();
                    this.onCreate();
                },
            );

            return true;
        },
        // base64转url
        base64src(base64data, cb) {
            // eslint-disable-next-line consistent-return
            return new Promise((resolve, reject) => {
                // eslint-disable-next-line no-undef
                const fsm = wx.getFileSystemManager();
                const FILE_BASE_NAME = 'tmp_base64src'; // 自定义文件名
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
                        resolve(true);
                    },
                    fail() {
                        reject(new Error('ERROR_BASE64SRC_WRITE'));
                    },
                });
            });
        },
        onCreate() {
            uni.setStorage({
                key: 'recordData',
                data: JSON.stringify(this.itemData),
                success() {
                    uni.navigateTo({
                        url: '/pages/uc/record/result',
                    });
                },
                fail() {
                    uni.showToast({
                        icon: 'none',
                        title: '获取资源失败，请重新生成',
                    });
                },
            });
        },
    },
    onLoad() {
        this.getWorkData();
    },
};
</script>

<style lang="less">
.canvas {
    opacity: 0 !important;
}
.page-record {
    padding: 84upx 30upx 0;
    .poster-hide {
        opacity: 0 !important;
    }

    .panel {
        position: fixed;
        top: 0;
        height: 84upx;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 1;
    }
    .panel .panel-hd .panel-title {
        display: inline-block;
        padding-left: 0;
        padding-right: 0;
        color: #666;
        &.active {
            color: #1166ff;
        }
    }
    .work-list {
        .work-item {
            padding: 30upx 0 0upx;
            margin-bottom: 40upx;
            position: relative;
            .thumbnail-wrap,
            .thumbnail {
                width: 266upx;
                height: 155upx;
            }
        }
        .tag-result {
            position: absolute;
            left: 0;
            top: 8upx;
            height: 30upx;
            min-width: 45upx;
            background: rgba(17, 102, 255, 1);
            border-radius: 0px 15px 15px 0px;
            border: 1px solid rgba(255, 255, 255, 1);
            padding: 0 8upx 0 5upx;
            color: #fff;
            font-size: 20upx;
            line-height: 30upx;
            text-align: center;
        }
        .work-name {
            line-height: 1;
        }
        .text-info {
            margin-bottom: 24upx;
            margin-top: 0;
            font-size: 22upx;
        }
        .btns {
            position: absolute;
            right: 0;
            bottom: 0upx;
            height: 60upx;
            .btn {
                display: inline-block;
                padding: 0;
                min-width: 136upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 16upx;
                background: #1166ff;
                border-radius: 0;
            }
        }
    }
    .canvas-img {
        width: 689upx;
        height: 1103upx;
        image {
            width: 100%;
            height: 100%;
        }
    }
    .blank-wrap {
        margin-top: 180upx;
    }
}
</style>
