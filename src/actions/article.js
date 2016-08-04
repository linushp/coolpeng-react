import api from '../core/api'

import {getCookie} from '../core/utils';

export const GET_MODULE_LIST_PENDING = 'GET_MODULE_LIST_PENDING';
export const GET_MODULE_LIST_SUCCESS = 'GET_MODULE_LIST_SUCCESS';
export const GET_MODULE_LIST_ERROR   = 'GET_MODULE_LIST_ERROR';

export function getAllModuleList() {
    return {
        type: 'GET_MODULE_LIST',
        payload: {
            promise: api.post('/app/blog/getAllModuleList.shtml')
        }
    }
}