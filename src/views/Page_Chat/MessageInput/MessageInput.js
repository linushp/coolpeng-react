import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import './MessageInput.less';
import MessageActions from '../../../actions/MessageActions';

class MessageInput extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleSendMsg = ()=> {
        var {selSession} = this.props;
        var MessageTextInput = this.refs['MessageTextInput'];
        var value = MessageTextInput.value;
        MessageActions.sendMessage(selSession, {
            type: 'text', //text,image,code
            data: value
        });
    };

    render() {
        var that = this;
        return (
            <div className="MessageInput">
                <input type="text" ref="MessageTextInput"/>
                <button onClick={that.handleSendMsg}>发送</button>
            </div>
        )
    }
}

export default RebixFlux.connect(MessageInput, function (bigStore, props, context, connectState, that) {
    var sessionsMap = getDeepValue(bigStore, 'sessionState.sessionsMap');
    var userAccounts = getDeepValue(bigStore, 'userAccountState');
    var selSessionId = getDeepValue(bigStore, 'sessionState.selSessionId');
    var selSession = sessionsMap.get(selSessionId);

    return {
        selSessionId: selSessionId,
        selSession: selSession
    };
});