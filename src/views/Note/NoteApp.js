import {Link} from 'react-router'
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar} from '../../core/utils/index';
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
        let {actions,user} = this.props;
        var userInfo = user.userInfo || {};
        actions.getNoteCategory({ownerUserId: userInfo.id});
        actions.getNoteListByCategory({pathParams: pathParams, pageSize: pathParams.ps, pageNumber: pathParams.pn});
        actions.getNoteById({id: pathParams.n});//nextParams.n 有可能为null
    }


    reloadNoteListByCategory() {
        let currentPath = this.props.routeParams.currentPath;
        let pathParams = parsePathParams(currentPath);
        let {actions,user} = this.props;
        actions.getNoteListByCategory({pathParams: pathParams, pageSize: pathParams.ps, pageNumber: pathParams.pn});
    }


    componentWillReceiveProps(nextProps) {
        var nextPath = nextProps.routeParams.currentPath;
        var currentPath = this.props.routeParams.currentPath;

        let {actions} = this.props;
        let nextParams = parsePathParams(nextPath);
        var paramChanged = isPathParamChanged(nextPath, currentPath);

        if (paramChanged.g || paramChanged.m || paramChanged.ps || paramChanged.pn) {
            actions.getNoteListByCategory({pathParams: nextParams, pageSize: nextParams.ps, pageNumber: nextParams.pn});
        }

        if (paramChanged.n) {
            //nextParams.n 有可能为null
            actions.getNoteById({id: nextParams.n});
        }
    }

    render() {
        const {NoteVO,NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,CategoryList,user,actions} = this.props;
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
                        pathParams,
                        actions
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
    CategoryList: 'note.CategoryList',
    NoteVO: 'note.NoteVO',

    user: 'user'
};

NoteApp.ACTION_CONFIG = {
    'getNoteListByCategory': 'note.getNoteListByCategory',
    'getNoteCategory': 'note.getNoteCategory',
    'getNoteById': 'note.getNoteById',
    'saveOrUpdateNote': 'note.saveOrUpdateNote',
    'deleteNote': 'note.deleteNote',
    'setCurrentTempUser': 'user.setCurrentTempUser'
};

export default ActionStoreHelper()(NoteApp);
