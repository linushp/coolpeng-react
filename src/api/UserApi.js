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


export function createUserAccount({email, nickname, password}) {
    return MyWebSocket.sendSQLQuery("createUserAccount", [email, nickname, password]).then((response)=> {
        var insertId = response.result.insertId;
        return insertId;
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
    return MyWebSocket.sendMsg("deleteUserToken", [id, token]);
}


window.createUserAccount = createUserAccount;
window.getUserByEmailAndPassword = getUserByEmailAndPassword;