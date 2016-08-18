import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import './index.less';


class NoteSingle extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="article-single">
                Single
            </div>
        );
    }
}


export default NoteSingle;
