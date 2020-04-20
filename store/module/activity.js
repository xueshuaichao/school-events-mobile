export default {
    state: {
        rules: [],
        activityId: 6,
        mainBgColor: '#f00',
        catId: '',
    },
    getters: {},
    actions: {},
    mutations: {
        setConfig(state, {
            rules, activityId, mainBgColor, catId,
        }) {
            // cat_id;
            // eslint-disable-next-line no-param-reassign
            state = {
                ...state,
                rules,
                activityId,
                mainBgColor,
                catId,
            };
        },
    },
};
