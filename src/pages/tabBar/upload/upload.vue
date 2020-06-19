<template>
    <view class="page-upload">
        <view
            v-for="item in list"
            :key="item.id"
        >
            <view
                v-if="item.id !== 7 || (item.id === 7 && !isH5)"
                class="item-card"
                @click="jumpRoute(item)"
            >
                <view class="clearfix">
                    <view class="fl-l title-activity">
                        <view class="title">
                            {{ item.activity_name || "" }}
                        </view>
                        <view class="clearfix">
                            <image
                                class="time fl-l"
                                src="/static/images/upload/time.png"
                            />
                            <view class="fl-l time-start-end">
                                活动时间：{{ item.start_time || "" }}-{{
                                    item.end_time || ""
                                }}
                            </view>
                        </view>
                    </view>
                    <view class="fl-r activity_num">
                        <image
                            class="fl-l"
                            src="/static/images/upload/fire.png"
                        />
                        <view class="count fl-r">
                            {{ item.activity_base_c || 6000 }}关注
                        </view>
                    </view>
                </view>
                <view class="banner-box">
                    <view
                        v-if="item.status === 3"
                        class="has-end"
                    >
                        已结束
                    </view>
                    <image
                        class="banner"
                        :src="item.mini_h5_img"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
// import logger from '../../../common/logger';

export default {
    data() {
        return {
            fr: '',
            activity_num: 8659,
            filter: {
                page_size: 10,
                page_num: 1,
                mini_h5_show: 1,
            },
            // #ifdef H5
            isH5: true,
            // #endif
            loading: false,
            list: [],
            total: 0,
            confList: [
                {
                    id: 10,
                    url: '/activity/pages/index?activity_id=10',
                },
                {
                    id: 9,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/liuyi-banner.png',
                    url: '/activity/pages/children/index',
                },
                {
                    id: 8,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/wuyi-banner.png',
                    url: '/pages/activity-pages/labor/index',
                },
                {
                    id: 7,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/opengame-banner.png',
                    url: '/pages/openGame/index',
                },
                {
                    id: 6,
                    img:
                        'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/h5/read-banner.png',
                    url: '/pages/read/index',
                },
                {
                    id: 5,
                    img:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/school-events-mobile/prize-banner.png',
                    url: '/pages/yiqing/index',
                },
                {
                    id: 4,
                    img:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/chunjiehao.png',
                    url: '/activity/chunjiehao/index',
                },
                {
                    id: 3,
                    img:
                        'http://aitiaozhan.oss-cn-beijing.aliyuncs.com/banner4.png',
                    url: '/activity/chunjie/index',
                },
            ],
        };
    },
    methods: {
        jumpRoute(item) {
            if (!item.url) {
                uni.showToast({
                    title: '正在为您准备精彩活动',
                    icon: 'none',
                });
            } else if (item.status === 1) {
                uni.showToast({
                    title: '活动尚未开始，敬请启期待',
                    icon: 'none',
                });
            } else {
                uni.navigateTo({
                    url: item.url,
                });
            }
        },
        getData(refresh) {
            api.post('/api/activity/list', this.filter).then(
                ({ list, total }) => {
                    this.total = total;
                    const lists = list.map((item) => {
                        let obj = item;
                        obj.start_time = obj.start_time.slice(5, 10);
                        obj.end_time = obj.end_time.slice(5, 10);
                        if (obj.activity_base > 999999999) {
                            obj.activity_base_c = '99999W+';
                        } else {
                            obj.activity_base_c = obj.activity_base > 100000
                                ? `${Math.floor(
                                    obj.activity_base / 10000,
                                )}W+`
                                : `${obj.activity_base}人`;
                        }

                        this.confList.forEach((d) => {
                            if (d.id === obj.id) {
                                obj = { ...obj, ...d };
                            }
                        });
                        return obj;
                    });
                    if (this.filter.page_num === 1) {
                        this.list = lists;
                    } else {
                        this.list = this.list.concat(lists);
                    }
                    if (refresh) {
                        uni.stopPullDownRefresh();
                    }
                },
                () => {
                    if (refresh) {
                        uni.stopPullDownRefresh();
                    }
                },
            );
        },
    },
    onLoad() {
        this.getData();
    },
    onPullDownRefresh() {
        this.filter.page_num = 1;
        this.getData('fresh');
    },
    onReachBottom() {
        if (this.total > this.filter.page_size * this.filter.page_num) {
            this.filter.page_num += 1;
            this.getData();
        }
    },
};
</script>

<style lang="less" scoped>
.page-upload {
    .title-activity {
        width: 350upx;
    }
    .item-card {
        width: 670upx;
        margin: 40upx 40upx 56upx;
        box-shadow: 0px -4px 28px 0px rgba(0, 0, 0, 0.06);
        padding-top: 20upx;
        border-radius: 4upx;
        .banner {
            width: 100%;
            height: 277upx;
            border-radius: 0 0 4upx 4upx;
            vertical-align: bottom;
        }
        .time {
            width: 22upx;
            height: 22upx;
            margin-top: 22upx;
            margin-right: 10upx;
            margin-left: 20upx;
        }
        .title {
            font-size: 30upx;
            color: #323643;
            margin-left: 20upx;
            font-weight: 600;
            line-height: 50upx;
        }
        .count {
            color: #ff6555;
            font-size: 34upx;
            margin-left: 10upx;
            margin-right: 10upx;
            position: relative;
            padding-right: 40upx;
            line-height: 28upx;
            &::before,
            &::after {
                content: "";
                border-radius: 4upx;
                transform: rotate(45deg);
                right: 4upx;
                top: 6upx;
                position: absolute;
                width: 20upx;
                height: 4upx;
                background: #ff6555;
                border-radius: 2upx;
            }
            &::after {
                transform: rotate(-45deg);
                top: 18upx;
            }
        }
        .time-start-end {
            font-size: 22upx;
            color: #999;
            line-height: 66upx;
        }
        .activity_num {
            margin-top: 40upx;
            image {
                width: 29upx;
                height: 30upx;
                margin-right: 4upx;
                margin-top: -2upx;
            }
        }
        .banner-box {
            position: relative;
        }
        .has-end {
            position: absolute;
            right: 0;
            top: 20upx;
            background: rgba(216, 216, 216, 1);
            border-radius: 15upx 0 0 15upx;
            border: 1upx solid rgba(255, 255, 255, 1);
            color: #888;
            font-size: 22upx;
            line-height: 22upx;
            padding: 4upx 15upx;
            z-index: 1;
        }
    }
}
</style>
