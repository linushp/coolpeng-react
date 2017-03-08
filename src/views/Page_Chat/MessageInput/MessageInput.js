import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import './MessageInput.less';

class MessageInput extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="MessageInput">

            </div>
        )
    }
}

export default RebixFlux.connect(MessageInput,function(store, props, context, connectState, that){
    return {

    };
});