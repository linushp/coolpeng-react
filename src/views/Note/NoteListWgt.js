import {Link} from 'react-router'
import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className} from '../../core/utils/index';
import {toPathParamString} from './NoteFunctions';
import './index.less';


class NoteList extends PureRenderComponent {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    render() {
        const {NoteList,NoteListTotalCount,NoteListPageSize,NoteListPageNumber,pathParams} = this.props;

        var path = '/note/';
        if (pathParams.g) {
            path += 'g' + pathParams.g;
        }
        if (pathParams.m) {
            path += '-m' + pathParams.m;
        }
        var createPath = path + '-e1';

        return (
            <div>
                <Link to={createPath}>新建Note</Link>

                <div className="article-list">
                    {immutableListMap(NoteList, function (v) {
                        var nn = Object.assign({}, pathParams, {n: v.get('id')});
                        var mm = toPathParamString(nn, ['g', 'm', 'n', 'ps', 'pn']);
                        var link = '/note/' + mm;
                        return (
                            <div>
                                <Link to={link}>  {v.get('postTitle')} </Link>
                                <Link to={link+'-e1'}> 编辑</Link>
                            </div>);
                    })}
                </div>
            </div>

        );
    }
}

export default NoteList;