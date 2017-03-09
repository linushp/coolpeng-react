import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';


function getInitialState() {
    return immutable.fromJS({
        /* key   : "S"+SessionId   */
        /* value : messageList */
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


/**
 * 消息记录
 */
const MessageRecord = immutable.Record({
    id: null,
    msg_id: null, //前端产生的msg id
    content: null, /*MessageContentRecord*/
    time: null,
    f_uid: null,
    f_avatar: null,
    f_nickname: null,
    session_id: null,
    status: 'sending' //sending 发送中 , sent 已发送
});

/**
 * 消息内容
 */
const MessageContentRecord = immutable.Record({
    type: 'text', //text,image,code
    data: null
});

export default RebixFlux.createStore({
    forAction: "message",
    initialState: getInitialState(),

    onSendMessage: function (state, {status, payload}) {
        if (status === 'success') {
            var {sessionId,message} = payload;
            message.content = new MessageContentRecord(message.content);
            var messageList = getMessageList(state, "S" + sessionId);
            messageList = messageList.push(new MessageRecord(message));
            state = state.set("S" + sessionId, messageList);
        }
        return state;
    },

    //接收到消息
    onCmdReceiveMessage: function (state, {staus,payload}) {
        //debugger;
    }

});