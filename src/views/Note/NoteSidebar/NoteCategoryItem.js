import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import PopupOperation from '../../../components/PopupOperation/PopupOperation';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain,uniqueId,EventBus,GlobalEventName,isEventInTarget} from '../../../core/utils/index';
import ReactForm from '../../../components/form/ReactForm';
import {parsePathParams,isPathParamChanged} from '../NoteFunctions';

var EVENT_DOCUMENT_CLICK = GlobalEventName.EVENT_DOCUMENT_CLICK;

class NoteCategoryItem extends PureRenderComponent {


    constructor(props) {
        super(props);
        this.editingUniqueId = uniqueId('NoteCategoryItemEditing');
    }


    onSaveCategory(item){
        var callbacks = this.props.callbacks;
        var name = this.getReactFormValue('nameForm','name');
        callbacks.onSaveCategory(item,name);
    }

    onCancelCreateCategory(item){
        var callbacks = this.props.callbacks;
        callbacks.onCancelCreateCategory(item);
    }

    render() {
        var link1= this.props.toLink;
        var name = this.props.name || '';
        var btns = this.props.btns;
        var item = this.props.item || {};
        var isEditing = getDataFromImmutableOrPlain(item,'isEditing');
        var callbacks = this.props.callbacks;
        var isDeleted = getDataFromImmutableOrPlain(item,'isDeleted');

        if(isDeleted===true){
            return (<div style={{display:'none'}}></div>);
        }

        if(isEditing){
            return (
                <div id={this.editingUniqueId}>
                    <ReactForm ref="nameForm" layout={[{type:'input',name:'name'}]} values={{'name':name}}></ReactForm>
                    <button onClick={this.onSaveCategory.bind(this,item)}>保存</button>
                    <button onClick={this.onCancelCreateCategory.bind(this,item)}>取消</button>
                </div>
            );
        }


        return (
            <div>
                <Link to={link1}> {name} </Link>
                <PopupOperation btns={btns}>操作</PopupOperation>
            </div>);
    }
}

export default NoteCategoryItem;