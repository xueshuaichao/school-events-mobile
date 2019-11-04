<template>
    <view class="page-qa">
        <view class="row">
            <view class="q-icon">
                问
            </view>
            <view class="title">
                {{ tplData.title }}
            </view>
        </view>
        <view class="row info">
            <image
                :src="tplData.image"
                class="avatar"
            />
            <view class="col">
                <view>{{ tplData.nickname }}</view>
                <view class="text-one-line">
                    {{
                        tplData.answerer_introduce
                    }}
                </view>
            </view>
        </view>
        <view class="row">
            <view class="a-icon">
                答 :
            </view>
            <view class="answer col">
                {{ tplData.content }}
            </view>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';

export default {
    data() {
        return {
            tplData: {},
            id: '',
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            api.get(`/api/works/questionone/${this.id}`).then((res) => {
                console.log(res);
                this.tplData = res;
            });
        },
    },
    onLoad(query) {
        const { id } = query;
        this.id = id;
    },
};
</script>

<style lang="less">
.page-qa {
    padding: 30rpx;
    font-size: 28rpx;
    color: #333;

    .row {
        display: flex;
    }

    .col {
        flex: 1;
        overflow: hidden;
    }

    .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 40rpx;
        margin-right: 16rpx;
    }

    .q-icon {
        width: 40rpx;
        height: 40rpx;
        background: rgba(255, 102, 13, 1);
        border-radius: 40rpx;
        font-size: 28rpx;
        color: #fff;
        text-align: center;
        margin-right: 16rpx;
    }

    .title {
        font-size: 30rpx;
        color: #333;
        margin-bottom: 30rpx;
    }

    .info {
        margin-bottom: 24rpx;
    }

    .answer {
        color: #333;
        font-size: 28rpx;
    }

    .a-icon {
        width: 56rpx;
        font-weight: 600;
        color: rgba(255, 102, 13, 1);
    }
}
</style>
