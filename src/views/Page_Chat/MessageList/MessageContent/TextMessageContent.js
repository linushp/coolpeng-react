import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;


export default class TextMessageItem extends PureRenderComponent{

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        var {message} = this.props;
        var {msg_content,status} = message;
        return (
            <div className="TextMessageItem">
                {msg_content}
                {status==='sending'?'sending':null}
            </div>
        )
    }
}