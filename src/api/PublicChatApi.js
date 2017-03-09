/**
 * Created by luanhaipeng on 17/3/9.
 */


import MyWebSocket from './socket/SocketManager';
import {getDeepValue} from 'rebix-utils';
import {ServerTimeUtils} from 'rebix-utils';


export function getPublicChatList(){
    return MyWebSocket.sendSQLQuery("getPublicChatList",[]).then((response)=> {
        return response.result;
    });
}