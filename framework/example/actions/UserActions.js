import Reubibi from '../../reubibi/src/index';
import UserStore from '../stores/UserStore';

export default Reubibi.createActions({

    /**
     * 异步 Action
     * 一定要返回一个Promise对象
     */
    getUserInfo: function (params) {

        //Action 中开源访问Store中的数据,但是只能调用get方法
        var userInfo = UserStore.getUserInfo(123);

        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve({
                    time: new Date().getTime(),
                    userInfo: userInfo,
                    params: params
                });
            }, 1000)
        })
    },


    /**
     * 普通 Action
     */
    getUserList: function (params) {
        return [1, 2, 3, params];
    }


});