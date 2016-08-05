import api from '../core/api'

import {getCookie} from '../core/utils';

export const FETCH_PROFILE_PENDING = 'FETCH_PROFILE_PENDING';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';

export const LOGIN_PENDING = 'LOGIN_PENDING';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function fetchProfile() {
    return {
        type: 'FETCH_PROFILE',
        payload: {
          promise: api.post('/cloud/user/getCurrentUserInfo.json',{})
        }
    }
}


export function login(username, password,callback) {
  return {
      type: 'LOGIN',
      payload: {
        promise: api.post('/cloud/user/login.json', {
            username: username,
            password: password
        })
      },
      meta:{
          actionSourceCallback:callback
      }
  }
}

export function logout(callback) {
    return {
        type: 'LOGOUT',
        payload: {
            promise: api.post('/cloud/user/logout.json')
        }
    }
}


export function setCurrentTempUser(tempUser){
    return {
        type: 'LOGOUT_TEMP_USER',
        payload:{
            data:tempUser
        }
    }
}