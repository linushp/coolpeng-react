import React from 'react'
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import template from './index.rt';
import './index.less'

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
            nameList:["aaa","bbbb","ccc"]
        };
    }

    componentWillMount() {
    }

    render() {
        var actions = this.props.actions;
        var user = this.props.user || {};
        return template.apply(this,this.state);
    }
}


Home.STATE_CONFIG = {
    user: 'user'
};

Home.ACTION_CONFIG = {
    setCurrentTempUser: 'user.setCurrentTempUser'
};


var websocket = null;

//判断当前浏览器是否支持WebSocket
if('WebSocket' in window){
    websocket = new WebSocket("ws://localhost:10086/chat/websocket.websocket?uid=1");
}
else{
    alert('Not support websocket')
}

//连接发生错误的回调方法
websocket.onerror = function(){
    setMessageInnerHTML("error");
};

//连接成功建立的回调方法
websocket.onopen = function(event){
    setMessageInnerHTML("open");
}

//接收到消息的回调方法
websocket.onmessage = function(event){
    setMessageInnerHTML(event.data);
}

//连接关闭的回调方法
websocket.onclose = function(){
    setMessageInnerHTML("close");
}

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function(){
    websocket.close();
}

//将消息显示在网页上
function setMessageInnerHTML(innerHTML){
    console.log(innerHTML);
}

//关闭连接
function closeWebSocket(){
    websocket.close();
}

//发送消息
function send(text){
    websocket.send(text);
}

window.UbibiWebsocketSend = send;


export default ActionStoreHelper()(Home);