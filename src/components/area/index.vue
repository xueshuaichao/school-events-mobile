<template>
    <my-picker
        class="form-item-cont"
        :picker-list="provinceList"
        :default-value="defaultValue"
        @confirm="confirm($event)"
    >
        <slot />
    </my-picker>
</template>

<script>
import myPicker from '../picker/picker.vue';
import Area from './data';

export default {
    components: {
        myPicker,
    },
    props: {
        default: {
            type: Array,
            default() {
                return [];
            },
        },
        addData: {
            type: Object,
            default() {
                return {};
            },
        },
        resource: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            newArea: {},
            provinceList: [],
            defaultValue: [],
        };
    },
    watch: {
        default: {
            handler(val) {
                this.defaultValue = val;
                console.log(val);
            },
            immediate: true,
            deep: true,
        },
    },
    created() {
        if (!this.resource) {
            this.provinceList = Area;
        } else {
            const newArea = JSON.parse(
                JSON.stringify(Area.filter(v => v.value === this.resource)),
            );
            if (Object.keys(this.addData).length) {
                newArea[0].children.push(this.addData);
            }
            this.provinceList = newArea;
            console.log(this.provinceList);
        }
        console.log(this.provinceList);
    },
    methods: {
        confirm(picked) {
            this.$emit('change', picked);
        },
    },
};
</script>
