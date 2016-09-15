import CreateCloudRestReducer from '../../core/CreateCloudRestReducer';
import immutable from 'immutable';

var initialState = immutable.fromJS({
    onlineUserList: [],
    sessionList: [],
    sessionId2MessageList: {}, //key sessionId,value:messageList
    currentSessionId: null
});


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
                sessionId2MessageList = sessionId2MessageList.set(sessionId,msgList);
                state = state.set("sessionId2MessageList",sessionId2MessageList);
            }
            return state;
        }
    },

    switchType: {}
});