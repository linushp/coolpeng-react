import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar} from '../../core/utils/index';
import {toPathParamString} from './NoteFunctions';
import AvatarReact from '../../service/avatar/AvatarReact';
import SimditorReact from '../../service/editor/SimditorReact';
import ReactForm from '../../components/form/ReactForm';
import './index.less';


function getViewNoteURL(noteId) {
    var pathParams = globalVar('pathParams');
    var nn = Object.assign({}, pathParams, {n: noteId});
    var mm = toPathParamString(nn, ['g', 'm', 'n', 'ps', 'pn']);
    var link = '/note/' + mm;
    return link;
}

class NoteSingle extends PureRenderComponent {


    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }


    getEditorContent() {
        var TitleForm = this.refs['TitleForm'];
        var TitleFormValue = TitleForm.getValues();
        var postTitle = TitleFormValue.postTitle;
        var editor = this.refs['SimditorReact'];

        var content = editor.getContentValue();

        return {
            postContent: content,
            postTitle: postTitle
        };
    }

    onSaveNote(NoteVO) {
        var pathParams = globalVar('pathParams');
        const {actions} = this.props;
        var editorContent = this.getEditorContent();
        var vo = {
            forumModuleId: pathParams.m
        };
        if (NoteVO) {
            vo = NoteVO.toJS();
        }

        var that = this;
        vo = Object.assign(vo, editorContent);

        actions.saveOrUpdateNote({NoteVO: vo}, function (resolved, payload,data,isSuccess) {
            if(isSuccess){
                alert("保存成功");
                var noteId = payload.data.id;
                var link = getViewNoteURL(noteId);
                that.context.router.push(link);
                that.props.reloadNoteListByCategory();
            }else {
                alert("保存失败");
            }
        });
    }

    renderEditing(NoteVO, user, actions, isEditing) {

        var content = "";
        var postTitle = "";
        if (NoteVO) {
            content = NoteVO.get('postContent');
            postTitle = NoteVO.get('postTitle');
        }
        console.log('renderEditing')

        var TitleFormLayout = [{name: 'postTitle', text: '标题', type: 'input'}];
        var TitleFormValues = {postTitle: postTitle};

        return (
            <div>
                <ReactForm ref="TitleForm" layout={TitleFormLayout} values={TitleFormValues}></ReactForm>
                <SimditorReact ref="SimditorReact" content={content}></SimditorReact>
                <button onClick={this.onSaveNote.bind(this,NoteVO)}> 保存</button>
            </div>
        );
    }

    render() {
        const {NoteVO,user,actions,isEditing} = this.props;
        try {
            console.log('NoteVO,isEditing', NoteVO.get('id'), isEditing);
        } catch (e) {

        }

        if (!isEditing) {
            if (!NoteVO) {
                return <div className="note-blank"></div>
            }
            var pageId = "NoteSingle_" + NoteVO.get('id');
            var content = NoteVO.get('postContent');
            return (
                <div className="article-single">
                    <div>{NoteVO.get('postTitle')}</div>
                    <div dangerouslySetInnerHTML={{__html:content}}></div>
                    <AvatarReact user={user} setCurrentTempUser={actions.setCurrentTempUser}
                                 pageId={pageId}></AvatarReact>
                </div>
            );
        } else {
            return this.renderEditing(NoteVO, user, actions, isEditing);
        }
    }
}

NoteSingle.propTypes = {
    router: React.PropTypes.object,
    routeParams: React.PropTypes.object
};

export default NoteSingle;
