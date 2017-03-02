import SqlConstUtils from './SqlConstUtils';
import getUniqueId from './getUniqueId';
import ReconnectingWebSocket from 'reconnectingwebsocket';

var PROMISE_CALLBACK_CHCHE = {};


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


class MyWebSocket {

    constructor() {
        this._resetState();
    }


    sendPing() {
        this._sendSocketFrame({
            "action": 'ping',
            "message": {}
        });
    }

    sendMsg({msgId,sessionId,toUid,fromUid,content}) {
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
        var requestId = 1221;

        this._sendSocketFrame({
            "action": 'sql',
            "message": {
                webSql: SqlConstUtils[sqlId],
                sqlId: sqlId,
                params: params,
                reqId: requestId
            }
        });

        return new Promise(function (resolve, reject) {
            PROMISE_CALLBACK_CHCHE[requestId] = {resolve: resolve, reject: reject};
        });
    }


    closeWebSocket() {
        this._resetState();
    }

    _sendSocketFrame(socketFrame) {
        var that = this;
        that._ws.send(JSON.stringify(socketFrame));
        tryLogSocket(socketFrame);
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
        }, 10000);
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


    _onMessage = (response)=> {
        var that = this;

        response = JSON.parse(response.data);

        tryLogSocket(response);

        var responseType = response.responseType;
        if (responseType === 'sql') {

            var requestId = response.reqId;
            var promiseResolve = PROMISE_CALLBACK_CHCHE[requestId];
            if (promiseResolve) {
                promiseResolve.resolve(response);
                PROMISE_CALLBACK_CHCHE[requestId] = null;
                delete PROMISE_CALLBACK_CHCHE[requestId];
            }

        } else if (responseType === 'msg') {

        }

    };

    openUnauthWebSocket() {
        var connectionId = getUniqueId();
        this._openWebSocket(`ws://111.206.45.12:30318?p=1&connectionId=${connectionId}`);
        this._authInfo = null;
    }

    openAuthWebSocket(uid, token) {
        console.log('openAuthWebSocket', uid, token);
        var connectionId = getUniqueId();
        this._openWebSocket(`ws://111.206.45.12:30318?p=1&connectionId=${connectionId}&uid=${uid}&token=${token}`);
        this._authInfo = {uid, token};
    }

}

var MyWebSocketInstance = new MyWebSocket();
window.MyWebSocketInstance = MyWebSocketInstance;
export default MyWebSocketInstance;