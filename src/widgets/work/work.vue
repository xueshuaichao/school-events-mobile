<template>
    <view class="panel widget-work">
        <view class="panel-hd">
            <text class="panel-title">
                {{ title }}
            </text>
            <text
                v-if="moreUrl"
                class="link"
            >
                <navigator url="/pages/detail/rule/rule">
                    更多 >
                </navigator>
            </text>
        </view>
        <view class="panel-bd has-swiper">
            <scroll-view
                class="scroll-view"
                scroll-x="true"
                @scroll="scroll"
            >
                <view
                    v-for="item in items"
                    :key="item.id"
                    class="scroll-view-item"
                >
                    <view class="work">
                        <view class="thumbnail-wrap">
                            <image
                                class="thumbnail"
                                :src="item.image"
                            />
                            <view class="browse-num">
                                <image
                                    class="icon-view"
                                    src="/static/images/widgets/work/view.png"
                                />
                                31
                            </view>
                        </view>
                        <view class="work-name text-one-line">
                            爱挑战大赛-首页-1分钟单跳绳(男子组)
                        </view>
                        <view class="work-author">
                            <view class="name text-one-line">
                                <image
                                    class="icon-user"
                                    src="/static/images/widgets/work/user.png"
                                />
                                王苗王苗
                            </view>
                            <view class="from text-one-line">
                                爱华小学四年纪
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
        },
        moreUrl: {
            type: String,
        },
    },
    data() {
        return {
            indicatorDots: false,
            autoplay: false,
            interval: 2000,
            duration: 500,

            items: [
                {
                    image: '/static/images/index/pic.png',
                    title: '1分钟单跳绳(男子组）测试一下',
                },
                {
                    image: '/static/images/index/pic.png',
                },
                {
                    image: '/static/images/index/pic.png',
                },
                {
                    image: '/static/images/index/pic.png',
                },
                {
                    image: '/static/images/index/pic.png',
                },
                {
                    image: '/static/images/index/pic.png',
                },
            ],
        };
    },
    methods: {
        scroll() {},
    },
};
</script>

<style lang="less">
.widget-work {
    .panel-bd {
        padding: 30upx 0;
    }
}

.scroll-view {
    white-space: nowrap;

    .scroll-view-item {
        display: inline-block;
        width: 330upx;
        height: 300upx;
        margin-right: 24upx;

        .thumbnail-wrap {
            width: 330upx;
            height: 187upx;
            margin-bottom: 24upx;
            position: relative;

            .browse-num {
                position: absolute;
                right: 16upx;
                bottom: 16upx;
                color: #fff;
                font-size: 22upx;

                .icon-view {
                    display: inline-block;
                    width: 28upx;
                    height: 18upx;
                    margin-right: 8upx;
                }
            }

            .thumbnail {
                width: 330upx;
                height: 187upx;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }

        .work-name {
            font-size: 28upx;
            color: #333;
            margin-bottom: 24upx;
        }

        .work-author {
            display: flex;
            color: #999;
            font-size: 22upx;

            .icon-user {
                display: inline-block;
                width: 28upx;
                height: 22upx;
                // background: url('/static/images/widgets/work/user.png');
                // background-size: 28upx 22upx;
                // position: relative;
                top: 4upx;
                margin-right: 10upx;
            }

            .name {
                width: 135upx;
            }

            .from {
                flex: 1;
                text-align: right;
            }
        }
    }
}
</style>
