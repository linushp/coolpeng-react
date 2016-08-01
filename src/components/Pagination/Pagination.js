import './index.less';


function isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
}


function isFunction(obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
}


/**
 * demo1:
 *   {
 *      pageNumber:1,
 *      pageCount:10,
 *      linkRender:function(p){
 *          return "<a>"
 *      }
 *   }
 *
 *
 *   demo2:
 *   {
 *      pageNumber:1,
 *      recordCount:10,
 *      linkRender:"/blog/dsds?pn="
 *   }
 * @param config
 */
function toPagination(config) {

    var PRE_BUTTON = "pre";
    var PRE_GROUP_BUTTON = "preGroup";
    var NEXT_BUTTON = "next";
    var NEXT_GROUP_BUTTON = "nextGroup";
    var HOME_BUTTON = "home";

    var linkSize = config.linkSize || 10;
    var pageNumber = config.pageNumber || 1;// 当前是第几页
    var recordCount = config.recordCount || 0;
    var pageSize = config.pageSize || 20;
    var pageCount = config.pageCount || (function () {  //总共有多少页
            var pageCount = parseInt(config.recordCount / pageSize, 10);
            pageCount = (config.recordCount % pageSize === 0) ? pageCount : (pageCount + 1);
            return pageCount;
        })();
    var buttons = config.buttons || [HOME_BUTTON, PRE_BUTTON, NEXT_BUTTON, PRE_GROUP_BUTTON, NEXT_GROUP_BUTTON];
    var linkRender = function (number, text, isEnable) {
        if (isFunction(config.linkRender)) {
            return config.linkRender(number, text, isEnable);
        }
        var clazz = isEnable ? "" : "disabled";
        return "<a class='" + clazz + "' href='" + config.linkRender + number + "'>" + text + "</a>";
    };


    function hasButton(btnName) {
        var buttons = buttons;
        if (!isArray(buttons)) {
            return false;
        }
        return (buttons.indexOf(btnName) >= 0);
    }

    function pageNowGroup() {// 从1开始的
        return parseInt((pageNumber - 1) / linkSize) + 1;
    }

    function isNowFirstGroup() {
        return pageNowGroup() == 1;
    }

    function isNowLastGroup() {
        return pageNowGroup() == groupSize();
    }

    function groupSize() {// 从1开始
        return parseInt((pageCount - 1) / linkSize) + 1;
    }

    function getGroupBeginNoByNow() {
        return linkSize * (pageNowGroup() - 1) + 1;
    }

    function getGroupEndNoByNow() {
        if (isNowLastGroup()) {
            return pageCount;
        }
        else {
            return getGroupBeginNoByNow() + (linkSize - 1);
        }
    }

    function generateNextGroupLink(begin) {
        return linkRender(begin, "...", true);
    }

    function generatePreGroupLink(end) {
        return linkRender(end, "...", true);
    }

    function generateOneLink(i) {
        if (i == pageNumber) {
            return "<span>" + i + "</span>";
        } else {
            return linkRender(i, i, true);
        }
    }

    function generateLinks(begin, end) {
        var links = [];
        for (var i = begin; i <= end; i++) {
            links.push(generateOneLink(i));
        }
        return links.join("");
    }

    function generateAllLinks() {
        var links = [];

        var begin = getGroupBeginNoByNow();
        var end = getGroupEndNoByNow();
        if (pageCount <= linkSize) {
            links.push(generateLinks(1, pageCount));
        } else {
            if (isNowFirstGroup()) {
                links.push(generateLinks(begin, end));
                links.push(generateNextGroupLink(end + 1));
            } else if (isNowLastGroup()) {
                links.push(generatePreGroupLink(begin - 1));
                links.push(generateLinks(begin, end));
            } else {
                links.push(generatePreGroupLink(begin - 1));
                links.push(generateLinks(begin, end));
                links.push(generateNextGroupLink(end + 1));
            }
        }
        return links.join("");
    }


    function toPaginationHtml() {
        var htmlArray = [];
        htmlArray.push("<div class='cp-pagination'>");
        if (hasButton(HOME_BUTTON)) {
            htmlArray.push(linkRender(1, "首页", true));
            htmlArray.push(generateAllLinks());
            htmlArray.push(linkRender(pageCount, "尾页", true));
        } else {
            htmlArray.push(generateAllLinks());
        }

        htmlArray.push("</div>");
        return htmlArray.join("");
    }


    return toPaginationHtml();
}

//if(window){
//    window.toPagination = toPagination;
//}
//if(exports){
//    exports.toPagination = toPagination;
//}
//exports.toPagination = toPagination;


if ( typeof module === "object" && typeof module.exports === "object" ) {
    module.exports.toPagination = toPagination;
} else if(window){
    window.COOL_toPagination = toPagination;
}