import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory,createHashHistory} from 'history'
import configureStore from './store/configureStore';
import {EventBus} from './core/utils/index'
import Dialog from './components/dialog/Dialog';
import $ from 'jquery';


import App from './views/App';
import Home from './views/Home';

import NoteApp from './views/Note/NoteApp';

var history = useRouterHistory(createHistory)({ basename: '' });

if(window.COOPENG_USE_HASH_HISTORY){
    history = useRouterHistory(createHashHistory)({ basename: '' });
}

import {getCookie} from './core/utils';
const store = configureStore();

const validate = function (next, replace, callback) {
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
        </Router>
    </Provider>,
    document.getElementById('root')
);

$(function(){


    window.COOLPENG_DIALOG = Dialog;

    $(document).on('click',function(evt){
        EventBus.emit('EVENT_DOCUMENT_CLICK',evt,this);
    });
});