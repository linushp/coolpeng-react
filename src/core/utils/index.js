import EventBus from './EventBus';
import GlobalEventName from './GlobalEventName';
import StringUtils from './StringUtils';
import JSXRenderUtils from './JSXRenderUtils';
import StaticConfig from './StaticConfig';
import $ from 'jquery';
import _ from 'underscore';
import {initUnderscoreMixin} from './underscore.mixin.js';

var win = window;
var _undefined = win.undefined;
var Math = win.Math;

exports.GlobalEventName = GlobalEventName;
exports.EventBus = EventBus;
exports.StringUtils = StringUtils;
exports._undefined = _undefined;
exports.JSXRenderUtils = JSXRenderUtils;
exports.StaticConfig = StaticConfig;


export function uniqueId(prefix) {
    return _.uniqueId(prefix);
}

export function getStaticImages(p){
    //http://image.coolpeng.cn/static
    return StaticConfig.STATIC_FOLDER_PATH + "/images/" + p;
}

export function isPromise(value) {
    if (value !== null && typeof value === 'object') {
        return value.promise && typeof value.promise.then === 'function';
    }
}

export function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

export function getLocalStorage(name) {
    var value = window.localStorage.getItem(name);
    if (value) {
        return JSON.parse(value);
    }
    return null;
}


export function setLocalStorage(name, value) {
    if (value) {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(name, value);
}


export function toQueryParam(paramObject) {
    paramObject = paramObject || {};
    var keys = Object.getOwnPropertyNames(paramObject) || [];

    var paramArray = keys.map(function (key, i) {
        var value = paramObject[key];
        return key + "=" + encodeURIComponent(value);
    });

    if (paramArray && paramArray.length > 0) {
        return "?" + paramArray.join("&");
    }

    return "";
}


/**
 * 对于文章来说,唯一确定一篇文章有两种方法:
 * 1.文章表中的id字段
 * 2.userId + guid 共同确定(同一时刻用户只能在一个终端登录,guid并且是根据时间生成,再随机,所以guid是安全的)
 * @returns {string}
 */
export function createUUID(userId) {
    var randomStr = 'xxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });

    userId = userId ? (userId + '-') : '';
    return userId + randomStr + uniqueId() + '' + new Date().getTime();
}


//export function getStaticURL(p){
//  return "http://image.coolpeng.cn/static/" + p;
//}

export function getDataFromImmutableOrPlain(obj, key) {
    if (!obj) {
        return null;
    }
    var value = _undefined;
    if (isFunction(obj.get)) {
        value = obj.get(key);
    }
    if (value === _undefined) {
        value = obj[key];
    }

    return value;
}


export function setData(obj, key, value) {
    if (!obj) {
        return null;
    }
    if (isFunction(obj.set)) {
        obj = obj.set(key, value);
    }
    else {
        obj[key] = value;
    }
    return obj;
}

export function isImmutable(obj) {
    if (isFunction(obj.set) &&
        isFunction(obj.get) &&
        isFunction(obj.toJS)) {
        return true;
    }
    return false;
}

/**
 * a = {
 *   b:{
 *      c:{
 *          d:1
 *      }
 *   }
 * }
 *
 * str : b.c.d
 * @param obj
 * @param str
 * @demo :
 *  var d = getObjectValue(a,'b.c.d');
 */
export function getObjValueInPath(obj, str) {
    if(!obj){
        return null;
    }
    try {
        var propArr = str.split(".");
        var tmpObj = obj;
        var i = 0;
        while (i < propArr.length) {
            if (!tmpObj) {
                return null;
            }
            var prop = propArr[i];
            tmpObj = getDataFromImmutableOrPlain(tmpObj, prop);
            i++;
        }
        return tmpObj;
    } catch (e) {
        console.log('[ERROR]', e);
    }

    return null;
}

export function isType(x, type) {
    return Object.prototype.toString.call(x) === '[object ' + type + ']';
}

export function isFunction(x) {
    return isType(x, 'Function');
}

export function isString(x) {
    return isType(x, 'String');
}

export function isArray(x) {
    return isType(x, 'Array');
}

export function isObject(x) {
    return isType(x, 'Object');
}

export function isNumber(x) {
    return isType(x, 'Number');
}

export function isEmpty(x) {
    if (!x) {
        return true;
    }

    if (isFunction(x.isEmpty)) {
        return x.isEmpty();
    }

    if (!isFunction(x.toJS) && x.length === 0) {
        return true;
    }

    return false;
}

export function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    if (typeof objA !== 'object' || objA === null ||
        typeof objB !== 'object' || objB === null) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    // Test for A's keys different from B.
    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
    for (var i = 0; i < keysA.length; i++) {
        if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
    }

    return true;
}


export function isAdmin(u) {
    u = u || getCurrentUser();
    if (u.permission === 'admin') {
        return true;
    }
    if (u.userInfo && u.userInfo.permission === 'admin') {
        return true
    }
    return false;
}


export function getCurrentUser(){
    var userState = window.COOLPENG_USER_STATE || {};
    var userInfo = userState.userInfo || {};
    return userInfo;
}

export function displayControl(isDisplay, component) {
    if (isDisplay) {
        return component;
    }
    return null;
}

var loadStaticCache = {};
export function loadStaticJS(url, callback) {

    if (loadStaticCache[url]) {
        callback(false);
        return;
    }

    var script = document.createElement("script");
    script.src = url;
    script.type = 'text/javascript';
    script.language = 'javascript';
    script.onload = script.onreadstatechange = function () {
        callback(true);
        loadStaticCache[url] = true;
    };
    document.getElementsByTagName("body")[0].appendChild(script);
}


export function loadStaticCSS(url, callback) {

    if (loadStaticCache[url]) {
        callback(false);
        return;
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.onload = link.onreadstatechange = function () {
        callback(true);
        loadStaticCache[url] = true;
    };
    document.getElementsByTagName("head")[0].appendChild(link);
}


export function immutableListMap(itemList, callback) {
    var resultList = [];
    if (itemList) {
        itemList.forEach(function (item, i) {
            resultList.push(callback(item, i));
        });
    }
    return resultList;
}

export function listMap(itemList, callback) {
    if (!itemList) {
        return [];
    }

    if (itemList.map) {
        return itemList.map(callback);
    } else {
        var resultList = [];
        if (itemList) {
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];
                resultList.push(callback(item, i));
            }
        }
        return resultList;
    }
}


export function isImmutableObjHasKV(immutableObj, finderObject) {
    if (isFunction(finderObject)) {
        return finderObject(immutableObj);
    }
    else {
        for (var k in finderObject) {
            if (finderObject.hasOwnProperty(k)) {
                var v = finderObject[k];
                var iValue = immutableObj.get(k);
                if (v !== iValue) {
                    return false;
                }
            }
        }
        return true;
    }
}


/**
 * 更新一个Immutable对象中复合条件的子对象.
 * @param origin Map 或 List
 * @param finderObject 条件对象或函数
 * @param newData 对象或函数.将复合条件的对象替换为新的对象.
 * @returns {*}
 */
export function updateImmutableObject(origin, finderObject, newData) {
    var Immutable = window.Immutable;
    var Map = Immutable.Map;
    var List = Immutable.List;
    if (Map.isMap(origin)) {
        if (isImmutableObjHasKV(origin, finderObject)) {
            if (isFunction(newData)) {
                origin = origin.merge(newData(origin));
            } else {
                origin = origin.merge(newData);
            }
        }

        var entrySeq = origin.entrySeq();
        entrySeq.forEach(function (v, i) {
            var key = v[0];
            var value = v[1];
            var newValue = updateImmutableObject(value, finderObject, newData);
            if (value !== newValue) {
                origin = origin.set(key, newValue);
            }
        });
    }

    if (List.isList(origin)) {
        var size = origin.size;
        for (var i = 0; i < size; i++) {
            origin = origin.update(i, function (v) {
                return updateImmutableObject(v, finderObject, newData);
            });
        }
    }
    return origin;
}

export function removeImmutableListObj(state, listName, finder) {
    var listObj = state.get(listName);
    listObj = listObj.filterNot(function (v, i) {
        return finder(v, i);
    });
    state = state.set(listName, listObj);
    return state;
}


export function className(obj) {
    var arr = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var value = obj[key];
            if (value === true) {
                arr.push(key);
            }
        }
    }
    return arr.join(' ');
}

export function globalVar(key, value) {
    var COOLPENG_TEMP_VAR = 'COOLPENG_TEMP_VAR';
    window[COOLPENG_TEMP_VAR] = window[COOLPENG_TEMP_VAR] || {};
    if (value != undefined) {
        window[COOLPENG_TEMP_VAR][key] = value;
    }
    return window[COOLPENG_TEMP_VAR][key];
}


export function isEventInTarget(evt, targetId) {
    var $target = $(evt.target);
    var p = $target.closest("#" + targetId);
    if (p && p.length > 0) {
        //点击到
        return true;
    }
    return false;
}

/**
 * 逆转字符串
 * @param str
 * @returns {string}
 */
export function reverseString(str) {
    str = str || "";
    var len = str.length;
    var newStr = [];
    for (var i = len - 1; i >= 0; i--) {
        newStr.push(str[i]);
    }
    return newStr.join("");
}


/**
 * 获取一个随机的数字
 * @param min
 * @param max
 * @returns {number}
 */
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


/**
 * 获取一个随机的指定长度的数字字符串
 * @param min
 * @param max
 * @param len
 * @returns {string}
 */
export function getRandomNumString(min, max, len) {
    var num = "" + getRandomNumber(min, max);
    num = reverseString(num);
    var str = [];
    for (var i = 0; i < len; i++) {
        str[i] = num[len - i - 1] || "0";
    }
    return str.join("");
}


export function toInnerHTML(html){
    return (
        <div dangerouslySetInnerHTML={{__html:html}}></div>
    );
}



initUnderscoreMixin({
    valueIn: getObjValueInPath,
    toInnerHTML:toInnerHTML
});