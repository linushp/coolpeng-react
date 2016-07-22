import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history'
const routeHistory = useRouterHistory(createHistory)({ basename: '' });

export function getRouteHistory() {
  return routeHistory;
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

export function setLocalStorage(name,value) {
  if(value){
    value = JSON.stringify(value);
  }
  window.localStorage.setItem(name,value);
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
export function createUUID() {
  var randomStr =  'xxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return randomStr + new Date().getTime();
}


export function getStaticURL(p){
  return "http://image.coolpeng.cn/static/" + p;
}