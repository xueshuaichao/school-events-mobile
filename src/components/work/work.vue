<template>
    <navigator
        class="comp-work"
        :class="{
            'mode-mini': mode === 'mini',
            'mode-single': mode === 'single'
        }"
        :url="`/pages/work/detail/detail?id=16`"
    >
        <view class="thumbnail-wrap">
            <image
                class="thumbnail"
                :src="info.video_img_ur || '/static/images/index/pic.png'"
            />
            <view class="browse-num">
                <image
                    class="icon-view"
                    src="/static/images/widgets/work/view.png"
                />
                {{ info.play_count || 0 }}
            </view>
        </view>
        <view class="work-info">
            <view class="work-name text-one-line">
                {{
                    info.resource_name || "爱挑战大赛-首页-1分钟单跳绳(男子组)"
                }}
            </view>

            <template v-if="mode === 'mini'">
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
            </template>

            <template v-if="mode === 'single'">
                <view class="text-info">
                    {{ info.cat_name }}
                </view>
                <view class="text-info">
                    {{ info.created_at }}
                </view>
            </template>
        </view>
    </navigator>
</template>

<script>
export default {
    props: {
        info: {
            type: Object,
        },
        mode: {
            type: String,
            // mini, single
            default: 'mini',
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="less">
.comp-work {
    display: inline-block;
    width: 330upx;
    height: 300upx;

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

    &.mode-single {
        width: 100%;
        height: auto;
        display: flex;

        .thumbnail-wrap {
            margin-right: 24upx;
            margin-bottom: 0;
        }

        .work-info {
            flex: 1;
            overflow: hidden;
        }

        .text-info {
            color: #999;
            font-size: 22upx;
            margin-top: 24upx;
        }
    }
}
</style>
