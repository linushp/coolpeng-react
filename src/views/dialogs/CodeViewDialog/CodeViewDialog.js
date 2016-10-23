import Dialog from '../../../components/dialog/Dialog';
import {createUUID,isEmpty,getStaticImages,StringUtils,StaticConfig,uniqueId} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import ReactHighlight from '../../../components/ReactHighlight/ReactHighlight';
import ReactForm,{getReactFormValues,createReactFormUniqueId} from '../../../components/form/ReactForm';
import _ from 'underscore';
import $ from 'jquery';
import './CodeViewDialog.less';



class CodeViewDialog extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {
            codeObj:null
        };
    }
    componentDidMount () {
        var that = this;
        var {actions,msgObj} = that.props;
        var codeEntityId = msgObj.codeEntityId;
        actions.getCloudCodeById({id:codeEntityId},function (a,b) {
            var data = b.data;
            that.setState({codeObj:data});
        });
    }

    render() {
        var that = this;
        var {id,msgObj,actions} = that.props;
        var {codeObj} = that.state;
        return (
            <div id={id} className="CodeViewDialog">
                {
                    codeObj?(
                        <ReactHighlight>{codeObj.content}</ReactHighlight>
                    ):(
                        <div className="Loading">Loading...</div>
                    )}
            </div>
        );
    }

}


export function showCodeViewDialog(msgObj, actions, msgId) {
    var popStyle = {
        width: 650,
        height: 450
    };
    var popClass = "dialogs-CodeViewDialog";
    var id = uniqueId(popClass);
    var buttons = [
        {text: '关闭', name: 'cancel', cls: '', action: 'close'}
    ];


    window.setTimeout(function () {
        //content,callback,title, buttons, popStyle, popClass,closeControl
        Dialog.showModal(<CodeViewDialog id={id} msgObj={msgObj} actions={actions} />, null, msgObj.title, buttons, popStyle, popClass, false);
    }, 0);
}