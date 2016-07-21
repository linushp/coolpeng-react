import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect} from 'react-router';

import configureStore from './store/configureStore';

import App from './views/App';
import Home from './views/Home';
import Login from './views/Login';
import Article from './views/Article/Article';
import ArticleList from './views/Article/ArticleList';
import ArticleSingle from './views/Article/ArticleSingle';

import {getCookie, getRouteHistory} from './utils';

const history = getRouteHistory();
const store = configureStore();

const validate = function (next, replace, callback) {
    // const isLoggedIn = !!getCookie('uid')
    // if (!isLoggedIn && next.location.pathname != '/login') {
    //   replace('/login')
    // }
    callback()
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="home"/>
                <Route component={App}>
                    <Route path="home" component={Home}/>
                    <Route path="article" component={Article}>
                        <IndexRedirect to="list/"/>
                        <Route path="list/" component={ArticleList}/>
                        <Route path="single/:id" component={ArticleSingle}/>
                    </Route>
                </Route>
                <Route path="login" component={Login}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);





//var AvatarView = window.coolpengAvatarView;
//var view = new AvatarView({
//    DOM:document.getElementById("replyTestContainer"),
//    pageId:"test"
//});