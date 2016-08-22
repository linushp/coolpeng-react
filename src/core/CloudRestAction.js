import api from './api'


function createCloudRestAction(prefix, funcName) {

    return function (data, callback, reqSeqId) {
        var url = '/cloud/' + prefix + '/' + funcName + '.json';
        var type = prefix + '_' + funcName;
        return {
            type: type,
            payload: {
                promise: api.post(url, data)
            },
            meta: {
                reqData: data,
                reqUrl: url,
                reqType: type,
                reqActionPrefix: prefix,
                reqActionFuncName: funcName,
                reqSeqId: reqSeqId || '',
                actionSourceCallback: callback
            }
        }
    }
}


function createCloudStaticAction(prefix, funcName) {
    return function (data) {
        return {
            type: prefix + '_' + funcName,
            payload: {
                data: data
            },
            meta: {
                reqActionPrefix: prefix
            }
        }
    }
}


export default class CloudRestAction {
    constructor(prefix, funcNameList, staticFunc) {
        var that = this;
        for (var i = 0; i < funcNameList.length; i++) {
            var funcName = funcNameList[i];
            that[funcName] = createCloudRestAction(prefix, funcName);
        }

        if (staticFunc && staticFunc.length > 0) {
            for (var j = 0; j < staticFunc.length; j++) {
                var funcName2 = staticFunc[j];
                that[funcName2] = createCloudStaticAction(prefix, funcName2);
            }
        }
    }
}