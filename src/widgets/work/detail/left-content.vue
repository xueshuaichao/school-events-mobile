<template>
    <view class="content">
        <view class="author-info">
            <image
                class="avatar"
                src="/static/images/work/avatar.png"
            />
            <text class="author-name text-one-line">
                {{ pageData.create_name }}
            </text>
        </view>
        <view
            v-if="pageData.record"
            class="school-and-record"
        >
            <text>{{ pageData.school_name }}</text>
            <image
                class="icon-grail"
                :src="`/static/images/work/record-${pageData.record}.png`"
            />
            <text class="yellow">
                {{ recordTxts[pageData.record - 1] }}
            </text>
        </view>
        <view class="work-name-wrap text-one-line">
            <text class="work-name text-one-line">
                {{ pageData.resource_name }}
            </text>
            <text
                v-if="pageData.achievement"
                class="deatil-achievement yellow"
            >
                成绩：{{ pageData.achievement }}{{ pageData.achievement_unit }}
            </text>
        </view>
        <view class="intro text-three-line">
            {{ pageData.introduce || "暂无简介" }}
        </view>
    </view>
</template>

<script>
export default {
    props: {
        pageData: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            recordTxts: ['校级记录', '市级记录', '省级记录'],
        };
    },
    methods: {},
};
</script>

<style lang="less">
.content {
    position: absolute;
    bottom: 20upx;
    width: 480rpx;
    padding: 30upx;
    color: #fff;
    left: 0;
    pointer-events: none;
    .avatar {
        display: inline-block;
        width: 34rpx;
        height: 32rpx;
        margin-right: 16upx;
    }

    .author-info {
        .author-name {
            color: #fff;
            font-size: 34upx;
            position: relative;
            top: -2rpx;
        }
        margin-bottom: 10rpx;
    }
    .school-and-record {
        font-size: 24upx;
        margin: 2upx 0 14upx 0;
    }

    .author-from {
        font-size: 24rpx;
        margin-bottom: 10rpx;
    }

    .work-name {
        font-size: 28rpx;
        color: #fff;
        margin-bottom: 13rpx;
        font-weight: 600;
        position: relative;
    }
    .deatil-achievement {
        margin-left: 10upx;
        font-size: 24upx;
    }

    .intro {
        font-size: 25upx;
        line-height: 44upx;
        margin-bottom: 30rpx;
    }

    .icon-grail {
        display: inline-block;
        width: 26upx;
        height: 22upx;
        margin-left: 22upx;
        margin-right: 2upx;
        vertical-align: middle;
    }
}
</style>
