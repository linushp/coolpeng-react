import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';
import {updateImmutableObject, StringUtils, createUUID, getCurrentUser,} from '../../core/utils/index';
import StaticConfig from '../../core/utils/StaticConfig';

var initialState = immutable.fromJS({
    onlineUserList: [],
    sessionList: [],
    sessionId2MessageList: {}, //key sessionId,value:messageList
    currentSessionId: null
});

function immutableFromJSON(jsonObj) {
    return immutable.fromJS(jsonObj);
}

function ifNullReturnNewList(listObj) {
    if (listObj) {
        return listObj;
    }
    return immutableFromJSON([]);
}


function beforeSendMsg_HandlePublicMsgEventSessionLastMsg(state, obj) {
    //var chatMsgVO = obj.chatMsgVO;
    var sessionId = obj.sessionId;
    var msgSummary = obj.msgSummary;
    //var msg = chatMsgVO.msg;
    var finder = function (c) {
        return c.get('sessionId') === sessionId;
    };
    var newValue = function (c) {
        return c.set('lastMsgText', msgSummary);
    };
    var sessionList = state.get('sessionList');
    sessionList = updateImmutableObject(sessionList, finder, newValue);
    return state.set('sessionList', sessionList);
}

function beforeSendMsg_HandlePublicMsgEvent(state, obj) {

    var chatMsgVO = immutableFromJSON(obj.chatMsgVO);
    var sessionId = obj.sessionId;
    var sessionId2MessageList = state.get("sessionId2MessageList");
    var messageList = sessionId2MessageList.get(sessionId);
    messageList = ifNullReturnNewList(messageList);
    messageList = messageList.push(chatMsgVO);
    sessionId2MessageList = sessionId2MessageList.set(sessionId, messageList);
    state = state.set("sessionId2MessageList", sessionId2MessageList);
    return state;
}


function isMessageListContainsMsgId(messageList, msgId) {
    var isHas = false;

    messageList.forEach(function (c) {
        if (c.get('msgId') === msgId) {
            isHas = true;
        }
    });

    return isHas;
}

function afterSendMsg_HandlePublicMsgEvent(state, obj) {

    var chatMsgVO = immutableFromJSON(obj.chatMsgVO);
    var msgId = obj.chatMsgVO.msgId;
    var sessionId = obj.sessionId;
    var sessionId2MessageList = state.get("sessionId2MessageList");
    var messageList = sessionId2MessageList.get(sessionId);
    messageList = ifNullReturnNewList(messageList);
    if (isMessageListContainsMsgId(messageList, msgId)) {
        var finder = function (c) {
            return c.get('msgId') === msgId;
        };
        var newValue = function (c) {
            return chatMsgVO;
        };
        messageList = updateImmutableObject(messageList, finder, newValue);
    } else {
        messageList = messageList.push(chatMsgVO);
    }


    sessionId2MessageList = sessionId2MessageList.set(sessionId, messageList);
    state = state.set("sessionId2MessageList", sessionId2MessageList);
    return state;
}

function afterSendMsg_HandlePublicMsgEventSessionLastMsg(state, json) {
    return beforeSendMsg_HandlePublicMsgEventSessionLastMsg(state, json);
}




function addStaticMessage(state,sessionId,userInfo,msgId,msg,msgSummary,status){
    var json = {
        sessionId: sessionId,
        msgSummary: msgSummary,
        chatMsgVO: {
            msgId: msgId,
            sendUser: {
                uid: userInfo.id,
                username: userInfo.username,
                nickname: userInfo.nickname,
                avatar: userInfo.avatar
            },
            msg: msg,
            createTimeMillis: new Date().getTime(),
            status: status
        }
    };
    state = beforeSendMsg_HandlePublicMsgEvent(state, json);
    state = beforeSendMsg_HandlePublicMsgEventSessionLastMsg(state, json);
    return state;
}


export default CreateCloudRestReducer({
    initialState: initialState,
    switchRestPrefix: "chat",
    switchRestType: {
        'getAllOnlineUserVO': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var onlineUserList = immutable.fromJS(res.data || []);
                state = state.set('onlineUserList', onlineUserList);
            }
            return state;
        },
        'getSessionList': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                if (restState.isSuccess()) {
                    var sessionList = immutable.fromJS(res.data || []);
                    state = state.set('sessionList', sessionList);
                }
            }
            return state;
        },
        'createSession': function (state, res, restState, meta) {
            if (restState.isSuccess()) {

            }
            return state;
        },
        'sendMessage': function (state, res, restState, meta) {
            if (restState.isPending()) {
                var sessionId = meta.reqData.sessionVO.sessionId;
                var msg = meta.reqData.msg;
                var msgId = meta.reqData.msgId;
                var msgSummary = meta.reqData.msgSummary;
                var userInfo = getCurrentUser();
                state = addStaticMessage(state,sessionId,userInfo,msgId,msg,msgSummary,'pending');
            }
            return state;
        },
        'sendMessageToRobot':function(state, res, restState, meta){
            var sessionId = meta.reqData.sessionVO.sessionId;
            if (restState.isPending()) {
                var msg = meta.reqData.msg;
                var msgId = meta.reqData.msgId;
                var msgSummary = meta.reqData.msgSummary;
                var userInfo = getCurrentUser();
                state = addStaticMessage(state,sessionId,userInfo,msgId,msg,msgSummary,'sent');
            }else if(restState.isSuccess()){
                var text0 = res.result.text;
                var userInfo0 = StaticConfig.bibiRobotUser;
                var msg0 = text0;
                var msgId0 = new Date().getTime();
                state = addStaticMessage(state,sessionId,userInfo0,msgId0,msg0,msg0,'sent');
            }
            return state;
        },
        'getChatMsgList': function (state, res, restState, meta) {
            if (restState.isSuccess()) {
                var msgList = immutable.fromJS(res.data || []);
                var sessionVO = res["extendData"]["sessionVO"];
                var sessionId = sessionVO["sessionId"];
                var sessionId2MessageList = state.get('sessionId2MessageList');
                sessionId2MessageList = sessionId2MessageList.set(sessionId, msgList);
                state = state.set("sessionId2MessageList", sessionId2MessageList);
            }
            return state;
        },
        "staticSetCurrentSessionId": function (state, res, restState, meta) {
            var sessionId = res.data;
            state = state.set("currentSessionId", sessionId);
            return state;
        },
        "staticOnWebSocketMessage": function (state, res, restState, meta) {
            try {
                var data = res.data.data;
                var json = JSON.parse(data);
                var messageName = json.name;
                if (messageName === "PublicMsgEvent") {
                    state = afterSendMsg_HandlePublicMsgEvent(state, json);
                    state = afterSendMsg_HandlePublicMsgEventSessionLastMsg(state, json);
                }
            } catch (e) {
                console.error("[ERROR]", e);
            }
            return state;
        }
    },

    switchType: {}
});