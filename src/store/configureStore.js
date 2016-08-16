import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunkMiddleware from 'redux-thunk';

import promiseMiddleware from '../core/middlewares/promiseMiddleware'

import user from './reducers/user';
import menu from './reducers/menu';
import article from './reducers/article';
import daohang from './reducers/daohang';

const reducer = combineReducers({user, menu, article,daohang});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  promiseMiddleware({promiseTypeSuffixes: ['PENDING', 'SUCCESS', 'ERROR']})
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
