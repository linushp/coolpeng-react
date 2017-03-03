import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';
import {getMySessions} from '../api/SessionApi';

export default RebixFlux.createActions("session", {

    getMySessions: function () {
        var myUid = LoginStore.getUid();
        return getMySessions(myUid);
    }

});