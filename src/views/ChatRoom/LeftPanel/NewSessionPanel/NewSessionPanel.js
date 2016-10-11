import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID,immutableListMap,getObjValueInPath} from '../../../../core/utils/index';
import PureRenderComponent from '../../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import $ from 'jquery';
import ActionStoreHelper from '../../../Common/ActionStoreHelper';
import LeftPanelHeader from '../LeftPanelHeader';
import LeftPanelManager from '../LeftPanelManager';
import './NewSessionPanel.less';
const valueIn = getObjValueInPath;
export default class NewSessionPanel extends PureRenderComponent {

    constructor(props) {
        super(props);
    }


    onClickUserList(e) {
        var that = this;
        var $target = $(e.target);
        var m = $target.closest('.user-line');
        var targetUid = m.data('uid');
        var {userInfo,functions} = that.props;
        var myUID = valueIn(userInfo, 'id');
        functions.onCreateNewSession('peer',[targetUid,myUID],function(){
            LeftPanelManager.popPanel();
        });
    }

    render() {
        var that = this;
        //这堆数据都是通过外界传过来的.
        var {onlineUserList,userInfo,actions} = that.props;
        var myUID = parseInt(valueIn(userInfo, 'id'));
        return (
            <div className="chat-NewSessionPanel chat-LeftPanel">
                <LeftPanelHeader title="新建会话"></LeftPanelHeader>
                <div className="chat-LeftPanelBody userList" onClick={that.onClickUserList.bind(that)}>
                    {immutableListMap(onlineUserList, function (userObj) {
                        var nickname = valueIn(userObj, 'nickname');
                        var avatar = valueIn(userObj, 'avatar');
                        var uid = parseInt(valueIn(userObj, 'uid'));
                        if (myUID === uid) {
                            return null;
                        }
                        return (
                            <div className="user-line" data-uid={uid}>
                                <div className="user">
                                    <img className="avatar" src={avatar} alt={nickname}/>
                                    <div className="nickname"> {nickname}</div>
                                </div>
                            </div>);
                    })}
                </div>
            </div>);
    }

}