import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';

import UserAvatar from '../../components/UserAvatar/UserAvatar';

class AppHeader extends RebixFlux.PureRenderComponent {
    render() {
        var props = this.props;
        var {userInfo} = props;
        return (
            <div className="AppHeader">
                <div className="AppHeaderLeft">
                    ubibi
                </div>
                <div className="AppHeaderRight">
                    <UserAvatar avatar={userInfo.avatar} size={35}></UserAvatar>
                    <span className="nickname">欢迎您: &nbsp;{userInfo.nickname}</span>
                </div>
            </div>
        );
    }
}

export default RebixFlux.connect(AppHeader,function(bigStore, props, context, connectState, that){
    return {
        userInfo: bigStore.loginState
    };
});