import api from './api';
import {isString,isObject} from './utils/index';


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



function createCloudRestActionByObj(prefix, funObj){
    return function (data, callback, reqSeqId) {
        var url = funObj.url;
        var funcNameString = funObj.name;
        var method = (funObj.method || '').toUpperCase();
        var validateCallback = funObj.validateCallback;

        var type = prefix + '_' + funcNameString;
        data = data || {};
        var $$URL_PARAMS$$ = data.$$URL_PARAMS$$ || {};
        return {
            type: type,
            payload: {
                promise: (method === 'GET') ? api.ajaxGet(url, $$URL_PARAMS$$,validateCallback) : api.post(url, data)
            },
            meta: {
                reqData: data,
                reqUrl: url,
                reqType: type,
                reqActionPrefix: prefix,
                reqActionFuncName: funcNameString,
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
            if(isString(funcName)){
                that[funcName] = createCloudRestAction(prefix, funcName);
            }else if(isObject(funcName)){
                var funcNameStr = funcName.name;
                that[funcNameStr] = createCloudRestActionByObj(prefix, funcName);
            }
        }

        if (staticFunc && staticFunc.length > 0) {
            for (var j = 0; j < staticFunc.length; j++) {
                var funcName2 = staticFunc[j];
                that[funcName2] = createCloudStaticAction(prefix, funcName2);
            }
        }
    }
}