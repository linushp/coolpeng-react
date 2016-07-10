import api from '../../api'

function coolpengAvatarView(pageId,pageSize,defaultOrderType,defaultPageNumber) {
    var queryCondition = {
        pageId:pageId,
        pageSize:pageSize||20,
        pageNumber:defaultPageNumber || 1,
        orderType:defaultOrderType || 1  //最新1，最早2，最热3
    };


    var queryReplyPageList = function () {
        var promise = api.post('/cloud/reply/getReplyList.json', {
            data: queryCondition
        });
    }

}

