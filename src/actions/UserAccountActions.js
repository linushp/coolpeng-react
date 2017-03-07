import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';
import {getUserByUidInList} from '../api/UserApi';

export default RebixFlux.createActions("user_account", {

    getUserByUidInList: function (uidArray) {
        return getUserByUidInList(uidArray);
    }

});