import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';
import {getUserByUidInList,getOnLineUidList} from '../api/UserApi';

export default RebixFlux.createActions("user_account", {

    getUserByUidInList: function (uidArray) {
        return getUserByUidInList(uidArray);
    },


    getOnLineUserList: function () {
        return getOnLineUidList().then(function(uidArray){
            return getUserByUidInList(uidArray);
        });
    }

});