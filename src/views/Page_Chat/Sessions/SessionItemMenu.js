import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;

var KEY_DELETE_SESSION = 'delete';
class SessionItemMenu extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="SessionItemMenu">

            </div>
        )
    }
}

export default RebixFlux.connect(SessionItemMenu,function(store, props, context, connectState, that){
    return {

    }
});