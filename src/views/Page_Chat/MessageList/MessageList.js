import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;

import TextMessageContent from './MessageContent/TextMessageContent'
import ImageMessageContent from './MessageContent/ImageMessageContent'
import CodeMessageContent from './MessageContent/CodeMessageContent'

import './MessageList.less';


var MessageItemMap = {
    'text':TextMessageContent,
    'image':ImageMessageContent,
    'code':CodeMessageContent
};


const MessageItem = createPureComponent(function(props){
    var {message} = props;
    var {msg_type} = message;
    var RenderMessageContent = MessageItemMap[msg_type] || TextMessageContent;
    return (
        <div className="MessageItem">
            <RenderMessageContent message={message}/>
        </div>
    );
});


class MessageList extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        var {messageList} = this.props;
        return (
            <div className="MessageList">
                {
                    messageList &&
                    messageList.map(function(msg){
                        var msg_id = msg.msg_id || msg.id;
                        return <MessageItem message={msg} key={msg_id}/>
                    })
                }
            </div>
        )
    }
}

export default RebixFlux.connect(MessageList,function(bigStore, props, context, connectState, that){

    var selSessionId = getDeepValue(bigStore, 'sessionState.selSessionId');
    var messageList = getDeepValue(bigStore,'messageState.S'+selSessionId);
    return {
        selSessionId:selSessionId,
        messageList:messageList
    };
});