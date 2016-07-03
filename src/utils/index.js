import {Router, Route, IndexRedirect, useRouterHistory} from 'react-router';
import {createHistory} from 'history'
import 'lodash'
var _ = self._;
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
  var paramArray = _.map(paramObject, function (value, key) {
    return key + "=" + encodeURIComponent(value);
  });
  if (paramArray && paramArray.length > 0) {
    return "?" + paramArray.join("&");
  }
  return "";
}