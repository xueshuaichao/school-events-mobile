import Vue from 'vue';
import App from './App.vue';

const common = {
    onShow: () => {
        uni.showShareMenu();
    },
};

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.mixin(common);
const app = new Vue({
    ...App,
});
app.$mount();
