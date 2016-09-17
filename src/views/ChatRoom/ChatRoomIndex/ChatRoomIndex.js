import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import PureRenderComponent from '../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import SessionList from '../SessionList/SessionList';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import './ChatRoomIndex.less'

class ChatRoomIndex extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var that = this;
        var {actions} = that.props;
        actions.getAllOnlineUserVO();
        actions.getSessionList({}, function (a, b, c, d) {
            var sessionVO = d[0];
            var session = immutable.fromJS(sessionVO);
            that.onSwitchSession(session, sessionVO);
        });
    }

    onSwitchSession(session, sessionVO) {
        var sessionId = sessionVO.sessionId;
        var {sessionId2MessageList, actions} = this.props || {};
        actions.staticSetCurrentSessionId(sessionId);
        var messageList = sessionId2MessageList.get(sessionId);
        if (messageList && messageList.size > 0) {
            return;
        }
        actions.getChatMsgList({
            sessionVO: sessionVO
        });
    }

    onSendMessage(currentSession, msg, callback) {
        var {actions} = this.props;
        var sessionVO = currentSession.toJS();
        actions.sendMessage({
            msg: msg,
            sessionVO: sessionVO,
            refreshRecent: true
        }, function () {
            callback()
        });
    }

    render() {
        var that = this;
        var {user, sessionList, sessionId2MessageList, currentSessionId} = that.props || {};
        var userInfo = user.userInfo;
        var messageList = sessionId2MessageList.get(currentSessionId);
        var currentSession = sessionList.find(function (obj) {
            var sessionId = obj.get("sessionId");
            return currentSessionId === sessionId;
        });
        return (
            <div className="chat-room">
                <div className="chat-side">
                    <div className="my-info">
                        <img className="avatar" src={userInfo.avatar} alt=""/>
                        <div className="content">
                            <div className="my-name">{userInfo.nickname}</div>
                            <div className="my-name2">{userInfo.mail}</div>
                        </div>
                    </div>
                    <div className="session-list">
                        <SessionList sessionList={sessionList}
                                     currentSession={currentSession}
                                     onSwitchSession={that.onSwitchSession.bind(that)}></SessionList>
                    </div>
                </div>
                <div className="chat-content">
                    <MessageList messageList={messageList} currentSession={currentSession}></MessageList>
                    <MessageInput onSendMessage={that.onSendMessage.bind(that,currentSession)}></MessageInput>
                </div>
            </div>
        );
    }
}


ChatRoomIndex.STATE_CONFIG = {
    "user": 'user',
    "sessionList": "chat.sessionList",
    "sessionId2MessageList": "chat.sessionId2MessageList",
    "currentSessionId": "chat.currentSessionId"
};

ChatRoomIndex.ACTION_CONFIG = {
    "getAllOnlineUserVO": "chat.getAllOnlineUserVO",
    "getSessionList": "chat.getSessionList",
    "createSession": "chat.createSession",
    "sendMessage": "chat.sendMessage",
    "getChatMsgList": "chat.getChatMsgList",
    "staticSetCurrentSessionId": "chat.staticSetCurrentSessionId"
};


export default ActionStoreHelper()(ChatRoomIndex);