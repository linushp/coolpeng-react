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

var document = window.document;
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


    //监听用户没有登录时间
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


    //显示桌面通知
    var win = window;
    var Notification = win.Notification || win.mozNotification || win.webkitNotification;
    Notification.requestPermission(function (permission) {
        console.log(permission);
    });

    EventBus.addEventListener('WebNotification',function (data) {
        var title = data.title;
        var notify = new Notification(title, data);
        notify.onclick = function(event){
            notify.close();
        };
    });




    //处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
    function forbidBackSpace(e) {
        var ev = e || window.event;
        var obj = ev.target || ev.srcElement;
        var $obj = $(obj);
        var $simditor = $obj.closest('.simditor');
        var isSimditor = $simditor && $simditor.length>0;
        if($obj.hasClass('simditor-body') || isSimditor){
            return true;
        }
        var t = obj.type || obj.getAttribute('type');
        var vReadOnly = obj.readOnly;
        var vDisabled = obj.disabled;
        vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
        vDisabled = (vDisabled == undefined) ? true : vDisabled;
        var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);
        var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";
        //判断
        if (flag2 || flag1) return false;
    }
    //禁止后退键 作用于Firefox、Opera
    document.onkeypress = forbidBackSpace;
    //禁止后退键  作用于IE、Chrome
    document.onkeydown = forbidBackSpace;

});