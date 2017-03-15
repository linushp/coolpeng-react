import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const trim = RebixUtils.trim;
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import './MessageInput.less';
import MessageActions from '../../../actions/MessageActions';
import {scrollMessageListToBottom} from '../ChattingPageUtils';

class MessageInput extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSendMsg = ()=> {
        var {selSession} = this.props;
        var MessageInputTextArea = this.refs['MessageInputTextArea'];
        var value = trim(MessageInputTextArea.value || '');
        if (value.length === 0) {
            return;
        }

        MessageInputTextArea.value = '';
        MessageActions.sendMessage(selSession, {
            msg_type: 'text', //text,image,code
            msg_content: value
        });

        //发送消息后,滚动到最底部
        scrollMessageListToBottom();
    };

    handleKeyDown=(e)=>{
        if (e.keyCode !== 13) {
            return;
        }
        if (e.keyCode === 13 && (e.shiftKey || e.ctrlKey)) {
            return;
        }

        if (e.keyCode === 13) {
            this.handleSendMsg();
            e.preventDefault();
            return false;
        }
    };

    render() {
        var that = this;
        var textName = 'MessageInputTextArea';
        return (
            <div className="MessageInput">
                <div className="toolbar">
                    <div className="toolbar_item send_emotion">表情</div>
                    <div className="toolbar_item send_image">图片</div>
                    <div className="toolbar_item send_code">代码</div>
                    <div className="clear"></div>
                </div>
                <textarea ref={textName} className={textName} onKeyDown={that.handleKeyDown}></textarea>
                <div className="sendButtonText">SHIFT + ENTER 换行，ENTER 直接发送</div>
                <button className="sendButton" onClick={that.handleSendMsg}>发送</button>
            </div>
        )
    }
}

export default RebixFlux.connect(MessageInput, function (bigStore, props, context, connectState, that) {
    var sessionsMap = getDeepValue(bigStore, 'sessionState.sessionsMap');
    var selSessionId = getDeepValue(bigStore, 'sessionState.selSessionId');
    var selSession = sessionsMap.get(selSessionId);

    return {
        selSessionId: selSessionId,
        selSession: selSession
    };
});