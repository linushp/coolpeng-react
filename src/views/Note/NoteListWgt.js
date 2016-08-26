import {Link} from 'react-router'
import ReactPagination from '../../components/Pagination/ReactPagination';
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar} from '../../core/utils/index';
import {toPathParamString} from './NoteFunctions';
import ReactForm from '../../components/form/ReactForm';
import Dialog from '../../components/dialog/Dialog';
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
            {name: 'Search', type: 'input'}
        ];
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
        var searchText = this.getReactFormValue('SearchForm','Search');
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


    render() {
        const {NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams,NoteListSearchTitleLike} = this.props;

        var that  = this;

        var searchFormValues = {
            Search:NoteListSearchTitleLike
        };

        return (
            <div>
                <Link to={this.getCreateRoutePath()}>新建Note</Link>

                <div>
                    <ReactForm ref="SearchForm" layout={this.SearchFormLayout} values={searchFormValues}></ReactForm>
                    <button onClick={this.onSearchNoteList.bind(this)}>查找</button>
                </div>

                <div className="note-list-list">
                    {immutableListMap(NoteList, function (v) {
                        var nn = Object.assign({}, pathParams, {n: v.get('id')});
                        var mm = toPathParamString(nn, ['c', 'n', 'ps', 'pn']);
                        var link = '/note/' + mm;
                        return (
                            <div>
                                <Link to={link}>  {v.get('postTitle')} </Link>
                                <Link to={link+'-e1'}> 编辑</Link>
                                <span onClick={that.onDeleteNote.bind(that,v)}> 删除</span>
                            </div>);
                    })}
                </div>
                <div className="note-list-page">
                    <ReactPagination pageSize={NoteListPageSize} pageNo={NoteListPageNumber} totalCount={NoteListTotalCount} onClickPagination={this.onClickPagination.bind(this)}></ReactPagination>
                </div>
            </div>

        );
    }
}

export default NoteList;