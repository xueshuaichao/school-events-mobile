<template>
    <view class="comp-gift-list">
        <view class="title-wrap">
            <view class="line-wrap left">
                <view class="line" />
            </view>
            <view class="title">
                {{ data.cat_name }}
            </view>
            <view class="line-wrap right">
                <view class="line" />
            </view>
        </view>
        <view class="gifts">
            <view
                v-for="item in data.list"
                :key="item.id"
                class="gift"
                @click="showDetail(item)"
            >
                <view class="thumb-wrap">
                    <image
                        class="thumbnail"
                        :src="item.cover_img"
                    />
                    <image
                        class="tag"
                        src="/static/images/mall/prepare.png"
                    />
                </view>
                <view class="info">
                    <view class="name text-two-line">
                        {{ item.name }}
                    </view>
                    <view class="detail">
                        <view class="left">
                            <text class="em">
                                {{ item.price }}
                            </text>挑战币
                        </view>
                        <view class="right">
                            剩余<text class="em">
                                {{ item.stock }}
                            </text>件
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default() {
                return {};
            },
        },
    },
    methods: {
        showDetail(item) {
            this.$router.push({
                name: 'mall-detail',
                query: {
                    id: item.id,
                },
            });
        },
    },
};
</script>

<style lang="less">
.comp-gift-list {
    .title-wrap {
        display: flex;
        margin: 50rpx 0 30rpx;

        .line-wrap {
            flex: 1;

            &.left {
                text-align: right;
            }
        }

        .line {
            width: 165rpx;
            height: 2rpx;
            background: rgba(230, 230, 230, 1);
            display: inline-block;
        }
    }

    .title {
        color: #333;
        font-size: 32rpx;
        text-align: center;

        margin: 0 15rpx;
    }

    .gifts {
        padding-left: 20rpx;
        overflow: hidden;
    }

    .gift {
        width: 340rpx;
        height: 500rpx;
        background: #fff;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;

        .thumb-wrap {
            border-bottom: 1rpx solid rgba(247, 247, 247, 1);
            position: relative;

            .thumbnail {
                padding: 50rpx 0;
                width: 232rpx;
                height: 246rpx;
                display: block;
                margin: 0 auto;
            }

            .tag {
                position: absolute;
                width: 103rpx;
                height: 103rpx;
                top: 0;
                left: 0;
            }
        }

        .info {
            padding: 20rpx;
        }

        .name {
            height: 80rpx;
            line-height: 40rpx;
            color: #333;
            font-size: 28rpx;
        }

        .detail {
            font-size: 22rpx;
            color: #999;

            .left {
                float: left;
            }
            .right {
                float: right;
            }

            .em {
                color: #ff6e00;
            }
        }
    }
}
</style>
