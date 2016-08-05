import AvatarView from './avatarView';


export default class AvatarReact extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    getUserInfo() {
        var userObj = this.props.user || {};
        var user = userObj.user;
        return {
            nickname: user.nickname,
            email: user.mail,
            avatar: user.avatar,
            tokenId: user.lastLoginToken,
            devicePlatform: user.lastLoginDevPlatform,
            uuid: user.lastLoginDevUid,
            hasLogin: userObj.isLogged,
            isAdmin: user.permission === 'admin'
        };
    }

    componentDidMount() {

        console.log('componentDidMount');

        var userObj = this.props.user || {};
        var user = userObj.user;
        var pageId = this.props.pageId || "test";
        var actions = this.props.actions;

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
                actions.setCurrentTempUser(u);
                view.outSetUserInfo(u);
            }
        });
        view.outSetUserInfo(userInfo);

        this.viewHandler = view;
    }

    shouldComponentUpdate(nextProps, nextState) {
        var userObj = this.props.user || {};
        var userObjNext = nextProps.user || {};
        var user1 = userObj.user || {};
        var user2 = userObjNext.user || {};
        if (user1.id != user2.id || user1.nickname != user2.nickname
            || user1.mail != user2.mail
            || user1.username != user2.username||user1.avatar != user2.avatar
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
        }
    }

    render() {
        return (
            <div className="avatar-react-root" ref='avatarRoot'>
            </div>
        );
    }
}
