import RebixFlux from 'react-rebixflux';
import immutable from 'immutable';

var LOCAL_STORAGE_KEY = "LoginStore";
export default RebixFlux.createStore({

    forAction: "login",

    initialState: (function () {
        var initialState = {
            uid: null,
            token: null
        };
        var json = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (json) {
            initialState = JSON.parse(json);
        }
        return immutable.fromJS(initialState);
    })(),


    'isLoggedIn': function () {
        var state = this.state;
        return !!state.uid;
    }

});