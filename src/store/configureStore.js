import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../core/middlewares/promiseMiddleware'

import user from './reducers/user';
import menu from './reducers/menu';
import note from './reducers/note';
import daohang from './reducers/daohang';
import chat from './reducers/chat';
import filesCode from './reducers/filesCode';

const reducer = combineReducers({user, menu, note,daohang,chat,filesCode});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
