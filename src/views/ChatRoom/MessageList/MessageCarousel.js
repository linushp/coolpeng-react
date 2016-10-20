import $ from 'jquery';
import jQueryCarousel from '../../../components/carousel/jQueryCarousel';

function getMessageImage($obj,msgObj) {
    var osrc = $obj.attr("osrc");
    var name = $obj.attr("alt") || "";
    var osrcwidth = $obj.attr('osrcwidth');
    var osrcheight = $obj.attr('osrcheight');
    var oid = $obj.attr('oid') || "";
    return {
        oid: oid,
        name: name,
        oSrc: osrc,
        oSrcHeight: osrcheight,
        oSrcWidth: osrcwidth,
        ownerUser:msgObj && msgObj.sendUser
    }
}

function toMessageMap(messageList){
    messageList = messageList.toJS();
    var m = {};
    messageList.forEach(function(v){
        var msgId = v.msgId;
        m[msgId] = v;
    });
    return m;
}

function getMessageImageList(divId,messageList) {

    var msgMap = toMessageMap(messageList);

    var imageList = [];
    $('#' + divId).find(".chat-uploaded-image").each(function () {
        var $this = $(this);
        var $msgItem = $this.closest('.chat-msg-item');
        var msgId = $msgItem.attr('data-mid');
        var msgObj = msgMap[msgId];
        var imgObj = getMessageImage($this,msgObj);
        imageList.push(imgObj);
    });
    return imageList;
}


export function showImageCarousel(divId, $target,messageList) {
    var imageList = getMessageImageList(divId,messageList);
    var targetImage = getMessageImage($target);
    jQueryCarousel.show(imageList, targetImage);
}