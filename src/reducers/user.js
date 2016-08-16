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

var defaultInitState = {
    userInfo: {
        admin: false,
        avatar: "",
        createTime: "",
        createUserId: "1",
        id: 0,
        lastLoginDevPlatform: "browser",
        lastLoginDevUid: "",
        lastLoginTime: "",
        lastLoginToken: "",
        mail: "",
        nickname: "",
        permission: "",
        status: 0,
        updateTime: "",
        updateUserId: "",
        username: ""
    },

    isTempUser: false,
    isLogged: false,
    loggingShow: false,
    loggingIn: false,
    loggingOut: false,
    loginErrors: null
};

const initialState = Object.assign({}, defaultInitState, oldState);

window.COOLPENG_USER_STATE = initialState;


function receiveUserInfo(state, response) {
    if (response.responseCode === 0) {
        var newState = Object.assign({}, state, {
            userInfo: response.data,
            loggingIn: false,
            loggingOut: false,
            loginErrors: null,
            isLogged: true,
            isTempUser: false
        });
    } else {
        var newState = Object.assign({}, state, {
            userInfo: null,
            loggingIn: false,
            loggingOut: false,
            loginErrors: response.responseText
        });
    }
    setLocalStorage(STATE_STORAGE_KEY, newState);
    window.COOLPENG_USER_STATE = newState;
    return newState;
}


function receiveTempUserInfo(state, payload) {
    if (!payload) {
        return state;
    }
    var data = payload.data;
    if (!data) {
        return state;
    }
    var userInfo = {
        avatar: data.avatar,
        nickname: data.nickname,
        mail: data.email
    };
    var newState = Object.assign({}, state, {
        userInfo: userInfo,
        loggingIn: false,
        loggingOut: false,
        loginErrors: null,
        isLogged: true,
        isTempUser: true
    });
    setLocalStorage(STATE_STORAGE_KEY, newState);
    window.COOLPENG_USER_STATE = newState;
    return newState;
}

function receiveLogout(state) {
    var newState = Object.assign({}, state, defaultInitState);
    setLocalStorage(STATE_STORAGE_KEY, newState);
    window.COOLPENG_USER_STATE = newState;
    return newState;
}

export default function auth(state = initialState, action = {}) {
    switch (action.type) {
        case LOGIN_PENDING:
            return Object.assign({}, state, {loggingIn: true});
        case LOGIN_SUCCESS:
            return receiveUserInfo(state, action.payload);
        case LOGIN_ERROR:
            return receiveUserInfo(state, {responseCode: 10000, responseText: "未知错误"});
        case LOGOUT_SUCCESS:
            return receiveLogout(state, {responseCode: 0, data: null});
        case FETCH_PROFILE_SUCCESS:
            return receiveUserInfo(state, action.payload);
        case 'LOGIN_TEMP_USER':
            return receiveTempUserInfo(state, action.payload);
        default:
            return state;
    }
}
