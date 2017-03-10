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