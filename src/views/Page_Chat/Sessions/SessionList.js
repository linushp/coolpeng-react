import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
import SessionStore from '../../../stores/SessionStore';
import UserAccountStore from '../../../stores/UserAccountStore';
import SessionItem from './SessionItem';

class SessionList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var {sessions, userAccounts} = this.props;
        return (
            <div className="SessionList">
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
    var sessionState = bigStore.sessionState || {};
    return {
        sessions: sessionState.sessions,
        userAccounts: bigStore.userAccountState
    };
});

// export default RebixFlux.connect(SessionList, [SessionStore, UserAccountStore], function ([sessionState,userAccountState], props, context, connectState, that) {
//     // var sessionState = bigStore.sessionState || {};
//     // var userAccountState = bigStore.userAccountState;
//
//     return {
//         sessions: sessionState.sessions,
//         userAccounts: userAccountState
//     };
// });