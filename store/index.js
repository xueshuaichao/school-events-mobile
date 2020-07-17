import Vue from 'vue';
import Vuex from 'vuex';
import activity from './module/activity';
import work from './module/work';
import mall from './module/mall';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //
    },
    mutations: {
        //
    },
    actions: {
        //
    },
    modules: {
        activity,
        work,
        mall,
    },
});
