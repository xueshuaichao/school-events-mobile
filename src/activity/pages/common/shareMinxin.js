import store from '../../../../store';
import share from '../../../common/share';

const initShare = {
    data() {
        return {
            // #ifdef H5
            isH5: true,
            // #endif
            shareConfig: {},
        };
    },
    methods: {
        getShareConfig() {
            new Promise((resolve) => {
                this.shareConfig = store.getters.getShareConfig(
                    this.activityId,
                );
                resolve();
            }).then(() => {
                this.initShare();
            });
        },
        initShare() {
            const titleList = this.isH5
                ? this.shareConfig.h5Title
                : this.shareConfig.title;
            const descList = this.shareConfig.desc;
            const random = Math.floor(Math.random() * titleList.length);
            this.title = titleList[random];
            const desc = descList[0];
            if (this.isH5) {
                share({
                    title: this.title,
                    desc,
                    thumbnail: this.shareConfig.image,
                    url: `${window.location.origin}${this.shareConfig.path}`,
                });
            }
        },
    },
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内分享按钮
            console.log(res.target);
        }
        console.log(this.activityId);
        return {
            title: this.title,
            imageUrl: this.shareConfig.image,
            path: this.shareConfig.path,
        };
    },
};
export default {
    initShare,
};
