import CloudRestAction from '../core/CloudRestAction';

var staticFunc = [
    "staticSetCurrentSessionId",
    "staticOnWebSocketMessage"
];


var funcNameList = [
    'getAllOnlineUserVO',
    'getSessionList',
    'createSession',
    'sendMessage',
    'getChatMsgList'
];

var prefix = "chat";

var restAction = new CloudRestAction(prefix,funcNameList,staticFunc);

export default restAction;
