import React from 'react'
import PureRenderComponent from '../../../core/PureRenderComponent';
import {MessageCodeIcon} from './StaticResource';
import {showCodeViewDialog} from "../../dialogs/CodeViewDialog/CodeViewDialog";
import ActionStoreHelper from '../../Common/ActionStoreHelper';


export default class MessageContent extends PureRenderComponent {

    constructor(props) {
        super(props);
    }

    onClickMsgCodeContent = ()=> {
        var that = this;
        var {msg, msgType, msgId,actions}= that.props;
        var msgObj = JSON.parse(msg);
        showCodeViewDialog(msgObj,actions, msgId);
    };

    renderMsgCodeContent(msg, msgType, msgId,that) {
        var msgObj = JSON.parse(msg);
        return (
            <div className="msgCodeContent" onClick={that.onClickMsgCodeContent}>
                <div className="msgCodeIcon">
                    <img src={MessageCodeIcon}/>
                </div>
                <div className="msgCodeDesc">
                    <div className="title">{msgObj.title}</div>
                    <div className="codeSize">{msgObj.codeSize || 0} 字符</div>
                </div>
                <div className="msgCodeLanguage">{msgObj.language}</div>
            </div>
        );
    }

    render() {
        var that = this;
        var {msg, msgType, msgId}= that.props;
        if (msgType === "code") {
            return that.renderMsgCodeContent(msg, msgType, msgId,that);
        }
        return (
            <div className="msgContent" dangerouslySetInnerHTML={{__html:msg}}></div>
        );
    }
}



MessageContent.ACTION_CONFIG = {
    "getCloudCodeById":"filesCode.getCloudCodeById"
};


export default ActionStoreHelper()(MessageContent);