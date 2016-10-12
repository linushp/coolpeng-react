import React from 'react'
import {bindActionCreators} from 'redux';
import {createUUID,immutableListMap,getObjValueInPath,StaticConfig} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';

import './UserAvatar.less';
const valueIn = getObjValueInPath;
export default class UserAvatar extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    render() {

        var that = this;
        //这堆数据都是通过外界传过来的.
        var {userInfo,width,height} = that.props;
        width = width || 35;
        height = height || 35;
        var nickname = valueIn(userInfo, 'nickname') || '';
        var avatar = valueIn(userInfo, 'avatar');
        var uid = valueIn(userInfo, 'uid');
        var online = valueIn(userInfo, 'online');
        if(!avatar){
            avatar  = StaticConfig.DEFAULT_AVATAR;
        }

        var userStateClass = "OnlineStatus" + online;
        var style = {
            width:width,
            height:height
        };
        return (
            <div className="UserAvatar" data-uid={uid} style={style} >
                <img className="UserAvatarImg" src={avatar} alt={nickname} style={style} />
                <div className={userStateClass}></div>
            </div>);
    }

}