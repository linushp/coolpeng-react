import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import './MessageList.less';

class MessageList extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="MessageList">

            </div>
        )
    }
}

export default RebixFlux.connect(MessageList,function(store, props, context, connectState, that){
    return {

    };
});