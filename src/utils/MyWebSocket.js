import SqlConstUtils from './SqlConstUtils';
import red from 'r';
var PROMISE_CALLBACK_CHCHE = {};

class MyWebSocket{

    constructor() {
        this.ws = null;
        this.ws.onMessage = this.onMessage
    }

    onMessage = (response)=> {
        var that = this;
        var responseType = response.responseType;
        if(responseType==='sql'){
            var requestId = response.reqId;
            var promiseResolve = PROMISE_CALLBACK_CHCHE[requestId];
            if (promiseResolve) {
                promiseResolve.resolve(response);
                PROMISE_CALLBACK_CHCHE[requestId] = null;
                delete PROMISE_CALLBACK_CHCHE[requestId];
            }
        }else if(responseType==='msg'){

        }

    };


    sendMsg({msgId,sessionId,toUid,fromUid,content}) {
        var that = this;
        that.ws.send(JSON.stringify({
            "action": 'msg',
            "message": {
                msgId: msgId,
                sessionId: sessionId,
                toUid: toUid,
                fromUid: fromUid,
                content: content
            }
        }));
    }

    sendSQLQuery(sqlId,params){
        var that = this;
        var requestId = 1221;

        that.ws.send(JSON.stringify({
            "action": 'sql',
            "message": {
                webSql: SqlConstUtils[sqlId],
                sqlId: sqlId,
                params: params,
                reqId: requestId
            }
        }));

        return new Promise(function (resolve, reject) {
            PROMISE_CALLBACK_CHCHE[requestId] = {resolve: resolve,  reject: reject};
        });
    }

}


export default new MyWebSocket();