import React from 'react'
import $ from 'jquery'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {
    immutableListMap
} from '../../../core/utils/index';
import "./MessageInput.less";

export default class MessageInput extends PureRenderComponent {
    constructor(props) {
        super(props);
    }


    onSendMessage(){

        var x = $("#messageTextAreaInput").val();


        var {onSendMessage} = this.props;//isImmutable
        onSendMessage(x,function () {
            $("#messageTextAreaInput").val("");
        });
    }

    render() {


        return (
            <div className="chat-message-input">
                <textarea id="messageTextAreaInput" cols="30" rows="10"></textarea>
                <button onClick={this.onSendMessage.bind(this)}>发送</button>
            </div>
        );
    }
}