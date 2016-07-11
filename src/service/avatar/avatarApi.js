import $ from 'jquery';

var ajaxPost = function (url,queryCondition,success,onError) {
    url = "" + url;
    $.ajax({
        type: 'POST',
        url: url ,
        data: JSON.stringify(queryCondition) ,
        success: success ,
        dataType: "json",
        error:onError,
        ContentType: 'application/json;charset=UTF-8'
    });
};

export function getReplyList(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/getReplyList.json', queryCondition,callback,onError);
}

export function createReply(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/createReply.json', queryCondition,callback,onError);
}

export function deleteReply(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/deleteReply.json', queryCondition,callback,onError);
}

export function likeReply(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/likeReply.json', queryCondition,callback,onError);
}

export function createReplyReply(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/createReplyReply.json', queryCondition,callback,onError);
}


export function deleteReplyReply(queryCondition,callback,onError) {
    ajaxPost('/cloud/reply/deleteReplyReply.json', queryCondition,callback,onError);
}

