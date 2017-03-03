import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route, IndexRedirect,browserHistory,hashHistory,IndexRoute} from 'react-router';
import {onDomReady,ServerTimeUtils} from 'rebix-utils';
import LoginStore from './stores/LoginStore';
import ChattingPage from './views/Page_Chat/ChattingPage';
import AppMainWindow from './views/App/AppComponent';
import LoginPage from './views/Page_Login/LoginPage';
import NotFoundPage from './views/NotFoundPage';

onDomReady(function () {


    //1.服务器时间
    var clientTime = new Date().getTime();
    ServerTimeUtils.updateServerTime(window.APP_SERVER_TIME || clientTime, clientTime);

    function requireLogin(nextState, replace) {
        if (!LoginStore.isLoggedIn()) {
            replace('/login');
        }
    }

    var domRoot = document.getElementById('root');
    domRoot.className = 'rootShow';

    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={AppMainWindow}>
                <IndexRoute component={ChattingPage} onEnter={requireLogin}/>
            </Route>
            <Route path="/login" component={LoginPage}/>
        </Router>,
        domRoot
    );
});




