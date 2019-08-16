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
                    <work :info="item" />
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
import work from '../../components/work/work.vue';

export default {
    components: {
        work,
    },
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
    }
}
</style>
