import {Link} from 'react-router'
import PureRenderComponent from '../../../core/PureRenderComponent';
import PopupOperation from '../../../components/PopupOperation/PopupOperation';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import {immutableListMap,className,getDataFromImmutableOrPlain} from '../../../core/utils/index';
import ReactForm from '../../../components/form/ReactForm';
import {parsePathParams,getCurrentCategoryByPath,isPathParamChanged} from '../NoteFunctions';
class NoteCategoryItem extends PureRenderComponent {


    constructor(props) {
        super(props);
    }


    componentWillMount() {
        const {actions} = this.props;
    }


    onSaveCategory(item){
        var callbacks = this.props.callbacks;
        var name = this.getReactFormValue('nameForm','name');
        callbacks.onSaveCategory(item,name);
    }

    render() {
        var link1= this.props.toLink;
        var name = this.props.name || '';
        var btns = this.props.btns;
        var item = this.props.item || {};
        var isEditing = getDataFromImmutableOrPlain(item,'isEditing');
        var callbacks = this.props.callbacks;

        if(isEditing){
            return (
                <div>
                    <ReactForm ref="nameForm" layout={[{type:'input',name:'name'}]} values={{'name':name}}></ReactForm>
                    <button onClick={this.onSaveCategory.bind(this,item)}>保存</button>
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