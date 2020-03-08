<template>
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
        <view class="hide">
            <poster
                id="poster"
                :config="posterConfig"
                @success="onPosterSuccess"
                @fail="onPosterFail"
            />
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
                        :mode="'single'"
                    >
                        <view
                            slot="tag"
                            class="tag-result"
                        >
                            {{ item.achievement }}
                        </view>
                    </work>
                    <view class="btns">
                        <view
                            class="btn"
                            @click="creatPoster(item)"
                        >
                            生成奖状
                        </view>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import work from '../../../components/work/work.vue';

export default {
    components: {
        work,
    },
    data() {
        return {
            navList: ['校级记录', '市级记录', '省级记录'],
            isLoading: true,
            userInfo: null,

            // #ifdef H5
            isH5: true,
            // #endif

            tabActiveIndex: 1,
            workStatics: {},
            isLoadingTableData: true,
            tableData: [],
            canvasImg: '',
            posterConfig: {
                pixelRatio: 3,
                width: 689,
                height: 1103,
                debug: true,
                texts: [
                    {
                        x: 50,
                        y: 101,
                        text: [
                            {
                                text: '作品名称',
                                fontSize: 29,
                                color: '#ACAFBF',
                                opacity: 1,
                                marginRight: 10,
                                lineHeight: 40,
                                lineNum: 1,
                                width: 1210,
                                textOverflow: 'ellipsis',
                            },
                        ],
                        baseLine: 'middle',
                    },
                ],
                images: [
                    {
                        url:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/recordbg.png',
                        width: 689,
                        height: 1103,
                        y: 0,
                        x: 0,
                    },
                    {
                        url: '',
                        width: 485,
                        height: 324,
                        y: 276,
                        x: 103,
                    },
                    {
                        url: '',
                        width: 313,
                        height: 68,
                        y: 959,
                        x: 103,
                    },
                    {
                        url: '',
                        width: 100,
                        height: 100,
                        y: 918,
                        x: 529,
                    },
                ],
            },
        };
    },
    created() {
        this.getWorkData();
        const texts = [
            '作品名称：',
            '成绩：',
            '记录等级：',
            '参赛者姓名：',
            '学校年级：',
            '创建记录时间：',
        ];
        const textStyle = {
            fontSize: 24,
            lineHeight: 72,
            color: '#ACAFBF',
            width: 450,
        };
        const position = {
            x: 101,
            y: 590,
            ySpace: 50,
            xSpace: 0,
        };
        this.posterConfig.texts = this.posterText(texts, textStyle, position);
        console.log(111, this.posterText(texts, textStyle, position));
    },
    methods: {
        getWorkData(record = 1) {
            return api
                .get('/api/user/worklist', {
                    record,
                    resource_scope: [1, 2],
                    page_size: 100,
                })
                .then(
                    (res) => {
                        this.isLoadingTableData = false;
                        this.tableData = res.list;
                    },
                    () => {
                        this.tableData = [];
                    },
                );
        },
        setTabActive(index) {
            this.tabActiveIndex = index;
            this.getWorkData(index);
        },
        posterText(texts, textStyle = {}, position = {}) {
            let defaultStyle = {
                ...textStyle,
                opacity: 1,
                lineNum: 1,
                textOverflow: 'ellipsis',
            };
            console.log(defaultStyle);
            let defaultPositon = {
                x: position.x,
                y: position.y,
            };
            return texts.map((item) => {
                defaultStyle = {
                    ...defaultStyle,
                    text: item,
                };
                defaultPositon = {
                    x: defaultPositon.x + position.xSpace,
                    y: defaultPositon.y + position.ySpace,
                };
                return {
                    ...defaultPositon,
                    text: [defaultStyle],
                    baseLine: 'middle',
                };
            });
        },
        onPosterSuccess(e) {
            const { detail } = e;
            uni.navigateTo({
                url: `/pages/uc/record/result?img=${detail}`,
            });
        },
        onPosterFail(e) {
            console.log(e);
        },
        setCanvasImg(id) {
            const itemData = this.tableData.filter(v => v.id === id)[0];
            this.posterConfig.images[1].url = itemData.video_img_url;
            const record = ['校级记录', '市级记录', '省级记录'];
            this.posterConfig.images[2].url = `https://aitiaozhan.oss-cn-beijing.aliyuncs.com/record/record${itemData.record}.png`;
            const texts = [
                itemData.resource_name,
                `${itemData.achievement}${itemData.achievement_unit}`,
                record[itemData.record - 1],
                itemData.create_name,
                itemData.create_user_class,
                itemData.created_at,
            ];
            const textStyle = {
                fontSize: '28',
                lineHeight: '72',
                color: '#4D4E56',
                width: 980,
            };
            const position = {
                x: 283,
                y: 590,
                ySpace: 50,
                xSpace: 0,
            };
            // console.log(this.posterText(texts, textStyle, position))
            this.posterConfig.texts = this.posterConfig.texts.concat(
                this.posterText(texts, textStyle, position),
            );
        },
        creatPoster({ id }) {
            uni.showLoading();
            this.setCanvasImg(id);
            // eslint-disable-next-line no-undef
            const pages = getCurrentPages(); // 获取加载的页面
            const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
            const url = currentPage.route || 'pages/detail/detail';
            const scene = `id=${id}`;
            api.post('/api/weixin/getminiqrcode', {
                path: url,
                scene,
            })
                .then(
                    // eslint-disable-next-line consistent-return
                    ({ url }) => {
                        uni.hideLoading();
                        if (url) {
                            this.base64src(url, (res) => {
                                this.posterConfig.images[3].url = res;
                            }).then((data) => {
                                if (data) {
                                    this.poster.onCreate();
                                }
                            });
                        } else {
                            this.posterConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                            return false;
                        }
                    },
                    () => {
                        this.posterConfig.images[3].url = 'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/main-erweima.png';
                        return false;
                    },
                )
                .then((data) => {
                    if (!data) {
                        this.poster.onCreate();
                    }
                });
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
    },
    onReady() {
        this.poster = this.selectComponent('#poster');
    },
};
</script>

<style lang="less">
.page-record {
    padding: 0 30rpx;
    .hide {
        opacity: 0;
    }
    .panel .panel-hd {
        border-bottom: none;
        margin: 0 30rpx 20rpx;
        display: flex;
        justify-content: space-around;
    }
    .panel .panel-hd .panel-title {
        display: inline-block;
        padding-left: 0;
        padding-right: 0;
        &.active::after {
            background: #1166ff;
        }
    }
    .work-list {
        .work-item {
            border-bottom: 1upx solid #ddd;
            padding: 30upx 0 100upx;

            position: relative;
        }
        .tag-result {
            position: absolute;
            left: 0;
            top: 8upx;
            height: 30upx;
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
            bottom: 20upx;
            height: 66upx;

            .btn {
                display: inline-block;
                padding: 0 28upx;
                height: 60upx;
                font-size: 26upx;
                line-height: 60upx;
                color: #fff;
                text-align: center;
                margin-left: 40upx;
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
