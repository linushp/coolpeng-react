import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import {createUserAccount,getUserCountByEmail} from '../api/UserApi';

export default RebixFlux.createActions("session", {

    addUserAccount: async function (values) {
        var count = await getUserCountByEmail(values['email']);
        if(count > 0){
            alert("不能注册");
            return Promise.resolve();
        }else {
            return createUserAccount(values);
        }
    }

});