import MyWebSocket from './socket/SocketManager';
import {getDeepValue} from 'rebix-utils';
import {ServerTimeUtils} from 'rebix-utils';



export function getMessageListBySessionId(session_id,limit_start,limit_size) {
    return MyWebSocket.sendSQLQuery("getMessageListBySessionId", [session_id,limit_start,limit_size]).then((response)=> {
        return response.result;
    });
}



export function deleteMessageById(message_id,from_uid) {
    return MyWebSocket.sendSQLQuery("deleteMessageById", [message_id,from_uid]).then((response)=> {
        return response.result;
    });
}


