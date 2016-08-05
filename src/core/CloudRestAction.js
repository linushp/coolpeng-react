import api from './api'


function createCloudRestAction(prefix, funcName) {

    return function (data, callback) {
        var url = '/cloud/' + prefix + '/' + funcName + '.json';
        var type = prefix + '_' + funcName;
        return {
            type: prefix + '_' + funcName,
            payload: {
                promise: api.post(url, data)
            },
            meta: {
                reqData: data,
                reqUrl: url,
                reqType: type,
                actionSourceCallback: callback
            }
        }
    }
}

export default class CloudRestAction {
    constructor(prefix, funcNameList) {
        var that = this;
        for (var i = 0; i < funcNameList.length; i++) {
            var funcName = funcNameList[i];
            that[funcName] = createCloudRestAction(prefix, funcName);
        }
    }
}