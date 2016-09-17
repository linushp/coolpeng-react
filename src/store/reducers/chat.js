import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';
import {updateImmutableObject} from '../../core/utils/index';

var initialState = immutable.fromJS({
    onlineUserList: [],
    sessionList: [],
    sessionId2MessageList: {}, //key sessionId,value:messageList
    currentSessionId: null
});


function handlePublicMsgEventSessionLastMsg(state, obj) {
    var chatMsgVO = obj.chatMsgVO;
    var sessionId = obj.sessionId;
    var msg = chatMsgVO.msg;
    var finder = function(c){
        return c.get('sessionId')===sessionId;
    };
    var newValue = function(c){
        return c.set('lastMsgText',msg);
    };
    var sessionList = state.get('sessionList');
    sessionList = updateImmutableObject(sessionList,finder,newValue);
    return state.set('sessionList',sessionList);
}

function handlePublicMsgEvent(state, obj) {

    var chatMsgVO = immutable.fromJS(obj.chatMsgVO);
    var sessionId = obj.sessionId;
    var sessionId2MessageList = state.get("sessionId2MessageList");
    var messageList = sessionId2MessageList.get(sessionId);

    messageList = messageList.push(chatMsgVO);
    sessionId2MessageList = sessionId2MessageList.set(sessionId, messageList);
    state = state.set("sessionId2MessageList", sessionId2MessageList);
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
            if (restState.isSuccess()) {
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
                    state = handlePublicMsgEvent(state, json);
                    state = handlePublicMsgEventSessionLastMsg(state, json);
                }
            } catch (e) {
                console.error("[ERROR]", e);
            }
            return state;
        }
    },

    switchType: {}
});