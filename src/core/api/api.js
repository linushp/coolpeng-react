import $ from 'jquery';
import {StringUtils,EventBus,toQueryParam} from '../utils';


function ajaxPost(userInfoGetter, url, queryCondition, success, onError) {
    var userInfo = userInfoGetter ? userInfoGetter() : {};
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


function handNamedException(data) {
    var exceptionName = data.responseDesc;
    if(exceptionName && StringUtils.endsWith(exceptionName,"Exception")){
        EventBus.emit(exceptionName,data);
    }
}



class AjaxPromise {

    constructor(config) {
        config = config || {};
        this.userInfoGetter = config.userInfoGetter;
        this.urlPrefix = config.urlPrefix || "";
    }


    post(url, queryCondition,validateCallback) {
        var that = this;
        url = that.urlPrefix + url;
        return new Promise(function (resolve, reject) {
            ajaxPost(that.userInfoGetter, url, queryCondition, function (data) {
                var isOK = validateCallback ? validateCallback(data) : (data.responseCode===0);
                if(!isOK){
                    handNamedException(data);
                    reject(data);
                }
                else {
                    resolve(data);
                }
            }, function (e) {
                console.error(e);
                reject(e);
            });
        });
    }


    ajaxGet(url, queryCondition,validateCallback) {
        var that = this;
        url = that.urlPrefix + url;
        return new Promise(function (resolve, reject) {
            var params = toQueryParam(queryCondition);
            $.ajax({
                type: 'GET',
                url: url + params,
                success: function(data){
                    var isOK = validateCallback ? validateCallback(data) : (data.responseCode===0);
                    if(!isOK){
                        handNamedException(data);
                        reject(data);
                    }
                    else {
                        resolve(data);
                    }
                },
                dataType: "json",
                error: function(e){
                    console.error(e);
                    reject(e);
                },
                contentType: 'application/json; charset=utf-8'
            });
        });

    }
}


exports.ajaxPost = ajaxPost;
exports.AjaxPromise = AjaxPromise;
