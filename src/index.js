import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory,createHashHistory} from 'history'
import configureStore from './store/configureStore';
import {EventBus,getLocalStorage} from './core/utils/index'
import Dialog from './components/dialog/Dialog';
import $ from 'jquery';

import App from './views/App';
import Home from './views/Home';
import NoteApp from './views/Note/NoteApp';
import UserLogin from './views/User/UserLogin';
import UserRegister from './views/User/UserRegister';
import DaoHang from './views/DaoHang/DaoHang';
import ChatRoomIndex from './views/ChatRoom/ChatRoomIndex/ChatRoomIndex';

var history = useRouterHistory(createHistory)({ basename: '' });

if(__IS_HASH_HISTORY__){
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


//getComponent={getComponent('./views/DaoHang/DaoHang')} >
// const getComponent = function(src){
//     return function (nextState, cb){
//         require.ensure([], (require) => {
//             cb(null, require(src))
//         })
//     }
// };

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="link"/>
                <Route component={App}>
                    <Route path="home" component={Home}/>
                    <Route path="link" component={DaoHang} > </Route>
                    <Route path="note"  component={NoteApp} />
                    <Route path="note/:currentPath" component={NoteApp} />
                    <Route path="chat" component={ChatRoomIndex} > </Route>
                </Route>
            </Route>
            <Route path="/login" component={UserLogin} />
        </Router>
    </Provider>,
    document.getElementById('root')
);

$(function(){

    $("#root").addClass('rootShow');

    $(document).on('click',function(evt){
        EventBus.emit('EVENT_DOCUMENT_CLICK',evt,this);
    });
    
    var showAlertError = false;
    EventBus.addEventListener('UserNoLoginException',function (data) {
        if(showAlertError){
            return;
        }
        showAlertError = true;
        Dialog.showAlertError(data.responseText,function () {
            showAlertError = false;
            history.pushState(null, '/login');
        });
    });

});