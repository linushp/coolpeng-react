const STATE_SUFFIX_LIST = ['PENDING', 'SUCCESS', 'ERROR'];

export default function CloudRestReducer(config) {

    var initialState = config.initialState || {};
    var switchRestType = config.switchRestType || {};
    var switchRestPrefix = config.switchRestPrefix;

    /**
     *
     * @param actionType 严格的三段形式,如果不是自己处理,就返回null
     * @returns {*}
     */
    function getReducer(actionType) {

        var typeArr = actionType.split("_");//daohang   insert   SUCCESS

        var prefix = typeArr[0];
        var restName = typeArr[1];
        var restState = typeArr[2];

        //后台处理的操作
        if (typeArr.length === 3) {
            if (prefix === switchRestPrefix) {
                var func = switchRestType[restName];
                if (func && containSuffix(restState)) {
                    return [func, createRestState(restState)];
                }
            }
        }


        //对于不需要后台处理的操作
        if (typeArr.length === 2) {
            if (prefix === switchRestPrefix) {
                var func = switchRestType[restName];
                if (func) {
                    return [func,createRestState(STATE_SUFFIX_LIST[1])];
                }
            }
        }

        return [null, null];
    }


    function containSuffix(suffix) {
        for (var i = 0; i < STATE_SUFFIX_LIST.length; i++) {
            if (suffix === STATE_SUFFIX_LIST[i]) {
                return true;
            }
        }
        return false;
    }

    function createRestState(restStateStr) {
        return {
            isPending: function () {
                return restStateStr === STATE_SUFFIX_LIST[0];
            },
            isSuccess: function () {
                return restStateStr ===  STATE_SUFFIX_LIST[1];
            },
            isError: function () {
                return restStateStr ===  STATE_SUFFIX_LIST[2];
            }
        }
    }


    return function (state = initialState, action = {}) {
        var [reducer,restState] = getReducer(action.type);
        if (reducer) {
            var newState = reducer(state, action.payload, restState, action.meta);
            if(newState){
                return newState;
            }
        }
        return state;
    }
}