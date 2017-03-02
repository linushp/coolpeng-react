import React from 'react';
import ReactDOM from 'react-dom';
import {Router,Route, IndexRedirect,browserHistory,hashHistory,IndexRoute} from 'react-router';
import {onDomReady,ServerTimeUtils,setServices} from 'rebix-utils';
import LoginStore from './stores/LoginStore';
import ChattingPage from './views/Page_Chat/ChattingPage';
import AppMainWindow from './views/App/AppComponent';
import LoginPage from './views/Page_Login/LoginPage';
import NotFoundPage from './views/NotFoundPage';

onDomReady(function(){


    //1.服务器时间
    var clientTime = new Date().getTime();
    ServerTimeUtils.updateServerTime(window.APP_SERVER_TIME || clientTime, clientTime);

    //2.把Store服务化
    setServices({
        LoginStore: LoginStore
    });


    function requireLogin(nextState, replace) {
        if (!LoginStore.isLoggedIn()) {
            replace('/login');
        }
    }


    ReactDOM.render(
        <Router history={hashHistory}>
            <Route path="/" component={AppMainWindow}>
                <IndexRoute component={ChattingPage} onEnter={requireLogin} />
                <Route path="*" component={NotFoundPage}/>
            </Route>
            <Route path="login" component={LoginPage} />
        </Router>,
        document.getElementById('root')
    );
});




