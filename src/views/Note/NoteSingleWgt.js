import PureRenderComponent from '../../core/PureRenderComponent';
import ActionStoreHelper from '../Common/ActionStoreHelper';
import {immutableListMap,className,globalVar} from '../../core/utils/index';
import {toPathParamString} from './NoteFunctions';
import AvatarReact from '../../service/avatar/AvatarReact';
import SimditorReact from '../../service/editor/SimditorReact';
import ReactForm from '../../components/form/ReactForm';
import './index.less';


class NoteSingle extends PureRenderComponent {


    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };


    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    onSaveNote(NoteVO){
        const {actions} = this.props;

        var TitleForm = this.refs['TitleForm'];
        var TitleFormValue = TitleForm.getValues();
        var postTitle = TitleFormValue.postTitle;

        var editor = this.refs['SimditorReact'];

        var content = editor.getContentValue();
        var vo = NoteVO.toJS();
        var that = this;
        vo.postContent = content;
        vo.postTitle = postTitle;
        actions.saveOrUpdateNote({NoteVO:vo},function(){
            alert('保存成功')
            var pathParams = globalVar('pathParams');
            var nn = Object.assign({}, pathParams, {n: vo.id});
            var mm = toPathParamString(nn, ['g', 'm', 'n', 'ps', 'pn']);
            var link = '/note/' + mm;
            that.context.router.push(link);
        });
    }

    renderEditing(NoteVO,user,actions,isEditing){

        var content = "";
        var postTitle = "";
        if(NoteVO){
            content = NoteVO.get('postContent');
            postTitle = NoteVO.get('postTitle');
        }
        console.log('renderEditing')

        var TitleFormLayout = [ { name:'postTitle',text:'标题',type:'input'} ];
        var TitleFormValues = {postTitle:postTitle};

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
            console.log('NoteVO,isEditing',NoteVO.get('id'),isEditing);
        }catch (e){

        }

        if(!isEditing){
            if(!NoteVO){
                return <div className="note-blank"></div>
            }
            var pageId = "NoteSingle_"+ NoteVO.get('id');
            var content = NoteVO.get('postContent');
            return (
                <div className="article-single">
                    <div>{NoteVO.get('postTitle')}</div>
                    <div dangerouslySetInnerHTML={{__html:content}}></div>
                    <AvatarReact user={user} setCurrentTempUser={actions.setCurrentTempUser} pageId={pageId} ></AvatarReact>
                </div>
            );
        }else {
            return this.renderEditing(NoteVO,user,actions,isEditing);
        }
    }
}

NoteSingle.propTypes = {
    router: React.PropTypes.object,
    routeParams: React.PropTypes.object
};

export default NoteSingle;
