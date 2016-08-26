import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain,isImmutable,uniqueId} from '../../../core/utils/index';
import {parsePathParams,isPathParamChanged,getCategoryAllChildrenId} from '../NoteFunctions';
import ReactForm from '../../../components/form/ReactForm';
import NoteCategoryItem from './NoteCategoryItem';
import './NoteSidebar.less';

const LEVEL_GROUP = "group";
const LEVEL_MODULE = "module";

function toLinkURL(item) {
    try {
        return '/note/c' + item.get('id');
    }catch (e){
        return '';
    }
}

function toLinkURLEditor(item) {
    return toLinkURL(item) + '-e1';
}


class NoteSideMenu extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.noteSideBarUniqueId = uniqueId('NoteSidebarSidebarUniqueId_')
        this.state = {
            isEditing:false
        };
    }

    onClickCreateNote(item) {
        var link = toLinkURLEditor(item);
        this.context.router.push(link);
    }

    onClickCreateCategory(parentCategory) {
        var parentId = getDataFromImmutableOrPlain(parentCategory,'id');
        //两个参数都有可能为null
        const {actions} = this.props;
        actions.staticCreateNoteCategory({
            id: null,
            name: '新建文件夹',
            desc: '',
            parentId: parentId,
            isEditing: true
        });

        this.setState({isEditing:true});
    }

    onSaveCategory(item,name){
        var that = this;
        item = item.set('name',name);
        var CategoryVO = item.toJS();
        var actions = this.props.actions;
        actions.saveOrUpdateNoteCategory({CategoryVO:CategoryVO},function(){
            that.setState({isEditing:false});
        });
    }

    onClickDeleteCategory(item) {
        var that = this;
        var CategoryVO =item;
        CategoryVO = CategoryVO.toJS();
        var actions = this.props.actions;
        actions.deleteNoteCategory({CategoryVO:CategoryVO},function(){
            that.setState({isEditing:false});
        });
    }

    onClickRenameCategory(parentCategory) {
        var m =  parentCategory.toJS();
        var actions = this.props.actions;
        actions.staticUpdateNoteCategory({
            finder:{
                id:m.id
            },
            newValue:{
                isEditing: true
            }
        });
        this.setState({isEditing:true});
    }


    /**
     * 点击取消编辑
     * @param item
     */
    onCancelCreateCategory(item){
        var m = item.toJS();
        var actions = this.props.actions;

        var id = m.id;
        var isDeleted = (!!id) ? false : true;

        actions.staticUpdateNoteCategory({
            finder: {
                id: m.id
            },
            newValue: {
                isDeleted: isDeleted,
                isEditing: false
            }
        });

        this.setState({isEditing:false});
    }


    funcWrapperCancelALL(callback){
        const {CategoryList} = this.props;
        var onCancelCreateCategory = this.onCancelCreateCategory.bind(this);
        return function (){
            CategoryList.forEach(function(item){
                onCancelCreateCategory(item);
                var children = item.get('children');
                if(children && children.size>0){
                    children.forEach(function(s){
                        onCancelCreateCategory(s);
                    })
                }
            });
            callback();
        }
    }

    createPopupOperation(item) {
        var funcWrapperCancelALL = this.funcWrapperCancelALL.bind(this);
        var onClickCreateNote     = funcWrapperCancelALL(this.onClickCreateNote.bind(this, item));
        var onClickCreateCategory = funcWrapperCancelALL(this.onClickCreateCategory.bind(this, item));
        var onClickDeleteCategory = funcWrapperCancelALL(this.onClickDeleteCategory.bind(this, item));
        var onClickRenameCategory = funcWrapperCancelALL(this.onClickRenameCategory.bind(this, item));
        return [
            {text: '新建笔记', onClick: onClickCreateNote},
            {text: '新建分类', onClick: onClickCreateCategory},
            {text: '删除', onClick: onClickDeleteCategory},
            {text: '重命名', onClick: onClickRenameCategory}
        ];
    }


    getMenuSelectType(M,CategoryList) {
        var pathname = window.location.pathname;
        pathname = pathname.replace('/note/', '');
        var routeParams = parsePathParams(pathname);
        var routeCId = routeParams.c;
        if(routeCId===M.get('id')){
            return 'cur';
        }

        var childrenId = getCategoryAllChildrenId(M);
        if(childrenId.indexOf(routeCId)>=0){
            return 'child';
        }

        return 'not';

    }

    createNoteCategoryItemCallbacks(_this){
        return {
            onSaveCategory:_this.onSaveCategory.bind(_this),
            onCancelCreateCategory:_this.onCancelCreateCategory.bind(_this)
        }
    }

    _isDisableCreateCategory(){
        return this.state.isEditing;
    }


    renderCategoryList(children, CategoryList, deep, that) {
        var noteCategoryItemCallbacks = that.createNoteCategoryItemCallbacks(that);
        var createPopupOperation = that.createPopupOperation.bind(that);
        var noteSideBarUniqueId = that.noteSideBarUniqueId;
        var getMenuSelectType = that.getMenuSelectType.bind(that);
        return (
            <ul>
                {immutableListMap(children, function (item, i) {
                    var link1 = toLinkURL(item);
                    var name = item.get('name');
                    var menuSelectType = getMenuSelectType(item,CategoryList);
                    var classObj = {};
                    classObj['menu-level-' + deep] = true;
                    classObj['menu-select-' + menuSelectType] = true;
                    var classMenu1 = className(classObj);
                    return (
                        <li>
                            <div className={classMenu1} key={link1}>
                                <NoteCategoryItem
                                    item={item}
                                    name={name}
                                    toLink={link1}
                                    noteSideBarUniqueId={noteSideBarUniqueId}
                                    btns={createPopupOperation(item)}
                                    callbacks={noteCategoryItemCallbacks}>
                                </NoteCategoryItem>
                            </div>
                            {that.renderCategoryList(item.get('children'), CategoryList, deep + 1, that)}
                        </li>
                    );
                })}
            </ul>);
    }


    render() {
        var that = this;

        const {CategoryList,userInfo, actions} = this.props;

        var onClickCreateCategoryEmpty = function(){
            that.onClickCreateCategory();
        };


        var isDisableCreateCategory = this._isDisableCreateCategory();
        var noteSideBarUniqueId = this.noteSideBarUniqueId;
        return (
            <div className="note-sidebar" id={noteSideBarUniqueId}>
                <div>
                    <button className="CreateCategory" disabled={isDisableCreateCategory} onClick={onClickCreateCategoryEmpty}>新建分类</button>
                </div>
                <div>
                    {this.renderCategoryList(CategoryList,CategoryList,0,that)}
                </div>
            </div>
        );
    }
}

NoteSideMenu.STATE_CONFIG = {
    CategoryList: 'note.CategoryList',
    userInfo: 'user.userInfo'
};

NoteSideMenu.ACTION_CONFIG = {
    'staticUpdateNoteCategory':'note.staticUpdateNoteCategory',
    'staticCreateNoteCategory':'note.staticCreateNoteCategory',
    'saveOrUpdateNoteCategory':'note.saveOrUpdateNoteCategory',
    'getNoteListByCategory':'note.getNoteListByCategory',
    'deleteNoteCategory':'note.deleteNoteCategory'
};

export default ActionStoreHelper()(NoteSideMenu);
