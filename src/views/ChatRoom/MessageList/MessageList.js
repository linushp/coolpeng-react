import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {
    immutableListMap
} from '../../../core/utils/index';
import "./MessageList.less";


class MessageItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var {message} = this.props;
        var m = message.toJS();
        return (
            <div className="item">
                {m.msg}---{m.createTime}
            </div>
        );
    }
}


export default class MessageList extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var {messageList, currentSession} = this.props;
        return (
            <div className="chat-message-list">
                {immutableListMap(messageList, function (message) {
                    var msgId = message.msgId;
                    return <MessageItem key={msgId} message={message}></MessageItem>
                })}
            </div>
        );
    }
}