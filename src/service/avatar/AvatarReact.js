import AvatarView from './avatarView';


export default class AvatarReact extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    componentDidMount() {
        var avatarRoot = this.refs.avatarRoot.getDOMNode();//拿到了原生DOM
        var view = new AvatarView({
            DOM:avatarRoot,
            pageId:"test"
        });
    }

    render() {
        return (
            <div className="avatar-react-root" ref='avatarRoot'>
            </div>
        );
    }
}
