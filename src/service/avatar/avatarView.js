import $ from 'jquery';
import * as avatarURL from './avatarURL';
import AvatarApi from './avatarApi';
import {toPrettyString,toHtmlEncode} from './avatarUtil';
import {toPagination} from '../../components/Pagination/Pagination';
import './index.less';


var loadingImg = '<img src="http://image.coolpeng.cn/static/icons/loading2.gif" />';
var viewIdIndex = 0;

var clearTimeout = window.clearTimeout;
var setTimeout = window.setTimeout;

var CONST_createReplyContent = 'createReplyContent';

function AvatarView(config) {

    var pageId = config.pageId;

    var DOM = config.DOM;
    var queryCondition = {
        pageId: config.pageId,
        pageSize: config.pageSize || 30,
        pageNumber: config.defaultPageNumber || 1,
        orderType: config.defaultOrderType || 1  //最新1，最早2，最热3
    };

    var userInfo = config.userInfo || {
            nickname: "",
            email: null,
            avatar: null,

            hasLogin: false,
            isAdmin: false,

            tokenId: "",
            devicePlatform: "",
            uuid: ""
        };

    var _isHasLogin = !!(userInfo && userInfo.hasLogin);
    var avatarImg = _isHasLogin ? userInfo.avatar : getRandomAvatarURL();
    var state = {
        data: [],
        pageSize: 1,
        pageNo: 1,
        totalCount: 1,
        serverTime: new Date().getTime(),
        avatarImg:avatarImg
    };

    var avatarApi = new AvatarApi({
        userTokenGetter: function () {
            return {
                tokenId: userInfo.tokenId,
                devicePlatform: userInfo.devicePlatform,
                uuid: userInfo.uuid
            }
        }
    });

    //最多允许多个个二级评论
    var MAX_REPLY_REPLY_COUNT = 20;

    //最多允许多少个评论
    var MAX_REPLY_COUNT = 1000;

    //在第一页最多显示多少个回复
    var MAX_SHOW_REPLY2_COUNT = 5;

    //是否直接在页面上显示二级回复
    var IS_SHOW_REPLY2 = config.isShowReply2 === true;

    var $$viewId;

    var mapCache = {};

    function isAdmin() {
        return !!(hasLogin() && userInfo.isAdmin);
    }

    function hasLogin() {
        return !!(userInfo && userInfo.hasLogin);
    }

    function toPrettyDate(str) {
        try {
            return toPrettyString(str, state.serverTime);
        } catch (e) {
            return str || "";
        }
    }

    function initViewContainer() {
        var id = getViewId();
        DOM.innerHTML = '' +
            '<div class="cp-reply-service" id="' + id + '">' +
            '    <div class="cp-reply-h1">一起吐槽<span><b>0</b>条评论</span>' +
            '    </div>' +
            '    <div class="cp-reply-loading">' + loadingImg + '<span>加载中...</span></div>' +
            '    <div class="cp-reply-msg"></div>' +
            '    <div class="cp-reply-input">' + renderReplyInput(false) + '</div>' +
            '    <div class="cp-reply-oper">' + renderQcOrderType(false) + '</div>' +
            '    <div class="cp-reply-list"></div>' +
            '    <div class="cp-reply-pagination" style="display: none">' + renderPagination(false) + '</div>' +
            '</div>';
    }


    function renderPagination(isAutoAppend) {
        var html = toPagination({
            pageNumber: state.pageNo,
            pageSize: state.pageSize,
            recordCount: state.totalCount,
            linkRender: ""
        });
        if (isAutoAppend) {
            findDOMByClass('cp-reply-pagination').html(html);
        }
        return html;
    }

    /**
     * 是否自动拼接到dom上去
     * @param isAutoAppend
     * @returns {string}
     */
    function renderQcOrderType(isAutoAppend) {
        var orderType = parseInt(queryCondition.orderType, 10);
        var textArr = ["", "最新", "最早", "最热"];
        var x = '' +
            '<div>' +
            '   <span>' + textArr[orderType] + '评论</span>' +
            '   <div class="dd">' +
            '       <i mid="1" class="QcOrderType ' + ((orderType === 1) ? 'cur' : '') + '" >' + textArr[1] + '</i>' +
            '       <i mid="2" class="QcOrderType ' + ((orderType === 2) ? 'cur' : '') + '" >' + textArr[2] + '</i>' +
            '       <i mid="3" class="QcOrderType ' + ((orderType === 3) ? 'cur' : '') + '" >' + textArr[3] + '</i>' +
            '   </div>' +
            '</div>';
        if (isAutoAppend === true) {
            findDOMByClass('cp-reply-oper').html(x);
        }
        return x;
    }


    function initView(d,callback){
        state.totalCount = d.totalCount;
        state.data = d.data;
        state.pageNo = d.pageNo;
        state.pageSize = d.pageSize;
        state.serverTime = d.extendData.serverTime || new Date().getTime();
        MAX_REPLY_REPLY_COUNT = d.extendData.MAX_REPLY_REPLY_COUNT || MAX_REPLY_REPLY_COUNT;
        MAX_REPLY_COUNT = d.extendData.MAX_REPLY_COUNT || MAX_REPLY_COUNT;

        renderReplyTitle();
        renderReplyList();
        renderPagination(true);
        hideLoading();
        renderUserInfo();
        renderLayerPlaceholder();
        findDOMByClass('cp-reply-pagination').show();
        callback && callback(d);
    }


    function queryAndView(that, callback) {
        showLoading();
        avatarApi.getReplyList(queryCondition, function (d) {
            initView(d, callback);
        }, function () {
            hideLoading();
        });
    }

    function getRandomAvatarURL() {
        return avatarURL.getRandomAvatarURLFull();
    }

    function renderLayerPlaceholder() {

        var m = getCpLayerDOM();
        if (m && m.length > 0) {
            return;
        }

        var html = '' +
            '<div id=' + getCpLayerId() + ' viewid="' + getViewId() + '" class="cp-reply-service cp-reply-layer">' +
            '   <div class="cp-reply-layer-bg"></div>' +
            '   <div class="cp-reply-layer-wrapper">' +
            '       <span class="cp-reply-layer-close"></span>' +
            '       <div class="cp-reply-layer-content"></div>' +
            '   </div>' +
            '</div>';
        $('body').append(html);
    }


    function getCpLayerId(){
       return "cpLayer_" + getViewId();
    }

    function getCpLayerDOM() {
        var m = $("#" + getCpLayerId());
        return m;
    }

    function showReplyLayer(html) {
        var obj = getCpLayerDOM();
        findDOMByClass('cp-reply-layer-content', obj).html(html);
        obj.show();
    }

    function hideReplyLayer() {
        getCpLayerDOM().hide();
    }

    function renderReplyTitle() {
        findDOM(".cp-reply-h1").find('span').show();
        findDOM(".cp-reply-h1").find('span b').html(state.totalCount);
    }

    function renderUserInfo() {
        var login = hasLogin();
        var $dom = findDOMByClass('boxCreateReply');
        $dom.removeClass("hasLogin_" + !login).addClass("hasLogin_" + login);

        if (login) {
            findDOMByClass('loginUserInfo').html(userInfo.nickname);
            findDOMByClass("boxCreateReplyImg").attr('src', userInfo.avatar);
        }

        if(isAdmin()){
            findDOMByClass('cc-btnDelete').show();
        }else {
            findDOMByClass('cc-btnDelete').hide();
        }
    }


    function getReplyObjById(mid) {
        var replyList = state.data || [];
        for (var i = 0; i < replyList.length; i++) {
            var m = replyList[i];
            if (m.id == mid) {
                return m;
            }
        }
        return null;
    }

    function renderReplyInput(isReplyReply) {
        isReplyReply = isReplyReply || false;

        return '' +
            '<div class="boxCreateReply isReplyReply_' + isReplyReply + '  hasLogin_' + hasLogin + '" >' +
            '   <div class="cp-reply-avatar cp-loading-wrap">' +
            '       <img class="boxCreateReplyImg" src="' + avatarImg + '" />' +
            '       <span class="changeAvatar">换一个?</span>' +
            '       <div class="cp-loading"></div>' +
            '   </div>' +
            '   <div class="cp-reply-cc" style="width: 90%;">' +
            '       <div class="createReplyContentWrap">' +
            '           <textarea class="'+CONST_createReplyContent+'"></textarea>' +
            '           <div class="createReplyContent_1">' +
            '               <div class="tempUserInfo">' +
            '                   邮箱:<input type="input" class="createReplyEmail" />' +
            '                   昵称:<input type="input" class="createReplyNickname" />' +
            '               </div>' +
            '               <div class="loginUserInfo">' +
            '                   ' + userInfo.nickname +
            '               </div>' +
            '               <button class="btnCreateReply">添加评论</button>' +
            '               <i class="clear"></i>' +
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
            var html = renderItemView(cloudReply, MAX_SHOW_REPLY2_COUNT, IS_SHOW_REPLY2);
            replyListHTML.push(html);
        }
        if (replyListHTML.length === 0) {
            replyListHTML.push('<div class="cp-nothing">暂无评论</div>');
        }

        var htmlJoin = replyListHTML.join("");
        findDOM(".cp-reply-list").html(htmlJoin);
    }


    function renderReplyReplyItem(obj) {
        var html = '' +
            '<div class="cp-reply2-item" fno="'+obj.floorNumber+'">' +
            '   <a class="cp-reply2-avatar">' +
            '       <img src="' + obj.createAvatar + '"  >' +
            '   </a>' +
            '   <div class="cp-reply2-cnt">' +
            '       <div class="cp-reply2-header">' +
            '           <a class="cp-reply2-name">' + toHtmlEncode(obj.createNickname) + '</a> : &nbsp;' +
            '           <i class="cp-reply2-time">' + toPrettyDate(obj.createTime) + '</i>' +
            '           '+(isAdmin()?'<i class="cp-reply2-delete">删除</i>':'') +
            '       </div>' +
            '       <div class="cp-reply2-text">' + toHtmlEncode(obj.replyContent) + '</div>' +
            '   </div>' +
            '   <i class="clear"></i>' +
            '</div>';
        return html;
    }

    function renderReplyReplyList(cloudReply, maxCount) {
        var m = cloudReply || {};
        maxCount = maxCount || 9999;
        var replyList = cloudReply.replyList || [];
        var replyCount = replyList.length;

        replyList = replyList.sort(function (a, b) {
            return a.createTime < b.createTime ? 1 : -1;
        });

        replyList = replyList.slice(0, maxCount);

        var replyListHTML = [];
        for (var i = 0; i < replyList.length; i++) {
            var cloudReply = replyList[i];
            var x = renderReplyReplyItem(cloudReply);
            replyListHTML.push(x);
        }

        //如果内容大于maxCount条的话
        if (replyCount > maxCount) {
            replyListHTML.push('' +
                '<div class="cp-reply2-all cp-reply-btn-layer" mid="' + m.id + '" >' +
                '    还有' + (replyCount - maxCount) + '条回复,点击查看' +
                '</div>');
        }


        var htmlJoin = replyListHTML.join("");
        return htmlJoin;
    }


    function renderItemView(cloudReply, maxReply2Count, isShowReply2) {
        var m = cloudReply || {};
        var createUserId = m.createUserId || "";
        var createIpStr = (m.createIpStr || "").replace(/;/gm, "");

        return '' +
            '<div class="cp-reply-item" mid="'+m.id+'" data-id="' + m.id + '">' +
            '   <div class="cp-reply-avatar">' +
            '       <img src="' + m.createAvatar + '" />' +
            '   </div>' +
            '   <span class="cc-floorNumber"> ' + m.floorNumber + ' 楼 </span>' +
            '   <span class="cc-btnDelete"> 删除 </span>' +
            '   <div class="cp-reply-cc">' +
            '       <span class="cc-header register-' + (!!createUserId) + '"> ' + toHtmlEncode(m.createNickname) + '</span>' +
            '       <span class="cc-ipAddr"> ' + createIpStr + '</span>' +
            '       <div class="cc-content"> ' + toHtmlEncode(m.replyContent) + '</div>' +
            '       <div class="cc-footer"> ' +
            '           <span class="cc-time"> ' + toPrettyDate(m.createTime) + '</span>' +
            '           <a class="cc-like"> 赞(<span>' + m.likeCount + '</span>) </a>' +
            '           <a class="cc-reply"> 回复 </a>' +
            '           <a class="cc-reply-view cp-reply-btn-layer"  mid="' + m.id + '"> 查看回复(<span>' +  getReplyReplyCount(m) + '</span>) </a>' +
            '       </div>' +
            '       <i class="clear"></i>' +
            '   </div>' +
            '   <i class="clear"></i>' +
            '   <div class="cp-reply2">' +
            '       <div class="cp-reply2-input"></div>' +
            '       <div class="cp-reply2-input-msg"></div>' +
            '       <div class="cp-reply2-list">' + (isShowReply2 ? renderReplyReplyList(m, maxReply2Count) : '') + '</div>' +
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

    function findDOM(selector, rootElement) {
        if (rootElement) {
            return rootElement.find(selector);
        }
        return getViewRootDOM().find(selector);
    }


    function onClickClazzName(clazzName, callback) {
        onClick("." + clazzName, callback)
    }

    function onClick(selector, callback) {
        var $dom = getViewRootDOM();
        $dom.on("click", selector, callback);
    }

    function findDOMByClass(className, rootElement) {
        return findDOM("." + className, rootElement);
    }

    function getReplyReplyCount(replyObj){
        replyObj = replyObj || {};
        var replyList = replyObj.replyList || [];
        return replyList.length;
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


    function showCreateMessage(replyId, $resultMsg, msg, isSuccess) {
        $resultMsg.removeClass('msg_false').removeClass('msg_true').addClass('msg_' + isSuccess);
        $resultMsg.html(msg);
        $resultMsg.show();
        var handlerId = 'msg_time_' + replyId;
        var oldHandler = mapCache[handlerId];
        if (oldHandler) {
            clearTimeout(oldHandler);
        }
        mapCache[handlerId] = setTimeout(function () {
            $resultMsg.hide();
            mapCache[handlerId] = null;
            delete mapCache[handlerId];
        }, 3000);
    }


    function onReplyReplySuccess(d, $replyItem, boxCreateReply, replyId) {
        findDOMByClass(CONST_createReplyContent, boxCreateReply).val("");
        var $resultMsg = findDOMByClass('cp-reply2-input-msg', $replyItem);
        if (d.responseCode !== 0) {
            showCreateMessage(replyId, $resultMsg, d.responseText, false);
            return;
        }

        if (d.data && d.data.replyList) {
            //showCreateReply2Message(replyId,$resultMsg,"回复成功",true);

            var replyNew = d.data;
            //数据更新
            var replyObj = getReplyObjById(replyId) || {};
            replyObj.replyList = replyNew.replyList;
            replyObj.hot = replyNew.hot;
            replyObj.maxFloorNumber = replyNew.maxFloorNumber;

            //DOM更新COUNT
            findDOMByClass('cc-reply-view', $replyItem).find('span').html(getReplyReplyCount(replyObj));
            if (IS_SHOW_REPLY2) {
                //DOM更新LIST
                var html = renderReplyReplyList(d.data, MAX_SHOW_REPLY2_COUNT);
                findDOMByClass('cp-reply2-list', $replyItem).html(html);
            }
        }
    }


    function onReplyCreateSuccess(d, boxCreateReply) {
        var isOK = d.responseCode === 0;
        var $resultMsg = findDOMByClass('cp-reply-msg');
        if (isOK) {
            findDOMByClass(CONST_createReplyContent, boxCreateReply).val("");

            var cloudReply = d.data;
            //更新数据
            state.data.push(cloudReply);
            state.totalCount = state.totalCount + 1;
            //更新DOM
            var html = renderItemView(cloudReply, MAX_SHOW_REPLY2_COUNT, IS_SHOW_REPLY2);
            findDOMByClass('cp-reply-list').prepend(html);
            renderReplyTitle();
            findDOMByClass('cp-nothing').hide();
        } else {
            showCreateMessage('main', $resultMsg, d.responseText, isOK);
        }
    }


    function bindEventHandler(that) {


        //点击提交回复按钮
        onClickClazzName("btnCreateReply", function (e) {

            var $target = $(e.target || e.srcElement);

            var boxCreateReply = $target.closest(".boxCreateReply");


            var img = findDOMByClass('boxCreateReplyImg', boxCreateReply).attr('src');
            var msg = findDOMByClass(CONST_createReplyContent, boxCreateReply).val();
            var email = findDOMByClass('createReplyEmail', boxCreateReply).val();
            var nickname = findDOMByClass('createReplyNickname', boxCreateReply).val();

            if (userInfo.hasLogin) {
                img = userInfo.avatar;
                email = userInfo.email;
                nickname = userInfo.nickname;
            } else {
                config.innerSetUserInfo({
                    nickname: nickname,
                    email: email,
                    avatar: img
                });
            }


            var data = {
                pageId: pageId,
                replyContent: msg,
                replySummary: msg,
                createNickname: nickname,
                createAvatar: img,
                createMail: email
            };

            if (boxCreateReply.hasClass('isReplyReply_true')) {
                var $replyItem = $target.closest('.cp-reply-item');
                var replyId = $replyItem.data("id");
                data['replyId'] = replyId;
                avatarApi.createReplyReply(data, function (d) {
                    onReplyReplySuccess(d, $replyItem, boxCreateReply, replyId)
                });
            } else {
                avatarApi.createReply(data, function (d) {
                    onReplyCreateSuccess(d, boxCreateReply);
                });
            }

        });


        //点击切换头像按钮
        onClickClazzName("changeAvatar", function (e) {
            var boxCreateReply = $(e.target || e.srcElement).closest(".boxCreateReply");
            var img = getRandomAvatarURL();
            var $dom = findDOMByClass("boxCreateReplyImg", boxCreateReply);
            $dom.attr('src', img);
            showAvatarLoading($dom);
        });


        //点击二级回复按钮
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


        //点赞
        onClickClazzName('cc-like', function () {
            var $this = $(this);
            var $item = $this.closest(".cp-reply-item");
            var itemId = $item.data("id");
            avatarApi.likeReply({
                replyId: itemId,
                isLike: true
            }, function (d) {
                try {
                    $this.find('span').html(d.data.likeCount);
                } catch (e) {
                }
            });
        });

        //绑定图片加载完毕事件
        findDOMByClass('boxCreateReplyImg')[0].onload = function (a, b, c) {
            var target = a.target || a.srcElement;
            hideAvatarLoading($(target));
        };


        //点击查看更多二级回复按钮
        onClickClazzName("cp-reply-btn-layer", function () {
            var $btn = $(this);
            var mid = $btn.attr('mid');
            var replyObj = getReplyObjById(mid);
            var html = renderItemView(replyObj, 99999, true);
            showReplyLayer(html);
        });

        onClickClazzName('QcOrderType', function () {
            var $btn = $(this);
            queryCondition.orderType = $btn.attr('mid');
            queryCondition.pageNumber = 1;
            renderQcOrderType(true);
            queryAndView(that, function () {
            });
        });

        //点击删除留言按钮
        onClickClazzName('cc-btnDelete',function(){
            var $btn = $(this);
            var $item = $btn.closest('.cp-reply-item');
            var mid = $item.attr('mid');
            avatarApi.deleteReply({
                replyId: mid,
            }, function (d) {
                if(d.responseCode===0){
                    $item.addClass('cp-reply-deleted');
                }
            });
        });



        onClick(".cp-reply-pagination a", function (e) {
            e.stopPropagation();
            e.preventDefault();
            var $this = $(this);
            var pageNo = $this.attr('href');
            queryCondition.pageNumber = pageNo;
            queryAndView(that);
        });

        $(document).on('click', '.cp-reply-layer-bg', function () {
            hideReplyLayer();
        });

        $(document).on('click', '.cp-reply-layer-close', function () {
            hideReplyLayer();
        });


        //删除二级回复按钮
        $(document).on('click', '.cp-reply2-delete', function () {
            var $btn = $(this);
            var $item2 = $btn.closest('.cp-reply2-item');
            var $item = $btn.closest('.cp-reply-item');
            var replyId = $item.attr('mid');
            var floorNumber = $item2.attr('fno');

            avatarApi.deleteReplyReply({
                replyId: replyId,
                floorNumber:floorNumber
            }, function (d) {
                if(d.responseCode===0){
                    var replyNew = d.data;
                    //1、数据更新
                    var replyObj = getReplyObjById(replyId) || {};
                    replyObj.replyList = replyNew.replyList;
                    replyObj.hot = replyNew.hot;
                    replyObj.maxFloorNumber = replyNew.maxFloorNumber;


                    var $replyItem = getViewRootDOM().find('.cp-reply-item[mid='+replyId+']');
                    //2、DOM更新COUNT
                    findDOMByClass('cc-reply-view', $replyItem).find('span').html(getReplyReplyCount(replyObj));
                    if (IS_SHOW_REPLY2) {
                        //DOM更新LIST
                        var html = renderReplyReplyList(d.data, MAX_SHOW_REPLY2_COUNT);
                        findDOMByClass('cp-reply2-list', $replyItem).html(html);
                    }
                    var html = renderItemView(replyObj, 99999, true);
                    showReplyLayer(html);
                }
            });
        });

    }



    function initOutAPI(that) {
        that.outSetUserInfo = function (newInfo) {
            userInfo = Object.assign({}, userInfo, newInfo);
            renderUserInfo();
        };
        that.outSetPageIdAndRender = function(pid){
            pageId = pid;
            queryCondition = {
                pageId: pageId,
                pageSize:  30,
                pageNumber:  1,
                orderType:  1  //最新1，最早2，最热3
            };
            hideReplyLayer();
            queryAndView(that);
        }
    }


    /** init **/
    initViewContainer(this);
    queryAndView(this);
    bindEventHandler(this);
    initOutAPI(this);
    renderUserInfo();
}


if (window) {
    window.coolpengAvatarView = AvatarView;
}
if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AvatarView;
}