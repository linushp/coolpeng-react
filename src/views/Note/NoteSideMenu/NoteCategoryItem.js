import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import PopupOperation from '../../../components/PopupOperation/PopupOperation';
import Icon from "../../../components/icons/Icon";
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain,uniqueId,isEmpty,EventBus,GlobalEventName,isEventInTarget} from '../../../core/utils/index';
import ReactForm,{getReactFormValue} from '../../../components/form/ReactForm';
import {parsePathParams,isPathParamChanged} from '../NoteFunctions';

var getObjAttrValue = getDataFromImmutableOrPlain;

class NoteCategoryItem extends PureRenderComponent {


    constructor(props) {
        super(props);
        this.editingUniqueId = uniqueId('NoteCategoryItemEditing');
        this.reactFormUniqueId = uniqueId("reactFormUniqueId");
    }


    onSaveCategory(item){
        var callbacks = this.props.callbacks;
        var name = getReactFormValue(this.reactFormUniqueId,'name');
        callbacks.onSaveCategory(item,name);
    }

    onCancelCreateCategory(item){
        var callbacks = this.props.callbacks;
        callbacks.onCancelCreateCategory(item);
    }

    onToggleExpand(){
        var item = this.props.item || {};
        var setCategoryItemExpand = this.props.setCategoryItemExpand;
        var isExpand = this.props.isExpand;
        setCategoryItemExpand(item,!isExpand);
    }

    render() {

        var link1= this.props.toLink;
        var name = this.props.name || '';
        var btns = this.props.btns;
        var item = this.props.item || {};
        var isEditing = getObjAttrValue(item,'isEditing');
        var callbacks = this.props.callbacks;
        var isDeleted = getObjAttrValue(item,'isDeleted');

        if(isDeleted===true){
            return (<div style={{display:'none'}}></div>);
        }

        if(isEditing){
            return (
                <div id={this.editingUniqueId}>
                    <ReactForm id={this.reactFormUniqueId} layout={[{type:'input',name:'name'}]} values={{'name':name}}></ReactForm>
                    <button onClick={this.onSaveCategory.bind(this,item)}>保存</button>
                    <button onClick={this.onCancelCreateCategory.bind(this,item)}>取消</button>
                </div>
            );
        }

        var isExpand = this.props.isExpand;
        var arrowIconStyle = {};
        if(isEmpty(getObjAttrValue(item,'children'))){
            arrowIconStyle['display'] = 'none';
        }

        return (
            <div className="note-menu-item">
                <Icon
                    onClick={this.onToggleExpand.bind(this)}
                    type={`arrow-${isExpand}`}
                    className="menu-item-arrow"
                    style={arrowIconStyle} />
                <Link to={link1}>
                    <Icon type="folder2" className="menu-icon"/>
                    <span className="menu-name">{name}</span>
                </Link>
                <PopupOperation btns={btns}>
                    <Icon type={`arrow`}  className="menu-item-arrow-oper"  />
                </PopupOperation>
            </div>);
    }
}

export default NoteCategoryItem;