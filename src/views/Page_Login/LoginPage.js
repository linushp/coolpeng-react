import React from 'react';
import RebixFlux from 'react-rebixflux';
import LoginStore from '../../stores/LoginStore';

class LoginPage extends RebixFlux.PureRenderComponent {
    render(){
        return (
            <div>

            </div>
        );
    }
}


export default RebixFlux.connect(LoginPage,LoginStore,function(loginStore){
    return {};
});