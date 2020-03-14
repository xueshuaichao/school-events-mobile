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
        <view class="author-from">
            {{ pageData.school_name }}
        </view>
        <view class="work-name-wrap text-one-line">
            <image
                class="avatar"
                src="/static/images/work/file.png"
            />
            <text class="work-name text-one-line">
                {{ pageData.resource_name }}
            </text>
        </view>
        <view class="intro text-three-line">
            {{ pageData.introduce || "暂无简介" }}
        </view>
        <view class="from">
            <text
                v-if="pageData.recommend"
                class="recommend text-one-line"
            >
                单位：{{ pageData.recommend || "是简介信息这是简介信息这" }}
            </text>
            <text
                v-if="pageData.teacher"
                class="teacher text-one-line"
            >
                指导老师：{{ pageData.teacher || "李四" }}
            </text>
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
    bottom: 0;
    width: 480rpx;
    padding: 30upx;
    color: #fff;
    pointer-events: none;
    .avatar {
        display: inline-block;
        width: 24rpx;
        height: 26rpx;
        margin-right: 16upx;
    }

    .author-info {
        .author-name {
            color: #fff;
            font-size: 28upx;
            position: relative;
            top: -2rpx;
        }
        margin-bottom: 10rpx;
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
        top: -2rpx;
    }

    .extra {
        font-size: 22upx;
        margin-bottom: 32upx;
    }

    .intro {
        font-size: 28upx;
        line-height: 44upx;
        margin-bottom: 30rpx;
    }

    .icon-grail {
        display: inline-block;
        width: 32upx;
        height: 32upx;
        margin-left: 32upx;
    }
}
.from {
    font-size: 24rpx;

    .recommend {
        width: 260rpx;
        display: inline-block;
    }

    .teacher {
        display: inline-block;
        width: 220rpx;
    }
}
</style>
