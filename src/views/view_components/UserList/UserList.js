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

    onClickItem = (e1, e2, userInfo)=> {
        var {onClickItem,userList} = this.props;
        if (onClickItem) {
            onClickItem(e1, e2, userInfo, userList);
        }
    };


    render(){

        var that = this;
        var props = that.props;
        var {userList,filter,selectedUidMap,ExtendInfoComponent,ExtendAvatarComponent} = props;

        return (
            <div className="VC_UserList">
                {
                    userList && map(userList, function (userInfo) {

                        var isOK = true;
                        if(filter){
                            isOK = filter(userInfo,props);
                        }

                        if(!isOK){
                            return null;
                        }

                        var key = userInfo.id;
                        return (
                            <UserItem
                                ExtendInfoComponent={ExtendInfoComponent}
                                ExtendAvatarComponent={ExtendAvatarComponent}
                                key={key}
                                userInfo={userInfo}
                                onClick={that.onClickItem} />
                        );
                    })
                }
            </div>
        );

    }
}