import MyWebSocket from './socket/SocketManager';
import {getDeepValue} from 'rebix-utils';
import {ServerTimeUtils} from 'rebix-utils';

export function getUserCountByEmail(email) {
    return MyWebSocket.sendSQLQuery("getUserCountByEmail", [email]).then((response)=> {
        var {result} = response;
        var result0 = result[0];
        return result0['cc'];
    })
}


export function createUserAccount({email, nickname, password,avatar}) {
    return MyWebSocket.sendSQLQuery("createUserAccount", [email, nickname, password, avatar]).then((response)=> {
        var insertId = response.result.insertId;
        return insertId;
    });
}

export function getUserByEmail(email) {
    return MyWebSocket.sendSQLQuery("getUserByEmail", [email]).then(function (response) {
        return response.result;
    });
}

export function getUserByEmailAndPassword(email, password) {
    return MyWebSocket.sendSQLQuery("getUserByEmailAndPassword", [email, password]).then(function (response) {
        return response.result;
    });
}

export function updateUserToken(token, email, password) {
    var last_login_time = ServerTimeUtils.getServerTimeNow();
    return MyWebSocket.sendSQLQuery("updateUserToken", [token, last_login_time, email, password]).then(function (response) {
        return response.result.changedRows;
    });
}

export function updateLastLoginTime(last_login_time,uid) {
    return MyWebSocket.sendSQLQuery("updateLastLoginTime", [last_login_time,uid]).then(function (response) {
        return response.result.changedRows;
    });
}

export function deleteUserToken(id, token) {
    return MyWebSocket.sendSQLQuery("deleteUserToken", [id, token]).then(function (response) {
        debugger;
    });
}


export function getUserByUidInList(uidList){
    return MyWebSocket.sendSQLQuery("getUserByUidInList", [uidList]).then(function (response) {
        return response.result;
    });
}

export function getUserListByTimeDescLimit(startNum,maxCount){
    return MyWebSocket.sendSQLQuery("getUserListByTimeDescLimit", [startNum,maxCount]).then(function (response) {
        return response.result;
    });
}

export function getOnLineUidList(){
    return MyWebSocket.sendCmdQuery('getOnLineUidList',[]);
}

window.getUserByUidInList = getUserByUidInList;
window.createUserAccount = createUserAccount;
window.getUserByEmailAndPassword = getUserByEmailAndPassword;