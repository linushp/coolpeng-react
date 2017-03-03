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
    return MyWebSocket.sendSQLQuery("updateUserToken", [token, email, password]).then(function (response) {
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

window.getUserByUidInList = getUserByUidInList;
window.createUserAccount = createUserAccount;
window.getUserByEmailAndPassword = getUserByEmailAndPassword;