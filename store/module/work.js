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
        bgMusic: -1,
        recordParam: null,
    },
    getters: {
        // eslint-disable-next-line max-len
        getWorkParams: state => state.workParams,
        getRecordDetail: state => state.recordDetail,
        getBgMusic: state => state.bgMusic,
        getRecordParam: state => state.recordParam,
    },
    actions: {},
    mutations: {
        setFilterData(state, data) {
            state.workParams = data;
        },
        setTestData(state, data) {
            state.recordDetail = data;
        },
        setBgmusic(state, data) {
            state.bgMusic = data;
        },
        setRecordParam(state, data) {
            state.recordParam = data;
        },
    },
};
