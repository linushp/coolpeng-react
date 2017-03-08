import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import LoginStore from '../stores/LoginStore';
import SessionStore from '../stores/SessionStore';
import {getMySessions} from '../api/SessionApi';

export default RebixFlux.createActions("session", {

    getMySessions: function () {
        var myUid = LoginStore.getUid();
        return getMySessions(myUid);
    },

    selectSession: function ({to_sid, session_type}, createSessionIfNotExist = true) {
        var session = SessionStore.getSessionBySidNdType(to_sid, session_type);
        if (!session) {
            //TODO
        }
        return Promise.resolve(session.id);
    }

});