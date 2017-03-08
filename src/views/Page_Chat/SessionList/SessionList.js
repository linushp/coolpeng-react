import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import SessionStore from '../../../stores/SessionStore';
import UserAccountStore from '../../../stores/UserAccountStore';
import SessionItem from './SessionItem';
import './SessionList.less';

const CreateSession = createPureComponent(function(props){
    console.log('CreateSession');
    return (
        <div className="SessionItem CreateSession" onClick={()=>{props.onClick}}>
            <div className="SessionLogo">
                <div className="CreateSessionAvatar">
                    <div className="CreateSessionChar">+</div>
                </div>
            </div>
            <div className="SessionInfo">
                <div className="CreateSessionText">
                    发起新对话
                </div>
            </div>
        </div>
    );
});


class SessionList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCreateSession =()=>{

    };

    render() {
        var that = this;
        var {sessions, userAccounts} = this.props;
        return (
            <div className="SessionList">
                <CreateSession onClick={that.handleCreateSession} />
                {
                    sessions.map(function (session) {
                        var uid = session.get('uid');
                        var to_sid = session.get('to_sid');
                        var id = session.get('id');
                        var userAccount = userAccounts.get('' + to_sid);
                        return <SessionItem key={id} session={session} userAccount={userAccount}/>
                    })
                }
            </div>
        )
    }
}

export default RebixFlux.connect(SessionList, function (bigStore, props, context, connectState, that) {
    var sessions = getDeepValue(bigStore, 'sessionState.sessions');
    var userAccounts = getDeepValue(bigStore, 'userAccountState');
    return {
        sessions: sessions,
        userAccounts: userAccounts
    };
});