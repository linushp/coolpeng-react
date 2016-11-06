import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {immutableListMap,StringUtils,shallowEqual,getObjValueInPath} from '../../../core/utils/index';
import {showStyle} from '../../../core/utils/JSXRenderUtils';
import "./SessionList.less";

class SessionItem extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    onDeleteSession(e){
        var {session,onDeleteSession} = this.props;//isImmutable
        var s = session.toJS();
        onDeleteSession(session,s);
    }


    render() {
        //console.log("SessionItem");
        var that = this;
        var {session,isCurrent,onSwitchSession,onDeleteSession,nowTime} = that.props;//isImmutable
        var s = session.toJS();
        var sessionIcon = s.sessionIcon;
        var isPeerChat = s.sessionType ==='peer';
        var timeDisplayString = StringUtils.toPrettyString(s.lastMsgTimeMillis,null,nowTime);
        var unReadCount = s.unReadCount || 0;
        if(unReadCount>=99){
            unReadCount = 99;
        }
        return (
            <div className ={`itemWrapper itemWrapper-${isCurrent}`}>
                <div className="onDeleteSession" style={showStyle(isPeerChat)} onClick={that.onDeleteSession.bind(that)}>×</div>
                <div className="onDeleteSessionDisable" style={showStyle(!isPeerChat)} ></div>
                <div className={`item item-current-${isCurrent}`} onClick={()=>onSwitchSession(session,s)} data-id={s.sessionId}
                     data-eid={s.entityId} data-type={s.sessionType}>
                    <img className="avatar" src={sessionIcon} alt={s.sessionTitle}/>
                    <div className="content">
                        <div className="lastMsgTimeMillis">{timeDisplayString}</div>
                        <div className="title">{s.sessionTitle}</div>
                        <div className="msg">{s.lastMsgText}</div>
                        <div className="unReadCount" style={showStyle(unReadCount>0)}>{unReadCount}</div>
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
        var onDeleteSession = props.onDeleteSession;
        var currentSessionId = props.currentSessionId;
        var nowTime = props.nowTime;

        return (
                <div className="chat-session-list">
                    <div className="clear2"></div>
                    {immutableListMap(sessionList, function (session) {
                        var sessionId = getObjValueInPath(session,"sessionId");
                        var isCurrent = (sessionId === currentSessionId);
                        return <SessionItem key={sessionId} session={session}
                                            nowTime={nowTime}
                                            isCurrent={isCurrent}
                                            onDeleteSession={onDeleteSession}
                                            onSwitchSession={onSwitchSession}></SessionItem>

                    })}
                </div>
        );
    }
}