import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const map = RebixUtils.map;

import LoginStore from '../stores/LoginStore';
import SessionStore from '../stores/SessionStore';
import {getMySessions} from '../api/SessionApi';
import {getPublicChatList} from '../api/PublicChatApi';


function toPublicChartSession(publicChatList){
    return map(publicChatList,function(pc){
        return {
            'uid': null,
            'session_id': "P" + pc.id, //这才是真正的session_id
            'session_type': 3, // 1 代表p2p消息 . 2 代表群组消息. 3代表公共会话
            'session_name': pc['topic'],
            'session_avatar': pc['avatar'],
            'to_sid': pc.id,
            'last_time': null
        }
    });
}


export default RebixFlux.createActions("session", {

    getMySessions: function () {
        var myUid = LoginStore.getUid();
        return getMySessions(myUid).then(function(sessionList){
            return getPublicChatList().then(function(publicChatList){
                var publicChartSession = toPublicChartSession(publicChatList || []);
                var result = [];
                result = result.concat(publicChartSession);
                result = result.concat(sessionList);
                return result;
            });
        });
    },

    selectSession: function ({to_sid, session_type}, createSessionIfNotExist = true) {
        var session = SessionStore.getSessionBySidNdType(to_sid, session_type);
        if (!session) {
            //TODO
        }
        return Promise.resolve(session.session_id);
    }

});