import {Link} from 'react-router'
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className} from '../../core/utils/index';

import './index.less';


class NoteSidebar extends PureRenderComponent  {
    constructor(props) {
        super(props);
    }

    render() {
        const {CategoryList,userInfo, actions} = this.props;
        var pathname = location.pathname;

        return (
            <div className="note-sidebar">

                <ul
                      selectedKeys = {[pathname]}>
                    {immutableListMap(CategoryList,function(item,i){
                        var link1 = '/note/g'+item.get('id');
                        var children = item.get('children');
                        var name = item.get('name');
                        var classMenu1 = className({
                            'menu1':true,
                            'menu-select': pathname==link1
                        });
                        return (
                            <li>
                                <div className={classMenu1} key={link1}>
                                    <Link to={link1}> {name} </Link>
                                </div>
                                <ul>
                                    {immutableListMap(children,function(s,i){
                                        var link2 =  link1 + '-m' + s.get('id');
                                        var classMenu2 = className({
                                            'menu2':true,
                                            'menu-select': pathname==link2
                                        });
                                        return (
                                            <li>
                                                <div className={classMenu2} key={link2} >
                                                    <Link to={link2}>
                                                        --- {s.get('name')}
                                                    </Link>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

//export default NoteSidebar;

NoteSidebar.STATE_CONFIG = {
    CategoryList: 'note.CategoryList',
    userInfo:'user.userInfo'
};

NoteSidebar.ACTION_CONFIG = {
    //'getNoteCategory':'note.getNoteCategory'
};

export default ActionStoreHelper()(NoteSidebar);
