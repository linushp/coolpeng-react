import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID,immutableListMap,getObjValueInPath} from '../../../../core/utils/index';

import PureRenderComponent from '../../../../core/PureRenderComponent';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../../Common/ActionStoreHelper';
import LeftPanelHeader from '../LeftPanelHeader';
import './NewSessionPanel.less';
export default class NewSessionPanel extends PureRenderComponent {

    constructor(props) {
        super(props);
    }


    render(){
        var that = this;
        var {onlineUserList} = that.props;
        return (
            <div className="chat-NewSessionPanel">
                <LeftPanelHeader title="新建会话"></LeftPanelHeader>
                <div>
                    {immutableListMap(onlineUserList,function(userObj){
                        var nickname = getObjValueInPath(userObj,'nickname');
                        return <div>{nickname}</div>
                    })}
                </div>
            </div>);
    }

}