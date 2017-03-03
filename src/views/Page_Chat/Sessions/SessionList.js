import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;

class SessionList extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="SessionList">

            </div>
        )
    }
}

export default RebixFlux.connect(SessionList,function(store, props, context, connectState, that){

});