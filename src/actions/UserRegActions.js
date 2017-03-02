import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import MyWebSocket from '../utils/MyWebSocket';

export default RebixFlux.createActions("session", {

    addUserAccount: function (values) {
        return MyWebSocket.sendSQLQuery('addUserAccount', [myUid]);
    }

});