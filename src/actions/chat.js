import CloudRestAction from '../core/CloudRestAction';

var staticFunc = [
    "staticSetCurrentSessionId",
    "staticOnWebSocketMessage"
];


var funcNameList = [
    'getAllOnlineUserVO',
    'getSessionList',
    'createSession',
    'deleteSession',
    'sendMessage',
    'getChatMsgList',
    {
        name:"sendMessageToRobot",
        //url:"/3rd-api/chat-robot",
        url:(__DEV__?"/robot/index":"/3rd-api/chat-robot"),
        method:'GET',
        validateCallback:function(){
            return true;
        }
    }
];

var prefix = "chat";

var restAction = new CloudRestAction(prefix,funcNameList,staticFunc);

export default restAction;
