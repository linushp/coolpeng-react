import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import './index.less';


class NoteSidebar extends PureRenderComponent  {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        //const {actions,userInfo} = this.props;
        //actions.getNoteCategory({ ownerUserId:userInfo.id});
    }

    render() {
        debugger;
        const {data, actions} = this.props;
        return (
            <div className="article-sidebar">
                对对对
            </div>
        );
    }
}

export default NoteSidebar;

//NoteSidebar.STATE_CONFIG = {
//    CategoryList: 'CategoryList',
//    userInfo:'user.userInfo'
//};
//
//NoteSidebar.ACTION_CONFIG = {
//    'getNoteCategory':'note.getNoteCategory'
//};
//
//
//export default ActionStoreHelper()(NoteSidebar);
