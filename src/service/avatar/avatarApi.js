import $ from 'jquery';

function ajaxPost(userTokenGetter,url,queryCondition,success,onError) {
    var urlPrefix = window.COOPENG_REQUEST_PREFIX || "";
    url = urlPrefix + url;
    var userInfo = userTokenGetter?userTokenGetter():{};
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
        contentType: 'application/json; charset=utf-8',
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function(xhr){
            xhr.withCredentials = true;
        }
    });
}


export default class AvatarApi{

    constructor(props) {
        props = props || {};
        var userTokenGetter = props.userTokenGetter || function(){
                return {
                    tokenId:"",
                    devicePlatform:"",
                    uuid:""
                };
            };
        this.ajaxPost = ajaxPost.bind(this,userTokenGetter);
    }

     getReplyList(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/getReplyList.json', queryCondition,callback,onError);
    }

    createReply(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/createReply.json', queryCondition,callback,onError);
    }

     deleteReply(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/deleteReply.json', queryCondition,callback,onError);
    }

    likeReply(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/likeReply.json', queryCondition,callback,onError);
    }

    createReplyReply(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/createReplyReply.json', queryCondition,callback,onError);
    }

     deleteReplyReply(queryCondition,callback,onError) {
        this.ajaxPost('/cloud/reply/deleteReplyReply.json', queryCondition,callback,onError);
    }




}
