function _scrollMessageListToBottom(count) {
    var scrollDom = document.getElementsByClassName('MessageList')[0];
    if (scrollDom) {
        scrollDom.scrollTop = 10000000;
    }

    if (count > 0) {
        window.setTimeout(function () {
            _scrollMessageListToBottom(count - 1);
        }, 10);
    }
}


export function scrollMessageListToBottom(){
    _scrollMessageListToBottom(10);
}


//如果现在就在聊天窗口底部,才会滚动到更低部
export function scrollMessageListToBottomIfNowBottom(){

    var MessageListContentDOM = document.getElementsByClassName('MessageListContent')[0];
    var innerHeight = MessageListContentDOM.offsetHeight;
    var scrollDom = document.getElementsByClassName('MessageList')[0];
    var outerHeight = scrollDom.offsetHeight;
    var outerScroll = scrollDom.scrollTop;

    setTimeout(function(){
        if(outerHeight + outerScroll + 60 > innerHeight){
            scrollMessageListToBottom();
        }
    },10);
}