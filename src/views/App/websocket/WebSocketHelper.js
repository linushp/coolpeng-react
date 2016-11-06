import React from 'react'
import ReconnectingWebSocket from "ReconnectingWebSocket";
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {createUUID,EventBus,getIsWindowActive} from '../../../core/utils/index';


function sendWebNotificationIfNecessary(e,currentUserInfo) {

    //如果浏览器获取了焦点,不提醒.
    if(getIsWindowActive()){
        return;
    }

    var data = e.data;
    var eventVO = JSON.parse(data);

    var name = eventVO.name;//"PeerMsgEvent"

    var chatMsgVO, chatSessionVO, receiveUserId, sessionId, msgSummary;
    if (name === 'PeerMsgEvent') {
        chatMsgVO = eventVO.chatMsgVO;//{sendUser:{uid:}}
        chatSessionVO = eventVO.chatSessionVO; //{entityId:40,}
        receiveUserId = eventVO.receiveUserId;//"19"
        sessionId = eventVO.sessionId;//"peer_40"
        msgSummary = eventVO.msgSummary;
    }

    if (name === 'PublicMsgEvent') {
        chatMsgVO = eventVO.chatMsgVO;//{sendUser:{uid:}}
        msgSummary = eventVO.msgSummary;
        sessionId = eventVO.sessionId;//"public_1"
    }

    if(!chatMsgVO || !chatMsgVO.sendUser){
        return;
    }

    //如果是我自己发的,不弹提醒
    if (currentUserInfo.id === chatMsgVO.sendUser.uid) {
        return;
    }

    var icon = chatMsgVO.sendUser.avatar;
    EventBus.emit("WebNotification", {
        title: "新消息提醒",
        icon: icon,
        body: '收到了一条新消息'
    });
}

function ConsoleLog(str){
    console.log(str,new Date());
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
            try {
                sendWebNotificationIfNecessary(message,userInfo);
            }catch (e){ConsoleLog(e)}
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