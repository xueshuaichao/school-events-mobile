<template>
    <view class="panel widget-work">
        <view class="panel-hd">
            <text class="panel-title">
                {{ title }}
            </text>
            <view
                v-if="moreUrl"
                class="link"
                @click="openTab"
            >
                <!-- <navigator :url="moreUrl" open-type="switchTab"> -->
                更多 >
                <!-- </navigator> -->
            </view>
        </view>
        <view class="panel-bd has-swiper">
            <view
                v-for="item in info"
                :key="item.id"
                class="scroll-view-item"
            >
                <work :info="item" />
            </view>
            <!-- <scroll-view
                class="scroll-view"
                scroll-x="true"
                @scroll="scroll"
            >
                <view
                    v-for="item in info"
                    :key="item.id"
                    class="scroll-view-item"
                >
                    <work :info="item" />
                </view>
            </scroll-view> -->
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
        info: {
            type: Array,
        },
    },

    data() {
        return {
            indicatorDots: false,
            autoplay: false,
            interval: 2000,
            duration: 500,
        };
    },
    methods: {
        scroll() {},
        openTab() {
            // console.log(this.moreUrl);
            // utils.store.set('category', 2);
            uni.navigateTo({
                url: this.moreUrl,
                success: () => {
                    // console.log('switch success');
                    // const page = getCurrentPages().pop();
                    // if (page === undefined || page === null) return;
                    // console.log(page);
                },
            });
        },
    },
};
</script>

<style lang="less">
.widget-work {
    .panel-bd {
        margin: 30upx;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        .scroll-view-item {
            justify-content: space-between;
            width: 330upx;
            height: 300upx;
            margin-right: 24upx;
            margin-bottom: 30upx;
        }
    }
}

// .scroll-view {
//     white-space: nowrap;

//     .scroll-view-item {
//         display: inline-block;
//         width: 330upx;
//         height: 300upx;
//         margin-right: 24upx;
//     }
// }
</style>
