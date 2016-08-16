//import AvatarView from './avatarView';


/**
 * 支持一个入口页面,功能实现是异步加载的
 * 异步加载js文件
 */
export default class AvatarReact extends React.Component {
    constructor(props) {
        super(props);
        this.isInited = false;
    }

    componentWillMount() {

    }

    getUserInfo() {
        var userObj = this.props.user || {};
        var userInfo = userObj.userInfo;
        return {
            nickname: userInfo.nickname,
            email: userInfo.mail,
            avatar: userInfo.avatar,
            tokenId: userInfo.lastLoginToken,
            devicePlatform: userInfo.lastLoginDevPlatform,
            uuid: userInfo.lastLoginDevUid,
            hasLogin: userObj.isLogged,
            isAdmin: userInfo.permission === 'admin'
        };
    }


    componentDidMount() {
        this.initAvatarView();
    }

    initAvatarView() {

        if (this.isInited === true) {
            return;
        }

        console.log('Avatar initAvatarView1', new Date().getTime());
        require.ensure([], function (require) {
            this.isInited = true;

            var AvatarView = require('./avatarView');
            console.log('Avatar initAvatarView2', new Date().getTime());
            var pageId = this.props.pageId || "test";
            var setCurrentTempUser = this.props.setCurrentTempUser;
            var userInfo = this.getUserInfo();

            var avatarRoot = this.refs.avatarRoot.getDOMNode();//拿到了原生DOM
            var view = new AvatarView({
                DOM: avatarRoot,
                pageId: pageId,
                pageSize: 30,
                defaultPageNumber: 1,
                defaultOrderType: 1,
                userInfo: userInfo,
                isShowReply2: false,//是否在第一屏显示二级回复
                isOnlyAdminReply: false, //TODO 是否只有管理员可以回复
                isOnlyShowRepliedMsg: false, //TODO 是否只显示被回复过的.
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
                    setCurrentTempUser(u);
                    view.outSetUserInfo(u);
                }
            });
            view.outSetUserInfo(userInfo);

            this.viewHandler = view;
        }.bind(this));

    }

    shouldComponentUpdate(nextProps, nextState) {
        var userObj = this.props.user || {};
        var userObjNext = nextProps.user || {};
        var user1 = userObj.userInfo || {};
        var user2 = userObjNext.userInfo || {};
        if (user1.id != user2.id || user1.nickname != user2.nickname
            || user1.mail != user2.mail
            || user1.username != user2.username || user1.avatar != user2.avatar
            || user1.lastLoginToken != user2.lastLoginToken) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if (this.viewHandler) {
            console.log('componentDidUpdate')
            var userInfo = this.getUserInfo();
            this.viewHandler.outSetUserInfo(userInfo);
        } else {
            this.initAvatarView();
        }
    }

    render() {
        return (
            <div className="avatar-react-root" ref='avatarRoot'></div>
        );
    }
}
