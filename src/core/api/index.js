import {AjaxPromise,ajaxPost} from './api';

import {getLocalStorage} from '../utils/index';

var api = new AjaxPromise({
    urlPrefix: window.COOPENG_REQUEST_PREFIX || "",
    userInfoGetter: function () {
        var userState = window.COOLPENG_USER_STATE || {};
        var user = userState.user || {};
        return {
            tokenId:user.lastLoginToken || "",
            devicePlatform:"browser",
            uuid:"MMM"// 设备编号,暂时不用.
        };
    }
});


export default api
