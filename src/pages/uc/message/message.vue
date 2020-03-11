<template>
    <view class="page-message">
        <view class="panel">
            <view
                v-if="!showCheckboxPanel"
                class="select-text"
                @click="showCheckbox(true)"
            >
                选择
            </view>
            <view
                v-else
                class="select-handle"
            >
                <checkbox-group @change="allChoose">
                    <label>
                        <checkbox
                            style="transform:scale(0.7)"
                            value="all"
                            color="#1166FF"
                            :class="{ checked: allChecked }"
                            :checked="allChecked ? true : false"
                        />全选
                    </label>
                </checkbox-group>
                <view class="btn">
                    <text @click="cancel">
                        取消
                    </text>
                    <text
                        class="btn"
                        @click="setMessageStatus"
                    >
                        标记为已读
                    </text>
                </view>
            </view>
        </view>
        <view class="message-list">
            <template v-if="showDataList">
                <checkbox-group @change="changeCheckbox">
                    <view
                        v-for="(item, index) in showDataList"
                        :key="index"
                        class="message-item"
                        :class="{ unread: !showCheckboxPanel }"
                    >
                        <text
                            v-if="!item.is_read && !showCheckboxPanel"
                            class="status"
                        />
                        <view class="checkbox-view">
                            <checkbox
                                v-if="showCheckboxPanel"
                                style="transform:scale(0.7)"
                                :value="String(item.msg_id)"
                                :checked="
                                    checkedArr.includes(String(item.msg_id))
                                "
                                class="checkbox"
                                :class="{
                                    checked: checkedArr.includes(
                                        String(item.msg_id)
                                    )
                                }"
                            />
                        </view>
                        <text class="detail-text">
                            {{ item.content }}
                        </text>
                        <view
                            v-if="item.type === 1 || item.type === 2"
                            class="handle"
                            @click="handleMessage(item.msg_id, item.type)"
                        >
                            点击查看
                        </view>
                    </view>
                </checkbox-group>
            </template>
            <template v-else>
                <blank />
            </template>
        </view>
    </view>
</template>

<script>
import api from '../../../common/api';
import blank from '../../../widgets/blank/blank.vue';

export default {
    components: {
        blank,
    },
    data() {
        return {
            showCheckboxPanel: false,
            isChecked: false,
            checkedArr: [], // 复选框选中的值
            allChecked: false, // 是否全选
            showDataList: [],
            dataList: [],
            unreadList: [],
        };
    },
    methods: {
        getDataList() {
            api.get('/api/common/msg', {
                page_size: 100,
            }).then((res) => {
                this.dataList = res.list;
                this.unreadList = this.dataList.filter(v => v.is_read === 0);
                this.showDataList = this.dataList;
                console.log(this.unreadList);
            });
        },
        handleMessage(id, type = '') {
            const idArr = Array.isArray(id) ? id : [id];
            api.post('/api/common/readmsg', {
                msg_id: idArr,
            }).then(() => {
                this.dataList.forEach((item) => {
                    idArr.forEach((itemId) => {
                        if (item.msg_id === itemId) {
                            // eslint-disable-next-line no-param-reassign
                            item.is_read = 1;
                        }
                    });
                });
                if (type === 'all') {
                    return this.resetChecbox();
                }
                return uni.navigateTo({
                    url: `/pages/uc/myWork/myWork?type=${type}`,
                });
            });
        },
        cancel() {
            this.resetChecbox();
        },
        resetChecbox() {
            // 隐藏选择状态
            this.showCheckbox(false);
            // 取消选择
            this.allChecked = false;
            this.checkedArr = [];
        },
        showCheckbox(status) {
            if (this.unreadList.length === 0) {
                return uni.showToast({
                    icon: 'none',
                    title: '暂无未读消息',
                });
            }
            this.showCheckboxPanel = status;
            if (!status) {
                this.showDataList = this.dataList;
            } else {
                this.showDataList = this.unreadList;
            }
            return true;
        },
        setMessageStatus() {
            if (this.checkedArr.length === 0) {
                uni.showToast({
                    icon: 'none',
                    title: '请选择待标记的消息',
                });
            } else {
                this.handleMessage(this.checkedArr, 'all');
            }
        },
        // 多选复选框改变事件
        changeCheckbox(e) {
            // 非选择状态下
            if (!this.changeCheckbox) {
                return false;
            }
            // 选择状态下
            const { value } = e.detail;
            this.checkedArr = value;
            // 如果选择的数组中有值，并且长度等于列表的长度，就是全选
            if (
                this.checkedArr.length > 0
                && this.checkedArr.length === this.showDataList.length
            ) {
                this.allChecked = true;
            } else {
                this.allChecked = false;
            }
            return true;
        },
        // 全选事件
        allChoose(e) {
            const chooseItem = e.detail.value;
            // 全选
            if (chooseItem[0] === 'all') {
                this.allChecked = true;
                this.showDataList.forEach((item) => {
                    const itemVal = String(item.msg_id);
                    if (!this.checkedArr.includes(itemVal)) {
                        this.checkedArr.push(itemVal);
                    }
                });
            } else {
                // 取消全选
                this.allChecked = false;
                this.checkedArr = [];
            }
        },
    },
    onLoad() {
        this.getDataList();
    },
};
</script>

<style lang="less">
/* #ifdef H5 */
uni-checkbox .uni-checkbox-input {
    border-radius: 50% !important;
    color: #ffffff !important;
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    background: #1166ff;
    border-color: #1166ff;
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked::before {
    text-align: center;
    color: #fff;
    background: transparent;
    transform: translate(-70%, -50%) scale(1);
    -webkit-transform: translate(-70%, -50%) scale(1);
}
/* #endif */
/* 微信样式 */
/* #ifdef APP-PLUS ||MP-WEIXIN */
checkbox .wx-checkbox-input {
    order-radius: 50% !important;
    color: #ffffff !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
    color: #fff;
    background: #1166ff;
}

.wx-checkbox-input.wx-checkbox-input-checked {
    background: #1166ff;
    border-color: #1166ff;
}
/* #endif */
.page-message {
    padding: 20upx 30upx 0;
    .panel {
        height: 80upx;
        line-height: 80upx;
        font-size: 30upx;
        border-bottom: 1upx solid #dddddd;
    }
    .select {
        color: #0861ff;
    }
    .select-handle {
        display: flex;
        justify-content: space-between;
        color: #000;
        .btn {
            padding-left: 10upx;
        }
    }
    .message-list {
        .message-item {
            position: relative;
            padding: 54upx 40upx 20upx 64upx;
            border-bottom: 1upx solid #dddddd;
            &.unread {
                padding-left: 26upx;
            }
        }
        .checkbox-view {
            position: absolute;
            left: 0;
            top: 60upx;
        }
        .status {
            position: absolute;
            top: 68upx;
            left: 0;
            width: 10upx;
            height: 10upx;
            border-radius: 50%;
            background-color: #ff6555;
        }
        .detail-text {
            font-size: 28upx;
            color: #000;
            word-break: break-all;
        }
        .handle {
            font-size: 28upx;
            color: #0861ff;
        }
    }
}
</style>
