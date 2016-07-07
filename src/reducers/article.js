import {
    GET_MODULE_LIST_PENDING,
    GET_MODULE_LIST_SUCCESS,
    GET_MODULE_LIST_ERROR,
} from '../actions/article';
//import Immutable from 'immutable';

const initialState = {
    moduleList: [],
    loading:false
};

export default function auth(state = initialState, action = {}) {
    var {type,payload} = action;
    switch (type) {
        case GET_MODULE_LIST_PENDING:
            return Object.assign({}, state, {loading: true});
        case GET_MODULE_LIST_SUCCESS:
            return Object.assign({}, state, {moduleList: payload.data,loading:false});
        case GET_MODULE_LIST_ERROR:
            return Object.assign({}, state, {moduleList: []});
        default:
            return state;
    }
}
