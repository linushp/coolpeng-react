import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const keys = RebixUtils.keys;
const forEach = RebixUtils.forEach;
import immutable from 'immutable';


//定义Record可以免去大量get set 方法的使用
const SessionStoreRecord = immutable.Record({
    'sessions': new immutable.List([]),
    'isLoadingSessions': false
});

const SessionRecord = immutable.Record({
    'id': null,
    'uid': null,
    'session_type': null,
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
            forEach(payload || [], function (painSession) {
                var sessionRecord = new SessionRecord(painSession);
                sessionsState = sessionsState.push(sessionRecord);
            });
            state = state.set('sessions', sessionsState);
        }
        state = state.set('isLoadingSessions', status === 'pending');
        return state;
    }

});