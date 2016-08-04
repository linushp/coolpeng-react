import api from './api'


function createCloudRestAction(prefix, funcName) {
    return function (data, callback) {
        return {
            type: prefix + '_' + funcName,
            payload: {
                promise: api.post('/cloud/' + prefix + '/' + funcName + '.json', data)
            },
            meta: {
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