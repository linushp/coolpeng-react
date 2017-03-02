import MyWebSocket from '../utils/MyWebSocket';

export function getUserByEmail(email){
    MyWebSocket.sendSQLQuery("getUserByEmail",[email]);
}