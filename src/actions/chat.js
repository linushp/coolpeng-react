import CloudRestAction from '../core/CloudRestAction';


var funcNameList = [
    'getAllOnlineUserVO',
    'getSessionList',
    'createSession',
    'sendMessage',
    'getChatMsgList'
];

var prefix = "chat";

var restAction = new CloudRestAction(prefix,funcNameList);

export default restAction;
