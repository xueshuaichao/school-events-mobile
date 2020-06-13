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
        detail_user_info: {
            uid: 0,
            from: '',
        },
    },
    getters: {
        // eslint-disable-next-line max-len
        getWorkParams: state => state.workParams,
        detailUserInfo: state => state.detail_user_info,
    },
    actions: {},
    mutations: {
        setFilterData(state, data) {
            state.workParams = data;
        },
        setDetailUserId(state, info) {
            state.detail_user_info = info;
        },
    },
};
