import $ from 'jquery';
import jQueryCarousel from '../../../components/carousel/jQueryCarousel';

function getMessageImage($obj) {
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
        oSrcWidth: osrcwidth
    }
}


function getMessageImageList(divId,messageList) {
    var imageList = [];
    $('#' + divId).find(".chat-uploaded-image").each(function () {
        var $this = $(this);
        var imgObj = getMessageImage($this);
        imageList.push(imgObj);
    });
    return imageList;
}


export function showImageCarousel(divId, $target,messageList) {
    var imageList = getMessageImageList(divId,messageList);
    var targetImage = getMessageImage($target);
    jQueryCarousel.show(imageList, targetImage);
}