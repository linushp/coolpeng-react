import RebixFlux from 'react-rebixflux';
import SocketSqlManager from './SocketSqlManager';
import getUniqueId from '../../utils/getUniqueId';
import ReconnectingWebSocket from 'reconnectingwebsocket';


const _logSocketFrames = () => localStorage.getItem('dev$$logSocketFrames') === 'true';
const _logSocketPing = () => localStorage.getItem('dev$$logSocketPing') === 'true';
window._dev = window._dev || {};
window._dev._toggleSocketFrameLogger = (logPing) => {
    localStorage.setItem('dev$$logSocketFrames', (!_logSocketFrames()).toString());
    localStorage.setItem('dev$$logSocketPing', (_logSocketFrames() && !!logPing).toString());
    console.log(_logSocketFrames() ? '启用socket记录' : '停止socket记录');
};
function tryLogSocket(socketFrame) {
    var action = socketFrame.action || socketFrame.responseType;
    if (_logSocketFrames() && (_logSocketPing() || (action !== 'ping' && action !== 'pong'))) {
        console.info('socket:', socketFrame);
    }
}

function noop() {
}


var PROMISE_RESOLVER_CACHE = {};
function savePromiseResolver(requestId, promiseResolver) {
    PROMISE_RESOLVER_CACHE[requestId] = promiseResolver;
}

function getPromiseResolver(requestId) {
    return PROMISE_RESOLVER_CACHE[requestId];
}

function deletePromiseResolver(requestId) {
    PROMISE_RESOLVER_CACHE[requestId] = null;
    delete PROMISE_RESOLVER_CACHE[requestId];
}


class SocketManager {

    constructor() {
        this._resetState();
    }

    sendPing() {
        this._sendSocketFrame({
            "action": 'ping',
            "message": {}
        });
    }

    sendMsg({msgId, sessionId, toUid, fromUid, content}) {
        this._sendSocketFrame({
            "action": 'msg',
            "message": {
                msgId: msgId,
                sessionId: sessionId,
                toUid: toUid,
                fromUid: fromUid,
                content: content
            }
        });
    }

    sendSQLQuery(sqlId, params) {
        var that = this;
        var requestId = getUniqueId();
        that._sendSocketFrame({
            "action": 'sql',
            "message": {
                webSql: SocketSqlManager[sqlId] || '',
                sqlId: sqlId,
                params: params,
                reqId: requestId
            }
        });

        return new Promise(function (resolve, reject) {
            savePromiseResolver(requestId, {resolve: resolve, reject: reject, requestTime: new Date().getTime()});
        });
    }


    closeWebSocket() {
        this._resetState();
    }

    _sendSocketFrame(socketFrame, reTryTimes) {
        var that = this;
        var ws = that._ws;
        if (!ws || ws.readyState===0) {
            reTryTimes = reTryTimes || 0;
            if (reTryTimes > 60) {
                console.error("socket一直没有准备好，不再尝试发送请求");
                return;
            }
            setTimeout(function () {
                that._sendSocketFrame(socketFrame, reTryTimes + 1);
            }, 1000);
        } else {
            //console.log('WebSocket',ws);
            var dataString = JSON.stringify(socketFrame);
            ws.send(dataString);
            tryLogSocket(socketFrame);
        }
    }


    _resetState() {
        if (this._interval) {
            clearInterval(this._interval);
        }
        if (this._ws) {
            this._ws.close();
        }
        this._ws = null;
        this._reconnecttimes = -1;
        this._interval = null;
        this._isInited = false;
        this._authInfo = null;
    }


    _openWebSocket(url) {
        if (this._isInited) {
            this.closeWebSocket();
        }

        this._ws = new ReconnectingWebSocket(url, null, {
            timeoutInterval: 5000
            // debug: true // 有需要时在本地开发环境开启
        });
        this._ws.onmessage = this._onMessage;
        this._ws.onopen = this._onOpen;
        this._ws.onclose = this._onClose;
        this._ws.onconnecting = this._onConnecting;
        this._isInited = true;
    }

    _onConnecting = (event) => {
        const code = event.code;
        if (code != null) {
            if (code === 4403) {
                this.closeWebSocket();
                console.warn('token 失效! 需要重新登录');
            } else {
                console.warn(`SocketManager: 异常的socket关闭code: ${code}`);
            }
        }
    };

    _startPing() {
        this._interval = setInterval(() => {
            this.sendPing();
            this._rejectTimeoutRequest();
        }, 60 * 1000);
    }

    _onOpen = () => {
        this._startPing();

        this._reconnecttimes++;
        //每次断线重连,需要同步消息
        if (this._reconnecttimes > 0) {
            console.warn('Socket 已断线重连.');
            if (this._authInfo) {
                //this._syncOfflineEvents();
            }
        }
        tryLogSocket('onOpen');
    };

    _onClose = () => {
        tryLogSocket('onClose');
        clearInterval(this._interval);
    };


    _rejectTimeoutRequest = ()=> {
        var promises = PROMISE_RESOLVER_CACHE;

        var requestIdList = Object.keys(promises);
        for (var i = 0; i < requestIdList.length; i++) {
            var requestId = requestIdList[i];
            var resolver = promises[requestId];

            if (resolver) {
                var requestTime = resolver.requestTime;
                if (requestTime + 1000 * 60 < new Date().getTime()) {
                    var reject = resolver.reject;
                    reject('request time out');
                    deletePromiseResolver(requestId);
                }
            }

        }
    };


    _onMessage = (response0)=> {
        var that = this;

        var responseData = JSON.parse(response0.data);

        tryLogSocket(responseData);

        var responseType = responseData.responseType;
        if (responseType === 'sql') {

            var requestId = responseData.reqId;
            var promiseResolve = getPromiseResolver(requestId);
            if (promiseResolve) {

                if (responseData['errCode'] !== 0) {
                    promiseResolve.reject(responseData);
                } else {
                    promiseResolve.resolve(responseData);
                }

                deletePromiseResolver(requestId);
            }

        } else if (responseType === 'msg') {
            RebixFlux.dispatchCommand('receiveMessage',responseData);
        }

    };

    openUnauthWebSocket() {
        var connectionId = getUniqueId();
        this._openWebSocket(`ws://111.206.45.12:30318?p=1&connectionId=${connectionId}`);
        this._authInfo = null;
    }

    openAuthWebSocket(uid, token) {
        var connectionId = getUniqueId();
        this._openWebSocket(`ws://111.206.45.12:30318?p=1&connectionId=${connectionId}&uid=${uid}&token=${token}`);
        this._authInfo = {uid, token};
    }

}


var SocketManagerInstance = new SocketManager();
window.SocketManagerInstance = SocketManagerInstance;
export default SocketManagerInstance;