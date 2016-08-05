import {getLocalStorage,setLocalStorage} from '../core/utils/index';

import {
    LOGIN_PENDING,
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT_SUCCESS,
    FETCH_PROFILE_PENDING,
    FETCH_PROFILE_SUCCESS
} from '../actions/user';

const STATE_STORAGE_KEY = "user_state";

var oldState = getLocalStorage(STATE_STORAGE_KEY) || {};

const initialState = Object.assign({
    user: null,
    loggingShow:false,
    loggingIn: false,
    loggingOut: false,
    loginErrors: null
},oldState);

window.COOLPENG_USER_STATE = initialState;



function receiveUserInfo(state, response) {
    if (response.responseCode === 0) {
        var newState =  Object.assign({}, state, {user: response.data, loggingIn: false,loggingOut:false, loginErrors: null});
    } else {
        var newState =  Object.assign({}, state, {user: null, loggingIn: false, loggingOut:false,loginErrors: response.responseText});
    }
    setLocalStorage(STATE_STORAGE_KEY,newState);
    window.COOLPENG_USER_STATE = newState;
    return newState;
}



export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_PENDING:
            return Object.assign({}, initialState, {loggingIn: true});
        case LOGIN_SUCCESS:
            return receiveUserInfo(state, action.payload);
        case LOGIN_ERROR:
            return receiveUserInfo(state, {responseCode:10000,responseText:"未知错误"});
        case LOGOUT_SUCCESS:
            return receiveUserInfo(state, {responseCode:0,data:null});
        case FETCH_PROFILE_SUCCESS:
            return receiveUserInfo(state, action.payload);
        default:
            return state;
    }
}
