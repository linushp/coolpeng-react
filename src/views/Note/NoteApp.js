import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import './index.less';

class NoteApp extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {
        const {user, actions} = this.props;
        return (
            <div className="article-page">
                <div className="article-container">
                    dfgsdfgfds
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}


export default NoteApp;
