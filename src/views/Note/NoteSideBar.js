import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap} from '../../core/utils/index';
import './index.less';


class NoteSidebar extends PureRenderComponent  {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions,userInfo} = this.props;
        actions.getNoteCategory({ ownerUserId:userInfo.id});
    }

    render() {
        const {note,userInfo, actions} = this.props;
        var CategoryList = note.get('CategoryList') || [];
        debugger;
        return (
            <div className="article-sidebar">
                {immutableListMap(CategoryList,function(item,i){
                    return (
                        <div>
                            {item.get('name')}
                        </div>);
                })}
            </div>
        );
    }
}

//export default NoteSidebar;

NoteSidebar.STATE_CONFIG = {
    note: 'note',
    userInfo:'user.userInfo'
};

NoteSidebar.ACTION_CONFIG = {
    'getNoteCategory':'note.getNoteCategory'
};

export default ActionStoreHelper()(NoteSidebar);
