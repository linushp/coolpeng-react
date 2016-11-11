import React from 'react';
import ReactDOM from 'react-dom';
import reubibiConfigure from '../config/reubibiConfigure';
import Reubibi,{Provider} from '../../reubibi/src/index';
import Hello from './hello';

var store = reubibiConfigure.getStore();

console.log(store);
ReactDOM.render(
    <Provider store={store}>
        <Hello></Hello>
    </Provider>,
    document.getElementById('root')
);