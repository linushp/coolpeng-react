import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {immutableListMap,getObjValueInPath,uniqueId,StringUtils,JSXRenderUtils,className,toInnerHTML} from '../../../core/utils/index';
import $ from 'jquery';
import "./MessageList.less";
var hideStyle = JSXRenderUtils.hideStyle;
var valueIn = getObjValueInPath;
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
        var sendUser_nickname = valueIn(sendUser, 'nickname');
        var sendUser_uid = valueIn(sendUser, 'uid');
        var loginUserUid = valueIn(userInfo, "id");
        var isCurrentUser = (loginUserUid === sendUser_uid);

        var msgItemClassName = className({
            'chat-msg-item': true,
            'pending': status === 'pending',
            "isCurrentUser": isCurrentUser,
            "isHideUserInfo": isHideUserInfo
        });

        return (
            <div className={msgItemClassName}>
                <img className="sendUserAvatar" data-uid={sendUser_uid} src={sendUser_avatar}/>
                <div className="mgsBody">
                    <div className="msgDesc">
                        <div className="nickname">{sendUser_nickname}</div>
                        <div className="createTime">{createTimStr}</div>
                    </div>
                    <div className="msgContent">
                        {toInnerHTML(msg)}
                    </div>
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
        var getValue = getObjValueInPath.bind({},currentSession);
        var sessionIcon = getValue("sessionIcon");
        var sessionTitle = getValue("sessionTitle");
        return (
            <div className="chat-msg-header">
                <img className="sessionIcon" src={sessionIcon} alt={sessionTitle} />
                <div className="sessionTitle">
                    {sessionTitle}
                </div>
            </div>
        );
    }
}







export default class MessageList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.uniqueId = uniqueId('MessageListUniqueId');
    }

    scrollToBottom(){
        var $scroll = $("#"+this.uniqueId).find('.chat-msg-scroll');
        var scrollDom = $scroll[0];
        scrollDom.scrollTop = 100000;
    }

    componentDidUpdate(){
        var that = this;
        window.setTimeout(function(){
            that.scrollToBottom();
        },0);
    }

    render() {
        var {messageList,userInfo,currentSession} = this.props;
        var preMessage = null;
        var preMessageEqualCount = 0;
        return (
            <div className="chat-msg-list" id={this.uniqueId}>
                <MessageSessionHeader currentSession={currentSession}></MessageSessionHeader>
                <div className="chat-msg-container">
                    <div className="chat-msg-scroll">
                        {immutableListMap(messageList, function (message) {
                            var uid1 = valueIn(preMessage, 'sendUser.uid');
                            var uid2 = valueIn(message, 'sendUser.uid');
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

                            var msgId = message.msgId;
                            var dom = <MessageItem key={msgId} isHideUserInfo={isHideUserInfo} message={message} userInfo={userInfo}></MessageItem>;
                            preMessage = message;
                            return dom;
                        })}
                    </div>
                </div>

            </div>
        );
    }
}