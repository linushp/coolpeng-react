import MyWebSocket from '../utils/MyWebSocket';
import {getDeepValue} from 'rebix-utils';

export function getUserCountByEmail(email){
    return MyWebSocket.sendSQLQuery("getUserCountByEmail",[email]).then((response)=>{
        var {result} = response;
        var result0 = result[0];
        return result0['cc'];
    })
}


export function createUserAccount({email, nickname, password}){
    return MyWebSocket.sendSQLQuery("createUserAccount",[email, nickname, password]).then(()=>{
        debugger;
    })
}


window.createUserAccount = createUserAccount;

