import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const forEach = RebixUtils.forEach;
const ServerTimeUtils = RebixUtils.ServerTimeUtils;
import LoginStore from '../stores/LoginStore';
import SessionStore from '../stores/SessionStore';
import {SESSION_TYPE_P2P} from '../constants/Constants';
import {getMessageListBySessionId,deleteMessageById} from '../api/MessageApi';
import SocketManager from '../api/socket/SocketManager';
import getUniqueId from '../utils/getUniqueId';

function toUidMap(arr) {
    var result = {};
    forEach(arr, function (a) {
        result['' + a] = 1;
    });
    return result;
}

export default RebixFlux.createActions("message", {


    sendMessage: function ({session_type,id,to_sid}, msgContent) {

        var serverTimeNow = ServerTimeUtils.getServerTimeNow();
        var sessionId = id;
        var myUid = LoginStore.getUid();
        var myUserInfo = LoginStore.getUserInfo();
        var msgId = getUniqueId();

        if (SESSION_TYPE_P2P === session_type) {
            SocketManager.sendMsg({
                msgId: msgId,
                sessionId: sessionId,
                toUid: toUidMap([myUid, to_sid]),
                fromUid: myUid,
                content: msgContent
            });
        }

        return {
            sessionId: sessionId,
            message: {
                msg_id: msgId, //前端产生的msg id
                content: msgContent,
                time: serverTimeNow,
                f_uid: myUid,
                f_avatar: myUserInfo.avatar,
                f_nickname: myUserInfo.nickname,
                session_id: sessionId,
                status: 'sending' //sending 发送中 , sent 已发送
            }
        }
    }

});