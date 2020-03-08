<template>
    <div>
        <div @click="showPicker">
            <slot />
        </div>
        <div
            ref="picker"
            class="picker-pop"
            @touchmove.prevent.stop
        >
            <div
                v-show="show"
                class="picker-mask"
                @click="cancel"
            />
            <div
                class="picker-panel"
                :class="{ 'picker-panel-translate': show }"
            >
                <div class="picker-action">
                    <p
                        class="cancel"
                        :style="pickerStyle.cancel"
                        @click="cancel"
                    >
                        取消
                    </p>
                    <p
                        class="confirm"
                        :style="pickerStyle.confirm"
                        @click="confirm"
                    >
                        确定
                    </p>
                </div>
                <div class="picker-content">
                    <div
                        v-for="(column, columnIndex) in columns"
                        :key="columnIndex"
                        class="picker-column"
                        :style="pickerStyle.column[columnIndex]"
                        :data-column="columnIndex"
                        @touchstart="touchstart"
                        @touchmove="touchmove"
                    >
                        <div
                            v-if="multiple"
                            class="scroll-wrapper"
                        >
                            <view
                                class="scroll-list"
                                :class="{ 'no-padding': multiple }"
                                :animation="column.animationData"
                            >
                                <checkbox-group
                                    v-if="multiple"
                                    @change="changeCheckbox"
                                >
                                    <view
                                        v-for="(data,
                                                itemIndex) in column.pickerList"
                                        :key="itemIndex"
                                        class="picker-item"
                                    >
                                        <view class="checkbox-view">
                                            <checkbox
                                                style="transform:scale(0.7)"
                                                :value="
                                                    String(
                                                        data[pickerKey.value]
                                                    )
                                                "
                                                :checked="
                                                    checkedArray.includes(
                                                        String(
                                                            data[
                                                                pickerKey.value
                                                            ]
                                                        )
                                                    )
                                                "
                                                class="checkbox"
                                                color="#1166FF"
                                                :class="{
                                                    checked: checkedArr.includes(
                                                        String(
                                                            data[
                                                                pickerKey.value
                                                            ]
                                                        )
                                                    )
                                                }"
                                            />
                                            <text class="detail-text">
                                                {{ data[pickerKey.label] }}
                                            </text>
                                        </view>
                                    </view>
                                </checkbox-group>
                            </view>
                        </div>
                        <div
                            v-else
                            class="scroll-wrapper"
                        >
                            <div class="top-cover" />
                            <div class="bottom-cover" />
                            <view
                                class="scroll-list"
                                :animation="column.animationData"
                            >
                                <div
                                    v-for="(data,
                                            itemIndex) in column.pickerList"
                                    :key="itemIndex"
                                >
                                    <div class="picker-item">
                                        {{ data[pickerKey.label] }}
                                    </div>
                                </div>
                            </view>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        multiple: {
            type: Boolean,
            default: false,
        },
        checkedArray: {
            type: Array,
            default() {
                return [];
            },
        },
        pickerList: {
            type: Array,
            require: true,
            default() {
                return [];
            },
        },
        pickerKey: {
            type: Object,
            default() {
                return {
                    value: 'value',
                    label: 'label',
                    children: 'children',
                };
            },
        },
        pickerStyle: {
            type: Object,
            default() {
                return {
                    cancel: {},
                    confirm: {},
                    column: [],
                };
            },
        },
        defaultValue: {
            type: Array,
            default() {
                return [];
            },
        },
        columnNum: {
            type: Number,
            default: 0,
        },
        itemRotateDeg: {
            type: Number,
            default: 15,
        },
        beforeSetColumn: {
            type: Function,
            default: null,
        },
    },
    data() {
        return {
            show: false,
            reactModel: true,
            columns: [],
            checkedArr: [],
            pickerItemHeight: Math.floor(
                (68 * uni.getSystemInfoSync().windowWidth) / 750,
            ),
            startScrollTop: 0,
            lastPickedIndex: 0,
            scrollingColumnIndex: 0,
        };
    },
    computed: {
        pickerItemStyle() {
            return function (pickedIndex, itemIndex) {
                const distance = Math.abs(pickedIndex - itemIndex);
                if (distance <= 3) {
                    return {
                        transform: `rotateX(${distance
                            * this.itemRotateDeg}deg)`,
                    };
                }
                return {};
            };
        },
    },
    watch: {
        pickerList() {
            this.init();
        },
        defaultValue() {
            this.init();
        },
    },
    mounted() {},
    methods: {
        init() {
            if (Array.isArray(this.pickerList[0])) {
                this.pickerList.forEach((pickerList, index) => {
                    this.setColumn(index, pickerList);
                });
                this.reactModel = false;
            } else {
                this.setColumn(0, this.pickerList);
            }
        },
        // 多选复选框改变事件
        changeCheckbox(e) {
            this.checkedArr = e.detail.value;
        },
        showPicker() {
            this.init();
            if (this.inited) {
                this.show = true;
            } else {
                // #ifdef H5
                const $picker = this.$refs.picker;
                document.body.appendChild($picker);
                // #endif
                setTimeout(() => {
                    this.show = true;
                }, 20);
                this.inited = true;
            }
        },
        confirm() {
            const picked = {
                index: [],
                value: [],
                label: [],
                indexes: [],
                values: [],
                labels: [],
            };
            if (this.multiple) {
                picked.values = this.checkedArr;
            } else {
                // eslint-disable-next-line no-restricted-syntax
                for (const column of this.columns) {
                    const columnPicked = this.columnPickedInfo(column);
                    if (columnPicked) {
                        picked.index = columnPicked.index;
                        picked.value = columnPicked.value;
                        picked.label = columnPicked.label;

                        picked.indexes.push(columnPicked.index);
                        picked.values.push(columnPicked.value);
                        picked.labels.push(columnPicked.label);
                    } else {
                        picked.indexes.push(null);
                        picked.values.push(null);
                        picked.labels.push(null);
                    }
                }
            }
            this.$emit('confirm', picked);
            this.hide();
        },
        cancel() {
            this.$emit('cancel');
            this.hide();
        },
        hide() {
            this.show = false;
        },
        columnPickedInfo(column) {
            if (column.pickerList.length < 1) {
                return null;
            }
            return {
                index: column.pickedIndex,
                value:
                    column.pickerList[column.pickedIndex][this.pickerKey.value],
                label:
                    column.pickerList[column.pickedIndex][this.pickerKey.label],
            };
        },
        touchstart(e) {
            this.scrollingColumnIndex = e.currentTarget.dataset.column;
            this.startScrollTop = e.changedTouches[0].clientY;
            this.lastPickedIndex = this.columns[
                this.scrollingColumnIndex
            ].pickedIndex;
        },
        touchmove(e) {
            const scrollDistance = this.startScrollTop - e.changedTouches[0].clientY;
            const scrollIndex = Math.round(
                scrollDistance / this.pickerItemHeight,
            );
            const tempPickerIndex = this.lastPickedIndex + scrollIndex;
            const column = this.columns[this.scrollingColumnIndex];
            if (
                column.pickedIndex !== tempPickerIndex
                && tempPickerIndex >= 0
                && tempPickerIndex < column.pickerList.length
            ) {
                column.pickedIndex = tempPickerIndex;
                this.$emit(
                    'change',
                    column.index,
                    this.columnPickedInfo(column),
                );
                this.scrollColumn(column);
            }
        },
        setColumn(columnIndex, pickerList) {
            if (
                columnIndex === 5
                || (this.columnNum > 0 && columnIndex >= this.columnNum)
            ) {
                // limit max 5 columns
                return;
            }
            let columnPickerList = pickerList || [];
            if (this.beforeSetColumn) {
                columnPickerList = this.beforeSetColumn(
                    columnIndex,
                    columnPickerList,
                );
            }
            if (columnPickerList.length < 1) {
                if (this.columnNum === 0) {
                    this.clearColumns(columnIndex);
                    return;
                }
                if (columnIndex < this.columnNum) {
                    this.setColumn(columnIndex + 1, []);
                } else {
                    return;
                }
            }

            const currentColumn = this.columns[columnIndex] || {};
            const column = {
                index: columnIndex,
                pickerList: columnPickerList,
                pickedIndex: 0,
            };
            column.pickedIndex = Math.min(
                currentColumn.pickedIndex,
                column.pickerList.length - 1,
            ) || 0; // 使得下级column的index维持在当前选择位置
            const defaultValue = (this.defaultValue && this.defaultValue[columnIndex]) || false;
            if (
                currentColumn.pickedIndex === undefined
                && defaultValue !== false
            ) {
                // eslint-disable-next-line array-callback-return
                column.pickerList.map((pickerItem, index) => {
                    if (pickerItem[this.pickerKey.value] === defaultValue) {
                        column.pickedIndex = index;
                    }
                });
            }

            this.scrollColumn(column);
            this.$set(this.columns, columnIndex, column);
        },
        scrollColumn(column) {
            const translateY = column.pickedIndex * this.pickerItemHeight;
            // eslint-disable-next-line no-param-reassign
            column.animationData = uni
                .createAnimation({
                    duration: 200,
                    timingFunction: 'linear',
                })
                .translateY(-translateY)
                .step()
                .export();

            if (this.reactModel && column.pickerList[column.pickedIndex]) {
                this.setColumn(
                    column.index + 1,
                    column.pickerList[column.pickedIndex][
                        this.pickerKey.children
                    ],
                );
            }
        },
        clearColumns(columnIndex) {
            this.columns = this.columns.filter(
                column => column.index < columnIndex,
            );
        },
    },
};
</script>

<style lang="less" scoped>
/* #ifdef H5 */
uni-checkbox .uni-checkbox-input {
    border-radius: 50% !important;
    color: #ffffff !important;
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
    background: #1166ff !important;
    border-color: #1166ff !important;
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
.picker-pop {
    .picker-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .picker-panel {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 999;
        width: 100%;
        background-color: #fff;
        transform: translate(0, 100%);
        transition: transform 0.3s;

        .picker-action {
            display: flex;
            position: relative;
            justify-content: space-between;

            &:after {
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                height: 1px;
                transform: scaleY(0.5);
                background-color: #dedede;
            }

            p {
                color: #999;
                padding: 30rpx;
                line-height: 1;
                font-size: 36rpx;
            }
            .confirm {
                color: #007aff;
            }
        }

        .picker-content {
            height: calc(68rpx * 7);
            overflow: hidden;
            position: relative;
            display: flex;

            .picker-column {
                flex: 1;
                font-size: 32rpx;
                overflow: hidden;
            }

            .scroll-wrapper {
                position: relative;
                height: calc(68rpx * 7);

                .top-cover,
                .bottom-cover {
                    width: 100%;
                    position: absolute;
                    z-index: 1;
                    transform: translateZ(0);
                    height: calc(68rpx * 3);
                    background: linear-gradient(
                        0deg,
                        hsla(0, 0%, 100%, 0.3),
                        hsla(0, 0%, 100%, 0.9)
                    );

                    &:before {
                        content: "";
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        left: 0;
                        height: 1px;
                        transform: scaleY(0.5);
                        background-color: #dedede;
                    }
                }
                .top-cover {
                    top: 0;
                }
                .bottom-cover {
                    bottom: 0;
                    background: linear-gradient(
                        180deg,
                        hsla(0, 0%, 100%, 0.3),
                        hsla(0, 0%, 100%, 0.9)
                    );

                    &:before {
                        top: 0;
                    }
                }
                .scroll-list {
                    padding-top: calc(68rpx * 3);
                    &.no-padding {
                        padding-top: 0;
                    }

                    .picker-item {
                        text-align: center;
                        font-size: 32rpx;
                        line-height: 68rpx;
                        height: 68rpx;
                        color: #333;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }

    .picker-panel-translate {
        transform: translate(0, 0);
    }
}
</style>
