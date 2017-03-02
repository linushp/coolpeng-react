import React from 'react';
import RebixFlux from 'react-rebixflux';
import BigStore from '../../stores/BigStore';

import AppHeader from './AppHeader';

class AppComponent extends RebixFlux.PureRenderComponent {
    render(){
        return (
            <div className="u-app">
                <AppHeader />
            </div>
        );
    }
}

export default RebixFlux.connect(AppComponent, BigStore, function (bigStore, props, context, connectState, that) {
    return {};
});