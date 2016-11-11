import objectForEach from './utils/objectForEach';


function createActionImplWrapper(actionImpl, key, actionsConfig) {
    //ActionImplWrapper
    //这是真正被调用的action函数
    return function (group, args) {
        //var args = [].concat(arguments);
        var actionResult = actionImpl.apply(actionsConfig, args);
        return {
            type: group + "_" + key,
            group: group, //例如:user或post,是在createConfigure中配置的..这个玩意只有完成createConfigure之后才能知道,所以需要从参数中传过来
            name: key, //例如:getUserList
            status: "unknown",//pending,error,success
            args: args,
            payload: actionResult //object or promise
        }
    };
}


export default function createActions(actionsConfig) {
    var actions = {};

    objectForEach(actionsConfig, function (key, actionImpl) {
        //这是真正被调用的action函数
        actions[key] = createActionImplWrapper(actionImpl, key, actionsConfig);
    });


    return actions;
}