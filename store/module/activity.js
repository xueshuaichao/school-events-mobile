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
        workColor: {
            imgBg: '11CD95',
            text: '#08402f',
            title: '#056446',
            btnBg: '#0f8c64',
            btnText: '#fff',
        },
        tipsColor: {
            textColor: '#fff',
            mainColor: '#ffde6d',
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
        setActivityWorkColor(state, {
            imgBg, text, title, btnBg, btnText,
        }) {
            state.workColor = {
                ...state.workColor,
                imgBg,
                text,
                title,
                btnBg,
                btnText,
            };
        },
        setTipsColor(state, { textColor, mainColor }) {
            state.tipsColor = {
                ...state.tipsColor,
                textColor,
                mainColor,
            };
        },
    },
};
