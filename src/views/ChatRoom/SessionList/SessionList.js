import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {
    immutableListMap
} from '../../../core/utils/index';
import "./SessionList.less";

class SessionItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {

        var {session,currentSession,onSwitchSession} = this.props;//isImmutable
        var isCurrent = currentSession===session;
        var s = session.toJS();
        var sessionIcon = s.sessionIcon;
        return (
            <div>
                <div className={`item item-current-${isCurrent}`} onClick={()=>onSwitchSession(session,s)} data-id={s.sessionId}
                     data-eid={s.entityId} data-type={s.sessionType}>
                    <img className="avatar" src={sessionIcon} alt={s.sessionTitle}/>
                    <div className="content">
                        <div className="title">{s.sessionTitle}</div>
                        <div className="msg">{s.lastMsgText}</div>
                    </div>
                </div>
            </div>
        );
    }
}


export default class SessionList extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var props = this.props;
        var sessionList = props.sessionList;//isImmutable
        var onSwitchSession = props.onSwitchSession;
        var currentSession = props.currentSession;
        return (
                <div className="chat-session-list">
                    <div className="clear2"></div>
                    {immutableListMap(sessionList, function (session) {
                        var sessionId = session.sessionId;
                        return <SessionItem key={sessionId} session={session}
                                            currentSession={currentSession}
                                            onSwitchSession={onSwitchSession}></SessionItem>
                    })}
                </div>
        );
    }
}