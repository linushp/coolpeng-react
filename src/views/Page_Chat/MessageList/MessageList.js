import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
const formatDatePretty = RebixUtils.formatDatePretty;
import UserAvatar from '../../../components/UserAvatar/UserAvatar';
import TextMessageContent from './MessageContent/TextMessageContent'
import ImageMessageContent from './MessageContent/ImageMessageContent'
import CodeMessageContent from './MessageContent/CodeMessageContent';
import getUniqueId from '../../../utils/getUniqueId';
import getStaticUrl from '../../../utils/getStaticUrl';
import {scrollMessageListToBottomIfNowBottom} from '../ChattingPageUtils';

import './MessageList.less';


var MessageItemMap = {
    'text': TextMessageContent,
    'image': ImageMessageContent,
    'code': CodeMessageContent
};


const MessageItemUserInfo = createPureComponent(function (props) {
    var {message,timestamp} = props;
    var {f_uid,f_avatar,f_nickname,time} = message;
    return (
        <div className="MessageItemUserInfo">
            <UserAvatar avatar={f_avatar} size={40} className="MessageItemAvatar"/>
            <div className="MessageItemNickname">{f_nickname}</div>
            <div className="MessageItemTime">{formatDatePretty(time)}</div>
            <div className="clear"></div>
        </div>
    );
});


const MessageItemSending = createPureComponent(function (props) {
    return (
        <img src={getStaticUrl("/static/v2/images/25x4Rho.gif")} className="sendingIcon"/>
    );
});

const MessageItem = createPureComponent(function (props) {
    var {message,isDisplayUserInfo,loginUid,timestamp} = props;
    var {msg_type,f_uid,status} = message;
    var isMySendMsg = (f_uid === loginUid);
    var clazzName = isMySendMsg ? 'me' : '';
    var RenderMessageContent = MessageItemMap[msg_type] || TextMessageContent;
    return (
        <div className={`MessageItem ${clazzName}`}>
            {isDisplayUserInfo ? <MessageItemUserInfo message={message} timestamp={timestamp}/> : null}
            <div className="MessageItemContent">
                <RenderMessageContent message={message}/>
            </div>
            {status === 'sending' ? <MessageItemSending/> : null}
            <div className="clear"></div>
        </div>
    );
});


class MessageList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderMessageList() {
        var {messageList,loginUid,timestamp} = this.props;
        if (!messageList) {
            return null;
        }


        var lastFromUid = null;
        var lastMsgTime = null;
        var count = 0;
        return messageList.map(function (msg) {
            var msg_id = msg.msg_id || msg.id;
            var f_uid = msg.f_uid;
            var time = msg.time;
            var isDisplayUserInfo = false;

            if (count >= 10) {
                isDisplayUserInfo = true;
                count = 0;
            }

            if (f_uid !== lastFromUid) {
                isDisplayUserInfo = true;
            }

            if (lastMsgTime && time && (time - lastMsgTime > 1000 * 60 * 10)) {
                isDisplayUserInfo = true;
            }

            lastMsgTime = time;
            lastFromUid = f_uid;
            count++;

            return <MessageItem message={msg} timestamp={timestamp} key={msg_id} isDisplayUserInfo={isDisplayUserInfo}
                                loginUid={loginUid}/>
        });

    }


    //接收到消息
    onCmdReceiveMessage = ({responseType,sessionId}, status)=> {
        if (responseType !== 'msg' || status !== 'success') {
            return;
        }
        var {selSessionId} = this.props;
        if (selSessionId === sessionId) {
            scrollMessageListToBottomIfNowBottom();
        }
    };

    render() {
        var that = this;
        return (
            <div className="MessageList">
                <div className="MessageListContent">
                    {that.renderMessageList()}
                </div>
            </div>
        )
    }
}

const MessageList1 = RebixFlux.connect(MessageList, function (bigStore, props, context, connectState, that) {

    var selSessionId = getDeepValue(bigStore, 'sessionState.selSessionId');
    var messageList = getDeepValue(bigStore, 'messageState.S' + selSessionId);

    var loginState = getDeepValue(bigStore, 'loginState');
    var loginUid = getDeepValue(bigStore, 'loginState.id');

    var timestamp = props.timestamp;

    return {
        selSessionId: selSessionId,
        messageList: messageList,
        loginUserInfo: loginState,
        loginUid: loginUid,
        timestamp: timestamp
    };

});

export default MessageList1;