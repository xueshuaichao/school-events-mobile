import rulesData from '../../src/data/rules/list';

export default {
    state: {
        activities: [
            {
                activityId: 8,
                publicConfig: {
                    log: 'ldjhd',
                    mainBgColor: '#000',
                    activityName: 'labor',
                    activityId: 8,
                    catId: 18, // 所属分类
                    shareConfig: {
                        title: [
                            '争做“劳动小能手”，参加活动赢好礼',
                            '悦劳动越光荣，大家一起动起来！',
                            '五一劳动节，脂肪换奖品啦！赶快动起来！',
                            '幸福的生活哪里来，要靠劳动来创造～',
                        ],
                        h5Title: [
                            '争做“劳动小能手”，参加活动赢好礼',
                            '悦劳动越光荣，大家一起动起来！',
                        ],
                        desc: [
                            '悦劳动越光荣，大家一起动起来！',
                            '五一劳动节，脂肪换奖品啦！赶快动起来',
                        ],
                    },
                },
                indexConfig: {
                    // 活动页
                    catMenu: ['中文组', '英文组'], // 分组
                    rules: rulesData.rules.filter(v => v.id === 8)[0].texts, // 规则文案
                    btnColor: '#04a875', // 上传作品按钮颜色
                    workColor: {
                        // 单个作品ui
                        imgBg: '11CD95', // 图片背景
                        text: '#08433f',
                        title: '#434424',
                        btnBg: '#434324',
                        btnText: '#fff',
                    },
                    tipsColor: {
                        // 上传信息跑马灯
                        textColor: '#fff',
                        mainColor: '#ffde6d',
                    },
                },
                uploadConfig: {
                    // 上传作品页
                    activityCat: [], // 表现形式
                    uploadMode: ['video', 'image'], // 上传类型
                    textBgColor: '#f00',
                    placeholderColor: '#A6CBBC', // 输入框
                    placeholderNameText: '作品名称（不超过30字）',
                    placeholderDescText: '劳动心得（不超过150字）',
                    textColor: '#0f8c64',
                    nameMaxLength: 130,
                    descMaxLength: 180,
                },
                myWorkConfig: {
                    workBgColor: '434332',
                    itemBgColor: '#043434',
                    textColor: '#0f8c64',
                },
            },
        ],
    },
    getters: {
        // eslint-disable-next-line max-len
        getPublicConfig: state => activityId => state.activities.filter(v => v.activityId === activityId)[0]
            .publicConfig,
        // eslint-disable-next-line max-len
        getActivityConfig: state => ({ activityId, page }) => state.activities.filter(v => v.activityId === activityId)[0][page],
    },
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
        setActivityWorkColor(state, params) {
            state.workColor = {
                ...state.workColor,
                ...params,
            };
        },
        setTipsColor(state, params) {
            state.tipsColor = {
                ...state.tipsColor,
                ...params,
            };
        },
        setUploadConfig(state, params) {
            state.uploadConfig = {
                ...state.uploadConfig,
                ...params,
            };
        },
    },
};
