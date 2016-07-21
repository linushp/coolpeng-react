import $ from 'jquery';
import * as avatarURL from './avatarURL';
import AvatarApi from './avatarApi';

import './index.less';


var loadingImg = '<img src="http://image.coolpeng.cn/static/icons/loading2.gif" />';
var viewIdIndex = 0;


function AvatarView(config) {
    var pageId = config.pageId;
    var avatarApi = new AvatarApi({
        userInfoGetter: function () {
            return {
                tokenId: "",
                devicePlatform: "",
                uuid: ""
            };
        }
    });

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
            '    <div class="cp-reply-input">' + renderReplyInput(false) + '</div>' +
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

    function getRandomAvatarURL() {
        return "http://image.coolpeng.cn/avatar/" + avatarURL.getRandomAvatarURL();
    }


    function renderReplyInput(isReplyReply) {
        isReplyReply = isReplyReply || false;

        var createAvatar = getRandomAvatarURL();

        return '' +
            '<div class="boxCreateReply isReplyReply_'+isReplyReply+'" >' +
            '   <div class="cp-reply-avatar cp-loading-wrap">' +
            '       <img class="boxCreateReplyImg" src="' + createAvatar + '" />' +
            '       <span class="changeAvatar">换一个?</span>' +
            '       <div class="cp-loading"></div>' +
            '   </div>' +
            '   <div class="cp-reply-cc">' +
            '       <div>' +
            '           <textarea class="createReplyContent"></textarea>' +
            '           邮箱:<input type="input" class="createReplyEmail" />' +
            '           昵称:<input type="input" class="createReplyNickname" />' +
            '           <div>' +
            '               <button class="btnCreateReply">留言</button>' +
            '           </div>' +
            '       </div>' +
            '       <i class="clear"></i>' +
            '   </div>' +
            '   <i class="clear"></i>' +
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



    function renderReplyReplyItem(obj){
        var html = '' +
            '<div class="cp-reply2-item">' +
            '   <a class="cp-reply2-avatar">' +
            '       <img src="'+obj.createAvatar+'" alt="'+obj.createNickname+'">' +
            '   </a>' +
            '   <div class="cp-reply2-cnt">' +
            '       <a href="" class="cp-reply2-name">'+obj.createNickname+'</a> : &nbsp;' +
            '       <span class="cp-reply2-text">'+obj.replyContent+'</span>' +
            '       <p>' +
            '           <i>'+obj.createTime+'</i>' +
            '       </p>' +
            '   </div>' +
            '</div>';
        return html;
    }

    function renderReplyReplyList(cloudReply,maxCount){
        maxCount = maxCount || 9999;
        var replyList = cloudReply.replyList || [];

        replyList = replyList.sort(function(a,b){
            return a.createTime<b.createTime?1:-1;
        });

        replyList = replyList.slice(0,maxCount);

        var replyListHTML = [];
        for (var i = 0; i < replyList.length; i++) {
            var cloudReply = replyList[i];
            var x= renderReplyReplyItem(cloudReply);
            replyListHTML.push(x);
        }

        var htmlJoin = replyListHTML.join("");
        return htmlJoin;
    }




    function renderItemView(cloudReply) {
        var m = cloudReply || {};
        var createUserId = m.createUserId || "";

        return '' +
            '<div class="cp-reply-item" data-id="' + m.id + '">' +
            '   <div class="cp-reply-avatar">' +
            '       <img src="' + m.createAvatar + '" />' +
            '   </div>' +
            '   <div class="cp-reply-cc">' +
            '       <a class="cc-header register-' + (!!createUserId) + '"> ' + m.createNickname + '</a>' +
            '       <div class="cc-content"> ' + m.replyContent + '</div>' +
            '       <div class="cc-footer"> ' +
            '           <span class="cc-time"> ' + m.createTime + '</span>' +
            '           <span class="cc-like"> 赞(<span>'+m.likeCount+'</span>) </span>' +
            '           <span class="cc-reply"> 回复 </span>' +
            '           <span class="cc-reply-view"> 查看回复(<span>'+m.maxFloorNumber+'</span>) </span>' +
            '       </div>' +
            '       <i class="clear"></i>' +
            '   </div>' +
            '   <i class="clear"></i>' +
            '   <div class="cp-reply2">' +
            '       <div class="cp-reply2-input"></div>' +
            '       <div class="cp-reply2-input-msg"></div>' +
            '       <div class="cp-reply2-list">' + renderReplyReplyList(cloudReply,5) +
            '       </div>' +
            '   </div>' +
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

    function findDOM(selector,rootElement) {
        if(rootElement){
            return rootElement.find(selector);
        }
        return getViewRootDOM().find(selector);
    }


    function onClickClazzName(clazzName, callback) {
        var $dom = getViewRootDOM();
        $dom.on("click", "." + clazzName, callback);
    }

    function findDOMByClass(className,rootElement) {
        return findDOM("." + className,rootElement);
    }


    function showAvatarLoading($dom) {
        var $loading = $dom.closest(".cp-loading-wrap").find('.cp-loading');
        //$loading.html(loadingImg);
        $loading.show();
        setTimeout(function () {
            hideAvatarLoading($dom);
        }, 5000);

        $dom[0].onload = function (a, b, c) {
            console.log("img loaded")
            var target = a.target || a.srcElement;
            hideAvatarLoading($(target));
        }
    }

    function hideAvatarLoading($dom) {
        $dom.closest(".cp-loading-wrap").find('.cp-loading').hide();
    }



    function bindEventHandler() {

        onClickClazzName("btnCreateReply", function (e) {

            var $target = $(e.target || e.srcElement);

            var boxCreateReply = $target.closest(".boxCreateReply");


            var img = findDOMByClass('boxCreateReplyImg',boxCreateReply).attr('src');
            var msg = findDOMByClass('createReplyContent',boxCreateReply).val();
            var email = findDOMByClass('createReplyEmail',boxCreateReply).val();
            var nickname = findDOMByClass('createReplyNickname',boxCreateReply).val();
            var data = {
                pageId: pageId,
                replyContent: msg,
                replySummary: msg,
                createNickname: nickname,
                createAvatar: img,
                createMail: email
            };

            if(boxCreateReply.hasClass('isReplyReply_true')){
                var $replyItem =  $target.closest('.cp-reply-item');
                data['replyId'] =$replyItem.data("id");
                avatarApi.createReplyReply(data, function (d) {
                    findDOMByClass('createReplyContent',boxCreateReply).val("");
                    var $resultMsg = findDOMByClass('cp-reply2-input-msg',$replyItem);
                    if(d.responseCode!==0){
                        $resultMsg.html(d.responseText);
                        return;
                    }
                    if(d.data && d.data.replyList){
                        $resultMsg.html('');
                        var html = renderReplyReplyList(d.data,5);
                        findDOMByClass('cp-reply2-list',$replyItem).html(html);
                        findDOMByClass('cc-reply-view',$replyItem).find('span').html(d.data.maxFloorNumber);
                    }
                });
            }else {
                avatarApi.createReply(data, function () {
                    findDOMByClass('createReplyContent',boxCreateReply).val("");
                    queryAndView();
                });
            }

        });

        onClickClazzName("changeAvatar", function (e) {
            var boxCreateReply = $(e.target || e.srcElement).closest(".boxCreateReply");
            var img = getRandomAvatarURL();
            var $dom = findDOMByClass("boxCreateReplyImg",boxCreateReply);
            $dom.attr('src', img);
            showAvatarLoading($dom);
        });


        onClickClazzName('cc-reply', function () {
            findDOMByClass('cp-reply-item').find('.cp-reply2-input').hide();
            var $this = $(this);
            var $item = $this.closest(".cp-reply-item");
            var itemId = $item.data("id");
            var reply2 = renderReplyInput(true);
            var $thisInput = $item.find('.cp-reply2-input');
            $thisInput.html(reply2);
            $thisInput.show();
        });


        onClickClazzName('cc-like',function(){
            var $this = $(this);
            var $item = $this.closest(".cp-reply-item");
            var itemId = $item.data("id");
            avatarApi.likeReply({
                replyId:itemId,
                isLike:true
            },function(d){
                try {
                    $this.find('span').html(d.data.likeCount);
                }catch (e){
                }
            });
        });

        findDOMByClass('boxCreateReplyImg')[0].onload = function (a, b, c) {
            var target = a.target || a.srcElement;
            hideAvatarLoading($(target));
        }
    }

    /** init **/
    initViewContainer();
    queryAndView();
    bindEventHandler()

}


if (window) {
    window.coolpengAvatarView = AvatarView;
}
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AvatarView;
}