<template>
    <view class="blank-wrap">
        <image
            v-if="type === 'normal'"
            class="blank-icon nor-icon"
            src="/static/images/widgets/blank/data-error.png"
        />
        <image
            v-if="type === 'uc'"
            class="blank-icon"
            src="/static/images/widgets/blank/blank.png"
        />
        <view
            v-if="type === 'normal'"
            class="text"
        >
            {{ msg }}
        </view>
        <view
            v-if="type === 'uc'"
            class="text multi"
        >
            <view>
                这个人很懒
            </view>
            <view>
                什么都没有留下
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'normal',
        },
        msg: {
            type: String,
            default: '暂无数据',
        },
    },
};
</script>

<style lang="less" scoped>
.blank-wrap {
    .blank-icon {
        display: block;
        margin: 0 auto;
        width: 194upx;
        height: 194upx;
    }
    .nor-icon {
        transform: translateX(-15upx);
        width: 190upx;
        height: 168upx;
    }

    .text {
        color: #333;
        font-size: 40upx;
        margin-top: 50upx;
        text-align: center;

        &.multi {
            line-height: 60upx;
        }
    }
}
</style>
