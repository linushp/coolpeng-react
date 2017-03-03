import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import UserAvatar from '../../../components/UserAvatar/UserAvatar';


const LastMsgTime = createPureComponent(function(props){
    return (
        <div className="LastMsgTime">
        </div>
    );
});

const LastMsg = createPureComponent(function(props){
    return (
        <div className="LastMsg">
        </div>
    );
});

class SessionItem extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="SessionItem">
                <UserAvatar className="session-logo" avatar="" />
                <div className="session-info">
                    <div className="sessionName"></div>
                    <LastMsgTime />
                    <LastMsg />
                </div>
            </div>
        )
    }
}

export default RebixFlux.connect(SessionItem,function(store, props, context, connectState, that){
    return {}
});