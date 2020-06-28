<template>
    <view class="image-drag-sort">
        <view
            id="inner"
            class="inner"
        >
            <movable-area class="movable-area">
                <view
                    v-for="(item, index) in lists"
                    :key="index"
                    class="item"
                    @longpress="longtap"
                    @touchend="touchend"
                    @touchmove.stop="touchm"
                >
                    <image
                        class="img"
                        :src="item"
                        mode="aspectFill"
                        @click="imageTap(index)"
                    />
                    <img
                        class="icon-del"
                        src="/static/images/work/icon-del.png"
                        @click="imageDel(index)"
                    >
                    <view
                        v-if="index === 0"
                        class="tag"
                    >
                        封面
                    </view>
                </view>
                <movable-view
                    v-show="active"
                    class="movable-view"
                    :x="x"
                    :y="y"
                    direction="all"
                    damping="5000"
                    friction="1"
                >
                    <view
                        class="item-move"
                        :class="{ 'item-move-active': active }"
                    >
                        <image
                            class="img"
                            :src="lists[beginIndex]"
                            mode="aspectFill"
                        />
                    </view>
                </movable-view>
            </movable-area>
        </view>
        <view
            v-if="lists.length > 0"
            class="prompt"
        >
            点击预览/删除图片，长按拖拽排序，共{{ lists.length }}张图片
        </view>
    </view>
</template>
<script>
let wrapW = 0; // 拖拽范围的总宽度
let wrapH = 0; // 拖拽范围的总高度
let wrapW2 = 0; // 可拖拽区域宽度
let wrapH2 = 0; // 可拖拽区域高度
let wrapTop = 0; // 拖拽范围的上边界坐标
let wrapLeft = 0; // 拖拽范围的左边界坐标
let wrapDragTop = 0; // 可拖拽范围的上边界坐标
let wrapDragLeft = 0; // 可拖拽范围的左边界坐标
let itemW = 0; // 拖拽元素的宽
let itemH = 0; // 拖拽元素的高
let itemXNun = 0; // 拖拽元素的列数
export default {
    name: 'ImageDragSort',
    props: {
        list: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            lists: this.list,
            active: false, // 是否拖拽状态
            flag: false, // 是否可拖拽
            x: 0,
            y: 0,
            beginIndex: null, // 当前拖拽元素的索引
        };
    },
    watch: {
        lists(val) {
            console.log(11111, val);
            // 监听数组变化
            const l = this.lists.length;
            if (l) {
                // 有图片或图片数量改变时重新初始化
                this.init();
            }
        },
    },
    mounted() {
        const l = this.lists.length;
        if (l) {
            // 有图片时初始化
            this.init();
        }
    },
    methods: {
        init() {
            // 初始化数据
            // 设置拖拽区域信息
            const wrap = uni
                .createSelectorQuery()
                .in(this)
                .select('#inner');
            wrap.boundingClientRect((data) => {
                wrapW = data.width; // 设置拖拽范围的总宽度
                wrapH = data.height; // 设置拖拽范围的总高度
                wrapTop = data.top; // 设置拖拽范围的上边界坐标
                wrapLeft = data.left; // 设置拖拽范围的左边界坐标
                // this.setNodeWH();
            }).exec();
        },
        reset() {
            this.lists.splice(0, this.lists.length);
        },
        setNodeWH() {
            // 设置拖拽元素的宽高
            // 获取拽拖元素的信息
            const item = uni
                .createSelectorQuery()
                .in(this)
                .select('.item');
            item.boundingClientRect((data) => {
                itemW = data.width; // 拖拽元素的宽度
                itemH = data.height; // 拖拽元素的高度
                this.setDragData();
            }).exec();
        },
        setDragData() {
            // 设置拖拽区域及元素配置
            wrapDragTop = wrapTop + itemH / 2; // 设置拖拽范围上边距
            wrapDragLeft = wrapLeft + itemW / 2; // 设置可拖拽范围左边距
            wrapW2 = wrapW - itemW; // 设置可拖拽区域宽度
            wrapH2 = wrapH - itemH; // 设置可拖拽区域高度
            itemXNun = Math.round(wrapW / itemW) - 1; // 设置拖拽元素的列数
        },
        longtap(e) {
            // 长按
            const left = e.currentTarget.offsetLeft;
            const top = e.currentTarget.offsetTop;
            this.beginIndex = this.computationIndex({ left, top }); // 获取所在位置索引
            this.x = left;
            this.y = top;
            this.active = true;
            this.flag = true;
        },
        computationIndex(e) {
            // 计算元素索引
            const { left } = e;
            const { top } = e;
            let index = 0; // 计算拖拽元素所在的索引位置
            const x = Math.round(left / itemW); // 计算拖拽元素所在的横向索引位置
            const y = Math.round(top / itemH); // 计算拖拽元素所在的纵向索引位置
            const num = itemXNun * y;
            if (x && !y) {
                // 第一行
                index = x;
            }
            if (y) {
                // 第一行以下
                index = x + y + num;
            }
            return index;
        },
        touchm(e) {
            // 拖拽过程
            if (this.flag) {
                let x = e.touches[0].pageX - wrapDragLeft;
                let y = e.touches[0].pageY - wrapDragTop;
                if (x < 0) {
                    x = 0;
                }
                if (x > wrapW2) {
                    x = wrapW2;
                }
                if (y < 0) {
                    y = 0;
                }
                if (y > wrapH2) {
                    y = wrapH2;
                }
                this.x = x;
                this.y = y;
            }
        },
        touchend(e) {
            // 拖拽结束
            this.active = false;
            const left = e.currentTarget.offsetLeft;
            const top = e.currentTarget.offsetTop;
            if (!this.flag || (this.x === left && this.y === top)) {
                return;
            }

            const { x } = this; // 计算拖拽横向距离
            const { y } = this; // 计算拖拽纵向距离
            const itemNum = this.lists.length - 1; // 拖拽元素的总数量
            let endIndex = this.computationIndex({ left: x, top: y }); // 获取所在位置索引
            if (endIndex > itemNum) {
                endIndex = itemNum;
            }
            // 交换位置
            const { beginIndex } = this; // 当前拖拽元素索引
            const data = this.lists;
            const tem = data[beginIndex];
            data[beginIndex] = data[endIndex];
            data[endIndex] = tem;
            this.flag = false;
        },
        imageTap(i) {
            // 图片点击事件
            uni.showActionSheet({
                itemList: ['全屏预览大图', '删除（不可撤销）'],
                success: (res) => {
                    if (res.tapIndex) {
                        // 删除
                        this.imageDel(i);
                    } else {
                        // 预览
                        this.previewImage(i);
                    }
                },
            });
        },
        previewImage(i) {
            // 预览图片
            uni.previewImage({
                current: this.lists[i],
                urls: this.lists,
            });
        },
        imageDel(i) {
            // 删除图片事件
            this.lists.splice(i, 1);
        },
        imageUpload() {
            const itemList = ['图片（从手机相册选择）', '图片（拍摄）'];
            uni.showActionSheet({
                itemList,
                success: (res) => {
                    this.chooseImage(res.tapIndex);
                },
            });
        },
        chooseImage(index) {
            // 选择图片
            const count = 9 - this.lists.length;
            const sourceType = index > 0 ? 'camera' : 'album';
            uni.chooseImage({
                count,
                sizeType: ['original', 'compressed'],
                sourceType: [sourceType],
                success: (res) => {
                    uni.showLoading({
                        title: '上传中',
                    });
                    this.upload(res.tempFilePaths);
                },
            });
        },
        upload() {
            // 可多图上传，不需要的可改成单一上传
            // uni.hideLoading();
            // const data = this.lists;
            // for (let i = 0, l = e.length; i < l; i++) {
            //     data.push(e[i]);
            // }
            // this.lists = data;
            // 可写上传图片方法或者将本地图片路径传给父组件
        },
        add(item) {
            if (this.list.length >= 10) {
                return uni.showToast({
                    title: '最多上传10张图片~',
                    icon: 'none',
                });
            }
            // return this.lists.push(item);
            return this.$set(this.lists, this.lists.length, item);
            // console.log(this.lists);
        },
        dump() {
            return this.list;
        },
    },
};
</script>

<style scoped>
.img {
    width: 100%;
    height: 100%;
}

.image-drag-sort {
    width: 100%;
    /* padding: 30upx; */
    box-sizing: border-box;
}

.movable-area {
    width: 100%;
    height: 100upx;
    display: flex;
    flex-flow: wrap;
}

.item {
    flex: 0 0 31%;
    height: calc(31vw * 0.7);
    /* overflow: hidden; */
    border-radius: 12upx;
    position: relative;
}

.item:not(:nth-child(3n + 3)) {
    margin-right: 3.4%;
}

.item:nth-child(n + 4) {
    margin-top: 3.4%;
}

.img-upload-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
}

.img-upload-btn .icon {
    width: 48upx;
    height: 48upx;
}

.img-upload-btn .text {
    font-size: 28upx;
    color: #cccccc;
    margin-top: 10upx;
}

.movable-view {
    width: 31%;
    height: calc(31vw * 0.7);
}

.item-move {
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 12upx;
    position: relative;
}
.item .tag {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 78upx;
    height: 36upx;
    background: rgba(0, 0, 0, 1);
    border-radius: 12upx 0px 0px 0px;
    opacity: 0.6;
    font-size: 24upx;
    color: #fff;
    text-align: center;
}

.item-move-active {
    box-shadow: 0 0 30px #000;
}

.prompt {
    font-size: 28upx;
    line-height: 40upx;
    color: #999;
    margin-top: 28upx;
}

.icon-del {
    position: absolute;
    right: -19rpx;
    top: -19rpx;
    display: inline-block;
    width: 48rpx;
    height: 48rpx;
}
</style>
