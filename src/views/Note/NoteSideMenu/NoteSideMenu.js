import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import PopupOperation from '../../../components/PopupOperation/PopupOperation';
import {immutableListMap,className,getDataFromImmutableOrPlain,isImmutable,uniqueId} from '../../../core/utils/index';
import {parsePathParams,getCategoryAllChildrenId} from '../NoteFunctions';
import Icon from "../../../components/icons/Icon";
import ReactForm from '../../../components/form/ReactForm';
import NoteCategoryItem from './NoteCategoryItem';
import './NoteSidebar.less';


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
        this.noteSideBarUniqueId = uniqueId('NoteSidebarSidebarUniqueId_');
        this.state = {
            isEditing:false,
            menuNoteExpand:true
        };
        this.currentMenuItem = null;
    }

    onClickUploadFile(){
        
    }

    onClickCreateNote(item) {
        if(!item){
            item = this.currentMenuItem;
        }
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
        this.setCategoryItemExpand(parentCategory,true);
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

    getPopButtons(type,item) {
        var funcWrapperCancelALL = this.funcWrapperCancelALL.bind(this);
        var onClickCreateNote     = funcWrapperCancelALL(this.onClickCreateNote.bind(this, item));
        var onClickCreateCategory = funcWrapperCancelALL(this.onClickCreateCategory.bind(this, item));
        var onClickDeleteCategory = funcWrapperCancelALL(this.onClickDeleteCategory.bind(this, item));
        var onClickRenameCategory = funcWrapperCancelALL(this.onClickRenameCategory.bind(this, item));

        if(type=="item"){
            return [
                {text: '新建笔记', onClick: onClickCreateNote},
                {text: '新建分类', onClick: onClickCreateCategory},
                {text: '删除', onClick: onClickDeleteCategory},
                {text: '重命名', onClick: onClickRenameCategory}
            ];
        }

        if(type=="topCreate"){
            return [
                {text: '新建笔记', onClick: onClickCreateNote},
                {text: '新建分类', onClick: onClickCreateCategory}
            ];
        }

        if(type=="topUpload"){
            return [
                {text: '上传图片', onClick: onClickCreateNote},
                {text: '上传文件', onClick: onClickCreateCategory}
            ];
        }

    }


    getMenuSelectType(M,pathParams) {
        var routeCId = pathParams.c;
        // console.log("getMenuSelectType",routeCId,M.get('id'))
        if(routeCId===M.get('id')){
            this.currentMenuItem = M;
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


    onClickMenuToggle(stateName){
        var oldValue = this.state[stateName];
        var map = {};
        map[stateName] = !oldValue;
        this.setState(map);
    }


    isCategoryItemExpand(item){
        var id = item.get('id');
        return this.state["CategoryItemExpand_" + id] || false;
    }

    setCategoryItemExpand(item,isExpand){
        if(item){
            var id = item.get('id');
            var m = {};
            m["CategoryItemExpand_" + id] = isExpand;
            this.setState(m);
        }
    }



    renderCategoryList(children, CategoryList, deep, that,isExpand) {
        var noteCategoryItemCallbacks = that.createNoteCategoryItemCallbacks(that);
        var getPopButtons = that.getPopButtons.bind(that);
        var noteSideBarUniqueId = that.noteSideBarUniqueId;
        var getMenuSelectType = that.getMenuSelectType.bind(that);
        var isExpand = isExpand || false;
        var pathParams = that.props.pathParams;
        return (
            <ul className={`menu-ul menu-ul-expand-${isExpand}`}>
                {immutableListMap(children, function (item, i) {
                    var link1 = toLinkURL(item);
                    var name = item.get('name');
                    var menuSelectType = getMenuSelectType(item,pathParams);
                    var classObj = {};
                    classObj['menu-level'] = true;
                    classObj['menu-level-' + deep] = true;
                    classObj['menu-select-' + menuSelectType] = true;
                    var classMenu1 = className(classObj);
                    var isExpand = that.isCategoryItemExpand(item);
                    return (
                        <li>
                            <div className={classMenu1} key={link1}>
                                <NoteCategoryItem
                                    isExpand={isExpand}
                                    item={item}
                                    name={name}
                                    toLink={link1}
                                    setCategoryItemExpand={that.setCategoryItemExpand.bind(that)}
                                    noteSideBarUniqueId={noteSideBarUniqueId}
                                    btns={getPopButtons("item",item)}
                                    callbacks={noteCategoryItemCallbacks}>
                                </NoteCategoryItem>
                            </div>
                            {that.renderCategoryList(item.get('children'), CategoryList, deep + 1, that,isExpand)}
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
        var getPopButtons = this.getPopButtons.bind(this);
        return (
            <div className="note-sidebar" id={noteSideBarUniqueId}>

                <div className="top">
                    <div className="top-create">
                        <PopupOperation btns={getPopButtons("topCreate")}>
                            <Icon type="creates" className="top-icon"></Icon>
                            <span className="create-text">新建</span>
                            <Icon type="arrow" className="top-icon2"></Icon>
                        </PopupOperation>
                    </div>
                    <div className="top-upload">
                        <PopupOperation btns={getPopButtons("topUpload")}>
                            <Icon type="uploads" className="top-icon"></Icon>
                            <span className="create-text">上传</span>
                            <Icon type="arrow" className="top-icon2"></Icon>
                        </PopupOperation>
                    </div>
                </div>


                <div style={{display:'none'}}>
                    <button className="CreateCategory" disabled={isDisableCreateCategory} onClick={onClickCreateCategoryEmpty}>新建分类</button>
                </div>
                <div className={`menu cp-expand-${this.state.menuNoteExpand}`}>
                    <div className="menu-name">
                        <div className="menu-arrow" onClick={this.onClickMenuToggle.bind(this,"menuNoteExpand")}>
                            <Icon type={`arrow-${this.state.menuNoteExpand}`}  />
                        </div>
                        <Icon type="folder1" className="menu-icon"/>
                        <span><Link to="/note/"> 我的随笔</Link></span>
                    </div>
                    
                    {this.renderCategoryList(CategoryList,CategoryList,0,that,this.state.menuNoteExpand)}
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
