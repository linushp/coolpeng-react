import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID,isEmpty,StaticConfig} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import SessionList from '../SessionList/SessionList';
import MessageList from '../MessageList/MessageList';
import MessageInput from '../MessageInput/MessageInput';
import LeftPanelPlaceHolder from '../LeftPanel/LeftPanelPlaceHolder';
import OperationHolder from '../LeftPanel/OperationHolder';
import {showUserInfoDialog} from '../../dialogs/UserInfoDialog/UserInfoDialog';
import './ChatRoomIndex.less'


function getNowTime() {
    return new Date().getTime();
}


class ChatRoomIndex extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {
            nowTime: getNowTime()
        };
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


        //定时刷新时间相关
        that.timeIntervalHandler = setInterval(function () {
            that.setState({
                nowTime: getNowTime()
            });
            actions.staticJudgeCurrentSessionUnreadCount();
        }, 1000 * 60 * 2);

    }

    componentWillUnmount() {
        var that = this;
        if (that.timeIntervalHandler) {
            clearInterval(that.timeIntervalHandler);
        }
    }


    onDeleteSession = (session, sessionVO)=> {
        var that = this;
        var {actions} = that.props || {};
        actions.deleteSession({sessionVO}, function () {
            actions.getSessionList({}, function (a, b, c, d) {
                var sessionVO = d[0];
                var session = immutable.fromJS(sessionVO);
                that.onSwitchSession(session, sessionVO);
            });
        });
    };


    /**
     * 切换会话
     * @param session
     * @param sessionVO
     * @param callback
     */
    onSwitchSession = (session, sessionVO, callback)=> {
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
    };

    /**
     * 发送消息
     * @param msg
     * @param msgSummary
     * @param callback
     */
    onSendMessage = (msg, msgSummary, callback)=> {
        var that = this;
        var currentSession = that.getCurrentSession();
        var {actions,user} = that.props;
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
                actions.sendMessage(sendObject, function () {
                });
            });

        } else {
            actions.sendMessage(sendObject, function () {
                callback()
            });
        }

    };

    onCreateNewSession = (sessionType, participateUidList, callback)=> {
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
    };


    getFunctions =()=> {
        var that = this;
        if(!that.getFunctions_Functions){
            that.getFunctions_Functions = {
                onCreateNewSession: that.onCreateNewSession
            };
        }
        return that.getFunctions_Functions;
    };

    getCurrentSession =()=>{
        var that = this;
        var {sessionList, currentSessionId} = that.props || {};
        var currentSession = sessionList.find(function (obj) {
            var sessionId = obj.get("sessionId");
            return currentSessionId === sessionId;
        });
        return currentSession;
    };


    /**
     * 显示用户信息,根据用户的uid
     */
    onClickShowUserInfoByUID =(uid)=>{
        if(!uid){
            console.log("[ERROR] uid = ",uid);
            return;
        }
        var that = this;
        var {actions} = that.props || {};
        if((''+uid)=='-1'){
            showUserInfoDialog(StaticConfig.bibiRobotUser)
        }else {
            actions.getUserInfoByUid({uid},function(a,resp,c){
                var userData = resp.data;
                showUserInfoDialog(userData);
            });
        }
    };


    /**
     * 保存代码
     * @param cloudCodeEntity
     */
    onSaveCloudCode =(cloudCodeEntity)=>{

        var that = this;
        var {actions, user} = that.props;
        var language = cloudCodeEntity.language;
        var codeContent = cloudCodeEntity.content || "";
        actions.saveCloudCode({CloudCode: cloudCodeEntity}, function (a, b) {

            var currentSession = that.getCurrentSession();
            var userInfo = user.userInfo;
            var sessionVO = currentSession.toJS();
            var mm = Object.assign({}, cloudCodeEntity);
            delete mm.content;
            mm.codeEntityId = b.data;
            mm.codeSize = codeContent.length;
            var msg = JSON.stringify(mm);
            var sendObject = {
                msg: msg,
                msgSummary: `[一段${language}代码]`,
                msgId: createUUID(userInfo.id),
                sessionVO: sessionVO,
                refreshRecent: true,
                type: 'code'
            };

            actions.sendMessage(sendObject);
        });
    };

    render() {

        var that = this;
        var {nowTime} = that.state;
        var {user, sessionList, sessionId2MessageList, currentSessionId,onlineUserList,actions} = that.props || {};
        var userInfo = user.userInfo || {};
        var messageList = sessionId2MessageList.get(currentSessionId);
        var currentSession = that.getCurrentSession();
        var functions = that.getFunctions();

        return (
            <div className="chat-room">
                <div className="chat-side">
                    <LeftPanelPlaceHolder />
                    <div className="session-list">
                        <SessionList sessionList={sessionList}
                                     nowTime={nowTime}
                                     currentSessionId={currentSessionId}
                                     onDeleteSession={that.onDeleteSession}
                                     onSwitchSession={that.onSwitchSession}></SessionList>
                        <div style={{height:50}}></div>
                    </div>
                    <OperationHolder onlineUserList={onlineUserList} userInfo={userInfo} actions={actions}
                                     functions={functions}/>
                </div>
                <div className="chat-content">
                    <MessageList onClickShowUserInfoByUID={that.onClickShowUserInfoByUID}
                                 nowTime={nowTime}
                                 messageList={messageList}
                                 currentSession={currentSession}
                                 userInfo={userInfo}></MessageList>
                    <MessageInput onSendMessage={that.onSendMessage}
                                  onSaveCloudCode={that.onSaveCloudCode}
                                  userInfo={userInfo}></MessageInput>
                </div>
                <div className="chat-right-side">

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
    "deleteSession": "chat.deleteSession",
    "sendMessage": "chat.sendMessage",
    "sendMessageToRobot": "chat.sendMessageToRobot",
    "getChatMsgList": "chat.getChatMsgList",
    "staticSetCurrentSessionId": "chat.staticSetCurrentSessionId",
    "staticJudgeCurrentSessionUnreadCount":"chat.staticJudgeCurrentSessionUnreadCount",
    "getUserInfoByUid":"user.getUserInfoByUid",
    "saveCloudCode":"filesCode.saveCloudCode"
};


export default ActionStoreHelper()(ChatRoomIndex);