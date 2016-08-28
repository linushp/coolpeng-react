import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory,createHashHistory} from 'history'
import configureStore from './store/configureStore';
import {EventBus,getLocalStorage} from './core/utils/index'
import $ from 'jquery';

import App from './views/App';
import Home from './views/Home';
import NoteApp from './views/Note/NoteApp';
import Login from './views/Login/Login';

var history = useRouterHistory(createHistory)({ basename: '' });

if(window.COOPENG_USE_HASH_HISTORY){
    history = useRouterHistory(createHashHistory)({ basename: '' });
}

const store = configureStore();
const validate = function (next, replace, callback) {
    var userState = getLocalStorage("user_state") || {};
    var userInfo = userState.userInfo || {};
    const isLoggedIn = userInfo.id;
    if (!isLoggedIn && next.location.pathname != '/login') {
        replace('/login')
    }
    callback()
};

const getComponent = function(src){
    return function (nextState, cb){
        require.ensure([], (require) => {
            cb(null, require(src))
        })
    }
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="daohang"/>
                <Route component={App}>
                    <Route path="home" component={Home}/>
                    <Route path="note"  component={NoteApp} />
                    <Route path="note/:currentPath"  component={NoteApp} />
                    <Route path="daohang" getComponent={getComponent('./views/DaoHang/DaoHang')} > </Route>
                </Route>
            </Route>
            <Route path="/login" component={Login} />
        </Router>
    </Provider>,
    document.getElementById('root')
);

$(function(){
    $(document).on('click',function(evt){
        EventBus.emit('EVENT_DOCUMENT_CLICK',evt,this);
    });
});