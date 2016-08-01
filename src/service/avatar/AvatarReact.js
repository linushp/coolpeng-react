import AvatarView from './avatarView';


export default class AvatarReact extends React.Component {
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
            isShowReply2:false,//是否在第一屏显示二级回复
            userInfo: userInfo,
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

        window.COOLPEBG_REPLY_setUserInfo = function(u){
            view.outSetUserInfo(u);
        }

    }

    render() {
        return (
            <div className="avatar-react-root" ref='avatarRoot'>
            </div>
        );
    }
}
