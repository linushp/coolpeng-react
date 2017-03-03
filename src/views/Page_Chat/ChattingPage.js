import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import SessionActions from '../../actions/SessionActions';

class ChattingPage extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
//        SessionActions.getMySessions();
    }

    render(){
        return (
            <div className="ChattingPage">

            </div>
        )
    }
}

export default RebixFlux.connect(ChattingPage,function(store, props, context, connectState, that){
    return {

    }
});