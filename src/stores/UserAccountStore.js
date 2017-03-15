import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const keys = RebixUtils.keys;
const forEach = RebixUtils.forEach;
import immutable from 'immutable';


//定义Record可以免去大量get set 方法的使用
const UserAccountRecord = immutable.Record({
    'id': null,
    'token': null,
    'email': null,
    'nickname': null,
    'avatar': null,
    'isOnline': false,
    'lastLoginTime': 0
});

function onReceiveUserAccountArrayResult(state, status, payload) {
    if (status === 'success') {

        var onLineUidMap = state.get('onLineUidMap');
        var userAccountMap = state.get('userAccountMap');

        var result = payload || [];
        forEach(result, function (painUserAccount) {
            var uid = painUserAccount.id;
            var isOnline = onLineUidMap.get('U' + uid);
            painUserAccount.isOnline = !!isOnline;
            var userAccountRecord = new UserAccountRecord(painUserAccount);
            userAccountMap = userAccountMap.set('U' + uid, userAccountRecord);
        });

        state = state.set('userAccountMap',userAccountMap);
    }
    return state;
}


function refreshUserAccountOnlineState(state) {

    var onLineUidMap = state.get('onLineUidMap');


    //1. refresh Map
    var userAccountMap = state.get('userAccountMap');
    var allUserIdList = userAccountMap.keys();
    forEach(allUserIdList, function (uuid) {
        var userAccount = userAccountMap.get(uuid);
        if (userAccount) {
            var oldIsOnline = userAccount.get('isOnline');
            var newIsOnline = !!onLineUidMap.get(uuid);
            if (oldIsOnline !== newIsOnline) {
                userAccount = userAccount.set('isOnline', newIsOnline);
                userAccountMap = userAccountMap.set(uuid, userAccount);
            }
        }
    });


    //2.refresh List
    var userAccountTopList = state.get('userAccountTopList');
    forEach(userAccountTopList, function (userAccount, idx) {
        var uuid = 'U' + userAccount.get('id');
        var oldIsOnline = userAccount.get('isOnline');
        var newIsOnline = !!onLineUidMap.get(uuid);
        if (oldIsOnline !== newIsOnline) {
            userAccount = userAccount.set('isOnline', newIsOnline);
            userAccountTopList = userAccountTopList.set(idx, userAccount);
        }
    });


    state = state.set('userAccountTopList', userAccountTopList);
    state = state.set('userAccountMap', userAccountMap);

    return state;
}


export default RebixFlux.createStore({

    'forAction': "user_account",

    'initialState': immutable.fromJS({
        onLineUidMap: {},
        userAccountMap: {},
        userAccountTopList: []
    }),

    'onGetUserByUidInList': function (state, {status, payload}) {
        return onReceiveUserAccountArrayResult(state, status, payload);
    },


    'onGetOnLineUidList': function (state, {status, payload}) {
        if (status === 'success') {
            var uidList = payload || [];
            var onLineUidMap = state.get('onLineUidMap');

            forEach(uidList, function (uid) {
                onLineUidMap = onLineUidMap.set('U' + uid, true);
            });

            state = state.set('onLineUidMap', onLineUidMap);
            state = refreshUserAccountOnlineState(state);
        }
        return state;
    },

    'onGetTopUserListByTimeDesc': function (state, {status, payload}) {
        state = onReceiveUserAccountArrayResult(state, status, payload);

        if (status === 'success') {
            var onLineUidMap = state.get('onLineUidMap');

            var userAccountTopList = immutable.fromJS([]);
            forEach(payload || [], function (painUserAccount) {
                var uid = painUserAccount.id;
                var isOnline = onLineUidMap.get('U' + uid);
                painUserAccount.isOnline = !!isOnline;
                var userAccountRecord = new UserAccountRecord(painUserAccount);
                userAccountTopList = userAccountTopList.push(userAccountRecord);
            });

            state = state.set('userAccountTopList', userAccountTopList);
        }

        return state;
    },


    'getUserAccountTopList':function(){
        var state = this.state;
        return state.get('userAccountTopList');
    }


});