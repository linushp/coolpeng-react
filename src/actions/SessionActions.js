import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';

export default RebixFlux.createActions("session", {

    getSessionList: function () {
        var myUid = LoginStore.getUid();
        return SocketManager.sendSQLQuery('getSessionList', [myUid]);
    }

});