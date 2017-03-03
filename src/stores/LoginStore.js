import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import immutable from 'immutable';


const LOCAL_STORAGE_KEY = "LoginStore";

//定义Record可以免去大量get set 方法的使用
const UserInfoRecord = immutable.Record({
    'id': null,
    'token': null,
    'email': null,
    'nickname': null
});

function getInitialState() {
    var initialState = {};
    var json = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (json) {
        initialState = JSON.parse(json);
    }
    return new UserInfoRecord(initialState);
}


export default RebixFlux.createStore({

    forAction: "login",
    initialState: getInitialState(),

    /**
     * 登录操作
     */
    'onDoLogin': function (state, {status,payload}) {
        if (status === 'success') {
            state = state.merge(payload);
            var json = JSON.stringify(state.toJS());
            localStorage.setItem(LOCAL_STORAGE_KEY, json);
        }
        return state;
    },


    /**
     * 退出操作
     */
    'onDoLogout': function () {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return getInitialState();
    },

    /**
     * 是否已登录
     */
    'isLoggedIn': function () {
        var state = this.state;
        return !!state.get('id');
    },

    /**
     * 当前登录用户ID
     */
    'getUid': function () {
        var state = this.state;
        return state.get('id');
    },

    /**
     * 当前登录用户其他信息
     */
    'getUserInfo': function () {
        return this.state;
    }

});