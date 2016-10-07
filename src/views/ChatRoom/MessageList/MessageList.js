import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {immutableListMap,getObjValueInPath,uniqueId,StringUtils,JSXRenderUtils,className,toInnerHTML} from '../../../core/utils/index';
import StaticConfig from '../../../core/utils/StaticConfig';
import {showImageCarousel} from './MessageCarousel'
import $ from 'jquery';
import "./MessageList.less";
var hideStyle = JSXRenderUtils.hideStyle;
var valueIn = getObjValueInPath;
var loadingImg = "http://image.coolpeng.cn/static/icons/loading2.gif";
class MessageItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }


    render() {
        var that = this;
        var {message,userInfo,isHideUserInfo} = that.props;
        var getValue = valueIn.bind({}, message);

        var msg = getValue("msg");
        var createTimeMillis = getValue("createTimeMillis");
        var createTimStr = StringUtils.toPrettyString(createTimeMillis || 0);
        var status = getValue('status') || "";

        var sendUser = getValue("sendUser");
        var sendUser_avatar = valueIn(sendUser, 'avatar');
        if(!sendUser_avatar){
            sendUser_avatar = StaticConfig.DEFAULT_AVATAR
        }

        var sendUser_nickname = valueIn(sendUser, 'nickname');
        var sendUser_uid = valueIn(sendUser, 'uid');
        var loginUserUid = valueIn(userInfo, "id");
        var isCurrentUser = (loginUserUid === sendUser_uid);

        var msgItemClassName = className({
            'chat-msg-item': true,
            'isPending': status === 'pending',
            "isCurrentUser": isCurrentUser,
            "isHideUserInfo": isHideUserInfo
        });
        var msgId = valueIn(message, 'msgId');
        return (
            <div className={msgItemClassName} data-mid={msgId}>
                <img className="sendUserAvatar" data-uid={sendUser_uid} src={sendUser_avatar}/>
                <div className="mgsBody">
                    <div className="msgDesc">
                        <div className="nickname">{sendUser_nickname}</div>
                        <div className="createTime">{createTimStr}</div>
                    </div>
                    <div className="msgContent" dangerouslySetInnerHTML={{__html:msg}}></div>
                </div>
                <div className="msgStatus">
                    <img className="loading" src={loadingImg} />
                </div>
                <div className="clear5"></div>
            </div>
        );
    }
}


class MessageSessionHeader extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var {currentSession} = this.props;
        var getValue = getObjValueInPath.bind({}, currentSession);
        var sessionIcon = getValue("sessionIcon");
        var sessionTitle = getValue("sessionTitle");
        return (
            <div className="chat-msg-header">
                <img className="sessionIcon" src={sessionIcon} alt={sessionTitle}/>
                <div className="sessionTitle">
                    {sessionTitle}
                </div>
            </div>
        );
    }
}


function scrollToBottom(uniqueId, count) {

    var $scroll = $("#" + uniqueId).find('.chat-msg-scroll');
    var scrollDom = $scroll[0];
    if (scrollDom) {
        scrollDom.scrollTop = 1000000;
    }

    if (count > 0) {
        window.setTimeout(function () {
            scrollToBottom(uniqueId, count - 1);
        }, 10);
    }
}


export default class MessageList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.uniqueId = uniqueId('MessageListUniqueId');
    }


    componentDidUpdate() {
        var that = this;
        scrollToBottom(this.uniqueId, 10);
    }



    onClickMessageList(e){
        var that = this;
        var {messageList} = that.props;
        var $target = $(e.target);
        if($target.hasClass('chat-uploaded-image')){
            showImageCarousel(that.uniqueId,$target,messageList);
        }
    }



    render() {
        var that = this;
        var {messageList,userInfo,currentSession} = that.props;
        var preMessage = null;
        var preMessageEqualCount = 0;
        return (
            <div className="chat-msg-list" id={that.uniqueId} onClick={that.onClickMessageList.bind(that)}>
                <MessageSessionHeader currentSession={currentSession}></MessageSessionHeader>
                <div className="chat-msg-container">
                    <div className="chat-msg-scroll">
                        {immutableListMap(messageList, function (message) {
                            var uid1 = valueIn(preMessage, 'sendUser.uid');
                            var uid2 = valueIn(message, 'sendUser.uid');
                            var createTimeMillis1 = valueIn(preMessage, 'createTimeMillis');
                            var createTimeMillis2 = valueIn(message, 'createTimeMillis');
                            var isHideUserInfo = false;
                            if (uid1 === uid2) {
                                isHideUserInfo = true;
                                preMessageEqualCount++;
                            } else {
                                preMessageEqualCount = 0;
                            }

                            if (preMessageEqualCount > 10) {
                                isHideUserInfo = false;
                                preMessageEqualCount = 0;
                            }

                            if (createTimeMillis1 && createTimeMillis2 && createTimeMillis2 - createTimeMillis1 > 1000 * 60 * 10) {
                                //时间间隔超过10分钟.
                                isHideUserInfo = false;
                                preMessageEqualCount = 0;
                            }

                            var msgId = valueIn(message, 'msgId');
                            var dom = <MessageItem key={msgId} isHideUserInfo={isHideUserInfo} message={message}
                                                   userInfo={userInfo}></MessageItem>;
                            preMessage = message;
                            return dom;
                        })}
                    </div>
                </div>

            </div>
        );
    }
}