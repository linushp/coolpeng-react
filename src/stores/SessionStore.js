import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const keys = RebixUtils.keys;
const forEach = RebixUtils.forEach;
import immutable from 'immutable';


//定义Record可以免去大量get set 方法的使用
const SessionStoreRecord = immutable.Record({
    'sessions': new immutable.fromJS([/*SessionRecord*/]),
    'sessionsMap': new immutable.fromJS({/*key:sessionId, value:SessionRecord */}),
    'selSessionId': null,
    'isLoadingSessions': false
});

const SessionRecord = immutable.Record({
    'id': null, //SessionId 这就是
    'uid': null,
    'session_type': null, // 1 代表p2p消息 . 2 代表群组消息.
    'session_name': null,
    'to_sid': null,
    'last_time': null
});

function getInitialState() {
    return new SessionStoreRecord();
}


export default RebixFlux.createStore({

    forAction: "session",

    initialState: getInitialState(),

    'onGetMySessions': function (state, {status, payload}) {
        if (status === 'success') {
            var sessionsState = state.get('sessions');
            var sessionsMap = state.get('sessionsMap');
            forEach(payload || [], function (painSession) {
                var sessionId = painSession.id;
                var sessionRecord = new SessionRecord(painSession);
                sessionsState = sessionsState.push(sessionRecord);
                sessionsMap = sessionsMap.set(sessionId, sessionRecord);
            });
            state = state.set('sessions', sessionsState);
            state = state.set('sessionsMap', sessionsMap);
        }
        state = state.set('isLoadingSessions', status === 'pending');
        return state;
    },

    'onSelectSession': function (state, {status, payload}) {
        if (status === 'success') {
            var selSessionId = payload;
            state = state.set('selSessionId', selSessionId);
        }
        return state;
    },

    'getSessionBySidNdType': function (to_sid, session_type) {
        var state = this.state;
        var sessionsState = state.get('sessions');
        var result = null;
        sessionsState.forEach(function (session) {
            if (session.to_sid === to_sid && session.session_type === session_type) {
                result = session;
            }
        });
        return result;
    }

});