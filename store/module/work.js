export default {
    state: {
        workParams: {
            position: {
                curposition: 0,
                total: 1,
                from: '',
            },
            filter: {},
        },
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
