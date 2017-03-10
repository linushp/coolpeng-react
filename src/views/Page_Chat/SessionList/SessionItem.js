import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import UserAvatar from '../../../components/UserAvatar/UserAvatar';
import SessionActions from '../../../actions/SessionActions';
var formatDatePretty = RebixUtils.formatDatePretty;
var ServerTimeUtils = RebixUtils.ServerTimeUtils;

import {scrollMessageListToBottom} from '../ChattingPageUtils';



const LastMsgTime = createPureComponent(function (props) {
    var {lastMsg} = props;
    var nowTime = ServerTimeUtils.getServerTimeNow();
    return (
        <div className="LastMsgTime">
            {lastMsg && formatDatePretty(lastMsg.time,nowTime)}
        </div>
    );
});

const LastMsg = createPureComponent(function (props) {
    var {lastMsg} = props;
    return (
        <div className="LastMsg">
            {lastMsg && lastMsg.msg_content}
        </div>
    );
});

function getSessionLogo(session, userAccount) {
    if (!userAccount) {
        return session.session_avatar;
    }
    return userAccount.avatar;
}

function getSessionName(session, userAccount) {
    if (!userAccount) {
        return session.session_name;
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
        SessionActions.selectSession(session).then(function(){
            scrollMessageListToBottom();
        });
    };

    render() {
        var that = this;
        var {session,userAccount,selSessionId,lastMsg} = that.props;
        var sessionLogo = getSessionLogo(session, userAccount);
        var sessionName = getSessionName(session, userAccount);
        var sessionId = session.get('session_id');
        var isSelectedItem = (selSessionId === sessionId) ? 'isSelectedItem' : '';
        return (
            <div className={`SessionItem ${isSelectedItem}`} onClick={that.handleSessionSelect}>
                <div className="SessionLogo">
                    <UserAvatar className="session-logo" avatar={sessionLogo} size={40}/>
                </div>
                <div className="SessionInfo">
                    <div className="sessionName">{sessionName}</div>
                    <LastMsgTime lastMsg={lastMsg}/>
                    <LastMsg lastMsg={lastMsg} />
                </div>
            </div>
        )
    }
}