/**
 * Created by luanhaipeng on 17/3/3.
 */

import MyWebSocket from './socket/SocketManager';
import {getDeepValue} from 'rebix-utils';
import {ServerTimeUtils} from 'rebix-utils';

export function getMySessions(uid) {
    return MyWebSocket.sendSQLQuery("getMySessions", [uid]).then((response)=> {
        return response.result;
    });
}


export function updateSessionLastTime(sessionId) {
    var last_time = ServerTimeUtils.getServerTimeNow();

    return MyWebSocket.sendSQLQuery("updateSessionLastTime", [last_time,sessionId]).then((response)=> {
        return response.result.changedRows;
    });
}


export function createSession({uid, session_type, to_sid, session_name, last_time}) {
    return MyWebSocket.sendSQLQuery("createSession", [uid, session_type, to_sid, session_name, last_time]).then((response)=> {
        return response.result;
    });
}

export function deleteSession(sessionId,uid) {
    return MyWebSocket.sendSQLQuery("deleteSession", [sessionId,uid]).then((response)=> {
        return response.result;
    });
}



window.createSession = createSession;