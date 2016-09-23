import {AjaxPromise,ajaxPost} from './api';
import {getCurrentUser} from '../utils/index';

var api = new AjaxPromise({
    urlPrefix: "",
    userInfoGetter: function () {
        var userInfo = getCurrentUser();
        return {
            tokenId: userInfo.lastLoginToken || "",
            devicePlatform: "browser",
            uuid: "MMM"// 设备编号,暂时不用.
        };
    }
});


export default api
