import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {createUUID} from '../../../core/utils/index';


class WebSocketHelper extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.socket = null;
        this.webSocketUid = null;
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
        if ('WebSocket' in window) {
            socket = new WebSocket(host);
        } else if ('MozWebSocket' in window) {
            socket = new MozWebSocket(host);
        } else {
            console.log('Error: WebSocket is not supported by this browser.');
            return;
        }

        socket.onopen = function () {

        };

        socket.onclose = function () {
        };

        socket.onmessage = function (message) {
            actions.staticOnWebSocketMessage(message);
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