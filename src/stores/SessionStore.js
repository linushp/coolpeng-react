import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';

var LOCAL_STORAGE_KEY = "SessionStore";


//定义Record可以免去大量get set 方法的使用
const SessionStoreRecord = immutable.Record({
    'sessions': immutable.fromJS([]),
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
    var initialState = {};
    var json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (json) {
        initialState = JSON.parse(json);
    }
    return new SessionStoreRecord(initialState);
}


export default RebixFlux.createStore({

    forAction: "session",

    initialState: getInitialState(),

    'onGetMySessions': function (state, {payload, status}) {
        state = state.set('isLoadingSessions', status === 'pending');
        return state;
    }

});