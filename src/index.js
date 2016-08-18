import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory,createHashHistory} from 'history'
import configureStore from './store/configureStore';


import App from './views/App';
import Home from './views/Home';

import NoteApp from './views/Note/NoteApp';
import NoteSideBar from './views/Note/NoteSideBar';

import DaoHangIndex from './views/DaoHang/index';

var history = useRouterHistory(createHistory)({ basename: '' });

if(window.COOPENG_USE_HASH_HISTORY){
    history = useRouterHistory(createHashHistory)({ basename: '' });
}

import {getCookie} from './core/utils';
const store = configureStore();

const validate = function (next, replace, callback) {
    callback()
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="daohang"/>
                <Route component={App}>
                    <Route path="home" component={Home}/>
                    <Route path="note"  components={{content:NoteApp,sidebar:NoteSideBar}} />
                    <Route path="note/:currentPath"  components={{content:NoteApp,sidebar:NoteSideBar}} />
                    <Route path="daohang" getComponent={DaoHangIndex.getComponent} > </Route>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);