import $ from 'jquery';
import * as avatarURL from './avatarURL';
import * as avatarApi from './avatarApi';


var viewIdIndex = 0;


function AvatarView(config) {
    var DOM = config.DOM;
    var queryCondition = {
        pageId: config.pageId,
        pageSize: config.pageSize || 20,
        pageNumber: config.defaultPageNumber || 1,
        orderType: config.defaultOrderType || 1  //最新1，最早2，最热3
    };

    var state = {
        data: [],
        pageSize: 1,
        pageNo: 1,
        totalCount: 1
    };

    var $$viewId;

    function initViewContainer() {
        var id = getViewId();
        DOM.innerHTML = '' +
            '<div class="cp-reply-service" id="' + id + '">' +
            '    <div class="cp-reply-loading">loading...</div>' +
            '    <div class="cp-reply-input">'+renderReplyInput()+'</div>' +
            '    <div class="cp-reply-list"></div>' +
            '    <div class="cp-reply-pagination"></div>' +
            '</div>';
    }


    function queryAndView() {
        showLoading();
        avatarApi.getReplyList(queryCondition, function (d) {
            state.totalCount = d.totalCount;
            state.data = d.data;
            state.pageNo = d.pageNo;
            state.pageSize = d.pageSize;
            renderReplyList();
            hideLoading();
        });
    }

    function getRandomUser(){
        var m = "http://image.coolpeng.cn/avatar/"+avatarURL.getRandomAvatarURL();
        return {
            createAvatar:m
        };
    }

    function renderReplyInput() {

        var m = getRandomUser();

        return '' +
            '<div class="mm1621703468">' +
            '   <div class="cp-reply-avatar">' +
            '       <img src="'+m.createAvatar+'" />' +
            '       <span>换一个?</span>' +
            '   </div>' +
            '   <div class="cp-reply-cc">' +
            '       <div>' +
            '           <textarea class="replyContent"></textarea>' +
            '           <div>' +
            '               <button>留言</button>' +
            '           </div>' +
            '       </div>' +
            '       <i class="clear"></i>' +
            '   </div>' +
            '</div>';
    }

    function renderReplyList() {
        var replyList = state.data || [];
        var replyListHTML = [];
        for (var i = 0; i < replyList.length; i++) {
            var cloudReply = replyList[i];
            var html = renderItemView(cloudReply);
            replyListHTML.push(html);
        }
        if (replyListHTML.length === 0) {
            replyListHTML.push('<div class="cp-nothing">暂无评论</div>');
        }

        var htmlJoin = replyListHTML.join("");
        findDOM(".cp-reply-list").html(htmlJoin);
    }


    function renderItemView(cloudReply) {
        var m = cloudReply || {};
        var createUserId = m.createUserId || "";

        return '' +
            '<div class="cp-reply-item" data-id="'+m.id+'">' +
            '   <div class="cp-reply-avatar">' +
            '       <img src="'+m.createAvatar+'" />' +
            '   </div>' +
            '   <div class="cp-reply-cc">' +
            '       <a class="cc-header register-'+(!!createUserId)+'"> '+ m.createNickname +'</a>' +
            '       <div class="cc-content"> '+ m.replyContent +'</div>' +
            '       <div class="cc-footer"> ' +
            '           <span class="cc-time"> '+ m.createTime +'</span>' +
            '           <span class="cc-reply"> 回复 </span>' +
            '           <span class="cc-like"> 赞 </span>' +
            '       </div>' +
            '       <i class="clear"></i>' +
            '   </div>' +
            '   ' +
            '</div>';
    }


    function showLoading() {
        findDOM(".cp-reply-loading").show();
    }

    function hideLoading() {
        findDOM(".cp-reply-loading").hide();
    }


    function getViewId() {
        if ($$viewId && $$viewId.length > 0) {
            return $$viewId;
        } else {
            viewIdIndex = viewIdIndex || 0;
            $$viewId = "cp-reply-view-" + (viewIdIndex);
            viewIdIndex++;
        }
        return $$viewId
    }

    function getViewRootDOM() {
        var id = getViewId();
        return $("#" + id);
    }

    function findDOM(selector) {
        return getViewRootDOM().find(selector);
    }


    /** init **/
    initViewContainer();
    queryAndView();

}



if(window){
    window.coolpengAvatarView = AvatarView;
}
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AvatarView;
}