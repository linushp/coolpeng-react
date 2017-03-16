/**
 * Created by luanhaipeng on 17/3/15.
 */
import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import './UserItem.less';
import UserAvatar from '../../../components/UserAvatar/UserAvatar';

export default class UserItem extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }


    onClick = (e1, e2)=> {
        var {onClick,userInfo} = this.props;
        if (onClick) {
            onClick(e1, e2, userInfo);
        }
    };

    render() {
        var {userInfo,ExtendInfoComponent,ExtendAvatarComponent} = this.props;
        var {avatar,nickname} = userInfo;
        return (
            <div className="VC_UserItem" onClick={this.onClick}>
                <div className="VC_UserAvatar">
                    <UserAvatar avatar={avatar} size={40}/>
                    {ExtendAvatarComponent ? <ExtendAvatarComponent userInfo={userInfo}/> : null}
                </div>
                <div className="VC_UserInfo">
                    <div className="VC_nickname">{nickname}</div>
                    {ExtendInfoComponent ? <ExtendInfoComponent userInfo={userInfo}/> : null}
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
