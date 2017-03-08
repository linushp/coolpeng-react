import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import './MessageList.less';


const MessageItem = createPureComponent(function(props){
    return (
        <div className="MessageItem">
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
                    messageList.map(function(msg){
                        return <MessageItem message={msg} />
                    })
                }
            </div>
        )
    }
}

export default RebixFlux.connect(MessageList,function(store, props, context, connectState, that){
    return {
        messageList:null
    };
});