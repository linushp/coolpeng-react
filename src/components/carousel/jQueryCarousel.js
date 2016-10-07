import $ from 'jquery';
import './jQueryCarousel.less';

var PLACEHOLDER_ID = 'UbibiImageCarouselPlaceholder';
var IMG_ITEM_CUR_CLASS = 'imageItemCurrent';
var IMG_ITEM_CLASS = 'imageItem';

function getPlaceHolder() {
    var $placeholder = $(`#${PLACEHOLDER_ID}`);
    if ($placeholder && $placeholder.length > 0) {
        return $placeholder;
    }
    $placeholder = $(`<div id="${PLACEHOLDER_ID}"></div>`);
    $('body').append($placeholder);
    return $placeholder;
}

function encodeHTML(m) {
    if(!m){
        return "";
    }
    m = m.replace(/</gm,"&lt;");
    m = m.replace(/>/gm,"&gt;");
    return m;
}

function createImageListHTML(imageList, targetImage) {
    var html = [];
    var targetOid = targetImage.oid || "______$$$$_____";
    for (var i = 0; i < imageList.length; i++) {
        var img = imageList[i];
        var oid = img.oid;
        var isCurrent = (oid === targetOid) || (img.oSrc===targetImage.oSrc);
        var src = isCurrent ? img.oSrc : '';
        var imageItemClazz = isCurrent ? IMG_ITEM_CUR_CLASS:'';
        var isFirst = (i===0);
        var isLast = (i===(imageList.length-1));
        if(isFirst){
            imageItemClazz +=" isFirst ";
        }
        if(isLast){
            imageItemClazz +=" isLast ";
        }
        html.push('' +
            '<div class="'+IMG_ITEM_CLASS+'  '+imageItemClazz+'">' +
            '   <div class="closeCarousel"></div>' +
            `   <div class="preImage"></div>` +
            `   <div class="nextImage"></div>` +
            '   <div class="imageName"> ' + encodeHTML(img.name) + ' </div>' +
            '   <div class="imageObjWrapper">' +
            '       <img class="imageObj closeCarousel" src="' + src + '" osrc="' + img.oSrc + '" alt="' + img.name + '" >' +
            '   </div>' +
            '</div>'
        );
    };
    return html.join('');
}

function showImageCarousel(imageList, targetImage) {
    var $placeholder = getPlaceHolder();
    var imageListHtml = createImageListHTML(imageList, targetImage);
    $placeholder.html('<div class="jQueryCarousel">' + imageListHtml +'</div>');
    $placeholder.show();
    initEvent();
}



var isInited = false;
function initEvent() {
    if (isInited) {
        return;
    }
    isInited = true;



    $(document).on('click', `#${PLACEHOLDER_ID} .nextImage`, function () {
        var $this = $(this);
        var $imgItem = $this.closest(`.${IMG_ITEM_CLASS}`);
        $imgItem.removeClass(IMG_ITEM_CUR_CLASS);
        var $nextItem = $imgItem.next();
        var $nextImg = $nextItem.find(".imageObj");
        var osrc = $nextImg.attr('osrc');
        $nextImg.attr('src',osrc);
        $nextItem.addClass(IMG_ITEM_CUR_CLASS);
    });

    $(document).on('click', `#${PLACEHOLDER_ID} .preImage`, function () {
        var $this = $(this);
        var $imgItem = $this.closest(`.${IMG_ITEM_CLASS}`);
        $imgItem.removeClass(IMG_ITEM_CUR_CLASS);
        var $nextItem = $imgItem.prev();
        var $nextImg = $nextItem.find(".imageObj");
        var osrc = $nextImg.attr('osrc');
        $nextImg.attr('src',osrc);
        $nextItem.addClass(IMG_ITEM_CUR_CLASS);
    });

    $(document).on('click', `#${PLACEHOLDER_ID} .closeCarousel`, function () {
        var $placeholder = getPlaceHolder();
        $placeholder.html('');
        $placeholder.hide();
    });

}


export default {
    show: showImageCarousel
};