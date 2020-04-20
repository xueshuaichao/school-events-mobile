export default {
    state: {
        config: {
            rules: [],
            log: '',
            activityName: '',
            activityId: 0,
            mainBgColor: '',
            catId: '',
            shareConfig: {},
        },
    },
    getters: {},
    actions: {},
    mutations: {
        setActivityConfig(
            state,
            {
                rules,
                activityId,
                activityName,
                mainBgColor,
                catId,
                shareConfig,
                log,
            },
        ) {
            console.log(catId);
            state.config = {
                ...state.config,
                rules,
                activityName,
                activityId,
                mainBgColor,
                catId,
                shareConfig,
                log,
            };
        },
    },
};
