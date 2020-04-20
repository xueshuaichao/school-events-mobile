<template>
    <indexPage
        activity-name="labor"
        log="dshd"
        main-bg-color="#a1debe"
        bg-color="#05af7c"
        main-btn-color="#0f8c64"
        btn-color="#04a875"
        main-text-color="#056446"
        text-color="#08402f"
        img-bg-color="11CD95"
        :activity-id="6"
        :share-config="shareConfig"
        cat-id="18"
    />
</template>

<script>
import indexPage from '../common/index.vue';

export default {
    components: {
        indexPage,
    },
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            shareConfig: {},
            prizeList: [
                {
                    text: ['一等奖', '护眼仪'],
                },
                {
                    text: ['二等奖', '护眼灯'],
                },
                {
                    text: ['三等奖', '书包'],
                },
                {
                    text: ['四等奖', '奖状'],
                },
            ],
        };
    },
    created() {
        this.initShare();
    },
    onLoad() {
        // this.fr = logger.getFr('dshd', params);
    },
    onShow() {},
    methods: {
        initShare() {
            const title = this.isH5
                ? '我是朗读者，读给你听'
                : '4.23世界读书日，读书赢好礼，一起来读书吧！';
            const desc = this.isH5
                ? '4.23世界读书日，读书赢好礼，一起来读书吧！'
                : '';
            this.shareDesc = title;
            this.shareConfig = {
                ...this.shareConfig,
                title,
                desc,
                thumbnail:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_share.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
            };
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        return {
            title: this.shareDesc,
            path: '/pages/read/index',
        };
    },
};
</script>

<style lang="less" scoped>
.read-page-index {
    background-color: #a1debe;
}

.getStyle {
    margin-top: 45upx;
    display: flex;
    justify-content: space-between;
    view {
        text:first-child {
            color: #fff0a8;
            font-size: 28upx;
        }
        text:nth-child(2) {
            color: #fff;
            font-size: 24upx;
        }
    }
    image {
        width: 128upx;
        height: 128upx;
    }
}
.jinguizi {
    display: flex;
    justify-content: space-between;
    & > view {
        width: 305upx;
        padding: 20upx;
        height: 330upx;
        box-sizing: border-box;
        background: #ffeac9;
        border-radius: 12upx;
        image {
            width: 100%;
            height: 150upx;
        }
        & view:nth-child(2) {
            font-size: 28upx;
            color: #ff5630;
        }
        & view:last-child {
            font-size: 22upx;
            color: #c9ac67;
        }
    }
}
.register02 {
    width: 598upx;
    height: 68upx;
}

.renqi-prize {
    text-align: center;
    margin-bottom: 30upx;
    image {
        width: 248upx;
        height: 68upx;
    }
    view {
        font-size: 22upx;
        color: #fff;
    }
}
.register {
    padding: 0 30upx;
    image {
        width: 100%;
        height: 102upx;
    }
}
body.dialog-open {
    position: fixed;
    width: 100%;
}
.abc {
    position: fixed;
    z-index: 999;
    right: 0;
    top: 100upx;
}
._ul {
    ._li {
        position: relative;
        padding-left: 23upx;
        &::before {
            position: absolute;
            width: 10upx;
            height: 10upx;
            background: #fff;
            border-radius: 50%;
            content: "";
            top: 13upx;
            left: 1upx;
        }
    }
}

.loadMore {
    width: 100%;
}
.upload {
    position: fixed;
    bottom: 0upx;
    background: #04a875;
    text-align: center;
    width: 100%;
    color: #fff;
    height: 116upx;
    font-size: 36upx;
    line-height: 116upx;
    text-align: center;
    z-index: 10;
}
.upload-disable {
    position: fixed;
    bottom: 0upx;
    background: linear-gradient(
        0deg,
        rgba(133, 115, 102, 1),
        rgba(179, 170, 152, 1)
    );
    // background-size: 100% 100%;
    text-align: center;
    width: 100%;
    height: 116upx;
    color: #e4ded4;
    font-size: 36upx;
    line-height: 116upx;
    z-index: 10;
}
.prize {
    height: 242upx;
    width: 725upz;
    margin: 0 12upx;
    background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_prize.png")
        no-repeat center;
    background-size: 100% 100%;
    padding: 0 47upx;
    display: flex;
    text-align: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .prize-item {
        font-size: 20upx;
        text-align: center;
        width: 141upx;
        height: 176upx;
        &:last-of-type {
            height: 238upx;
            width: 169upx;
        }
        .prize-text-1 {
            color: #ff3442;
            width: 100%;
            font-size: 24upx;
        }
        .prize-text-2 {
            color: #08986d;
            width: 100%;
        }
        .prize-img {
            width: 116upx;
            height: 116upx;
        }
        .prize-img-text {
            width: 100%;
            height: 100%;
            margin-top: 16upx;
            display: block;
        }
    }
}
.cansai-text {
    // width: 312upx;
    height: 44upx;
    // margin-left: 220upx;
    margin-top: 20upx;
    color: #138256;
    text-align: center;
}
.active-schedule {
    display: flex;
    justify-content: space-between;
    padding: 0 30upx;
    margin-bottom: 15upx;

    & text {
        // border: 1px solid #ffcea2;
        // border-radius: 20upx;
        color: #ffcea2;
        height: 42upx;
        line-height: 42upx;
        font-size: 12px;
        padding: 0 20upx;
    }
}

.media-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
    overflow: hidden;
    .media-content {
        width: 335upx;
        justify-items: space-betwen;
        position: relative;
        margin-bottom: 50upx;
        .video {
            width: 335upx;
            height: 225upx;
        }
        .media-name {
            color: #056446;
            width: 100%;
            // left:0;
            // top:290upx;
            font-size: 24upx;
            margin-bottom: 10upx;
        }
        .vote-num {
            color: #08402f;
            font-size: 30upx;
            float: left;
        }
        .like-icon {
            width: 27upx;
            height: 27upx;
            margin-right: 5upx;
        }
        .vote {
            float: right;
            width: 170upx;
            height: 60upx;
            background: #0f8c64;
            border-radius: 30upx;
            color: rgba(255, 255, 255, 1);
            font-size: 28upx;
            text-align: center;
            line-height: 60upx;
        }
        .media-icon {
            width: 40upx;
            height: 40upx;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 20upx;
            text-align: center;
            line-height: 42upx;
            position: absolute;
            top: 175upx;
            right: 10upx;
            image {
                width: 22upx;
                height: 22upx;
            }
        }
    }
    .media-fill {
        height: 253upx;
        text-align: center;
        color: #0f8c64;
        width: 100%;
        line-height: 253upx;
    }
}

.activerulebox {
    // background: url("../../static/images/chunjie/bg.png") no-repeat;
    // background-position: 25upx 57upx;
    background-color: rgba(0, 0, 0, 0.8);
    // background-size: 93% 94%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
    color: #fff;
    z-index: 999;
    font-size: 24upx;
    &:first-child {
        font-size: 28upx;
    }
    .title {
        font-size: 28upx;
        color: #ffde6d;
        font-weight: bold;
        margin-bottom: 17upx;
    }

    .text {
        margin-bottom: 40upx;
        font-weight: 300;
        font-size: 28upx;
    }
    .title-icon {
        background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_title.png")
            no-repeat;
        background-size: 100% 100%;
        font-size: 0upx;
        width: 303upx;
        height: 90upx;
        position: absolute;
        top: -43upx;
        left: 190upx;
        text-align: center;
        line-height: 69upx;
        z-index: 222;
    }
    .close {
        background: url("https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_close.png")
            no-repeat;
        background-size: 100% 100%;
        width: 62upx;
        height: 62upx;
        top: -13upx;
        right: -12upx;
        position: absolute;
    }
    .active-content {
        background-color: #04a875;
        position: absolute;
        top: 62upx;
        left: 35upx;
        height: 92%;
        width: 678upx;
        padding: 76upx 30upx 38upx;
        box-sizing: border-box;
        padding-right: 20upx;
        border-radius: 46rpx;
        .active-rule-box {
            width: 100%;
            overflow-y: scroll;
            max-height: 100%;
            overflow-x: hidden;
        }
        .size {
            font-size: 28upx;
        }
    }
}

.page-index {
    padding-bottom: 20upx;
    display: relative;
    .main-swiper {
        .banner {
            position: relative;
            height: 889upx;
            background: url(https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/read_main.jpg)
                no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .active-rule,
            .menu-title {
                position: absolute;
                top: 19upx;
                width: 120upx;
                height: 48upx;
                line-height: 48upx;
                font-size: 22upx;
                background: #fff;
                color: #128544;
                border-radius: 24upx;
            }
            .active-rule {
                left: 15upx;
            }
            .menu-title {
                right: 15upx;
            }
        }
        .main-content {
            margin-top: -85upx;
            position: relative;
            z-index: 1;
        }
    }

    .menu-list {
        padding: 30upx;
        padding-bottom: 120upx;
        .search-box {
            overflow: hidden;
            margin-bottom: 30rpx;
            button {
                width: 144upx;
                height: 68upx;
                float: left;
                line-height: 68upx;
                color: #000;
                background: transparent;
                font-size: 30upx;
                font-weight: 700;
                border-radius: 34upx;
                padding: 0;
                &.active {
                    background: #05af7c;
                    color: #fff;
                }
                &::after {
                    border: none;
                }
            }
            .search {
                background: #05af7c;
                width: 400upx;
                height: 72upx;
                position: relative;
                float: right;
                border-radius: 60upx;

                image {
                    width: 28upx;
                    height: 28upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 12upx;
                }
                input {
                    width: 293upx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 50upx;
                    font-size: 22upx;
                    color: #e5fff7;
                }
                .search-button {
                    font-size: 24upx;
                    color: #fff;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 22upx;
                }
            }
        }
    }

    .qr-wrap {
        .qr-code {
            width: 190rpx;
            height: 190rpx;
            display: block;
            margin: 35rpx auto 15rpx;
            border-radius: 15rpx;
        }

        .text {
            font-size: 24rpx;
            text-align: center;
        }
    }
}
.stop-scroll {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>
