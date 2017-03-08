import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';


function getInitialState() {
    return immutable.fromJS({
        /*key:SessionId value:messageList*/
    });
}


function getMessageList(state, sessionId) {
    var messageList = state.get(sessionId);
    if (!messageList) {
        messageList = immutable.fromJS([]);
        state.set(sessionId, messageList);
    }
    return messageList;
}


const MessageRecord = immutable.Record({
    id: null,
    content: null,
    time: null,
    f_uid: null,
    f_avatar: null,
    f_nickname: null,
    session_id: null
});

export default RebixFlux.createStore({
    forAction: "message",
    initialState: getInitialState(),

    onSendMessage: function (state, {status, payload}) {
        if (status === 'success') {
            var {sessionId,message} = payload;
            var messageList = getMessageList(state, sessionId);
            messageList = messageList.push(new MessageRecord(message));
            state = state.set(sessionId, messageList);
        }
        return state;
    }

});