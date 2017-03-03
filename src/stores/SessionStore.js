import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';

var LOCAL_STORAGE_KEY = "SessionStore";
export default RebixFlux.createStore({

    forAction: "session",

    initialState: (function () {
        var initialState = {
            sessionList: []
        };
        var json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (json) {
            initialState = JSON.parse(json);
        }
        return immutable.fromJS(initialState);
    })(),


    'onGetMySessions': function (state, {payload, status}) {
        if (status === 'success') {
            debugger;
        }
        return state;
    }

});