import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID,isEmpty} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import SessionList from '../SessionList/SessionList';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import LeftPanelPlaceHolder from '../LeftPanel/LeftPanelPlaceHolder';
import OperationHolder from '../LeftPanel/OperationHolder';
import './ChatRoomIndex.less'

class ChatRoomIndex extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var that = this;
        var {actions,sessionList} = that.props;

        //这个empty函数,可以判断immutable对象
        if (isEmpty(sessionList)) {
            actions.getAllOnlineUserVO();
            actions.getSessionList({}, function (a, b, c, d) {
                var sessionVO = d[0];
                var session = immutable.fromJS(sessionVO);
                that.onSwitchSession(session, sessionVO);
            });
        }
    }


    /**
     * 切换会话
     * @param session
     * @param sessionVO
     */
    onSwitchSession(session, sessionVO, callback) {
        var sessionId = sessionVO.sessionId;
        var {sessionId2MessageList, actions} = this.props || {};
        actions.staticSetCurrentSessionId(sessionId);
        var messageList = sessionId2MessageList.get(sessionId);
        if (messageList && messageList.size > 0) {
            callback && callback();
            return;
        }
        actions.getChatMsgList({
            sessionVO: sessionVO
        }, function () {
            callback && callback();
        });
    }

    /**
     * 发送消息
     * @param currentSession
     * @param msg
     * @param msgSummary
     * @param callback
     */
    onSendMessage(currentSession, msg, msgSummary, callback) {
        var {actions,user} = this.props;
        var userInfo = user.userInfo;
        var sessionVO = currentSession.toJS();
        var sendObject = {
            msg: msg,
            msgSummary: msgSummary,
            msgId: createUUID(userInfo.id),
            sessionVO: sessionVO,
            refreshRecent: true
        };

        if (sessionVO.sessionType === 'robot') {
            if (!msgSummary) {
                msgSummary = "尴尬";
            }
            sendObject.$$URL_PARAMS$$ = {
                userid: userInfo.id,
                info: msgSummary,
                key: "afee6aaebd54bc67af29f743f53c4ee5" //https://www.juhe.cn/myData
            };

            actions.sendMessageToRobot(sendObject, function () {
                callback();
                actions.sendMessage(sendObject, function () {});
            });

        } else {
            actions.sendMessage(sendObject, function () {
                callback()
            });
        }
    }


    onCreateNewSession(sessionType, participateUidList, callback) {
        var that = this;
        var {actions} = that.props || {};
        var sessionVO = {
            sessionType: sessionType,
            participateUidList: participateUidList
        };
        actions.createSession({sessionVO}, function (a, b) {
            var sessionVO = b.data;
            actions.getSessionList({}, function (a, b, c, d) {
                var session = immutable.fromJS(sessionVO);
                that.onSwitchSession(session, sessionVO, function () {
                    callback && callback();
                });
            });
        });
    }


    onDeleteSession(session, sessionVO){
        var that = this;
        var {actions} = that.props || {};
        actions.deleteSession({sessionVO},function(){
            actions.getSessionList({}, function (a, b, c, d) {
                var sessionVO = d[0];
                var session = immutable.fromJS(sessionVO);
                that.onSwitchSession(session, sessionVO);
            });
        });
    }

    getFunctions() {
        var that = this;
        return {
            onCreateNewSession: that.onCreateNewSession.bind(that)
        };
    }

    render() {
        var that = this;
        var {user, sessionList, sessionId2MessageList, currentSessionId,onlineUserList,actions} = that.props || {};
        var userInfo = user.userInfo || {};
        var messageList = sessionId2MessageList.get(currentSessionId);
        var currentSession = sessionList.find(function (obj) {
            var sessionId = obj.get("sessionId");
            return currentSessionId === sessionId;
        });
        var functions = this.getFunctions();
        return (
            <div className="chat-room">
                <div className="chat-side">
                    <LeftPanelPlaceHolder />
                    <div className="session-list">
                        <SessionList sessionList={sessionList}
                                     currentSession={currentSession}
                                     onDeleteSession={that.onDeleteSession.bind(that)}
                                     onSwitchSession={that.onSwitchSession.bind(that)}></SessionList>
                        <div style={{height:50}}></div>
                    </div>
                    <OperationHolder onlineUserList={onlineUserList} userInfo={userInfo} actions={actions}
                                     functions={functions}/>
                </div>
                <div className="chat-content">
                    <MessageList messageList={messageList} currentSession={currentSession}
                                 userInfo={userInfo}></MessageList>
                    <MessageInput onSendMessage={that.onSendMessage.bind(that,currentSession)}
                                  userInfo={userInfo}></MessageInput>
                </div>
            </div>
        );
    }
}


ChatRoomIndex.STATE_CONFIG = {
    "user": 'user',
    "sessionList": "chat.sessionList",
    "sessionId2MessageList": "chat.sessionId2MessageList",
    "currentSessionId": "chat.currentSessionId",
    "onlineUserList": "chat.onlineUserList"
};

ChatRoomIndex.ACTION_CONFIG = {
    "getAllOnlineUserVO": "chat.getAllOnlineUserVO",
    "getSessionList": "chat.getSessionList",
    "createSession": "chat.createSession",
    "deleteSession":"chat.deleteSession",
    "sendMessage": "chat.sendMessage",
    "sendMessageToRobot": "chat.sendMessageToRobot",
    "getChatMsgList": "chat.getChatMsgList",
    "staticSetCurrentSessionId": "chat.staticSetCurrentSessionId"
};


export default ActionStoreHelper()(ChatRoomIndex);