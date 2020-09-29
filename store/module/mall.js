export default {
    state: {
        share: [
            {
                activityId: 12,
                h5Title: ['打卡一夏，记录暑假赢好礼！'],
                title: ['打卡一夏，记录暑假赢好礼！'],
                desc: ['爱挑战素质教育养成计划，过充实又快乐的暑假！'],
                image:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/share_activity_id_12.png',
                path: '/activity/pages/index?activity_id=12',
            },
            {
                activityId: 14,
                h5Title: ['挑战诗词闯关，赢好礼！'],
                title: ['诵读诗词，传承经典！'],
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
