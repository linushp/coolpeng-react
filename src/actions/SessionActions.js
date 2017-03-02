import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import MyWebSocket from '../utils/MyWebSocket';

export default RebixFlux.createActions("session", {

    getSessionList: function () {
        var {LoginStore} = RebixUtils.setServices();
        var myUid = LoginStore.getUid();
        return MyWebSocket.sendSQLQuery('getSessionList', [myUid]);
    }

});