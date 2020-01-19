<script>
export default {
    onLaunch() {
        // #ifdef MP-WEIXIN
        // eslint-disable-next-line no-undef
        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
        });

        updateManager.onUpdateReady(() => {
            // eslint-disable-next-line no-undef
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                },
            });
        });

        updateManager.onUpdateFailed(() => {
            // 新版本下载失败
        });
        // #endif
    },
    onShow() {
        console.log('App Show');
    },
    onHide() {
        console.log('App Hide');
    },
};
</script>

<style>
@import "./common/animate.css";
/*每个页面公共css */
uni-tabbar .uni-tabbar__bd {
    height: 60px;
}

uni-toast .uni-simple-toast__text {
    padding: 10px;
}

.uni-body {
    font-size: 24upx;
}

.text-one-line {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.text-two-line {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.text-three-line {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.page-rich-text {
    color: #333;
    font-size: 28upx;
    line-height: 42upx;

    padding: 30upx;
}
.main-box {
    color: #333;
    font-size: 28upx;
    line-height: 42upx;
    background: #f7f7f7;
    /* padding: 30upx; */
}
.page-rich-text.no-indent {
    text-indent: 0;
}

.page-rich-text view {
    margin-bottom: 32upx;
}

.navigator-hover {
    background-color: initial;
    opacity: initial;
}
</style>

<style lang="less">
.uni-video-type-fullscreen {
    height: 100% !important;
}

.panel {
    text-align: left;
    .panel-hd {
        border-bottom: 1upx solid #ddd;
        margin: 0 30upx;
        .panel-title {
            color: #333;
            font-size: 32upx;
            display: inline-block;
            margin-right: 24upx;
            padding: 20upx;

            &.active {
                color: #1166ff;
                position: relative;

                &::after {
                    content: " ";
                    background: #1166ff;
                    width: 40upx;
                    height: 6upx;
                    display: block;
                    position: absolute;
                    left: 50%;
                    margin-left: -20upx;
                    bottom: -4upx;
                }
            }
        }

        .link {
            float: right;
            font-size: 24upx;
            color: #666;
            padding: 22upx 0;
        }
    }
    .panel-bd {
        margin: 0 30upx;

        &.has-swiper {
            margin-right: 0;
        }
    }
}

// theme
.uni-page-refresh-inner {
    svg {
        fill: #1166ff !important;
    }

    circle {
        stroke: #1166ff !important;
    }
}

uni-picker .uni-picker-action.uni-picker-action-confirm {
    color: #1166ff;
}
</style>
