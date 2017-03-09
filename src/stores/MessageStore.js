import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';
import LoginStore from '../stores/LoginStore';
import SessionStore from '../stores/SessionStore';

function getInitialState() {
    return immutable.fromJS({
        /* key   : "S"+sessionId   */
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
    msg_type: null, //text,image,code
    msg_content: null,
    time: null,
    f_uid: null,
    f_avatar: null,
    f_nickname: null,
    session_id: null,
    status: 'sending' //sending 发送中 , sent 已发送
});

function findMessageIndex(messageList, msg_id) {
    return messageList.findIndex(function (messageRecord) {
        return messageRecord.get('msg_id') === msg_id;
    })
}

function saveOrUpdateMessage(state, sessionId, sendContent) {
    var sendContentRecord = new MessageRecord(sendContent);
    var messageList = getMessageList(state, "S" + sessionId);
    var msg_id = sendContent.msg_id;
    var msgIndex = findMessageIndex(messageList, msg_id);
    if (msgIndex === -1) {
        messageList = messageList.push(sendContentRecord);
    } else {
        messageList = messageList.set(msgIndex, sendContentRecord);
    }
    state = state.set("S" + sessionId, messageList);
    return state;
}

export default RebixFlux.createStore({
    forAction: "message",
    initialState: getInitialState(),

    //发送消息
    onSendMessage: function (state, {status, payload}) {
        if (status === 'success') {
            var {sessionId,sendContent} = payload;
            state = saveOrUpdateMessage(state, sessionId, sendContent)
        }
        return state;
    },

    //接收到消息
    onCmdReceiveMessage: function (state, {staus,payload}) {
        var myUid = LoginStore.getUid();
        var {fromUid,sessionId,content} = payload;
        var sendContent = content;
        sendContent.status = 'sent';
        state = saveOrUpdateMessage(state, sessionId, sendContent);
        return state;
    }

});