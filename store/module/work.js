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
        recordDetail: null,
    },
    getters: {
        // eslint-disable-next-line max-len
        getWorkParams: state => state.workParams,
        getRecordDetail: state => state.recordDetail,
    },
    actions: {},
    mutations: {
        setFilterData(state, data) {
            state.workParams = data;
        },
        setTestData(state, data) {
            state.recordDetail = data;
        },
    },
};
