import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import UserAvatar from '../../../components/UserAvatar/UserAvatar';
import SessionActions from '../../../actions/SessionActions';


const LastMsgTime = createPureComponent(function (props) {
    return (
        <div className="LastMsgTime">
        </div>
    );
});

const LastMsg = createPureComponent(function (props) {
    return (
        <div className="LastMsg">
        </div>
    );
});

function getSessionLogo(session, userAccount) {
    if (!userAccount) {
        return '';
    }
    return userAccount.avatar;
}

function getSessionName(session, userAccount) {
    if (!userAccount) {
        return '';
    }
    return userAccount.nickname;
}

export default class SessionItem extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSessionSelect = ()=> {
        var that = this;
        var {session} = that.props;
        SessionActions.selectSession(session);
    };

    render() {
        var that = this;
        var {session,userAccount,selSessionId} = that.props;
        var sessionLogo = getSessionLogo(session, userAccount);
        var sessionName = getSessionName(session, userAccount);
        var sessionId = session.get('id');
        var isSelectedItem = (selSessionId === sessionId) ? 'isSelectedItem' : '';
        return (
            <div className={`SessionItem ${isSelectedItem}`} onClick={that.handleSessionSelect}>
                <div className="SessionLogo">
                    <UserAvatar className="session-logo" avatar={sessionLogo} size={40}/>
                </div>
                <div className="SessionInfo">
                    <div className="sessionName">{sessionName}</div>
                    <LastMsgTime />
                    <LastMsg />
                </div>
            </div>
        )
    }
}