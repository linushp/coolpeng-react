import {Link} from 'react-router'
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain} from '../../core/utils/index';
import PopupOperation from '../../components/PopupOperation/PopupOperation';

import './index.less';

const LEVEL_GROUP = "group";
const LEVEL_MODULE = "module";



function toLinkURL(item,s){
    var link1 = '/note/g'+item.get('id');
    if(s){
        link1 = link1 + '-m' + s.get('id');
    }
    return link1;
}

function toLinkURLEditor(item,s){
    return toLinkURL(item,s) + '-e1';
}


class NoteSidebar extends PureRenderComponent  {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    onClickCreateNote(item,s){
        var link = toLinkURLEditor(item,s);
        this.context.router.push(link);
    }

    onClickCreateCategory(item,s){

    }

    onClickDeleteCategory(item,s){

    }

    onClickRemoveCategory(item,s){

    }


    createPopupOperation(item,s){
        var onClickCreateNote = this.onClickCreateNote.bind(this,item,s);
        var onClickCreateCategory = this.onClickCreateCategory.bind(this,item,s);
        var onClickDeleteCategory = this.onClickDeleteCategory.bind(this,item,s);
        var onClickRemoveCategory = this.onClickRemoveCategory.bind(this,item,s);
        var level = getDataFromImmutableOrPlain(s || item,'level');
        return [
            {text:'新建笔记',onClick:onClickCreateNote},
            {text:'新建分类',onClick:onClickCreateCategory,isDisplay:level==LEVEL_GROUP},
            {text:'删除',onClick:onClickDeleteCategory},
            {text:'重命名',onClick:onClickRemoveCategory}
        ];
    }

    render() {
        const {CategoryList,userInfo, actions} = this.props;
        var pathname = location.pathname;
        var createPopupOperation = this.createPopupOperation.bind(this);
        return (
            <div className="note-sidebar">

                <ul>

                    {immutableListMap(CategoryList,function(item,i){

                        var link1 = toLinkURL(item);
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
                                    <PopupOperation btns={createPopupOperation(item)}>操作</PopupOperation>
                                </div>
                                <ul>
                                    {immutableListMap(children,function(s,i){
                                        var link2 =  toLinkURL(item,s);
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
                                                    <PopupOperation btns={createPopupOperation(item,s)}>操作</PopupOperation>
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
