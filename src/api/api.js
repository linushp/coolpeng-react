import $ from 'jquery';
import {toQueryParam} from '../utils';


function ajaxPost(userInfoGetter,url,queryCondition,success,onError) {
    var urlPrefix = window.coolpengAvatarApiURLPrefix || "";
    url = urlPrefix + "" + url;
    var userInfo = userInfoGetter?userInfoGetter():{};
    queryCondition = queryCondition || {};
    queryCondition["TMS_APP_COMMON__TOKEN_ID"] = userInfo.tokenId;
    queryCondition["TMS_APP_COMMON__DEVICE_PLATFORM"] = userInfo.devicePlatform;
    queryCondition["TMS_APP_COMMON__DEVICE_UUID"] = userInfo.uuid;

    $.ajax({
        type: 'POST',
        url: url,
        data: JSON.stringify(queryCondition),
        success: success,
        dataType: "json",
        error: onError,
        contentType: 'application/json; charset=utf-8'
    });
}


class AjaxPromise{

    constructor(config) {
        config = config || {};
        this.userInfoGetter = config.userInfoGetter;
    }


    post(url,queryCondition){
        var that = this;
        return new Promise(function(resolve, reject){
            ajaxPost(that.userInfoGetter,url,queryCondition,function(data){
                console.log('response success:',data);
                resolve(data);
            },function(e){
                console.log("Fetch failed!", e);
                reject(e);
            });
        });
    }
}


exports.ajaxPost = ajaxPost;
exports.AjaxPromise = AjaxPromise;
