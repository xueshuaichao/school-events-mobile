import Vue from 'vue';
import App from './App.vue';
import share from './common/share';

console.log(share);

const common = {
    onShow: () => {
        uni.showShareMenu();
        share();
    },
};

Vue.config.productionTip = false;

App.mpType = 'app';

Vue.mixin(common);
const app = new Vue({
    ...App,
});
app.$mount();
