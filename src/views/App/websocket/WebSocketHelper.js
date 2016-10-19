import React from 'react'
import ReconnectingWebSocket from "ReconnectingWebSocket";
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {createUUID,EventBus} from '../../../core/utils/index';


function sendWebNotificationIfNecessary(message) {
    EventBus.emit("WebNotification",{
        title:"新消息提醒",
        //icon: 'img/icon.png',
        body: '收到了一条新消息'
    });
}

function ConsoleLog(str){
    console.log(str);
}

class WebSocketHelper extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.socket = null;
        this.initWebSocket();
    }


    initWebSocket(){
        var that = this;
        var {userInfo,actions} = that.props;
        var uid = userInfo.id;
        if (!uid) {
            return;
        }

        if (that.socket) {
            return;
        }

        var connectionId = createUUID(uid);
        var host = "ws://" + __SERVER_LOCATION_HOST__ + "/cloud/chat.websocket?uid=" + uid + "&connectionId=" + connectionId;
        var socket = null;
        if ('WebSocket' in window || 'MozWebSocket' in window) {
            socket = new ReconnectingWebSocket(host);
        } else {
            ConsoleLog('[ERROR] WebSocket is not supported by this browser.');
            return;
        }
        socket.onopen = function () {
            ConsoleLog('[INFO] WebSocket Opened');
        };

        socket.onclose = function () {
            ConsoleLog('[INFO] WebSocket Closed');
        };

        socket.onmessage = function (message) {
            actions.staticOnWebSocketMessage(message);
            sendWebNotificationIfNecessary(message);
        };

        this.socket = socket;
    }

    componentDidMount() {
        var that = this;
        this.initWebSocket();
    }

    componentWillReceiveProps(nextProps) {
        this.initWebSocket();
    }

    componentWillUnmount() {
        if(this.socket){
            this.socket.close();
            this.socket = null;
        }
    }

    render() {
        return <div></div>;
    }
}


WebSocketHelper.STATE_CONFIG = {
    "userInfo": "user.userInfo"
};

WebSocketHelper.ACTION_CONFIG = {
    "staticOnWebSocketMessage": "chat.staticOnWebSocketMessage"
};


export default ActionStoreHelper()(WebSocketHelper);