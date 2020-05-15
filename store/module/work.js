export default {
    state: {
        workParams: {},
    },
    getters: {
        // eslint-disable-next-line max-len
        getWorkParams: state => state.workParams,
    },
    actions: {},
    mutations: {
        setFilterData(state, data) {
            console.log(state, data);
            state.workParams = data;
        },
    },
};