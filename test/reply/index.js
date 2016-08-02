//import avatarView from '../../src/service/avatar/avatarView';

//import AvatarReact from '../../src/service/avatar/AvatarReact';


import AvatarView from '../../src/service/avatar/avatarView';

class AvatarReact extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {

        var userInfo = {

            nickname: "张三",
            email: null,
            avatar: "http://image.coolpeng.cn/avatar/mv-0001-1957/mv-0718.jpg",

            tokenId: "",
            devicePlatform: "",
            uuid: "",

            hasLogin: false,
            isAdmin: false
        };


        var avatarRoot = this.refs.avatarRoot.getDOMNode();//拿到了原生DOM
        var view = new AvatarView({
            DOM: avatarRoot,
            pageId: "test",
            pageSize:30,
            defaultPageNumber:1,
            defaultOrderType:1,

            userInfo: userInfo,

            isShowReply2:false,//是否在第一屏显示二级回复

            isOnlyAdminReply:false, //TODO 是否只有管理员可以回复
            isOnlyShowRepliedMsg:false, //TODO 是否只显示被回复过的.
            //loading样式优化
            //管理员删除功能
            //提示信息优化
            //二级回复输入框优化
            //插入表情支持
            //回复插入图片支持


            innerSetUserInfo: function (u) {
                console.log(u);

                u.tokenId = "";
                u.devicePlatform = "";
                u.uuid = "";

                u.hasLogin = true;
                u.isAdmin = false;

                view.outSetUserInfo(u);
            }
        });

        view.outSetUserInfo(userInfo);

    }

    render() {
        return (
            <div className="avatar-react-root" ref='avatarRoot'>
            </div>
        );
    }
}



import React from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(
    <AvatarReact></AvatarReact>,
    document.getElementById('root')
);

