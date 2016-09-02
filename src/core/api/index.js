import {AjaxPromise,ajaxPost} from './api';

var api = new AjaxPromise({
    urlPrefix: "",
    userInfoGetter: function () {
        var userState = window.COOLPENG_USER_STATE || {};
        var userInfo = userState.userInfo || {};
        return {
            tokenId:userInfo.lastLoginToken || "",
            devicePlatform:"browser",
            uuid:"MMM"// 设备编号,暂时不用.
        };
    }
});


export default api
