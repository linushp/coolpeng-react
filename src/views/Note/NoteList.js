import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import './index.less';


class NoteList extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {

        return (
            <div className="article-list">
                List
            </div>
        );
    }
}

export default NoteList;