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

    render() {
        var {userInfo} = this.props;
        var {avatar,nickname} = userInfo;
        return (
            <div className="VC_UserItem">
                <div className="VC_UserAvatar">
                    <UserAvatar avatar={avatar} size={40}/>
                </div>
                <div className="VC_UserInfo">
                    {nickname}
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}
