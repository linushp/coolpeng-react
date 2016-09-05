import {Link} from 'react-router'
import ReactPagination from '../../components/Pagination/ReactPagination';
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar,uniqueId} from '../../core/utils/index';
import {toPathParamString} from './NoteFunctions';
import ReactForm,{getReactFormValue} from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';
import Icon from "../../components/icons/Icon";
import './index.less';

function getViewNoteURLPagination(pn) {
    var pathParams = globalVar('pathParams');
    var nn = Object.assign({}, pathParams, {pn: pn});
    var mm = toPathParamString(nn, ['c', 'n', 'ps', 'pn']);
    var link = '/note/' + mm;
    return link;
}

class NoteList extends PureRenderComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
        this.SearchFormLayout = [
            {name: 'Search', type: 'input',placeholder:"搜索",onEnterKey:this.onSearchNoteList.bind(this)}
        ];
        this.reactFormUniqueId = uniqueId("reactFormUniqueId");
    }


    componentWillMount() {
        const {actions} = this.props;
    }

    onDeleteNote(noteItem){
        const {actions} = this.props;
        Dialog.showAlertPrompt('确定要删除吗?',function(btn){
            if(btn.name==='ok'){
                var NoteVO = noteItem.toJS();
                actions.deleteNote({NoteVO:NoteVO},function(){
                    Dialog.showMsgSuccess('删除成功');
                });
            }
        });
    }

    onClickPagination(pn){
        var url = getViewNoteURLPagination(pn);
        this.context.router.push(url);
    }


    onSearchNoteList(){
        var searchText = getReactFormValue(this.reactFormUniqueId,'Search');
        const {reloadNoteListByCategory} = this.props;
        reloadNoteListByCategory(searchText);
    }

    getCreateRoutePath(){
        const {pathParams} = this.props;
        var path = '/note/';
        if (pathParams.c) {
            path += 'c' + pathParams.c;
        }
        return path + '-e1';
    }



    renderNoteList(NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike){

        if(!NoteList || NoteList.size==0){
            return null;
        }

        var that = this;

        return (
            <div>
                <div>
                    <div className="note-list-list">
                        {immutableListMap(NoteList, function (v) {
                            var nn = Object.assign({}, pathParams, {n: v.get('id')});
                            var mm = toPathParamString(nn, ['c', 'n', 'ps', 'pn']);
                            var link = '/note/' + mm;
                            var summary = v.get("summary");
                            return (
                                <div className="note-list-item">
                                    <div className="postTitle">
                                        <Link to={link}>{v.get('postTitle')}</Link>
                                    </div>

                                    <div className="operation">
                                        <Icon type="more" className="note-list-item-pp"></Icon>
                                        <Link to={link+'-e1'} className="pp">
                                            <Icon type="edit"></Icon>
                                        </Link>
                                        <span className="pp" onClick={that.onDeleteNote.bind(that,v)}>
                                            <Icon type="del"></Icon>
                                        </span>
                                    </div>

                                    <Link to={link}>
                                        {(!summary||summary.length===0)?null:<div className="summary">{summary}</div>}
                                        <div class="date-size">
                                            <span className="createTime">{v.get('createTime')}</span>
                                            <span className="categoryId">{v.get("categoryId")}</span>
                                        </div>
                                    </Link>
                                </div>);
                        })}
                    </div>
                </div>
                <div className="note-list-page">
                    <ReactPagination pageSize={NoteListPageSize} pageNo={NoteListPageNumber} totalCount={NoteListTotalCount} onClickPagination={this.onClickPagination.bind(this)}></ReactPagination>
                </div>
            </div>
        );
    }





    renderEmptyList(NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike){
        if(!NoteList || NoteList.size==0){
            return (
                <div className="note-list-empty">
                    <span className="emptyText">没有找到随笔</span>
                    <Link className="createButton" to={this.getCreateRoutePath()}>新建随笔</Link>
                </div>
            );
        }
        return null;
    }




    render() {
        const {NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike} = this.props;

        var that  = this;

        var searchFormValues = {
            Search:NoteListSearchTitleLike
        };
        // <Link to={this.getCreateRoutePath()}>新建Note</Link>

        return (
            <div>
                <div className="note-list-search">
                    <Icon type="listBack" />
                    <div className="NoteListSearchForm">
                        <ReactForm id={this.reactFormUniqueId} layout={this.SearchFormLayout} values={searchFormValues}></ReactForm>
                        <Icon type="search" onClick={this.onSearchNoteList.bind(this)}>查找</Icon>
                    </div>
                    <Icon type="settingAbstract" />
                </div>
                {this.renderNoteList(NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike)}
                {this.renderEmptyList(NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike)}
            </div>

        );
    }
}

export default NoteList;