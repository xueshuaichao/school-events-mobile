export default {
    state: {
        share: [
            {
                activityId: 12,
                h5Title: ['打卡一夏，记录暑假赢好礼！'],
                title: ['打卡一夏，记录暑假赢好礼！'],
                desc: ['爱挑战素质教育养成计划，过充实又快乐的暑假！'],
                image:
                    'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/mall-result.png?x-oss-process=image/format,png/interlace,1/quality,Q_80/resize,m_pad,h_100',
                path: '/activity/pages/index?activity_id=12',
            },
        ],
    },
    getters: {
        getShareConfig: state => activityId => state.share.filter(v => v.activityId === Number(activityId))[0],
    },
};
