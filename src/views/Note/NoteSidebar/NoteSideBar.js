import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain,isImmutable} from '../../../core/utils/index';
import {parsePathParams,getCurrentCategoryByPath,isPathParamChanged} from '../NoteFunctions';
import ReactForm from '../../../components/form/ReactForm';
import NoteCategoryItem from './NoteCategoryItem';
import './index.less';

const LEVEL_GROUP = "group";
const LEVEL_MODULE = "module";

function toLinkURL(item, s) {
    try {
        var link1 = '/note/g' + item.get('id');
        if (s) {
            link1 = link1 + '-m' + s.get('id');
        }
        return link1;
    }catch (e){
        return '';
    }
}

function toLinkURLEditor(item, s) {
    return toLinkURL(item, s) + '-e1';
}


class NoteSidebar extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    onClickCreateNote(item, s) {
        var link = toLinkURLEditor(item, s);
        this.context.router.push(link);
    }

    onClickCreateCategory(item, s) {
        var level = LEVEL_MODULE;
        var parentId = null;
        var parentLevel = null;
        if (!item) {
            parentId = null;
            level = LEVEL_GROUP;
            parentLevel = null;
        } else {
            parentId = item.get('id');
            level = LEVEL_MODULE;
            parentLevel = LEVEL_GROUP
        }

        if (item && s) {
            parentId = s.get('id');
            level = LEVEL_MODULE;
            parentLevel = LEVEL_MODULE
        }

        //两个参数都有可能为null
        //if(!item && !s){
        const {actions} = this.props;
        actions.staticCreateNoteCategory({
            id: null,
            name: '',
            desc: '',
            level: level,
            parentId: parentId,
            parentLevel: parentLevel,
            isEditing: true
        });
        //}
    }

    onSaveCategory(item,name){
        item = item.set('name',name);
        var CategoryVO = item.toJS();
        var actions = this.props.actions;
        actions.saveOrUpdateNoteCategory({CategoryVO:CategoryVO},function(){
            actions.getNoteCategory();
        });
    }

    onClickDeleteCategory(item, s) {
        var CategoryVO = s || item;
        CategoryVO = CategoryVO.toJS();
        var actions = this.props.actions;
        actions.deleteNoteCategory({CategoryVO:CategoryVO},function(){
            actions.getNoteCategory();
        });
    }

    onClickRenameCategory(item, s) {
        var m = (s||item).toJS();
        //TODO 二级分类点击时没有反应,.
        var actions = this.props.actions;
        actions.staticUpdateNoteCategory({
            finder:{
                id:m.id,
                level:m.level
            },
            newValue:{
                isEditing: true
            }
        });
        //var obj = updateImmutableObject({id:'id',level:'dd'},{});
    }


    createPopupOperation(item, s) {
        var onClickCreateNote = this.onClickCreateNote.bind(this, item, s);
        var onClickCreateCategory = this.onClickCreateCategory.bind(this, item, s);
        var onClickDeleteCategory = this.onClickDeleteCategory.bind(this, item, s);
        var onClickRenameCategory = this.onClickRenameCategory.bind(this, item, s);
        var level = getDataFromImmutableOrPlain(s || item, 'level');
        return [
            {text: '新建笔记', onClick: onClickCreateNote},
            {text: '新建分类', onClick: onClickCreateCategory, isDisplay: level == LEVEL_GROUP},
            {text: '删除', onClick: onClickDeleteCategory},
            {text: '重命名', onClick: onClickRenameCategory}
        ];
    }


    isMenuSelect(gg, mm) {
        var pathname = window.location.pathname;
        pathname = pathname.replace('/note/', '');
        var routeParams = parsePathParams(pathname);
        if (mm) {
            return mm.get('id') == routeParams.m && gg.get('id') == routeParams.g;
        }
        return gg.get('id') == routeParams.g;
    }

    createNoteCategoryItemCallbacks(_this){
        return {
            onSaveCategory:_this.onSaveCategory.bind(_this)
        }
    }

    render() {
        const {CategoryList,userInfo, actions} = this.props;
        var createPopupOperation = this.createPopupOperation.bind(this);
        var isMenuSelect = this.isMenuSelect.bind(this);
        var that = this;
        var onClickCreateCategoryEmpty = function(){
            that.onClickCreateCategory();
        };

        var noteCategoryItemCallbacks = this.createNoteCategoryItemCallbacks(this);
        return (
            <div className="note-sidebar">

                <button onClick={onClickCreateCategoryEmpty}>新建分类</button>


                <ul>

                    {immutableListMap(CategoryList, function (item, i) {

                        var link1 = toLinkURL(item);
                        var children = item.get('children');
                        var name = item.get('name');
                        var classMenu1 = className({
                            'menu1': true,
                            'menu-select': isMenuSelect(item)
                        });
                        return (
                            <li>
                                <div className={classMenu1} key={link1}>
                                    <NoteCategoryItem
                                        item={item}
                                        name={name}
                                        toLink={link1}
                                        btns={createPopupOperation(item)}
                                        callbacks={noteCategoryItemCallbacks}>
                                    </NoteCategoryItem>
                                </div>
                                <ul>
                                    {immutableListMap(children, function (s, i) {
                                        var link2 = toLinkURL(item, s);
                                        var classMenu2 = className({
                                            'menu2': true,
                                            'menu-select': isMenuSelect(item, s)
                                        });
                                        return (
                                            <li>
                                                <div className={classMenu2} key={link2}>-------
                                                    <NoteCategoryItem
                                                        item={s}
                                                        name={s.get('name')}
                                                        toLink={link2}
                                                        btns={createPopupOperation(item,s)}
                                                        callbacks={noteCategoryItemCallbacks} >
                                                    </NoteCategoryItem>
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

NoteSidebar.STATE_CONFIG = {
    CategoryList: 'note.CategoryList',
    userInfo: 'user.userInfo'
};

NoteSidebar.ACTION_CONFIG = {
    'staticUpdateNoteCategory':'note.staticUpdateNoteCategory',
    'staticCreateNoteCategory':'note.staticCreateNoteCategory',
    'saveOrUpdateNoteCategory':'note.saveOrUpdateNoteCategory',
    'getNoteListByCategory':'note.getNoteListByCategory',
    'getNoteCategory':'note.getNoteCategory',
    'deleteNoteCategory':'note.deleteNoteCategory'
};

export default ActionStoreHelper()(NoteSidebar);
