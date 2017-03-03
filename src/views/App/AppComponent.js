import React from 'react';
import RebixFlux from 'react-rebixflux';
import BigStore from '../../stores/BigStore';
import './App.less';
import AppHeader from './AppHeader';

class AppComponent extends RebixFlux.PureRenderComponent {
    render() {
        return (
            <div className="AppComponent">
                <AppHeader />
                <div className="AppBody">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default RebixFlux.connect(AppComponent, BigStore, function (bigStore, props, context, connectState, that) {
    return {};
});