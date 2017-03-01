import React from 'react';
import ReactDOM from 'react-dom';

import {Router, Route, IndexRedirect,useRouterHistory} from 'react-router';
import {createHistory,createHashHistory} from 'history'

ReactDOM.render(

        <Router history={history}>
            <Route path="/" onEnter={validate}>
                <IndexRedirect to="link"/>
                <Route component={App}>
                    <Route path="chat" component={ChatRoomIndex} > </Route>
                </Route>
            </Route>
            <Route path="/login" component={UserLogin} />
        </Router>
    ,
    document.getElementById('root')
);
