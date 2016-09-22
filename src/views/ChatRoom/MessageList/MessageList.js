import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {immutableListMap,getObjValueInPath,uniqueId} from '../../../core/utils/index';
import $ from 'jquery';
import "./MessageList.less";
var valueIn = getObjValueInPath;
class MessageItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var {message} = this.props;
        var getValue = valueIn.bind({},message);

        var msg = getValue("msg");
        var createTime = getValue("createTime");

        var sendUser = getValue("sendUser");
        var sendUser_avatar = valueIn(sendUser,'avatar');
        var sendUser_nickname = valueIn(sendUser,'nickname');
        var sendUser_uid = valueIn(sendUser,'uid');

        return (
            <div className="chat-msg-item">
                <img className="sendUserAvatar" data-uid={sendUser_uid} src={sendUser_avatar} />
                <div className="mgsBody">
                    <div className="msgDesc">
                        <div className="nickname">{sendUser_nickname}</div>
                        <div className="createTime">{createTime}</div>
                    </div>
                    <div className="msgContent">
                        {msg}
                    </div>
                </div>
                <div className="clear10"></div>
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
        var {messageList, currentSession} = this.props;
        return (
            <div className="chat-msg-list" id={this.uniqueId}>
                <MessageSessionHeader currentSession={currentSession}></MessageSessionHeader>
                <div className="chat-msg-container">
                    <div className="chat-msg-scroll">
                        {immutableListMap(messageList, function (message) {
                            var msgId = message.msgId;
                            return <MessageItem key={msgId} message={message}></MessageItem>
                        })}
                    </div>
                </div>

            </div>
        );
    }
}