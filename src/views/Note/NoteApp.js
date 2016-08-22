import {Link} from 'react-router'
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar,isEmpty,_undefined} from '../../core/utils/index';
import {parsePathParams,getCurrentCategoryByPath,isPathParamChanged} from './NoteFunctions';
import NoteListWgt from './NoteListWgt';
import NoteSingleWgt from './NoteSingleWgt';
import './index.less';


class NoteApp extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        let currentPath = this.props.routeParams.currentPath;
        let pathParams = parsePathParams(currentPath);
        let {actions,user,NoteListSearchTitleLike} = this.props;
        var userInfo = user.userInfo || {};
        if (isEmpty(this.props.CategoryList)) {
            actions.getNoteCategory({ownerUserId: userInfo.id});
        }
        if (isEmpty(this.props.NoteList)) {
            var titleLike = NoteListSearchTitleLike;
            actions.getNoteListByCategory({
                pathParams: pathParams,
                pageSize: pathParams.ps,
                pageNumber: pathParams.pn,
                titleLike: titleLike
            });
        }
        if (isEmpty(this.props.NoteVO)) {
            actions.getNoteByIdWithReply({id: pathParams.n});//nextParams.n 有可能为null
        }
    }


    /**
     * 两个功能:
     *      1. 中间文章列表,搜索功能点击,需要传入titleLike参数
     *      2. 文章编辑或新建完成后,重新加载文章列表.不会传入titleLike参数
     * @param titleLike
     */
    reloadNoteListByCategory(titleLike) {
        let currentPath = this.props.routeParams.currentPath;
        let pathParams = parsePathParams(currentPath);
        let {actions,user,NoteListSearchTitleLike} = this.props;
        if (titleLike === _undefined) {
            titleLike = NoteListSearchTitleLike;
        }
        actions.getNoteListByCategory({
            pathParams: pathParams,
            pageSize: pathParams.ps,
            pageNumber: pathParams.pn,
            titleLike: titleLike
        });
    }


    /**
     *
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        var nextPath = nextProps.routeParams.currentPath;
        var currentPath = this.props.routeParams.currentPath;

        let {actions,NoteListSearchTitleLike} = this.props;
        let nextParams = parsePathParams(nextPath);
        var paramChanged = isPathParamChanged(nextPath, currentPath);

        /**
         *
         * 两个功能可以触发:
         *  1. 点击左侧分类目录. 改变 g m ,清除掉搜索条件
         *  2. 文章分页按钮点击, 不该表gm
         *
         */
        if (paramChanged.g || paramChanged.m || paramChanged.ps || paramChanged.pn) {
            actions.getNoteListByCategory({
                pathParams: nextParams,
                pageSize: nextParams.ps,
                pageNumber: nextParams.pn,
                titleLike: (paramChanged.g || paramChanged.m)?'':NoteListSearchTitleLike
            });
        }

        if (paramChanged.n) {
            //nextParams.n 有可能为null
            actions.getNoteByIdWithReply({id: nextParams.n});
        }
    }

    render() {
        const {NoteVO,NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,NoteListSearchTitleLike,CategoryList,user,actions} = this.props;
        //g1-m2-n3
        let currentPath = this.props.routeParams.currentPath;
        let pathParams = parsePathParams(currentPath);
        globalVar('pathParams', pathParams);
        var isEditing = (!!pathParams.e);
        var reloadNoteListByCategory = this.reloadNoteListByCategory.bind(this);
        return (
            <div className="note-page">
                <div className="note-list">
                    <NoteListWgt {...{
                        NoteList,
                        NoteListTotalCount,
                        NoteListPageSize,
                        NoteListPageNumber,
                        NoteListSearchTitleLike,
                        pathParams,
                        actions,
                        reloadNoteListByCategory
                    }} ></NoteListWgt>
                </div>
                <div className="note-content">
                    <NoteSingleWgt {...{NoteVO, user, actions, isEditing, reloadNoteListByCategory}}></NoteSingleWgt>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}


NoteApp.STATE_CONFIG = {
    NoteList: 'note.NoteList',
    NoteListTotalCount: 'note.NoteListTotalCount',
    NoteListPageSize: 'note.NoteListPageSize',
    NoteListPageNumber: 'note.NoteListPageNumber',
    NoteListSearchTitleLike: 'note.NoteListSearchTitleLike',
    CategoryList: 'note.CategoryList',
    NoteVO: 'note.NoteVO',
    user: 'user'
};

NoteApp.ACTION_CONFIG = {
    'getNoteListByCategory': 'note.getNoteListByCategory',
    'getNoteCategory': 'note.getNoteCategory',
    'getNoteByIdWithReply': 'note.getNoteByIdWithReply',
    'saveOrUpdateNote': 'note.saveOrUpdateNote',
    'deleteNote': 'note.deleteNote',
    'changeSearchText': 'note.changeSearchText',
    'setCurrentTempUser': 'user.setCurrentTempUser'
};

export default ActionStoreHelper()(NoteApp);
