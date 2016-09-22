import React from 'react'
import $ from 'jquery'
import PureRenderComponent from '../../../core/PureRenderComponent';
import SimditorReact from '../../../service/editor/SimditorReact';
import {
    immutableListMap
} from '../../../core/utils/index';
import "./MessageInput.less";

export default class MessageInput extends PureRenderComponent {
    constructor(props) {
        super(props);
    }


    onSendMessage(){
        var that = this;
        var editor = that.refs["SimditorReact"];
        var {imageList,contentText,summary} = editor.getContentParseResult();
        var {onSendMessage} = this.props;//isImmutable
        onSendMessage(contentText,summary, function () {
            editor.clearContentValue();
        });
    }

    render() {

        var toolbar = ['emoji','image'];

        return (
            <div className="chat-message-input">
                <SimditorReact toolbar={toolbar} ref="SimditorReact" content={''} ></SimditorReact>
                <button className="sendButton" onClick={this.onSendMessage.bind(this)}>发送</button>
            </div>
        );
    }
}