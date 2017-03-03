import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import createToken from '../utils/createToken';
import LoginStore from '../stores/LoginStore';

import {createUserAccount,getUserCountByEmail,getUserByEmailAndPassword,updateUserToken,deleteUserToken} from '../api/UserApi';

export default RebixFlux.createActions("login", {


    /**
     * 新用户注册
     * @param values
     * @returns {Promise.<T>}
     */
    addUserAccount: function (values) {
        var countPromise = getUserCountByEmail(values['email']);
        return countPromise.then(function (count) {
            if (count > 0) {
                //用户已存在
                return Promise.resolve('email_exist');
            } else {
                return createUserAccount(values);
            }
        });
    },


    /**
     * 执行登录过程
     * @param email
     * @param password
     */
    doLogin :function({email,password}){
        return getUserByEmailAndPassword(email,password)
            .then(function(users){
                if(users && users.length > 0){
                    var token = createToken();
                    return updateUserToken(token, email, password).then(function(changedRows){
                        if(changedRows){
                            var user =  users[0];
                            user.token = token;
                            return user;
                        }else {
                            return Promise.reject('login_err_update_e');
                        }
                    });
                }else {
                    return Promise.reject('login_err_no_user');
                }
            });
    },


    doLogout: function () {
        var {id,token} = LoginStore.getUserInfo();
        return deleteUserToken(id,token);
    }



});