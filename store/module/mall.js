export default {
    state: {
        share: [
            {
                activityId: 14,
                h5Title: ['挑战诗词闯关，赢好礼！'],
                title: ['诵读诗词，品味经典！'],
                desc: ['铭记诗词，传承文化！'],
                image:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/poetry/banner.png',
                path: '/activity/pages/index?activity_id=14',
            },
        ],
    },
    getters: {
        getShareConfig: state => activityId => state.share.filter(v => v.activityId === Number(activityId))[0],
    },
};
