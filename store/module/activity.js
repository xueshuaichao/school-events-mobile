import rulesData from '../../src/data/rules/list';

export default {
    state: {
        activities: [
            {
                activityId: 8,
                publicConfig: {
                    title: '青少年动起来',
                    log: 'wyhd',
                    sort: ['最新', '最热'],
                    catMenu: [], // 分组
                    mainBgColor: '#FFCE99',
                    activityName: 'labor',
                    activityId: 8,
                    catId: 20, // 所属分类
                    time: '4月27日--5月31日',
                    primaryColor: '#DB4E0E', // 主色调
                    darkPrimaryColor: '#451600', // 深一些
                    primaryBgColor: '#FF9F73', // 主要的背景颜色
                    infoColor: '#AB3500', // 浅一些
                    titleColor: '#FFE179', // 规则的title
                    placeholderColor: 'rgba(255,255,255,.6)',
                    homePath: '/pages/activity-pages/labor/index',
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
                        image:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_share.jpg',
                        path: '/pages/activity-pages/labor/index',
                    },
                },
                indexConfig: {
                    // 活动页
                    rules: rulesData.rules.filter(v => v.id === 8)[0].text, // 规则文案
                    prizes: [
                        {
                            text: ['一等奖', '佳能打印机'],
                        },
                        {
                            text: ['二等奖', '骆驼帐篷'],
                        },
                        {
                            text: ['三等奖', '液晶手写板'],
                        },
                        {
                            text: ['劳动能手奖', '榨汁机'],
                        },
                    ], // 奖品文案
                    prizesDetail: {
                        text: [
                            {
                                title: '奖品兑换说明',
                                texts: [
                                    '1、每名参赛选手只有一次兑奖机会，如已获得过一次“劳动能手”奖，则余下活动期间，不能再参与后续“劳动能手”及“劳动之星”奖项评选；',
                                    '2、每个账号视为一个参赛选手，请勿多人使用同一个账号上传，若同一账号下，多个作品获奖，只颁发排名最高的一个作品；',
                                    '3、工作人员将于6月1-3日期间电话联系获奖账号所绑定的手机号，若电话无法联系且在6月5日前未能主动通过公众号添加客服联系组委会认领的，将视为自动放弃兑奖资格；',
                                    '4、奖品及证书将于6月24日之前通过普通快递寄出；',
                                    '5、奖品属于用户奖励活动，不提供发票、收据；',
                                    '6、奖品不支持退换和售后，请当面核实无质量问题再签收；',
                                    '7、因用户提供的收货地址等信息有误而导致的奖品未收到，不予补发。',
                                ],
                            },
                        ],
                        list: [
                            {
                                title: '劳动之星',
                                prizeList: [
                                    {
                                        name: '一等奖*2名',
                                        text: '佳能打印机+证书',
                                    },
                                    {
                                        name: '二等奖*6名',
                                        text: '骆驼帐篷+证书',
                                    },
                                    {
                                        name: '三等奖*12名',
                                        text: '液晶手写板+证书',
                                    },
                                    {
                                        name: '21名-40名',
                                        text: '证书',
                                    },
                                ],
                            },
                            {
                                title: '劳动能手',
                                prizeList: [
                                    {
                                        name: '每周3名(共5周)',
                                        text: '榨汁机+证书',
                                    },
                                ],
                            },
                            {
                                title: '优秀组织单位',
                                prizeList: [
                                    {
                                        name: '共5名',
                                        text: '奖杯',
                                    },
                                ],
                            },
                        ],
                    },
                },
                uploadConfig: {
                    // 上传作品页
                    activityCat: [], // 表现形式
                    uploadMode: ['video', 'image'], // 上传类型 只传1个值时（['video']）不显示表现形式
                    placeholderNameText: '作品名称（不超过11字）',
                    placeholderDescText: '劳动心得（不超过150字）',
                    nameMaxLength: 11,
                    descMaxLength: 150,
                },
            },
        ],
    },
    getters: {
        // 获取活动公共配置 如：背景颜色 分类 名称 统计参数
        // eslint-disable-next-line max-len
        getPublicConfig: state => activityId => state.activities.filter(v => v.activityId === Number(activityId))[0]
            .publicConfig,
        // 获取各个页面配置 包括：活动页、我的作品、上传页、上传结果页
        // eslint-disable-next-line max-len
        getActivityConfig: state => ({ activityId, page }) => state.activities.filter(
            v => v.activityId === Number(activityId),
        )[0][page],
    },
    actions: {},
    mutations: {},
};