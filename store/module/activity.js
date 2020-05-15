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
                myWorkColorConfig: {},
                indexColorConfig: {},
                uploadColorConfig: {},
            },
            {
                activityId: 9,
                publicConfig: {
                    title: '七彩童年 快乐成长秀风采',
                    log: 'lyhd',
                    sort: ['最新', '最热'],
                    catMenu: [], // 分组
                    mainBgColor: '#EBE1FF',
                    activityName: 'children',
                    activityId: 8,
                    catId: 20, // 所属分类
                    time: '4月27日--5月31日',
                    primaryColor: '#BB77FF', // 主色调
                    darkPrimaryColor: '#C790FF', // 深一些 （按钮的颜色）
                    primaryBgColor: '#DCC0FF', // 主要的背景颜色 （图片背景）
                    infoColor: '#333333', // 浅一些
                    titleColor: '#FFE179', // 规则的title
                    placeholderColor: 'rgba(255,255,255,.6)',
                    homePath: '/pages/activity-pages/labor/index',
                    shareConfig: {
                        title: [
                            '七彩童年， 快乐成长秀风采！超多奖品等你拿',
                            '闪亮小童星，成长大舞台！快来看～',
                            '这个“六一”有点甜，秀才艺，抢“糖果”，赢好礼！',
                            '六一嗨翻天！快来围观孩子们的才艺show，可以参与抽奖哦～',
                            '欢乐儿童节！秀出才艺展风采，赢取惊喜好礼！',
                        ],
                        h5Title: [
                            '七彩童年， 快乐成长秀风采！超多奖品等你拿',
                            '闪亮小童星，成长大舞台！快来看～',
                            '这个“六一”有点甜，秀才艺，抢“糖果”，赢好礼！',
                            '六一嗨翻天！快来围观孩子们的才艺show，可以参与抽奖哦～',
                            '欢乐儿童节！秀出才艺展风采，赢取惊喜好礼！',
                        ],
                        desc: [
                            '七彩童年， 快乐成长秀风采！秀才艺，抢“糖果”，赢好礼',
                            '五一劳动节，脂肪换奖品啦！赶快动起来',
                        ],
                        image:
                            'https://aitiaozhan.oss-cn-beijing.aliyuncs.com/mp_wx/labor_share.jpg',
                        path: '/pages/activity-pages/children/index',
                    },
                },
                indexConfig: {
                    // 活动页
                    rules: rulesData.rules.filter(v => v.id === 9)[0].text, // 规则文案
                    prizes: [
                        {
                            title: '人气作品奖',
                            item: [
                                {
                                    text: ['一等奖', '小度音响*2'],
                                },
                                {
                                    text: ['二等奖', '旅行箱*6'],
                                },
                                {
                                    text: ['三等奖', 'AR地球仪*12'],
                                },
                            ],
                        },
                        {
                            title: '糖果幸运奖',
                            item: [
                                {
                                    text: ['', '航拍无人机'],
                                },
                                {
                                    text: ['', '多功能棋盘'],
                                },
                                {
                                    text: ['', '水彩笔套装'],
                                },
                                {
                                    text: ['', '水彩笔套装'],
                                },
                            ],
                        },
                    ], // 奖品文案
                    prizesDetail: {
                        text: [
                            {
                                title: '奖品兑换说明',
                                texts: [
                                    '1.每名参赛选手只有1次人气奖领取机会，如出现同一参赛选手获得不同奖项的情况，则以最高奖项为准。',
                                    '2.工作人员将于2020年6月23日-6月26日期间电话联系获奖用户所绑定的手机号码，电话无法联系的将视为该用户自动放弃领奖资格。',
                                    '3.奖品将于2020年6月27日开始通过普通快递陆续寄出。',
                                    '4.本次活动所有奖品不提供发票、收据，不支持退换，收货时请确认无质量问题后签收。',
                                    '5.若因用户提供的收货信息有误而未收到奖品，概不补发。',
                                ],
                            },
                        ],
                        list: [
                            {
                                title: '人气奖',
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
                                title: '幸运奖',
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
                myWorkColorConfig: {},
                indexColorConfig: {},
                uploadColorConfig: {
                    mainBgColor: '#fff',
                    primaryColor: '#BB77FF', // 主色调
                    darkPrimaryColor: '#C790FF', // 深一些 （按钮的颜色）
                    primaryBgColor: '#DCC0FF', // 主要的背景颜色 （图片背景）
                    infoColor: '#333333', // 浅一些
                },
            },
        ],
    },
    getters: {
        // 获取活动公共配置 如：背景颜色 分类 名称 统计参数
        // eslint-disable-next-line max-len
        getPublicConfig: state => activityId => state.activities.filter(v => v.activityId === Number(activityId))[0]
            .publicConfig,
        // eslint-disable-next-line max-len
        getUploadColorConfig: state => activityId => state.activities.filter(v => v.activityId === Number(activityId))[0]
            .uploadColorConfig,
        // 获取各个页面配置 包括：活动页、我的作品、上传页、上传结果页
        // eslint-disable-next-line max-len
        getActivityConfig: state => ({ activityId, page }) => state.activities.filter(
            v => v.activityId === Number(activityId),
        )[0][page],
    },
    actions: {},
    mutations: {},
};
