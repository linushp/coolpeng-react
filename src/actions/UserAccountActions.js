import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';
import {getUserByUidInList,getOnLineUidList,getUserListByTimeDescLimit} from '../api/UserApi';

export default RebixFlux.createActions("user_account", {

    'getUserByUidInList': function (uidArray) {
        return getUserByUidInList(uidArray);
    },

    'getOnLineUidList': function () {
        return getOnLineUidList();
    },

    'getTopUserListByTimeDesc': function () {
        return getUserListByTimeDescLimit(0, 100);
    }

});