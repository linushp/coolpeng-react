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
            pageId: "test2",
            pageSize:30,
            defaultPageNumber:1,
            defaultOrderType:1,


            userInfo: userInfo,
            innerSetUserInfo: function (userInfo) {
                console.log(userInfo)
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
