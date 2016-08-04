import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory} from 'history'
import configureStore from './store/configureStore';

import App from './views/App';
import Home from './views/Home';
import Article from './views/Article/Article';
import ArticleList from './views/Article/ArticleList';
import ArticleSingle from './views/Article/ArticleSingle';

import DaoHang from './views/DaoHang/DaoHang';

const history = useRouterHistory(createHistory)({ basename: '' });

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
                    <Route path="article" component={Article}>
                        <IndexRedirect to="list/"/>
                        <Route path="list/" component={ArticleList}/>
                        <Route path="single/:id" component={ArticleSingle}/>
                    </Route>
                    <Route path="daohang" component={DaoHang}> </Route>
                </Route>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);