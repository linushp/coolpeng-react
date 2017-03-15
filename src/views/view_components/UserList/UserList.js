import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
import UserItem from '../UserItem/UserItem';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
const map = RebixUtils.map; //兼容Immutable.List
import './UserList.less';

export default class UserList extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){

        var {userList} = this.props;
        var xxx = map(userList, function (userInfo) {
            var key = userInfo.id;
            return <UserItem key={key} userInfo={userInfo}/>
        });
        return (
            <div className="VC_UserList">
                {xxx}
            </div>
        )
    }
}